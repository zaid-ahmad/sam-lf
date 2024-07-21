"use server";

import prisma from "@/lib/prisma";

export async function markLeadAsFunded(id) {
    try {
        await prisma.lead.update({
            where: { id },
            data: { funded: true },
        });
    } catch (error) {
        console.error("Error marking lead as funded:", error);
        throw error;
    }
}
