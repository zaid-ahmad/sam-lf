import Spinner from "@/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Loading = () => {
    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <h2 className='flex items-center gap-5 text-xl sm:text-2xl font-semibold mb-4 sm:mb-7'>
                Loading dashboard...
                <span>
                    <Spinner
                        color={"text-emerald-800"}
                        height={0.1}
                        padding={0}
                    />
                </span>
            </h2>

            <div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4'>
                    {/* Skeleton loader for InfoCards */}
                    {[...Array(4)].map((_, index) => (
                        <LoadingInfoCard key={index} />
                    ))}
                </div>
            </div>

            {/* Loading animation for the DataTable */}
            <div className='mt-8 rounded-md border p-8 bg-white'>
                <div className='flex justify-center items-center h-64'>
                    <Spinner
                        color={"text-emerald-800"}
                        height={0.5}
                        padding={0}
                    />
                </div>
            </div>
        </div>
    );
};

const LoadingInfoCard = () => (
    <Card className='text-center flex flex-col items-center justify-center h-36 w-56'>
        <CardHeader className='pb-2 flex flex-col items-center'>
            <CardTitle className='text-lg bg-gray-200 h-6 w-3/4 rounded animate-pulse'></CardTitle>
        </CardHeader>
        <CardContent>
            <div className='bg-gray-200 h-8 w-16 rounded animate-pulse'></div>
        </CardContent>
    </Card>
);

export default Loading;
