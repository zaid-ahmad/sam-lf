import InfoCard from "@/app/dashboard/info-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { displayTodaysDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const SalesRepDashboard = ({
    data,
    changeLeadStatus,
    name,
    totalLeads,
    totalDemo,
    totalDead,
    totalSale,
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
                <Separator
                    orientation='vertical'
                    className='h-10 bg-zinc-300'
                />
                <InfoCard title='Demo' value={totalDemo} />
                <InfoCard title='Dead' value={totalDead} />
                <InfoCard title='Sale' value={totalSale} />
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                changeLeadStatus={changeLeadStatus}
                statusOptions={statusOptions}
            />
        </div>
    );
};

export default SalesRepDashboard;
