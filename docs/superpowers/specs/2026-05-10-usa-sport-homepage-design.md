# USA Sport Rijssen — Homepage Design Spec

**Date:** 2026-05-10
**Project:** USA Sport / Dé Fitness Arena, Rijssen
**Scope:** Single homepage (`index.html`), all styles inline, Tailwind CDN
**Approach:** Apex Gym layout adapted with USA Sport brand identity (Approach B)
**Stack:** HTML + Tailwind CSS CDN, no framework

---

## 1. Reference & Inspiration

- **Layout reference:** Apex Gym (apexgym.nl) — dark premium structure, section order, pricing cards
- **Brand reference:** `usa_brandlines.png` — logo, colors, fonts, tagline
- **Key delta from Apex:** warmer/more personal tone, trust bar added, app section removed, "Over USA" added, dagpas CTA in hero

---

## 2. Page Architecture

| # | Section | Notes |
|---|---------|-------|
| 01 | NAV | Sticky, blur backdrop, logo left, links center, CTA right |
| 02 | HERO | Fullscreen gym photo, gradient overlay, tagline + 2 CTAs + micro trust bar |
| 03 | TRUST BAR | Stats strip: 4.6★ · 60+ groepslessen · Fysiotherapie · 100+ reviews |
| 04 | FACILITEITEN | 6-item icon grid |
| 05 | GROEPSLESSEN | Split layout — image left, "60+ lessen/week" right |
| 06 | LIDMAATSCHAPPEN | 3 pricing cards (Flex · Standaard · Premium) |
| 07 | PERSONAL TRAINING | Dark section, trainer image + copy |
| 08 | REVIEWS | "4.6★ op Google" + 3 review cards |
| 09 | OVER USA | Local story, gym interior images |
| 10 | LOCATIE | Address + hours table + static map |
| 11 | CTA BANNER | Red background — only red-bg section on page |
| 12 | FOOTER | Logo · links · contact · socials · newsletter |

---

## 3. Visual System

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--anthracite` | `#1C1C1E` | Dominant background (~70% of page) |
| `--surface` | `#252528` | Cards, nav, pricing cards |
| `--surface-raised` | `#2E2E32` | Card hover states |
| `--off-white` | `#F5F4F0` | Primary text on dark |
| `--muted` | `#9A9A9E` | Subtext, labels, meta |
| `--red` | `#CC1122` | Accents only: CTAs, active nav, badges |
| `--red-dark` | `#991018` | CTA hover state |
| `--sand` | `#C4B49A` | Dividers, decorative lines |

**Rule:** Red is never dominant. Page reads as anthracite + white. Red appears only at CTAs and key moments.

**Red elements (exhaustive):**
- Hero primary CTA "Probeer gratis dagpas"
- Nav "Word lid" button
- Recommended pricing card top border + "POPULAIRST" badge
- Active nav link underline (2px)
- Section number accents (01, 02…)
- Icon highlights in faciliteiten grid
- CTA Banner background (section 11 only)

### Typography

| Use | Font | Weight | Tracking |
|-----|------|--------|---------|
| Hero headline | Montserrat | 800 ExtraBold | `-0.03em` |
| Section titles | Montserrat | 700 Bold | `-0.02em` |
| Body text | Poppins | 400 Regular | `normal` |
| Labels / badges | Poppins | 600 SemiBold | `0.05em` uppercase |
| Pricing numbers | Montserrat | 800 | `-0.02em` |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
```

### Shadows

```css
/* Cards */
box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.25);
/* Red CTA buttons */
box-shadow: 0 4px 20px rgba(204,17,34,0.35);
```

### Animations
- Properties: `transform` and `opacity` only — never `transition-all`
- Duration: 200ms enter, 150ms exit
- Easing: `ease-out` enter / `ease-in` exit
- Hover cards: subtle lift (`translateY(-4px)`) + shadow deepens
- CTA buttons: scale `1.02` on hover

### Gradients / Texture
- Hero overlay: `linear-gradient(to bottom, rgba(28,28,30,0.2) 0%, rgba(28,28,30,0.85) 100%)`
- Sections alternate: `--anthracite` and `--surface` for depth without color noise

---

## 4. Component Specs

### NAV
- Position: sticky top, `z-index: 100`
- Background: `--surface` + `backdrop-filter: blur(12px)` + `border-bottom: 1px solid rgba(196,180,154,0.1)`
- Logo: `usa_brandlines.png` logo asset, white variant, height 40px
- Links: Poppins 500, off-white, hover → white + red underline 2px
- Active: red 2px underline
- CTA "Word lid": red filled, white text, hover → red-dark + lift shadow
- Mobile: hamburger (3 lines), full-screen overlay menu

### HERO
- Height: `100vh` minimum
- Background: dark gym photo (placehold.co until real asset) + gradient overlay
- Headline: "TRAIN. FEEL BETTER. LIVE BETTER." — Montserrat 800, 72px desktop / 40px mobile
- Subtext: "Dé fitness arena van Rijssen — sport, gezondheid en groei voor jong en oud." — Poppins 400, 18px, muted color
- CTA 1 (primary): "Probeer gratis dagpas →" — red bg, white text, red shadow
- CTA 2 (secondary): "Bekijk lidmaatschappen" — transparent, white border, white text, hover → white bg + anthracite text
- Micro trust bar: "4.6 ★ · 100+ reviews · al 30+ jaar in Rijssen" — small Poppins, muted, bottom of hero

### TRUST BAR
- Background: `--surface`
- 4 stats side by side: number (Montserrat 700, off-white large) + label (Poppins, muted, small)
- Stats: `4.6 ★` / `60+` groepslessen/week / `Fysiotherapie` aanwezig / `100+` Google reviews
- Dividers: 1px sand vertical lines between stats

### FACILITEITEN GRID
- 6 items: Fitness & Kracht · Cardio · Groepslessen · Personal Training · Fysiotherapie · Zonnestudio
- Each: SVG icon (red tint) + title (Montserrat 700) + short description (Poppins)
- Layout: 3-col desktop, 2-col tablet, 1-col mobile
- Card bg: `--surface`, hover → `--surface-raised` + lift

### GROEPSLESSEN (split)
- Left 50%: large gym photo, slight red color treatment overlay (`mix-blend-multiply`)
- Right 50%: "60+ LESSEN PER WEEK" (Montserrat 800, large, red number), description, list of lesson types, CTA "Bekijk rooster"

### PRICING CARDS
- 3 cards: Flex · Standaard · Premium
- Standaard: red top border (4px) + "POPULAIRST" badge (red bg)
- Each card: price (Montserrat 800, large), period "/maand", feature list (checkmarks), CTA button
- Flex + Premium CTA: outline style; Standaard CTA: red filled
- Prijzen: placeholder (exact prices TBD with client)

### PERSONAL TRAINING
- Dark section (`--anthracite`)
- Split: trainer photo right, copy left
- Copy: short pitch on personal begeleiding + "Maak een afspraak" CTA (outline red)

### REVIEWS
- Headline: `4.6 ★★★★★ op Google`
- 3 cards: star rating + quote + name + membership duration
- Footer link: "Bekijk alle reviews op Google →"

### OVER USA
- Copy: lokaal verhaal, "al jarenlang thuis in Rijssen", erkend leerbedrijf
- 2 interior photos in asymmetric grid
- No CTA needed here — pure trust/identity section

### LOCATIE
- Left: address block + opening hours table (Poppins, clean)
- Right: static map image (placehold.co) or embedded Google Maps iframe
- Contact: phone + email

### CTA BANNER
- Background: `--red` (only full-red section on page)
- Headline: "Klaar om te starten?" (Montserrat 700, white, large)
- CTA: "Start gratis dagpas" (white filled button, anthracite text)

### FOOTER
- Background: near-black (`#111113`)
- Columns: Logo + tagline | Navigatie | Contact | Socials
- Tagline: "TRAIN. FEEL BETTER. LIVE BETTER."
- Newsletter signup: email input + submit
- Bottom bar: © 2026 USA Sport · KvK 06052524 · usa-rijssen.nl

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | 375px | Single column, hamburger nav, hero 100dvh |
| Tablet | 768px | 2-col grids, split sections stack |
| Desktop | 1024px | Full layout, sticky nav |
| Wide | 1440px | Max content width `max-w-7xl` centered |

---

## 6. Assets

| Asset | Source | Notes |
|-------|--------|-------|
| Logo | `Usalogo2.png` | White background PNG — use `mix-blend-mode: multiply` on dark surfaces to blend white away; logo shows red "usa" script + 5 stars + "Exclusief fitnesscentrum" |
| Gym photos | `https://placehold.co/` | Replace with real photos later |
| Icons | Lucide (SVG inline) | Consistent stroke-width 1.5 |
| Map | `https://placehold.co/600x300` | Replace with real embed |

---

## 7. Content (NL)

- **Tagline:** TRAIN. FEEL BETTER. LIVE BETTER.
- **Subheadline:** Dé fitness arena van Rijssen — sport, gezondheid en groei voor jong en oud.
- **Address:** Fahrenheitstraat 3, 7461 JA Rijssen
- **Phone:** 0548-517073
- **Email:** usa.rijssen@planet.nl
- **Website ref:** usa-rijssen.nl
- **KvK:** 06052524
- **Rating:** 4.6 / 5 · 100+ reviews

---

## 8. Out of Scope (Homepage Only)

- Groepslessen rooster pagina
- Membership signup flow
- Contact form pagina
- Blog / nieuws
- Medewerkers pagina
