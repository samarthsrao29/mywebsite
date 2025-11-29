"use client";

import Link from "next/link";
import UserNav from "./UserNav";
import { usePathname } from "next/navigation";

interface NavBarProps {
    user: {
        name: string | null;
        email: string;
    } | null;
}

export default function NavBar({ user }: NavBarProps) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    const handleAdminLogout = () => {
        document.cookie = 'admin_session=; path=/; max-age=0';
        window.location.href = '/admin/login';
    };

    return (
        <nav className="border-b border-[var(--border)] py-4">
            <div className="container flex justify-between items-center">
                <Link href="/" className="text-2xl font-serif font-bold">
                    ARTIST
                </Link>
                {!isAuthPage && (
                    <div className="flex gap-6 items-center">
                        {isAdminPage ? (
                            <button
                                onClick={handleAdminLogout}
                                className="text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <UserNav user={user} />
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
