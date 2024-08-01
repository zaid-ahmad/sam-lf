import { SlotManagement } from "@/components/time-slots/SlotManagement";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function ManageSlotsPage() {
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

            <SlotManagement />
        </div>
    );
}

export default ManageSlotsPage;
