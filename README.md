# EDS Block Lab

A hands-on Adobe Experience Manager Edge Delivery Services sandbox. It starts
from Adobe's official `aem-boilerplate` and adds local content fixtures,
progressive block exercises, Universal Editor examples, and a small test suite.

The sandbox does not require an AEM Cloud account for the local lessons.

## Quick start

Prerequisites: a current Node.js LTS release and npm. Node 22.22+ is the safest
choice with the current AEM CLI dependency set.

```bash
npm install
npm run start:lab
```

Open <http://localhost:3000/drafts/>. The command tells the AEM CLI to use `drafts/`
as the content source while loading code from this working directory.

Useful commands:

```bash
npm run lint
npm test
npm run start:lab
```

## What to open first

1. Read [`LEARNING-GUIDE.md`](./LEARNING-GUIDE.md).
2. Compare [`drafts/index.html`](./drafts/index.html) with the browser DOM.
3. Change [`blocks/hello-world/hello-world.js`](./blocks/hello-world/hello-world.js).
4. Add a row to the authored `cards-lab` block in `drafts/index.html`.
5. Break and repair the Ceros-style URL in the third-party embed example.
6. Inspect the `_*.json` files inside each block to see how the same fields are
   exposed in Universal Editor/XWalk.

## Sandbox map

```text
drafts/                  Local stand-in for authored content
blocks/                  Independently loaded block CSS and JavaScript
  hello-world/           Smallest useful block
  cards-lab/             Repeating rows and defensive decoration
  ceros-demo/            Third-party embed boundary and URL validation
scripts/                 Page lifecycle and shared AEM runtime helpers
styles/                  Global/eager/lazy styles
test/                    Fast logic tests
LEARNING-GUIDE.md        Architecture, workflow, exercises, and testing
```

## Moving from the lab to a real EDS project

For document authoring, create a repository from Adobe's `aem-boilerplate`,
connect the repository and content source, install AEM Code Sync, then copy a
finished block into `blocks/`.

For AEM authoring with Universal Editor, start from the XWalk boilerplate. Copy
the block and adapt its `_block-name.json` fragment into that repository's
generated `component-models.json`, `component-definition.json`, and
`component-filters.json` flow.

Do not copy `drafts/` into production content. It exists only to make this lab
self-contained.

## Origin

Based on Adobe's public `aem-boilerplate`, licensed under Apache License 2.0.
