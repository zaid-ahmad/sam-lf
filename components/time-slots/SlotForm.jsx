"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SlotForm({
    onSubmit,
    initialData,
    onCancel,
    branchCode,
    branches,
    isSuperAdmin,
}) {
    const form = useForm({
        defaultValues: initialData || {
            branchCode: branchCode,
            timeSlot: "",
            limit: 5,
        },
    });

    useEffect(() => {
        if (initialData && initialData.date) {
            const date = new Date(initialData.date);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() - timezoneOffset);
            const formattedDate = adjustedDate.toISOString().split("T")[0];
            form.setValue("date", formattedDate);
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                {isSuperAdmin ? (
                    <FormField
                        control={form.control}
                        name='branchCode'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a branch' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem
                                                key={branch.id}
                                                value={branch.code}
                                            >
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <FormField
                        control={form.control}
                        name='branchCode'
                        render={({ field }) => (
                            <FormItem className='hidden'>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name='timeSlot'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <FormControl>
                                <Input type='time' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='limit'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Limit</FormLabel>
                            <FormControl>
                                <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex gap-5'>
                    <Button type='submit'>Submit</Button>
                    <Button type='button' variant='outline' onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
