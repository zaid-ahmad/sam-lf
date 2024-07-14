import { auth } from "@/auth";

const Dashboard = async () => {
    const session = await auth();

    return (
        <main className='bg-zinc-100'>
            <h1>Welcome {session.user?.email}</h1>
        </main>
    );
};

export default Dashboard;
