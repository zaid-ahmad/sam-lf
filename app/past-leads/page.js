import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getTodayAndTomorrow } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getAdminPastLeads(session) {
    const { today } = getTodayAndTomorrow();
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            branchCode: true,
        },
    });
    const data = await prisma.lead.findMany({
        where: {
            branch: user.branchCode,
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

    return { data: transformedData, branch: user.branchCode };
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

const PastLeads = async () => {
    const session = await auth();

    if (session.user.role === "ADMIN") {
        const { data, branch } = await getAdminPastLeads(session);
        const listOfCanvassers = await getAllCanvasserNames(branch);
        const statusOptions = [
            "APPOINTMENT",
            "ASSIGNED",
            "DEMO",
            "SALE",
            "DEAD",
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
                    canvasserOptions={listOfCanvassers}
                />
            </div>
        );
    }
};

export default PastLeads;
