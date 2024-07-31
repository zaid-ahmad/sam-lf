"use client";

import { useState, useEffect } from "react";
import SalesRepDashboard from "./salesrep-dashboard/salesrep-dashboard";
import { changeLeadStatus } from "@/server/actions/change-lead-status";

export default function SaleRepDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            const parsedDate = moment(date, "MMMM Do, YYYY");
            if (!parsedDate.isValid()) {
                console.error("Invalid date:", date);
                setIsLoading(false);
                return;
            }
            const formattedDate = parsedDate.format("YYYY-MM-DD");
            const response = await fetch(
                `/api/get-data?role=sales_rep&date=${encodeURIComponent(
                    formattedDate
                )}`
            );
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        };

        const intervalId = setInterval(fetchData, 1500000); // Poll every 15 minutes

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <SalesRepDashboard
            {...dashboardData}
            changeLeadStatus={changeLeadStatus}
        />
    );
}
