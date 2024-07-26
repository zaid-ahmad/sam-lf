"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { computeSHA256 } from "@/lib/utils";
import { getSignedURL } from "@/server/actions/s3";
import Spinner from "./spinner";
import AppointmentScheduler from "./appointment-scheduler";

const deadSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
});

const demoSchema = z.object({
    pdfFile: z
        .instanceof(File)
        .refine((file) => file.type === "application/pdf", {
            message: "File must be a PDF",
        }),
});

const saleSchema = z.object({
    jobNumber: z.string().min(1, "Job number is required"),
    salePrice: z.number().positive("Sale price must be positive"),
    installationDate: z.string().min(1, "Installation date is required"),
});

export function ChangeLeadStatusDialog({
    isOpen,
    onClose,
    leadId,
    onStatusChange,
    leadDetails,
}) {
    const [selectedAction, setSelectedAction] = useState("");
    const [installationDate, setInstallationDate] = useState("");
    const [loading, setLoading] = useState(false);

    const deadForm = useForm({
        resolver: zodResolver(deadSchema),
        defaultValues: { reason: "" },
    });

    const demoForm = useForm({
        resolver: zodResolver(demoSchema),
    });

    const saleForm = useForm({
        resolver: zodResolver(saleSchema),
        defaultValues: { jobNumber: "", salePrice: 0 },
    });

    const handleInstallationDate = (formattedDateTime) => {
        setInstallationDate(formattedDateTime);
        saleForm.setValue("installationDate", formattedDateTime);
    };

    const handleStatusChange = async (data) => {
        if (data.pdfFile) {
            const file = data.pdfFile;
            try {
                setLoading(true);
                const signedURLResult = await getSignedURL({
                    fileSize: file.size,
                    fileType: file.type,
                    checksum: await computeSHA256(file),
                });
                if (signedURLResult.failure !== undefined) {
                    console.error(signedURLResult.failure);
                }

                const { url } = signedURLResult.success;

                await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });
                onStatusChange(leadId, selectedAction, url.split("?")[0]);
                onClose();
            } catch (error) {
                console.error("Error uploading pdf:", error);
            } finally {
                setLoading(false);
            }
        } else {
            onStatusChange(leadId, selectedAction, data);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>What happened to this lead?</DialogTitle>
                    <DialogDescription>
                        Report as Dead, Demo or a Sale.
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

                <Select
                    onValueChange={setSelectedAction}
                    value={selectedAction}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Select an action' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {["Dead", "Demo", "Sale"].map((action) => (
                                <SelectItem
                                    key={action}
                                    value={action.toUpperCase()}
                                >
                                    {action}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {selectedAction === "DEAD" && (
                    <Form {...deadForm}>
                        <form
                            onSubmit={deadForm.handleSubmit(handleStatusChange)}
                            className='flex flex-col gap-4'
                        >
                            <FormField
                                control={deadForm.control}
                                name='reason'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Reason
                                            <span className='text-red-600'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder='Enter reason'
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type='submit'>Save</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}

                {selectedAction === "DEMO" && (
                    <Form {...demoForm}>
                        <form
                            onSubmit={demoForm.handleSubmit(handleStatusChange)}
                            className='flex flex-col gap-4'
                        >
                            <FormField
                                control={demoForm.control}
                                name='pdfFile'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='mt-6'>
                                            Upload DNS PDF
                                            <span className='text-red-600'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='file'
                                                accept='.pdf'
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' disabled={loading}>
                                {loading ? (
                                    <div className='flex items-center justify-center'>
                                        <Spinner color='text-gray-100' />
                                    </div>
                                ) : (
                                    <p>Save</p>
                                )}
                            </Button>
                        </form>
                    </Form>
                )}

                {selectedAction === "SALE" && (
                    <Form {...saleForm}>
                        <form
                            onSubmit={saleForm.handleSubmit(handleStatusChange)}
                            className='flex flex-col gap-4'
                        >
                            <FormField
                                control={saleForm.control}
                                name='jobNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Job Number
                                            <span className='text-red-600'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Enter job number'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={saleForm.control}
                                name='salePrice'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Sale Price
                                            <span className='text-red-600'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='number'
                                                placeholder='Enter sale price'
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={saleForm.control}
                                name='installationDate'
                                render={({ field }) => (
                                    <FormItem className='w-full flex gap-1 flex-col'>
                                        <FormLabel className='mt-1'>
                                            Installation Date
                                            <span className='text-red-600'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <AppointmentScheduler
                                                showTimeSlots={false}
                                                onSchedule={(
                                                    formattedDateTime
                                                ) => {
                                                    field.onChange(
                                                        formattedDateTime
                                                    );
                                                    handleInstallationDate(
                                                        formattedDateTime
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type='submit'>Save</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
