'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                // Auto login or redirect to login
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 border border-[var(--border)] rounded-lg">
                <h1 className="text-2xl font-serif mb-6 text-center">Create Account</h1>
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
            </div>
        </div>
    );
}
