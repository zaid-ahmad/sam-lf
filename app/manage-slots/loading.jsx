import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
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
                        <BreadcrumbPage>Manage Time Slots</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className='my-5 text-2xl font-bold'>Manage Time Slots</h1>

            <Table className='mt-8'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time Slot</TableHead>
                        <TableHead>Limit</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className='h-6 w-24' />
                            </TableCell>
                            <TableCell>
                                <Skeleton className='h-6 w-12' />
                            </TableCell>
                            <TableCell className='space-x-2'>
                                <Button disabled className='opacity-50'>
                                    Edit
                                </Button>
                                <Button
                                    variant='destructive'
                                    disabled
                                    className='opacity-50'
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
