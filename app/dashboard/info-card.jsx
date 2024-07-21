import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const InfoCard = ({ title, value, description = "", outOf20 = false }) => {
    return (
        <Card className={`text-center `}>
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-bold'>
                    {value}
                    {outOf20 && (
                        <span className='text-sm font-medium text-zinc-500'>
                            /20
                        </span>
                    )}
                </p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
