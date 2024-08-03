"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlotForm } from "./SlotForm";
import { SlotTable } from "./SlotTable";
import {
    getSlots,
    createSlot,
    updateSlot,
    deleteSlot,
} from "@/server/actions/slotActions";

export function SlotManagement() {
    const [slots, setSlots] = useState([]);
    const [editingSlot, setEditingSlot] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [branchCode, setBranchCode] = useState("");

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        const result = await getSlots();
        if (result.success) {
            setSlots(result.data);
            setBranchCode(result.branchCode);
        } else {
            console.error(result.error);
            // Handle error, maybe set an error state and display to user
        }
    };

    const handleCreate = async (newSlot) => {
        const result = await createSlot(newSlot);
        if (result.success) {
            setSlots([...slots, result.data]);
            setIsFormOpen(false);
        } else {
            console.error(result.error);
            // Handle error, maybe set an error state and display to user
        }
    };

    const handleUpdate = async (updatedSlot) => {
        const result = await updateSlot(updatedSlot.id, updatedSlot);
        if (result.success) {
            setSlots(
                slots.map((slot) =>
                    slot.id === result.data.id ? result.data : slot
                )
            );
            setEditingSlot(null);
            setIsFormOpen(false);
        } else {
            console.error(result.error);
            // Handle error, maybe set an error state and display to user
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteSlot(id);
        if (result.success) {
            setSlots(slots.filter((slot) => slot.id !== id));
        } else {
            console.error(result.error);
            // Handle error, maybe set an error state and display to user
        }
    };

    return (
        <div className='p-8'>
            <Button onClick={() => setIsFormOpen(true)}>Create New Slot</Button>
            {isFormOpen && (
                <SlotForm
                    onSubmit={editingSlot ? handleUpdate : handleCreate}
                    initialData={editingSlot}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingSlot(null);
                    }}
                    branchCode={branchCode}
                />
            )}
            <SlotTable
                slots={slots}
                onEdit={(slot) => {
                    setEditingSlot(slot);
                    setIsFormOpen(true);
                }}
                onDelete={handleDelete}
            />
        </div>
    );
}
