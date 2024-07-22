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
            branch: user.branchCode,
            salesRepId: user.id,
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

    return { totalLeads, totalAssignedLeads, totalUnassignedLeads };
}

async function salesRepDashboardData(id) {
    const { today, tomorrow } = getTodayAndTomorrow();
    const totalLeads = await prisma.lead.count({
        where: {
            salesRepId: {
                equals: id,
            },
            status: {
                equals: "ASSIGNED",
            },
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return { totalLeads };
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
        const { totalLeads, totalAssignedLeads, totalUnassignedLeads } =
            await adminDashboardData(branch);

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
            />
        );
    } else if (role === "CANVASSER") {
        const { data, name } = await getAdminData(session);
        const sale_reps = await getSalesRepresentatives();

        return (
            <CanvasserDashboard
                name={name}
                data={data}
                sale_reps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
                firstName={extractFirstName(session.user.email)}
            />
        );
    } else if (role === "SALES_REP") {
        const { data, name, id } = await getSalesRepData(session);
        const { totalLeads } = await salesRepDashboardData(id);

        return (
            <SalesRepDashboard
                name={name}
                data={data}
                changeLeadStatus={changeLeadStatus}
                totalLeads={totalLeads}
            />
        );
    } else {
        return <p>How did you end up here? lol</p>;
    }
};

export default Dashboard;
