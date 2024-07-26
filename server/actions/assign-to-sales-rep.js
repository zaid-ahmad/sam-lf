"use server";

import EmailToReps from "@/emails/EmailToReps";
import prisma from "@/lib/prisma-edge";
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
        from: "SAM 2.0 <noreply@zaidahmad.com>",
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
        // First, verify that the lead exists and is not already assigned
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            select: { id: true, salesRepId: true, status: true },
        });

        if (!lead) {
            throw new Error("Lead not found");
        }

        if (lead.salesRepId) {
            throw new Error(
                "Lead is already assigned to a sales representative"
            );
        }

        // Verify that the sales rep exists and has the correct role
        const salesRep = await prisma.user.findUnique({
            where: { id: salesRepId, role: "SALES_REP" },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        if (!salesRep) {
            throw new Error("Invalid sales representative");
        }

        // Update the lead with the new sales rep and change status if necessary
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                salesRepId: salesRepId,
                status:
                    lead.status === "APPOINTMENT" ? "ASSIGNED" : lead.status,
            },
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
            throw new Error("Failed to send email");
        }

        revalidatePath("/dashboard");
        return updatedLead;
    } catch (error) {
        console.error("Error assigning lead to sales rep:", error);
        throw error;
    }
}
