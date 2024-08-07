import { Skeleton } from "@/components/ui/skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Loading = () => {
    return (
        <div className='container'>
            <Breadcrumb className='my-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard'>
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>View Pending Installs</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className='my-5 text-2xl font-bold'>Pending Installs</h1>

            <div className='flex space-x-4 mb-4'>
                <Skeleton className='h-10 w-[200px]' />
                <Skeleton className='h-10 w-[200px]' />
                <div className='flex space-x-4'>
                    <Skeleton className='h-10 w-[150px]' />
                    <Skeleton className='h-10 w-4' />
                    <Skeleton className='h-10 w-[150px]' />
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
                                {[1, 2, 3, 4, 5].map((cell) => (
                                    <TableCell key={cell}>
                                        <Skeleton className='h-4 w-full' />
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <Skeleton className='h-8 w-24' />
                                </TableCell>
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
