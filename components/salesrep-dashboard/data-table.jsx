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

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { ChangeLeadStatusDialog } from "../change-lead-status-dialog";
import { Badge } from "../ui/badge";
import { colorMap } from "@/lib/utils";

export function DataTable({
    initialColumns,
    initialData,
    changeLeadStatus,
    statusOptions,
}) {
    const [data, setData] = useState(initialData);

    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({
        createdAt: false,
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const [sorting, setSorting] = useState([]);

    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [leadDetails, setLeadDetails] = useState(null);

    const [timeFilter, setTimeFilter] = useState("all");
    const [dateSortOrder, setDateSortOrder] = useState("none");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const filteredData = useMemo(() => {
        const filtered = data.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const matchesTime =
                timeFilter === "all" ||
                item.appointmentDateTime.split(" at ")[1] === timeFilter;

            return matchesStatus && matchesTime;
        });

        if (dateSortOrder !== "none") {
            return filtered.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateSortOrder === "oldToNew"
                    ? dateA - dateB
                    : dateB - dateA;
            });
        }

        // If no sorting is needed, return the filtered data as is
        return filtered;
    }, [data, statusFilter, timeFilter, dateSortOrder]);

    const handleColumnStatusChange = (lead) => {
        setSelectedLeadId(lead.id);
        setLeadDetails(lead);
        setIsAssignDialogOpen(true);
    };

    const handleLeadStatusChange = async (leadId, action, formData) => {
        const updatedData = await changeLeadStatus(leadId, action, formData);
        setData(
            data.map((lead) =>
                lead.id === leadId
                    ? {
                          ...lead,
                          salesRep:
                              updatedData.salesRep.firstName +
                              " " +
                              updatedData.salesRep.lastName,

                          status: updatedData.status,
                      }
                    : lead
            )
        );
        setIsAssignDialogOpen(false);
        setSelectedLeadId(null);
        setLeadDetails(null);
    };

    const columns = initialColumns.map((col) => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }) =>
                    col.cell({ row, onStatusChange: handleColumnStatusChange }),
            };
        }
        return col;
    });

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
        },
        pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    });

    return (
        <div>
            <div className='flex items-center gap-3 mt-7 mb-4'>
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
                                <Badge
                                    variant='outline'
                                    className={`bg-${colorMap[status]}-100 text-${colorMap[status]}-800 border-${colorMap[status]}-300`}
                                >
                                    {status === "INSTALL_CANCELLED"
                                        ? "INSTALL CANCELLED"
                                        : status}
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={setDateSortOrder} value={dateSortOrder}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Sort by Date' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='none'>Sort by</SelectItem>
                        <SelectItem value='oldToNew'>
                            Oldest to Newest
                        </SelectItem>
                        <SelectItem value='newToOld'>
                            Newest to Oldest
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='rounded-md border my-7'>
                <Table className='bg-white rounded-lg'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
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
                <ChangeLeadStatusDialog
                    isOpen={isAssignDialogOpen}
                    onClose={() => setIsAssignDialogOpen(false)}
                    leadId={selectedLeadId}
                    onStatusChange={handleLeadStatusChange}
                    leadDetails={leadDetails}
                />
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
