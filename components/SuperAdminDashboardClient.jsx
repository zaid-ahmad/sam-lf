"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import SuperAdminDashboard from "./super-admin-dashboard/super-admin-dashboard";
import { displayTodaysDate, displayTomorrowsDate } from "@/lib/utils";
import moment from "moment";

export default function SuperAdminDashboardClient({
    initialData,
    allBranches,
    branch,
}) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const [selectedBranch, setSelectedBranch] = useState(initialData.branch);
    const [leadDate, setLeadDate] = useState(displayTodaysDate(branch));
    const [isToday, setIsToday] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const intervalIdRef = useRef(null);

    const fetchData = useCallback(async (branch, date) => {
        setIsLoading(true);
        try {
            const parsedDate = moment(date, "MMMM D, YYYY");
            if (!parsedDate.isValid()) {
                console.error("Invalid date:", date);
                setIsLoading(false);
                return;
            }
            const formattedDate = parsedDate.format("YYYY-MM-DD");
            const response = await fetch(
                `/api/get-data?role=superadmin&branch=${branch}&date=${encodeURIComponent(
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
        fetchData(selectedBranch, leadDate);

        intervalIdRef.current = setInterval(
            () => fetchData(selectedBranch, leadDate),
            1500000
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
            const newDate = displayTodaysDate(branch);
            setLeadDate(newDate);
            setIsToday(true);
            fetchData(selectedBranch, newDate);
        }
    };

    const handleNextDate = () => {
        if (isToday) {
            const newDate = displayTomorrowsDate(branch);
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
