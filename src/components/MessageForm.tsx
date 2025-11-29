'use client';

import { useState } from 'react';

export default function MessageForm({ paintingId, userEmail }: { paintingId?: number; userEmail?: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            senderEmail: userEmail, // Use logged-in user's email
            phoneNumber: formData.get('phoneNumber'),
            content: formData.get('content'),
            paintingId: paintingId,
        };

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="card p-6">
            <h3 className="text-2xl font-serif mb-6 font-semibold">Inquire about this piece</h3>
            {status === 'success' ? (
                <div className="text-green-600 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm mt-1">Thank you for your message and support</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="phoneNumber" className="label">Phone Number (Optional)</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" className="input" placeholder="+1 234 567 8900" />
                        <div className="text-xs text-[var(--accent)] mt-1">
                            💬 Is this your WhatsApp number?
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="label">Message *</label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={5}
                            className="input resize-none"
                            placeholder="Hi, I'm interested in this painting..."
                        />
                    </div>
                    {status === 'error' && (
                        <div className="text-red-600 p-3 bg-red-50 dark:bg-red-950 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            Failed to send message. Please try again.
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn btn-primary w-full py-3 text-base"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
    );
}
