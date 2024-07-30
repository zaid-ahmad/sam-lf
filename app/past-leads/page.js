import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getStartEndDateWithOffset, getTodayAndTomorrow } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBranches } from "@/lib/data";

async function getAdminPastLeads(session, branch = null) {
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            branchCode: true,
        },
    });
    const { currentDateString } = getStartEndDateWithOffset(user.branchCode);

    const data = await prisma.lead.findMany({
        where: {
            branch: branch || user.branchCode,
            appointmentDateTime: {
                lt: currentDateString,
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

    const transformedData = data.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return { data: transformedData, branch: user.branchCode };
}

async function getCanvasserPastLeads(user_id) {
    const { today } = getTodayAndTomorrow();
    const data = await prisma.lead.findMany({
        where: {
            canvasserId: user_id,
            createdAt: {
                lt: today,
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

    const transformedData = data.map((lead) => ({
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
        const { data, branch } = await getAdminPastLeads(session);
        const listOfCanvassers = await getAllCanvasserNames(branch);
        const statusOptions = [
            "APPOINTMENT",
            "ASSIGNED",
            "DEMO",
            "SALE",
            "DEAD",
            "REBOOK",
            "CANCELLED",
        ];

        const allBranches =
            session.user.role === "SUPERADMIN" ? await getBranches() : null;

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
                    columns={columns}
                    data={data}
                    statusOptions={statusOptions}
                    canvasserOptions={listOfCanvassers}
                    allBranches={allBranches}
                    isSuperAdmin={session.user.role === "SUPERADMIN"}
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
                    columns={columns}
                    data={data}
                    statusOptions={statusOptions}
                />
            </div>
        );
    }
};

export default PastLeads;
