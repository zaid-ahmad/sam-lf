"use server";

import prisma from "@/lib/prisma";
import { getTodayAndTomorrow } from "@/lib/utils";

export async function getAdminData(session) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: user.branchCode,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
        select: {
            id: true,
            homeOwnerType: true,
            address: true,
            canvasser: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            salesRep: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            status: true,
            quadrant: true,
            appointmentDateTime: true,
        },
    });

    // Transform the result to flatten canvasser and salesRep
    const transformedData = result.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return {
        data: transformedData,
        name: user.firstName,
        branch: user.branchCode,
    };
}

export async function getSalesRepData(session) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email, role: "SALES_REP" },
    });

    const result = await prisma.lead.findMany({
        where: {
            salesRepId: session.user.id,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
        select: {
            id: true,
            homeOwnerType: true,
            address: true,
            canvasser: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            salesRep: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            status: true,
            quadrant: true,
            appointmentDateTime: true,
        },
    });

    // Transform the result to flatten canvasser and salesRep
    const transformedData = result.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return {
        saleRepData: transformedData,
        saleRepFirstName: user.firstName,
        id: user.id,
    };
}

export async function getCanvasserData(session) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email, role: "CANVASSER" },
    });

    const result = await prisma.lead.findMany({
        where: {
            canvasserId: session.user.id,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
        select: {
            id: true,
            homeOwnerType: true,
            address: true,
            canvasser: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            salesRep: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            status: true,
            quadrant: true,
            appointmentDateTime: true,
        },
    });

    // Transform the result to flatten canvasser and salesRep
    const transformedData = result.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return {
        canvasserData: transformedData,
        canvasserFirstName: user.firstName,
        id: user.id,
    };
}

export async function adminDashboardData(branch) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const totalLeads = await prisma.lead.count({
        where: {
            branch: branch,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalAssignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "ASSIGNED",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalUnassignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "APPOINTMENT",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const timeSlots = [
        "11:00 AM",
        "01:00 PM",
        "03:00 PM",
        "05:00 PM",
        "07:00 PM",
    ];
    const leadsPerTimeSlot = {};

    for (const slot of timeSlots) {
        const count = await prisma.lead.count({
            where: {
                branch: branch,
                appointmentDateTime: {
                    contains: slot,
                },
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        leadsPerTimeSlot[slot] = count;
    }

    return {
        totalLeads,
        totalAssignedLeads,
        totalUnassignedLeads,
        leadsPerTimeSlot,
    };
}

export async function salesRepDashboardData(user_id) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const totalSaleRepLeads = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalDemoRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "DEMO",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalDeadRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "DEAD",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalSaleRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "SALE",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return { totalSaleRepLeads, totalDemoRep, totalDeadRep, totalSaleRep };
}

export async function canvasserDashboardData(user_id) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const totalCanvasserLeads = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalDemo = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "DEMO",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalDead = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "DEAD",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalSale = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "SALE",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return { totalCanvasserLeads, totalDemo, totalDead, totalSale };
}

export async function getAllCanvasserNames(branch) {
    const canvassers = await prisma.user.findMany({
        where: {
            role: "CANVASSER",
            branchCode: branch,
        },
        select: {
            firstName: true,
            lastName: true,
        },
    });

    return canvassers.map((canvasser) =>
        `${canvasser.firstName} ${canvasser.lastName}`.trim()
    );
}
