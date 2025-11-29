import Link from 'next/link';
import Image from 'next/image';
import LikeButton from './LikeButton';
import { Painting } from '@prisma/client';

interface PaintingCardProps {
    painting: Painting;
}

export default function PaintingCard({ painting }: PaintingCardProps) {
    return (
        <Link href={`/paintings/${painting.id}`} className="block group">
            <div className="card p-0 h-full">
                <div className="relative overflow-hidden aspect-square">
                    <Image
                        src={painting.imageUrl}
                        alt={painting.title}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                                {painting.title}
                            </h3>
                            {painting.description && (
                                <p className="text-sm text-[var(--accent)] line-clamp-2">
                                    {painting.description}
                                </p>
                            )}
                        </div>
                        <div className="flex-shrink-0">
                            <LikeButton paintingId={painting.id} initialLikes={painting.likes} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
