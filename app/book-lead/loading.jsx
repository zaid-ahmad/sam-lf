import Spinner from "@/components/spinner";

const Loading = () => {
    return (
        <div className='container'>
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h2 className='text-2xl font-semibold mb-4'>
                    Loading Appointment Request Form
                </h2>
                <p className='mt-4 text-gray-600'>
                    Please wait while we prepare the form...
                </p>
            </div>
        </div>
    );
};

export default Loading;
