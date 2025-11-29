import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            include: { painting: true },
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { senderName, senderEmail, phoneNumber, content, paintingId } = body;

        if (!content || !senderEmail) {
            return NextResponse.json({ error: 'Content and Email are required' }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                senderName,
                senderEmail,
                phoneNumber,
                content,
                paintingId: paintingId ? parseInt(paintingId) : null,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
