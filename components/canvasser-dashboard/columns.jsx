"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { colorMap } from "@/lib/utils";

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
        cell: ({ row }) => {
            return <p className='capitalize'>{row.getValue("customerName")}</p>;
        },
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
                        <a href={`/leads/${lead.id}`}>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
