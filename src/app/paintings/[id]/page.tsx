import prisma from '@/lib/prisma';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';
import MessageForm from '@/components/MessageForm';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

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

    // Get user session
    const cookieStore = await cookies();
    const userSession = cookieStore.get("user_session")?.value;
    let userEmail: string | undefined;

    if (userSession) {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userSession) },
            select: { email: true }
        });
        userEmail = user?.email;
    }

    return (
        <div className="container py-12 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="animate-scale-in">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-xl">
                        <Image
                            src={painting.imageUrl}
                            alt={painting.title}
                            width={800}
                            height={800}
                            className="w-full h-auto object-contain max-h-[80vh] hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col h-full animate-slide-up delay-200">
                    <h1 className="text-5xl font-serif font-bold mb-6">{painting.title}</h1>

                    <div className="flex items-center gap-6 mb-10 pb-6 border-b border-[var(--border)]">
                        <LikeButton paintingId={painting.id} initialLikes={painting.likes} />
                        <span className="text-sm text-[var(--accent)] uppercase tracking-widest">
                            {new Date(painting.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="prose prose-lg mb-12 text-[var(--foreground)] leading-relaxed opacity-90">
                        <p className="whitespace-pre-wrap">{painting.description}</p>
                    </div>

                    <div className="mt-auto animate-fade-in delay-500">
                        <MessageForm paintingId={painting.id} userEmail={userEmail} />
                    </div>
                </div>
            </div>
        </div>
    );
}
