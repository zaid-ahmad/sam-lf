"use server";

import prisma from "@/lib/prisma";

export default async function updateLeadInDatabase(id, data) {
    console.log(data);
    const cleanedData = Object.fromEntries(
        Object.entries(data)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value === "" ? null : value])
    );
    console.log(cleanedData);
    await prisma.lead.update({
        where: {
            id: id,
        },
        data: cleanedData,
    });
    return {
        success: true,
    };
}
