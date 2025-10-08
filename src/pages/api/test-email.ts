import { NextApiRequest, NextApiResponse } from 'next';
import { emailService } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, type = 'test' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    let result = false;
    
    switch (type) {
      case 'test':
        // Test email configuration
        result = await emailService.testEmailConfiguration();
        if (result) {
          // Send test email
          result = await emailService.sendEmail({
            to: email,
            subject: 'Email Configuration Test - Indian Trade Mart',
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 30px;">
                <h2>✅ Email Configuration Test Successful!</h2>
                <p>This is a test email to verify that your email service is working correctly.</p>
                <p>If you received this email, your SMTP configuration is working properly.</p>
                <p>Best regards,<br>The Indian Trade Mart Team</p>
              </div>
            `
          });
        }
        break;
        
      case 'otp':
        // Generate test OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        result = await emailService.sendOTP({
          email,
          otp,
          userName: 'Test User',
          purpose: 'verification'
        });
        break;
        
      case 'welcome':
        result = await emailService.sendWelcomeEmail(email, 'Test User');
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid test type' });
    }

    if (result) {
      res.status(200).json({ 
        success: true, 
        message: `${type} email sent successfully`,
        email,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: `Failed to send ${type} email - check console logs`,
        email
      });
    }
  } catch (error: any) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      message: 'Email service error - check your SMTP configuration'
    });
  }
}