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
import { isSameDay, parse } from "date-fns";
import { AssignSalesRepDialog } from "@/components/assign-sale-rep-dialog";

export function DataTable({
    initialColumns,
    initialData,
    saleReps,
    assignLeadToSalesRep,
    statusOptions,
    canvasserOptions,
    allBranches,
    isSuperAdmin,
    isCanvasser = false,
}) {
    const [sorting, setSorting] = useState([]);
    const [data, setData] = useState(initialData);

    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [leadDetails, setLeadDetails] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [canvasserFilter, setCanvasserFilter] = useState("all");
    const [branchFilter, setBranchFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            let matchesCanvasser = true;
            let matchesBranch = true;
            let matchesDate = true;

            if (!isCanvasser) {
                matchesCanvasser =
                    canvasserFilter === "all" ||
                    item.canvasser === canvasserFilter;

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

            return (
                matchesStatus &&
                matchesCanvasser &&
                matchesBranch &&
                matchesDate
            );
        });
    }, [
        data,
        statusFilter,
        canvasserFilter,
        branchFilter,
        dateFilter,
        isSuperAdmin,
        isCanvasser,
    ]);

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
                {!isCanvasser && (
                    <>
                        {canvasserOptions && (
                            <Select
                                onValueChange={setCanvasserFilter}
                                value={canvasserFilter || "all"}
                            >
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder='Filter by Canvasser' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>
                                        All Canvassers
                                    </SelectItem>
                                    {canvasserOptions.map((canvasser) => (
                                        <SelectItem
                                            key={canvasser}
                                            value={canvasser}
                                        >
                                            {canvasser}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {isSuperAdmin && allBranches && (
                            <Select
                                onValueChange={setBranchFilter}
                                value={branchFilter || "all"}
                            >
                                <SelectTrigger className='w-[180px]'>
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
                        )}
                    </>
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
                {!isCanvasser && (
                    <AssignSalesRepDialog
                        isOpen={isAssignDialogOpen}
                        onClose={() => setIsAssignDialogOpen(false)}
                        leadId={selectedLeadId}
                        onAssign={handleAssignComplete}
                        saleReps={saleReps}
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
