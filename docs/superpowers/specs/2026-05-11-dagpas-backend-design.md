# USA Sport — Dagpas Backend Design Spec

**Date:** 2026-05-11
**Project:** USA Sport / Dé Fitness Arena, Rijssen
**Scope:** Dagpas form backend — serverless function, email delivery, spam protection
**Stack:** Vercel Serverless Functions + Resend + Cloudflare Turnstile
**Cost:** €0/maand (alle services gratis tier)

---

## 1. Beslissingen

| Onderwerp | Keuze | Motivatie |
|-----------|-------|-----------|
| Hosting | Vercel (bestaand) | Geen extra infra nodig |
| Backend | Vercel Serverless Function (Node.js) | Gratis, zero-maintenance |
| Email service | Resend | Gebouwd voor serverless, 3k/maand gratis |
| Spam bescherming | Cloudflare Turnstile + honeypot | Gratis, geen friction voor gebruiker |
| Database | Geen | Email is voldoende als record voor dit volume |
| Rate limiting | Turnstile + honeypot | Vercel KV vereist betaald plan |
| Privacy/AVG | Tekst onder submit knop | Voldoende voor service-aanvraag (geen marketing) |
| Double opt-in | Nee | Niet vereist voor service-aanvraag (alleen voor marketing) |

---

## 2. Bestandsstructuur

```
Usa_web/
├── api/
│   └── dagpas.js          ← Vercel Serverless Function
├── .env.local              ← lokaal (niet in git)
├── .env.example            ← wél in git (lege waarden)
├── vercel.json             ← Vercel config
└── index.html              ← uitbreiden: Turnstile, fetch(), error states, honeypot
```

---

## 3. Volledige Flow

```
1. Gebruiker opent modal, vult form in (naam, adres, email, telefoon)
2. Cloudflare Turnstile widget rendert automatisch onderaan form
3. Gebruiker klikt "Verstuur aanvraag"
4. handleDagpasSubmit():
   a. Turnstile token ophalen via window.turnstile.getResponse()
   b. Knop → loading state (disabled + spinner)
   c. fetch POST /api/dagpas met alle velden + token
5. /api/dagpas serverless function:
   a. Method check (alleen POST)
   b. Honeypot check (veld `website` moet leeg zijn)
   c. Turnstile token verify via Cloudflare API
   d. Server-side validatie van alle velden
   e. Resend: bevestigingsmail → gebruiker
   f. Resend: notificatiemail → usa.rijssen@planet.nl
   g. Return 200 { success: true }
6. Frontend:
   - 200 → success state tonen (bestaande HTML)
   - 4xx/5xx → foutmelding tonen
   - network error → fallback foutmelding
```

---

## 4. API Endpoint: `/api/dagpas.js`

### Request

```
POST /api/dagpas
Content-Type: application/json

{
  "naam": "string",
  "adres": "string",
  "email": "string",
  "telefoon": "string",
  "website": "",           // honeypot — moet leeg
  "turnstileToken": "string"
}
```

### Validatieregels

| Veld | Regel |
|------|-------|
| naam | aanwezig, 2–100 tekens |
| adres | aanwezig, 5–200 tekens |
| email | aanwezig, geldig email-formaat |
| telefoon | aanwezig, 6–20 tekens |
| website | moet leeg zijn (honeypot) |
| turnstileToken | aanwezig, valide via Cloudflare API |

### Response codes

| Code | Situatie |
|------|----------|
| 200 | Succes — beide emails verstuurd |
| 405 | Methode niet POST |
| 400 | Turnstile verificatie mislukt / honeypot gevuld |
| 422 | Validatiefout in velden |
| 500 | Onverwachte serverfout (geen details lekken) |

---

## 5. Email Templates

### Email 1 — Bevestiging aan gebruiker

- **From:** `USA Sport <noreply@usa-rijssen.nl>`
- **To:** `{email}`
- **Subject:** `Jouw gratis dagpas aanvraag — USA Sport Rijssen`
- **Body:**

```
Hoi {naam},

Bedankt voor je aanvraag! We hebben je gratis dagpas ontvangen.

Wij nemen binnen 1 werkdag telefonisch of per mail contact op
om een dag en tijd af te spreken die voor jou werkt.

Heb je in de tussentijd vragen? Bel ons op 0548-517073 of
mail naar usa.rijssen@planet.nl.

Tot snel bij USA Sport!

— Het team van USA Sport
Fahrenheitstraat 3, 7461 JA Rijssen
usa-rijssen.nl
```

### Email 2 — Notificatie naar sportschool

- **From:** `Dagpas Formulier <noreply@usa-rijssen.nl>`
- **To:** `usa.rijssen@planet.nl`
- **Reply-To:** `{email}` (gym kan direct antwoorden)
- **Subject:** `Nieuwe dagpas aanvraag — {naam}`
- **Body:**

```
Nieuwe aanvraag via de website:

Naam:       {naam}
Adres:      {adres}
E-mail:     {email}
Telefoon:   {telefoon}
Tijdstip:   {datum} om {tijd} (NL tijdzone)
IP-adres:   {ip}

---
Beantwoord deze mail NIET — stuur antwoord direct naar {email}
Of gebruik Reply om te antwoorden (Reply-To is ingesteld op aanvrager).
```

---

## 6. Frontend Wijzigingen (`index.html`)

### Toevoegingen

1. **Turnstile script** in `<head>`:
   ```html
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   ```

2. **Honeypot veld** in form (onzichtbaar):
   ```html
   <input type="text" name="website" tabindex="-1" autocomplete="off"
     style="position:absolute;left:-9999px;opacity:0;" aria-hidden="true" />
   ```

3. **Turnstile widget** boven submit knop:
   ```html
   <div class="cf-turnstile" data-sitekey="{SITE_KEY}" data-theme="dark"></div>
   ```

4. **Foutmelding div** onder form:
   ```html
   <div id="dagpas-error" class="hidden ...">
     <p id="dagpas-error-text"></p>
   </div>
   ```

5. **Privacy tekst** onder submit knop:
   ```html
   <p>Door te versturen ga je akkoord met onze <a href="/privacy">privacyverklaring</a>.</p>
   ```

### Gewijzigde logica `handleDagpasSubmit()`

```
1. e.preventDefault()
2. Turnstile token ophalen — ontbreekt: toon "Bevestig dat je geen robot bent"
3. Honeypot check client-side (extra laag)
4. Knop → loading state (disabled, tekst "Versturen...", spinner)
5. fetch POST /api/dagpas
6. 200 → form hidden, success div visible
7. 4xx/5xx → foutmelding tonen (uit error-map per status code)
8. Network error → "Geen verbinding. Probeer opnieuw of bel 0548-517073."
9. Altijd bij fout: knop terug naar normale state
```

### Foutmelding map

| Status | Bericht |
|--------|---------|
| 400 | "Verificatie mislukt. Vernieuw de pagina en probeer opnieuw." |
| 422 | "Controleer je gegevens en probeer opnieuw." |
| 500 | "Er ging iets mis. Bel ons op 0548-517073." |
| Network | "Geen verbinding. Controleer internet en probeer opnieuw." |

---

## 7. Environment Variables

### `.env.local` (niet in git)

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@usa-rijssen.nl
NOTIFY_EMAIL=usa.rijssen@planet.nl
TURNSTILE_SECRET_KEY=0xxxxxxxxxxx
```

### `.env.example` (wél in git)

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@usa-rijssen.nl
NOTIFY_EMAIL=usa.rijssen@planet.nl
TURNSTILE_SECRET_KEY=
```

Turnstile **Site Key** (public) staat direct in `index.html` — geen env var nodig.

---

## 8. Vercel Config (`vercel.json`)

```json
{
  "functions": {
    "api/dagpas.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://usa-rijssen.nl" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

CORS beperkt tot eigen domein — geen externe partijen kunnen de API aanroepen.

---

## 9. DNS Setup (eenmalig)

Resend dashboard geeft exacte waarden na domain-verificatie:

| Type | Naam | Waarde |
|------|------|--------|
| `TXT` | `resend._domainkey.usa-rijssen.nl` | `v=DKIM1; p=...` |
| `TXT` | `usa-rijssen.nl` | `v=spf1 include:amazonses.com ~all` |

Propagatie: 5 min – 24 uur. Resend dashboard toont verificatiestatus.

---

## 10. Deployment Aanpak

### Lokaal testen

```bash
# Frontend
node scripts/serve.mjs

# Serverless functions lokaal
vercel dev
```

Cloudflare geeft speciale Turnstile test-keys voor lokale ontwikkeling:
- Site key: `1x00000000000000000000AA` (always passes)
- Secret key: `1x0000000000000000000000000000000AA`

### Productie

```bash
git push  # → Vercel deploy automatisch
```

Geen staging environment — laag risico project. Resend dashboard toont email logs voor verificatie.

### Volgorde bij eerste deploy

```
1. Resend account + domain verificeren
2. Cloudflare Turnstile site aanmaken → keys ophalen
3. DNS records toevoegen, wachten op propagatie
4. Vercel env vars instellen (dashboard)
5. git push → deploy
6. Testen via formulier op productie
```

---

## 11. AVG/GDPR

- **Grondslag verwerking:** Uitvoering van een overeenkomst / pre-contractuele stap (art. 6 lid 1 sub b AVG)
- **Gegevens verzameld:** naam, adres, email, telefoon — minimaal noodzakelijk
- **Opslag:** Geen database. Data leeft alleen in emails in inbox van sportschool
- **Bewaarperiode:** Verantwoordelijkheid van sportschool (aanbeveling: verwijderen na contact)
- **IP-adres in notificatiemail:** Legitiem belang (fraudepreventie) — niet doorgegeven aan gebruiker
- **Privacy notice:** Tekst + link naar privacyverklaring onder submit knop

---

## 12. Beveiliging — Risico's & Mitigaties

| Risico | Mitigatie |
|--------|-----------|
| Bot-spam | Cloudflare Turnstile |
| Form-spam door mens | Honeypot veld |
| API misbruik extern | CORS beperkt tot eigen domein |
| Secrets in code | Alle keys via env vars |
| Data lekkage in errors | 500 geeft geen details terug |
| Email spoofing | SPF + DKIM records via Resend |
| XSS via form input | Resend escapet HTML in templates |

---

## 13. Out of Scope

- Double opt-in / email verificatielink (niet nodig voor service-aanvraag)
- Admin dashboard voor aanvragen
- Database opslag
- Lidmaatschap signup flow
- Newsletter integratie
- Staging environment
