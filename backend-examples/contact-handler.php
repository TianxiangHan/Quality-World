<?php
/**
 * Contact Form Handler for Quality World with Thomas
 * 
 * This PHP script handles contact form submissions and sends emails.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install PHPMailer: composer require phpmailer/phpmailer
 * 2. Configure SMTP settings below
 * 3. Set up proper web server with PHP support
 * 4. Update CORS settings for your domain
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8000'); // Update for production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once 'vendor/autoload.php'; // PHPMailer autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * Configuration - Update these settings
 */
$config = [
    'smtp_host' => 'smtp.gmail.com', // Or your SMTP server
    'smtp_username' => 'your-email@gmail.com',
    'smtp_password' => 'your-app-password', // Use app password for Gmail
    'smtp_port' => 587,
    'smtp_secure' => PHPMailer::ENCRYPTION_STARTTLS,
    'from_email' => 'your-email@gmail.com',
    'from_name' => 'Quality World Contact Form',
    'to_email' => 'thomas@qualityworld.com', // Thomas's email
    'to_name' => 'Thomas - Quality World'
];

try {
    // Get and decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $required_fields = ['name', 'email', 'subject', 'message', 'consent'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }
    
    // Sanitize input data
    $data = [
        'name' => htmlspecialchars(trim($input['name'])),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'company' => htmlspecialchars(trim($input['company'] ?? '')),
        'subject' => htmlspecialchars(trim($input['subject'])),
        'urgency' => htmlspecialchars(trim($input['urgency'] ?? 'normal')),
        'message' => htmlspecialchars(trim($input['message'])),
        'newsletter' => !empty($input['newsletter']),
        'consent' => !empty($input['consent']),
        'timestamp' => $input['timestamp'] ?? date('c'),
        'user_agent' => htmlspecialchars($input['userAgent'] ?? '')
    ];
    
    // Additional validation
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    if (strlen($data['name']) < 2) {
        throw new Exception('Name must be at least 2 characters');
    }
    
    if (strlen($data['message']) < 10) {
        throw new Exception('Message must be at least 10 characters');
    }
    
    // Check for spam (honeypot)
    if (!empty($input['website'])) {
        throw new Exception('Spam detected');
    }
    
    // Rate limiting (basic implementation)
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_limit_file = "rate_limit_$ip.txt";
    if (file_exists($rate_limit_file)) {
        $last_submission = (int)file_get_contents($rate_limit_file);
        if (time() - $last_submission < 60) { // 1 minute cooldown
            throw new Exception('Please wait before submitting another message');
        }
    }
    
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    
    // Recipients
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email'], $config['to_name']);
    $mail->addReplyTo($data['email'], $data['name']);
    
    // Subject mapping
    $subject_map = [
        'consultation' => 'Quality Consultation Request',
        'training' => 'Training & Education Inquiry',
        'auditing' => 'Quality Auditing Request',
        'food-safety' => 'Food Safety Question',
        'pharmaceutical' => 'Pharmaceutical GMP Inquiry',
        'cosmetic' => 'Cosmetic Quality Question',
        'certification' => 'Certification Guidance Request',
        'speaking' => 'Speaking Engagement Inquiry',
        'collaboration' => 'Collaboration Opportunity',
        'general' => 'General Inquiry'
    ];
    
    $urgency_prefix = $data['urgency'] === 'urgent' ? '[URGENT] ' : 
                     ($data['urgency'] === 'high' ? '[HIGH PRIORITY] ' : '');
    
    $email_subject = $urgency_prefix . ($subject_map[$data['subject']] ?? 'Contact Form Submission');
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $email_subject;
    
    // Email body
    $html_body = generateEmailHTML($data);
    $text_body = generateEmailText($data);
    
    $mail->Body = $html_body;
    $mail->AltBody = $text_body;
    
    // Send email
    $mail->send();
    
    // Update rate limit file
    file_put_contents($rate_limit_file, time());
    
    // Log successful submission
    error_log("Contact form submitted successfully from: {$data['email']} - Subject: {$data['subject']}");
    
    // If newsletter subscription requested, handle it
    if ($data['newsletter']) {
        // Add to newsletter list (implement your newsletter service integration)
        handleNewsletterSubscription($data['email'], $data['name']);
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * Generate HTML email body
 */
function generateEmailHTML($data) {
    $company_info = $data['company'] ? "<p><strong>Company:</strong> {$data['company']}</p>" : '';
    $newsletter_info = $data['newsletter'] ? '<p><em>Requested newsletter subscription</em></p>' : '';
    
    return "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .field strong { color: #667eea; }
            .footer { background: #f8f9fa; padding: 15px; font-size: 12px; color: #666; }
            .urgency { background: #fef2f2; border: 1px solid #dc2626; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>Quality World with Thomas</p>
        </div>
        
        <div class='content'>
            " . ($data['urgency'] !== 'normal' ? "<div class='urgency'><strong>Priority Level:</strong> " . strtoupper($data['urgency']) . "</div>" : "") . "
            
            <div class='field'>
                <strong>From:</strong> {$data['name']} &lt;{$data['email']}&gt;
            </div>
            
            {$company_info}
            
            <div class='field'>
                <strong>Subject:</strong> {$data['subject']}
            </div>
            
            <div class='field'>
                <strong>Message:</strong><br>
                <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;'>
                    " . nl2br($data['message']) . "
                </div>
            </div>
            
            {$newsletter_info}
        </div>
        
        <div class='footer'>
            <p><strong>Submission Details:</strong></p>
            <p>Timestamp: {$data['timestamp']}</p>
            <p>User Agent: {$data['user_agent']}</p>
            <p>IP Address: {$_SERVER['REMOTE_ADDR']}</p>
        </div>
    </body>
    </html>
    ";
}

/**
 * Generate plain text email body
 */
function generateEmailText($data) {
    $company_info = $data['company'] ? "\nCompany: {$data['company']}" : '';
    $newsletter_info = $data['newsletter'] ? "\n[Requested newsletter subscription]" : '';
    $urgency_info = $data['urgency'] !== 'normal' ? "\nPRIORITY: " . strtoupper($data['urgency']) . "\n" : '';
    
    return "
Quality World with Thomas - New Contact Form Submission
=====================================

{$urgency_info}
From: {$data['name']} <{$data['email']}>{$company_info}
Subject: {$data['subject']}

Message:
--------
{$data['message']}

{$newsletter_info}

Submission Details:
Timestamp: {$data['timestamp']}
IP Address: {$_SERVER['REMOTE_ADDR']}
    ";
}

/**
 * Handle newsletter subscription
 */
function handleNewsletterSubscription($email, $name) {
    // Implement your newsletter service integration here
    // Examples: Mailchimp, SendGrid, ConvertKit, etc.
    
    // For now, just log it
    error_log("Newsletter subscription request: $email ($name)");
    
    // Example Mailchimp integration:
    /*
    $mailchimp_api_key = 'your-api-key';
    $list_id = 'your-list-id';
    
    $data = [
        'email_address' => $email,
        'status' => 'subscribed',
        'merge_fields' => [
            'FNAME' => $name
        ]
    ];
    
    // Make API call to Mailchimp
    */
}
?>

