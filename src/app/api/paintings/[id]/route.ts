import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const painting = await prisma.painting.findUnique({
            where: { id: parseInt(id) },
        });

        if (!painting) {
            return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
        }

        return NextResponse.json(painting);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch painting' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File;

        const data: any = {
            title,
            description,
        };

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
            const filename = `${Date.now()}-${sanitizedFilename}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            data.imageUrl = `/uploads/${filename}`;
        }

        const painting = await prisma.painting.update({
            where: { id: parseInt(id) },
            data,
        });

        return NextResponse.json(painting);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update painting' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // Optional: Delete image file from disk
        const painting = await prisma.painting.findUnique({
            where: { id: parseInt(id) },
        });

        if (painting?.imageUrl) {
            const filepath = path.join(process.cwd(), 'public', painting.imageUrl);
            try {
                await unlink(filepath);
            } catch (e) {
                console.error('Failed to delete image file', e);
            }
        }

        await prisma.painting.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete painting' }, { status: 500 });
    }
}
