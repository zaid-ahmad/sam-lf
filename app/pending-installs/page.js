import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PendingInstallsTable } from "./pending-installs-table";
import { columns } from "./columns";

async function getPendingInstallsData(session, branch = null) {
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email,
        },
    });

    const whereClause = {
        status: "SALE",
        branch: branch || user.branchCode,
    };

    const pendingInstallsData = await prisma.lead.findMany({
        where: whereClause,
        select: {
            id: true,
            jobNumber: true,
            appointmentDateTime: true,
            installationDate: true,
            amount: true,
            funded: true,
            branch: true,
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
            branchCode: branch || user.branchCode,
        },
        select: {
            firstName: true,
            lastName: true,
        },
    });

    const canvasserNames = canvassers.map((c) =>
        `${c.firstName} ${c.lastName}`.trim()
    );

    const allBranches = await prisma.branch.findMany({
        select: {
            code: true,
            name: true,
        },
    });

    return {
        transformedData,
        canvasserNames,
        allBranches,
    };
}

const PendingInstalls = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== "ADMIN" && role !== "SUPERADMIN") {
        return redirect("/");
    }

    const { transformedData, canvasserNames, allBranches } =
        await getPendingInstallsData(session);

    return (
        <PendingInstallsTable
            columns={columns}
            initialData={transformedData}
            canvasserNames={canvasserNames}
            allBranches={allBranches}
            isSuperAdmin={role === "SUPERADMIN"}
        />
    );
};

export default PendingInstalls;
