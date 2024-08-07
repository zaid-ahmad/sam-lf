import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import { getBranches, getSalesRepresentatives } from "@/lib/data";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCanvasserNames, getPastLeads } from "@/lib/data-fetching";

const PastLeads = async () => {
    const session = await auth();
    const { data, branch } = await getPastLeads(session);

    const statusOptions = [
        "APPOINTMENT",
        "ASSIGNED",
        "DEMO",
        "SALE",
        "DEAD",
        "REBOOK",
        "CANCELLED",
        "INSTALL_CANCELLED",
    ];

    let allBranches, listOfCanvassers, listOfSalesPeople;

    if (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") {
        [allBranches, listOfCanvassers, listOfSalesPeople] = await Promise.all([
            session.user.role === "SUPERADMIN" ? getBranches() : null,
            getAllCanvasserNames(branch),
            getSalesRepresentatives(branch).then((reps) =>
                reps.map((s) => `${s.firstName} ${s.lastName}`.trim())
            ),
        ]);
    }

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
                canvasserOptions={listOfCanvassers}
                salesPersonOptions={listOfSalesPeople}
                allBranches={allBranches}
                isSuperAdmin={session.user.role === "SUPERADMIN"}
                isCanvasser={session.user.role === "CANVASSER"}
                currentBranch={branch}
            />
        </div>
    );
};

export default PastLeads;
