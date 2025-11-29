import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
    title: "Artist Portfolio",
    description: "A showcase of fine art paintings.",
};


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const userSession = cookieStore.get("user_session")?.value;

    let user = null;
    if (userSession) {
        user = await prisma.user.findUnique({
            where: { id: parseInt(userSession) },
            select: { name: true, email: true }
        });
    }

    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} flex flex-col min-h-screen`}>
                <NavBar user={user} />
                <main className="flex-1 w-full flex flex-col">
                    {children}
                </main>
                <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--accent)]">
                    &copy; {new Date().getFullYear()} Artist Portfolio. All rights reserved.
                </footer>
            </body>
        </html>
    );
}
