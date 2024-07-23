import InfoCard from "@/app/dashboard/info-card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { displayTodaysDate } from "@/lib/utils";

const CanvasserDashboard = ({
    data,
    name,
    totalLeads,
    totalDemo,
    totalDead,
    totalSale,
}) => {
    const statusOptions = ["APPOINTMENT", "ASSIGNED", "DEMO", "SALE", "DEAD"];

    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-7'>
                Hello {name}!
            </h2>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[1.74rem] mb-6 sm:mb-10'>
                <InfoCard
                    title='Leads so far for today'
                    value={totalLeads}
                    description={displayTodaysDate()}
                    className='w-full sm:w-auto'
                />
                <Separator
                    orientation='horizontal'
                    className='w-full h-[1px] sm:h-10 sm:w-[1px] bg-zinc-300 my-2 sm:my-0'
                />
                <div className='flex flex-wrap justify-between w-full sm:w-auto gap-4'>
                    <InfoCard
                        title='Demo'
                        value={totalDemo}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Dead'
                        value={totalDead}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Sale'
                        value={totalSale}
                        className='flex-1 min-w-[120px]'
                    />
                </div>
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                statusOptions={statusOptions}
            />
        </div>
    );
};

export default CanvasserDashboard;
