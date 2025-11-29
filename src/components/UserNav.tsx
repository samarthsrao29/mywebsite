"use client";

import Link from "next/link";

interface UserNavProps {
    user: {
        name: string | null;
        email: string;
    } | null;
}

export default function UserNav({ user }: UserNavProps) {
    if (!user) {
        return (
            <Link href="/login" className="hover:text-[var(--accent)]">
                Login
            </Link>
        );
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/user/logout', { method: 'POST' });
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
        >
            Logout
        </button>
    );
}
