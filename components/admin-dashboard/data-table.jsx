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
import { AssignSalesRepDialog } from "@/components/assign-sale-rep-dialog";
import { ChangeLeadStatusDialog } from "../change-lead-status-dialog";
import { changeLeadStatus } from "@/server/actions/change-lead-status";
import { Badge } from "../ui/badge";
import { colorMap } from "@/lib/utils";

export function DataTable({
    initialColumns,
    initialData,
    saleReps,
    assignLeadToSalesRep,
    statusOptions,
    timeOptions,
    canvasserOptions,
    salesRepOptions,
}) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [data, setData] = useState(initialData);

    const [columnVisibility, setColumnVisibility] = useState({
        createdAt: false,
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isChangeLeadStatusDialogOpen, setIsChangeLeadStatusDialogOpen] =
        useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [leadDetails, setLeadDetails] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [canvasserFilter, setCanvasserFilter] = useState("all");
    const [salesRepFilter, setSalesRepFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");
    const [dateSortOrder, setDateSortOrder] = useState("none");

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const filteredData = useMemo(() => {
        let result = data.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;
            const matchesCanvasser =
                canvasserFilter === "all" || item.canvasser === canvasserFilter;
            const matchesSalesRep =
                salesRepFilter === "all" || item.salesRep === salesRepFilter;
            const matchesTime =
                timeFilter === "all" ||
                item.appointmentDateTime.split(" at ")[1] === timeFilter;

            return (
                matchesStatus &&
                matchesCanvasser &&
                matchesSalesRep &&
                matchesTime
            );
        });

        if (dateSortOrder !== "none") {
            result.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateSortOrder === "oldToNew"
                    ? dateA - dateB
                    : dateB - dateA;
            });
        }

        return result;
    }, [
        data,
        statusFilter,
        canvasserFilter,
        salesRepFilter,
        timeFilter,
        dateSortOrder,
    ]);

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

    const handleAssignSalesRep = (lead) => {
        setSelectedLeadId(lead.id);
        setLeadDetails(lead);
        setIsAssignDialogOpen(true);
    };

    const handleAssignComplete = async (leadId, salesRepId) => {
        try {
            const updatedLead = await assignLeadToSalesRep(leadId, salesRepId);
            setData(
                data.map((lead) =>
                    lead.id === leadId
                        ? {
                              ...lead,
                              salesRep: `${updatedLead.salesRep.firstName} ${updatedLead.salesRep.lastName}`,
                              status: updatedLead.status,
                          }
                        : lead
                )
            );
            setIsAssignDialogOpen(false);
            setSelectedLeadId(null);
            setLeadDetails(null);
        } catch (error) {
            console.error("Error assigning lead:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    const handleColumnStatusChange = (lead) => {
        setSelectedLeadId(lead.id);
        setLeadDetails(lead);
        setIsChangeLeadStatusDialogOpen(true);
    };

    const handleDeleteLead = (id) => {
        setData(data.filter((lead) => lead.id !== id));
    };

    const columns = initialColumns.map((col) => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }) =>
                    col.cell({
                        row,
                        onAssignSalesRep: handleAssignSalesRep,
                        onDeleteLead: handleDeleteLead,
                        onStatusChange: handleColumnStatusChange,
                    }),
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
            <div className='flex items-center justify-between'>
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

                    <Select
                        onValueChange={setSalesRepFilter}
                        value={salesRepFilter || "all"}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filter by Sales Rep' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Sales Reps.</SelectItem>
                            {salesRepOptions.map((saleRep) => (
                                <SelectItem key={saleRep} value={saleRep}>
                                    {saleRep}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={setTimeFilter}
                        value={timeFilter || "all"}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filter by Time Slots' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>
                                Filter by Time Slots
                            </SelectItem>
                            {timeOptions.map((timeSlot) => (
                                <SelectItem key={timeSlot} value={timeSlot}>
                                    {timeSlot}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Select onValueChange={setDateSortOrder} value={dateSortOrder}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Sort by Date' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='none'>Sort</SelectItem>
                        <SelectItem value='oldToNew'>
                            Oldest to Newest
                        </SelectItem>
                        <SelectItem value='newToOld'>
                            Newest to Oldest
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='rounded-md border'>
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
                <AssignSalesRepDialog
                    isOpen={isAssignDialogOpen}
                    onClose={() => setIsAssignDialogOpen(false)}
                    leadId={selectedLeadId}
                    onAssign={handleAssignComplete}
                    saleReps={saleReps}
                    leadDetails={leadDetails}
                />
                <ChangeLeadStatusDialog
                    isOpen={isChangeLeadStatusDialogOpen}
                    onClose={() => setIsChangeLeadStatusDialogOpen(false)}
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
                    <span className='text-xs'>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
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
