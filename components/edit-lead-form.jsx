"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import updateLeadInDatabase from "@/server/actions/update-lead";
import { editLeadSchema } from "@/lib/validations/schema";
import GoogleAddressAutocomplete from "./google-address-autocomplete";
import AppointmentScheduler from "./appointment-scheduler";

const quadrants = [
    { id: "NW", label: "NW" },
    { id: "NE", label: "NE" },
    { id: "SW", label: "SW" },
    { id: "SE", label: "SE" },
];

export default function LeadEditPage({ data, id }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appointmentDateTime, setAppointmentDateTime] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(editLeadSchema),
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone1: data.phone1,
            phone2: data.phone2,
            email: data.email,
            address: data.address,
            postalCode: data.postalCode,
            quadrant: data.quadrant,
            addressNotes: data.addressNotes,
            appointmentDateTime: data.appointmentDateTime,
            date: data.date,
            timeslot: data.timeslot,
            homeOwnerType: data.homeOwnerType,
            age: data.age,
        },
    });

    const handleScheduleAppointment = (formattedDateTime) => {
        setAppointmentDateTime(formattedDateTime);
        form.setValue("appointmentDateTime", formattedDateTime);
        form.setValue("date", date);
        form.setValue("timeslot", timeSlot);
    };

    async function onSubmit(values) {
        try {
            setIsSubmitting(true);
            const result = await updateLeadInDatabase(id, values);

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Lead updated successfully!",
                });
                router.push("/dashboard");
            } else {
                toast({
                    title: "Error!",
                    description: "Something went wrong. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error updating lead:", error);
            toast({
                title: "Error!",
                description: "An unexpected error occurred.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    if (!data) {
        return (
            <div className='h-screen flex items-center justify-center text-2xl font-semibold'>
                Loading...
            </div>
        );
    }
    return (
        <Card className='w-full max-w-4xl mx-auto mt-4 sm:mt-7 p-4 sm:p-6 md:p-8'>
            <CardHeader>
                <CardTitle className='text-3xl font-bold'>Edit Lead</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6 sm:space-y-8'
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            <FormField
                                control={form.control}
                                name='firstName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='phone1'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='phone2'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secondary Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-col gap-2'>
                                <span className='text-sm font-medium bg-emerald-50 px-2 py-3 rounded-md text-zinc-900'>
                                    {data.address}
                                </span>
                                <FormField
                                    control={form.control}
                                    name='address'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Address</FormLabel>
                                            <FormControl>
                                                <GoogleAddressAutocomplete
                                                    {...form.register(
                                                        "address"
                                                    )}
                                                    onAddressSelect={(
                                                        address,
                                                        postalCode
                                                    ) => {
                                                        field.onChange(address);
                                                        form.setValue(
                                                            "postalCode",
                                                            postalCode
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='quadrant'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quadrant</FormLabel>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className='grid grid-cols-2 gap-2'
                                        >
                                            {quadrants.map((item) => (
                                                <FormItem
                                                    key={item.id}
                                                    className='flex items-center space-x-2'
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={item.id}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className='font-normal'>
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='addressNotes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Notes</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex flex-col gap-2'>
                                <span className='text-sm font-medium bg-emerald-50 rounded-md px-2 py-3 text-zinc-900'>
                                    {data.appointmentDateTime}
                                </span>

                                <FormField
                                    control={form.control}
                                    name='appointmentDateTime'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Appointment Date & Time
                                                <span className='text-red-600'>
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <AppointmentScheduler
                                                    onSchedule={(
                                                        formattedDateTime
                                                    ) => {
                                                        field.onChange(
                                                            formattedDateTime
                                                        );
                                                        handleScheduleAppointment(
                                                            formattedDateTime
                                                        );
                                                    }}
                                                    setLeadDate={setDate}
                                                    setTimeSlot={setTimeSlot}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='homeOwnerType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Home Owner Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select home owner type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='MR_SHO'>
                                                    Mr. SHO
                                                </SelectItem>
                                                <SelectItem value='MRS_SHO'>
                                                    Mrs. SHO
                                                </SelectItem>
                                                <SelectItem value='BOTH_ATTEND'>
                                                    Both Attend
                                                </SelectItem>
                                                <SelectItem value='ONE_LEG'>
                                                    One Leg
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='age'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select age range' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='THIRTY_TO_FORTY'>
                                                    30 - 40
                                                </SelectItem>
                                                <SelectItem value='FORTY_TO_FIFTY'>
                                                    40 - 50
                                                </SelectItem>
                                                <SelectItem value='FIFTY_TO_SIXTY'>
                                                    50 - 60
                                                </SelectItem>
                                                <SelectItem value='SIXTY_TO_SEVENTY'>
                                                    60 - 70
                                                </SelectItem>
                                                <SelectItem value='SEVENTY_PLUS'>
                                                    70+
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type='submit'
                            className='w-full mt-6'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Updating..."
                                : "Update Details"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
