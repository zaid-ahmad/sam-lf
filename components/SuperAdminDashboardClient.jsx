"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import SuperAdminDashboard from "./super-admin-dashboard/super-admin-dashboard";

export default function SuperAdminDashboardClient({
    initialData,
    allBranches,
}) {
    const [dashboardData, setDashboardData] = useState(initialData);
    const [selectedBranch, setSelectedBranch] = useState(initialData.branch);
    const [loading, setLoading] = useState(true);
    const intervalIdRef = useRef(null);

    const fetchData = useCallback(async (branch) => {
        try {
            const response = await fetch(
                `/api/get-data?role=superadmin&branch=${branch}`
            );
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(selectedBranch); // Fetch data immediately when component mounts or branch changes

        intervalIdRef.current = setInterval(
            () => fetchData(selectedBranch),
            30000
        );

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [fetchData, selectedBranch]);

    const handleBranchChange = useCallback(
        (branch) => {
            setSelectedBranch(branch);
            fetchData(branch);
        },
        [fetchData]
    );

    if (loading) {
        return (
            <div className='h-screen flex items-center justify-center text-2xl font-medium'>
                Loading...
            </div>
        );
    }

    return (
        <SuperAdminDashboard
            {...dashboardData}
            assignLeadToSalesRep={assignLeadToSalesRep}
            onBranchChange={handleBranchChange}
            allBranches={allBranches}
        />
    );
}
