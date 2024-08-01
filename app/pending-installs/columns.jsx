"use client";

import { formatPrice } from "@/lib/utils";

export const columns = [
    {
        accessorKey: "jobNumber",
        header: "Job Number",
    },
    {
        accessorKey: "appointmentDateTime",
        header: "Appointment Date & Time",
    },
    {
        accessorKey: "canvasser",
        header: "Canvasser",
    },
    {
        accessorKey: "installationDate",
        header: "Installation Date",
    },
    {
        accessorKey: "amount",
        header: "Price",
        cell: ({ row }) => `${formatPrice(row.original.amount)}`,
    },
    {
        accessorKey: "commission_amount",
        header: "Commission",
        cell: ({ row }) =>
            `${formatPrice(Math.ceil(row.original.amount * 0.02))}`,
    },
    {
        accessorKey: "funded",
        header: "Funded",
        cell: ({ row }) => (row.original.funded ? "Yes" : "No"),
    },
    {
        accessorKey: "branch",
        header: "Branch",
    },
];
