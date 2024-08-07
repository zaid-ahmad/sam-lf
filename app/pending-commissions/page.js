import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PendingCommissionsTable } from "./pending-commissions-table";
import { columns } from "./columns";

async function getUserAndBranch(session) {
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email },
        select: { id: true, branchCode: true, role: true },
    });
    return user;
}

async function getPendingInstallsData(user, branch = null) {
    const whereClause = {
        status: "SALE",
        funded: true,
        branch: branch || user.branchCode,
    };

    if (user.role === "CANVASSER") {
        whereClause.canvasserId = user.id;
    }

    const pendingInstallsData = await prisma.lead.findMany({
        where: whereClause,
        select: {
            id: true,
            jobNumber: true,
            appointmentDateTime: true,
            installationDate: true,
            amount: true,
            funded: true,
            commissionPaid: true,
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

    let canvasserNames = [];
    let allBranches = [];

    if (user.role !== "CANVASSER") {
        [canvasserNames, allBranches] = await Promise.all([
            prisma.user
                .findMany({
                    where: {
                        role: "CANVASSER",
                        branchCode: branch || user.branchCode,
                    },
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                })
                .then((canvassers) =>
                    canvassers.map((c) => `${c.firstName} ${c.lastName}`.trim())
                ),
            prisma.branch.findMany({
                select: {
                    code: true,
                    name: true,
                },
            }),
        ]);
    }

    return {
        transformedData,
        canvasserNames,
        allBranches,
    };
}

async function getPendingInstallsDataWrapper(session, branch = null) {
    const user = await getUserAndBranch(session);
    return getPendingInstallsData(user, branch);
}

async function getPendingCommissionsCanvasserData(session) {
    const user = await getUserAndBranch(session);
    return getPendingInstallsData(user);
}

const PendingCommissions = async () => {
    const session = await auth();
    const role = session?.user?.role;

    if (role === "ADMIN" || role === "SUPERADMIN") {
        const { transformedData, canvasserNames, allBranches } =
            await getPendingInstallsDataWrapper(session);

        return (
            <PendingCommissionsTable
                columns={columns}
                initialData={transformedData}
                canvasserNames={canvasserNames}
                allBranches={allBranches}
                role={role}
            />
        );
    } else if (role === "CANVASSER") {
        const { transformedData } = await getPendingCommissionsCanvasserData(
            session
        );

        return (
            <PendingCommissionsTable
                columns={columns}
                initialData={transformedData}
                role={role}
            />
        );
    }

    return redirect("/");
};

export default PendingCommissions;
