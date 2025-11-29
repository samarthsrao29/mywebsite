'use client';

import { useState, useEffect } from 'react';
import { Painting, Message, Like, User } from '@prisma/client';
import { Trash2, MessageSquare, Image as ImageIcon, Heart } from 'lucide-react';

type PaintingWithLikes = Painting & {
    likesList: (Like & {
        user: {
            name: string | null;
            email: string;
        }
    })[];
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'paintings' | 'messages'>('paintings');
    const [paintings, setPaintings] = useState<PaintingWithLikes[]>([]);
    const [messages, setMessages] = useState<(Message & { painting: Painting | null })[]>([]);
    const [loading, setLoading] = useState(true);

    // Upload form state
    const [uploading, setUploading] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        // Check for existing session
        if (document.cookie.includes('admin_session=true')) {
            setIsAuthenticated(true);
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paintingsRes, messagesRes] = await Promise.all([
                fetch('/api/paintings', { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                fetch('/api/messages', { headers: { 'ngrok-skip-browser-warning': 'true' } })
            ]);

            if (paintingsRes.ok) setPaintings(await paintingsRes.json());
            if (messagesRes.ok) setMessages(await messagesRes.json());
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePainting = async (id: number) => {
        if (!confirm('Are you sure you want to delete this painting?')) return;

        try {
            const res = await fetch(`/api/paintings/${id}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (res.ok) {
                setPaintings(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            alert('Failed to delete painting');
        }
    };

    const handleDeleteMessage = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
            }
        } catch (error) {
            alert('Failed to delete message');
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/paintings', {
                method: 'POST',
                headers: { 'ngrok-skip-browser-warning': 'true' },
                body: formData,
            });

            if (res.ok) {
                const newPainting = await res.json();
                setPaintings(prev => [newPainting, ...prev]);
                (e.target as HTMLFormElement).reset();
                alert('Painting uploaded successfully!');
            } else {
                alert('Failed to upload painting');
            }
        } catch (error) {
            alert('Error uploading painting');
        } finally {
            setUploading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            document.cookie = 'admin_session=true; path=/; max-age=86400';
            setIsAuthenticated(true);
            fetchData();
        } else {
            setAuthError('Invalid password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl relative z-10 mx-4">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif mb-2">Admin Access</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Please enter your credentials to continue</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label className="label-premium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium"
                                placeholder="Enter admin password"
                            />
                        </div>
                        {authError && <div className="text-red-500 mb-4 text-sm text-center bg-red-50 p-2 rounded">{authError}</div>}
                        <button type="submit" className="btn-premium w-full">
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-[var(--foreground)] rounded-full mb-4"></div>
                <div className="text-lg font-medium">Loading dashboard...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--accent-light)]">
            <div className="container py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif mb-2">Dashboard</h1>
                        <p className="text-[var(--accent)]">Manage your gallery and messages</p>
                    </div>

                    <div className="bg-[var(--background)] p-1 rounded-full border border-[var(--border)] shadow-sm inline-flex">
                        <button
                            onClick={() => setActiveTab('paintings')}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'paintings'
                                ? 'bg-[var(--foreground)] text-[var(--background)] shadow-md'
                                : 'text-[var(--accent)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            Paintings
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'messages'
                                ? 'bg-[var(--foreground)] text-[var(--background)] shadow-md'
                                : 'text-[var(--accent)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            Messages
                        </button>
                    </div>
                </div>

                {activeTab === 'paintings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4">
                            <div className="card p-6 sticky top-8">
                                <h2 className="text-xl font-serif mb-6 flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                                    <ImageIcon className="w-5 h-5" /> Add New Painting
                                </h2>
                                <form onSubmit={handleUpload}>
                                    <div className="mb-4">
                                        <label className="label-premium">Title</label>
                                        <input type="text" name="title" required className="input-premium" placeholder="e.g. Sunset at the Bay" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="label-premium">Description</label>
                                        <textarea name="description" rows={4} className="input-premium resize-none" placeholder="Describe the artwork..." />
                                    </div>
                                    <div className="mb-6">
                                        <label className="label-premium">Image</label>
                                        <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[var(--accent)] transition-colors cursor-pointer relative">
                                            <input type="file" name="image" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="text-[var(--accent)]">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <span className="text-sm">Click to upload image</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={uploading} className="btn-premium w-full">
                                        {uploading ? 'Uploading...' : 'Upload Painting'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-serif">Gallery Collection</h2>
                                <span className="text-sm bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded-full">
                                    {paintings.length} Items
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {paintings.map(painting => (
                                    <div key={painting.id} className="card group overflow-hidden">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={painting.imageUrl}
                                                alt={painting.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleDeletePainting(painting.id)}
                                                    className="bg-white text-red-500 p-3 rounded-full shadow-lg hover:bg-red-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                                    title="Delete Painting"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg">{painting.title}</h3>
                                                <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                    ♥ {painting.likes}
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--accent)] line-clamp-2 mb-3">{painting.description}</p>

                                            <div className="border-t border-[var(--border)] pt-3 mt-3">
                                                <div className="text-xs font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1">
                                                    <Heart className="w-3 h-3" /> Liked by:
                                                </div>
                                                {painting.likesList && painting.likesList.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {painting.likesList.map((like, i) => (
                                                            <div key={i} className="text-xs bg-[var(--accent-light)] px-2 py-1 rounded text-[var(--accent)]" title={like.user.email}>
                                                                {like.user.name || like.user.email}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-[var(--accent)] italic">No likes yet</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif flex items-center gap-3">
                                <MessageSquare className="w-6 h-6" /> Inbox
                            </h2>
                            <span className="text-sm bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded-full">
                                {messages.length} Messages
                            </span>
                        </div>

                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                                    <MessageSquare className="w-12 h-12 mx-auto text-[var(--border)] mb-4" />
                                    <p className="text-[var(--accent)] text-lg">No messages yet.</p>
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className="card p-6 hover:border-[var(--primary)] transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                {/* Email */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm font-medium text-[var(--accent)]">From:</span>
                                                    <span className="text-base font-semibold">{msg.senderEmail || 'No email provided'}</span>
                                                </div>

                                                {/* Painting Name */}
                                                {msg.painting && (
                                                    <div className="flex items-center gap-2 mb-3 bg-[var(--accent-light)] px-3 py-1.5 rounded-lg inline-flex">
                                                        <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                                                        <span className="text-sm font-medium">Re: {msg.painting.title}</span>
                                                    </div>
                                                )}

                                                {/* Message */}
                                                <div className="mt-4 p-4 bg-[var(--accent-light)] rounded-lg">
                                                    <p className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-colors flex-shrink-0"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
