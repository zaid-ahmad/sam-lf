import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InfoCard = ({
    title,
    value,
    description = "",
    className,
    changeLeadDate = false,
    onPreviousDate,
    onNextDate,
    isToday = true,
    outOf = false,
    outOfValue,
}) => {
    const displayTitle = changeLeadDate
        ? `Total Leads for ${isToday ? "Today" : "Tomorrow"}`
        : title;
    return (
        <Card
            className={`text-center flex flex-col items-center justify-center h-36  ${
                changeLeadDate ? "w-64" : "w-56"
            } ${className}`}
        >
            <CardHeader className='pb-2 flex flex-col items-center'>
                <CardTitle className='text-lg'>{displayTitle}</CardTitle>
                {changeLeadDate && (
                    <div className='flex items-center gap-2'>
                        {!isToday && (
                            <ChevronLeft
                                size={16}
                                onClick={onPreviousDate}
                                className='cursor-pointer'
                            />
                        )}
                        <CardDescription>{description}</CardDescription>
                        {isToday && (
                            <ChevronRight
                                size={16}
                                onClick={onNextDate}
                                className='cursor-pointer'
                            />
                        )}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {outOf ? (
                    <div className='flex items-baseline justify-center'>
                        <p className='text-3xl font-bold mr-1'>{value}</p>
                        <span className='text-lg'>/{outOfValue}</span>
                    </div>
                ) : (
                    <p className='text-3xl font-bold'>{value}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default InfoCard;
