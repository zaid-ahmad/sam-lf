"use client";

import { useState, useEffect } from "react";
import { assignLeadToSalesRep } from "@/server/actions/assign-to-sales-rep";
import AdminDashboard from "./admin-dashboard/admin-dashboard";

export default function AdminDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/get-data?role=admin");
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        };

        const intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    console.log(dashboardData);

    return (
        <AdminDashboard
            {...dashboardData}
            assignLeadToSalesRep={assignLeadToSalesRep}
        />
    );
}
