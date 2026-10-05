# Aurevia Private Medical

A fictional private medical practice in Marylebone, designed and built as an agency portfolio project.
The brief: private healthcare that feels like hospitality rather than a hospital, where trust comes from clarity, not claims.

> **Concept notice.** Aurevia is not a real healthcare provider. Clinicians, fees, rooms and the address are invented.
> Specialists are shown as typographic plates rather than photographs of real people, and no qualifications are claimed.
> The site ships with `noindex` so it never presents itself to search engines as a real clinic (see *Indexing*).

---

## Quick start

```bash
npm install
npm run build      # → dist/
npm run serve      # http://localhost:4321  (clean URLs + custom 404, like Cloudflare Pages)
npm run dev        # rebuild on change to src/, content/ or public/
```

Requires Node 20 or later. There are no runtime dependencies. The build uses Tailwind CSS (via its CLI) and `marked` (for article Markdown).

## Architecture

```
content/                 ← everything an editor can change (Decap CMS writes here)
  settings/site.json       contact details, hours, form key, indexing switch, concept notice
  settings/home.json       homepage copy: hero, position, journey, house, FAQs, closing
  settings/practice.json   The Practice page
  settings/image-credits.json  photographer credits and dominant colours for image placeholders
  care/*.json              six areas of care (fees, inclusions, process, FAQs)
  specialists/*.json       nine fictional clinicians
  journal/*.md             articles, Decap "json-frontmatter" (JSON head + Markdown body)
src/
  templates/helpers.mjs    escaping, *accent* markup, responsive <img>, brand mark, icons
  templates/components.mjs eyebrow, buttons, specialist plate, cards, FAQ, closing CTA …
  templates/layout.mjs     <head> (SEO/OG/JSON-LD), header, full-screen menu, footer, mobile action bar
  pages/*.mjs              one module per page type; each returns [{ path, html }]
  pages/schema.mjs         JSON-LD builders (MedicalClinic, Physician, Article, FAQPage, BreadcrumbList)
  styles/main.css          Tailwind v4 entry: design tokens (@theme) + component layer
  js/main.js               entry: core behaviour + lazy page modules
  js/modules/*.js          header, reveal, care-browser, journey, house-gallery, team-index,
                           specialist-filter, journal-filter, lightbox, enquiry-form, doorway, parallax,
                           magnetic, open-status
public/                  copied as-is: fonts, images, admin/ (Decap), favicon, _headers
scripts/build.mjs        content + templates → static HTML, sitemap.xml, robots.txt, CSS
scripts/serve.mjs        zero-dependency local server
```

**Why a tiny build step?** A CMS-managed site needs its header, footer and data rendered into 34 pages without copy-paste.
The build is plain Node with template literals. There is no framework and no client-side rendering, and the output is ordinary static HTML.

### Pages (34)

`/` · `/care/` + 6 care pages · `/specialists/` + 9 profiles · `/journal/` + 8 articles · `/practice/` · `/fees/` · `/contact/` · `/enquire/` · `/privacy/` · `/colophon/` · `404.html`

## Design system

| | |
|---|---|
| **Idea** | *Light through a doorway.* The mark is an arched doorway with a point of light; the photography is chosen for how light falls into rooms. |
| **Type** | Newsreader (light, optical sizes, italic accents) for display and quotation; Hanken Grotesk for interface and body. Self-hosted variable WOFF2. |
| **Colour** | Paper `#f6f2eb`, ivory, stone, espresso `#15110e`; brass/champagne as the only accent. Tokens live in `@theme` in `main.css`. |
| **Motifs** | Numbered italic eyebrows, hairline ledgers, figure captions, the arch (used once per page as a frame, and for specialist plates), a warm glow in dark sections. Every page ends on the same image: a lit garden doorway inside an arch, the mark made photographic. |
| **Accent markup** | Headlines accept `*words*` → italic brass accent. Nothing else is interpreted, so editors can't break layout. |

## Interactions

- **Hero**: image settles from a slight zoom; headline rises word by word once fonts are ready; live *Open now / Closed* line in London time.
- **Position statement**: words brighten as the paragraph scrolls through the viewport.
- **Care browser**: accordion semantics (buttons with `aria-expanded` + regions), presented as a list/detail view on desktop, with arrow-key navigation.
- **Patient journey**: progress line fills while reading; the current step and counter follow.
- **The house**: vertical scroll drives a pinned horizontal gallery on landscape screens 1024px and wider; native scroll-snap strip on portrait tablets, phones and reduced motion.
- **Specialist index**: portrait plate follows the cursor (decorative, fine pointers only).
- **Specialist directory**: editorial rows led by each clinician's own words, not staff cards. Filters (area, language, search) are mirrored in the URL (`?area=Heart&lang=Portuguese`), with a live result count and an empty state.
- **Lightbox**: native `<dialog>`, arrow keys and Escape.
- **The doorway**: every page closes on a garden door seen through an arch. On fine pointers the view beyond shifts against the frame and the wall's reveal deepens on the far side, so it reads as an opening in a wall rather than a picture. CSS 3D and about 30 lines of JS (`doorway.js`); static under reduced motion and on touch.
- **Page transitions**: CSS cross-document View Transitions (progressive; no JS).
- Everything works without JavaScript. All motion is disabled under `prefers-reduced-motion`.

## Forms (Web3Forms)

Both forms post to `https://api.web3forms.com/submit`.

1. Create an access key at web3forms.com.
2. Put it in `content/settings/site.json` → `forms.web3forms_access_key` (or via the CMS → *Site settings*).
3. Rebuild.

While the key is the placeholder `YOUR_WEB3FORMS_ACCESS_KEY`, forms run in **demo mode**: they validate and show the success state, labelled *"Demo mode: nothing was sent"*.

- **Enquiry** (`/enquire/`): four steps (reason → context → contact → review). It validates per step, focuses the first invalid field, and has a review screen with per-row Edit links, a consent checkbox, and loading, success and error states. The success message confirms that **no appointment has been booked**.
- Deep links prefill the form: `/enquire/?care=womens-health` and `/enquire/?specialist=tomas-ribeiro`.
- Spam: Web3Forms honeypot (`botcheck`).
- Without JS the whole form is visible and posts natively.

## Content management (Decap CMS)

`/admin/` loads Decap CMS; configuration is in `public/admin/config.yml`.

- Collections: **Journal**, **Specialists**, **Areas of care** (editable, but not creatable or deletable without a design review), **Pages** (Homepage, The Practice, Site settings).
- Guard rails: select widgets for categories, disciplines and plate tones; relation widgets for authors and care areas; length patterns and hints on headlines; list min/max matching the layouts; editorial workflow (draft → review → publish).
- Images: uploads go to `public/images/uploads/` and render as single files. Library images can carry a `focus` (CSS object-position) in `image-credits.json` so the subject stays in frame at every crop; portrait-format images get a portrait article header automatically.
  The pre-sized library (`name-800/1400/2200.avif` + `.webp`, `name-og.jpg`) is used when a bare name is given. The CMS can't preview bare library names, so their thumbnails show empty in the editor. The value is kept and the site renders them normally.
- Portraits: add a `portrait` image to a specialist to replace the typographic plate.

**Backend setup:** set `backend.repo` and `base_url` in `config.yml`. On Cloudflare Pages, use GitHub as the backend with an OAuth proxy (for example a small Cloudflare Worker). For local editing, uncomment `local_backend: true` and run `npx decap-server`.

## Deploying to Cloudflare Pages

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `SITE_URL=https://your-domain` (canonical URLs, sitemap, OG) |
| Node | 22, pinned by `.node-version` (the build needs Node 20.11 or later) |

`public/_headers` sets security headers and caching. Versioned CSS and the fonts are immutable. Page modules revalidate, and images are cached for one week.

## SEO and indexing

Every page has a unique title, description, canonical URL, Open Graph and Twitter tags, and one `h1`. Structured data covers MedicalClinic, Physician, Article, FAQPage and BreadcrumbList. `sitemap.xml` and `robots.txt` are generated.

`site.json → indexable` is **false** for the concept, which adds `noindex, nofollow` to every page. Crawling stays allowed so the directive is actually seen. Set it to `true` for a real client.

## Accessibility

- Semantic landmarks and a skip link.
- Visible focus on every control.
- A focus-trapped, Escape-closable mobile menu.
- ARIA where native semantics fall short (the care browser, filter chips with `aria-pressed`, live regions for filter results).
- Labelled form fields with linked error messages and `aria-invalid`.
- Reduced-motion support.
- Every template passes an axe-core WCAG 2.1 AA scan.

## Performance

- No framework. Each page loads a 1.2 KB entry script plus only the modules its markup declares.
- Roughly 13 KB of gzipped HTML and 15 KB of gzipped CSS per page.
- Self-hosted, preloaded variable fonts with `font-display: swap`.
- AVIF images (WebP fallback via `<picture>`) at 800, 1400 and 2200 px with `srcset`/`sizes`, lazy loading, explicit dimensions, and dominant-colour placeholders. AVIF is about a third of the WebP weight.
- 1200×630 JPEG social images (`name-og.jpg`) for Open Graph and JSON-LD.
- The hero image is preloaded with high fetch priority.

## Replacing placeholders

- Photography: Unsplash (credited on `/colophon/`). Replace with commissioned photography of the real premises.
- Specialist portraits: add them via the CMS.
- Address, phone (Ofcom drama range) and email (`.example` domain) are fictional.
- Fees are illustrative.
- The Web3Forms key and the Decap backend need real values.
