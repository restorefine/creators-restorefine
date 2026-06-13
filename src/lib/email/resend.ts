import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM!;
export const TALENT_EMAIL = process.env.TALENT_EMAIL!;

export function getSiteUrl() {
  return process.env.SITE_URL ?? "http://localhost:3000";
}
