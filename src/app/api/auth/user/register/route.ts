import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

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
            // If user exists but not verified, we can resend OTP (optional logic, for now just block)
            if (!existingUser.isVerified) {
                // For simplicity, let's update the existing unverified user
                // In production, handle this carefully
            } else {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user;
        if (existingUser && !existingUser.isVerified) {
            user = await prisma.user.update({
                where: { email },
                data: {
                    password,
                    name,
                    otp,
                    otpExpires,
                },
            });
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    password, // Storing plain text for this demo
                    name,
                    otp,
                    otpExpires,
                    isVerified: false,
                },
            });
        }

        // Send Email
        await sendEmail(email, 'Your Verification Code', `Your OTP code is: ${otp}`);

        return NextResponse.json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
