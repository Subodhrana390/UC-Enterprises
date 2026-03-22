/**
 * Brevo (formerly Sendinblue) transactional email via REST API.
 * @see https://developers.brevo.com/reference/sendtransacemail
 */

export function isBrevoConfigured(): boolean {
  return !!process.env.BREVO_API_KEY && !!process.env.BREVO_SENDER_EMAIL;
}

type SendEmailParams = {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
};

export async function sendBrevoEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "UC Enterprises";

  if (!apiKey || !senderEmail) {
    console.warn("[brevo] Missing BREVO_API_KEY or BREVO_SENDER_EMAIL — email skipped");
    return { ok: false, error: "Email not configured" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName || toEmail }],
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[brevo]", res.status, errText);
      return { ok: false, error: "Failed to send email" };
    }

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email send failed";
    console.error("[brevo]", e);
    return { ok: false, error: msg };
  }
}

export function buildOrderConfirmationHtml(params: {
  orderId: string;
  totalFormatted: string;
  itemLines: { name: string; qty: number; lineTotal: string }[];
  customerName?: string;
}): string {
  const { orderId, totalFormatted, itemLines, customerName } = params;
  const shortId = orderId.slice(0, 8).toUpperCase();
  const rows = itemLines
    .map(
      (l) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(l.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${l.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${l.lineTotal}</td></tr>`
    )
    .join("");
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f9f9ff;padding:24px;color:#161c27">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #dde2f3">
    <h1 style="font-size:20px;margin:0 0 8px">Order confirmed</h1>
    <p style="margin:0 0 24px;color:#45474c;font-size:14px">Hi${customerName ? ` ${escapeHtml(customerName)}` : ""}, thank you for your purchase at UC Enterprises.</p>
    <p style="font-size:14px;font-weight:700;margin-bottom:8px">Order #${escapeHtml(shortId)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
      <thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #dde2f3">Item</th><th style="padding:8px;border-bottom:2px solid #dde2f3">Qty</th><th align="right" style="padding:8px;border-bottom:2px solid #dde2f3">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;font-weight:800;margin:0"><strong>Total:</strong> ${escapeHtml(totalFormatted)}</p>
    <p style="margin-top:24px;font-size:12px;color:#76777c">You will receive shipping updates once your order is dispatched.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
