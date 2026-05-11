# Faciliteiten Sectie Redesign

## Overzicht

Vervangt het huidige 3×2 kaartjesraster door een dynamische bento-grid met foto-achtergronden, scroll-animaties en hover-effecten. Doel: meer visuele impact, premiumgevoel en klikbare CTA per faciliteit (voorbereiding op aparte detailpagina's).

---

## Layout

**Desktop (lg+):**
- Rij 1: Één grote panoramakaart — Fitness & Kracht (volle breedte, ~340px hoog)
- Rij 2: Vier gelijke kleinere kaarten naast elkaar (grid-template-columns: repeat(4, 1fr), ~220px hoog)
- Gap: 12px tussen alle kaarten

**Mobile:**
- Grote kaart: volle breedte, ~280px hoog
- Kleine kaarten: 2×2 grid (grid-template-columns: repeat(2, 1fr))

**Faciliteiten (Cardio verwijderd):**
1. Fitness & Kracht — grote kaart, foto placeholder `1`
2. Groepslessen — kleine kaart, foto placeholder `2`
3. Personal Training — kleine kaart, foto placeholder `3`
4. Fysiotherapie — kleine kaart, foto placeholder `4`
5. Zonnestudio — kleine kaart, foto placeholder `5`

---

## Foto-achtergronden

Elke kaart heeft een `background-image` achtergrond. Nu: genummerde placeholders (groot cijfer + gradient tint per kaart). Later vervangen door echte foto's.

Overlay per kaart: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)` zodat tekst altijd leesbaar is.

Foto-element heeft eigen wrapper voor de zoom-animatie (transform op inner div, niet op card zelf).

---

## Scroll-animaties (IntersectionObserver)

**Grote kaart — Clip wipe reveal:**
- Initieel: `clip-path: inset(0 100% 0 0)`
- Getriggerd: `clip-path: inset(0 0% 0 0)`
- Duur: 600ms, easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Foto zoomt gelijktijdig van scale(1.08) naar scale(1.0)

**Kleine kaarten — Staggered fade-up:**
- Initieel: `opacity: 0; transform: translateY(24px)`
- Getriggerd: `opacity: 1; transform: translateY(0)`
- Duur: 500ms, easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Stagger delays: kaart 1 = 0ms, kaart 2 = 80ms, kaart 3 = 160ms, kaart 4 = 240ms

Trigger: `rootMargin: '0px 0px -80px 0px'`, `threshold: 0.1`. Animatie eenmalig (observer disconnect na trigger).

Geen `transition-all` — alleen `transform`, `opacity`, `clip-path`, `box-shadow`.

---

## Hover-effecten

**Kleine kaarten:**
- `transform: translateY(-6px)` — spring-easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`, 300ms
- `box-shadow: 0 20px 40px rgba(204,17,34,0.25), 0 8px 16px rgba(0,0,0,0.4)`
- Foto inner wrapper: `scale(1.06)`, 400ms smooth

**Grote kaart:**
- Foto inner wrapper: `scale(1.04)`, 500ms smooth
- Geen translateY (te groot voor panoramakaart)

---

## Kaart-inhoud

**Grote kaart (Fitness & Kracht):**
- Eyebrow label: `"Featured"` in usa-red
- H3: naam faciliteit
- Paragraaf: korte omschrijving (~1 zin)
- CTA: rode button rechtsonder — `"Meer info →"` — `href="#"` (later eigen pagina)

**Kleine kaarten (×4):**
- H3: naam faciliteit
- Paragraaf: korte omschrijving (~1 zin)
- CTA: rode tekst-link onderaan — `"Meer info →"` — `href="#"` (later eigen pagina)

Tekst altijd onderaan via `position: absolute; bottom: 0`.

---

## Technische constraints

- Geen `transition-all`
- Geen externe libraries — vanilla JS IntersectionObserver
- Alle animaties op `transform`, `opacity`, `clip-path`, `box-shadow`
- Bestaande `reveal`-class systeem van de site mag hergebruikt worden voor de stagger, maar clip-wipe vereist eigen klasse
- Sectie-achtergrond blijft `bg-anthracite` (#1a1a1d)
- Border-radius: `rounded-sm` (4px) consistent met rest van de site

---

## Out of scope

- Aparte detailpagina's per faciliteit (later)
- Echte foto's (nu placeholders)
- Cardio faciliteit (verwijderd op verzoek)
