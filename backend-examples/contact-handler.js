/**
 * Contact Form Handler - Node.js Express Server
 * Quality World with Thomas
 * 
 * SETUP INSTRUCTIONS:
 * 1. npm init -y
 * 2. npm install express nodemailer cors helmet express-rate-limit
 * 3. Configure email settings below
 * 4. Run: node contact-handler.js
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:8000', 'https://yourdomain.com'], // Update for production
    credentials: true
}));

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many contact form submissions, please try again later.'
    }
});

app.use(express.json());
app.use('/api/contact', contactLimiter);

/**
 * Email Configuration
 * Update these settings for your email provider
 */
const emailConfig = {
    // Gmail example
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use app password for Gmail
    }
    
    // Alternative SMTP configuration:
    /*
    host: 'smtp.yourdomain.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@yourdomain.com',
        pass: 'your-password'
    }
    */
};

const RECIPIENT_EMAIL = 'thomas@qualityworld.com';
const SENDER_EMAIL = 'your-email@gmail.com';

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

/**
 * Validation functions
 */
function validateContactForm(data) {
    const errors = [];
    
    // Required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
    }
    
    if (!data.subject) {
        errors.push('Subject is required');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    if (!data.consent) {
        errors.push('Consent to contact is required');
    }
    
    // Length limits
    if (data.name && data.name.length > 100) {
        errors.push('Name is too long');
    }
    
    if (data.message && data.message.length > 1000) {
        errors.push('Message is too long');
    }
    
    // Spam check (honeypot)
    if (data.website) {
        errors.push('Spam detected');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '');
}

/**
 * Email template functions
 */
function generateEmailHTML(data, clientIP) {
    const companyInfo = data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : '';
    const newsletterInfo = data.newsletter ? '<p><em>Requested newsletter subscription</em></p>' : '';
    const urgencyClass = data.urgency !== 'normal' ? 'urgency' : '';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; max-width: 600px; margin: 0 auto; }
            .field { margin-bottom: 15px; }
            .field strong { color: #667eea; }
            .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #667eea; }
            .footer { background: #f8f9fa; padding: 15px; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; }
            .urgency { background: #fef2f2; border: 1px solid #dc2626; padding: 10px; margin-bottom: 20px; border-radius: 5px; color: #dc2626; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Quality World with Thomas</p>
        </div>
        
        <div class="content">
            ${data.urgency !== 'normal' ? `<div class="urgency"><strong>⚠️ Priority Level:</strong> ${data.urgency.toUpperCase()}</div>` : ''}
            
            <div class="field">
                <strong>From:</strong> ${data.name} &lt;${data.email}&gt;
            </div>
            
            ${companyInfo}
            
            <div class="field">
                <strong>Subject Category:</strong> ${data.subject}
            </div>
            
            <div class="field">
                <strong>Message:</strong>
                <div class="message-box">
                    ${data.message.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${newsletterInfo}
        </div>
        
        <div class="footer">
            <p><strong>Submission Details:</strong></p>
            <p>📅 Timestamp: ${new Date(data.timestamp).toLocaleString()}</p>
            <p>🌐 IP Address: ${clientIP}</p>
            <p>🖥️ User Agent: ${data.userAgent || 'Unknown'}</p>
        </div>
    </body>
    </html>
    `;
}

function generateEmailText(data, clientIP) {
    const companyInfo = data.company ? `\nCompany: ${data.company}` : '';
    const newsletterInfo = data.newsletter ? '\n[✓] Requested newsletter subscription' : '';
    const urgencyInfo = data.urgency !== 'normal' ? `\n⚠️ PRIORITY: ${data.urgency.toUpperCase()}\n` : '';
    
    return `
Quality World with Thomas - New Contact Form Submission
=====================================

${urgencyInfo}
From: ${data.name} <${data.email}>${companyInfo}
Subject Category: ${data.subject}

Message:
--------
${data.message}

${newsletterInfo}

Submission Details:
📅 Timestamp: ${new Date(data.timestamp).toLocaleString()}
🌐 IP Address: ${clientIP}
🖥️ User Agent: ${data.userAgent || 'Unknown'}
    `;
}

/**
 * Subject mapping
 */
const subjectMap = {
    'consultation': 'Quality Consultation Request',
    'training': 'Training & Education Inquiry',
    'auditing': 'Quality Auditing Request',
    'food-safety': 'Food Safety Question',
    'pharmaceutical': 'Pharmaceutical GMP Inquiry',
    'cosmetic': 'Cosmetic Quality Question',
    'certification': 'Certification Guidance Request',
    'speaking': 'Speaking Engagement Inquiry',
    'collaboration': 'Collaboration Opportunity',
    'general': 'General Inquiry'
};

/**
 * Contact form endpoint
 */
app.post('/api/contact', async (req, res) => {
    try {
        // Get client IP
        const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
        
        // Sanitize input data
        const data = {
            name: sanitizeInput(req.body.name?.trim()),
            email: sanitizeInput(req.body.email?.trim()),
            company: sanitizeInput(req.body.company?.trim() || ''),
            subject: sanitizeInput(req.body.subject),
            urgency: sanitizeInput(req.body.urgency || 'normal'),
            message: sanitizeInput(req.body.message?.trim()),
            newsletter: Boolean(req.body.newsletter),
            consent: Boolean(req.body.consent),
            timestamp: req.body.timestamp || new Date().toISOString(),
            userAgent: req.headers['user-agent'],
            website: req.body.website // Honeypot field
        };
        
        // Validate form data
        const validationErrors = validateContactForm(data);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors.join(', ')
            });
        }
        
        // Generate email subject
        const urgencyPrefix = data.urgency === 'urgent' ? '[URGENT] ' : 
                             data.urgency === 'high' ? '[HIGH PRIORITY] ' : '';
        const emailSubject = urgencyPrefix + (subjectMap[data.subject] || 'Contact Form Submission');
        
        // Prepare email
        const mailOptions = {
            from: `"Quality World Contact Form" <${SENDER_EMAIL}>`,
            to: RECIPIENT_EMAIL,
            replyTo: `"${data.name}" <${data.email}>`,
            subject: emailSubject,
            text: generateEmailText(data, clientIP),
            html: generateEmailHTML(data, clientIP)
        };
        
        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        // Log successful submission
        console.log(`✅ Contact form submitted successfully: ${data.email} - ${data.subject} - MessageID: ${info.messageId}`);
        
        // Handle newsletter subscription if requested
        if (data.newsletter) {
            handleNewsletterSubscription(data.email, data.name);
        }
        
        res.json({
            success: true,
            message: 'Message sent successfully'
        });
        
    } catch (error) {
        console.error('❌ Contact form error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

/**
 * Newsletter subscription handler
 */
function handleNewsletterSubscription(email, name) {
    // Implement your newsletter service integration here
    // Examples: Mailchimp, SendGrid, ConvertKit, etc.
    
    console.log(`📧 Newsletter subscription request: ${email} (${name})`);
    
    // Example implementation would go here
    // You could save to database, call external API, etc.
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Quality World Contact Form API'
    });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`🚀 Contact form server running on port ${PORT}`);
    console.log(`📧 Email transporter configured for: ${emailConfig.auth?.user || emailConfig.user || 'SMTP server'}`);
    console.log(`📬 Messages will be sent to: ${RECIPIENT_EMAIL}`);
});

module.exports = app;

