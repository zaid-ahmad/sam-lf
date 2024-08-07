import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Loading = () => {
    return (
        <div className='container pt-5 bg-zinc-50'>
            <Breadcrumb className='my-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard'>
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Past Leads</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='my-5 text-2xl font-bold'>Past Leads</h1>
            <div className='flex flex-col space-y-6 mt-7 mb-4'>
                <div className='flex flex-wrap gap-4 items-end'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='flex-1 min-w-[180px]'>
                            <Label className='mb-2 block'>
                                <Skeleton className='h-4 w-20' />
                            </Label>
                            <Skeleton className='h-10 w-full' />
                        </div>
                    ))}
                </div>

                <div className='flex flex-wrap gap-4 items-end'>
                    <div className='flex-1 min-w-[180px]'>
                        <Label className='mb-2 block'>
                            <Skeleton className='h-4 w-24' />
                        </Label>
                        <Skeleton className='h-10 w-full' />
                    </div>
                    <div className='flex-1 min-w-[320px]'>
                        <Label className='mb-2 block'>
                            <Skeleton className='h-4 w-36' />
                        </Label>
                        <div className='flex items-center space-x-2'>
                            <Skeleton className='h-10 flex-1' />
                            <Skeleton className='h-4 w-4' />
                            <Skeleton className='h-10 flex-1' />
                        </div>
                    </div>
                    <div className='flex-1 min-w-[180px] ml-auto'>
                        <Label className='mb-2 block'>
                            <Skeleton className='h-4 w-16' />
                        </Label>
                        <Skeleton className='h-10 w-full' />
                    </div>
                </div>
            </div>
            <div className='rounded-md border my-7'>
                <Table className='bg-white rounded-lg'>
                    <TableHeader>
                        <TableRow>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TableHead key={i}>
                                    <Skeleton className='h-6 w-24' />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                {[1, 2, 3, 4, 5, 6].map((cell) => (
                                    <TableCell key={cell}>
                                        <Skeleton className='h-4 w-full' />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className='flex items-center justify-end space-x-2 py-4'>
                    <Button variant='outline' size='sm' disabled>
                        Previous
                    </Button>
                    <Button variant='outline' size='sm' disabled>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Loading;
