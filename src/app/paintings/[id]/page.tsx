import prisma from '@/lib/prisma';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';
import MessageForm from '@/components/MessageForm';
import { notFound } from 'next/navigation';

export default async function PaintingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const painting = await prisma.painting.findUnique({
        where: { id: parseInt(id) },
    });

    if (!painting) {
        notFound();
    }

    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                            src={painting.imageUrl}
                            alt={painting.title}
                            width={800}
                            height={800}
                            className="w-full h-auto object-contain max-h-[80vh]"
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col h-full">
                    <h1 className="text-4xl font-serif font-bold mb-4">{painting.title}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <LikeButton paintingId={painting.id} initialLikes={painting.likes} />
                        <span className="text-sm text-[var(--accent)]">
                            {new Date(painting.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="prose prose-lg mb-12 text-[var(--foreground)]">
                        <p className="whitespace-pre-wrap">{painting.description}</p>
                    </div>

                    <div className="mt-auto">
                        <MessageForm paintingId={painting.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
