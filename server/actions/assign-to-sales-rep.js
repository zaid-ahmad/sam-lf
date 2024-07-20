"use server";

import prisma from "@/lib/prisma-edge";
import { revalidatePath } from "next/cache";

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
            select: { id: true },
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

        revalidatePath("/dashboard");
        return updatedLead;
    } catch (error) {
        console.error("Error assigning lead to sales rep:", error);
        throw error;
    }
}
