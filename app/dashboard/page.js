import { auth } from "@/auth";

import { getSalesRepresentatives } from "@/lib/data";
import {
    adminDashboardData,
    canvasserDashboardData,
    getAdminData,
    getAllCanvasserNames,
    getCanvasserData,
    getSalesRepData,
    salesRepDashboardData,
} from "@/lib/data-fetching";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import CanvasserDashboardClient from "@/components/CanvasserDashboardClient";
import SaleRepDashboardClient from "@/components/SaleRepDashboardClient";

const Dashboard = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role === "ADMIN") {
        const sale_reps = await getSalesRepresentatives();
        const { data, name, branch } = await getAdminData(session);
        const {
            totalLeads,
            totalAssignedLeads,
            totalUnassignedLeads,
            leadsPerTimeSlot,
        } = await adminDashboardData(branch);

        const listOfCanvassers = await getAllCanvasserNames(branch);

        const initialData = {
            data,
            name,
            sale_reps,
            totalLeads,
            totalAssignedLeads,
            totalUnassignedLeads,
            listOfCanvassers,
            slots_11: leadsPerTimeSlot["11:00 AM"],
            slots_01: leadsPerTimeSlot["01:00 PM"],
            slots_03: leadsPerTimeSlot["03:00 PM"],
            slots_05: leadsPerTimeSlot["05:00 PM"],
            slots_07: leadsPerTimeSlot["07:00 PM"],
        };

        return <AdminDashboardClient initialData={initialData} />;
    } else if (role === "CANVASSER") {
        const { canvasserData, canvasserFirstName } = await getCanvasserData(
            session
        );
        const { totalCanvasserLeads, totalDemo, totalDead, totalSale } =
            await canvasserDashboardData(session.user.id);

        const initialData = {
            data: canvasserData,
            name: canvasserFirstName,
            totalLeads: totalCanvasserLeads,
            totalDemo,
            totalDead,
            totalSale,
        };

        return <CanvasserDashboardClient initialData={initialData} />;
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
    } else {
        return <p>How did you end up here? lol</p>;
    }
};

export default Dashboard;
