"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function AssignSalesRepDialog({ isOpen, onClose, leadId, onAssign }) {
    const [salesReps, setSalesReps] = useState([]);
    const [selectedRep, setSelectedRep] = useState("");

    useEffect(() => {
        async function fetchSalesReps() {
            const response = await fetch("/api/salesReps");
            const data = await response.json();
            setSalesReps(data);
        }
        if (isOpen) {
            fetchSalesReps();
        }
    }, [isOpen]);

    const handleAssign = () => {
        onAssign(leadId, selectedRep);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Sales Representative</DialogTitle>
                    <DialogDescription>
                        Assign a sales representative to this appointment by
                        selecting their name from the dropdown menu.
                    </DialogDescription>
                </DialogHeader>
                <Select onValueChange={setSelectedRep} value={selectedRep}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select a sales rep' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {salesReps.map((rep) => (
                                <SelectItem
                                    key={rep.id}
                                    value={rep.id.toString()}
                                >
                                    {rep.firstName} {rep.lastName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={!selectedRep}>
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
