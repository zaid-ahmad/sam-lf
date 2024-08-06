"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorMap } from "@/lib/utils";
import { deleteLead } from "@/server/actions/delete-lead";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";

export const columns = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") || "UNASSIGNED";

            return (
                <Badge
                    variant='outline'
                    className={`bg-${colorMap[status]}-100 text-${colorMap[status]}-800 border-${colorMap[status]}-300`}
                >
                    {status === "INSTALL_CANCELLED"
                        ? "INSTALL CANCELLED"
                        : status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "customerName",
        header: "Customer Name",
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
        accessorKey: "createdAt",
        header: "createdAt",
    },
    {
        accessorKey: "salesRep",
        header: "Sales Rep.",
        cell: ({ row }) => {
            const salesRep = row.getValue("salesRep");
            return salesRep === null ? (
                <p className='text-red-500'>Not Assigned</p>
            ) : (
                salesRep
            );
        },
    },
    {
        accessorKey: "appointmentDateTime",
        header: "Appointment Date & Time",
        cell: ({ row }) => {
            return row.getValue("appointmentDateTime");
        },
    },
    {
        accessorKey: "branch",
        header: "Branch",
    },
    {
        id: "actions",
        cell: ({ row, isCanvasser, onAssignSalesRep, onDeleteLead }) => {
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
                        <Link href={`/leads/${lead.id}`} target='_blank'>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                        </Link>
                        {!isCanvasser ? (
                            <>
                                <Link
                                    href={`/leads/edit/${lead.id}`}
                                    target='_blank'
                                >
                                    <DropdownMenuItem>
                                        Edit details
                                    </DropdownMenuItem>
                                </Link>
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
                            </>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
