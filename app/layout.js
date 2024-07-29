import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Lead Flow Manager",
    description: "Track your D2D leads with ease.",
    icons: {
        apple: "/apple-touch-icon.png",
        icon: [
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#5bbad5",
            },
        ],
    },
    manifest: "/site.webmanifest",
    themeColor: "#ffffff",
    msapplication: {
        tileColor: "#da532c",
    },
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
