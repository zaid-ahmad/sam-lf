import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import MobileMenuToggle from "./mobile-menu-toggle";

const LogoutNavbar = () => {
    return (
        <nav className='bg-white border-gray-200'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <Link href='/' className='flex items-baseline justify-end'>
                    <Image
                        src='/lf-logo.png'
                        width={180}
                        height={180}
                        alt='logo'
                    />
                    <p className='text-xs font-black'>SAM 2.0</p>
                </Link>

                <div
                    className='hidden w-full md:block md:w-auto'
                    id='navbar-default'
                >
                    <ul className='font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
                        <li>
                            <p>Welcome!</p>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const AdminNavbar = () => {
    return (
        <nav className='bg-white border-gray-200'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <a href='/' className='flex items-baseline justify-end'>
                    <Image
                        src='/lf-logo.png'
                        width={180}
                        height={180}
                        alt='logo'
                    />
                    <p className='text-xs font-black'>SAM 2.0</p>
                </a>

                <MobileMenuToggle>
                    <ul className='font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
                        <li>
                            <Link
                                href='/pending-installs'
                                className='block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0'
                                aria-current='page'
                            >
                                Pending installs
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/past-leads'
                                className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0'
                            >
                                Past leads
                            </Link>
                        </li>

                        <li>
                            <form
                                action={async (formData) => {
                                    "use server";
                                    await signOut({ callbackUrl: "/auth" });
                                }}
                            >
                                <button
                                    type='submit'
                                    className='py-2 px-3 border bg-zinc-100 rounded-lg flex items-center gap-3 transition hover:text-zinc-900 hover:bg-zinc-200 text-xs font-normal cursor-pointer'
                                >
                                    <p className=''>Logout</p>
                                    <LogOut className='h-5 w-5 text-zinc-700' />
                                </button>
                            </form>
                        </li>
                    </ul>
                </MobileMenuToggle>
            </div>
        </nav>
    );
};

const CanvasserNavbar = () => {
    return (
        <nav className='bg-white border-gray-200'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <Link href='/' className='flex items-baseline justify-end'>
                    <Image
                        src='/lf-logo.png'
                        width={180}
                        height={180}
                        alt='logo'
                    />
                    <p className='text-xs font-black'>SAM 2.0</p>
                </Link>

                <MobileMenuToggle>
                    <ul className='font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
                        <li>
                            <Link
                                href='/book-lead'
                                className='block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0'
                                aria-current='page'
                            >
                                Appointment request form
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/past-leads'
                                className='block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0'
                            >
                                Past leads
                            </Link>
                        </li>
                        <li>
                            <form
                                action={async (formData) => {
                                    "use server";
                                    await signOut({ callbackUrl: "/auth" });
                                }}
                            >
                                <button
                                    type='submit'
                                    className='py-2 px-3 border bg-zinc-100 rounded-lg flex items-center gap-3 transition hover:text-zinc-900 hover:bg-zinc-200 text-xs font-normal cursor-pointer'
                                >
                                    <p className=''>Logout</p>
                                    <LogOut className='h-5 w-5 text-zinc-700' />
                                </button>
                            </form>
                        </li>
                    </ul>
                </MobileMenuToggle>
            </div>
        </nav>
    );
};

const SalesRepNavbar = () => {
    return (
        <nav className='bg-white border-gray-200'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <Link href='/' className='flex items-baseline justify-end'>
                    <Image
                        src='/lf-logo.png'
                        width={180}
                        height={180}
                        alt='logo'
                    />
                    <p className='text-xs font-black'>SAM 2.0</p>
                </Link>

                <MobileMenuToggle>
                    <ul className='font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
                        <li>
                            <form
                                action={async (formData) => {
                                    "use server";
                                    await signOut({ callbackUrl: "/auth" });
                                }}
                            >
                                <button
                                    type='submit'
                                    className='py-2 px-3 border bg-zinc-100 rounded-lg flex items-center gap-3 transition hover:text-zinc-900 hover:bg-zinc-200 text-xs font-normal cursor-pointer'
                                >
                                    <p className=''>Logout</p>
                                    <LogOut className='h-5 w-5 text-zinc-700' />
                                </button>
                            </form>
                        </li>
                    </ul>
                </MobileMenuToggle>
            </div>
        </nav>
    );
};

const Navbar = async () => {
    const session = await auth();

    const role = session?.user?.role;

    return role === "ADMIN" || role === "SUPERADMIN" ? (
        <AdminNavbar />
    ) : role === "CANVASSER" ? (
        <CanvasserNavbar />
    ) : role === "SALES_REP" ? (
        <SalesRepNavbar />
    ) : (
        <LogoutNavbar />
    );
};

export default Navbar;
