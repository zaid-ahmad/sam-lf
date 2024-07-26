"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markLeadAsFunded(id) {
    try {
        await prisma.lead.update({
            where: { id },
            data: { funded: true },
        });
        revalidatePath("/pending-installs");
    } catch (error) {
        console.error("Error marking lead as funded:", error);
        throw error;
    }
}
