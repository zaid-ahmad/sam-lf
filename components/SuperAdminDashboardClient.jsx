"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import SuperAdminDashboard from "./super-admin-dashboard/super-admin-dashboard";
import { displayTodaysDate, displayTomorrowsDate } from "@/lib/utils";
import moment from "moment";

export default function SuperAdminDashboardClient({
    initialData,
    allBranches,
}) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const [selectedBranch, setSelectedBranch] = useState(initialData.branch);
    const [leadDate, setLeadDate] = useState(displayTodaysDate());
    const [isToday, setIsToday] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const intervalIdRef = useRef(null);

    const fetchData = useCallback(async (branch, date) => {
        setIsLoading(true);
        try {
            const formattedDate = date
                ? moment(date).format("MMMM D, YYYY")
                : null;
            const response = await fetch(
                `/api/get-data?role=superadmin&branch=${branch}&date=${formattedDate}`
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
        fetchData(selectedBranch, leadDate);

        intervalIdRef.current = setInterval(
            () => fetchData(selectedBranch, leadDate),
            30000
        );

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [fetchData, selectedBranch, leadDate]);

    const handleBranchChange = useCallback(
        (branch) => {
            setSelectedBranch(branch);
            fetchData(branch, leadDate);
        },
        [fetchData, leadDate]
    );

    const handlePreviousDate = () => {
        if (!isToday) {
            const newDate = displayTodaysDate();
            setLeadDate(newDate);
            setIsToday(true);
            fetchData(selectedBranch, newDate);
        }
    };

    const handleNextDate = () => {
        if (isToday) {
            const newDate = displayTomorrowsDate();
            setLeadDate(newDate);
            setIsToday(false);
            fetchData(selectedBranch, newDate);
        }
    };

    return (
        <SuperAdminDashboard
            {...dashboardData}
            assignLeadToSalesRep={assignLeadToSalesRep}
            onBranchChange={handleBranchChange}
            allBranches={allBranches}
            leadDate={leadDate}
            onPreviousDate={handlePreviousDate}
            onNextDate={handleNextDate}
            isToday={isToday}
            isLoading={isLoading}
            selectedBranch={selectedBranch}
        />
    );
}
