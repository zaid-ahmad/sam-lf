"use client";

import { useState, useEffect } from "react";
import SalesRepDashboard from "./salesrep-dashboard/salesrep-dashboard";

export default function SaleRepDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/get-data?role=sales_rep");
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        };

        const intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return <SalesRepDashboard {...dashboardData} />;
}
