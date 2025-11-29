import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        // Verify user and clear OTP
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpires: null,
            },
        });

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('user_session', user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
