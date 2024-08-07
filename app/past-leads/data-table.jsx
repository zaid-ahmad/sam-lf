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
import { useEffect, useMemo, useState } from "react";
import { isSameDay, parse, isWithinInterval } from "date-fns";
import { AssignSalesRepDialog } from "@/components/assign-sale-rep-dialog";
import { Badge } from "@/components/ui/badge";
import { colorMap } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeLeadStatusDialog } from "@/components/change-lead-status-dialog";
import { changeLeadStatus } from "@/server/actions/change-lead-status";

export function DataTable({
    initialColumns,
    initialData,
    statusOptions,
    canvasserOptions,
    salesPersonOptions,
    allBranches,
    isSuperAdmin,
    isCanvasser = false,
}) {
    const [sorting, setSorting] = useState([]);

    const [columnVisibility, setColumnVisibility] = useState({
        createdAt: false,
    });
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const [data, setData] = useState(initialData);

    const [isChangeLeadStatusDialogOpen, setIsChangeLeadStatusDialogOpen] =
        useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [leadDetails, setLeadDetails] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [canvasserFilter, setCanvasserFilter] = useState("all");
    const [salesRepFilter, setSalesRepFilter] = useState("all");
    const [branchFilter, setBranchFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [dateSortOrder, setDateSortOrder] = useState("oldToNew");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const filteredAndSortedData = useMemo(() => {
        // First, filter the data
        const filtered = data.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const matchesTime =
                timeFilter === "all" ||
                item.appointmentDateTime.split(" at ")[1] === timeFilter;

            let matchesCanvasser = true;
            let matchesBranch = true;
            let matchesDate = true;
            let matchesSalesRep = true;
            let matchesDateRange = true;

            if (!isCanvasser) {
                matchesCanvasser =
                    canvasserFilter === "all" ||
                    item.canvasser === canvasserFilter;

                matchesSalesRep =
                    salesRepFilter === "all" ||
                    item.salesRep === salesRepFilter;

                if (isSuperAdmin) {
                    matchesBranch =
                        branchFilter === "all" || item.branch === branchFilter;
                }
            }

            if (dateFilter && item.appointmentDateTime) {
                const appointmentDate = parse(
                    item.appointmentDateTime.split(" at ")[0],
                    "MMMM do, yyyy",
                    new Date()
                );
                const filterDate = parse(dateFilter, "yyyy-MM-dd", new Date());
                matchesDate = isSameDay(appointmentDate, filterDate);
            }

            if (startDate && endDate && item.appointmentDateTime) {
                const appointmentDate = parse(
                    item.appointmentDateTime.split(" at ")[0],
                    "MMMM do, yyyy",
                    new Date()
                );
                const start = parse(startDate, "yyyy-MM-dd", new Date());
                const end = parse(endDate, "yyyy-MM-dd", new Date());
                matchesDateRange = isWithinInterval(appointmentDate, {
                    start,
                    end,
                });
            }

            return (
                matchesStatus &&
                matchesCanvasser &&
                matchesBranch &&
                matchesSalesRep &&
                matchesDate &&
                matchesTime &&
                matchesDateRange
            );
        });

        // Then, sort the filtered data if necessary
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
    }, [
        data,
        statusFilter,
        canvasserFilter,
        branchFilter,
        dateFilter,
        isSuperAdmin,
        isCanvasser,
        salesRepFilter,
        timeFilter,
        dateSortOrder,
        startDate,
        endDate,
    ]);

    const handleDeleteLead = (id) => {
        setData(data.filter((lead) => lead.id !== id));
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
        setSelectedLeadId(null);
        setLeadDetails(null);
    };

    const handleColumnStatusChange = (lead) => {
        setSelectedLeadId(lead.id);
        setLeadDetails(lead);
        setIsChangeLeadStatusDialogOpen(true);
    };

    const columns = initialColumns.map((col) => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }) =>
                    col.cell({
                        row,
                        isCanvasser: isCanvasser,
                        onStatusChange: handleColumnStatusChange,
                        onDeleteLead: handleDeleteLead,
                    }),
            };
        }
        return col;
    });

    const table = useReactTable({
        data: filteredAndSortedData,
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
        pageCount: Math.ceil(
            filteredAndSortedData.length / pagination.pageSize
        ),
    });

    return (
        <div>
            <div className='flex flex-col space-y-6 mt-7 mb-4'>
                <div className='flex flex-wrap gap-4 items-end'>
                    <div className='flex-1 min-w-[180px]'>
                        <Label htmlFor='statusFilter' className='mb-2 block'>
                            Status
                        </Label>
                        <Select
                            onValueChange={setStatusFilter}
                            value={statusFilter || "all"}
                        >
                            <SelectTrigger id='statusFilter' className='w-full'>
                                <SelectValue placeholder='Filter by Status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>
                                    All Statuses
                                </SelectItem>
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
                    </div>

                    {!isCanvasser && (
                        <>
                            {canvasserOptions && (
                                <div className='flex-1 min-w-[180px]'>
                                    <Label
                                        htmlFor='canvasserFilter'
                                        className='mb-2 block'
                                    >
                                        Canvasser
                                    </Label>
                                    <Select
                                        onValueChange={setCanvasserFilter}
                                        value={canvasserFilter || "all"}
                                    >
                                        <SelectTrigger
                                            id='canvasserFilter'
                                            className='w-full'
                                        >
                                            <SelectValue placeholder='Filter by Canvasser' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>
                                                All Canvassers
                                            </SelectItem>
                                            {canvasserOptions.map(
                                                (canvasser) => (
                                                    <SelectItem
                                                        key={canvasser}
                                                        value={canvasser}
                                                    >
                                                        {canvasser}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {salesPersonOptions && (
                                <div className='flex-1 min-w-[180px]'>
                                    <Label
                                        htmlFor='salesRepFilter'
                                        className='mb-2 block'
                                    >
                                        Sales Rep
                                    </Label>
                                    <Select
                                        onValueChange={setSalesRepFilter}
                                        value={salesRepFilter || "all"}
                                    >
                                        <SelectTrigger
                                            id='salesRepFilter'
                                            className='w-full'
                                        >
                                            <SelectValue placeholder='Filter by Sales Rep.' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>
                                                All Sales Reps.
                                            </SelectItem>
                                            {salesPersonOptions.map(
                                                (salesPerson) => (
                                                    <SelectItem
                                                        key={salesPerson}
                                                        value={salesPerson}
                                                    >
                                                        {salesPerson}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {isSuperAdmin && allBranches && (
                                <div className='flex-1 min-w-[180px]'>
                                    <Label
                                        htmlFor='branchFilter'
                                        className='mb-2 block'
                                    >
                                        Branch
                                    </Label>
                                    <Select
                                        onValueChange={setBranchFilter}
                                        value={branchFilter || "all"}
                                    >
                                        <SelectTrigger
                                            id='branchFilter'
                                            className='w-full'
                                        >
                                            <SelectValue placeholder='Filter by Branch' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>
                                                All Branches
                                            </SelectItem>
                                            {allBranches.map((branch) => (
                                                <SelectItem
                                                    key={branch.code}
                                                    value={branch.code}
                                                >
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className='flex flex-wrap gap-4 items-end'>
                    <div className='flex-1 min-w-[180px]'>
                        <Label htmlFor='dateFilter' className='mb-2 block'>
                            Filter by Date
                        </Label>
                        <Input
                            type='date'
                            id='dateFilter'
                            onChange={(e) => setDateFilter(e.target.value)}
                            value={dateFilter}
                        />
                    </div>
                    <div className='flex-1 min-w-[320px]'>
                        <Label htmlFor='dateRangeFilter' className='mb-2 block'>
                            Filter by Date Range
                        </Label>
                        <div
                            className='flex items-center space-x-2'
                            id='dateRangeFilter'
                        >
                            <Input
                                type='date'
                                placeholder='Start Date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='flex-1'
                            />
                            <span>to</span>
                            <Input
                                type='date'
                                placeholder='End Date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='flex-1'
                            />
                        </div>
                    </div>
                    <div className='flex-1 min-w-[180px] ml-auto'>
                        <Label htmlFor='dateSortOrder' className='mb-2 block'>
                            Sort by
                        </Label>
                        <Select
                            onValueChange={setDateSortOrder}
                            value={dateSortOrder}
                        >
                            <SelectTrigger
                                id='dateSortOrder'
                                className='w-full'
                            >
                                <SelectValue placeholder='Sort by Date' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='oldToNew'>
                                    Oldest to Newest
                                </SelectItem>
                                <SelectItem value='newToOld'>
                                    Newest to Oldest
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                {!isCanvasser && (
                    <ChangeLeadStatusDialog
                        isOpen={isChangeLeadStatusDialogOpen}
                        onClose={() => setIsChangeLeadStatusDialogOpen(false)}
                        leadId={selectedLeadId}
                        onStatusChange={handleLeadStatusChange}
                        leadDetails={leadDetails}
                    />
                )}
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
