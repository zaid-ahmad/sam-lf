import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const InfoCard = ({ title, value, description = "", className }) => {
    return (
        <Card className={`text-center ${className}`}>
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-bold'>{value}</p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
