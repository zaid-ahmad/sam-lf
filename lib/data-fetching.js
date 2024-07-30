"use server";

import prisma from "@/lib/prisma";

export async function getAdminData(session) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: user.branchCode,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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

    const sortedData = transformedData.sort((a, b) => {
        // Check if status is "appointment"
        const aIsAppointment = a.status.toLowerCase() === "appointment";
        const bIsAppointment = b.status.toLowerCase() === "appointment";

        if (aIsAppointment && !bIsAppointment) return -1;
        if (!aIsAppointment && bIsAppointment) return 1;
        return 0;
    });

    return {
        data: sortedData,
        name: user.firstName,
        branch: user.branchCode,
    };
}

export async function getSuperAdminData(session, branch) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: branch,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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

    const sortedData = transformedData.sort((a, b) => {
        // Check if status is "appointment"
        const aIsAppointment = a.status.toLowerCase() === "appointment";
        const bIsAppointment = b.status.toLowerCase() === "appointment";

        if (aIsAppointment && !bIsAppointment) return -1;
        if (!aIsAppointment && bIsAppointment) return 1;
        return 0;
    });

    return {
        superAdminData: sortedData,
        superAdminName: user.firstName,
    };
}

export async function getSalesRepData(session) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );
    const user = await prisma.user.findUnique({
        where: { email: session.user.email, role: "SALES_REP" },
    });

    const result = await prisma.lead.findMany({
        where: {
            salesRepId: session.user.id,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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

    const sortedData = transformedData.sort((a, b) => {
        // Check if status is "appointment"
        const aIsAppointment = a.status.toLowerCase() === "appointment";
        const bIsAppointment = b.status.toLowerCase() === "appointment";

        if (aIsAppointment && !bIsAppointment) return -1;
        if (!aIsAppointment && bIsAppointment) return 1;
        return 0;
    });

    return {
        saleRepData: sortedData,
        saleRepFirstName: user.firstName,
        id: user.id,
    };
}

export async function getCanvasserData(session) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const user = await prisma.user.findUnique({
        where: { email: session.user.email, role: "CANVASSER" },
    });

    const result = await prisma.lead.findMany({
        where: {
            canvasserId: session.user.id,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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

    const sortedData = transformedData.sort((a, b) => {
        // Check if status is "appointment"
        const aIsAppointment = a.status.toLowerCase() === "appointment";
        const bIsAppointment = b.status.toLowerCase() === "appointment";

        if (aIsAppointment && !bIsAppointment) return -1;
        if (!aIsAppointment && bIsAppointment) return 1;
        return 0;
    });

    return {
        canvasserData: sortedData,
        canvasserFirstName: user.firstName,
        id: user.id,
    };
}

export async function adminDashboardData(branch) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const totalLeads = await prisma.lead.count({
        where: {
            branch: branch,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    const totalAssignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "ASSIGNED",
            },
            branch: branch,
            createdAt: {
                gte: today,
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
            },
        },
    });

    const totalUnassignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "APPOINTMENT",
            },
            branch: branch,
            createdAt: {
                gte: today,
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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

export async function superAdminDashboardData(branch) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const superAdminTotalLeads = await prisma.lead.count({
        where: {
            branch: branch,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    const superAdminTotalAssignedLeads = await prisma.lead.count({
        where: {
            branch: branch,
            status: {
                equals: "ASSIGNED",
            },
            createdAt: {
                gte: today,
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
            },
        },
    });

    const superAdminTotalUnassignedLeads = await prisma.lead.count({
        where: {
            branch: branch,
            status: {
                equals: "APPOINTMENT",
            },
            createdAt: {
                gte: today,
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
    const superAdminLeadsPerTimeSlot = {};

    for (const slot of timeSlots) {
        const count = await prisma.lead.count({
            where: {
                branch: branch,
                appointmentDateTime: {
                    contains: slot,
                },
                createdAt: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
                },
            },
        });
        superAdminLeadsPerTimeSlot[slot] = count;
    }

    return {
        superAdminTotalLeads,
        superAdminTotalAssignedLeads,
        superAdminTotalUnassignedLeads,
        superAdminLeadsPerTimeSlot,
    };
}

export async function salesRepDashboardData(user_id) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const totalSaleRepLeads = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
            },
        },
    });

    return { totalSaleRepLeads, totalDemoRep, totalDeadRep, totalSaleRep };
}

export async function canvasserDashboardData(user_id) {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    const totalCanvasserLeads = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to today
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
