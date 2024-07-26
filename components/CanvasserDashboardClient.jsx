"use client";

import { useState, useEffect } from "react";
import CanvasserDashboard from "./canvasser-dashboard/canvasser-dashboard";

export default function CanvasserDashboardClient({ initialData }) {
    const [dashboardData, setDashboardData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/get-data?role=canvasser");
            if (response.ok) {
                const newData = await response.json();
                setDashboardData(newData);
            }
        };

        const intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return <CanvasserDashboard {...dashboardData} />;
}
