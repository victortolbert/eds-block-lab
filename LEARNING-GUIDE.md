# Learning Edge Delivery Services by Building Blocks

## 1. The mental model

An EDS page is the result of two independently changing inputs:

```text
authored content -> semantic HTML ----+
                                      +-> browser -> decorated page
Git branch code -> CSS + JavaScript --+
```

The content does not contain a React component tree. It contains headings,
paragraphs, links, pictures, sections, and table-like block structures. EDS
turns the authored source into semantic HTML. Your browser receives that HTML,
then the project code progressively decorates it.

This separation is why a developer can run local, uncommitted code against
preview content and why an author can change content without rebuilding the
site.

## 2. The major pieces

| Piece | Responsibility | Typical owner |
| --- | --- | --- |
| Content source | Stores author-created page content | Authors/content team |
| Document Authoring or Universal Editor | Editing experience | Authors |
| AEM preview/publish | Converts and promotes authored content | AEM/EDS |
| Git repository | Stores CSS, JavaScript, icons, fonts, and config | Developers |
| AEM Code Sync | Makes Git branches available to EDS | Platform |
| `.aem.page` | Preview content and branch code | QA/developers |
| `.aem.live` | Published content and production code | Visitors |
| AEM CLI (`aem up`) | Local code plus preview or fixture content | Developers |
| CDN | Edge caching and final delivery | Platform/operations |

There are two common authoring paths:

### Document authoring

Authors work in documents and spreadsheets. A block is represented as a table:
the first row names the block and the remaining rows supply its cells. Sidekick
previews and publishes the document.

### AEM authoring with Universal Editor (XWalk)

Authors use an in-context UI backed by AEM. Developers declare block fields in
JSON models, register blocks with definitions, and control allowed placement
with filters. AEM still emits the table-like semantic block structure expected
by EDS. The front-end block JavaScript is fundamentally the same.

The `_*.json` files in this lab illustrate the model/definition/filter side but
are not compiled here because the lab does not require an AEM author service.

## 3. What a block really is

A block is three contracts:

1. **Authoring contract:** what rows/columns or fields an author supplies.
2. **Markup contract:** the predictable HTML EDS delivers from that content.
3. **Decoration contract:** CSS and JavaScript that turn it into the experience.

For a block named `cards-lab`, EDS automatically requests:

```text
/blocks/cards-lab/cards-lab.css
/blocks/cards-lab/cards-lab.js
```

The JavaScript exports one default function:

```js
export default function decorate(block) {
  // Read the initial authored DOM.
  // Validate missing or malformed content.
  // Transform it into semantic, accessible UI.
  // Attach only the behavior this block needs.
}
```

Blocks should be independently loadable, responsive, accessible, defensive
against incomplete author input, and small enough to protect Core Web Vitals.

## 4. The page lifecycle

The boilerplate uses three loading phases:

- **Eager:** decorate the page and load the first section needed for LCP.
- **Lazy:** load the remaining sections, header, footer, and below-fold styles.
- **Delayed:** load martech or other work that can wait.

Blocks are code-split by folder. A page that does not contain `ceros-demo`
does not request that block's JavaScript or CSS.

Place code according to scope:

| Need | Location |
| --- | --- |
| Behavior specific to one block | `blocks/name/name.js` |
| Styles specific to one block | `blocks/name/name.css` |
| Critical global styles | `styles/styles.css` |
| Below-fold global styles | `styles/lazy-styles.css` |
| Page-wide decoration/auto-blocking | `scripts/scripts.js` |
| Martech/nonessential integration | `scripts/delayed.js` |
| Metadata or third-party head tags | `head.html` |

Avoid editing `scripts/aem.js`; treat it as upstream runtime plumbing.

## 5. Work through the lab

### Exercise A: smallest block

Open the `hello-world` source in `drafts/index.html`, then inspect its decorator.
Change the eyebrow, title, or call-to-action. Notice that the content shape stays
simple while the JavaScript adds semantic classes.

### Exercise B: repeating content

Add, remove, and reorder rows in `cards-lab`. Then temporarily remove a link or
description. The decorator should not crash. This is the practical meaning of
an author/developer contract: the happy path is consistent, but real authors
will leave fields blank.

### Exercise C: third-party integration

The `ceros-demo` block deliberately renders a local mock instead of contacting
Ceros. Switch its mode between `mock` and `embed`. Embed mode rejects non-HTTPS
URLs and hosts outside the allowlist. This is the boundary an EDS-native Ceros
block would own; the OSGi/Sling implementation from the classic AEM connector
cannot execute in the EDS browser runtime.

### Exercise D: block option

Add `compact` to a block's authored name (`Cards Lab (compact)`) in a real
document-authoring table or use a protected `classes` field in an XWalk model.
EDS applies it as an additional class, allowing the same content contract to
support a presentational variant.

### Exercise E: auto-blocking

Study `buildWidgetAutoBlocks()` in `scripts/scripts.js`. It recognizes a normal
authored link whose path contains `/widgets/` and converts it into a `widget`
block. Auto-blocking is useful when explicit block authoring would be awkward,
but it should be based on an unambiguous content pattern.

## 6. Daily development workflow

```text
1. Agree on the authoring shape.
2. Create representative preview content or a fixture.
3. Run aem up with local code.
4. Inspect the undecorated/plain HTML.
5. Implement defensive decoration and scoped CSS.
6. Lint and run fast tests.
7. Push a feature branch.
8. Validate branch code on the .aem.page URL.
9. Check accessibility, responsive behavior, and performance.
10. Merge; publish content separately when it is approved.
```

Useful inspection URLs while the CLI is running:

```text
http://localhost:3000/drafts/
http://localhost:3000/drafts/index.html
```

In a connected project, the local proxy uses preview content but serves code
from your working directory. In this lab, `--html-folder drafts` exposes local
fixtures under `/drafts/`. Plain HTML and Markdown inspection endpoints apply
to content coming through the connected EDS backend; the fixture itself is
already the initial HTML, so inspect `drafts/index.html` directly.

## 7. Testing strategy

Use layers rather than attempting to test everything through a browser:

| Layer | Test | Example |
| --- | --- | --- |
| Pure logic | Node unit test | URL normalization/allowlisting |
| Block DOM | Component-level browser test | Missing row does not throw |
| Page integration | Local AEM CLI | Correct block CSS/JS is requested |
| Branch integration | Feature `.aem.page` | Real preview content and third parties |
| Quality | axe/Lighthouse/PSI | Accessibility and Core Web Vitals |
| Production smoke | `.aem.live` | Publishing, CDN, analytics, consent |

Third-party integrations need tests for timeout/failure states, content security
policy, cookie consent, responsive sizing, keyboard behavior, analytics,
deep-links, and performance impact. Mock them locally for speed; retain a small
live smoke test on preview.

## 8. Common mistakes

- Treating a block as a framework component before defining its authoring shape.
- Coding against the final DOM instead of the delivered/plain DOM.
- Putting every behavior in `scripts.js` instead of lazy-loading a block.
- Assuming all author fields and rows exist.
- Loading below-fold libraries during the eager phase.
- Shipping secrets: EDS front-end code is public and client-side.
- Expecting classic AEM OSGi, Sling Models, HTL, or servlets to run at the edge.
- Testing only localhost and never the branch preview URL.
- Using an iframe without planning consent, CSP, accessibility, and height.

## 9. When you connect Universal Editor

For each block:

1. Define editable fields in `models`.
2. Register it in `definitions` using the generic Franklin block resource type.
3. Add it to an appropriate container `filter`.
4. Compile the fragments using the XWalk project's tooling.
5. Commit and push the branch.
6. Point Universal Editor at that branch and author test content.

The Universal Editor JSON controls authoring and persistence. The block's
JavaScript and CSS still control the visitor experience.

## 10. Suggested next builds

1. Add a hero block and optimize its image as the LCP candidate.
2. Add a tabs pattern using an author-friendly section model.
3. Build a fragment-backed global promo.
4. Add metadata-driven theming.
5. Replace the Ceros mock with a real Ceros embed only after confirming the
   approved hosts, CSP, consent, analytics, and performance budget.
