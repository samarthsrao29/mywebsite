'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    if (!token) {
        return (
            <div className="flex w-full h-screen items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
                <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                    <h1 className="text-3xl font-serif mb-4 text-center font-bold text-white">Invalid Link</h1>
                    <p className="text-sm text-gray-300 text-center mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold uppercase tracking-wider rounded-lg shadow-xl transform transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] text-center"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-screen items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
            <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <h1 className="text-3xl font-serif mb-4 text-center font-bold text-white">Reset Password</h1>

                {!isSuccess ? (
                    <>
                        <p className="text-sm text-gray-300 text-center mb-8">
                            Enter your new password below.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                            <div className="w-full flex flex-col items-center">
                                <label className="block text-sm font-bold mb-2 w-3/4 text-white">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-3/4 px-4 py-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-black/20 hover:bg-black/30 outline-none placeholder-gray-400 text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center">
                                <label className="block text-sm font-bold mb-2 w-3/4 text-white">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-3/4 px-4 py-4 rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-black/20 hover:bg-black/30 outline-none placeholder-gray-400 text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            {error && <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm text-center border border-red-100 w-3/4">{error}</div>}
                            <button
                                type="submit"
                                className="w-3/4 py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold uppercase tracking-wider rounded-lg shadow-xl transform transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                            >
                                Reset Password
                            </button>
                            <div className="text-center text-sm font-medium mt-4 text-white">
                                Remember your password? <Link href="/login" className="font-bold hover:underline text-white">Sign In</Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                            <p className="text-green-300 text-sm">{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
