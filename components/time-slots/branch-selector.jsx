"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BranchSelector({ branches, selectedBranch, onBranchChange }) {
    return (
        <div className='mb-4'>
            <Select onValueChange={onBranchChange} value={selectedBranch}>
                <SelectTrigger>
                    <SelectValue placeholder='Select a branch' />
                </SelectTrigger>
                <SelectContent>
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.code}>
                            {branch.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
