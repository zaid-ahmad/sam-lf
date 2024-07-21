"use client";

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
        accessorKey: "installationDate",
        header: "Installation Date",
    },
    {
        accessorKey: "amount",
        header: "Price",
        cell: ({ row }) => `$${row.original.amount}`,
    },
    {
        accessorKey: "funded",
        header: "Funded",
        cell: ({ row }) => (row.original.funded ? "Yes" : "No"),
    },
];
