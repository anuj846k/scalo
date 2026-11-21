import nodemailer from 'nodemailer';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

const port = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text }: SendEmailInput) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Scalo <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}
