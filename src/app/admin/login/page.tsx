'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple hardcoded password for demonstration
        if (password === 'admin123') {
            document.cookie = 'admin_session=true; path=/; max-age=86400'; // 1 day
            router.push('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 border border-[var(--border)] rounded-lg">
                <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="Enter admin password"
                        />
                    </div>
                    {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
