import { Resend } from 'resend';
import { validateFields } from './lib/validate.js';

for (const key of ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'NOTIFY_EMAIL', 'TURNSTILE_SECRET_KEY']) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyTurnstile(token, ip) {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const { naam, adres, email, telefoon, website, turnstileToken } = req.body;

  // Honeypot — bots fill this hidden field, humans don't
  if (website) {
    return res.status(400).json({ error: 'Bad request' });
  }

  if (!turnstileToken || typeof turnstileToken !== 'string') {
    return res.status(400).json({ error: 'Verificatie mislukt' });
  }

  // Turnstile verification
  const ip = (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  const turnstileOk = await verifyTurnstile(turnstileToken, ip).catch(() => false);
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Verificatie mislukt' });
  }

  // Type guard — reject non-string fields before any .trim() calls
  const fields = { naam, adres, email, telefoon };
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val !== 'string') return res.status(400).json({ error: 'Bad request' });
  }

  // Field validation
  const errors = validateFields({ naam, adres, email, telefoon });
  if (errors.length > 0) {
    return res.status(422).json({ error: 'Validatiefout', fields: errors });
  }

  // Format timestamp in Dutch timezone
  const now = new Date().toLocaleString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const sanitize = (s) => s.trim().replace(/[\r\n]+/g, ' ');

  const [confirm, notify] = await Promise.allSettled([
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: sanitize(email),
      replyTo: 'usa.rijssen@planet.nl',
      subject: 'Jouw gratis dagpas aanvraag — USA Sport Rijssen',
      text: [
        `Hoi ${sanitize(naam)},`,
        '',
        'Bedankt voor je aanvraag! We hebben je gratis dagpas ontvangen.',
        '',
        'Wij nemen binnen 1 werkdag telefonisch of per mail contact op',
        'om een dag en tijd af te spreken die voor jou werkt.',
        '',
        'Heb je in de tussentijd vragen? Bel ons op 0548-517073 of',
        'mail naar usa.rijssen@planet.nl.',
        '',
        'Tot snel bij USA Sport!',
        '',
        '— Het team van USA Sport',
        'Fahrenheitstraat 3, 7461 JA Rijssen',
        'usa-rijssen.nl',
      ].join('\n'),
    }),
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      replyTo: sanitize(email),
      subject: `Nieuwe dagpas aanvraag — ${sanitize(naam)}`,
      text: [
        'Nieuwe aanvraag via de website:',
        '',
        `Naam:       ${sanitize(naam)}`,
        `Adres:      ${sanitize(adres)}`,
        `E-mail:     ${sanitize(email)}`,
        `Telefoon:   ${sanitize(telefoon)}`,
        `Tijdstip:   ${now}`,
        `IP-adres:   ${ip}`,
        '',
        '---',
        'Gebruik Reply om te antwoorden (Reply-To is ingesteld op aanvrager).',
      ].join('\n'),
    }),
  ]);

  if (confirm.status === 'rejected' || notify.status === 'rejected') {
    if (confirm.status === 'rejected')
      console.error('[dagpas] confirmation email failed:', confirm.reason?.message);
    if (notify.status === 'rejected')
      console.error('[dagpas] notification email failed:', notify.reason?.message);
    return res.status(500).json({ error: 'Server error' });
  }

  return res.status(200).json({ success: true });
}
