import { auth } from "@/auth";
import { SlotManagement } from "@/components/time-slots/SlotManagement";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

async function ManageSlotsPage() {
    const session = await auth();

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
        return redirect("/dashboard");
    }

    // Fetch branches
    const branches = await prisma.branch.findMany({
        select: {
            code: true,
            name: true,
        },
    });

    // Fetch user's branch if not a superadmin
    let userBranch = null;
    if (session.user.role !== "SUPERADMIN") {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { branchCode: true },
        });
        userBranch = user.branchCode;
    }

    return (
        <div className='container'>
            <div className='py-6'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/dashboard'>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manage Time Slots</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <h2 className='text-xl sm:text-2xl font-semibold'>
                Manage Time Slots
            </h2>

            <SlotManagement
                session={session}
                branches={branches}
                userBranch={userBranch}
            />
        </div>
    );
}

export default ManageSlotsPage;
