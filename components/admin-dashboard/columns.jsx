"use client";

import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import parseAppointmentDateTime from "@/lib/formatDateTime";
import { Badge } from "@/components/ui/badge";
import { deleteLead } from "@/server/actions/delete-lead";
import Link from "next/link";

export const columns = [
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue("status") || "UNASSIGNED";

            // Define color based on status
            const colorMap = {
                APPOINTMENT: "blue",
                ASSIGNED: "yellow",
                DEMO: "purple",
                SALE: "green",
                DEAD: "red",
                UNASSIGNED: "gray",
                REBOOK: "pink",
            };

            return (
                <Badge
                    variant='outline'
                    className={`bg-${colorMap[status]}-100 text-${colorMap[status]}-800 border-${colorMap[status]}-300`}
                >
                    {status}
                </Badge>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            const statusOrder = [
                "APPOINTMENT",
                "ASSIGNED",
                "DEMO",
                "SOLD",
                "DEAD",
                "UNASSIGNED",
            ];
            const statusA = rowA.getValue(columnId) || "UNASSIGNED";
            const statusB = rowB.getValue(columnId) || "UNASSIGNED";
            return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
        },
    },
    {
        accessorKey: "homeOwnerType",
        header: "Home Owner Type",
    },
    {
        accessorKey: "quadrant",
        header: "Quadrant",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "canvasser",
        header: "Canvasser",
    },
    {
        accessorKey: "salesRep",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Sales Rep.
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => {
            const salesRep = row.getValue("salesRep");
            return salesRep === null ? (
                <p className='text-red-500'>Not Assigned</p>
            ) : (
                salesRep
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            const repA = rowA.getValue(columnId);
            const repB = rowB.getValue(columnId);
            if (repA === null && repB === null) return 0;
            if (repA === null) return 1;
            if (repB === null) return -1;
            return repA.localeCompare(repB);
        },
    },
    {
        accessorKey: "appointmentDateTime",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Appointment
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("appointmentDateTime");
        },
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = parseAppointmentDateTime(rowA.getValue(columnId));
            const dateB = parseAppointmentDateTime(rowB.getValue(columnId));
            return dateA.getTime() - dateB.getTime();
        },
    },
    {
        id: "actions",
        cell: ({ row, onAssignSalesRep, onDeleteLead }) => {
            const lead = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <a href={`/leads/${lead.id}`}>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                        </a>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                onAssignSalesRep(lead);
                            }}
                        >
                            Assign sales rep.
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <form
                                action={async (formData) => {
                                    await deleteLead(formData);
                                    onDeleteLead(lead.id);
                                }}
                                className='group-hover:text-red-900 flex items-center justify-between w-full'
                            >
                                <input
                                    type='hidden'
                                    name='id'
                                    value={lead.id}
                                    readOnly
                                />
                                <input
                                    type='hidden'
                                    name='inPastLeads'
                                    value={false}
                                    readOnly
                                />
                                <button
                                    type='submit'
                                    className='w-full text-left flex items-center justify-between'
                                >
                                    Delete
                                    <Trash
                                        size={14}
                                        className='group-hover:text-red-900'
                                    />
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
