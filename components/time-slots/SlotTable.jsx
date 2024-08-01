"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function SlotTable({ slots, onEdit, onDelete }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Booked</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {slots.map((slot) => (
                    <TableRow key={slot.id}>
                        <TableCell>{slot.branchCode}</TableCell>
                        <TableCell>{slot.date}</TableCell>
                        <TableCell>{slot.timeSlot}</TableCell>
                        <TableCell>{slot.limit}</TableCell>
                        <TableCell>{slot.booked}</TableCell>
                        <TableCell>
                            <Button onClick={() => onEdit(slot)}>Edit</Button>
                            <Button
                                variant='destructive'
                                onClick={() => onDelete(slot.id)}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
