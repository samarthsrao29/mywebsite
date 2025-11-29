import prisma from '@/lib/prisma';
import PaintingCard from '@/components/PaintingCard';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const cookieStore = await cookies();
    const userSession = cookieStore.get("user_session")?.value;

    let user = null;
    if (userSession) {
        user = await prisma.user.findUnique({
            where: { id: parseInt(userSession) },
            select: { name: true, email: true }
        });
    }

    // If user is not logged in, show welcome page
    if (!user) {
        return (
            <div className="container py-8">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h1 className="text-5xl md:text-6xl font-serif mb-6">Welcome to Artist Gallery</h1>
                    <p className="text-xl text-[var(--accent)] mb-8 max-w-2xl mx-auto">
                        Explore a curated collection of fine art paintings. Each piece tells a unique story through color and texture.
                    </p>
                    <p className="text-lg mb-8">
                        Please log in to view the gallery and interact with the artwork.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-[var(--accent)] text-white rounded-md hover:opacity-90 transition-opacity font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-8 py-3 border-2 border-[var(--accent)] text-[var(--accent)] rounded-md hover:bg-[var(--accent)] hover:text-white transition-all font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // If user is logged in, fetch paintings with user's like status
    const paintings = await prisma.painting.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            likesList: {
                where: { userId: parseInt(userSession) },
                select: { id: true }
            }
        }
    });

    // Transform to include liked status
    const paintingsWithLiked = paintings.map(painting => ({
        ...painting,
        userLiked: painting.likesList.length > 0,
        likesList: undefined // Remove from response
    }));

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center bg-[var(--accent-light)] overflow-hidden mb-16">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="container relative z-10 text-center animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">
                        Artistry <span className="text-[var(--accent)] italic">&</span> Soul
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--accent)] max-w-2xl mx-auto font-light leading-relaxed">
                        Explore a curated collection where every stroke tells a story.
                    </p>
                </div>
            </section>

            <div className="container pb-20">
                {paintings.length === 0 ? (
                    <div className="text-center py-20 text-[var(--accent)] animate-fade-in">
                        <p>No paintings found. Visit the Admin Dashboard to add some.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paintings.map((painting, index) => (
                            <div
                                key={painting.id}
                                className="animate-scale-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <PaintingCard painting={painting} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
