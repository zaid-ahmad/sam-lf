"use server";

import prisma from "@/lib/prisma";
import { displayTodaysDate } from "@/lib/utils";
import moment from "moment";
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
    const [user, leads] = await Promise.all([
        prisma.user.findUnique({
            where: { email: session.user.email, role: "SALES_REP" },
            select: { firstName: true, id: true },
        }),
        prisma.lead.findMany({
            where: { salesRepId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                status: true,
                quadrant: true,
                appointmentDateTime: true,
                createdAt: true,
                canvasser: { select: { firstName: true, lastName: true } },
                salesRep: { select: { firstName: true, lastName: true } },
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

    transformedData.sort((a, b) =>
        a.status.toLowerCase() === "appointment"
            ? -1
            : b.status.toLowerCase() === "appointment"
            ? 1
            : 0
    );

    return {
        saleRepData: transformedData,
        saleRepFirstName: user.firstName,
        id: user.id,
    };
}

export async function getCanvasserData(session, date) {
    const [user, leads] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true, id: true },
        }),
        prisma.lead.findMany({
            where: {
                canvasserId: session.user.id,
                appointmentDateTime: { startsWith: date },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                address: true,
                status: true,
                quadrant: true,
                appointmentDateTime: true,
                canvasser: { select: { firstName: true, lastName: true } },
                salesRep: { select: { firstName: true, lastName: true } },
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

    transformedData.sort((a, b) =>
        a.status.toLowerCase() === "appointment"
            ? -1
            : b.status.toLowerCase() === "appointment"
            ? 1
            : 0
    );

    return {
        canvasserData: transformedData,
        canvasserFirstName: user.firstName,
        id: user.id,
    };
}

export async function adminDashboardData(branch, date) {
    const [leadCounts, slotTemplates] = await Promise.all([
        prisma.lead.groupBy({
            by: ["status"],
            where: { branch, appointmentDateTime: { startsWith: date } },
            _count: true,
        }),
        prisma.slotTemplate.findMany({
            where: { branchCode: branch },
            orderBy: { timeSlot: "asc" },
            select: { timeSlot: true, limit: true },
        }),
    ]);

    const results = {
        totalLeads: 0,
        totalAssignedLeads: 0,
        totalUnassignedLeads: 0,
    };

    leadCounts.forEach((count) => {
        results.totalLeads += count._count;
        if (count.status === "ASSIGNED")
            results.totalAssignedLeads = count._count;
        if (count.status === "APPOINTMENT")
            results.totalUnassignedLeads = count._count;
    });

    const leadsPerTimeSlot = await prisma.lead.groupBy({
        by: ["appointmentDateTime"],
        where: { branch, appointmentDateTime: { startsWith: date } },
        _count: true,
    });

    const formattedLeadsPerTimeSlot = slotTemplates.reduce((acc, slot) => {
        const formattedTimeSlot = formatTimeto12Hour(slot.timeSlot);
        const count =
            leadsPerTimeSlot.find((c) =>
                c.appointmentDateTime.includes(formattedTimeSlot)
            )?._count || 0;
        acc[slot.timeSlot] = { count, limit: slot.limit };
        return acc;
    }, {});

    return {
        ...results,
        leadsPerTimeSlot: formattedLeadsPerTimeSlot,
        slotTemplates,
    };
}

export async function superAdminDashboardData(branch, date) {
    const [leadCounts, superAdminSlotTemplates] = await Promise.all([
        prisma.lead.groupBy({
            by: ["status", "appointmentDateTime"],
            where: { branch, appointmentDateTime: { startsWith: date } },
            _count: true,
        }),
        prisma.slotTemplate.findMany({
            where: { branchCode: branch },
            orderBy: { timeSlot: "asc" },
            select: { timeSlot: true, limit: true },
        }),
    ]);

    const results = {
        superAdminTotalLeads: 0,
        superAdminTotalAssignedLeads: 0,
        superAdminTotalUnassignedLeads: 0,
    };

    const leadsPerTimeSlot = {};

    leadCounts.forEach((count) => {
        results.superAdminTotalLeads += count._count;
        if (count.status === "ASSIGNED")
            results.superAdminTotalAssignedLeads += count._count;
        if (count.status === "APPOINTMENT")
            results.superAdminTotalUnassignedLeads += count._count;

        const timeSlot = count.appointmentDateTime.split(" at ")[1];
        if (timeSlot) {
            leadsPerTimeSlot[timeSlot] =
                (leadsPerTimeSlot[timeSlot] || 0) + count._count;
        }
    });

    const superAdminLeadsPerTimeSlot = superAdminSlotTemplates.reduce(
        (acc, slot) => {
            const formattedTimeSlot = formatTimeto12Hour(slot.timeSlot);
            acc[slot.timeSlot] = {
                count: leadsPerTimeSlot[formattedTimeSlot] || 0,
                limit: slot.limit,
            };
            return acc;
        },
        {}
    );

    return {
        ...results,
        superAdminLeadsPerTimeSlot,
        superAdminSlotTemplates,
    };
}
export async function salesRepDashboardData(user_id) {
    const leadCounts = await prisma.lead.groupBy({
        by: ["status"],
        where: { salesRepId: user_id },
        _count: true,
    });

    const results = {
        totalSaleRepLeads: 0,
        totalDemoRep: 0,
        totalDeadRep: 0,
        totalSaleRep: 0,
    };

    leadCounts.forEach((count) => {
        results.totalSaleRepLeads += count._count;
        switch (count.status) {
            case "DEMO":
                results.totalDemoRep = count._count;
                break;
            case "DEAD":
                results.totalDeadRep = count._count;
                break;
            case "SALE":
                results.totalSaleRep = count._count;
                break;
        }
    });

    return results;
}

export async function canvasserDashboardData(user_id, date) {
    const leadCounts = await prisma.lead.groupBy({
        by: ["status"],
        where: {
            canvasserId: user_id,
            appointmentDateTime: { startsWith: date },
        },
        _count: true,
    });

    const results = {
        totalCanvasserLeads: 0,
        totalDemo: 0,
        totalDead: 0,
        totalSale: 0,
    };

    leadCounts.forEach((count) => {
        results.totalCanvasserLeads += count._count;
        switch (count.status) {
            case "DEMO":
                results.totalDemo = count._count;
                break;
            case "DEAD":
                results.totalDead = count._count;
                break;
            case "SALE":
                results.totalSale = count._count;
                break;
        }
    });

    return results;
}

export async function getAllCanvasserNames(branch = null) {
    const whereClause = {
        role: "CANVASSER",
        ...(branch && { branchCode: branch }),
    };
    const canvassers = await prisma.user.findMany({
        where: whereClause,
        select: { firstName: true, lastName: true },
    });

    return canvassers.map((c) => `${c.firstName} ${c.lastName}`.trim());
}

export async function getPastLeads(session, branch = null) {
    let branchCode;
    let whereClause = {};

    if (session.user.role === "SUPERADMIN") {
        branchCode = branch;
        if (!branchCode) {
            throw new Error("No branch specified for superadmin");
        }
        whereClause.branch = branchCode;
    } else if (session.user.role === "ADMIN") {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { branchCode: true },
        });
        branchCode = user.branchCode;
        whereClause.branch = branchCode;
    } else if (session.user.role === "CANVASSER") {
        whereClause.canvasserId = session.user.id;
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { branchCode: true },
        });
        branchCode = user.branchCode;
    }

    const todaysDate = displayTodaysDate(branchCode);
    const currentDate = moment(todaysDate, "MMMM Do, YYYY");

    const data = await prisma.lead.findMany({
        where: whereClause,
        orderBy: { createdAt: "asc" },
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
            branch: true,
            createdAt: true,
        },
    });

    const pastLeads = data.filter((lead) =>
        moment(lead.appointmentDateTime, "MMMM Do, YYYY").isBefore(currentDate)
    );

    const transformedData = pastLeads.map((lead) => ({
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

    return { data: transformedData, branch: branchCode };
}

export async function getPastLeadsForAllBranches() {
    // Fetch all leads
    const data = await prisma.lead.findMany({
        orderBy: { createdAt: "asc" },
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
            branch: true,
            createdAt: true,
        },
    });

    // Get unique branch codes
    const branchCodes = [...new Set(data.map((lead) => lead.branch))];

    // Create a map of branch codes to their current dates
    const branchCurrentDates = branchCodes.reduce((acc, branchCode) => {
        acc[branchCode] = moment(
            displayTodaysDate(branchCode),
            "MMMM Do, YYYY"
        );
        return acc;
    }, {});

    // Filter past leads considering each branch's current date
    const pastLeads = data.filter((lead) => {
        const leadDate = moment(lead.appointmentDateTime, "MMMM Do, YYYY");
        const branchCurrentDate = branchCurrentDates[lead.branch];
        return leadDate.isBefore(branchCurrentDate);
    });

    // Transform the data
    const transformedData = pastLeads.map((lead) => ({
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

    return transformedData;
}
