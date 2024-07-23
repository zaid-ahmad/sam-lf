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
    listOfCanvassers,
    slots_11,
    slots_01,
    slots_03,
    slots_05,
    slots_07,
}) => {
    const statusOptions = ["APPOINTMENT", "ASSIGNED", "DEMO", "SALE", "DEAD"];

    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>Hello {name}!</h2>
            <div className='flex items-center gap-[1.74rem]'>
                <InfoCard
                    title='Leads so far for today'
                    value={totalLeads}
                    description={displayTodaysDate()}
                />
                <InfoCard
                    title='11 AM'
                    value={slots_11}
                    description={"Slots Filled"}
                />
                <InfoCard
                    title='1 PM'
                    value={slots_01}
                    description={"Slots Filled"}
                />
                <InfoCard
                    title='3 PM'
                    value={slots_03}
                    description={"Slots Filled"}
                />
                <InfoCard
                    title='5 PM'
                    value={slots_05}
                    description={"Slots Filled"}
                />
                <InfoCard
                    title='7 PM'
                    value={slots_07}
                    description={"Slots Filled"}
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
                canvasserOptions={listOfCanvassers}
            />
        </div>
    );
};

export default AdminDashboard;
