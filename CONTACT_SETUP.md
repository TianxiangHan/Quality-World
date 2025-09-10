# Contact Form Setup Guide
## Quality World with Thomas Website

This guide explains how to set up the contact form functionality for your website, including both frontend and backend components.

## 🎯 Features Included

- ✅ **Professional Contact Form** with validation
- ✅ **Real-time Client-side Validation**
- ✅ **Spam Protection** (honeypot + rate limiting)
- ✅ **Email Notifications** to Thomas
- ✅ **Success/Error Messages** for users
- ✅ **Newsletter Subscription** option
- ✅ **Mobile Responsive** design
- ✅ **Accessibility Compliant** (WCAG 2.1 AA)
- ✅ **Multiple Backend Options** (PHP & Node.js)

## 📋 Form Fields

- **Name** (required) - Full name validation
- **Email** (required) - Email format validation
- **Company** (optional) - Organization name
- **Subject** (required) - Dropdown with relevant topics
- **Priority Level** - Normal, High, Urgent
- **Message** (required) - Text area with character counter
- **Newsletter Signup** (optional) - Checkbox
- **Consent** (required) - GDPR compliance

## 🚀 Frontend Implementation

The frontend is already implemented and includes:

### Files Created:
- `pages/contact.html` - Contact page with form
- `js/contact.js` - Form validation and submission logic
- CSS styles added to `css/styles.css`

### Key Features:
- Real-time validation with visual feedback
- Character counter for message field
- Loading states during submission
- Comprehensive error handling
- Accessibility enhancements

## 🔧 Backend Setup Options

Choose one of the following backend implementations:

### Option 1: Node.js + Express (Recommended)

#### Prerequisites:
```bash
node --version  # Should be 14+ 
npm --version   # Should be 6+
```

#### Setup Steps:

1. **Navigate to backend directory:**
   ```bash
   cd backend-examples
   ```

2. **Initialize Node.js project:**
   ```bash
   npm init -y
   ```

3. **Install dependencies:**
   ```bash
   npm install express nodemailer cors helmet express-rate-limit
   ```

4. **Configure email settings in `contact-handler.js`:**
   ```javascript
   const emailConfig = {
       service: 'gmail',  // or your email provider
       auth: {
           user: 'your-email@gmail.com',
           pass: 'your-app-password'  // Use app password for Gmail
       }
   };
   
   const RECIPIENT_EMAIL = 'thomas@qualityworld.com';
   ```

5. **Start the server:**
   ```bash
   node contact-handler.js
   ```

6. **Update frontend to use backend:**
   Edit `js/contact.js` and update the API endpoint:
   ```javascript
   // Replace the submitContactForm function with:
   async function submitContactForm(data) {
       const response = await fetch('http://localhost:3001/api/contact', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       });
       
       const result = await response.json();
       
       if (!response.ok) {
           throw new Error(result.message || 'Network error');
       }
       
       return result;
   }
   ```

### Option 2: PHP Implementation

#### Prerequisites:
- PHP 7.4+ with cURL extension
- Web server (Apache/Nginx)
- Composer for dependency management

#### Setup Steps:

1. **Install PHPMailer:**
   ```bash
   cd backend-examples
   composer require phpmailer/phpmailer
   ```

2. **Configure email settings in `contact-handler.php`:**
   ```php
   $config = [
       'smtp_host' => 'smtp.gmail.com',
       'smtp_username' => 'your-email@gmail.com',
       'smtp_password' => 'your-app-password',
       'smtp_port' => 587,
       'to_email' => 'thomas@qualityworld.com'
   ];
   ```

3. **Upload to your web server** and note the URL

4. **Update frontend to use PHP backend:**
   Edit `js/contact.js`:
   ```javascript
   async function submitContactForm(data) {
       const response = await fetch('https://yourdomain.com/backend-examples/contact-handler.php', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       });
       
       const result = await response.json();
       
       if (!response.ok) {
           throw new Error(result.message || 'Network error');
       }
       
       return result;
   }
   ```

## 📧 Email Provider Setup

### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in your configuration

### Other Providers:
- **Outlook/Hotmail:** Similar app password process
- **Custom SMTP:** Use your hosting provider's SMTP settings
- **SendGrid/Mailgun:** Professional email services (recommended for production)

## 🔒 Security Features

### Implemented Protections:
- **Rate Limiting:** Max 5 submissions per 15 minutes per IP
- **Input Sanitization:** HTML/JS injection prevention
- **Honeypot Field:** Hidden spam trap
- **CORS Configuration:** Restrict allowed origins
- **Content Security Policy:** XSS prevention
- **Email Validation:** Server-side format checking

### Additional Recommendations:
- Use HTTPS in production
- Implement CAPTCHA for high-traffic sites
- Set up monitoring/alerting for failed submissions
- Regular security updates

## 🎨 Customization Options

### Styling:
- Colors defined in CSS variables for easy theming
- Responsive breakpoints for all devices
- Professional gradient designs

### Form Fields:
- Add/remove fields in `contact.html`
- Update validation in `contact.js`
- Modify email templates in backend files

### Email Templates:
- HTML and text versions included
- Professional formatting with company branding
- Customizable priority indicators

## 📊 Analytics & Monitoring

### Frontend Events:
```javascript
// Already implemented in contact.js:
- contact_form_submitted
- contact_form_error
- newsletter_subscription_requested
```

### Backend Logging:
- Successful submissions logged
- Error tracking included
- Newsletter subscription tracking

## 🧪 Testing

### Local Testing:
1. Start your chosen backend server
2. Open `http://localhost:8000/pages/contact.html`
3. Fill out and submit the form
4. Check console for success/error messages
5. Verify email delivery

### Production Testing:
- Test with various email providers
- Verify spam folder delivery
- Check mobile responsiveness
- Test rate limiting functionality

## 🚀 Deployment

### Frontend:
- Upload all files to your web hosting
- Ensure HTTPS is enabled
- Update CORS settings in backend

### Backend:
- **Node.js:** Deploy to Heroku, Vercel, or VPS
- **PHP:** Upload to shared hosting or VPS
- Update API endpoint URLs in frontend

### Environment Variables:
Create `.env` file for sensitive data:
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=thomas@qualityworld.com
```

## 🆘 Troubleshooting

### Common Issues:

**"Failed to send message"**
- Check email credentials
- Verify SMTP settings
- Check server logs for detailed errors

**"CORS Error"**
- Update allowed origins in backend
- Ensure proper headers are set

**"Rate Limited"**
- Wait 15 minutes between test submissions
- Adjust rate limiting settings if needed

**Email not received**
- Check spam folder
- Verify recipient email address
- Test with different email providers

### Debug Mode:
Enable detailed logging in backend files for troubleshooting.

## 📞 Support

For implementation help or customization needs, contact Thomas through the live contact form once it's set up!

---

**Created for Quality World with Thomas** | Professional Quality Systems Education Platform

