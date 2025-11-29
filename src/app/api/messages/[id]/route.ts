import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { reply } = body;

        if (!reply) {
            return NextResponse.json({ error: 'Reply content is required' }, { status: 400 });
        }

        const message = await prisma.message.update({
            where: { id: parseInt(id) },
            data: { reply },
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reply to message' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.message.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
