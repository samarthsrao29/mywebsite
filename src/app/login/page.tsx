'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 140px)', background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff, #fce7f3)' }}>
            <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-serif mb-8 text-center font-bold" style={{ color: 'black' }}>Welcome Back</h1>
                <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center mb-4">
                        <label className="block text-sm font-bold mb-2 w-3/4" style={{ color: 'black' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-3/4 px-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white outline-none placeholder-gray-500"
                            style={{ color: 'black' }}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="w-full flex flex-col items-center mt-24">
                        <label className="block text-sm font-bold mb-2 w-3/4" style={{ color: 'black' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-3/4 px-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white outline-none placeholder-gray-500"
                            style={{ color: 'black' }}
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm text-center border border-red-100 w-3/4">{error}</div>}
                    <button
                        type="submit"
                        className="w-3/4 py-4 px-4 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold uppercase tracking-wider rounded-lg shadow-xl transform transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                    <div className="text-center text-sm font-medium mt-4" style={{ color: 'black' }}>
                        Don't have an account? <Link href="/signup" className="font-bold hover:underline" style={{ color: 'black' }}>Create account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
