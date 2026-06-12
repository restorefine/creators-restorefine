import { getSiteUrl } from "./resend";

export function newApplicationEmail({
  id,
  firstName,
  lastName,
  email,
  primaryNiche,
  city,
  country,
}: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryNiche: string;
  city: string;
  country: string;
}) {
  const fullName = `${firstName} ${lastName}`;
  const profileUrl = `${getSiteUrl()}/admin/${id}`;
  const replySubject = encodeURIComponent("Your RestoRefine creator application");
  const replyUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${replySubject}`;

  const subject = `New creator application — ${fullName}`;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
      <h1 style="font-size: 18px; font-weight: 700; margin: 0 0 16px;">New creator application</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px;">
        <strong>${fullName}</strong> has applied to join the RestoRefine creator network.
      </p>
      <table style="width: 100%; font-size: 14px; color: #334155; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Name</td>
          <td style="padding: 4px 0; font-weight: 600;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Niche</td>
          <td style="padding: 4px 0; font-weight: 600;">${primaryNiche}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Location</td>
          <td style="padding: 4px 0; font-weight: 600;">${city}, ${country}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Email</td>
          <td style="padding: 4px 0; font-weight: 600;">${email}</td>
        </tr>
      </table>
      <div>
        <a href="${profileUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 8px; margin-right: 12px;">
          View profile
        </a>
        <a href="${replyUrl}" style="display: inline-block; background-color: #ffffff; color: #334155; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 8px; border: 1px solid #cbd5e1;">
          Reply to ${firstName}
        </a>
      </div>
    </div>
  `;

  return { subject, html };
}
