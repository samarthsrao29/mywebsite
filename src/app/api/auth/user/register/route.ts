import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // In a real app, hash the password!
        const user = await prisma.user.create({
            data: {
                email,
                password, // Storing plain text for this demo as requested by simplicity
                name,
            },
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
