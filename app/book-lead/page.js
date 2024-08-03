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
                            <BreadcrumbPage>
                                Appointment Request Form
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <AppointmentRequestForm branch={user.branchCode} />
        </div>
    );
};

export default BookLeadPage;
