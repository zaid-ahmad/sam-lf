import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Loading() {
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

            <Card className='w-full max-w-4xl mx-auto mt-4 sm:mt-7 p-4 sm:p-6 md:p-8'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold'>
                        <Skeleton className='h-9 w-40' />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-6 sm:space-y-8'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            {[...Array(10)].map((_, index) => (
                                <div key={index} className='space-y-2'>
                                    <Skeleton className='h-4 w-20' />
                                    <Skeleton className='h-10 w-full' />
                                </div>
                            ))}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Skeleton className='h-16 w-full' />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className='space-y-2'>
                                    <Skeleton className='h-4 w-20' />
                                    <Skeleton className='h-10 w-full' />
                                </div>
                            ))}
                        </div>

                        <Skeleton className='h-10 w-full' />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
