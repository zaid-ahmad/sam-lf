import AuthForm from "@/components/auth-form";

const AuthPage = () => {
    return (
        <main className='bg-zinc-100'>
            <main className='bg-zinc-100 flex min-h-screen flex-col items-center pt-20'>
                <AuthForm />
            </main>
        </main>
    );
};

export default AuthPage;
