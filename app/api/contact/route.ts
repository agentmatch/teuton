import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transporter - You'll need to configure this with your SMTP settings
    // For Gmail, you'll need an App Password (not your regular password)
    // For other services, check their SMTP documentation
    const transporter = nodemailer.createTransport({
      // Gmail example (requires app password):
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your-app-password'
      },
      
      // Alternative: Custom SMTP server
      // host: process.env.SMTP_HOST || 'smtp.example.com',
      // port: parseInt(process.env.SMTP_PORT || '587'),
      // secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASSWORD
      // },
    })

    // Email to Teuton
    const mailToCompany = {
      from: process.env.SMTP_EMAIL || 'your-email@gmail.com',
      to: 'info@teuton.com', // Teuton's email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from the Teuton Resources website contact form.</small></p>
      `
    }

    // Confirmation email to sender
    const mailToSender = {
      from: process.env.SMTP_EMAIL || 'your-email@gmail.com',
      to: email,
      subject: 'Thank you for contacting Silver Grail Resources',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <br>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>Silver Grail Resources Ltd.</p>
        <hr>
        <p><small>
          2130 Crescent Road<br>
          Victoria, BC V8S 2H3<br>
          Phone: (778) 430-5680<br>
          Email: info@silvergrail.com
        </small></p>
      `
    }

    // Send emails
    await transporter.sendMail(mailToCompany)
    await transporter.sendMail(mailToSender)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}