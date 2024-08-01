"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlotForm } from "./SlotForm";
import { SlotTable } from "./SlotTable";

export function SlotManagement() {
    const [slots, setSlots] = useState([]);
    const [editingSlot, setEditingSlot] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        // Fetch slots from API
        // setSlots(fetchedSlots)
    }, []);

    const handleCreate = (newSlot) => {
        // API call to create slot
        // Then update slots state
        setSlots([...slots, { ...newSlot, id: "temp-id" }]);
        setIsFormOpen(false);
    };

    const handleUpdate = (updatedSlot) => {
        // API call to update slot
        // Then update slots state
        setSlots(
            slots.map((slot) =>
                slot.id === updatedSlot.id ? updatedSlot : slot
            )
        );
        setEditingSlot(null);
        setIsFormOpen(false);
    };

    const handleDelete = (id) => {
        // API call to delete slot
        // Then update slots state
        setSlots(slots.filter((slot) => slot.id !== id));
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
