"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markPaid(id) {
    try {
        await prisma.lead.update({
            where: { id },
            data: { commissionPaid: true },
        });
        revalidatePath("/pending-installs");
    } catch (error) {
        console.error("Error marking lead as commission paid:", error);
        throw error;
    }
}
