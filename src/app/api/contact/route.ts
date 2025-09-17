import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send contact form email to admin
    const adminEmailSent = await emailService.sendContactFormEmail({
      name,
      email,
      company,
      message,
    });

    if (!adminEmailSent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send contact form' },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    const userEmailSent = await emailService.sendContactFormConfirmationEmail(
      email,
      name
    );

    // Don't fail if user confirmation email fails
    if (!userEmailSent) {
      console.warn('Failed to send confirmation email to user:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}