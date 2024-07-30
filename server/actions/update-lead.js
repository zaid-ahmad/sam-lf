"use server";

import prisma from "@/lib/prisma";

export default async function updateLeadInDatabase(id, data) {
    await prisma.lead.update({
        where: {
            id: id,
        },
        data,
    });
    return {
        success: true,
    };
}
