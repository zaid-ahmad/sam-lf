"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { isSameDay, parse } from "date-fns";

export function DataTable({ columns, data, statusOptions, canvasserOptions }) {
    const [sorting, setSorting] = useState([]);

    const [statusFilter, setStatusFilter] = useState("all");
    const [canvasserFilter, setCanvasserFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;
            const matchesCanvasser =
                canvasserFilter === "all" || item.canvasser === canvasserFilter;

            let matchesDate = true;
            if (dateFilter && item.appointmentDateTime) {
                const appointmentDate = parse(
                    item.appointmentDateTime.split(" at ")[0],
                    "MMMM do, yyyy",
                    new Date()
                );
                const filterDate = parse(dateFilter, "yyyy-MM-dd", new Date());
                matchesDate = isSameDay(appointmentDate, filterDate);
            }

            return matchesStatus && matchesCanvasser && matchesDate;
        });
    }, [data, statusFilter, canvasserFilter, dateFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div>
            <div className='flex space-x-4 mt-7 mb-4'>
                <Select
                    onValueChange={setStatusFilter}
                    value={statusFilter || "all"}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Filter by Status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Statuses</SelectItem>
                        {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {canvasserOptions && (
                    <Select
                        onValueChange={setCanvasserFilter}
                        value={canvasserFilter || "all"}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filter by Canvasser' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Canvassers</SelectItem>
                            {canvasserOptions.map((canvasser) => (
                                <SelectItem key={canvasser} value={canvasser}>
                                    {canvasser}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <input
                    type='date'
                    onChange={(e) => setDateFilter(e.target.value)}
                    value={dateFilter}
                    className='border rounded p-2'
                />
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
