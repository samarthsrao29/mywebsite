import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Don't reveal if user exists or not for security
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive password reset instructions.'
            }, { status: 200 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database (you'll need to add these fields to your User model)
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // Send email with reset link
        const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        try {
            await sendEmail(
                email,
                'Password Reset Request',
                `Click here to reset your password: ${resetUrl}`,
                `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
            );
            console.log('Password reset email sent to:', email);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // We still return success to the user to avoid enumeration, but log the error
        }

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive password reset instructions.'
        }, { status: 200 });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
