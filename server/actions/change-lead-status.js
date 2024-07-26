"use server";

import prisma from "@/lib/prisma-edge";
import { revalidatePath } from "next/cache";

export async function changeLeadStatus(leadId, action, formData) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            throw new Error("Lead not found");
        }

        if (action === "DEAD") {
            const { reason } = formData;
            const updatedLead = await prisma.lead.update({
                where: { id: leadId },
                data: {
                    status: action,
                    reason: reason,
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
        } else if (action === "DEMO") {
            const updatedLead = await prisma.lead.update({
                where: { id: leadId },
                data: {
                    status: action,
                    DNSFile: formData,
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
        } else if (action === "SALE") {
            const { jobNumber, salePrice, installationDate } = formData;
            const updatedLead = await prisma.lead.update({
                where: { id: leadId },
                data: {
                    status: action,
                    jobNumber: jobNumber,
                    amount: salePrice,
                    installationDate: installationDate,
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
        }
    } catch (error) {
        console.error("Error assigning lead to sales rep:", error);
        throw error;
    }
}
