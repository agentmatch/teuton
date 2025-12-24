# AWS SES Setup Guide for Silver Grail Contact Form

This guide will help you set up Amazon SES (Simple Email Service) to handle contact form submissions for Silver Grail Resources.

## Prerequisites

- AWS Account
- Domain access for email verification
- Silver Grail project with contact form

## Step 1: AWS SES Console Setup

1. **Navigate to AWS SES Console**
   - Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
   - Select your preferred region (recommended: `us-west-2` for Vancouver operations)

2. **Verify Email Addresses**
   - Go to "Verified identities" in the left sidebar
   - Click "Create identity"
   - Choose "Email address"
   - Add these emails:
     - `info@silvergrail.com` (will receive contact form submissions)
     - `noreply@silvergrail.com` (will send auto-replies)
   - Check each email inbox and click the verification link

3. **Request Production Access** (Important!)
   - By default, SES starts in "Sandbox mode" (can only send to verified emails)
   - Go to "Account dashboard" in left sidebar
   - Click "Request production access"
   - Fill out the form:
     - **Use case**: Transactional emails (contact form, notifications)
     - **Website URL**: https://silvergrail.com
     - **Expected sending volume**: 50-100 emails per month
     - **Bounce/complaint handling**: We handle bounces and complaints appropriately
   - Wait for approval (usually 24-48 hours)

## Step 2: Create IAM User for SES

1. **Navigate to IAM Console**
   - Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Click "Users" in the left sidebar
   - Click "Create user"

2. **Configure User**
   - **User name**: `silvergrail-ses-user`
   - **Access type**: Programmatic access (no AWS Management Console access needed)
   - Click "Next"

3. **Set Permissions**
   - Choose "Attach existing policies directly"
   - Search for and select: `AmazonSESFullAccess`
   - Click "Next" → "Create user"

4. **Save Credentials**
   - **IMPORTANT**: Copy and securely store:
     - Access Key ID
     - Secret Access Key
   - You won't be able to see the secret key again!

## Step 3: Configure Environment Variables

Update your `.env.local` file with the SES credentials:

```bash
# AWS SES Configuration (for contact form emails)
AWS_ACCESS_KEY_ID=AKIA...your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-west-2

# Email Configuration
CONTACT_EMAIL=info@silvergrail.com
SES_FROM_EMAIL=noreply@silvergrail.com
```

## Step 4: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the contact form**:
   - Navigate to http://localhost:3000/contact
   - Fill out and submit the contact form
   - Check the server console for success/error messages
   - If SES is not configured, the form will still work but only log to console

3. **Check email delivery**:
   - Submitted form should send email to `info@silvergrail.com`
   - Submitter should receive auto-reply from `noreply@silvergrail.com`

## Step 5: Production Deployment

For production deployment on Vercel:

1. **Add environment variables to Vercel**:
   ```bash
   vercel env add AWS_ACCESS_KEY_ID
   vercel env add AWS_SECRET_ACCESS_KEY
   vercel env add AWS_REGION
   vercel env add CONTACT_EMAIL
   vercel env add SES_FROM_EMAIL
   ```

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Common Issues

1. **"Email address not verified" error**
   - Ensure both `CONTACT_EMAIL` and `SES_FROM_EMAIL` are verified in SES
   - Check spam folders for verification emails

2. **"Access Denied" error**
   - Verify IAM user has `AmazonSESFullAccess` policy
   - Check that access keys are correctly set in environment variables

3. **"Daily sending quota exceeded"**
   - In sandbox mode, limit is 200 emails/day
   - Request production access to increase limits

4. **Emails not being delivered**
   - Check SES bounce/complaint rates in AWS console
   - Verify recipient email addresses are valid
   - Check spam folders

### Monitoring

- **SES Dashboard**: Monitor sending statistics, bounce rates, complaints
- **CloudWatch**: Set up alarms for bounce/complaint rates
- **Server Logs**: Check application logs for detailed error messages

## Email Templates

The contact form sends two types of emails:

1. **Contact Form Notification** (to info@silvergrail.com)
   - Professional HTML template with company branding
   - Includes all form data in organized format
   - Reply-to set to form submitter's email

2. **Auto-reply** (to form submitter)
   - Thank you message with company contact information
   - Professional acknowledgment of receipt
   - Sets expectation for response time (24 hours)

## Security Best Practices

- **IAM User**: Create dedicated IAM user with minimal permissions
- **Environment Variables**: Never commit AWS credentials to version control
- **Access Keys**: Rotate access keys regularly
- **Monitoring**: Set up CloudWatch alarms for suspicious activity
- **Bounce Handling**: Monitor and handle bounces/complaints appropriately

## Cost Estimation

AWS SES Pricing (as of 2024):
- First 1,000 emails/month: Free (if sent from EC2/Lambda)
- $0.10 per 1,000 emails after that
- For Silver Grail's expected volume (50-100 emails/month): **Essentially free**

## Support

For issues with this setup:
1. Check AWS SES documentation
2. Review server logs for error messages
3. Test with verified email addresses first
4. Contact AWS support if needed

---

**Status**: Ready for production use once AWS credentials are configured.
**Last Updated**: January 2025