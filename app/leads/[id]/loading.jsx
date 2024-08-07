import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Loading = () => {
    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <Breadcrumb className='mb-4 sm:mb-10 max-w-3xl mx-auto'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <div className='h-4 w-20 bg-gray-200 animate-pulse rounded'></div>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <div className='h-4 w-40 bg-gray-200 animate-pulse rounded'></div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className='w-full max-w-3xl mx-auto'>
                <CardHeader>
                    <CardTitle className='text-xl sm:text-2xl font-bold'>
                        <div className='h-8 w-48 bg-gray-200 animate-pulse rounded'></div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <div className='h-4 w-24 bg-gray-200 animate-pulse rounded mb-2'></div>
                                <div className='h-4 w-32 bg-gray-200 animate-pulse rounded'></div>
                            </div>
                        ))}
                    </div>

                    <Separator className='my-4' />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <div className='h-4 w-24 bg-gray-200 animate-pulse rounded mb-2'></div>
                                <div className='h-4 w-48 bg-gray-200 animate-pulse rounded'></div>
                                <div className='h-4 w-40 bg-gray-200 animate-pulse rounded mt-2'></div>
                            </div>
                        ))}
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <div className='h-4 w-32 bg-gray-200 animate-pulse rounded mb-2'></div>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className='h-6 w-20 bg-gray-200 animate-pulse rounded'
                                ></div>
                            ))}
                        </div>
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <div className='h-4 w-24 bg-gray-200 animate-pulse rounded mb-2'></div>
                        <div className='flex flex-wrap gap-2 my-3'>
                            {[...Array(2)].map((_, index) => (
                                <div
                                    key={index}
                                    className='h-40 w-full sm:w-48 bg-gray-200 animate-pulse rounded'
                                ></div>
                            ))}
                        </div>
                    </div>

                    <Separator className='my-4' />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {[...Array(6)].map((_, index) => (
                            <div key={index}>
                                <div className='h-4 w-24 bg-gray-200 animate-pulse rounded mb-2'></div>
                                <div className='h-4 w-32 bg-gray-200 animate-pulse rounded'></div>
                            </div>
                        ))}
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <div className='h-4 w-24 bg-gray-200 animate-pulse rounded mb-2'></div>
                        <ul className='list-disc pl-5 mt-2'>
                            {[...Array(3)].map((_, index) => (
                                <li
                                    key={index}
                                    className='h-4 w-40 bg-gray-200 animate-pulse rounded mb-2'
                                ></li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Loading;
