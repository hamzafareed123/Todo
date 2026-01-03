export function generateEmailHTML(fullName) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Todo App</title>
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
        

        <div style="background: linear-gradient(to right, #000000, #1f2937); color: #ffffff; padding: 48px 32px; text-align: center;">
          <h1 style="font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 1px;">✓ Todo App</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Welcome Aboard!</p>
        </div>

     
        <div style="padding: 40px 32px; color: #1f2937;">
          
          <div style="margin-bottom: 24px;">
            <p style="font-size: 16px; line-height: 1.5; margin: 0;">
              Hello <span style="font-weight: 700; color: #000000;">${fullName}</span>,
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="font-size: 16px; line-height: 1.5; margin: 0; color: #4b5563;">
              Thank you for signing up for our <span style="font-weight: 700; color: #000000;">Todo App</span>! We're thrilled to have you join our community of productive users.
            </p>
          </div>

          <div style="background-color: #f9fafb; border-left: 4px solid #000000; padding: 20px; margin: 32px 0; font-style: italic; color: #374151;">
            Get started now and organize your tasks efficiently. Make your productivity count!
          </div>

          <div style="margin-bottom: 24px;">
            <p style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #374151;">With Todo App, you can:</p>
            <div style="margin-left: 24px; color: #4b5563; font-size: 14px; line-height: 1.8;">
              <p style="margin: 8px 0;">✓ Create and manage your daily tasks</p>
              <p style="margin: 8px 0;">✓ Set priorities and deadlines</p>
              <p style="margin: 8px 0;">✓ Track your progress</p>
              <p style="margin: 8px 0;">✓ Stay organized and focused</p>
            </div>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="http://localhost:5173/" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; border-radius: 6px; font-weight: 600; text-decoration: none; transition: background-color 0.3s ease;">
              Get Started
            </a>
          </div>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb; height: 0;">

          <div style="text-align: center; font-size: 14px; color: #4b5563;">
            <p style="margin: 0;">If you have any questions, feel free to reach out to our support team. We're here to help!</p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 700; color: #000000;">Best Regards,</p>
          <p style="margin: 0; font-weight: 700; color: #000000;">Todo App Team</p>
          
          <div style="margin-top: 24px; font-size: 14px;">
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 12px;">Facebook</a>
            <span style="color: #d1d5db;">|</span>
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 12px;">Twitter</a>
            <span style="color: #d1d5db;">|</span>
            <a href="#" style="color: #000000; text-decoration: none; margin: 0 12px;">Instagram</a>
          </div>

          <p style="margin-top: 24px; margin-bottom: 0; font-size: 12px; color: #9ca3af;">
            © 2025 Todo App. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}