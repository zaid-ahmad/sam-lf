import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LeadEditPage from "@/components/edit-lead-form";
import { getLead } from "@/lib/data";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function LeadEdit({ params }) {
    const { id } = params;
    const session = await auth();

    if (
        session.user.role === "ADMIN" ||
        session.user.role === "SUPERADMIN" ||
        session.user.role === "CANVASSER"
    ) {
        const result = await getLead(id);
        return (
            <div className='py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
                <Breadcrumb className='mb-4 sm:mb-10 max-w-3xl mx-auto '>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/dashboard'>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Edit Lead Details</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <LeadEditPage id={id} data={result} role={session.user.role} />
            </div>
        );
    } else {
        redirect("/dashboard");
    }
}
