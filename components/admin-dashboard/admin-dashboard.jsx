import InfoCard from "@/app/dashboard/info-card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Spinner from "../spinner";

const AdminDashboard = ({
    data,
    name,
    sale_reps,
    totalLeads,
    totalAssignedLeads,
    totalUnassignedLeads,
    listOfCanvassers,
    listOfSalesReps,
    slots_11,
    slots_01,
    slots_03,
    slots_05,
    slots_07,
    assignLeadToSalesRep,
    leadDate,
    onPreviousDate,
    onNextDate,
    isToday,
    isLoading,
}) => {
    const statusOptions = [
        "APPOINTMENT",
        "ASSIGNED",
        "DEMO",
        "SALE",
        "DEAD",
        "REBOOK",
        "CANCELLED",
    ];

    const timeOptions = [
        "11:00 AM",
        "01:00 PM",
        "03:00 PM",
        "05:00 PM",
        "07:00 PM",
    ];

    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <h2 className='flex items-center gap-5 text-xl sm:text-2xl font-semibold mb-4 sm:mb-7'>
                Hello {name}!
                {isLoading && (
                    <>
                        <span>
                            <Spinner
                                color={"text-emerald-800"}
                                height={0.1}
                                padding={0}
                            />
                        </span>
                    </>
                )}
            </h2>

            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[1.74rem] mb-6 sm:mb-10'>
                <InfoCard
                    title='Total Leads for Today'
                    value={totalLeads}
                    description={leadDate}
                    changeLeadDate={true}
                    onPreviousDate={onPreviousDate}
                    onNextDate={onNextDate}
                    isToday={isToday}
                />
                <InfoCard
                    title='11 AM'
                    value={slots_11}
                    description={"Slots Filled"}
                />
                <div className='flex flex-wrap justify-between w-full sm:w-auto gap-4'>
                    <InfoCard
                        title='1 PM'
                        value={slots_01}
                        description={"Slots Filled"}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='3 PM'
                        value={slots_03}
                        description={"Slots Filled"}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='5 PM'
                        value={slots_05}
                        description={"Slots Filled"}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='7 PM'
                        value={slots_07}
                        description={"Slots Filled"}
                        className='flex-1 min-w-[120px]'
                    />
                </div>
                <Separator
                    orientation='vertical'
                    className='w-full h-[1px] sm:h-10 sm:w-[1px] bg-zinc-300 my-2 sm:my-0'
                />
                <div className='flex flex-wrap justify-between w-full sm:w-auto gap-4'>
                    <InfoCard
                        title='Assigned'
                        value={totalAssignedLeads}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Unassigned'
                        value={totalUnassignedLeads}
                        className='flex-1 min-w-[120px]'
                    />
                </div>
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                saleReps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
                statusOptions={statusOptions}
                timeOptions={timeOptions}
                canvasserOptions={listOfCanvassers}
                salesRepOptions={listOfSalesReps}
            />
        </div>
    );
};

export default AdminDashboard;
