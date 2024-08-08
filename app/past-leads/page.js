import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    getAllCanvasserNames,
    getPastLeadsForAllBranches,
    getPastLeads,
} from "@/lib/data-fetching";
import { getBranches, getSalesRepresentatives } from "@/lib/data";

const PastLeads = async () => {
    const session = await auth();
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

    let data, allBranches, listOfCanvassers, listOfSalesPeople;

    if (session.user.role === "SUPERADMIN") {
        allBranches = await getBranches();
        data = await getPastLeadsForAllBranches();
        [listOfCanvassers, listOfSalesPeople] = await Promise.all([
            getAllCanvasserNames(),
            getSalesRepresentatives().then((reps) =>
                reps.map((s) => `${s.firstName} ${s.lastName}`.trim())
            ),
        ]);
    } else {
        const { data: branchData, branch } = await getPastLeads(session);
        data = branchData;
        if (session.user.role === "ADMIN") {
            [listOfCanvassers, listOfSalesPeople] = await Promise.all([
                getAllCanvasserNames(branch),
                getSalesRepresentatives(branch).then((reps) =>
                    reps.map((s) => `${s.firstName} ${s.lastName}`.trim())
                ),
            ]);
        }
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
            />
        </div>
    );
};

export default PastLeads;
