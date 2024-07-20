import { auth } from "@/auth";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import InfoCard from "./info-card";
import {
    Users,
    UserPlus,
    UserCheck,
    Clock,
    UserMinus,
    CheckCircle2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getSalesRepresentatives } from "@/lib/data";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";

async function getData(session) {
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const result = await prisma.lead.findMany({
        where: {
            branch: user.branchCode,
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

    // Transform the result to flatten canvasser and salesRep
    const transformedData = result.map((lead) => ({
        ...lead,
        name: lead.firstName,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
        salesRep: lead.salesRep
            ? `${lead.salesRep.firstName} ${lead.salesRep.lastName}`.trim()
            : null,
    }));

    return transformedData;
}

function extractFirstName(email) {
    // Split the email address at the @ symbol
    const [localPart] = email.split("@");

    // Split the local part by dots and take the first part
    const [firstName] = localPart.split(".");

    // Capitalize the first letter and make the rest lowercase
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

const Dashboard = async () => {
    const session = await auth();

    const data = await getData(session);

    const sale_reps = await getSalesRepresentatives();

    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>
                Hello {extractFirstName(session.user.email)}!
            </h2>
            <div className='flex items-center gap-7'>
                <InfoCard title='Leads so far for today' value='24' />
                <InfoCard title='11 AM' value='1' />
                <InfoCard title='1 PM' value='0' />
                <InfoCard title='3 PM' value='5' />
                <InfoCard title='5 PM' value='8' />
                <InfoCard title='7 PM' value='10' />
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

export default Dashboard;
