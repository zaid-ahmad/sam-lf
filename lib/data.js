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

export async function getLead(id) {
    const result = await prisma.lead.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone1: true,
            phone2: true,
            email: true,
            address: true,
            postalCode: true,
            quadrant: true,
            addressNotes: true,
            appointmentDateTime: true,
            homeOwnerType: true,
            age: true,
            date: true,
            timeslot: true,
        },
    });

    return result;
}
