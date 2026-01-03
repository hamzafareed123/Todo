export function resetEmailTemplate(fullName, resetLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Todo App</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f3f4f6;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div style="max-width: 640px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(to right, #000000, #1f2937); color: #ffffff; padding: 32px 24px; text-align: center;">
          <h1 style="font-size: 28px; font-weight: 700; margin: 0;">✓ Todo App</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Password Reset</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; color: #1f2937;">
          
          <p style="font-size: 16px; margin: 0 0 16px 0;">
            Hello <span style="font-weight: 700;">${fullName}</span>,
          </p>

          <p style="font-size: 15px; margin: 0 0 24px 0; color: #4b5563;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; border-radius: 6px; font-weight: 600; text-decoration: none;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280; margin: 24px 0 0 0; text-align: center;">
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 600; color: #000000; font-size: 14px;">Todo App Team</p>
          
          <p style="margin-top: 16px; margin-bottom: 0; font-size: 12px; color: #9ca3af;">
            © 2025 Todo App. All rights reserved.
          </p>
        </div>

      </div>
    </body> 
    </html>
  `;
}