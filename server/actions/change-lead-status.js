"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFile } from "./s3";

export async function changeLeadStatus(leadId, action, formData) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            throw new Error("Lead not found");
        }

        let updateData = {
            status: action,
        };

        // Remove fields that are not relevant to the new status
        if (lead.status !== action) {
            updateData.reason = null;
            updateData.DNSFile = null;
            updateData.jobNumber = null;
            updateData.amount = null;
            updateData.installationDate = null;

            if (lead.DNSFile) {
                await deleteFile(lead.DNSFile);
            }
        }

        // Add new fields based on the new status
        switch (action) {
            case "DEAD":
                updateData.reason = formData.reason;
                break;
            case "DEMO":
                updateData.DNSFile = formData;
                break;
            case "SALE":
                updateData.jobNumber = formData.jobNumber;
                updateData.amount = formData.salePrice;
                updateData.installationDate = formData.installationDate;
                break;
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                status: true,
                reason: true,
                DNSFile: true,
                jobNumber: true,
                amount: true,
                installationDate: true,
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
        console.error("Error changing lead status:", error);
        throw error;
    }
}
