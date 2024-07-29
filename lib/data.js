import prisma from "@/lib/prisma";

export async function getSalesRepresentatives(branch) {
    const result = await prisma.user.findMany({
        where: {
            role: "SALES_REP",
            branchCode: branch,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
        },
    });

    return result;
}

export async function getBranches() {
    const result = await prisma.branch.findMany({
        select: {
            code: true,
            name: true,
        },
    });

    return result;
}
