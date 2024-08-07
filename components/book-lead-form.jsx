"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import AppointmentScheduler from "@/components/appointment-scheduler";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import GoogleAddressAutocomplete from "@/components/google-address-autocomplete";
import { getSignedURL } from "@/server/actions/s3";
import { appointmentSchemaForm } from "@/lib/validations/schema";
import { addLeadToDatabase } from "@/server/actions/book-lead";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { computeSHA256 } from "@/lib/utils";

const concerns = [
    {
        id: "inspection-estimate",
        label: "Inspection / Estimate",
    },
    {
        id: "clogging-damages",
        label: "Clogging / Damages",
    },
    {
        id: "new-gutters",
        label: "New Gutters",
    },
    {
        id: "lf-interest",
        label: "Leaf Filter Interest",
    },
    {
        id: "downspout-roof-extensions",
        label: "Downspout / Roof Extensions Needed",
    },
    {
        id: "other",
        label: "Other",
    },
];

const surrounding_awareness = [
    {
        id: "lotsoftrees",
        label: "Lots of trees",
    },
    {
        id: "wildlife",
        label: "Wildlife",
    },
    {
        id: "roofingOrShingleGrit",
        label: "Roofing / Shingle Grit",
    },
];

const services = [
    {
        id: "repairs",
        label: "Repairs",
    },
    {
        id: "gutters",
        label: "Gutters",
    },
    {
        id: "lf",
        label: "Leaf Filter",
    },
    {
        id: "csr",
        label: "CSR",
    },
    {
        id: "fi",
        label: "Free Inspection",
    },
];

const quadrants = [
    { id: "NW", label: "NW" },
    { id: "NE", label: "NE" },
    { id: "SW", label: "SW" },
    { id: "SE", label: "SE" },
];

function AppointmentRequestForm() {
    const { toast } = useToast();
    const router = useRouter();

    const [uploadProgress, setUploadProgress] = useState(0);
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [appointmentDateTime, setAppointmentDateTime] = useState("");
    const [customConcern, setCustomConcern] = useState("");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePhone1Change = (event) => {
        const formattedPhoneNumber = formatPhoneNumber(event.target.value);
        setPhone1(formattedPhoneNumber);
        form.setValue("primaryPhone", formattedPhoneNumber);
    };

    const handlePhone2Change = (event) => {
        const formattedPhoneNumber = formatPhoneNumber(event.target.value);
        setPhone2(formattedPhoneNumber);
        form.setValue("secondaryPhone", formattedPhoneNumber);
    };

    const handleScheduleAppointment = (formattedDateTime) => {
        setAppointmentDateTime(formattedDateTime);
        form.setValue("appointmentDateTime", formattedDateTime);
    };

    const form = useForm({
        resolver: zodResolver(appointmentSchemaForm),
        defaultValues: {
            firstName: "",
            lastName: "",
            primaryPhone: "",
            secondaryPhone: "",
            email: "",
            address: "",
            postalCode: "",
            addressNotes: "",
            appointmentDateTime: "",
            homeownerType: "",
            age: "",
            quadrant: "",
            concerns: [],
            surroundings: "",
            serviceNeeds: [],
            images: [],
        },
    });

    async function onSubmit(values, date, timeSlot) {
        try {
            if (values.concerns.includes("other") && customConcern) {
                values.concerns = [
                    ...values.concerns.filter((c) => c !== "other"),
                    customConcern,
                ];
            }

            setUploadProgress(0);
            let uploadedImageUrls = [];

            if (values.images && values.images.length > 0) {
                for (let i = 0; i < values.images.length; i++) {
                    const file = values.images[i];
                    try {
                        const signedURLResult = await getSignedURL({
                            fileSize: file.size,
                            fileType: file.type,
                            checksum: await computeSHA256(file),
                        });
                        if (signedURLResult.failure !== undefined) {
                            console.error(signedURLResult.failure);
                            continue; // Skip this file and try the next one
                        }

                        const { url } = signedURLResult.success;

                        await fetch(url, {
                            method: "PUT",
                            headers: {
                                "Content-Type": file.type,
                            },
                            body: file,
                        });
                        uploadedImageUrls.push(url.split("?")[0]);
                        setUploadProgress(
                            ((i + 1) / uploadedImageUrls.length) * 100
                        );
                    } catch (error) {
                        console.error("Error uploading image:", error);
                        // Handle error (e.g., show error message to user)
                    }
                }
            }

            values.images = uploadedImageUrls;

            const result = await addLeadToDatabase(values, date, timeSlot);

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Lead added successfully!",
                });

                form.reset();
                setCustomConcern("");

                // Reset upload progress
                setUploadProgress(0);
                router.push("/dashboard");
            } else {
                // Handle error
                toast({
                    title: "Error!",
                    description:
                        "Something went wrong. Please refresh and try again.",
                });
                router.refresh();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <Card className='w-full max-w-4xl mx-auto mt-4 sm:mt-7 p-4 sm:p-6 md:p-8'>
            <CardHeader>
                <CardTitle className='text-2xl sm:text-3xl font-bold'>
                    Appointment Request Form
                </CardTitle>
                <CardDescription className='text-sm sm:text-base'>
                    Fill out the form below to schedule an appointment.
                    Remember, the more details the better.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) =>
                            onSubmit(values, date, timeSlot)
                        )}
                        className='space-y-6 sm:space-y-8'
                    >
                        <div className='grid grid-cols-1 gap-6'>
                            <div className='space-y-6'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                    {/* First Name */}

                                    <div className='col-span-2'>
                                        <FormField
                                            control={form.control}
                                            name='firstName'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm sm:text-base'>
                                                        First Name{""}
                                                        <span className='text-red-600'>
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className='h-10 sm:h-12 text-sm sm:text-base capitalize'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <FormField
                                        control={form.control}
                                        name='lastName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm sm:text-base'>
                                                    Last Name{""}
                                                    <span className='text-red-600'>
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='h-10 sm:h-12 text-sm sm:text-base capitalize'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Primary Phone */}
                                    <div className='col-span-2'>
                                        <FormField
                                            control={form.control}
                                            name='primaryPhone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm sm:text-base'>
                                                        Primary Phone{""}
                                                        <span className='text-red-600'>
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='(000) 000-0000'
                                                            {...field}
                                                            value={phone1}
                                                            onChange={
                                                                handlePhone1Change
                                                            }
                                                            className='h-10 sm:h-12 text-sm sm:text-base'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Secondary Phone */}
                                    <FormField
                                        control={form.control}
                                        name='secondaryPhone'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm sm:text-base'>
                                                    Secondary Phone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='(000) 000-0000'
                                                        {...field}
                                                        value={phone2}
                                                        onChange={
                                                            handlePhone2Change
                                                        }
                                                        className='h-10 sm:h-12 text-sm sm:text-base'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <div className='col-span-2'>
                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm sm:text-base'>
                                                        Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='email'
                                                            placeholder='example@example.com'
                                                            {...field}
                                                            className='h-10 sm:h-12 text-sm sm:text-base'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-4 sm:space-y-6'>
                                {/* Google Maps API Address Input */}
                                <FormField
                                    control={form.control}
                                    name='address'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Address{""}
                                                <span className='text-red-600'>
                                                    *
                                                </span>
                                            </FormLabel>
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

                                {/* Postal Code */}
                                <FormField
                                    control={form.control}
                                    name='postalCode'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Postal Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    disabled
                                                    className='h-10 sm:h-12 text-sm sm:text-base'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Address Notes */}
                                <FormField
                                    control={form.control}
                                    name='addressNotes'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Extra Address Notes
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    className='h-10 sm:h-12 text-sm sm:text-base'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Appointment, Age, Home Owner Type, Quadrant */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                <div className='space-y-6'>
                                    {/* Appointment */}
                                    <FormField
                                        control={form.control}
                                        name='appointmentDateTime'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm sm:text-base'>
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
                                                        setTimeSlot={
                                                            setTimeSlot
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Age */}
                                    <FormField
                                        control={form.control}
                                        name='age'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm sm:text-base'>
                                                    Age
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger className='w-full h-12 text-base'>
                                                            <SelectValue placeholder='Please Select' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value={null}
                                                            >
                                                                Please Select
                                                            </SelectItem>
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
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='space-y-6'>
                                    {/* Home Owner Type */}
                                    <FormField
                                        control={form.control}
                                        name='homeownerType'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm sm:text-base'>
                                                    Home Owner
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger className='w-full h-12 text-base'>
                                                            <SelectValue placeholder='Please Select' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value={null}
                                                            >
                                                                Please Select
                                                            </SelectItem>
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
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Quadrant */}
                                    <FormField
                                        control={form.control}
                                        name='quadrant'
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='mb-4'>
                                                    <FormLabel className='text-sm sm:text-base'>
                                                        Quadrant{" "}
                                                        <span className='text-red-600'>
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                </div>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
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
                                                                    value={
                                                                        item.id
                                                                    }
                                                                    className='w-6 h-6'
                                                                />
                                                            </FormControl>
                                                            <FormLabel className='font-normal'>
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Concerns */}
                            <FormField
                                control={form.control}
                                name='concerns'
                                render={() => (
                                    <FormItem>
                                        <div className='mb-4'>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Concerns{" "}
                                                <span className='text-red-600'>
                                                    *
                                                </span>
                                            </FormLabel>
                                        </div>
                                        {concerns.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name='concerns'
                                                render={({ field }) => {
                                                    const isChecked =
                                                        field.value?.includes(
                                                            item.id
                                                        );
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className='flex flex-row items-start space-x-3 space-y-0'
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    className='w-6 h-6'
                                                                    checked={
                                                                        isChecked
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        const updatedValue =
                                                                            checked
                                                                                ? [
                                                                                      ...field.value,
                                                                                      item.id,
                                                                                  ]
                                                                                : field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          item.id
                                                                                  );
                                                                        field.onChange(
                                                                            updatedValue
                                                                        );

                                                                        // Reset custom concern when 'Other' is unchecked
                                                                        if (
                                                                            item.id ===
                                                                                "other" &&
                                                                            !checked
                                                                        ) {
                                                                            setCustomConcern(
                                                                                ""
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className='font-normal'>
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                        {form
                                            .watch("concerns")
                                            ?.includes("other") && (
                                            <Input
                                                className='mt-2'
                                                placeholder='Please specify other concern'
                                                value={customConcern}
                                                onChange={(e) =>
                                                    setCustomConcern(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Surrounding Awareness */}
                            <FormField
                                control={form.control}
                                name='surroundings'
                                render={() => (
                                    <FormItem>
                                        <div className='mb-4'>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Surrounding Awareness
                                                {""}
                                                <span className='text-red-600'>
                                                    *
                                                </span>
                                            </FormLabel>
                                        </div>
                                        {surrounding_awareness.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name='surroundings'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className='flex flex-row items-start space-x-3 space-y-0'
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    className='w-6 h-6'
                                                                    checked={field.value?.includes(
                                                                        item.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...field.value,
                                                                                      item.id,
                                                                                  ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          item.id
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className='font-normal'>
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </FormItem>
                                )}
                            />

                            {/* Services Needed */}
                            <FormField
                                control={form.control}
                                name='serviceNeeds'
                                render={() => (
                                    <FormItem>
                                        <div className='mb-4'>
                                            <FormLabel className='text-sm sm:text-base'>
                                                Services Needed
                                                {""}
                                                <span className='text-red-600'>
                                                    *
                                                </span>
                                            </FormLabel>
                                        </div>
                                        {services.map((item) => (
                                            <FormField
                                                className='w-6 h-6'
                                                key={item.id}
                                                control={form.control}
                                                name='serviceNeeds'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className='flex flex-row items-start space-x-3 space-y-0'
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    className='w-6 h-6'
                                                                    checked={field.value?.includes(
                                                                        item.id.toUpperCase()
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        const uppercaseId =
                                                                            item.id.toUpperCase();
                                                                        return checked
                                                                            ? field.onChange(
                                                                                  [
                                                                                      ...field.value,
                                                                                      uppercaseId,
                                                                                  ]
                                                                              )
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (
                                                                                          value
                                                                                      ) =>
                                                                                          value !==
                                                                                          uppercaseId
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className='font-normal'>
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload */}
                            <FormField
                                control={form.control}
                                name='images'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm sm:text-base'>
                                            Upload Images (max. 4)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(
                                                        e.target.files
                                                    );
                                                    const newFiles = [
                                                        ...(field.value || []),
                                                        ...files,
                                                    ].slice(0, 4);
                                                    field.onChange(newFiles);
                                                }}
                                                className='text-sm sm:text-base'
                                            />
                                        </FormControl>
                                        <Progress
                                            value={uploadProgress}
                                            className='h-2 sm:h-3'
                                        />
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
                                ? "Submitting..."
                                : "Submit Request"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default AppointmentRequestForm;
