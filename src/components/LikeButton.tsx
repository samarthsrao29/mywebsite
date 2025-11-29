'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    paintingId: number;
    initialLikes: number;
}

export default function LikeButton({ paintingId, initialLikes }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();
        if (loading || liked) return;

        setLoading(true);
        // Optimistic update
        setLikes(prev => prev + 1);
        setLiked(true);

        try {
            const res = await fetch(`/api/paintings/${paintingId}/like`, {
                method: 'POST',
            });

            if (!res.ok) {
                // Revert if failed
                if (res.status === 401) {
                    // Unauthorized, redirect to login
                    window.location.href = '/login';
                    return;
                } else if (res.status === 400) {
                    // Already liked, keep it liked
                    setLiked(true);
                } else {
                    setLikes(prev => prev - 1);
                    setLiked(false);
                }
            }
        } catch (error) {
            setLikes(prev => prev - 1);
            setLiked(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            disabled={loading}
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
        </button>
    );
}
