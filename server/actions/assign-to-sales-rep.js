"use server";

import EmailToReps from "@/emails/EmailToReps";
import ReassignmentEmail from "@/emails/ReassignmentEmail";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { revalidatePath } from "next/cache";

async function sendEmail(
    saleRepEmail,
    saleRepName,
    customerName,
    customerPhone,
    customerAddress,
    customerQuadrant,
    leadId
) {
    const data = await resend.emails.send({
        from: "SAM 2.0 <noreply@leadflowmanager.com>",
        to: saleRepEmail,
        subject: "A new lead has been assigned to you",
        react: EmailToReps({
            saleRepEmail,
            saleRepName,
            customerName,
            customerPhone,
            customerAddress,
            customerQuadrant,
            leadId,
        }),
    });

    return {
        success: true,
        data: data,
    };
}

export async function assignLeadToSalesRep(leadId, salesRepId) {
    try {
        // First, verify that the lead exists
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            select: { id: true, salesRepId: true, status: true },
        });

        if (!lead) {
            throw new Error("Lead not found");
        }

        // Verify that the new sales rep exists and has the correct role
        const salesRep = await prisma.user.findUnique({
            where: { id: salesRepId, role: "SALES_REP" },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        if (!salesRep) {
            throw new Error("Invalid sales representative");
        }

        // Prepare the update data
        const updateData = {
            salesRep: {
                connect: { id: salesRepId },
            },
            status: lead.status === "APPOINTMENT" ? "ASSIGNED" : lead.status,
        };

        // If there's a previous sales rep, remove their association
        if (lead.salesRepId && lead.salesRepId !== salesRepId) {
            updateData.previousSalesRepId = lead.salesRepId;
            updateData.salesRep = {
                ...updateData.salesRep,
                disconnect: true,
                connect: { id: salesRepId },
            };
        }

        // Update the lead with the new sales rep and change status if necessary
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone1: true,
                address: true,
                quadrant: true,
                status: true,
                salesRep: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Send email to the new sales rep
        const isEmailSent = await sendEmail(
            salesRep.email,
            salesRep.firstName + " " + salesRep.lastName,
            updatedLead.firstName + " " + updatedLead.lastName,
            updatedLead.phone1,
            updatedLead.address,
            updatedLead.quadrant,
            updatedLead.id
        );

        if (!isEmailSent) {
            throw new Error("Failed to send email to new sales rep");
        }

        // If there was a previous sales rep, notify them about the reassignment
        if (updatedLead.previousSalesRep) {
            const isPreviousRepNotified = await notifyPreviousSalesRep(
                updatedLead.previousSalesRep.email,
                updatedLead.previousSalesRep.firstName +
                    " " +
                    updatedLead.previousSalesRep.lastName,
                updatedLead.firstName + " " + updatedLead.lastName,
                updatedLead.id
            );

            if (!isPreviousRepNotified) {
                console.warn(
                    "Failed to notify previous sales rep about reassignment"
                );
            }
        }

        revalidatePath("/dashboard");
        return updatedLead;
    } catch (error) {
        console.error("Error assigning lead to sales rep:", error);
        throw error;
    }
}

// New function to notify the previous sales rep
async function notifyPreviousSalesRep(saleRepEmail, salesRepName) {
    await resend.emails.send({
        from: "SAM 2.0 <noreply@leadflowmanager.com>",
        to: saleRepEmail,
        subject: "This Lead Has Been Reassigned",
        react: ReassignmentEmail({
            salesRepName,
        }),
    });

    return true;
}
