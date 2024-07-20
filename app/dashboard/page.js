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

    return (
        <div className='container mx-auto py-10'>
            <h2 className='text-2xl font-semibold mb-7'>
                Hello {extractFirstName(session.user.email)}!
            </h2>
            <div className='flex items-center gap-7'>
                <InfoCard
                    title='Leads for Today'
                    value='30'
                    icon={Users}
                    color='blue'
                />
                <InfoCard
                    title='Unassigned'
                    value='10'
                    icon={UserPlus}
                    color='yellow'
                />
                <InfoCard
                    title='Assigned'
                    value='20'
                    icon={UserCheck}
                    color='orange'
                />
                <InfoCard
                    title='Demo Leads'
                    value='10'
                    icon={Clock}
                    color='purple'
                />
                <InfoCard
                    title='Dead Leads'
                    value='0'
                    icon={UserMinus}
                    color='red'
                />
                <InfoCard
                    title='Sold'
                    value='15'
                    icon={CheckCircle2}
                    color='green'
                />
            </div>
            <DataTable intialColumns={columns} initialData={data} />
        </div>
    );
};

export default Dashboard;
