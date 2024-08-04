import InfoCard from "@/app/dashboard/info-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Spinner from "../spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { formatTimeto12Hour } from "@/lib/utils";

const SuperAdminDashboard = ({
    data,
    name,
    sale_reps,
    totalLeads,
    totalAssignedLeads,
    totalUnassignedLeads,
    listOfCanvassers,
    listOfSalesReps,
    leadsPerTimeSlot,
    assignLeadToSalesRep,
    leadDate,
    onPreviousDate,
    onNextDate,
    isToday,
    isLoading,
    allBranches,
    onBranchChange,
    slotTemplates,
}) => {
    const [branchFilter, setBranchFilter] = useState("3CGY");
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

    const timeOptions = slotTemplates.map((slot) =>
        formatTimeto12Hour(slot.timeSlot)
    );

    useEffect(() => {
        onBranchChange(branchFilter);
    }, [branchFilter, onBranchChange]);

    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <div className='w-full flex items-center justify-between'>
                <div className='w-full flex items-center justify-between'>
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
                    <Select
                        onValueChange={setBranchFilter}
                        value={branchFilter}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Select a branch' />
                        </SelectTrigger>
                        <SelectContent>
                            {allBranches.map(({ code, name }) => (
                                <SelectItem key={code} value={code}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4'>
                    <InfoCard
                        title='Total Leads for Today'
                        value={totalLeads}
                        description={leadDate}
                        changeLeadDate={true}
                        onPreviousDate={onPreviousDate}
                        onNextDate={onNextDate}
                        isToday={isToday}
                    />
                    {slotTemplates.map((slot, index) => (
                        <InfoCard
                            key={index}
                            title={formatTimeto12Hour(slot.timeSlot)}
                            value={leadsPerTimeSlot[slot.timeSlot]?.count || 0}
                            description={"Slots Filled"}
                            className='flex-1 min-w-[120px]'
                            outOf={true}
                            outOfValue={
                                leadsPerTimeSlot[slot.timeSlot]?.limit ||
                                slot.limit
                            }
                        />
                    ))}
                </div>

                <div className='flex flex-wrap justify-between w-full sm:w-auto gap-4'>
                    <InfoCard
                        title='Unassigned'
                        value={totalUnassignedLeads}
                        className='flex-1 min-w-[120px]'
                    />
                    <InfoCard
                        title='Assigned'
                        value={totalAssignedLeads}
                        className='flex-1 min-w-[120px]'
                    />
                </div>
            </div>
            <DataTable
                initialColumns={columns}
                initialData={data}
                saleReps={sale_reps}
                assignLeadToSalesRep={assignLeadToSalesRep}
                statusOptions={statusOptions}
                timeOptions={timeOptions}
                canvasserOptions={listOfCanvassers}
                salesRepOptions={listOfSalesReps}
            />
        </div>
    );
};

export default SuperAdminDashboard;
