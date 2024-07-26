import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
    adminDashboardData,
    canvasserDashboardData,
    getAdminData,
    getAllCanvasserNames,
    getCanvasserData,
    getSalesRepData,
    salesRepDashboardData,
} from "@/lib/data-fetching";
import { getSalesRepresentatives } from "@/lib/data";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const session = await auth();
    if (!session) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    let responseData = {};

    switch (role) {
        case "admin":
            const { data, name, branch } = await getAdminData(session);
            const sale_reps = await getSalesRepresentatives();
            const {
                totalLeads,
                totalAssignedLeads,
                totalUnassignedLeads,
                leadsPerTimeSlot,
            } = await adminDashboardData(branch);
            const listOfCanvassers = await getAllCanvasserNames(branch);

            responseData = {
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
            break;
        case "sales_rep":
            const { saleRepData, saleRepFirstName } = await getSalesRepData(
                session
            );
            const {
                totalSaleRepLeads,
                totalDemoRep,
                totalDeadRep,
                totalSaleRep,
            } = await salesRepDashboardData(session.user.id);

            responseData = {
                data: saleRepData,
                name: saleRepFirstName,
                totalLeads: totalSaleRepLeads,
                totalDemo: totalDemoRep,
                totalDead: totalDeadRep,
                totalSale: totalSaleRep,
            };

            break;
        case "canvasser":
            console.log("hi from canvasser");

            const { canvasserData, canvasserFirstName } =
                await getCanvasserData(session);
            const { totalCanvasserLeads, totalDemo, totalDead, totalSale } =
                await canvasserDashboardData(session.user.id);

            responseData = {
                data: canvasserData,
                name: canvasserFirstName,
                totalLeads: totalCanvasserLeads,
                totalDemo,
                totalDead,
                totalSale,
            };
            break;
        default:
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
    }

    return NextResponse.json(responseData);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
