"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatTimeto12Hour } from "@/lib/utils";

export function SlotTable({ slots, onEdit, onDelete }) {
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
                        <TableCell>
                            {formatTimeto12Hour(slot.timeSlot)}
                        </TableCell>
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
