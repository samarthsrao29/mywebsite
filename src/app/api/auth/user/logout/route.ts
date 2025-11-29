import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear the user_session cookie
    response.cookies.set('user_session', '', {
        maxAge: 0,
        path: '/',
    });

    return response;
}
