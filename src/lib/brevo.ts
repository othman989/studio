// src/lib/brevo.ts

// A simple service for sending emails via the Brevo API.
// This is designed to be called from server-side code like Genkit flows or API routes.

async function sendEmail(options: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not set. Cannot send email.");
    return { success: false, error: "Server configuration error." };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "GBReplAi Notifications",
          email: "notifications@gbreplai.greotech.com", // This must be a validated sender in your Brevo account
        },
        ...options,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        "Failed to send email via Brevo:",
        response.status,
        errorBody
      );
      return { success: false, error: errorBody.message || "Brevo API error" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception when sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Sends an email to a client notifying them that their Google connection has been lost.
 */
export async function sendGoogleDisconnectedEmail(
  clientEmail: string,
  businessName: string
) {
  const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Action Required: Reconnect your Google Business Profile</h2>
          <p>Hello ${businessName},</p>
          <p>We noticed that your Google Business Profile connection for GBReplAi has been disconnected. This can happen if you change your Google password or revoke app permissions.</p>
          <p>To continue syncing reviews and using auto-replies, please reconnect your account:</p>
          <p style="margin: 20px 0;">
              <a href="https://gbreplai.greotech.com/settings" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reconnect Now</a>
          </p>
          <p>If you have any questions, please reply to this email or contact us at support@gbreplai.greotech.com.</p>
          <p>Thank you,<br/>The GBReplAi Team</p>
      </div>
    `;

  return sendEmail({
    to: [{ email: clientEmail }],
    subject: `[Action Required] Reconnect Your Google Account for ${businessName}`,
    htmlContent,
  });
}

/**
 * Sends an alert email to the admin.
 */
export async function sendAdminAlertEmail(subject: string, htmlContent: string) {
  const adminEmail = process.env.ADMIN_EMAIL_ADDRESS;
  if (!adminEmail) {
    console.error("ADMIN_EMAIL_ADDRESS is not set. Cannot send admin alert.");
    return { success: false, error: "Admin email not configured." };
  }

  return sendEmail({
    to: [{ email: adminEmail }],
    subject: `[GBReplAi Alert] ${subject}`,
    htmlContent,
  });
}
