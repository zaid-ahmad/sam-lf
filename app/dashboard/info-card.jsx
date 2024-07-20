import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

const colors = {
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    purple: "bg-purple-100 text-purple-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
};

const InfoCard = ({ title, value, Icon, color }) => {
    return (
        <Card
            className={`text-center ${colors[color]} shadow-md hover:shadow-lg transition-shadow duration-300`}
        >
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {Icon && <LucideIcon className='mx-auto mb-2 h-8 w-8' />}
                <p className='text-4xl font-bold'>{value}</p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
