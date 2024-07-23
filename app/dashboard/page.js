import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import SalesRepDashboard from "@/components/salesrep-dashboard/salesrep-dashboard";
import CanvasserDashboard from "@/components/canvasser-dashboard/canvasser-dashboard";
import AdminDashboard from "@/components/admin-dashboard/admin-dashboard";

import { extractFirstName, getTodayAndTomorrow } from "@/lib/utils";
import { getSalesRepresentatives } from "@/lib/data";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import { changeLeadStatus } from "@/server/actions/change-lead-status";

async function getAdminData(session) {
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

async function getSalesRepData(session) {
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

    return { data: transformedData, name: user.firstName, id: user.id };
}

async function getCanvasserData(session) {
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

    return { data: transformedData, name: user.firstName, id: user.id };
}

async function adminDashboardData(branch) {
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

    console.log(leadsPerTimeSlot);

    return {
        totalLeads,
        totalAssignedLeads,
        totalUnassignedLeads,
        leadsPerTimeSlot,
    };
}

async function salesRepDashboardData(user_id) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const totalLeads = await prisma.lead.count({
        where: {
            salesRepId: user_id,
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    const totalDemo = await prisma.lead.count({
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

    const totalDead = await prisma.lead.count({
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

    const totalSale = await prisma.lead.count({
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

    return { totalLeads, totalDemo, totalDead, totalSale };
}

async function canvasserDashboardData(user_id) {
    const { today, tomorrow } = getTodayAndTomorrow();

    const totalLeads = await prisma.lead.count({
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

    return { totalLeads, totalDemo, totalDead, totalSale };
}

async function getAllCanvasserNames(branch) {
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

const Dashboard = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role === "ADMIN") {
        const { data, name, branch } = await getAdminData(session);
        const sale_reps = await getSalesRepresentatives();
        const {
            totalLeads,
            totalAssignedLeads,
            totalUnassignedLeads,
            leadsPerTimeSlot,
        } = await adminDashboardData(branch);

        const listOfCanvassers = await getAllCanvasserNames(branch);

        return (
            <AdminDashboard
                name={name}
                data={data}
                sale_reps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
                totalLeads={totalLeads}
                totalAssignedLeads={totalAssignedLeads}
                totalUnassignedLeads={totalUnassignedLeads}
                listOfCanvassers={listOfCanvassers}
                slots_11={leadsPerTimeSlot["11:00 AM"]}
                slots_01={leadsPerTimeSlot["01:00 PM"]}
                slots_03={leadsPerTimeSlot["03:00 PM"]}
                slots_05={leadsPerTimeSlot["05:00 PM"]}
                slots_07={leadsPerTimeSlot["07:00 PM"]}
            />
        );
    } else if (role === "CANVASSER") {
        const { data, name } = await getCanvasserData(session);
        const { totalLeads, totalDemo, totalDead, totalSale } =
            await canvasserDashboardData(session.user.id);

        return (
            <CanvasserDashboard
                name={name}
                data={data}
                totalLeads={totalLeads}
                totalDemo={totalDemo}
                totalDead={totalDead}
                totalSale={totalSale}
            />
        );
    } else if (role === "SALES_REP") {
        const { data, name } = await getSalesRepData(session);
        const { totalLeads, totalDemo, totalDead, totalSale } =
            await salesRepDashboardData(session.user.id);

        return (
            <SalesRepDashboard
                name={name}
                data={data}
                changeLeadStatus={changeLeadStatus}
                totalLeads={totalLeads}
                totalDemo={totalDemo}
                totalDead={totalDead}
                totalSale={totalSale}
            />
        );
    } else {
        return <p>How did you end up here? lol</p>;
    }
};

export default Dashboard;
