# Dagpas Modal Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace instant `hidden`-toggle on `#dagpas-modal` with a Spotlight open animation (backdrop sweeps to dark blur, modal springs in) and a quick-fade close animation.

**Architecture:** Pure CSS transitions controlled by JS class toggles. `openModal()` removes `hidden`, waits one frame, adds `is-open`. `closeModal()` removes `is-open`, adds `is-closing`, after 220ms restores `hidden`. No new dependencies.

**Tech Stack:** Vanilla JS, CSS transitions, single `index.html`

---

### Task 1: Add CSS animation rules

**Files:**
- Modify: `index.html:95-96` (insert before closing `</style>` tag)

- [ ] **Step 1: Add CSS rules before `</style>` on line 96**

Find the exact string at the end of the style block (line 95-96):
```
    .fac-fade-up.fac-visible{opacity:1;transform:translateY(0);}
  </style>
```

Replace with:
```
    .fac-fade-up.fac-visible{opacity:1;transform:translateY(0);}

    /* Modal animation */
    #dagpas-modal{pointer-events:none;}
    #dagpas-modal.is-open{pointer-events:auto;}
    #dagpas-modal .modal-backdrop{
      background:rgba(0,0,0,0);
      backdrop-filter:blur(0px);
      transition:background 500ms ease,backdrop-filter 500ms ease;
    }
    #dagpas-modal.is-open .modal-backdrop{
      background:rgba(0,0,0,0.85);
      backdrop-filter:blur(8px);
    }
    #dagpas-modal.is-closing .modal-backdrop{
      transition:background 200ms ease,backdrop-filter 200ms ease;
      background:rgba(0,0,0,0);
      backdrop-filter:blur(0px);
    }
    #dagpas-modal .modal-card{
      transform:scale(0.7) translateY(20px);
      opacity:0;
      transition:transform 500ms cubic-bezier(0.34,1.56,0.64,1) 150ms,
                 opacity 350ms ease 150ms;
    }
    #dagpas-modal.is-open .modal-card{
      transform:scale(1) translateY(0);
      opacity:1;
    }
    #dagpas-modal.is-closing .modal-card{
      transition:opacity 200ms ease,transform 200ms ease;
      opacity:0;
      transform:scale(0.95);
    }
  </style>
```

- [ ] **Step 2: Ensure server is running**

```bash
node serve.mjs
```

If already running, skip. Server serves at `http://localhost:3000`.

- [ ] **Step 3: Screenshot — verify modal hidden on load**

```bash
node screenshot.mjs http://localhost:3000 task1-css
```

Read `temporary screenshots/screenshot-N-task1-css.png`. Modal must NOT be visible. Page should look identical to before.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: add modal animation CSS (spotlight open, quick-fade close)"
```

---

### Task 2: Update modal HTML structure

**Files:**
- Modify: `index.html:697-703` (modal wrapper, backdrop div, card div, close button)

- [ ] **Step 1: Add `modal-backdrop` class to backdrop div and remove conflicting Tailwind classes**

Find (line 698):
```
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('dagpas-modal').classList.add('hidden')"></div>
```

Replace with (remove `bg-black/70 backdrop-blur-sm`, add `modal-backdrop`, keep onclick for now):
```
  <div class="modal-backdrop absolute inset-0" onclick="document.getElementById('dagpas-modal').classList.add('hidden')"></div>
```

- [ ] **Step 2: Add `modal-card` class to the inner panel div**

Find (line 699):
```
  <div class="relative bg-surface rounded-sm shadow-card w-full max-w-lg p-8 z-10">
```

Replace with:
```
  <div class="modal-card relative bg-surface rounded-sm shadow-card w-full max-w-lg p-8 z-10">
```

- [ ] **Step 3: Screenshot — verify modal still hidden on load**

```bash
node screenshot.mjs http://localhost:3000 task2-html
```

Read image. Page must look identical to before. No modal visible.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "refactor: add modal-backdrop and modal-card classes to dagpas modal"
```

---

### Task 3: Add `openModal()` and `closeModal()` JS functions

**Files:**
- Modify: `index.html:765-773` (existing `<script>` block)

- [ ] **Step 1: Add functions at top of script block**

Find (line 765-766):
```
  <script>
    function handleDagpasSubmit(e) {
```

Replace with:
```
  <script>
    function openModal() {
      const m = document.getElementById('dagpas-modal');
      m.classList.remove('hidden', 'is-closing');
      requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('is-open')));
    }
    function closeModal() {
      const m = document.getElementById('dagpas-modal');
      m.classList.remove('is-open');
      m.classList.add('is-closing');
      setTimeout(() => {
        m.classList.add('hidden');
        m.classList.remove('is-closing');
      }, 220);
    }
    function handleDagpasSubmit(e) {
```

- [ ] **Step 2: Verify functions exist in browser console**

```bash
node screenshot.mjs http://localhost:3000 task3-js
```

Read image. Page must look identical. If you can verify via browser devtools: open console, type `openModal()` — modal should open with animation.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add openModal/closeModal animation functions"
```

---

### Task 4: Replace all open handlers with `openModal()`

There are 10 open handlers to update. All replace `document.getElementById('dagpas-modal').classList.remove('hidden')` with `openModal()`.

**Files:**
- Modify: `index.html` lines 113, 130, 161, 363, 387, 416, 441, 450, 630, 677

- [ ] **Step 1: Update nav "Word lid" button (line 113)**

Find:
```
        <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
          class="hidden lg:inline-flex items-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer">
          Word lid
        </button>
```

Replace:
```
        <button onclick="openModal()"
          class="hidden lg:inline-flex items-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer">
          Word lid
        </button>
```

- [ ] **Step 2: Update mobile menu "Gratis dagpas" button (line 130)**

Find:
```
      <button onclick="document.getElementById('mobile-menu').classList.add('hidden'); document.getElementById('dagpas-modal').classList.remove('hidden')"
        class="bg-usa-red text-white font-poppins font-semibold text-lg px-8 py-3 rounded-sm shadow-red cursor-pointer">
        Gratis dagpas
      </button>
```

Replace:
```
      <button onclick="document.getElementById('mobile-menu').classList.add('hidden'); openModal()"
        class="bg-usa-red text-white font-poppins font-semibold text-lg px-8 py-3 rounded-sm shadow-red cursor-pointer">
        Gratis dagpas
      </button>
```

- [ ] **Step 3: Update hero "Probeer gratis dagpas" button (line 161)**

Find:
```
      <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
        class="inline-flex items-center justify-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold px-8 py-4 rounded-sm shadow-red cursor-pointer transition-colors duration-200"
        style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
        onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
        Probeer gratis dagpas
```

Replace `onclick` attribute only:
```
      <button onclick="openModal()"
        class="inline-flex items-center justify-center gap-2 bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold px-8 py-4 rounded-sm shadow-red cursor-pointer transition-colors duration-200"
        style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
        onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
        Probeer gratis dagpas
```

- [ ] **Step 4: Update pricing card 1 "Nu inschrijven" (line 363)**

Find:
```
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness tot 24 jaar -->
```

Replace onclick only:
```
          <button onclick="openModal()" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness tot 24 jaar -->
```

- [ ] **Step 5: Update pricing card 2 "Nu inschrijven" (line 387)**

Find:
```
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness vanaf 24 jaar (MEEST GEKOZEN) -->
```

Replace onclick only:
```
          <button onclick="openModal()" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

      <!-- Fitness vanaf 24 jaar (MEEST GEKOZEN) -->
```

- [ ] **Step 6: Update pricing card 3 red "Nu inschrijven" (line 416)**

Find:
```
            <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer w-full">
              Nu inschrijven
            </button>
```

Replace:
```
            <button onclick="openModal()" class="inline-flex items-center justify-center bg-usa-red hover:bg-usa-red-dark text-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm shadow-red transition-colors duration-200 cursor-pointer w-full">
              Nu inschrijven
            </button>
```

- [ ] **Step 7: Update pricing card 4 "Nu inschrijven" (line 441)**

Find:
```
          <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

    </div>

    <p class="text-center font-poppins text-muted text-sm mt-10">
```

Replace:
```
          <button onclick="openModal()" class="inline-flex items-center justify-center border border-off-white/25 hover:border-off-white hover:bg-off-white hover:text-anthracite text-off-white font-poppins font-semibold text-sm px-4 py-2.5 rounded-sm transition-[border-color,background-color,color] duration-200 cursor-pointer w-full">
            Nu inschrijven
          </button>
        </div>
      </div>

    </div>

    <p class="text-center font-poppins text-muted text-sm mt-10">
```

- [ ] **Step 8: Update inline "Probeer een gratis dagpas" link (line 450)**

Find:
```
      Wil je eerst proberen? <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="text-off-white underline underline-offset-2 hover:text-usa-red transition-colors duration-200 cursor-pointer">Probeer een gratis dagpas</button>
```

Replace:
```
      Wil je eerst proberen? <button onclick="openModal()" class="text-off-white underline underline-offset-2 hover:text-usa-red transition-colors duration-200 cursor-pointer">Probeer een gratis dagpas</button>
```

- [ ] **Step 9: Update CTA section "Start gratis dagpas" (line 630)**

Find:
```
    <button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')"
      class="inline-flex items-center gap-2 bg-white hover:bg-off-white text-anthracite font-poppins font-semibold px-8 py-4 rounded-sm cursor-pointer transition-colors duration-200"
      style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
      onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      Start gratis dagpas
```

Replace:
```
    <button onclick="openModal()"
      class="inline-flex items-center gap-2 bg-white hover:bg-off-white text-anthracite font-poppins font-semibold px-8 py-4 rounded-sm cursor-pointer transition-colors duration-200"
      style="transition:transform 200ms ease-out,background-color 200ms ease-out;"
      onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      Start gratis dagpas
```

- [ ] **Step 10: Update footer "Gratis dagpas" button (line 677)**

Find:
```
          <li><button onclick="document.getElementById('dagpas-modal').classList.remove('hidden')" class="font-poppins text-usa-red hover:text-off-white text-sm transition-colors duration-200 cursor-pointer text-left">Gratis dagpas</button></li>
```

Replace:
```
          <li><button onclick="openModal()" class="font-poppins text-usa-red hover:text-off-white text-sm transition-colors duration-200 cursor-pointer text-left">Gratis dagpas</button></li>
```

- [ ] **Step 11: Screenshot — open animation working**

```bash
node screenshot.mjs http://localhost:3000 task4-open
```

Read image. Page still loads normally. Then in browser: click "Probeer gratis dagpas" hero button — modal should animate open with spotlight effect (backdrop sweeps dark, card springs in).

- [ ] **Step 12: Commit**

```bash
git add index.html
git commit -m "feat: wire all dagpas open handlers to openModal()"
```

---

### Task 5: Replace all close handlers with `closeModal()`

**Files:**
- Modify: `index.html:698, 700-703, 772`

- [ ] **Step 1: Update backdrop onclick (line 698)**

Find (already updated in Task 2 Step 1, the backdrop now reads):
```
  <div class="modal-backdrop absolute inset-0" onclick="document.getElementById('dagpas-modal').classList.add('hidden')"></div>
```

Replace:
```
  <div class="modal-backdrop absolute inset-0" onclick="closeModal()"></div>
```

- [ ] **Step 2: Update close X button onclick (line 700)**

Find:
```
    <button onclick="document.getElementById('dagpas-modal').classList.add('hidden')"
      class="absolute top-4 right-4 text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
      aria-label="Sluit">
```

Replace:
```
    <button onclick="closeModal()"
      class="absolute top-4 right-4 text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
      aria-label="Sluit">
```

- [ ] **Step 3: Update Escape key handler (line 772)**

Find:
```
      if (e.key === 'Escape') document.getElementById('dagpas-modal').classList.add('hidden');
```

Replace:
```
      if (e.key === 'Escape') closeModal();
```

- [ ] **Step 4: Screenshot — full open + close cycle**

```bash
node screenshot.mjs http://localhost:3000 task5-final
```

Read image. Test in browser:
1. Click "Probeer gratis dagpas" — modal opens with spotlight animation
2. Click X button — modal fades out in 200ms
3. Click backdrop — modal fades out in 200ms
4. Press Escape — modal fades out in 200ms
5. Reopen — animation plays again correctly

- [ ] **Step 5: Final commit**

```bash
git add index.html
git commit -m "feat: wire all dagpas close handlers to closeModal()"
```
