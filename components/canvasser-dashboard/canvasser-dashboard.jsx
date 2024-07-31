"use client";

import InfoCard from "@/app/dashboard/info-card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { displayTodaysDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Spinner from "../spinner";

const CanvasserDashboard = ({
    data,
    name,
    totalLeads,
    totalDemo,
    totalDead,
    totalSale,
    leadDate,
    onPreviousDate,
    onNextDate,
    isToday,
    isLoading,
}) => {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            router.refresh();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(intervalId);
    }, [router]);
    const statusOptions = [
        "APPOINTMENT",
        "ASSIGNED",
        "DEMO",
        "SALE",
        "DEAD",
        "REBOOK",
        "CANCELLED",
        "INSTALL_CANCELLED",
    ];

    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2 mb-8 sm:mb-7'>
                <h2 className='flex items-center gap-5 text-xl sm:text-2xl font-semibold mb-4 sm:mb-7'>
                    Hello {name}!
                    {isLoading && (
                        <>
                            <span>
                                <Spinner
                                    color={"text-emerald-800"}
                                    height={0.1}
                                    padding={0}
                                />
                            </span>
                        </>
                    )}
                </h2>
                <Link href='/book-lead' aria-current='page'>
                    <span className='py-3 px-4 text-sm text-white bg-primary rounded'>
                        Appointment request form
                    </span>
                </Link>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-[1.74rem] mb-6 sm:mb-10'>
                <InfoCard
                    title='Total Leads for Today'
                    value={totalLeads}
                    description={leadDate}
                    changeLeadDate={true}
                    onPreviousDate={onPreviousDate}
                    onNextDate={onNextDate}
                    isToday={isToday}
                    className={"w-full md:w-auto"}
                />
                <Separator
                    orientation='horizontal'
                    className='w-full h-[1px] sm:h-10 sm:w-[1px] bg-zinc-300 my-2 sm:my-0'
                />
                <div className='flex flex-wrap justify-between w-full sm:w-auto gap-4'>
                    <InfoCard
                        title='Demo'
                        value={totalDemo}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Dead'
                        value={totalDead}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Sale'
                        value={totalSale}
                        className='flex-1 min-w-[120px]'
                    />
                </div>
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                statusOptions={statusOptions}
            />
        </div>
    );
};

export default CanvasserDashboard;
