type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

// Sends email through the Resend REST API. Without RESEND_API_KEY (local dev),
// the email is printed to the server console so the link can still be used.
export async function sendEmail({ to, subject, text }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('RESEND_API_KEY is not set. Email not sent to', to);
      return;
    }
    console.log(`[email] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Scalo <onboarding@resend.dev>',
      to,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error('Failed to send email:', res.status, await res.text());
  }
}
