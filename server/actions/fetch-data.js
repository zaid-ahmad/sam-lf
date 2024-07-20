import prisma from "@/lib/prisma";

export async function getSalesRepresentatives() {
    const result = await prisma.user.findMany({
        where: {
            role: "SALES_REP",
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
        },
    });

    return result;
}
