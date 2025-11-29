'use client';

import { useState } from 'react';

export default function MessageForm({ paintingId }: { paintingId?: number }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            senderName: formData.get('senderName'),
            senderEmail: formData.get('senderEmail'),
            phoneNumber: formData.get('phoneNumber'),
            content: formData.get('content'),
            paintingId: paintingId,
        };

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        <div className="bg-[var(--background)] border border-[var(--border)] p-6 rounded-lg">
            <h3 className="text-xl font-serif mb-4">Inquire about this piece</h3>
            {status === 'success' ? (
                <div className="text-green-600 p-4 bg-green-50 rounded">
                    Message sent successfully! The artist will get back to you soon.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="senderName" className="label">Name (Optional)</label>
                        <input type="text" id="senderName" name="senderName" className="input" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="senderEmail" className="label">Email *</label>
                        <input type="email" id="senderEmail" name="senderEmail" required className="input" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="label">Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" className="input mb-1" />
                        <div className="text-xs text-[var(--accent)] flex items-center gap-1">
                            Is this your WhatsApp number?
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="label">Message *</label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={4}
                            className="input resize-none"
                            placeholder="Hi, I'm interested in this painting..."
                        />
                    </div>
                    {status === 'error' && (
                        <div className="text-red-600 mb-4 text-sm">Failed to send message. Please try again.</div>
                    )}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn btn-primary w-full"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
    );
}
