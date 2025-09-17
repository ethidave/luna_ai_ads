import nodemailer from 'nodemailer';
import { renderTemplate } from './emailTemplates';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const html = await renderTemplate(options.template, options.data);
      
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Luna AI'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string, name: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Luna AI - Verify Your Email',
      template: 'verification',
      data: {
        name,
        verificationUrl,
        supportEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Luna AI Password',
      template: 'password-reset',
      data: {
        name,
        resetUrl,
        supportEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
    });
  }

  async sendPasswordResetConfirmationEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Password Successfully Reset - Luna AI',
      template: 'password-reset-confirmation',
      data: {
        name,
        supportEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
    });
  }

  async sendContactFormEmail(formData: {
    name: string;
    email: string;
    company?: string;
    message: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'admin@lunaai.com',
      subject: `New Contact Form Submission from ${formData.name}`,
      template: 'contact-form',
      data: {
        ...formData,
        supportEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
    });
  }

  async sendContactFormConfirmationEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Thank You for Contacting Luna AI',
      template: 'contact-confirmation',
      data: {
        name,
        supportEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
    });
  }
}

export const emailService = new EmailService();

