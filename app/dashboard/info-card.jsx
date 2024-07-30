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
}) => {
    const displayTitle = changeLeadDate
        ? `Total Leads for ${isToday ? "Today" : "Tomorrow"}`
        : title;
    return (
        <Card className={`text-center ${className}`}>
            <CardHeader className='pb-2 flex flex-col items-center'>
                <CardTitle className='text-lg'>{displayTitle}</CardTitle>
                {changeLeadDate && (
                    <div className='flex items-center gap-2'>
                        <ChevronLeft
                            size={16}
                            onClick={onPreviousDate}
                            className='cursor-pointer'
                        />
                        <CardDescription>{description}</CardDescription>
                        <ChevronRight
                            size={16}
                            onClick={onNextDate}
                            className='cursor-pointer'
                        />
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-bold'>{value}</p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
