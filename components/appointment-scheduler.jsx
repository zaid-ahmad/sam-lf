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
import { getAvailableSlots } from "@/server/actions/slotActions";

function convertTo12HourFormat(time24) {
    // Parse the time string
    const [hours, minutes] = time24.split(":").map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Format the time string
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default function AppointmentScheduler({
    onSchedule,
    showTimeSlots = true,
    branch,
    setLeadDate,
    setTimeSlot,
}) {
    const [date, setDate] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        if (date) {
            // Fetch available slots
            fetchAvailableSlots(branch, date);

            // Format and schedule date
            const formattedDate = format(date, "MMMM do, yyyy");
            console.log(selectedTime, formattedDate);

            let formattedDateTime = formattedDate;

            if (showTimeSlots && selectedTime) {
                const twelveHourTime = convertTo12HourFormat(selectedTime);
                formattedDateTime = `${formattedDate} at ${twelveHourTime}`;
            }

            onSchedule(formattedDateTime);
            setLeadDate(date);
            setTimeSlot(selectedTime);
        }
    }, [
        date,
        selectedTime,
        onSchedule,
        showTimeSlots,
        branch,
        setLeadDate,
        setTimeSlot,
    ]);

    const fetchAvailableSlots = async (branch, selectedDate) => {
        const slots = await getAvailableSlots(branch, selectedDate);
        setAvailableSlots(slots);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div
                    role='button'
                    variant={"outline"}
                    tabIndex={0}
                    aria-haspopup='true'
                    className={cn(
                        "w-full sm:w-[280px] justify-start text-left font-normal flex items-center px-3 py-2 rounded-lg text-sm bg-zinc-50 border",
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
                                `${format(
                                    date,
                                    "PPP"
                                )} at ${convertTo12HourFormat(selectedTime)}`
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
                    showTimeSlots ? "max-w-[500px]" : "max-w-[400px]"
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
                        <RadioGroup
                            value={selectedTime}
                            onValueChange={setSelectedTime}
                            className='grid grid-cols-2 sm:grid-cols-1 gap-2 p-3 border-t sm:border-t-0 sm:border-l'
                        >
                            {availableSlots.map((slot) => (
                                <div key={slot.timeSlot}>
                                    <RadioGroupItem
                                        value={slot.timeSlot}
                                        id={slot.timeSlot}
                                        className='peer sr-only'
                                        disabled={!slot.isAvailable}
                                    />
                                    <Label
                                        htmlFor={slot.timeSlot}
                                        className={`flex items-center justify-center px-4 py-3 text-base font-normal text-center border rounded-lg cursor-pointer ${
                                            selectedTime === slot.timeSlot
                                                ? "bg-primary text-white"
                                                : slot.isAvailable
                                                ? "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-50"
                                                : "hidden"
                                        }`}
                                    >
                                        {convertTo12HourFormat(slot.timeSlot)}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
