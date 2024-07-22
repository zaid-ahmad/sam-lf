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
            canvasser: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    const transformedData = pendingInstallsData.map((lead) => ({
        ...lead,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
    }));

    const canvassers = await prisma.user.findMany({
        where: {
            role: "CANVASSER",
            branchCode: user.branchCode,
        },
        select: {
            firstName: true,
            lastName: true,
        },
    });

    const canvasserNames = canvassers.map((c) =>
        `${c.firstName} ${c.lastName}`.trim()
    );

    return {
        transformedData,
        canvasserNames,
    };
}

const PendingInstalls = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== "ADMIN") {
        return redirect("/");
    }

    const { transformedData, canvasserNames } = await getPendingInstallsData(
        session
    );

    return (
        <PendingInstallsTable
            columns={columns}
            initialData={transformedData}
            canvasserNames={canvasserNames}
        />
    );
};

export default PendingInstalls;
