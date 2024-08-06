"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

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
import { useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { parse } from "date-fns";
import { markPaid } from "@/server/actions/mark-paid";

export function PendingCommissionsTable({
    columns,
    initialData,
    canvasserNames,
    allBranches,
    role,
}) {
    const [sorting, setSorting] = useState([]);
    const [data, setData] = useState(initialData);

    const [columnVisibility, setColumnVisibility] = useState({
        createdAt: false,
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const [canvasserFilter, setCanvasserFilter] = useState("all");
    const [branchFilter, setBranchFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesCanvasser =
                canvasserFilter === "all" || item.canvasser === canvasserFilter;
            const matchesBranch =
                branchFilter === "all" || item.branch === branchFilter;

            let matchesDateRange = true;
            if (startDate || endDate) {
                const itemDate = parse(
                    item.appointmentDateTime.split(" at ")[0],
                    "MMMM do, yyyy",
                    new Date()
                );
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                matchesDateRange =
                    (!start || itemDate >= start) && (!end || itemDate <= end);
            }

            return matchesCanvasser && matchesBranch && matchesDateRange;
        });
    }, [data, canvasserFilter, branchFilter, startDate, endDate]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnVisibility,
            pagination,
        },
        pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    });

    const handleMarkAsFunded = async (id) => {
        try {
            await markPaid(id);
            setData(
                data.map((lead) =>
                    lead.id === id ? { ...lead, commissionPaid: true } : lead
                )
            );
        } catch (error) {
            console.error("Error marking lead as commission paid:", error);
        }
    };

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
                        <BreadcrumbPage>
                            View Pending Commissions
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className='my-5 text-2xl font-bold'>Pending Commissions</h1>

            <div className='flex space-x-4 mb-4'>
                {role === "SUPERADMIN" ||
                    (role === "ADMIN" && (
                        <Select
                            onValueChange={setCanvasserFilter}
                            value={canvasserFilter}
                        >
                            <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='Filter by Canvasser' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>
                                    All Canvassers
                                </SelectItem>
                                {canvasserNames.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                {role === "SUPERADMIN" && (
                    <Select
                        onValueChange={setBranchFilter}
                        value={branchFilter}
                    >
                        <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Filter by Branch' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Branches</SelectItem>
                            {allBranches.map(({ code, name }) => (
                                <SelectItem key={code} value={code}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <div className='flex space-x-4'>
                    <Input
                        type='date'
                        placeholder='Start Date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className='my-auto'>to</span>
                    <Input
                        type='date'
                        placeholder='End Date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            <div className='rounded-md border my-7'>
                <Table className='bg-white rounded-lg'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        {(role === "ADMIN" ||
                                            role === "SUPERADMIN") &&
                                            !row.original.commissionPaid && (
                                                <Button
                                                    onClick={() =>
                                                        handleMarkAsFunded(
                                                            row.original.id
                                                        )
                                                    }
                                                >
                                                    Mark as Paid
                                                </Button>
                                            )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className='flex items-center justify-end space-x-2 py-4'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
