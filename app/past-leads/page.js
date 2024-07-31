import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { displayTodaysDate, getStartEndDateWithOffset } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBranches, getSalesRepresentatives } from "@/lib/data";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import moment from "moment";

async function getAdminPastLeads(session, branch = null) {
    let branchCode;
    if (session.user.role === "SUPERADMIN") {
        branchCode = branch; // Use the provided branch for superadmin
    } else {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { branchCode: true },
        });
        branchCode = user.branchCode;
    }

    if (!branchCode) {
        throw new Error("No branch specified for superadmin");
    }

    const todaysDate = displayTodaysDate(branchCode);
    const currentDate = moment(todaysDate, "MMMM Do, YYYY");

    const data = await prisma.lead.findMany({
        where: {
            branch: branchCode,
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
            branch: true,
        },
    });

    // Filter the data after fetching
    const pastLeads = data.filter((lead) => {
        const appointmentDate = moment(
            lead.appointmentDateTime,
            "MMMM Do, YYYY"
        );
        return appointmentDate.isBefore(currentDate);
    });

    const transformedData = pastLeads.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return { data: transformedData, branch: branchCode };
}

async function getCanvasserPastLeads(user_id) {
    const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: { branchCode: true },
    });

    const todaysDate = displayTodaysDate(branchCode);
    const currentDate = moment(todaysDate, "MMMM Do, YYYY");

    const data = await prisma.lead.findMany({
        where: {
            canvasserId: user_id,
            appointmentDateTime: {
                lt: currentDateString,
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
            branch: true,
        },
    });

    const pastLeads = data.filter((lead) => {
        const appointmentDate = moment(
            lead.appointmentDateTime,
            "MMMM Do, YYYY"
        );
        return appointmentDate.isBefore(currentDate);
    });

    const transformedData = pastLeads.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return { data: transformedData };
}

async function getAllCanvasserNames(branch = null) {
    const whereClause = branch
        ? { role: "CANVASSER", branchCode: branch }
        : { role: "CANVASSER" };
    const canvassers = await prisma.user.findMany({
        where: whereClause,
        select: {
            firstName: true,
            lastName: true,
        },
    });

    return canvassers.map((canvasser) =>
        `${canvasser.firstName} ${canvasser.lastName}`.trim()
    );
}

const PastLeads = async () => {
    const session = await auth();

    if (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") {
        let data, branch, allBranches;

        if (session.user.role === "SUPERADMIN") {
            allBranches = await getBranches();
            // If no branch is specified, use the first branch in the list
            const defaultBranch = allBranches[0]?.code;
            ({ data, branch } = await getAdminPastLeads(
                session,
                defaultBranch
            ));
        } else {
            ({ data, branch } = await getAdminPastLeads(session));
        }

        const listOfCanvassers = await getAllCanvasserNames(branch);
        const sale_reps = await getSalesRepresentatives(branch);
        const listOfSalesPeople = sale_reps.map((s) =>
            `${s.firstName} ${s.lastName}`.trim()
        );
        const statusOptions = [
            "APPOINTMENT",
            "ASSIGNED",
            "DEMO",
            "SALE",
            "DEAD",
            "REBOOK",
            "CANCELLED",
        ];
        return (
            <div className='container'>
                <Breadcrumb className='my-5'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/dashboard'>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>View past leads</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='my-5 text-2xl font-bold'>Past Leads</h1>
                <DataTable
                    initialColumns={columns}
                    initialData={data}
                    saleReps={sale_reps}
                    assignLeadToSalesRep={assignLeadToSalesRep}
                    statusOptions={statusOptions}
                    canvasserOptions={listOfCanvassers}
                    salesPersonOptions={listOfSalesPeople}
                    allBranches={allBranches}
                    isSuperAdmin={session.user.role === "SUPERADMIN"}
                    currentBranch={branch}
                />
            </div>
        );
    }

    if (session.user.role === "CANVASSER") {
        const { data } = await getCanvasserPastLeads(session.user.id);
        const statusOptions = [
            "APPOINTMENT",
            "ASSIGNED",
            "DEMO",
            "SALE",
            "DEAD",
            "REBOOK",
            "CANCELLED",
        ];

        return (
            <div className='container'>
                <Breadcrumb className='my-5'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/dashboard'>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>View past leads</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='my-5 text-2xl font-bold'>Past Leads</h1>
                <DataTable
                    initialColumns={columns}
                    initialData={data}
                    statusOptions={statusOptions}
                    isSuperAdmin={false}
                    isCanvasser={true}
                />
            </div>
        );
    }
};

export default PastLeads;
