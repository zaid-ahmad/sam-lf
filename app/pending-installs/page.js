import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PendingInstallsTable } from "./pending-installs-table";
import { columns } from "./columns";

async function getPendingInstallsData(session, branch = null) {
    const [user, allBranches] = await Promise.all([
        prisma.user.findUnique({
            where: { email: session?.user?.email },
            select: { branchCode: true },
        }),
        prisma.branch.findMany({
            select: { code: true, name: true },
        }),
    ]);

    const branchCode = branch || user.branchCode;

    const [pendingInstallsData, canvassers] = await Promise.all([
        prisma.lead.findMany({
            where: {
                status: "SALE",
                branch: branchCode,
            },
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
        }),
        prisma.user.findMany({
            where: {
                role: "CANVASSER",
                branchCode: branchCode,
            },
            select: {
                firstName: true,
                lastName: true,
            },
        }),
    ]);

    const transformedData = pendingInstallsData.map((lead) => ({
        ...lead,
        canvasser: lead.canvasser
            ? `${lead.canvasser.firstName} ${lead.canvasser.lastName}`.trim()
            : "N/A",
    }));

    const canvasserNames = canvassers.map((c) =>
        `${c.firstName} ${c.lastName}`.trim()
    );

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
