"use server";

import prisma from "@/lib/prisma";

export default async function updateLeadInDatabase(id, data) {
    console.log(data);
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
