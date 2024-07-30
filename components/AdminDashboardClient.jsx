"use client";

import { useState, useEffect } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import AdminDashboard from "./admin-dashboard/admin-dashboard";
import { displayTodaysDate, displayTomorrowsDate } from "@/lib/utils";
import moment from "moment";

export default function AdminDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const [leadDate, setLeadDate] = useState(displayTodaysDate());
    const [isToday, setIsToday] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (date) => {
        setIsLoading(true);
        const formattedDate = date ? moment(date).format("MMMM D, YYYY") : null;
        const response = await fetch(
            `/api/get-data?role=admin&date=${formattedDate}`
        );
        if (response.ok) {
            const newData = await response.json();
            setDashboardData(newData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const intervalId = setInterval(() => fetchData(leadDate), 30000);
        return () => clearInterval(intervalId);
    }, [leadDate]);

    useEffect(() => {
        const intervalId = setInterval(() => fetchData(leadDate), 30000);
        return () => clearInterval(intervalId);
    }, [leadDate]);

    const handlePreviousDate = () => {
        if (!isToday) {
            setLeadDate(displayTodaysDate());
            setIsToday(true);
            fetchData(displayTodaysDate());
        }
    };

    const handleNextDate = () => {
        if (isToday) {
            setLeadDate(displayTomorrowsDate());
            setIsToday(false);
            fetchData(displayTomorrowsDate());
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
