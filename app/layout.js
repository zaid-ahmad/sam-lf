import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Lead Flow Manager",
    description: "Track your D2D leads with ease.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={`${inter.className} bg-zinc-100`}>
                <nav>
                    <Navbar />
                </nav>
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
