import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const paintings = await prisma.painting.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                likesList: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json(paintings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch paintings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('image') as File;

        if (!title || !file) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${sanitizedFilename}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        const imageUrl = `/uploads/${filename}`;

        const painting = await prisma.painting.create({
            data: {
                title,
                description: description || '',
                imageUrl,
            },
        });

        return NextResponse.json(painting);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to create painting' }, { status: 500 });
    }
}
