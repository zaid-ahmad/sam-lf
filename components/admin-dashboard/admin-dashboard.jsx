import InfoCard from "@/app/dashboard/info-card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { displayTodaysDate } from "@/lib/utils";

const AdminDashboard = ({
    data,
    sale_reps,
    assignLeadToSalesRep,
    name,
    totalLeads,
    totalAssignedLeads,
    totalUnassignedLeads,
}) => {
    const statusOptions = [
        "APPOINTMENT",
        "ASSIGNED",
        "DEMO",
        "SALE",
        "DEAD",
        "UNASSIGNED",
    ];
    const canvasserOptions = ["Zaid Ahmad", "Rajdeep Narela"];

    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>
                Hello {name}! (admin)
            </h2>
            <div className='flex items-center gap-[1.74rem]'>
                <InfoCard
                    title='Leads so far for today'
                    value={totalLeads}
                    description={displayTodaysDate()}
                />
                <InfoCard
                    title='11 AM'
                    value='1'
                    description={"Slots Filled"}
                    outOf20={true}
                />
                <InfoCard
                    title='1 PM'
                    value='0'
                    description={"Slots Filled"}
                    outOf20={true}
                />
                <InfoCard
                    title='3 PM'
                    value='5'
                    description={"Slots Filled"}
                    outOf20={true}
                />
                <InfoCard
                    title='5 PM'
                    value='8'
                    description={"Slots Filled"}
                    outOf20={true}
                />
                <InfoCard
                    title='7 PM'
                    value='10'
                    description={"Slots Filled"}
                    outOf20={true}
                />
                <Separator
                    orientation='vertical'
                    className='h-10 bg-zinc-300'
                />
                <InfoCard title='Assigned' value={totalAssignedLeads} />
                <InfoCard title='Unassigned' value={totalUnassignedLeads} />
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                saleReps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
                statusOptions={statusOptions}
                canvasserOptions={canvasserOptions}
            />
        </div>
    );
};

export default AdminDashboard;
