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
            <div className="relative overflow-hidden rounded-lg mb-3">
                <Image
                    src={painting.imageUrl}
                    alt={painting.title}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-serif font-medium group-hover:text-[var(--accent)] transition-colors">
                        {painting.title}
                    </h3>
                </div>
                <div>
                    <LikeButton paintingId={painting.id} initialLikes={painting.likes} />
                </div>
            </div>
        </Link>
    );
}
