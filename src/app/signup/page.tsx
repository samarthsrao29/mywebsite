'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [step, setStep] = useState<'signup' | 'verify'>('signup');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('verify');
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ email, otp }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Verification failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 border border-[var(--border)] rounded-lg animate-fade-in">
                <h1 className="text-2xl font-serif mb-6 text-center">
                    {step === 'signup' ? 'Create Account' : 'Verify Email'}
                </h1>

                {step === 'signup' ? (
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label className="label">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                        <button type="submit" className="btn btn-primary w-full mb-4">
                            Sign Up
                        </button>
                        <div className="text-center text-sm">
                            Already have an account? <Link href="/login" className="text-[var(--accent)] hover:underline">Login</Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="animate-slide-up">
                        <div className="mb-4">
                            <p className="text-sm text-[var(--accent)] mb-4 text-center">
                                We sent a verification code to <strong>{email}</strong>.
                                <br />Please check your email (and console).
                            </p>
                            <label className="label">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="input text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>
                        {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}
                        <button type="submit" className="btn btn-primary w-full mb-4">
                            Verify & Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('signup')}
                            className="w-full text-sm text-[var(--accent)] hover:underline"
                        >
                            Back to Signup
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
