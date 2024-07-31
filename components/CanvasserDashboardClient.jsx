"use client";

import { useState, useEffect, useCallback } from "react";
import CanvasserDashboard from "./canvasser-dashboard/canvasser-dashboard";
import { displayTodaysDate, displayTomorrowsDate } from "@/lib/utils";
import moment from "moment";

export default function CanvasserDashboardClient({ initialData, branch }) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const [leadDate, setLeadDate] = useState(displayTodaysDate(branch));
    const [isToday, setIsToday] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async (date) => {
        setIsLoading(true);
        const parsedDate = moment(date, "MMMM D, YYYY");
        if (!parsedDate.isValid()) {
            console.error("Invalid date:", date);
            setIsLoading(false);
            return;
        }
        const formattedDate = parsedDate.format("YYYY-MM-DD");
        try {
            const response = await fetch(
                `/api/get-data?role=canvasser&date=${encodeURIComponent(
                    formattedDate
                )}`
            );
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(leadDate);
        const intervalId = setInterval(() => fetchData(leadDate), 1500000);
        return () => clearInterval(intervalId);
    }, [fetchData, leadDate]);

    const handlePreviousDate = () => {
        if (!isToday) {
            const newDate = displayTodaysDate(branch);
            setLeadDate(newDate);
            setIsToday(true);
            fetchData(newDate);
        }
    };

    const handleNextDate = () => {
        if (isToday) {
            const newDate = displayTomorrowsDate(branch);
            setLeadDate(newDate);
            setIsToday(false);
            fetchData(newDate);
        }
    };

    return (
        <CanvasserDashboard
            {...dashboardData}
            leadDate={leadDate}
            onPreviousDate={handlePreviousDate}
            onNextDate={handleNextDate}
            isToday={isToday}
            isLoading={isLoading}
        />
    );
}
