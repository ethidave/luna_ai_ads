import Handlebars from 'handlebars';

const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .features {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .feature {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
            color: #4b5563;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #8b5cf6;
            text-decoration: none;
            font-size: 14px;
        }
        
        .support-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .support-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        
        .support-text {
            font-size: 14px;
            color: #92400e;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 30px 0;
        }
        
        .highlight {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
        }
        
        .highlight-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        
        .highlight-text {
            color: #92400e;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .title {
                font-size: 24px;
            }
            
            .button {
                padding: 14px 28px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🚀 Luna AI</div>
            <div class="header-subtitle">Transform Your Advertising with AI</div>
        </div>
        
        <div class="content">
            {{content}}
        </div>
        
        <div class="footer">
            <div class="footer-text">
                <strong>Luna AI</strong><br>
                Transform Your Advertising with AI
            </div>
            <div class="social-links">
                <a href="#" class="social-link">Website</a>
                <a href="#" class="social-link">Support</a>
                <a href="#" class="social-link">Privacy</a>
            </div>
            <div class="footer-text">
                This email was sent to {{email}}. If you didn't request this, please ignore it.
            </div>
        </div>
    </div>
</body>
</html>
`;

// Email verification template
const verificationTemplate = `
<div class="title">Welcome to Luna AI! 🎉</div>

<div class="message">
    Hi <strong>{{name}}</strong>,<br><br>
    
    Thank you for joining Luna AI! We're excited to help you transform your advertising with the power of artificial intelligence.
</div>

<div class="button-container">
    <a href="{{verificationUrl}}" class="button">Verify Your Email Address</a>
</div>

<div class="message">
    Click the button above to verify your email address and activate your account. This link will expire in 24 hours.
</div>

<div class="features">
    <div class="feature">
        <div class="feature-icon">✓</div>
        <div>AI-powered campaign optimization</div>
    </div>
    <div class="feature">
        <div class="feature-icon">✓</div>
        <div>Real-time analytics and insights</div>
    </div>
    <div class="feature">
        <div class="feature-icon">✓</div>
        <div>Multi-platform ad management</div>
    </div>
    <div class="feature">
        <div class="feature-icon">✓</div>
        <div>24/7 customer support</div>
    </div>
</div>

<div class="highlight">
    <div class="highlight-title">🚀 Ready to Get Started?</div>
    <div class="highlight-text">
        Once verified, you can immediately start creating and optimizing your ad campaigns with our AI-powered tools.
    </div>
</div>

<div class="support-info">
    <div class="support-title">Need Help?</div>
    <div class="support-text">
        If you have any questions or need assistance, please contact our support team at <strong>{{supportEmail}}</strong>
    </div>
</div>
`;

// Password reset template
const passwordResetTemplate = `
<div class="title">Reset Your Password 🔐</div>

<div class="message">
    Hi <strong>{{name}}</strong>,<br><br>
    
    We received a request to reset your password for your Luna AI account. If you made this request, click the button below to reset your password.
</div>

<div class="button-container">
    <a href="{{resetUrl}}" class="button">Reset My Password</a>
</div>

<div class="message">
    This password reset link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
</div>

<div class="highlight">
    <div class="highlight-title">🔒 Security Notice</div>
    <div class="highlight-text">
        For your security, this link will only work once and expires after 1 hour. Never share this link with anyone.
    </div>
</div>

<div class="support-info">
    <div class="support-title">Didn't Request This?</div>
    <div class="support-text">
        If you didn't request a password reset, please contact our support team immediately at <strong>{{supportEmail}}</strong>
    </div>
</div>
`;

// Password reset confirmation template
const passwordResetConfirmationTemplate = `
<div class="title">Password Successfully Reset ✅</div>

<div class="message">
    Hi <strong>{{name}}</strong>,<br><br>
    
    Your password has been successfully reset. You can now log in to your Luna AI account with your new password.
</div>

<div class="button-container">
    <a href="{{baseUrl}}/auth/login" class="button">Log In to Your Account</a>
</div>

<div class="message">
    If you didn't make this change, please contact our support team immediately as your account may have been compromised.
</div>

<div class="highlight">
    <div class="highlight-title">🛡️ Account Security Tips</div>
    <div class="highlight-text">
        • Use a strong, unique password<br>
        • Enable two-factor authentication if available<br>
        • Never share your login credentials<br>
        • Log out from shared devices
    </div>
</div>

<div class="support-info">
    <div class="support-title">Need Help?</div>
    <div class="support-text">
        If you have any questions or concerns, please contact our support team at <strong>{{supportEmail}}</strong>
    </div>
</div>
`;

// Contact form template (for admin)
const contactFormTemplate = `
<div class="title">New Contact Form Submission 📧</div>

<div class="message">
    You have received a new contact form submission from your Luna AI website.
</div>

<div class="highlight">
    <div class="highlight-title">Contact Details</div>
    <div class="highlight-text">
        <strong>Name:</strong> {{name}}<br>
        <strong>Email:</strong> {{email}}<br>
        <strong>Company:</strong> {{company}}<br>
        <strong>Message:</strong><br>
        {{message}}
    </div>
</div>

<div class="message">
    Please respond to this inquiry as soon as possible to maintain good customer service.
</div>

<div class="button-container">
    <a href="mailto:{{email}}" class="button">Reply to {{name}}</a>
</div>
`;

// Contact confirmation template (for user)
const contactConfirmationTemplate = `
<div class="title">Thank You for Contacting Us! 🙏</div>

<div class="message">
    Hi <strong>{{name}}</strong>,<br><br>
    
    Thank you for reaching out to Luna AI! We've received your message and our team will get back to you within 24 hours.
</div>

<div class="features">
    <div class="feature">
        <div class="feature-icon">📧</div>
        <div>We'll respond to: {{email}}</div>
    </div>
    <div class="feature">
        <div class="feature-icon">⏰</div>
        <div>Response time: Within 24 hours</div>
    </div>
    <div class="feature">
        <div class="feature-icon">🎯</div>
        <div>We'll help you with your advertising needs</div>
    </div>
</div>

<div class="highlight">
    <div class="highlight-title">🚀 While You Wait</div>
    <div class="highlight-text">
        Explore our platform and discover how Luna AI can transform your advertising campaigns with AI-powered optimization.
    </div>
</div>

<div class="button-container">
    <a href="{{baseUrl}}" class="button">Explore Luna AI</a>
</div>

<div class="support-info">
    <div class="support-title">Need Immediate Help?</div>
    <div class="support-text">
        For urgent matters, please call us or email <strong>{{supportEmail}}</strong>
    </div>
</div>
`;

const templates = {
  verification: verificationTemplate,
  'password-reset': passwordResetTemplate,
  'password-reset-confirmation': passwordResetConfirmationTemplate,
  'contact-form': contactFormTemplate,
  'contact-confirmation': contactConfirmationTemplate,
};

export async function renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
  const template = templates[templateName as keyof typeof templates];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  const compiledTemplate = Handlebars.compile(template);
  const content = compiledTemplate(data);
  
  const baseCompiled = Handlebars.compile(baseTemplate);
  return baseCompiled({
    title: data.title || 'Luna AI',
    content,
    email: data.email || 'user',
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  });
}

