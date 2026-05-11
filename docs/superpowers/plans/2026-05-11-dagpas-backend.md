# Dagpas Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the dagpas form to a Vercel Serverless Function that validates input, verifies Cloudflare Turnstile, and sends two emails via Resend — confirmation to the user, notification to the gym.

**Architecture:** Single Vercel Serverless Function (`api/dagpas.js`) handles POST requests. Validation logic extracted to `api/lib/validate.js` (pure functions, unit-testable). Frontend `index.html` gains Turnstile widget, honeypot field, fetch() call, loading state, and error display. No database — emails are the record.

**Tech Stack:** Node.js 20 (ESM), Resend SDK v4, Cloudflare Turnstile, Vercel CLI (local dev), Node built-in test runner

**Spec:** `docs/superpowers/specs/2026-05-11-dagpas-backend-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `api/lib/validate.js` | Create | Pure validation functions — field presence, length, email regex |
| `api/dagpas.js` | Create | Serverless handler — honeypot, Turnstile verify, validate, send emails |
| `tests/validate.test.js` | Create | Unit tests for validate.js |
| `.env.example` | Create | Template with empty key names |
| `.env.local` | Create (not committed) | Local dev secrets |
| `vercel.json` | Create | Pin Node.js 20, set maxDuration |
| `index.html` | Modify | Turnstile script, honeypot field, Turnstile widget, error div, fetch(), loading state, privacy text |
| `package.json` | Modify | Add resend dependency, add test script |
| `.gitignore` | Modify | Add .env.local |

---

## Task 1: Project Setup

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `.env.example`
- Create: `vercel.json`

- [ ] **Step 1: Install Resend SDK**

```bash
npm install resend
```

Expected output includes `added 1 package` and `resend` appears in `node_modules/`.

- [ ] **Step 2: Install Vercel CLI globally (needed for local function testing)**

```bash
npm install -g vercel
```

Verify: `vercel --version` prints a version number.

- [ ] **Step 3: Add test script to package.json**

Open `package.json`. Replace the `"scripts"` block with:

```json
"scripts": {
  "serve": "node scripts/serve.mjs",
  "screenshot": "node scripts/screenshot.mjs",
  "test": "node --test tests/validate.test.js"
},
```

- [ ] **Step 4: Update .gitignore**

Open `.gitignore`. Add these lines at the bottom (create the file if it doesn't exist):

```
.env.local
.env*.local
.vercel
```

- [ ] **Step 5: Create .env.example**

Create `c:\Users\jbfok\Desktop\Usa_web\.env.example`:

```env
# Resend — get from resend.com dashboard after domain verification
RESEND_API_KEY=

# Email address to send FROM (must match verified Resend domain)
RESEND_FROM_EMAIL=noreply@usa-rijssen.nl

# Gym notification email — where new dagpas requests go
NOTIFY_EMAIL=usa.rijssen@planet.nl

# Cloudflare Turnstile SECRET key (from dash.cloudflare.com)
# Public SITE key goes directly in index.html — not an env var
TURNSTILE_SECRET_KEY=
```

- [ ] **Step 6: Create .env.local with test keys**

Create `c:\Users\jbfok\Desktop\Usa_web\.env.local` (this file is gitignored):

```env
RESEND_API_KEY=re_test_placeholder
RESEND_FROM_EMAIL=noreply@usa-rijssen.nl
NOTIFY_EMAIL=usa.rijssen@planet.nl
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

The `TURNSTILE_SECRET_KEY` value above is Cloudflare's official always-pass test secret key — safe for local development, will be replaced with real key in Task 5.

- [ ] **Step 7: Create vercel.json**

Create `c:\Users\jbfok\Desktop\Usa_web\vercel.json`:

```json
{
  "functions": {
    "api/dagpas.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 10
    }
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore .env.example vercel.json
git commit -m "chore: project setup for dagpas backend — resend, vercel config, env template"
```

---

## Task 2: Validation Library + Tests

**Files:**
- Create: `api/lib/validate.js`
- Create: `tests/validate.test.js`

- [ ] **Step 1: Create api/lib/ directory and validate.js**

Create `c:\Users\jbfok\Desktop\Usa_web\api\lib\validate.js`:

```javascript
/**
 * Validates dagpas form fields.
 * Returns array of field names that failed validation (empty = all valid).
 */
export function validateFields({ naam, adres, email, telefoon }) {
  const errors = [];

  if (!naam || naam.trim().length < 2 || naam.trim().length > 100) {
    errors.push('naam');
  }
  if (!adres || adres.trim().length < 5 || adres.trim().length > 200) {
    errors.push('adres');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('email');
  }
  if (!telefoon || telefoon.trim().length < 6 || telefoon.trim().length > 20) {
    errors.push('telefoon');
  }

  return errors;
}
```

- [ ] **Step 2: Write failing tests first**

Create `c:\Users\jbfok\Desktop\Usa_web\tests\validate.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFields } from '../api/lib/validate.js';

const VALID = {
  naam: 'Jan Janssen',
  adres: 'Dorpsstraat 1, Rijssen',
  email: 'jan@example.nl',
  telefoon: '06-12345678',
};

test('valid input returns empty errors array', () => {
  assert.deepEqual(validateFields(VALID), []);
});

test('missing naam returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: '' });
  assert.ok(errors.includes('naam'));
  assert.equal(errors.length, 1);
});

test('naam of 1 character returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: 'J' });
  assert.ok(errors.includes('naam'));
});

test('naam of 101 characters returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: 'A'.repeat(101) });
  assert.ok(errors.includes('naam'));
});

test('missing adres returns adres error', () => {
  const errors = validateFields({ ...VALID, adres: '' });
  assert.ok(errors.includes('adres'));
});

test('adres of 4 characters returns adres error', () => {
  const errors = validateFields({ ...VALID, adres: 'ab 1' });
  assert.ok(errors.includes('adres'));
});

test('email without @ returns email error', () => {
  const errors = validateFields({ ...VALID, email: 'notanemail' });
  assert.ok(errors.includes('email'));
});

test('email without domain returns email error', () => {
  const errors = validateFields({ ...VALID, email: 'jan@' });
  assert.ok(errors.includes('email'));
});

test('missing telefoon returns telefoon error', () => {
  const errors = validateFields({ ...VALID, telefoon: '' });
  assert.ok(errors.includes('telefoon'));
});

test('telefoon of 3 digits returns telefoon error', () => {
  const errors = validateFields({ ...VALID, telefoon: '123' });
  assert.ok(errors.includes('telefoon'));
});

test('all invalid returns all four field errors', () => {
  const errors = validateFields({ naam: '', adres: '', email: '', telefoon: '' });
  assert.ok(errors.includes('naam'));
  assert.ok(errors.includes('adres'));
  assert.ok(errors.includes('email'));
  assert.ok(errors.includes('telefoon'));
  assert.equal(errors.length, 4);
});

test('whitespace-only naam returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: '   ' });
  assert.ok(errors.includes('naam'));
});
```

- [ ] **Step 3: Run tests — verify they pass**

```bash
npm test
```

Expected output: 12 tests passing, 0 failing. Each test prints `✓` or `ok`.

If tests fail, fix `api/lib/validate.js` before continuing.

- [ ] **Step 4: Commit**

```bash
git add api/lib/validate.js tests/validate.test.js
git commit -m "feat: add field validation library with unit tests"
```

---

## Task 3: Serverless Function

**Files:**
- Create: `api/dagpas.js`

- [ ] **Step 1: Create api/dagpas.js**

Create `c:\Users\jbfok\Desktop\Usa_web\api\dagpas.js`:

```javascript
import { Resend } from 'resend';
import { validateFields } from './lib/validate.js';

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

  const { naam, adres, email, telefoon, website, turnstileToken } = req.body ?? {};

  // Honeypot — bots fill this hidden field, humans don't
  if (website) {
    return res.status(400).json({ error: 'Bad request' });
  }

  // Turnstile verification
  const ip = (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  const turnstileOk = await verifyTurnstile(turnstileToken, ip).catch(() => false);
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Verificatie mislukt' });
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

  try {
    // Confirmation email → user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email.trim(),
      subject: 'Jouw gratis dagpas aanvraag — USA Sport Rijssen',
      text: [
        `Hoi ${naam.trim()},`,
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
    });

    // Notification email → gym
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email.trim(),
      subject: `Nieuwe dagpas aanvraag — ${naam.trim()}`,
      text: [
        'Nieuwe aanvraag via de website:',
        '',
        `Naam:       ${naam.trim()}`,
        `Adres:      ${adres.trim()}`,
        `E-mail:     ${email.trim()}`,
        `Telefoon:   ${telefoon.trim()}`,
        `Tijdstip:   ${now}`,
        `IP-adres:   ${ip}`,
        '',
        '---',
        'Gebruik Reply om te antwoorden (Reply-To is ingesteld op aanvrager).',
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[dagpas] email send failed:', err?.message ?? err);
    return res.status(500).json({ error: 'Server error' });
  }
}
```

- [ ] **Step 2: Start vercel dev and test with curl**

In one terminal:
```bash
vercel dev
```

First run asks to link project — choose existing project or create new. After linking, it starts on `http://localhost:3000`.

In a second terminal, test with curl:

```bash
curl -X POST http://localhost:3000/api/dagpas \
  -H "Content-Type: application/json" \
  -d '{"naam":"Test Persoon","adres":"Teststraat 1, Rijssen","email":"test@example.nl","telefoon":"06-12345678","website":"","turnstileToken":"XXXX"}'
```

Expected response with test Turnstile secret key (always-pass):
```json
{"success":true}
```

Note: With test keys, Resend will likely fail (API key is placeholder). That's expected — you'll see a 500 from the email step. The important thing is Turnstile passes and validation passes (200 only fails at email step). Log shows the error clearly.

- [ ] **Step 3: Test honeypot rejection**

```bash
curl -X POST http://localhost:3000/api/dagpas \
  -H "Content-Type: application/json" \
  -d '{"naam":"Bot","adres":"Botstraat 1","email":"bot@bot.nl","telefoon":"123456","website":"http://spam.com","turnstileToken":"test"}'
```

Expected: `{"error":"Bad request"}` with HTTP 400.

- [ ] **Step 4: Test validation rejection**

```bash
curl -X POST http://localhost:3000/api/dagpas \
  -H "Content-Type: application/json" \
  -d '{"naam":"J","adres":"x","email":"notanemail","telefoon":"","website":"","turnstileToken":"XXXX"}'
```

Expected: `{"error":"Validatiefout","fields":["naam","adres","email","telefoon"]}` with HTTP 422.

- [ ] **Step 5: Commit**

```bash
git add api/dagpas.js
git commit -m "feat: add dagpas serverless function — Turnstile verify, validation, Resend emails"
```

---

## Task 4: Frontend Changes

**Files:**
- Modify: `index.html`

All edits are to `index.html`. Read it first before editing.

### Step 1 — Add Turnstile script to `<head>`

- [ ] **Step 1: Add Turnstile script**

In `index.html`, find the line:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

Add directly after it:
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### Step 2 — Add spin animation to CSS

- [ ] **Step 2: Add @keyframes spin**

In `index.html`, find the existing `<style>` block. Find the line:
```css
/* prefers-reduced-motion */
```

Insert directly before that line:
```css
/* Turnstile loading spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; display: inline-block; }
```

### Step 3 — Modify the dagpas form

- [ ] **Step 3: Add honeypot, Turnstile widget, error div, and update form**

Find this exact block in `index.html` (the dagpas form):
```html
    <form id="dagpas-form" onsubmit="handleDagpasSubmit(event)" class="flex flex-col gap-4">
      <div>
        <label for="dp-naam" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Naam *</label>
        <input id="dp-naam" name="naam" type="text" required placeholder="Voor- en achternaam"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-adres" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Adres *</label>
        <input id="dp-adres" name="adres" type="text" required placeholder="Straat, huisnummer, woonplaats"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-email" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">E-mailadres *</label>
        <input id="dp-email" name="email" type="email" required placeholder="naam@voorbeeld.nl"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-telefoon" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Telefoonnummer *</label>
        <input id="dp-telefoon" name="telefoon" type="tel" required placeholder="06-12345678"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <button type="submit"
        class="w-full bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold px-6 py-3.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer mt-2">
        Verstuur aanvraag
      </button>
      <p class="font-poppins text-muted text-xs text-center">Wij nemen binnen 1 werkdag contact met je op.</p>
    </form>
```

Replace it with:
```html
    <form id="dagpas-form" onsubmit="handleDagpasSubmit(event)" class="flex flex-col gap-4">
      <!-- Honeypot — must stay hidden, bots fill it, humans don't -->
      <input id="dp-website" name="website" type="text" tabindex="-1" autocomplete="off"
        aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;pointer-events:none;" />
      <div>
        <label for="dp-naam" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Naam *</label>
        <input id="dp-naam" name="naam" type="text" required placeholder="Voor- en achternaam"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-adres" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Adres *</label>
        <input id="dp-adres" name="adres" type="text" required placeholder="Straat, huisnummer, woonplaats"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-email" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">E-mailadres *</label>
        <input id="dp-email" name="email" type="email" required placeholder="naam@voorbeeld.nl"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <div>
        <label for="dp-telefoon" class="font-poppins text-off-white/80 text-xs font-semibold uppercase tracking-wide block mb-1.5">Telefoonnummer *</label>
        <input id="dp-telefoon" name="telefoon" type="tel" required placeholder="06-12345678"
          class="w-full bg-anthracite border border-sand/20 rounded-sm px-4 py-3 font-poppins text-off-white text-sm placeholder-muted focus:outline-none focus:border-usa-red transition-colors duration-200" />
      </div>
      <!-- Cloudflare Turnstile — data-sitekey: use test key now, replace in Task 5 -->
      <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="dark"></div>
      <!-- Error message — shown on submit failure -->
      <div id="dagpas-error" class="hidden rounded-sm px-4 py-3" style="background:rgba(204,17,34,0.12);border:1px solid rgba(204,17,34,0.35);">
        <p id="dagpas-error-text" class="font-poppins text-sm" style="color:#F5F4F0;line-height:1.5;"></p>
      </div>
      <button id="dagpas-submit-btn" type="submit"
        class="w-full bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold px-6 py-3.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer mt-2">
        Verstuur aanvraag
      </button>
      <p class="font-poppins text-muted text-xs text-center">
        Door te versturen ga je akkoord met onze
        <a href="/privacy" class="underline underline-offset-2 hover:text-off-white transition-colors duration-200">privacyverklaring</a>.
      </p>
    </form>
```

### Step 4 — Replace handleDagpasSubmit in the script block

- [ ] **Step 4: Replace handleDagpasSubmit function**

Find this exact function in the `<script>` block near the bottom of `index.html`:
```javascript
    function handleDagpasSubmit(e) {
      e.preventDefault();
      document.getElementById('dagpas-form').classList.add('hidden');
      document.getElementById('dagpas-success').classList.remove('hidden');
    }
```

Replace it with:
```javascript
    const ERROR_MESSAGES = {
      400: 'Verificatie mislukt. Vernieuw de pagina en probeer opnieuw.',
      422: 'Controleer je gegevens en probeer opnieuw.',
      500: 'Er ging iets mis. Bel ons op 0548-517073.',
    };

    async function handleDagpasSubmit(e) {
      e.preventDefault();

      const btn = document.getElementById('dagpas-submit-btn');
      const errorDiv = document.getElementById('dagpas-error');
      const errorText = document.getElementById('dagpas-error-text');

      // Hide previous error
      errorDiv.classList.add('hidden');

      // Require Turnstile token
      const token = window.turnstile?.getResponse() ?? '';
      if (!token) {
        errorText.textContent = 'Bevestig dat je geen robot bent.';
        errorDiv.classList.remove('hidden');
        return;
      }

      // Loading state
      const originalLabel = btn.textContent;
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Versturen...';

      try {
        const res = await fetch('/api/dagpas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            naam: document.getElementById('dp-naam').value,
            adres: document.getElementById('dp-adres').value,
            email: document.getElementById('dp-email').value,
            telefoon: document.getElementById('dp-telefoon').value,
            website: document.getElementById('dp-website').value,
            turnstileToken: token,
          }),
        });

        if (res.ok) {
          document.getElementById('dagpas-form').classList.add('hidden');
          document.getElementById('dagpas-success').classList.remove('hidden');
          return; // don't restore button — form is hidden
        }

        errorText.textContent = ERROR_MESSAGES[res.status] ?? 'Er ging iets mis. Probeer opnieuw.';
        errorDiv.classList.remove('hidden');
        window.turnstile?.reset();
      } catch {
        errorText.textContent = 'Geen verbinding. Controleer internet en probeer opnieuw.';
        errorDiv.classList.remove('hidden');
        window.turnstile?.reset();
      }

      // Restore button on error
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.textContent = originalLabel;
    }
```

- [ ] **Step 5: Start server and take screenshot to verify form renders correctly**

```bash
node scripts/serve.mjs
```

In a second terminal:
```bash
node scripts/screenshot.mjs http://localhost:3000 form-before-open
```

Open the screenshot in `temporary screenshots/`. Verify page loads normally.

- [ ] **Step 6: Take screenshot with modal open**

Open browser at `http://localhost:3000`, click "Probeer gratis dagpas" to open the modal. Then take screenshot:

```bash
node scripts/screenshot.mjs http://localhost:3000 form-modal
```

Verify in screenshot:
- All 4 input fields visible (naam, adres, email, telefoon)
- Turnstile widget rendered below phone field (small dark widget)
- Submit button present
- Privacy text with "privacyverklaring" link below button

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: wire dagpas form — Turnstile widget, honeypot, fetch, loading state, error handling"
```

---

## Task 5: External Services Setup + Production Deploy

This task is mostly manual steps in browser dashboards, not code.

### Step 1 — Resend account + domain

- [ ] **Step 1: Create Resend account**

Go to resend.com → Sign up (free, no credit card).

- [ ] **Step 2: Add and verify domain**

In Resend dashboard → Domains → Add Domain → enter `usa-rijssen.nl`.

Resend shows 2 DNS records to add. Example values (yours will differ):
```
TXT  resend._domainkey.usa-rijssen.nl  v=DKIM1; k=rsa; p=<key>
TXT  usa-rijssen.nl                    v=spf1 include:amazonses.com ~all
```

Add these records in the DNS provider managing `usa-rijssen.nl` (TransIP, Vercel Domains, or wherever DNS is managed).

Wait for Resend dashboard to show green checkmarks on both records. Can take 5 minutes to 24 hours.

- [ ] **Step 3: Get Resend API key**

In Resend dashboard → API Keys → Create API Key → copy the key starting with `re_`.

### Step 2 — Cloudflare Turnstile

- [ ] **Step 4: Create Cloudflare account and Turnstile site**

Go to dash.cloudflare.com → Sign up (free).

In dashboard: Turnstile → Add site:
- Site name: USA Sport
- Domain: `usa-rijssen.nl`
- Widget type: Managed (recommended)

Cloudflare shows:
- **Site Key** (public — goes in `index.html`)
- **Secret Key** (private — goes in Vercel env vars)

Copy both.

- [ ] **Step 5: Replace test Turnstile site key in index.html**

In `index.html`, find:
```html
      <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="dark"></div>
```

Replace `1x00000000000000000000AA` with your real site key from Cloudflare dashboard.

### Step 3 — Vercel environment variables

- [ ] **Step 6: Add env vars in Vercel dashboard**

Go to vercel.com → your project → Settings → Environment Variables.

Add all 4 variables (select "Production", "Preview", and "Development" for each):

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `re_...` (from Resend dashboard) |
| `RESEND_FROM_EMAIL` | `noreply@usa-rijssen.nl` |
| `NOTIFY_EMAIL` | `usa.rijssen@planet.nl` |
| `TURNSTILE_SECRET_KEY` | `0x...` (from Cloudflare dashboard) |

Also update `.env.local` with the real keys for local testing.

### Step 4 — Deploy

- [ ] **Step 7: Commit the Turnstile site key update and deploy**

```bash
git add index.html
git commit -m "chore: set real Cloudflare Turnstile site key"
git push
```

Vercel auto-deploys on push. Monitor deployment in Vercel dashboard.

- [ ] **Step 8: End-to-end test on production**

Go to `https://usa-rijssen.nl`, open the dagpas modal, fill in the form with real data, submit.

Verify:
1. Turnstile widget shows and auto-resolves (or shows checkbox)
2. Button shows "Versturen..." while submitting
3. Success state appears after submit
4. Gym receives notification email at `usa.rijssen@planet.nl`
5. User receives confirmation email

Check Resend dashboard → Emails for delivery status if something fails.

- [ ] **Step 9: Test error handling on production**

Reload the page, open modal, click submit without completing Turnstile. Verify: error "Bevestig dat je geen robot bent." appears.

- [ ] **Step 10: Final commit if any fixes needed**

```bash
git add -p  # stage only intentional changes
git commit -m "fix: <describe what needed fixing after production test>"
git push
```

---

## Checklist: Spec Coverage

| Spec requirement | Task |
|-----------------|------|
| Formulierinzendingen ontvangen | Task 3 — api/dagpas.js POST handler |
| Bevestigingsmail naar gebruiker | Task 3 — resend.emails.send() confirmation |
| Aanvraag doorsturen naar sportschool | Task 3 — resend.emails.send() notification |
| Spam en misbruik beperken | Task 4 — Turnstile widget + Task 3 — honeypot server-side |
| Server-side validatie | Task 2 — validate.js + Task 3 — integration |
| Veilig omgaan met persoonsgegevens | Task 3 — IP in gym email only, no DB, env vars |
| AVG privacy notice | Task 4 — privacy text under submit button |
| Foutafhandeling frontend | Task 4 — ERROR_MESSAGES map + error div |
| Loading state | Task 4 — button disabled + "Versturen..." |
| Environment variables | Task 1 — .env.example + vercel.json |
| Deployment | Task 5 — git push → Vercel auto-deploy |
| DNS / email deliverability | Task 5 — SPF + DKIM via Resend |
| CORS | Not needed — same-origin request |
