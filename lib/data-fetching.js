"use server";

import prisma from "@/lib/prisma";
import { formatTimeto12Hour } from "./utils";

export async function getAdminData(session, date) {
    const [user, leads] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { branchCode: true, firstName: true },
        }),
        prisma.lead.findMany({
            where: {
                branch: session.user.branchCode,
                appointmentDateTime: { startsWith: date },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                canvasser: { select: { firstName: true, lastName: true } },
                salesRep: { select: { firstName: true, lastName: true } },
                status: true,
                quadrant: true,
                appointmentDateTime: true,
                createdAt: true,
            },
        }),
    ]);

    const transformedData = leads.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
        customerName: `${lead.firstName} ${lead.lastName}`.trim(),
    }));

    const sortedData = transformedData.sort((a, b) =>
        a.status.toLowerCase() === "appointment"
            ? -1
            : b.status.toLowerCase() === "appointment"
            ? 1
            : 0
    );

    return { data: sortedData, name: user.firstName, branch: user.branchCode };
}

export async function getSuperAdminData(session, branch, date) {
    const [user, leads] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true },
        }),
        prisma.lead.findMany({
            where: {
                branch: branch,
                appointmentDateTime: { startsWith: date },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                canvasser: { select: { firstName: true, lastName: true } },
                salesRep: { select: { firstName: true, lastName: true } },
                status: true,
                quadrant: true,
                appointmentDateTime: true,
                createdAt: true,
            },
        }),
    ]);

    const transformedData = leads.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
        customerName: `${lead.firstName} ${lead.lastName}`.trim(),
    }));

    const sortedData = transformedData.sort((a, b) =>
        a.status.toLowerCase() === "appointment"
            ? -1
            : b.status.toLowerCase() === "appointment"
            ? 1
            : 0
    );

    return { superAdminData: sortedData, superAdminName: user.firstName };
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
    const [
        totalLeads,
        totalAssignedLeads,
        totalUnassignedLeads,
        slotTemplates,
    ] = await Promise.all([
        prisma.lead.count({
            where: { branch, appointmentDateTime: { startsWith: date } },
        }),
        prisma.lead.count({
            where: {
                branch,
                status: "ASSIGNED",
                appointmentDateTime: { startsWith: date },
            },
        }),
        prisma.lead.count({
            where: {
                branch,
                status: "APPOINTMENT",
                appointmentDateTime: { startsWith: date },
            },
        }),
        prisma.slotTemplate.findMany({
            where: { branchCode: branch },
            orderBy: { timeSlot: "asc" },
            select: { timeSlot: true, limit: true },
        }),
    ]);

    const leadsPerTimeSlot = await Promise.all(
        slotTemplates.map(async (slot) => {
            const count = await prisma.lead.count({
                where: {
                    branch,
                    appointmentDateTime: {
                        contains: formatTimeto12Hour(slot.timeSlot),
                        startsWith: date,
                    },
                },
            });
            return { [slot.timeSlot]: { count, limit: slot.limit } };
        })
    );

    return {
        totalLeads,
        totalAssignedLeads,
        totalUnassignedLeads,
        leadsPerTimeSlot: Object.assign({}, ...leadsPerTimeSlot),
        slotTemplates,
    };
}

export async function superAdminDashboardData(branch, date) {
    const [
        superAdminTotalLeads,
        superAdminTotalAssignedLeads,
        superAdminTotalUnassignedLeads,
        superAdminSlotTemplates,
        allLeadsCounts,
    ] = await Promise.all([
        prisma.lead.count({
            where: { branch, appointmentDateTime: { startsWith: date } },
        }),
        prisma.lead.count({
            where: {
                branch,
                status: "ASSIGNED",
                appointmentDateTime: { startsWith: date },
            },
        }),
        prisma.lead.count({
            where: {
                branch,
                status: "APPOINTMENT",
                appointmentDateTime: { startsWith: date },
            },
        }),
        prisma.slotTemplate.findMany({
            where: { branchCode: branch },
            orderBy: { timeSlot: "asc" },
            select: { timeSlot: true, limit: true },
        }),
        prisma.lead.groupBy({
            by: ["appointmentDateTime"],
            where: { branch, appointmentDateTime: { startsWith: date } },
            _count: true,
        }),
    ]);

    const superAdminLeadsPerTimeSlot = superAdminSlotTemplates.reduce(
        (acc, slot) => {
            const formattedTimeSlot = formatTimeto12Hour(slot.timeSlot);
            const count =
                allLeadsCounts.find((c) =>
                    c.appointmentDateTime.includes(formattedTimeSlot)
                )?._count || 0;
            acc[slot.timeSlot] = { count, limit: slot.limit };
            return acc;
        },
        {}
    );

    return {
        superAdminTotalLeads,
        superAdminTotalAssignedLeads,
        superAdminTotalUnassignedLeads,
        superAdminLeadsPerTimeSlot,
        superAdminSlotTemplates,
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
