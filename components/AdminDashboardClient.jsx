"use client";

import { useState, useEffect } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import AdminDashboard from "./admin-dashboard/admin-dashboard";
import { displayTodaysDate, displayTomorrowsDate } from "@/lib/utils";
import moment from "moment";

export default function AdminDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const { branch } = dashboardData;
    const [leadDate, setLeadDate] = useState(displayTodaysDate(branch));
    const [isToday, setIsToday] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (date) => {
        setIsLoading(true);
        const parsedDate = moment(date, "MMMM Do, YYYY");
        if (!parsedDate.isValid()) {
            console.error("Invalid date:", date);
            setIsLoading(false);
            return;
        }
        const formattedDate = parsedDate.format("YYYY-MM-DD");
        const response = await fetch(
            `/api/get-data?role=admin&date=${encodeURIComponent(formattedDate)}`
        );
        if (response.ok) {
            const newData = await response.json();
            setDashboardData(newData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const intervalId = setInterval(() => fetchData(leadDate), 1500000);
        return () => clearInterval(intervalId);
    }, [leadDate]);

    const handlePreviousDate = () => {
        if (!isToday) {
            setLeadDate(displayTodaysDate(branch));
            setIsToday(true);
            fetchData(displayTodaysDate(branch));
        }
    };

    const handleNextDate = () => {
        if (isToday) {
            setLeadDate(displayTomorrowsDate(branch));
            setIsToday(false);
            fetchData(displayTomorrowsDate(branch));
        }
    };

    return (
        <AdminDashboard
            {...dashboardData}
            leadDate={leadDate}
            onPreviousDate={handlePreviousDate}
            onNextDate={handleNextDate}
            isToday={isToday}
            assignLeadToSalesRep={assignLeadToSalesRep}
            isLoading={isLoading}
        />
    );
}
