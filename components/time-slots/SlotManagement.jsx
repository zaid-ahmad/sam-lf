"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlotForm } from "./SlotForm";
import { SlotTable } from "./SlotTable";
import {
    getSlots,
    createSlot,
    updateSlot,
    deleteSlot,
} from "@/server/actions/slotActions";
import BranchSelector from "./branch-selector";

export function SlotManagement({ session, branches, userBranch }) {
    const [slots, setSlots] = useState([]);
    const [editingSlot, setEditingSlot] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(userBranch || "");

    const isSuperAdmin = session?.user?.role === "SUPERADMIN";

    useEffect(() => {
        if (selectedBranch) {
            fetchSlots(selectedBranch);
        }
    }, [selectedBranch]);

    const fetchSlots = async (branchCode) => {
        const result = await getSlots(branchCode);
        if (result.success) {
            setSlots(result.data);
        } else {
            console.error(result.error);
        }
    };

    const handleCreate = async (newSlot) => {
        const result = await createSlot({
            ...newSlot,
            branchCode: selectedBranch,
        });
        if (result.success) {
            setSlots([...slots, result.data]);
            setIsFormOpen(false);
        } else {
            console.error(result.error);
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
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteSlot(id);
        if (result.success) {
            setSlots(slots.filter((slot) => slot.id !== id));
        } else {
            console.error(result.error);
        }
    };

    const handleBranchChange = (branchCode) => {
        setSelectedBranch(branchCode);
    };

    return (
        <div className='p-8'>
            {isSuperAdmin && (
                <BranchSelector
                    branches={branches}
                    selectedBranch={selectedBranch}
                    onBranchChange={handleBranchChange}
                />
            )}
            <Button onClick={() => setIsFormOpen(true)}>Create New Slot</Button>
            {isFormOpen && (
                <SlotForm
                    onSubmit={editingSlot ? handleUpdate : handleCreate}
                    initialData={editingSlot}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingSlot(null);
                    }}
                    branchCode={selectedBranch}
                    branches={branches}
                    isSuperAdmin={isSuperAdmin}
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
