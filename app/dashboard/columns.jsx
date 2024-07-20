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

export const columns = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") || "UNASSIGNED";

            // Define color based on status
            const colorMap = {
                APPOINTMENT: "blue",
                ASSIGNED: "yellow",
                DEMO: "purple",
                SOLD: "green",
                DEAD: "red",
                UNASSIGNED: "gray",
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
        header: "Sales Rep.",
        cell: ({ row }) => {
            const salesRep = row.getValue("salesRep");
            return salesRep === null ? (
                <>
                    <p className='text-red-500'>Not Assigned</p>
                </>
            ) : (
                salesRep
            );
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
        cell: ({ row, onAssignSalesRep }) => {
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
                        <DropdownMenuItem>View lead details</DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                onAssignSalesRep(lead.id);
                            }}
                        ></DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    lead.id.toString()
                                )
                            }
                            className='group'
                        >
                            <span className='group-hover:text-red-900 flex items-center justify-between w-full'>
                                <span>Delete</span>
                                <Trash
                                    size={14}
                                    className='group-hover:text-red-900'
                                />
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
