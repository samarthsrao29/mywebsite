import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }>; }
) {
    const { id } = await params;
    const paintingId = parseInt(id);

    if (isNaN(paintingId)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(userSession.value);

    // Self-healing: Check if global prisma instance has the Like model
    let db: any = prisma;
    if (!db.like) {
        console.warn('Global prisma instance is stale. Attempting to reload @prisma/client...');
        try {
            // Force reload of the module
            const modulePath = require.resolve('@prisma/client');
            delete require.cache[modulePath];
            const { PrismaClient } = require('@prisma/client');
            db = new PrismaClient();
            console.log('Successfully reloaded PrismaClient. Like model exists:', !!db.like);
        } catch (e) {
            console.error('Failed to reload prisma client:', e);
            // Fallback to existing (will likely fail, but we tried)
        }
    }

    try {
        // Check if already liked
        const existingLike = await db.like.findUnique({
            where: {
                userId_paintingId: {
                    userId,
                    paintingId,
                },
            },
        });

        let painting;

        if (existingLike) {
            // Unlike: Delete like and decrement count
            [, painting] = await db.$transaction([
                db.like.delete({
                    where: {
                        userId_paintingId: {
                            userId,
                            paintingId,
                        },
                    },
                }),
                db.painting.update({
                    where: { id: paintingId },
                    data: { likes: { decrement: 1 } },
                }),
            ]);

            return NextResponse.json({ ...painting, liked: false });
        } else {
            // Like: Create like and increment count
            [, painting] = await db.$transaction([
                db.like.create({
                    data: {
                        userId,
                        paintingId,
                    },
                }),
                db.painting.update({
                    where: { id: paintingId },
                    data: { likes: { increment: 1 } },
                }),
            ]);

            return NextResponse.json({ ...painting, liked: true });
        }
    } catch (error: any) {
        console.error('Like error:', error);
        return NextResponse.json({ error: `Failed to like painting: ${error.message}` }, { status: 500 });
    }
}
