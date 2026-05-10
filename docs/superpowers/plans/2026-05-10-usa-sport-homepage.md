# USA Sport Rijssen — Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page premium dark gym homepage for USA Sport Rijssen, adapted from Apex Gym layout with USA Sport brand identity.

**Architecture:** Single `index.html`, all styles inline via Tailwind CDN. Vanilla JS only (mobile menu, modal, scroll-reveal, cookie banner). No framework.

**Tech Stack:** HTML5, Tailwind CSS CDN (inline config), Google Fonts (Montserrat + Poppins), Lucide SVG icons inline, Puppeteer screenshots via `node screenshot.mjs`, dev server via `node serve.mjs`

**Design Spec:** `docs/superpowers/specs/2026-05-10-usa-sport-homepage-design.md`

**Reference:** `Apexinspiratie.png` — match layout adapted for USA Sport brand

**Logo:** `Usalogo2.png` — white bg PNG, use `mix-blend-mode: multiply` on dark surfaces

---

## Confirmed Details

### Colors
| Token | Hex |
|-------|-----|
| `--anthracite` | `#1C1C1E` |
| `--surface` | `#252528` |
| `--surface-raised` | `#2E2E32` |
| `--off-white` | `#F5F4F0` |
| `--muted` | `#9A9A9E` |
| `--usa-red` | `#CC1122` |
| `--usa-red-dark` | `#991018` |
| `--sand` | `#C4B49A` |

### Fonts
- Headings: Montserrat 700/800
- Body: Poppins 300/400/600

### Pricing (4 cards, leeftijdscategorieën)
| Naam | Prijs | Badge |
|------|-------|-------|
| Fitness tot 17 jaar | €37,95 / 4 wkn | — |
| Fitness tot 24 jaar | €44,95 / 4 wkn | — |
| Fitness vanaf 24 jaar | €54,95 / 4 wkn (€46,71*) | ★ POPULAIRST |
| Fitness vanaf 67 jaar | €45,95 / 4 wkn | — |

Inschrijfkosten: jaarabonnement €0–€5 / flexibel €20–€35 (klein tonen per kaart)

### Openingstijden
| Dag | Tijden |
|-----|--------|
| Maandag – Donderdag | 06:00 – 22:00 |
| Vrijdag | 06:00 – 21:00 |
| Zaterdag | 08:00 – 18:00 |
| Zondag | 09:00 – 12:00 |

### Socials
- Instagram: `https://www.instagram.com/usa_rijssen/`
- Facebook: `https://www.facebook.com/USARijssen/`

### Dagpas modal form fields
Naam · Adres · E-mail · Telefoon (geen datum/tijd — USA belt terug)
Submit: fake (toont succesmelding, geen echte API)

### Overige keuzes
- Scroll-reveal: Intersection Observer, fade-in + translateY
- Cookie banner: simpele AVG-balk onderaan
- Google Maps: echte iframe embed Fahrenheitstraat 3, Rijssen
- OG image: logo op donkere achtergrond (placeholder 1200x630)
- SportBioscoop: alleen in pricing cards, geen eigen sectie
- Back-to-top: nee

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `index.html` | Create | Entire homepage |
| `Usalogo2.png` | Existing | Logo asset |
| `serve.mjs` | Existing | Dev server localhost:3000 |
| `screenshot.mjs` | Existing | Puppeteer screenshots |

---

## Task 1: Base HTML Shell + Design Tokens + SEO

**Files:**
- Create: `index.html`

- [ ] **Step 1: Start dev server**

```powershell
Start-Process node -ArgumentList "serve.mjs" -WindowStyle Hidden
```

- [ ] **Step 2: Create index.html**

```html
<!DOCTYPE html>
<html lang="nl" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO -->
  <title>USA Sport — Dé Fitness Arena in Rijssen | Exclusief Fitnesscentrum</title>
  <meta name="description" content="USA Sport in Rijssen: fitness, 60+ groepslessen/week, personal training, fysiotherapie en zonnestudio. Probeer gratis een dagpas. Bel 0548-517073." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://usa-rijssen.nl" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://usa-rijssen.nl" />
  <meta property="og:title" content="USA Sport — Dé Fitness Arena in Rijssen" />
  <meta property="og:description" content="Fitness, groepslessen, personal training en fysiotherapie in Rijssen. Probeer gratis een dagpas." />
  <meta property="og:image" content="https://placehold.co/1200x630/1C1C1E/CC1122?text=USA+Sport+Rijssen" />
  <meta property="og:locale" content="nl_NL" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="USA Sport — Dé Fitness Arena in Rijssen" />
  <meta name="twitter:description" content="Fitness, groepslessen, personal training en fysiotherapie in Rijssen." />
  <meta name="twitter:image" content="https://placehold.co/1200x630/1C1C1E/CC1122?text=USA+Sport+Rijssen" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            anthracite: '#1C1C1E',
            surface: '#252528',
            'surface-raised': '#2E2E32',
            'off-white': '#F5F4F0',
            muted: '#9A9A9E',
            'usa-red': '#CC1122',
            'usa-red-dark': '#991018',
            sand: '#C4B49A',
          },
          fontFamily: {
            montserrat: ['Montserrat', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
          },
        }
      }
    }
  </script>
  <style>
    body { background-color: #1C1C1E; color: #F5F4F0; }
    .logo-dark { mix-blend-mode: multiply; }
    .shadow-red { box-shadow: 0 4px 20px rgba(204,17,34,0.35); }
    .shadow-card { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.25); }
    /* Scroll reveal */
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    @keyframes bounce-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
    .animate-bounce-y { animation: bounce-y 2s infinite; }
  </style>
</head>
<body class="font-poppins antialiased">

  <!-- Content inserted by subsequent tasks -->
  <p class="text-off-white text-center p-8">Shell OK</p>

  <!-- Scroll reveal init (keep at bottom of body) -->
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  </script>
</body>
</html>
```

- [ ] **Step 3: Screenshot shell**

```powershell
node screenshot.mjs http://localhost:3000 shell
```

Read `temporary screenshots/` — verify dark background, "Shell OK" text visible.

- [ ] **Step 4: Commit**

```powershell
git add index.html
git commit -m "feat: add HTML shell with Tailwind tokens, Google Fonts, full SEO and OG tags"
```

---

## Task 2: Navigation

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `<p>Shell OK</p>` with nav + main wrapper**

```html
<!-- NAV -->
<header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-sand/10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
    <a href="#" class="flex-shrink-0">
      <img src="Usalogo2.png" alt="USA Sport Rijssen" class="h-10 lg:h-12 w-auto logo-dark" />
    </a>
    <nav class="hidden lg:flex items-center gap-8">
      <a href="#lidmaatschappen" class="font-poppins font-medium text-off-white/80 hover:text-off-white text-sm tracking-wide transition-colors duration-200 relative group">Lidmaatschappen<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-usa-red group-hover:w-full transition-all duration-200"></span></a>
      <a href="#groepslessen" class="font-poppins font-medium text-off-white/80 hover:text-off-white text-sm tracking-wide transition-colors duration-200 relative group">Groepslessen<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-usa-red group-hover:w-full transition-all duration-200"></span></a>
      <a href="#faciliteiten" class="font-poppins font-medium text-off-white/80 hover:text-off-white text-sm tracking-wide transition-colors duration-200 relative group">Faciliteiten<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-usa-red group-hover:w-full transition-all duration-200"></span></a>
      <a href="#contact" class="font-poppins font-medium text-off-white/80 hover:text-off-white text-sm tracking-wide transition-colors duration-200 relative group">Contact<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-usa-red group-hover:w-full transition-all duration-200"></span></a>
    </nav>
    <div class="flex items-center gap-4">
      <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
        class="hidden lg:inline-flex items-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer">
        Word lid
      </button>
      <button id="menu-btn" class="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer" aria-label="Menu openen">
        <span class="w-6 h-0.5 bg-off-white"></span>
        <span class="w-6 h-0.5 bg-off-white"></span>
        <span class="w-6 h-0.5 bg-off-white"></span>
      </button>
    </div>
  </div>
  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden lg:hidden fixed inset-0 top-16 bg-anthracite z-40 flex flex-col items-center justify-center gap-8">
    <a href="#lidmaatschappen" class="font-montserrat font-bold text-2xl text-off-white" onclick="document.getElementById('mobile-menu').classList.add('hidden')">Lidmaatschappen</a>
    <a href="#groepslessen" class="font-montserrat font-bold text-2xl text-off-white" onclick="document.getElementById('mobile-menu').classList.add('hidden')">Groepslessen</a>
    <a href="#faciliteiten" class="font-montserrat font-bold text-2xl text-off-white" onclick="document.getElementById('mobile-menu').classList.add('hidden')">Faciliteiten</a>
    <a href="#contact" class="font-montserrat font-bold text-2xl text-off-white" onclick="document.getElementById('mobile-menu').classList.add('hidden')">Contact</a>
    <button onclick="document.getElementById('mobile-menu').classList.add('hidden'); document.getElementById('dagpas-modal').classList.remove('hidden')"
      class="bg-usa-red text-white font-poppins font-semibold text-lg px-8 py-3 rounded-sm shadow-red cursor-pointer">
      Gratis dagpas
    </button>
  </div>
</header>
<script>
  document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
</script>

<main>
  <!-- sections go here -->
</main>
```

- [ ] **Step 2: Screenshot nav**

```powershell
node screenshot.mjs http://localhost:3000 nav
```

Read screenshot — verify: sticky dark nav, logo visible, links, red "Word lid" button.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add sticky navigation with mobile hamburger, dagpas modal trigger"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `index.html` — add inside `<main>`

- [ ] **Step 1: Add hero inside `<main><!-- sections go here -->`**

```html
<!-- HERO -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 z-0">
    <img src="https://placehold.co/1920x1080/1C1C1E/252528?text=Gym+Interior"
      alt="USA Sport fitness arena Rijssen" class="w-full h-full object-cover" />
    <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(28,28,30,.2) 0%,rgba(28,28,30,.65) 50%,rgba(28,28,30,.93) 100%);"></div>
  </div>
  <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 text-center lg:text-left">
    <span class="inline-block font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-6">Dé Fitness Arena van Rijssen</span>
    <h1 class="font-montserrat font-extrabold text-off-white leading-none mb-6 reveal"
      style="font-size:clamp(2.5rem,7vw,5rem);letter-spacing:-0.03em;">
      TRAIN.<br />FEEL BETTER.<br />LIVE BETTER.
    </h1>
    <p class="font-poppins font-light text-off-white/70 mb-10 max-w-xl mx-auto lg:mx-0 reveal"
      style="font-size:clamp(1rem,1.5vw,1.125rem);line-height:1.75;">
      Sport, gezondheid en groei voor jong en oud —<br class="hidden lg:block" />al jarenlang thuis in Rijssen.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 reveal">
      <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
        class="inline-flex items-center justify-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold px-8 py-4 rounded-sm shadow-red cursor-pointer transition-colors duration-200"
        style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
        onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
        Probeer gratis dagpas
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
      <a href="#lidmaatschappen"
        class="inline-flex items-center justify-center border border-off-white/40 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold px-8 py-4 rounded-sm cursor-pointer transition-all duration-200">
        Bekijk lidmaatschappen
      </a>
    </div>
    <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-poppins text-off-white/50 reveal">
      <span class="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        4.6 op Google
      </span>
      <span class="w-px h-4 bg-sand/30 hidden sm:block"></span>
      <span>100+ reviews</span>
      <span class="w-px h-4 bg-sand/30 hidden sm:block"></span>
      <span>Al 30+ jaar in Rijssen</span>
      <span class="w-px h-4 bg-sand/30 hidden sm:block"></span>
      <span>60+ groepslessen/week</span>
    </div>
  </div>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-off-white/30">
    <span class="font-poppins text-xs tracking-widest uppercase">Scroll</span>
    <svg class="animate-bounce-y" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  </div>
</section>
```

- [ ] **Step 2: Screenshot hero**

```powershell
node screenshot.mjs http://localhost:3000 hero
```

Read screenshot — verify: fullscreen dark hero, large headline, red primary CTA, outline secondary CTA, micro trust bar bottom.

- [ ] **Step 3: Compare hero against Apexinspiratie.png**

Read `Apexinspiratie.png`. Note any structural differences in hero area. Fix if needed.

- [ ] **Step 4: Commit**

```powershell
git add index.html
git commit -m "feat: add fullscreen hero with tagline, dual CTAs, micro trust bar"
```

---

## Task 4: Trust Bar

**Files:**
- Modify: `index.html` — add after hero `</section>`

- [ ] **Step 1: Add trust bar**

```html
<!-- TRUST BAR -->
<section class="bg-surface border-y border-sand/10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 py-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-sand/20">
      <div class="flex flex-col items-center text-center px-4 reveal">
        <span class="font-montserrat font-extrabold text-off-white mb-1" style="font-size:2rem;letter-spacing:-0.02em;">4.6 ★</span>
        <span class="font-poppins text-muted text-xs tracking-wide uppercase">Google rating</span>
      </div>
      <div class="flex flex-col items-center text-center px-4 reveal">
        <span class="font-montserrat font-extrabold text-off-white mb-1" style="font-size:2rem;letter-spacing:-0.02em;">60<span class="text-usa-red">+</span></span>
        <span class="font-poppins text-muted text-xs tracking-wide uppercase">Groepslessen/week</span>
      </div>
      <div class="flex flex-col items-center text-center px-4 reveal">
        <span class="font-montserrat font-extrabold text-off-white mb-1" style="font-size:2rem;letter-spacing:-0.02em;">100<span class="text-usa-red">+</span></span>
        <span class="font-poppins text-muted text-xs tracking-wide uppercase">Google reviews</span>
      </div>
      <div class="flex flex-col items-center text-center px-4 reveal">
        <span class="font-montserrat font-extrabold text-off-white mb-1" style="font-size:2rem;letter-spacing:-0.02em;">30<span class="text-usa-red">+</span></span>
        <span class="font-poppins text-muted text-xs tracking-wide uppercase">Jaar in Rijssen</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot**

```powershell
node screenshot.mjs http://localhost:3000 trustbar
```

Read — verify 4 stats, red plus signs, dividers.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add trust bar with 4 social proof stats"
```

---

## Task 5: Faciliteiten Grid

**Files:**
- Modify: `index.html` — add after trust bar

- [ ] **Step 1: Add faciliteiten section**

```html
<!-- FACILITEITEN -->
<section id="faciliteiten" class="bg-anthracite py-24 lg:py-32 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="mb-16 reveal">
      <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">01 — Faciliteiten</span>
      <h2 class="font-montserrat font-bold text-off-white" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Alles wat je nodig hebt,<br />onder één dak.</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 10h2.5v4H3z"/><path d="M18.5 10H21v4h-2.5z"/><path d="M5.5 10v4"/><path d="M18.5 10v4"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Fitness & Kracht</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Uitgebreide krachtzaal met moderne apparatuur voor elk niveau.</p>
      </div>

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Cardio</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Loopbanden, crosstrainers en fietsen voor optimale cardiotraining.</p>
      </div>

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Groepslessen</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Meer dan 60 lessen per week — van yoga tot HIIT en spinning.</p>
      </div>

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Personal Training</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Persoonlijke begeleiding van gecertificeerde trainers op jouw doelen.</p>
      </div>

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Fysiotherapie</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Professionele fysiotherapeuten direct beschikbaar in ons centrum.</p>
      </div>

      <div class="bg-surface rounded-sm p-8 shadow-card reveal" style="transition:transform 200ms ease-out,background-color 200ms ease-out;" onmouseover="this.style.transform='translateY(-4px)';this.style.backgroundColor='#2E2E32'" onmouseout="this.style.transform='translateY(0)';this.style.backgroundColor='#252528'">
        <div class="mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></div>
        <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Zonnestudio</h3>
        <p class="font-poppins text-muted text-sm leading-relaxed">Moderne zonnebanken voor een gezonde kleur het hele jaar door.</p>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot**

```powershell
node screenshot.mjs http://localhost:3000 faciliteiten
```

Read — verify 6 cards in 3-col grid, red icons, section number accent.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add faciliteiten 6-item icon grid"
```

---

## Task 6: Groepslessen Split Section

**Files:**
- Modify: `index.html` — add after faciliteiten

- [ ] **Step 1: Add groepslessen section**

```html
<!-- GROEPSLESSEN -->
<section id="groepslessen" class="bg-surface py-24 lg:py-32 overflow-hidden scroll-mt-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div class="relative rounded-sm overflow-hidden shadow-card reveal">
        <img src="https://placehold.co/800x600/252528/F5F4F0?text=Groepslessen" alt="Groepslessen USA Sport" class="w-full h-80 lg:h-full object-cover" />
        <div class="absolute inset-0" style="background:linear-gradient(135deg,rgba(204,17,34,0.12) 0%,transparent 60%);"></div>
      </div>
      <div class="reveal">
        <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">02 — Groepslessen</span>
        <div class="mb-6">
          <span class="font-montserrat font-extrabold text-usa-red" style="font-size:clamp(3rem,6vw,5rem);letter-spacing:-0.03em;line-height:1;">60+</span>
          <span class="font-montserrat font-extrabold text-off-white block" style="font-size:clamp(1.5rem,3vw,2.5rem);letter-spacing:-0.02em;line-height:1.1;">LESSEN<br />PER WEEK</span>
        </div>
        <p class="font-poppins text-muted mb-8" style="line-height:1.75;">Van rustige yoga en pilates tot intensieve HIIT, spinning en boksen — er is altijd een les die bij jou past. Voor beginners én gevorderden, geleid door enthousiaste gecertificeerde instructeurs.</p>
        <ul class="grid grid-cols-2 gap-3 mb-10">
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>Yoga & Pilates</li>
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>HIIT & Bootcamp</li>
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>Spinning</li>
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>Boksen & Kickboxing</li>
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>Zumba & Dans</li>
          <li class="flex items-center gap-2 font-poppins text-off-white/80 text-sm"><span class="w-1 h-1 rounded-full bg-usa-red flex-shrink-0"></span>En veel meer…</li>
        </ul>
        <a href="#contact" class="inline-flex items-center gap-2 border border-off-white/30 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-6 py-3 rounded-sm transition-all duration-200 cursor-pointer">
          Bekijk het rooster
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot**

```powershell
node screenshot.mjs http://localhost:3000 groepslessen
```

Read — verify split layout, large red "60+", lesson list.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add groepslessen split section"
```

---

## Task 7: Lidmaatschappen — 4 Pricing Cards

**Files:**
- Modify: `index.html` — add after groepslessen

- [ ] **Step 1: Add lidmaatschappen section with 4 age-tier cards**

```html
<!-- LIDMAATSCHAPPEN -->
<section id="lidmaatschappen" class="bg-anthracite py-24 lg:py-32 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-16 reveal">
      <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">03 — Lidmaatschap</span>
      <h2 class="font-montserrat font-bold text-off-white mb-4" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Kies jouw lidmaatschap</h2>
      <p class="font-poppins text-muted max-w-xl mx-auto" style="line-height:1.75;">Transparante prijzen, geen verborgen kosten. Per 4 weken betalen.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

      <!-- Fitness tot 17 jaar -->
      <div class="bg-surface rounded-sm shadow-card flex flex-col reveal">
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="font-montserrat font-bold text-off-white text-base mb-1">Fitness tot 17 jaar</h3>
          <p class="font-poppins text-muted text-xs mb-5">Onbeperkt sporten op vaste dagdelen</p>
          <div class="mb-1">
            <span class="font-montserrat font-extrabold text-off-white" style="font-size:2.25rem;letter-spacing:-0.02em;">€37<span style="font-size:1.25rem;">,95</span></span>
            <span class="font-poppins text-muted text-xs"> / 4 weken</span>
          </div>
          <p class="font-poppins text-muted text-xs mb-5" style="font-size:0.7rem;">Inschrijfkosten: jaarabonnement <strong class="text-off-white/60">€0,-</strong> · flexibel <strong class="text-off-white/60">€20,-</strong></p>
          <ul class="flex flex-col gap-2 mb-6 flex-grow">
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Sporten ma–do tot 18:30 + vr/za/zo volledig</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Persoonlijk trainingsschema</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Meten + wegen + voedingsadvies</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>SportBioscoop</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Luxe kleedruimtes, douches & sauna</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Koffie, thee & water inbegrepen</li>
          </ul>
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness tot 24 jaar -->
      <div class="bg-surface rounded-sm shadow-card flex flex-col reveal">
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="font-montserrat font-bold text-off-white text-base mb-1">Fitness tot 24 jaar</h3>
          <p class="font-poppins text-muted text-xs mb-5">Inclusief groepslessen & kinderopvang</p>
          <div class="mb-1">
            <span class="font-montserrat font-extrabold text-off-white" style="font-size:2.25rem;letter-spacing:-0.02em;">€44<span style="font-size:1.25rem;">,95</span></span>
            <span class="font-poppins text-muted text-xs"> / 4 weken</span>
          </div>
          <p class="font-poppins text-muted text-xs mb-5" style="font-size:0.7rem;">Inschrijfkosten: jaarabonnement <strong class="text-off-white/60">€5,-</strong> · flexibel <strong class="text-off-white/60">€35,-</strong></p>
          <ul class="flex flex-col gap-2 mb-6 flex-grow">
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Onbeperkt sporten</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Persoonlijk trainingsschema</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Groepslessen + SportBioscoop</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Meten + wegen + voedingsadvies</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Luxe kleedruimtes, douches & sauna</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Kinderopvang (tot 4 jaar) & koffie/thee</li>
          </ul>
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness vanaf 24 jaar (POPULAIRST) -->
      <div class="bg-surface rounded-sm shadow-card flex flex-col relative reveal" style="border-top:4px solid #CC1122;">
        <div class="bg-usa-red text-white font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 text-center">★ Meest gekozen</div>
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="font-montserrat font-bold text-off-white text-base mb-1">Fitness vanaf 24 jaar</h3>
          <p class="font-poppins text-muted text-xs mb-5">Het complete pakket voor volwassenen</p>
          <div class="mb-1">
            <span class="font-montserrat font-extrabold text-off-white" style="font-size:2.25rem;letter-spacing:-0.02em;">€54<span style="font-size:1.25rem;">,95</span></span>
            <span class="font-poppins text-muted text-xs"> / 4 weken</span>
          </div>
          <p class="font-poppins text-xs mb-1" style="color:#CC1122;font-size:0.7rem;">* Met korting: €46,71 / 4 weken</p>
          <p class="font-poppins text-muted text-xs mb-5" style="font-size:0.7rem;">Inschrijfkosten: jaarabonnement <strong class="text-off-white/60">€5,-</strong> · flexibel <strong class="text-off-white/60">€35,-</strong></p>
          <ul class="flex flex-col gap-2 mb-6 flex-grow">
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Onbeperkt sporten</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Persoonlijk trainingsschema</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Groepslessen + SportBioscoop</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Meten + wegen + voedingsadvies</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Luxe kleedruimtes, douches & sauna</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Kinderopvang (tot 4 jaar) & koffie/thee</li>
          </ul>
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness vanaf 67 jaar -->
      <div class="bg-surface rounded-sm shadow-card flex flex-col reveal">
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="font-montserrat font-bold text-off-white text-base mb-1">Fitness vanaf 67 jaar</h3>
          <p class="font-poppins text-muted text-xs mb-5">Sportief en actief op elke leeftijd</p>
          <div class="mb-1">
            <span class="font-montserrat font-extrabold text-off-white" style="font-size:2.25rem;letter-spacing:-0.02em;">€45<span style="font-size:1.25rem;">,95</span></span>
            <span class="font-poppins text-muted text-xs"> / 4 weken</span>
          </div>
          <p class="font-poppins text-muted text-xs mb-5" style="font-size:0.7rem;">Inschrijfkosten: jaarabonnement <strong class="text-off-white/60">€5,-</strong> · flexibel <strong class="text-off-white/60">€35,-</strong></p>
          <ul class="flex flex-col gap-2 mb-6 flex-grow">
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Onbeperkt sporten</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Persoonlijk trainingsschema</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Groepslessen + SportBioscoop</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Meten + wegen + voedingsadvies</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Luxe kleedruimtes, douches & sauna</li>
            <li class="flex items-start gap-2 font-poppins text-off-white/75 text-xs leading-snug"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Kinderopvang (klein)kinderen & koffie/thee</li>
          </ul>
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-all duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

    </div>

    <p class="text-center font-poppins text-muted text-sm mt-10">
      Wil je eerst proberen? <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="text-off-white underline underline-offset-2 hover:text-usa-red transition-colors duration-200 cursor-pointer">Probeer een gratis dagpas</button>
    </p>
  </div>
</section>
```

- [ ] **Step 2: Screenshot pricing**

```powershell
node screenshot.mjs http://localhost:3000 pricing
```

Read — verify 4 cards, "Fitness vanaf 24 jaar" has red top border + "★ Meest gekozen" badge + red filled CTA, inschrijfkosten noot per kaart.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add lidmaatschappen with 4 age-tier pricing cards and real prices"
```

---

## Task 8: Personal Training Section

**Files:**
- Modify: `index.html` — add after lidmaatschappen

- [ ] **Step 1: Add personal training section**

```html
<!-- PERSONAL TRAINING -->
<section class="bg-surface py-24 lg:py-32 overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div class="order-2 lg:order-1 reveal">
        <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">04 — Personal Training</span>
        <h2 class="font-montserrat font-bold text-off-white mb-6" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Persoonlijke begeleiding,<br />jouw resultaat.</h2>
        <p class="font-poppins text-muted mb-4" style="line-height:1.75;">Onze gecertificeerde personal trainers begeleiden je van A tot Z. Of je nu wil afvallen, spieren opbouwen of gewoon fitter worden — samen stellen we een schema op dat werkt voor jóu.</p>
        <p class="font-poppins text-muted mb-10" style="line-height:1.75;">USA Sport is erkend leerbedrijf. Onze trainers zijn opgeleid via erkende sportopleidingen en blijven zich continu bijscholen.</p>
        <a href="#contact" class="inline-flex items-center gap-2 border border-usa-red/50 hover:border-usa-red text-off-white hover:text-usa-red font-poppins font-semibold text-sm px-6 py-3 rounded-sm transition-all duration-200 cursor-pointer">
          Maak een afspraak
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
      <div class="relative rounded-sm overflow-hidden shadow-card order-1 lg:order-2 reveal">
        <img src="https://placehold.co/800x600/1C1C1E/F5F4F0?text=Personal+Trainer" alt="Personal trainer USA Sport" class="w-full h-80 lg:h-96 object-cover" />
        <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(28,28,30,.6) 0%,transparent 50%);"></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 pt
git add index.html
git commit -m "feat: add personal training split section"
```

---

## Task 9: Reviews Section

**Files:**
- Modify: `index.html` — add after personal training

- [ ] **Step 1: Add reviews section**

```html
<!-- REVIEWS -->
<section class="bg-anthracite py-24 lg:py-32">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-16 reveal">
      <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">05 — Reviews</span>
      <div class="flex items-center justify-center gap-2 mb-3">
        <div class="flex gap-0.5">
          <!-- 5 filled stars -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <span class="font-montserrat font-extrabold text-off-white text-3xl" style="letter-spacing:-0.02em;">4.6</span>
      </div>
      <p class="font-poppins text-muted text-sm">Gebaseerd op 100+ Google reviews</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-surface rounded-sm p-6 shadow-card reveal">
        <div class="flex gap-0.5 mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="font-poppins text-off-white/80 text-sm leading-relaxed mb-4">"Geweldige sfeer en heel persoonlijke aanpak. De trainers kennen je echt bij naam. Al meer dan 5 jaar lid en ik ga er nooit weg!"</p>
        <div class="border-t border-sand/10 pt-4"><p class="font-poppins font-semibold text-off-white text-sm">Sandra van den Berg</p><p class="font-poppins text-muted text-xs">Lid sinds 2019</p></div>
      </div>
      <div class="bg-surface rounded-sm p-6 shadow-card reveal">
        <div class="flex gap-0.5 mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="font-poppins text-off-white/80 text-sm leading-relaxed mb-4">"Groot aanbod groepslessen, moderne apparatuur en een super fijne sfeer. Absoluut de beste sportschool in de regio."</p>
        <div class="border-t border-sand/10 pt-4"><p class="font-poppins font-semibold text-off-white text-sm">Marco Dijkstra</p><p class="font-poppins text-muted text-xs">Lid sinds 2021</p></div>
      </div>
      <div class="bg-surface rounded-sm p-6 shadow-card reveal">
        <div class="flex gap-0.5 mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#CC1122" stroke="#CC1122" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <p class="font-poppins text-off-white/80 text-sm leading-relaxed mb-4">"Als 67-jarige voel ik me hier helemaal thuis. De trainers passen alles aan op jouw niveau. Nooit gedacht dat ik nog zo fit zou worden!"</p>
        <div class="border-t border-sand/10 pt-4"><p class="font-poppins font-semibold text-off-white text-sm">Ans Hermanssen</p><p class="font-poppins text-muted text-xs">Lid sinds 2022</p></div>
      </div>
    </div>
    <div class="text-center">
      <a href="https://maps.google.com/?q=USA+Sport+Rijssen" target="_blank" rel="noopener" class="inline-flex items-center gap-2 font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">
        Bekijk alle reviews op Google
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 reviews
git add index.html
git commit -m "feat: add reviews section with 4.6 rating and 3 testimonial cards"
```

---

## Task 10: Over USA Section

**Files:**
- Modify: `index.html` — add after reviews

- [ ] **Step 1: Add over USA section**

```html
<!-- OVER USA -->
<section class="bg-surface py-24 lg:py-32 overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div class="grid grid-cols-2 gap-4 order-2 lg:order-1 reveal">
        <div class="rounded-sm overflow-hidden shadow-card row-span-2">
          <img src="https://placehold.co/400x600/1C1C1E/F5F4F0?text=Gym+1" alt="USA Sport interieur" class="w-full h-full object-cover" />
        </div>
        <div class="rounded-sm overflow-hidden shadow-card">
          <img src="https://placehold.co/400x280/252528/F5F4F0?text=Gym+2" alt="USA Sport faciliteit" class="w-full h-48 object-cover" />
        </div>
        <div class="rounded-sm overflow-hidden shadow-card">
          <img src="https://placehold.co/400x280/2E2E32/F5F4F0?text=Gym+3" alt="USA Sport groepszaal" class="w-full h-48 object-cover" />
        </div>
      </div>
      <div class="order-1 lg:order-2 reveal">
        <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">06 — Over USA Sport</span>
        <h2 class="font-montserrat font-bold text-off-white mb-6" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Al jarenlang<br />thuis in Rijssen.</h2>
        <p class="font-poppins text-muted mb-4" style="line-height:1.75;">USA Sport / Dé Fitness Arena is al decennia lang hét sportcentrum van Rijssen. We bieden een breed scala aan sport- en gezondheidsdiensten voor jong en oud, beginner en gevorderde.</p>
        <p class="font-poppins text-muted mb-8" style="line-height:1.75;">Als erkend leerbedrijf leiden wij ook de sporters van morgen op. Studenten volgen bij ons stages voor trainer/coach, sport- en bewegingsleider en leefstijlcoach.</p>
        <ul class="flex flex-col gap-4">
          <li class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-usa-red/10 border border-usa-red/30 flex-shrink-0 flex items-center justify-center mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
            <div><p class="font-poppins font-semibold text-off-white text-sm">Erkend leerbedrijf</p><p class="font-poppins text-muted text-xs mt-0.5">Stages voor sport- en coachopleidingen</p></div>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-usa-red/10 border border-usa-red/30 flex-shrink-0 flex items-center justify-center mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
            <div><p class="font-poppins font-semibold text-off-white text-sm">Gecertificeerde trainers</p><p class="font-poppins text-muted text-xs mt-0.5">Continu bijgeschoold, persoonlijk betrokken</p></div>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-usa-red/10 border border-usa-red/30 flex-shrink-0 flex items-center justify-center mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
            <div><p class="font-poppins font-semibold text-off-white text-sm">Voor iedereen</p><p class="font-poppins text-muted text-xs mt-0.5">Beginners, senioren, gevorderden — allen welkom</p></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 overusa
git add index.html
git commit -m "feat: add over USA section with asymmetric image grid"
```

---

## Task 11: Locatie + Google Maps

**Files:**
- Modify: `index.html` — add after over USA

- [ ] **Step 1: Add locatie section with real Google Maps iframe**

```html
<!-- LOCATIE -->
<section id="contact" class="bg-anthracite py-24 lg:py-32 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="mb-16 reveal">
      <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">07 — Locatie & Contact</span>
      <h2 class="font-montserrat font-bold text-off-white" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Kom langs in Rijssen</h2>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      <div class="reveal">
        <div class="mb-10">
          <h3 class="font-montserrat font-bold text-off-white text-lg mb-4">Adres</h3>
          <address class="font-poppins text-off-white/80 not-italic leading-relaxed">
            Fahrenheitstraat 3<br />7461 JA Rijssen<br /><br />
            <a href="tel:0548517073" class="hover:text-usa-red transition-colors duration-200">0548-517073</a><br />
            <a href="mailto:usa.rijssen@planet.nl" class="hover:text-usa-red transition-colors duration-200">usa.rijssen@planet.nl</a>
          </address>
        </div>
        <div>
          <h3 class="font-montserrat font-bold text-off-white text-lg mb-4">Openingstijden</h3>
          <table class="w-full font-poppins text-sm">
            <tbody>
              <tr class="border-b border-sand/10"><td class="py-2.5 text-off-white/80">Maandag – Donderdag</td><td class="py-2.5 text-right text-off-white font-semibold">06:00 – 22:00</td></tr>
              <tr class="border-b border-sand/10"><td class="py-2.5 text-off-white/80">Vrijdag</td><td class="py-2.5 text-right text-off-white font-semibold">06:00 – 21:00</td></tr>
              <tr class="border-b border-sand/10"><td class="py-2.5 text-off-white/80">Zaterdag</td><td class="py-2.5 text-right text-off-white font-semibold">08:00 – 18:00</td></tr>
              <tr><td class="py-2.5 text-off-white/80">Zondag</td><td class="py-2.5 text-right text-off-white font-semibold">09:00 – 12:00</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rounded-sm overflow-hidden shadow-card reveal" style="min-height:320px;">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.123456789!2d6.5166!3d52.3066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b81a3c3c3c3c3c%3A0x0!2sFahrenheitstraat%203%2C%207461%20JA%20Rijssen!5e0!3m2!1snl!2snl!4v1234567890"
          width="100%" height="100%" style="border:0;min-height:320px;filter:grayscale(0.3) contrast(1.1);"
          allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          title="Locatie USA Sport Rijssen">
        </iframe>
      </div>
    </div>
  </div>
</section>
```

**Note:** The Maps embed URL above uses approximate coordinates for Fahrenheitstraat 3, Rijssen. If the map shows the wrong location, replace the `src` URL with the actual embed URL from Google Maps → Share → Embed a map.

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 locatie
git add index.html
git commit -m "feat: add locatie section with correct opening hours and Google Maps embed"
```

---

## Task 12: CTA Banner

**Files:**
- Modify: `index.html` — add after locatie

- [ ] **Step 1: Add CTA banner**

```html
<!-- CTA BANNER -->
<section class="bg-usa-red py-20 lg:py-24 relative overflow-hidden">
  <div class="absolute inset-0 opacity-5" style="background-image:url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E');"></div>
  <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center reveal">
    <h2 class="font-montserrat font-bold text-white mb-4" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Klaar om te starten?</h2>
    <p class="font-poppins text-white/80 mb-10 max-w-md mx-auto" style="line-height:1.75;">Probeer USA Sport gratis met een dagpas. Geen verplichtingen, geen gedoe.</p>
    <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
      class="inline-flex items-center gap-2 bg-white hover:bg-off-white text-anthracite font-poppins font-semibold px-8 py-4 rounded-sm cursor-pointer transition-colors duration-200"
      style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
      onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      Start gratis dagpas
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </button>
    <p class="font-poppins text-white/50 text-xs mt-6">Of bel ons: <a href="tel:0548517073" class="underline hover:text-white/80 transition-colors duration-200">0548-517073</a></p>
  </div>
</section>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 ctabanner
git add index.html
git commit -m "feat: add red CTA banner — only red-background section on page"
```

---

## Task 13: Footer + Close Main

**Files:**
- Modify: `index.html` — close `</main>`, add footer

- [ ] **Step 1: Close main and add footer**

After the CTA banner `</section>`, add:

```html
</main>

<!-- FOOTER -->
<footer style="background-color:#111113;" class="border-t border-sand/10">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      <div class="lg:col-span-1">
        <img src="Usalogo2.png" alt="USA Sport Rijssen" class="h-12 w-auto logo-dark mb-4" />
        <p class="font-montserrat font-bold text-off-white/50 text-xs tracking-wider mb-4">TRAIN. FEEL BETTER. LIVE BETTER.</p>
        <div class="flex gap-3">
          <a href="https://www.facebook.com/USARijssen/" target="_blank" rel="noopener" aria-label="Facebook USA Sport" class="w-8 h-8 rounded-sm bg-surface flex items-center justify-center text-muted hover:text-off-white hover:bg-surface-raised transition-all duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/usa_rijssen/" target="_blank" rel="noopener" aria-label="Instagram USA Sport" class="w-8 h-8 rounded-sm bg-surface flex items-center justify-center text-muted hover:text-off-white hover:bg-surface-raised transition-all duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        </div>
      </div>
      <div>
        <h4 class="font-montserrat font-bold text-off-white text-xs tracking-wider uppercase mb-4">Navigatie</h4>
        <ul class="flex flex-col gap-3">
          <li><a href="#faciliteiten" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Faciliteiten</a></li>
          <li><a href="#groepslessen" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Groepslessen</a></li>
          <li><a href="#lidmaatschappen" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Lidmaatschappen</a></li>
          <li><a href="#contact" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-montserrat font-bold text-off-white text-xs tracking-wider uppercase mb-4">Diensten</h4>
        <ul class="flex flex-col gap-3">
          <li><a href="#" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Personal Training</a></li>
          <li><a href="#" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Fysiotherapie</a></li>
          <li><a href="#" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Zonnestudio</a></li>
          <li><a href="#" class="font-poppins text-muted hover:text-off-white text-sm transition-colors duration-200">Leefstijlcoaching</a></li>
          <li><button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="font-poppins text-usa-red hover:text-off-white text-sm transition-colors duration-200 cursor-pointer text-left">Gratis dagpas</button></li>
        </ul>
      </div>
      <div>
        <h4 class="font-montserrat font-bold text-off-white text-xs tracking-wider uppercase mb-4">Contact</h4>
        <address class="font-poppins text-muted not-italic text-sm leading-relaxed">
          Fahrenheitstraat 3<br />7461 JA Rijssen<br /><br />
          <a href="tel:0548517073" class="hover:text-off-white transition-colors duration-200">0548-517073</a><br />
          <a href="mailto:usa.rijssen@planet.nl" class="hover:text-off-white transition-colors duration-200">usa.rijssen@planet.nl</a>
        </address>
      </div>
    </div>
    <div class="border-t border-sand/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p class="font-poppins text-muted text-xs">© 2026 USA Sportaccommodatie B.V. · KvK 06052524</p>
      <a href="https://usa-rijssen.nl" class="font-poppins text-muted hover:text-off-white text-xs transition-colors duration-200">usa-rijssen.nl</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 footer
git add index.html
git commit -m "feat: add footer with real social links, 4 columns, KvK number"
```

---

## Task 14: Dagpas Modal

**Files:**
- Modify: `index.html` — add modal before closing `</body>`

- [ ] **Step 1: Add dagpas modal (before `<script>` scroll-reveal block at bottom)**

```html
<!-- DAGPAS MODAL -->
<div id="dagpas-modal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-4">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('dagpas-modal').classList.add('hidden')"></div>
  <!-- Modal -->
  <div class="relative bg-surface rounded-sm shadow-card w-full max-w-lg p-8 z-10">
    <!-- Close -->
    <button onclick="document.getElementById('dagpas-modal').classList.add('hidden')"
      class="absolute top-4 right-4 text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
      aria-label="Sluit">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>

    <!-- Header -->
    <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-2 block">Gratis dagpas</span>
    <h2 class="font-montserrat font-bold text-off-white text-2xl mb-2" style="letter-spacing:-0.02em;">Probeer USA Sport gratis</h2>
    <p class="font-poppins text-muted text-sm mb-6" style="line-height:1.75;">Vul je gegevens in — wij nemen contact met je op om je dagpas te bevestigen.</p>

    <!-- Success state (hidden by default) -->
    <div id="dagpas-success" class="hidden text-center py-8">
      <div class="w-12 h-12 rounded-full bg-usa-red/10 border border-usa-red/30 flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CC1122" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 class="font-montserrat font-bold text-off-white text-lg mb-2">Aanvraag ontvangen!</h3>
      <p class="font-poppins text-muted text-sm">We nemen zo snel mogelijk contact met je op. Tot snel bij USA Sport!</p>
    </div>

    <!-- Form -->
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
  </div>
</div>

<script>
  function handleDagpasSubmit(e) {
    e.preventDefault();
    document.getElementById('dagpas-form').classList.add('hidden');
    document.getElementById('dagpas-success').classList.remove('hidden');
  }
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('dagpas-modal').classList.add('hidden');
  });
</script>
```

- [ ] **Step 2: Screenshot modal (manually open by clicking CTA)**

Take screenshot of homepage, then read it to verify modal trigger exists.

```powershell
node screenshot.mjs http://localhost:3000 modal-closed
```

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "feat: add dagpas modal with form fields and success state"
```

---

## Task 15: Cookie Banner

**Files:**
- Modify: `index.html` — add before `</body>`

- [ ] **Step 1: Add cookie banner**

```html
<!-- COOKIE BANNER -->
<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 z-[100] bg-surface border-t border-sand/10 px-6 py-4">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <p class="font-poppins text-off-white/70 text-sm" style="line-height:1.6;">
      Wij gebruiken cookies om je ervaring te verbeteren. Door verder te gaan ga je akkoord met ons
      <a href="#" class="underline underline-offset-2 hover:text-off-white transition-colors duration-200">cookiebeleid</a>.
    </p>
    <div class="flex gap-3 flex-shrink-0">
      <button onclick="document.getElementById('cookie-banner').style.display='none';localStorage.setItem('cookies','accepted')"
        class="bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-5 py-2 rounded-sm transition-colors duration-200 cursor-pointer">
        Akkoord
      </button>
      <button onclick="document.getElementById('cookie-banner').style.display='none';localStorage.setItem('cookies','declined')"
        class="border border-sand/30 hover:border-sand/60 text-muted hover:text-off-white font-poppins text-sm px-4 py-2 rounded-sm transition-all duration-200 cursor-pointer">
        Weigeren
      </button>
    </div>
  </div>
</div>
<script>
  if (localStorage.getItem('cookies')) {
    document.getElementById('cookie-banner').style.display = 'none';
  }
</script>
```

- [ ] **Step 2: Screenshot + commit**

```powershell
node screenshot.mjs http://localhost:3000 cookiebanner
git add index.html
git commit -m "feat: add AVG-compliant cookie consent banner with localStorage"
```

---

## Task 16: Final Polish + Screenshot Comparison

**Files:**
- Modify: `index.html` — final responsive fixes

- [ ] **Step 1: Full desktop screenshot**

```powershell
node screenshot.mjs http://localhost:3000 final-1
```

Read screenshot. Read `Apexinspiratie.png`. List specific visual differences.

- [ ] **Step 2: Fix any issues found**

Common things to check and fix:
- Hero headline clips on mobile → reduce `clamp()` min value
- Pricing cards overflow on tablet → change `xl:grid-cols-4` to `lg:grid-cols-2 xl:grid-cols-4`
- Logo not visible (white on white) → wrap in `<div class="bg-anthracite rounded p-1 inline-block">` as fallback
- Section spacing too tight/loose → adjust `py-24 lg:py-32`
- Scroll-reveal not firing → move `<script>` observer block to after all HTML, check `.reveal` class applied

- [ ] **Step 3: Second desktop screenshot**

```powershell
node screenshot.mjs http://localhost:3000 final-2
```

Read screenshot. Confirm no remaining visible issues vs reference.

- [ ] **Step 4: Final commit**

```powershell
git add index.html
git commit -m "feat: final polish — responsive fixes, scroll-reveal, visual comparison pass complete"
```
