import InfoCard from "@/app/dashboard/info-card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { extractFirstName } from "@/lib/utils";

const CanvasserDashboard = ({
    data,
    sale_reps,
    assignLeadToSalesRep,
    name,
}) => {
    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>
                Hello {name}! (canvasser)
            </h2>
            <div className='flex items-center gap-[1.74rem]'>
                <InfoCard title='Leads so far for today' value='24' />
                <InfoCard title='11 AM' value='1' />
                <InfoCard title='1 PM' value='0' />
                <InfoCard title='3 PM' value='5' />
                <InfoCard title='5 PM' value='8' />
                <InfoCard title='7 PM' value='10' />
                <Separator
                    orientation='vertical'
                    className='h-10 bg-zinc-300'
                />
                <InfoCard title='Assigned' value='22' />
                <InfoCard title='Unassigned' value='2' />
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                saleReps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
            />
        </div>
    );
};

export default CanvasserDashboard;
