import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const InfoCard = ({ title, value }) => {
    return (
        <Card className={`text-center `}>
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>{title}</CardTitle>
                <CardDescription>
                    {title === "Leads so far for today"
                        ? "July 19, 2024"
                        : "Slots Filled"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-bold'>
                    {title === "Leads so far for today" ? (
                        `${value}`
                    ) : (
                        <>
                            {value}{" "}
                            <span className='text-sm text-zinc-700'>/20</span>
                        </>
                    )}
                </p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
