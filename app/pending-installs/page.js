import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PendingInstallsTable } from "./pending-installs-table";
import { columns } from "./columns";

async function getPendingInstallsData(session) {
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email,
        },
    });

    const pendingInstallsData = await prisma.lead.findMany({
        where: {
            status: "SALE",
            branch: user.branchCode,
        },
        select: {
            id: true,
            jobNumber: true,
            appointmentDateTime: true,
            installationDate: true,
            amount: true,
            funded: true,
        },
    });
    return pendingInstallsData;
}

const PendingInstalls = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== "ADMIN") {
        return redirect("/");
    }

    const data = await getPendingInstallsData(session);

    return <PendingInstallsTable columns={columns} initialData={data} />;
};

export default PendingInstalls;
