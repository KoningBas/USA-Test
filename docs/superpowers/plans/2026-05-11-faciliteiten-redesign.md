# Faciliteiten Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vervang het huidige 3×2 kaartjesraster in de faciliteiten-sectie door een bento-grid met foto-achtergronden, clip-wipe scroll-animatie op de featured kaart, staggered fade-up op de kleine kaarten, en card-lift + rode glow hover-effecten.

**Architecture:** Alle wijzigingen in één bestand (`index.html`). CSS-klassen in het bestaande `<style>`-blok (regel 56–65). HTML vervangt de sectie op regels 185–225. Twee nieuwe `IntersectionObserver`-instanties toegevoegd aan het bestaande `<script>`-blok (voor regel 707). Geen externe libraries.

**Tech Stack:** Vanilla HTML/CSS/JS, Tailwind CDN (bestaand), IntersectionObserver API

---

## File Map

| Bestand | Actie | Regels |
|---|---|---|
| `index.html` | Modify — `<style>` blok | 56–65 |
| `index.html` | Replace — faciliteiten sectie HTML | 185–225 |
| `index.html` | Modify — `<script>` blok | vóór regel 707 |

---

## Task 1: CSS toevoegen aan `<style>` blok

**Files:**
- Modify: `index.html:56-65`

- [ ] **Stap 1: Voeg CSS toe na regel 64** (na `.animate-bounce-y { ... }`)

Voeg het volgende in **na** `.animate-bounce-y { animation: bounce-y 2s infinite; }` en **voor** `</style>`:

```css
/* FACILITEITEN BENTO */
.fac-bento{display:flex;flex-direction:column;gap:12px;}
.fac-cards-row{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
@media(min-width:1024px){.fac-cards-row{grid-template-columns:repeat(4,1fr);}}
.fac-card-big{position:relative;height:340px;border-radius:4px;overflow:hidden;cursor:pointer;}
@media(max-width:767px){.fac-card-big{height:260px;}}
.fac-card-big .fac-photo{position:absolute;inset:0;transition:transform 500ms cubic-bezier(0.25,0.46,0.45,0.94);}
.fac-card-big:hover .fac-photo{transform:scale(1.04);}
.fac-card-small{position:relative;height:220px;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 300ms cubic-bezier(0.34,1.56,0.64,1),box-shadow 300ms ease;}
@media(max-width:767px){.fac-card-small{height:180px;}}
.fac-card-small:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(204,17,34,0.25),0 8px 16px rgba(0,0,0,0.4);}
.fac-card-small .fac-photo{position:absolute;inset:0;transition:transform 400ms cubic-bezier(0.25,0.46,0.45,0.94);}
.fac-card-small:hover .fac-photo{transform:scale(1.06);}
.fac-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.2) 60%,transparent 100%);}
.fac-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}
.fac-content-big{position:absolute;bottom:0;left:0;right:0;padding:28px 32px;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;z-index:1;}
@media(max-width:767px){.fac-content-big{flex-direction:column;align-items:flex-start;padding:20px;gap:12px;}}
.fac-content-small{position:absolute;bottom:0;left:0;right:0;padding:14px 16px;z-index:1;}
.fac-cta-big{flex-shrink:0;display:inline-flex;align-items:center;gap:8px;background:#CC1122;color:#fff;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;padding:10px 20px;border-radius:4px;text-decoration:none;white-space:nowrap;transition:background 200ms,transform 150ms;}
.fac-cta-big:hover{background:#e01428;transform:translateY(-1px);}
.fac-cta-big svg{transition:transform 200ms;}
.fac-cta-big:hover svg{transform:translateX(3px);}
.fac-cta-small{display:inline-flex;align-items:center;gap:5px;color:#CC1122;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;}
.fac-cta-small svg{transition:transform 200ms;}
.fac-card-small:hover .fac-cta-small svg{transform:translateX(3px);}
.fac-wipe{clip-path:inset(0 100% 0 0);transition:clip-path 600ms cubic-bezier(0.25,0.46,0.45,0.94);}
.fac-wipe.fac-visible{clip-path:inset(0 0% 0 0);}
.fac-fade-up{opacity:0;transform:translateY(24px);transition:opacity 500ms cubic-bezier(0.25,0.46,0.45,0.94) var(--fac-delay,0ms),transform 500ms cubic-bezier(0.25,0.46,0.45,0.94) var(--fac-delay,0ms);}
.fac-fade-up.fac-visible{opacity:1;transform:translateY(0);}
```

- [ ] **Stap 2: Verifieer — open `index.html` in editor, controleer dat CSS correct staat na `.animate-bounce-y` regel**

---

## Task 2: HTML vervangen — faciliteiten sectie

**Files:**
- Modify: `index.html:185-225`

- [ ] **Stap 1: Vervang de volledige faciliteiten-sectie (regels 185–225) door onderstaande HTML**

De oude sectie begint met `<!-- FACILITEITEN -->` op regel 185 en eindigt met `</section>` op regel 225. Vervang het geheel:

```html
    <!-- FACILITEITEN -->
<section id="faciliteiten" class="bg-anthracite py-24 lg:py-32 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="mb-16 reveal">
      <span class="font-poppins text-xs font-semibold tracking-widest uppercase text-usa-red mb-3 block">01 — Faciliteiten</span>
      <h2 class="font-montserrat font-bold text-off-white" style="font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.02em;">Alles wat je nodig hebt,<br />onder één dak.</h2>
    </div>

    <div class="fac-bento">

      <!-- GROTE KAART: Fitness & Kracht -->
      <div class="fac-card-big fac-wipe">
        <div class="fac-photo" style="background:linear-gradient(135deg,#200a0d 0%,#0d0f18 100%);">
          <div class="fac-ph"><span class="font-montserrat font-extrabold" style="font-size:8rem;color:rgba(255,255,255,0.04);letter-spacing:-0.05em;">1</span></div>
        </div>
        <div class="fac-overlay"></div>
        <div class="fac-content-big">
          <div>
            <span class="font-poppins text-usa-red" style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;display:block;margin-bottom:6px;">Featured</span>
            <h3 class="font-montserrat font-extrabold text-off-white" style="font-size:clamp(1.4rem,2.5vw,2rem);letter-spacing:-0.02em;margin-bottom:8px;">Fitness &amp; Kracht</h3>
            <p class="font-poppins" style="font-size:14px;line-height:1.65;color:rgba(245,244,240,0.65);max-width:420px;">Uitgebreide krachtzaal met moderne apparatuur voor elk niveau — van beginner tot gevorderde atleet.</p>
          </div>
          <a href="#" class="fac-cta-big font-poppins">
            Meer info
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- 4 KLEINE KAARTEN -->
      <div class="fac-cards-row">

        <div class="fac-card-small fac-fade-up" style="--fac-delay:0ms;">
          <div class="fac-photo" style="background:linear-gradient(135deg,#0a1a0f 0%,#0d1612 100%);">
            <div class="fac-ph"><span class="font-montserrat font-extrabold" style="font-size:5rem;color:rgba(255,255,255,0.04);letter-spacing:-0.05em;">2</span></div>
          </div>
          <div class="fac-overlay"></div>
          <div class="fac-content-small">
            <h3 class="font-montserrat font-bold text-off-white" style="font-size:14px;letter-spacing:0.01em;margin-bottom:4px;">Groepslessen</h3>
            <p class="font-poppins" style="font-size:11px;line-height:1.55;color:rgba(245,244,240,0.55);margin-bottom:10px;">Meer dan 60 lessen per week — van yoga tot HIIT en spinning.</p>
            <a href="#" class="fac-cta-small font-poppins">Meer info <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </div>
        </div>

        <div class="fac-card-small fac-fade-up" style="--fac-delay:80ms;">
          <div class="fac-photo" style="background:linear-gradient(135deg,#1a0d0d 0%,#160c0e 100%);">
            <div class="fac-ph"><span class="font-montserrat font-extrabold" style="font-size:5rem;color:rgba(255,255,255,0.04);letter-spacing:-0.05em;">3</span></div>
          </div>
          <div class="fac-overlay"></div>
          <div class="fac-content-small">
            <h3 class="font-montserrat font-bold text-off-white" style="font-size:14px;letter-spacing:0.01em;margin-bottom:4px;">Personal Training</h3>
            <p class="font-poppins" style="font-size:11px;line-height:1.55;color:rgba(245,244,240,0.55);margin-bottom:10px;">Persoonlijke begeleiding van gecertificeerde trainers op jouw doelen.</p>
            <a href="#" class="fac-cta-small font-poppins">Meer info <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </div>
        </div>

        <div class="fac-card-small fac-fade-up" style="--fac-delay:160ms;">
          <div class="fac-photo" style="background:linear-gradient(135deg,#0d0d1a 0%,#0c0c18 100%);">
            <div class="fac-ph"><span class="font-montserrat font-extrabold" style="font-size:5rem;color:rgba(255,255,255,0.04);letter-spacing:-0.05em;">4</span></div>
          </div>
          <div class="fac-overlay"></div>
          <div class="fac-content-small">
            <h3 class="font-montserrat font-bold text-off-white" style="font-size:14px;letter-spacing:0.01em;margin-bottom:4px;">Fysiotherapie</h3>
            <p class="font-poppins" style="font-size:11px;line-height:1.55;color:rgba(245,244,240,0.55);margin-bottom:10px;">Professionele fysiotherapeuten direct beschikbaar in ons centrum.</p>
            <a href="#" class="fac-cta-small font-poppins">Meer info <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </div>
        </div>

        <div class="fac-card-small fac-fade-up" style="--fac-delay:240ms;">
          <div class="fac-photo" style="background:linear-gradient(135deg,#1a1508 0%,#161108 100%);">
            <div class="fac-ph"><span class="font-montserrat font-extrabold" style="font-size:5rem;color:rgba(255,255,255,0.04);letter-spacing:-0.05em;">5</span></div>
          </div>
          <div class="fac-overlay"></div>
          <div class="fac-content-small">
            <h3 class="font-montserrat font-bold text-off-white" style="font-size:14px;letter-spacing:0.01em;margin-bottom:4px;">Zonnestudio</h3>
            <p class="font-poppins" style="font-size:11px;line-height:1.55;color:rgba(245,244,240,0.55);margin-bottom:10px;">Moderne zonnebanken voor een gezonde kleur het hele jaar door.</p>
            <a href="#" class="fac-cta-small font-poppins">Meer info <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </div>
        </div>

      </div><!-- /fac-cards-row -->
    </div><!-- /fac-bento -->
  </div>
</section>
```

- [ ] **Stap 2: Verifieer structuur** — controleer dat `<!-- GROEPSLESSEN -->` direct na `</section>` volgt op de volgende regel (geen extra lege regels vereist, maar de groepslessen-sectie moet intact zijn)

---

## Task 3: JavaScript — scroll-animaties toevoegen

**Files:**
- Modify: `index.html:703-706` (het `<script>` blok)

- [ ] **Stap 1: Voeg onderstaande JS toe direct vóór de sluitende `</script>` tag (na regel 706)**

De bestaande observer op regel 703–706 handelt `.reveal` af — die blijft staan. Voeg daarna toe:

```js
    // Faciliteiten — clip wipe op grote kaart
    const facWipeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fac-visible'); facWipeObs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    document.querySelectorAll('.fac-wipe').forEach(el => facWipeObs.observe(el));

    // Faciliteiten — staggered fade-up op kleine kaarten
    const facFadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fac-visible'); facFadeObs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    document.querySelectorAll('.fac-fade-up').forEach(el => facFadeObs.observe(el));
```

---

## Task 4: Visuele verificatie

**Files:**
- Read: `temporary screenshots/screenshot-N.png`

- [ ] **Stap 1: Start server** (als niet al actief)

```bash
node serve.mjs
```

- [ ] **Stap 2: Screenshot desktop**

```bash
node screenshot.mjs http://localhost:3000 fac-desktop
```

Lees `temporary screenshots/screenshot-N-fac-desktop.png`. Controleer:
- Grote kaart panorama bovenaan, volle breedte
- 4 kleine kaarten in rij eronder (desktop) / 2×2 (mobile)
- Tekst + "Meer info" knop/link zichtbaar op elke kaart
- Donkere gradient overlay op elke kaart zodat tekst leesbaar is

- [ ] **Stap 3: Screenshot mobile** (375px viewport)

```bash
node screenshot.mjs http://localhost:3000/index.html?viewport=375 fac-mobile
```

Of pas `screenshot.mjs` aan voor 375px breedte. Controleer: kleine kaarten 2×2 op mobile, grote kaart correct hoogte.

- [ ] **Stap 4: Scroll-animatie checken** — open `http://localhost:3000` in browser, scroll naar faciliteiten-sectie. Verifieer:
  - Grote kaart wipe van links naar rechts
  - 4 kleine kaarten fade-up met zichtbare stagger (kaart 4 start ~240ms later dan kaart 1)
  - Hover op kleine kaart: lift + rode glow zichtbaar
  - Hover op grote kaart: foto zoomt subtiel in

- [ ] **Stap 5: Commit**

```bash
git add index.html
git commit -m "feat: redesign faciliteiten section — bento grid with photo cards, clip-wipe + stagger animations, hover lift glow"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Layout: panorama top + 4 onderaan — Task 2
- ✅ Foto-placeholders met nummers — Task 2 (`.fac-ph` span per kaart)
- ✅ Overlay gradient — Task 1 (`.fac-overlay`) + Task 2
- ✅ Clip wipe op grote kaart — Task 1 (`.fac-wipe`) + Task 3
- ✅ Staggered fade-up kleine kaarten — Task 1 (`.fac-fade-up`) + Task 3
- ✅ Hover lift + rode glow — Task 1 (`.fac-card-small:hover`)
- ✅ Hover foto zoom groot + klein — Task 1
- ✅ CTA button grote kaart (rood, volledig) — Task 2
- ✅ CTA link kleine kaarten (rood tekst) — Task 2
- ✅ Naam + omschrijving op alle kaarten — Task 2
- ✅ Mobile: 2×2 grid kleine kaarten — Task 1 (`@media`)
- ✅ Geen `transition-all` — alle transitions expliciet
- ✅ Cardio verwijderd — niet aanwezig in Task 2 HTML
- ✅ Visuele verificatie — Task 4
