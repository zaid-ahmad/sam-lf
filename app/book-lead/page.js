import { auth } from "@/auth";
import AppointmentRequestForm from "@/components/book-lead-form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";

const BookLeadPage = async () => {
    const session = await auth();
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            branchCode: true,
        },
    });
    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl'>
            <div className='py-4 sm:py-6 lg:py-8'>
                <Breadcrumb className='text-sm sm:text-base'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/dashboard'>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Appointment Request</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <AppointmentRequestForm branch={user.branchCode} />
        </div>
    );
};

export default BookLeadPage;
