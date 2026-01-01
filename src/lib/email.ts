import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
    // Check if we have real credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Artist Gallery" <noreply@example.com>',
            to,
            subject,
            text,
            html,
        });
    } else {
        // Mock: Log to console
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL] To: ${to}`);
        console.log(`[MOCK EMAIL] Subject: ${subject}`);
        console.log(`[MOCK EMAIL] Body: ${text}`);
        if (html) {
            console.log(`[MOCK EMAIL] HTML: ${html.substring(0, 100)}...`);
        }
        console.log('---------------------------------------------------');
    }
}
