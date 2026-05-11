# Dagpas Modal Animation Design

**Date:** 2026-05-11
**File:** `index.html` (single file, all inline)

## Summary

Add open/close animation to the `#dagpas-modal` popup. Currently it appears/disappears instantly via `hidden` class toggle. Replace with a two-phase CSS transition system controlled by JS helper functions.

## Animation Spec

### Open — Spotlight + Spring

Two layers animate in sequence:

| Layer | From | To | Duration | Easing | Delay |
|---|---|---|---|---|---|
| Backdrop background | `rgba(0,0,0,0)` | `rgba(0,0,0,0.85)` | 500ms | ease | 0ms |
| Backdrop blur | `blur(0px)` | `blur(8px)` | 500ms | ease | 0ms |
| Modal card scale | `scale(0.7)` | `scale(1)` | 500ms | `cubic-bezier(0.34,1.56,0.64,1)` | 150ms |
| Modal card Y | `translateY(20px)` | `translateY(0)` | 500ms | `cubic-bezier(0.34,1.56,0.64,1)` | 150ms |
| Modal card opacity | `0` | `1` | 350ms | ease | 150ms |

### Close — Quick Fade

All elements fade to `opacity: 0` in 200ms ease simultaneously. After 200ms the `hidden` class is restored.

## CSS Classes

| Class | Purpose |
|---|---|
| `is-open` | Full visibility, `pointer-events: auto` |
| `is-closing` | Overrides transition to 200ms, sets opacity 0 |

Default state (neither class): invisible, `pointer-events: none`. `hidden` in HTML prevents flash on load.

## JS API

```js
openModal()   // remove hidden → reflow → add is-open
closeModal()  // remove is-open → add is-closing → 220ms → hidden + remove is-closing
```

All existing `onclick` handlers updated:
- `classList.remove('hidden')` → `openModal()`
- `classList.add('hidden')` → `closeModal()`
- Escape key handler → `closeModal()`

## Scope

Single file: `index.html`
- Add CSS rules to existing `<style>` block
- Add `openModal()` / `closeModal()` functions to existing `<script>` block
- Update ~8 inline `onclick` attributes
- Add class `modal-backdrop` to backdrop div, `modal-card` to inner panel (for CSS targeting)

## Out of Scope

- Button entrance animation (pulse/glow before click)
- Form submit animation
- Mobile-specific variants
