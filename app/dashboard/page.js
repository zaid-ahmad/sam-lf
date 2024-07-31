import { auth } from "@/auth";

import { getBranches, getSalesRepresentatives } from "@/lib/data";
import {
    adminDashboardData,
    canvasserDashboardData,
    getAdminData,
    getAllCanvasserNames,
    getCanvasserData,
    getSalesRepData,
    getSuperAdminData,
    salesRepDashboardData,
    superAdminDashboardData,
} from "@/lib/data-fetching";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import CanvasserDashboardClient from "@/components/CanvasserDashboardClient";
import SaleRepDashboardClient from "@/components/SaleRepDashboardClient";
import SuperAdminDashboardClient from "@/components/SuperAdminDashboardClient";
import { displayTodaysDate } from "@/lib/utils";
import prisma from "@/lib/prisma";

async function getUserBranch(userId) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            branchCode: true,
        },
    });
    return user.branchCode;
}

const Dashboard = async () => {
    const session = await auth();

    const role = session?.user?.role;

    if (role === "ADMIN") {
        const branch = await getUserBranch(session?.user?.id);
        const todaysDate = displayTodaysDate(branch);
        const sale_reps = await getSalesRepresentatives();
        const { data, name } = await getAdminData(session, todaysDate);
        const {
            totalLeads,
            totalAssignedLeads,
            totalUnassignedLeads,
            leadsPerTimeSlot,
        } = await adminDashboardData(branch, todaysDate);

        const listOfCanvassers = await getAllCanvasserNames(branch);
        const listOfSalesPeople = sale_reps.map((s) =>
            `${s.firstName} ${s.lastName}`.trim()
        );

        const initialData = {
            data,
            name,
            sale_reps,
            totalLeads,
            totalAssignedLeads,
            totalUnassignedLeads,
            listOfCanvassers,
            listOfSalesReps: listOfSalesPeople,
            slots_11: leadsPerTimeSlot["11:00 AM"],
            slots_01: leadsPerTimeSlot["01:00 PM"],
            slots_03: leadsPerTimeSlot["03:00 PM"],
            slots_05: leadsPerTimeSlot["05:00 PM"],
            slots_07: leadsPerTimeSlot["07:00 PM"],
            branch,
        };

        return <AdminDashboardClient initialData={initialData} />;
    } else if (role === "CANVASSER") {
        const branch = await getUserBranch(session?.user?.id);
        const todaysDate = displayTodaysDate(branch);
        const { canvasserData, canvasserFirstName } = await getCanvasserData(
            session,
            todaysDate
        );
        const { totalCanvasserLeads, totalDemo, totalDead, totalSale } =
            await canvasserDashboardData(session.user.id, todaysDate);

        const initialData = {
            data: canvasserData,
            name: canvasserFirstName,
            totalLeads: totalCanvasserLeads,
            totalDemo,
            totalDead,
            totalSale,
        };

        return (
            <CanvasserDashboardClient
                initialData={initialData}
                branch={branch}
            />
        );
    } else if (role === "SALES_REP") {
        const { saleRepData, saleRepFirstName } = await getSalesRepData(
            session
        );
        const { totalSaleRepLeads, totalDemoRep, totalDeadRep, totalSaleRep } =
            await salesRepDashboardData(session.user.id);

        const initialData = {
            data: saleRepData,
            name: saleRepFirstName,
            totalLeads: totalSaleRepLeads,
            totalDemo: totalDemoRep,
            totalDead: totalDeadRep,
            totalSale: totalSaleRep,
        };

        return <SaleRepDashboardClient initialData={initialData} />;
    } else if (role === "SUPERADMIN") {
        const sale_reps = await getSalesRepresentatives();
        const allBranches = await getBranches();
        const defaultBranch = allBranches[0].code;

        const todaysDate = displayTodaysDate(defaultBranch);

        const { superAdminData, superAdminName } = await getSuperAdminData(
            session,
            defaultBranch,
            todaysDate
        );
        const {
            superAdminTotalLeads,
            superAdminTotalAssignedLeads,
            superAdminTotalUnassignedLeads,
            superAdminLeadsPerTimeSlot,
        } = await superAdminDashboardData(defaultBranch, todaysDate);

        const listOfCanvassers = await getAllCanvasserNames(defaultBranch);
        const listOfSalesPeople = sale_reps.map((s) =>
            `${s.firstName} ${s.lastName}`.trim()
        );

        const initialData = {
            data: superAdminData,
            name: superAdminName,
            sale_reps,
            totalLeads: superAdminTotalLeads,
            totalAssignedLeads: superAdminTotalAssignedLeads,
            totalUnassignedLeads: superAdminTotalUnassignedLeads,
            listOfCanvassers,
            listOfSalesReps: listOfSalesPeople,
            slots_11: superAdminLeadsPerTimeSlot["11:00 AM"],
            slots_01: superAdminLeadsPerTimeSlot["01:00 PM"],
            slots_03: superAdminLeadsPerTimeSlot["03:00 PM"],
            slots_05: superAdminLeadsPerTimeSlot["05:00 PM"],
            slots_07: superAdminLeadsPerTimeSlot["07:00 PM"],
            branch: defaultBranch,
        };

        return (
            <SuperAdminDashboardClient
                initialData={initialData}
                allBranches={allBranches}
                branch={defaultBranch}
            />
        );
    } else {
        return <p>How did you end up here? lol</p>;
    }
};

export default Dashboard;
