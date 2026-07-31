# Handoff — EDS Block Lab

Context for resuming the Adobe Edge Delivery Services (EDS) block-development lab on another machine.
This file is ignored by `.hlxignore` (`*.md`), so it is never served on the edge. Delete it anytime.

## What this is

A local learning sandbox built on Adobe `aem-boilerplate` with progressive block exercises (A–E) in
`LEARNING-GUIDE.md`. Runs entirely locally — no AEM Cloud account needed.

## Run it

```bash
npm install
npm run start:lab   # → http://localhost:3000/drafts/
```

`start:lab` = `aem up --no-open --forward-browser-logs --html-folder drafts`.

## Most important gotcha (don't relearn this)

Local draft fixtures **must** be named `<name>.plain.html` and contain **only the inner content
fragment** (the `div > div` section markup — no `<!doctype>/html/head/body`).

The AEM CLI's `--html-folder` only injects the `head.html` EDS bootstrap (`aem.js` / `scripts.js` /
`styles.css`) when it **wraps a `.plain.html` fragment**. A `.html` file — full document *or* fragment —
is served **raw** with no runtime, so `decorate()` never runs and blocks render undecorated.

`LEARNING-GUIDE.md` (lines ~112 / ~164) tells you to open `drafts/index.html`; that instruction is wrong
against the current CLI. Load fixtures at `/drafts/` or `/drafts/<name>` (no extension) instead.

## State as of this handoff

Working tree changes (see the latest commit on `main`):

- `drafts/index.html` → **replaced** by `drafts/index.plain.html` (fragment form, so decoration runs).
- `blocks/hello-world/hello-world.js` — Exercise A: the decorator now appends ` →` to the CTA link via
  `link.insertAdjacentText('beforeend', ' →')` (in addition to adding `button primary`).
- Content in the hello-world block was edited (eyebrow `Getting Started`, title `Editing the default content`).

`drafts/index.plain.html` already contains three blocks to work with: `.hello-world`, `.cards-lab`,
`.ceros-demo`.

Verified: `/drafts/` now serves a wrapped EDS page (bootstrap present) and the hello-world block decorates.
`npm run lint` passes on the edited block.

## Next steps (pick up here)

1. **Exercise A refinement** — move the CTA arrow from JS to CSS. Replace the `insertAdjacentText` line with
   a rule in `blocks/hello-world/hello-world.css`:
   ```css
   .hello-world-action .button.primary::after { content: ' →'; }
   ```
   Lesson: JS decorator = structure/behavior; CSS = pure decoration (better for a11y — `::after` glyphs
   aren't announced by screen readers).

2. **Exercise B — `cards-lab`** (`blocks/cards-lab/`): turn the repeating rows in `.cards-lab` into cards
   with a **defensive** `decorate()` that survives authors adding/removing/reordering rows. This is the most
   representative of real block work. See `LEARNING-GUIDE.md`.

3. Later: Exercise C (`ceros-demo`, third-party boundary), D (block options), E (auto-blocking).

## Suggested skills

If the Matt Pocock skill set is installed in the working directory (it lives outside this repo, so it may
not be present on every machine):

- `/tdd` — build a block behavior test-first (good fit for the defensive `cards-lab` decorator).
- `/code-review` — review the diff before committing.
- `/implement` — for a fuller ticketed build.

If those skills aren't installed, this document stands on its own — just follow the Next steps.

## Reference

- `AGENTS.md` — Adobe EDS project conventions (block anatomy, code style, deployment).
- `LEARNING-GUIDE.md` — the exercises (A–E). Note the `.plain.html` correction above.
- Edge (after push): preview `https://main--eds-block-lab--victortolbert.aem.page/drafts/`,
  live `https://main--eds-block-lab--victortolbert.aem.live/drafts/`.
