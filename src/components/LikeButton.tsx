'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    paintingId: number;
    initialLikes: number;
    initialLiked?: boolean;
}

export default function LikeButton({ paintingId, initialLikes, initialLiked = false }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        // Optimistic update - toggle
        const wasLiked = liked;
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);

        try {
            const res = await fetch(`/api/paintings/${paintingId}/like`, {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!res.ok) {
                // Revert if failed
                if (res.status === 401) {
                    // Unauthorized, redirect to login
                    window.location.href = '/login';
                    return;
                }
                // Revert on any error
                setLiked(wasLiked);
                setLikes(prev => wasLiked ? prev + 1 : prev - 1);
            } else {
                // Update with actual data from server
                const data = await res.json();
                setLikes(data.likes);
                setLiked(data.liked);
            }
        } catch (error) {
            // Revert on error
            setLiked(wasLiked);
            setLikes(prev => wasLiked ? prev + 1 : prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${liked
                ? 'bg-red-50 text-red-500 dark:bg-red-950'
                : 'bg-[var(--accent-light)] text-[var(--accent)] hover:bg-red-50 hover:text-red-500'
                }`}
            disabled={loading}
        >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
        </button>
    );
}
