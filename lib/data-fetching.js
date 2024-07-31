"use server";

import prisma from "@/lib/prisma";
import { getStartEndDateWithOffset } from "./utils";

export async function getAdminData(session, date) {
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            branchCode: true,
            firstName: true,
        },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: user.branchCode,
            appointmentDateTime: {
                startsWith: date,
            },
        },
        orderBy: {
            createdAt: "desc",
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

export async function getSuperAdminData(session, branch, date) {
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            firstName: true,
        },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: branch,
            appointmentDateTime: {
                startsWith: date,
            },
        },
        orderBy: {
            createdAt: "desc",
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
    const user = await prisma.user.findUnique({
        where: { email: session.user.email, role: "SALES_REP" },
    });

    const result = await prisma.lead.findMany({
        where: {
            salesRepId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
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

export async function getCanvasserData(session, date) {
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            firstName: true,
        },
    });

    const result = await prisma.lead.findMany({
        where: {
            canvasserId: session.user.id,
            appointmentDateTime: {
                startsWith: date,
            },
        },
        orderBy: {
            createdAt: "desc",
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

export async function adminDashboardData(branch, date) {
    const totalLeads = await prisma.lead.count({
        where: {
            branch: branch,
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const totalAssignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "ASSIGNED",
            },
            branch: branch,
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const totalUnassignedLeads = await prisma.lead.count({
        where: {
            status: {
                equals: "APPOINTMENT",
            },
            branch: branch,
            appointmentDateTime: {
                startsWith: date,
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
                    startsWith: date,
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

export async function superAdminDashboardData(branch, date) {
    const superAdminTotalLeads = await prisma.lead.count({
        where: {
            branch: branch,
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const superAdminTotalAssignedLeads = await prisma.lead.count({
        where: {
            branch: branch,
            status: {
                equals: "ASSIGNED",
            },
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const superAdminTotalUnassignedLeads = await prisma.lead.count({
        where: {
            branch: branch,
            status: {
                equals: "APPOINTMENT",
            },
            appointmentDateTime: {
                startsWith: date,
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
                    startsWith: date,
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
    const totalSaleRepLeads = await prisma.lead.count({
        where: {
            salesRepId: user_id,
        },
    });

    const totalDemoRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "DEMO",
            },
        },
    });

    const totalDeadRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "DEAD",
            },
        },
    });

    const totalSaleRep = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            status: {
                equals: "SALE",
            },
        },
    });

    return { totalSaleRepLeads, totalDemoRep, totalDeadRep, totalSaleRep };
}

export async function canvasserDashboardData(user_id, date) {
    const totalCanvasserLeads = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const totalDemo = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "DEMO",
            },
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const totalDead = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "DEAD",
            },
            appointmentDateTime: {
                startsWith: date,
            },
        },
    });

    const totalSale = await prisma.lead.count({
        where: {
            canvasserId: user_id,
            status: {
                equals: "SALE",
            },
            appointmentDateTime: {
                startsWith: date,
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
