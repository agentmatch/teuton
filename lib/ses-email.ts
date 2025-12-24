import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
}

export async function sendContactFormEmail(formData: ContactFormData) {
  const {
    name,
    email,
    company,
    phone,
    subject,
    message,
  } = formData

  // Email template for the contact form submission
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission - Silver Grail Resources</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #073440 0%, #0a4a5c 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 30px -30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #073440;
          }
          .field-label {
            font-weight: bold;
            color: #073440;
            margin-bottom: 5px;
          }
          .field-value {
            margin: 0;
            color: #333;
          }
          .message-field {
            background: white;
            border: 1px solid #dee2e6;
            padding: 20px;
            border-radius: 5px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
          }
          .timestamp {
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <div class="timestamp">Received: ${new Date().toLocaleString('en-US', {
              timeZone: 'America/Vancouver',
              dateStyle: 'full',
              timeStyle: 'long'
            })}</div>
          </div>

          <div class="field">
            <div class="field-label">Full Name:</div>
            <div class="field-value">${name}</div>
          </div>

          <div class="field">
            <div class="field-label">Email Address:</div>
            <div class="field-value">
              <a href="mailto:${email}">${email}</a>
            </div>
          </div>

          ${company ? `
          <div class="field">
            <div class="field-label">Company:</div>
            <div class="field-value">${company}</div>
          </div>
          ` : ''}

          ${phone ? `
          <div class="field">
            <div class="field-label">Phone Number:</div>
            <div class="field-value">
              <a href="tel:${phone}">${phone}</a>
            </div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">${subject}</div>
          </div>

          <div class="field">
            <div class="field-label">Message:</div>
            <div class="message-field">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="footer">
            <p><strong>Silver Grail Resources Ltd.</strong></p>
            <p>This message was sent via the contact form on silvergrail.com</p>
            <p>Please respond directly to the sender's email address: ${email}</p>
          </div>
        </div>
      </body>
    </html>
  `

  // Plain text version for email clients that don't support HTML
  const textBody = `
    New Contact Form Submission - Silver Grail Resources
    
    Received: ${new Date().toLocaleString('en-US', {
      timeZone: 'America/Vancouver',
      dateStyle: 'full',
      timeStyle: 'long'
    })}
    
    Full Name: ${name}
    Email: ${email}
    ${company ? `Company: ${company}` : ''}
    ${phone ? `Phone: ${phone}` : ''}
    Subject: ${subject}
    
    Message:
    ${message}
    
    ---
    Silver Grail Resources Ltd.
    This message was sent via the contact form on silvergrail.com
    Please respond directly to the sender's email address: ${email}
  `

  const params = {
    Destination: {
      ToAddresses: [
        process.env.CONTACT_EMAIL || 'info@silvergrail.com'
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `[Silver Grail Contact] ${subject} - from ${name}`,
      },
    },
    Source: process.env.SES_FROM_EMAIL || 'noreply@silvergrail.com',
    ReplyToAddresses: [email], // Allow direct reply to the form submitter
  }

  try {
    const command = new SendEmailCommand(params)
    const result = await sesClient.send(command)
    
    console.log('Email sent successfully:', {
      messageId: result.MessageId,
      from: name,
      email: email,
      subject: subject,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: true,
      messageId: result.MessageId,
    }
  } catch (error) {
    console.error('SES Email sending failed:', error)
    throw new Error('Failed to send email via SES')
  }
}

// Function to send auto-reply email to the form submitter
export async function sendAutoReplyEmail(formData: ContactFormData) {
  const { name, email, subject } = formData

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for contacting Silver Grail Resources</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #073440 0%, #0a4a5c 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: -30px -30px 30px -30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
          }
          .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Inquiry</h1>
          </div>

          <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for contacting Silver Grail Resources. We have received your inquiry regarding "<strong>${subject}</strong>" and will respond within 24 hours during regular business hours.</p>
            
            <p>Your message is important to us, and a member of our team will review your inquiry and provide you with the information you need.</p>
            
            <div class="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Silver Grail Resources Ltd.</strong></p>
              <p>📧 Email: info@silvergrail.com</p>
              <p>📞 Phone: +1 (778) 430-5680</p>
              <p>🏢 Address: 2130 Crescent Road, Victoria, BC V8S 2H3, Canada</p>
              <p>🌐 Website: <a href="https://silvergrail.com">silvergrail.com</a></p>
            </div>
            
            <p>For urgent matters or investor relations inquiries, please call our direct line.</p>
            
            <p>Best regards,<br>
            <strong>Silver Grail Resources Team</strong></p>
          </div>

          <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>If you need immediate assistance, please contact us directly at info@silvergrail.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  const textBody = `
    Thank You for Your Inquiry - Silver Grail Resources
    
    Dear ${name},
    
    Thank you for contacting Silver Grail Resources. We have received your inquiry regarding "${subject}" and will respond within 24 hours during regular business hours.
    
    Your message is important to us, and a member of our team will review your inquiry and provide you with the information you need.
    
    Contact Information:
    Silver Grail Resources Ltd.
    Email: info@silvergrail.com
    Phone: +1 (778) 430-5680
    Address: 2130 Crescent Road, Victoria, BC V8S 2H3, Canada
    Website: silvergrail.com
    
    For urgent matters or investor relations inquiries, please call our direct line.
    
    Best regards,
    Silver Grail Resources Team
    
    ---
    This is an automated response. Please do not reply to this email.
    If you need immediate assistance, please contact us directly at info@silvergrail.com
  `

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Thank you for contacting Silver Grail Resources',
      },
    },
    Source: process.env.SES_FROM_EMAIL || 'noreply@silvergrail.com',
  }

  try {
    const command = new SendEmailCommand(params)
    const result = await sesClient.send(command)
    
    console.log('Auto-reply email sent successfully:', {
      messageId: result.MessageId,
      to: email,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: true,
      messageId: result.MessageId,
    }
  } catch (error) {
    console.error('Auto-reply email sending failed:', error)
    // Don't throw error for auto-reply failures, just log them
    return {
      success: false,
      error: error
    }
  }
}