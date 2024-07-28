"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";

export default function AppointmentScheduler({
    onSchedule,
    showTimeSlots = true,
}) {
    const [date, setDate] = useState();
    const [selectedTime, setSelectedTime] = useState();

    const timeSlots = [
        "09:00 AM",
        "11:00 AM",
        "01:00 PM",
        "03:00 PM",
        "05:00 PM",
        "07:00 PM",
    ];

    useEffect(() => {
        if (date) {
            const formattedDate = format(date, "MMMM do, yyyy");
            const formattedDateTime =
                showTimeSlots && selectedTime
                    ? `${formattedDate} at ${selectedTime}`
                    : formattedDate;
            onSchedule(formattedDateTime);
        }
    }, [date, selectedTime, onSchedule, showTimeSlots]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    role='button'
                    variant={"outline"}
                    tabIndex={0}
                    aria-haspopup='true'
                    className={cn(
                        "w-full sm:w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    onClick={() => {}}
                    onTouchStart={() => {}}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.target.click();
                        }
                    }}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    <span className='truncate'>
                        {date ? (
                            showTimeSlots && selectedTime ? (
                                `${format(date, "PPP")} at ${selectedTime}`
                            ) : (
                                format(date, "PPP")
                            )
                        ) : (
                            <span>
                                {showTimeSlots
                                    ? "Pick a date & time"
                                    : "Pick a date"}
                            </span>
                        )}
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "w-auto p-0 z-[1000]",
                    showTimeSlots ? "max-w-[400px]" : "max-w-[300px]"
                )}
            >
                <div className='flex flex-col sm:flex-row'>
                    <Calendar
                        mode='single'
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className='w-full sm:w-auto'
                    />
                    {showTimeSlots && (
                        <div className='p-3 border-t sm:border-t-0 sm:border-l'>
                            <RadioGroup
                                className='grid grid-cols-2 sm:grid-cols-1 gap-2'
                                value={selectedTime}
                                onValueChange={setSelectedTime}
                            >
                                {timeSlots.map((time) => (
                                    <div key={time}>
                                        <RadioGroupItem
                                            value={time}
                                            id={time}
                                            className='peer sr-only'
                                        />
                                        <Label
                                            htmlFor={time}
                                            className={`flex items-center justify-center px-2 py-1 text-sm font-normal text-center border rounded-lg cursor-pointer ${
                                                selectedTime === time
                                                    ? "bg-primary text-white"
                                                    : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                        >
                                            {time}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
