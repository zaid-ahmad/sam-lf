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

export function AssignSalesRepDialog({
    saleReps,
    isOpen,
    onClose,
    leadId,
    onAssign,
    leadDetails,
}) {
    const [selectedRep, setSelectedRep] = useState("");

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

                {leadDetails && (
                    <div className='my-3'>
                        <h3 className='font-semibold text-sm mb-2'>
                            Appointment Details
                        </h3>
                        <div className='p-3 bg-zinc-50 rounded-lg text-xs grid grid-cols-2'>
                            <div className='flex flex-col gap-3'>
                                <span>Appointment Date:</span>
                                <span>Address:</span>
                                <span>Quadrant:</span>
                                <span>Homeowner Type:</span>
                                <span>Canvasser:</span>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <span>{leadDetails.appointmentDateTime}</span>
                                <span>{leadDetails.address}</span>
                                <span>{leadDetails.quadrant}</span>
                                <span>{leadDetails.homeOwnerType}</span>
                                <span>{leadDetails.canvasser}</span>
                            </div>
                        </div>
                    </div>
                )}

                <Select onValueChange={setSelectedRep} value={selectedRep}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select a sales rep' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {saleReps.map((rep) => (
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
