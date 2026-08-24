import nodemailer from "nodemailer";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export class EmailError extends Error {
  readonly code: string;

  constructor(message: string, code = "EMAIL_ERROR") {
    super(message);
    this.name = "EmailError";
    this.code = code;
  }
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!host || !portValue || !user || !pass || !from) {
    return null;
  }

  const port = Number(portValue);

  if (!Number.isFinite(port)) {
    throw new EmailError("SMTP_PORT must be a valid number.", "EMAIL_CONFIG_INVALID");
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: process.env.SMTP_SECURE?.trim() === "true" || port === 465,
  };
}

export function isEmailConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendEmail(input: SendEmailInput) {
  const config = getSmtpConfig();

  if (!config) {
    throw new EmailError(
      "Email delivery is not configured.",
      "EMAIL_NOT_CONFIGURED",
    );
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: config.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  } catch {
    throw new EmailError(
      "We could not send the confirmation email right now.",
      "EMAIL_SEND_FAILED",
    );
  }
}
