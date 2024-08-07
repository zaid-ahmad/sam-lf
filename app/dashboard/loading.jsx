import Spinner from "@/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Loading = () => {
    return (
        <div className='container mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8'>
            <h2 className='flex items-center gap-3 sm:gap-5 text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-7'>
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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                    {[...Array(4)].map((_, index) => (
                        <LoadingInfoCard key={index} />
                    ))}
                </div>
            </div>

            {/* Loading animation for the DataTable */}
            <div className='mt-8 rounded-md border p-4 sm:p-8 bg-white'>
                <div className='flex justify-center items-center h-40 sm:h-64'>
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
    <Card className='text-center flex flex-col items-center justify-center h-28 sm:h-36 w-full'>
        <CardHeader className='pb-2 flex flex-col items-center'>
            <CardTitle className='text-base sm:text-lg bg-gray-200 h-4 sm:h-6 w-3/4 rounded animate-pulse'></CardTitle>
        </CardHeader>
        <CardContent>
            <div className='bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded animate-pulse'></div>
        </CardContent>
    </Card>
);

export default Loading;
