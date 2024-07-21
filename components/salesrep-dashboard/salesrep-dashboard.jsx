import InfoCard from "@/app/dashboard/info-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { displayTodaysDate } from "@/lib/utils";

const SalesRepDashboard = ({ data, changeLeadStatus, name, totalLeads }) => {
    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>
                Hello {name}! (sales rep)
            </h2>
            <div className='flex items-center gap-[1.74rem]'>
                <InfoCard
                    title='Leads assigned to you'
                    value={totalLeads}
                    description={displayTodaysDate()}
                />
                {/* <InfoCard
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
                <InfoCard title='Assigned' value='22' />
                <InfoCard title='Unassigned' value='2' /> */}
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                changeLeadStatus={changeLeadStatus}
            />
        </div>
    );
};

export default SalesRepDashboard;
