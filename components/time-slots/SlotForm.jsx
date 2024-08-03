"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export function SlotForm({ onSubmit, initialData, onCancel, branchCode }) {
    const form = useForm({
        defaultValues: initialData || {
            branchCode: branchCode,
            timeSlot: "",
            limit: 5,
        },
    });

    useEffect(() => {
        if (initialData && initialData.date) {
            // Create a new Date object
            const date = new Date(initialData.date);
            // Adjust for timezone offset
            const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
            const adjustedDate = new Date(date.getTime() - timezoneOffset);
            // Format the date as YYYY-MM-DD
            const formattedDate = adjustedDate.toISOString().split("T")[0];
            form.setValue("date", formattedDate);
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='branchCode'
                    render={({ field }) => (
                        <FormItem className='hidden'>
                            <FormLabel>Branch Code</FormLabel>
                            <FormControl>
                                <Input placeholder='3CGY' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
