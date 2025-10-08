import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface OTPEmailOptions {
  email: string;
  otp: string;
  userName?: string;
  purpose?: 'verification' | 'login' | 'password-reset';
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig;

  constructor() {
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    };

    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      if (!this.config.auth.user || !this.config.auth.pass) {
        console.warn('Email credentials not found in environment variables');
        return;
      }

      this.transporter = nodemailer.createTransport(this.config);

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      console.log('📝 Email will be logged to console instead');
      this.transporter = null;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        // Fallback: Log email to console if SMTP is not configured
        console.log('📧 Email would be sent (SMTP not configured):');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.text || options.html);
        console.log('---');
        return true;
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'Indian Trade Mart'} <${process.env.FROM_EMAIL || this.config.auth.user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  async sendOTP(options: OTPEmailOptions): Promise<boolean> {
    const { email, otp, userName, purpose = 'verification' } = options;
    
    const subject = this.getOTPSubject(purpose);
    const htmlContent = this.generateOTPEmailHTML(otp, userName, purpose);
    const textContent = this.generateOTPEmailText(otp, userName, purpose);

    // Always log OTP to console for development
    console.log(`🔐 OTP for ${email}: ${otp}`);
    
    return await this.sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    });
  }

  private getOTPSubject(purpose: string): string {
    const subjects = {
      verification: 'Verify Your Email - Indian Trade Mart',
      login: 'Your Login OTP - Indian Trade Mart',
      'password-reset': 'Password Reset OTP - Indian Trade Mart',
    };
    return subjects[purpose as keyof typeof subjects] || 'Your OTP - Indian Trade Mart';
  }

  private generateOTPEmailHTML(otp: string, userName?: string, purpose?: string): string {
    const greeting = userName ? `Hello ${userName}` : 'Hello';
    const purposeText = {
      verification: 'verify your email address',
      login: 'complete your login',
      'password-reset': 'reset your password',
    };
    
    const actionText = purposeText[purpose as keyof typeof purposeText] || 'verify your account';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .otp-box { background-color: #f8f9ff; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0; }
            .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #6c757d; font-size: 14px; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }
            .button { display: inline-block; background-color: #667eea; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Indian Trade Mart</h1>
              <p>Your trusted B2B marketplace</p>
            </div>
            <div class="content">
              <h2>${greeting}!</h2>
              <p>You requested an OTP to ${actionText}. Please use the code below:</p>
              
              <div class="otp-box">
                <p>Your OTP Code is:</p>
                <div class="otp-code">${otp}</div>
                <p><strong>This code expires in 5 minutes</strong></p>
              </div>

              <div class="warning">
                <strong>Security Notice:</strong> Never share this OTP with anyone. Indian Trade Mart will never ask for your OTP over phone or email.
              </div>

              <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
              <p>Best regards,<br>The Indian Trade Mart Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Indian Trade Mart. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateOTPEmailText(otp: string, userName?: string, purpose?: string): string {
    const greeting = userName ? `Hello ${userName}` : 'Hello';
    const purposeText = {
      verification: 'verify your email address',
      login: 'complete your login',
      'password-reset': 'reset your password',
    };
    
    const actionText = purposeText[purpose as keyof typeof purposeText] || 'verify your account';

    return `
${greeting}!

You requested an OTP to ${actionText}. 

Your OTP Code: ${otp}

This code expires in 5 minutes.

SECURITY NOTICE: Never share this OTP with anyone. Indian Trade Mart will never ask for your OTP over phone or email.

If you didn't request this OTP, please ignore this email or contact our support team.

Best regards,
The Indian Trade Mart Team

© ${new Date().getFullYear()} Indian Trade Mart. All rights reserved.
This is an automated message, please do not reply to this email.
    `.trim();
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to Indian Trade Mart!';
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1>Welcome to Indian Trade Mart!</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${userName}!</h2>
          <p>Welcome to India's leading B2B marketplace. We're excited to have you on board!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse thousands of products from verified suppliers</li>
            <li>Connect directly with manufacturers and wholesalers</li>
            <li>Post your buying requirements</li>
            <li>Get quotes and negotiate deals</li>
          </ul>
          <p>If you have any questions, our support team is here to help.</p>
          <p>Happy trading!</p>
        </div>
      </div>
    `;
    
    return await this.sendEmail({ to: email, subject, html });
  }

  async sendPasswordResetConfirmation(email: string, userName: string): Promise<boolean> {
    const subject = 'Password Reset Successful - Indian Trade Mart';
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="padding: 30px;">
          <h2>Hello ${userName}!</h2>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>For security reasons, you may need to log in again on all your devices.</p>
          <p>Best regards,<br>The Indian Trade Mart Team</p>
        </div>
      </div>
    `;
    
    return await this.sendEmail({ to: email, subject, html });
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('⚠️ SMTP not configured - emails will be logged to console');
        return false;
      }

      await this.transporter.verify();
      console.log('✅ Email configuration test successful');
      return true;
    } catch (error) {
      console.error('❌ Email configuration test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;

// Export types for use in other files
export type { EmailOptions, OTPEmailOptions };