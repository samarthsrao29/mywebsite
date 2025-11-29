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

    // If user is logged in, show the gallery
    const paintings = await prisma.painting.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container py-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Gallery</h1>
                <p className="text-[var(--accent)] max-w-2xl mx-auto">
                    Explore a collection of fine art paintings. Each piece tells a unique story through color and texture.
                </p>
            </header>

            {paintings.length === 0 ? (
                <div className="text-center py-20 text-[var(--accent)]">
                    <p>No paintings found. Visit the Admin Dashboard to add some.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paintings.map((painting) => (
                        <PaintingCard key={painting.id} painting={painting} />
                    ))}
                </div>
            )}
        </div>
    );
}
