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
    // Function to format time to 12-hour AM/PM format
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":");
        let hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'
        return `${hour}:${minutes} ${ampm}`;
    };
    return (
        <Table className='mt-8'>
            <TableHeader>
                <TableRow>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {slots.map((slot) => (
                    <TableRow key={slot.id}>
                        <TableCell>{formatTime(slot.timeSlot)}</TableCell>
                        <TableCell>{slot.limit}</TableCell>
                        <TableCell className='space-x-2'>
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
