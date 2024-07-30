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

export async function assignLeadToSalesRep(leadId, newSalesRepId) {
    try {
        // Fetch the lead with its current sales rep
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                salesRep: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!lead) {
            throw new Error("Lead not found");
        }

        // Verify that the new sales rep exists and has the correct role
        const newSalesRep = await prisma.user.findUnique({
            where: { id: newSalesRepId, role: "SALES_REP" },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        if (!newSalesRep) {
            throw new Error("Invalid sales representative");
        }

        // Check if this is a reassignment
        if (lead.salesRepId && lead.salesRepId !== newSalesRepId) {
            // Notify the previous sales rep
            await notifyPreviousSalesRep(
                lead.salesRep.email,
                `${lead.salesRep.firstName} ${lead.salesRep.lastName}`
            );
        }

        // Update the lead with the new sales rep
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                salesRepId: newSalesRepId,
                status:
                    lead.status === "APPOINTMENT" ? "ASSIGNED" : lead.status,
            },
            include: {
                salesRep: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        // Send email to the new sales rep
        await sendEmail(
            newSalesRep.email,
            `${newSalesRep.firstName} ${newSalesRep.lastName}`,
            `${updatedLead.firstName} ${updatedLead.lastName}`,
            updatedLead.phone1,
            updatedLead.address,
            updatedLead.quadrant,
            updatedLead.id
        );

        revalidatePath("/dashboard");
        return updatedLead;
    } catch (error) {
        console.error("Error assigning lead to sales rep:", error);
        throw error;
    }
}
