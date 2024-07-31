import { NextResponse } from "next/server";
import { auth } from "@/auth";
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
import { getSalesRepresentatives } from "@/lib/data";
import moment from "moment-timezone";
import { getStartEndDateWithOffset } from "@/lib/utils";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const branchFromAPI = searchParams.get("branch");
    let date = searchParams.get("date");

    if (date) {
        const parsedDate = moment(date, "YYYY-MM-DD");
        if (parsedDate.isValid()) {
            date = parsedDate.format("MMMM Do, YYYY");
        } else {
            console.error("Invalid date format received:", date);
            // You might want to handle this error case appropriately
        }
    }

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
            const { data, name, branch } = await getAdminData(session, date);
            const sale_reps = await getSalesRepresentatives(branch);
            const {
                totalLeads,
                totalAssignedLeads,
                totalUnassignedLeads,
                leadsPerTimeSlot,
            } = await adminDashboardData(branch, date);
            const listOfCanvassers = await getAllCanvasserNames(branch);
            const listOfSalesPeople = sale_reps.map((s) =>
                `${s.firstName} ${s.lastName}`.trim()
            );

            responseData = {
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
            const { canvasserData, canvasserFirstName } =
                await getCanvasserData(session, date);
            const { totalCanvasserLeads, totalDemo, totalDead, totalSale } =
                await canvasserDashboardData(session.user.id, date);

            responseData = {
                data: canvasserData,
                name: canvasserFirstName,
                totalLeads: totalCanvasserLeads,
                totalDemo,
                totalDead,
                totalSale,
            };
            break;

        case "superadmin":
            const super_admin_sale_reps = await getSalesRepresentatives(
                branchFromAPI
            );
            const { superAdminData, superAdminName } = await getSuperAdminData(
                session,
                branchFromAPI,
                date
            );
            const {
                superAdminTotalLeads,
                superAdminTotalAssignedLeads,
                superAdminTotalUnassignedLeads,
                superAdminLeadsPerTimeSlot,
            } = await superAdminDashboardData(branchFromAPI, date);

            const superAdmiListOfCanvassers = await getAllCanvasserNames(
                branchFromAPI
            );
            const superAdmiListOfSalesPeople = super_admin_sale_reps.map((s) =>
                `${s.firstName} ${s.lastName}`.trim()
            );

            responseData = {
                data: superAdminData,
                name: superAdminName,
                sale_reps: super_admin_sale_reps,
                totalLeads: superAdminTotalLeads,
                totalAssignedLeads: superAdminTotalAssignedLeads,
                totalUnassignedLeads: superAdminTotalUnassignedLeads,
                listOfCanvassers: superAdmiListOfCanvassers,
                listOfSalesReps: superAdmiListOfSalesPeople,
                slots_11: superAdminLeadsPerTimeSlot["11:00 AM"],
                slots_01: superAdminLeadsPerTimeSlot["01:00 PM"],
                slots_03: superAdminLeadsPerTimeSlot["03:00 PM"],
                slots_05: superAdminLeadsPerTimeSlot["05:00 PM"],
                slots_07: superAdminLeadsPerTimeSlot["07:00 PM"],
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
