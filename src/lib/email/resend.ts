import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = "RestoRefine <no-reply@restorefine.com>";
export const TALENT_EMAIL = "talent@restorefine.com";

export function getSiteUrl() {
  return process.env.SITE_URL ?? "http://localhost:3000";
}
