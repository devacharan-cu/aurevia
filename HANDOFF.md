# Aurevia v1.0 — Portfolio Ready · Production handoff

**Status:** frozen as of 5 October 2026. The visual and art direction are final, so changes from here should be content or real-client configuration only.
**Scope:** a fictional private medical practice, built as a portfolio piece. It ships with `noindex` on purpose.

The README covers day-to-day use. This document records how the site is put together, what was verified, how, and what a real client still needs to supply.

---

## 1. Final architecture

| Layer | Implementation |
|---|---|
| Output | 34 static HTML pages plus `sitemap.xml` and `robots.txt`. No framework and no client-side rendering. |
| Build | `scripts/build.mjs` (plain Node): JSON and JSON-frontmatter Markdown in `content/`, rendered through the template modules in `src/pages/*.mjs`, written to `dist/`. Tailwind v4 CLI for CSS and `marked` for article bodies. About 1 second. |
| Content | `content/settings/*.json`, `content/care/*.json` (6), `content/specialists/*.json` (9), `content/journal/*.md` (8). Decap CMS writes these files. |
| JS | A 1.2 KB entry module (`js/main.js`) loads only the page modules its markup declares (`data-module`). Every page works without JS. |
| Static assets | `public/` is copied as-is: fonts (self-hosted variable WOFF2), images, `admin/` (Decap), `_headers`, favicon. |
| Runtime dependencies | None. Third-party services: Web3Forms (forms) and unpkg (Decap CMS script, `/admin/` only). |

## 2. Deployment configuration (Cloudflare Pages)

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 22, pinned by `.node-version` (the build needs Node 20.11 or later; Pages' older v2 image defaults to Node 18) |
| Environment variable | `SITE_URL=https://<production-domain>`. This drives canonicals, `og:url`, `og:image`, the sitemap and robots. Without it, URLs point at `https://aurevia.example`. |

**Headers (`public/_headers`):**
- Strict CSP site-wide: `connect-src` and `form-action` allow only `api.web3forms.com`.
- `nosniff`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`.
- Caching: CSS and fonts are immutable (CSS is versioned by query string), images are cached for 7 days with `stale-while-revalidate`, and JS modules revalidate.
- `/admin/*` detaches the site CSP (`! Content-Security-Policy`) and sets its own policy, plus `X-Robots-Tag: noindex`. *This was a v1.0 fix:* Pages joins duplicate headers, so before the fix both policies were enforced and Decap's script would have been blocked in production.

**Verified on Cloudflare's own runtime (`wrangler pages dev`, 4.147):**
- Clean URLs, with `308` redirects to the trailing-slash form. `/index.html` redirects to `/`.
- Unknown paths and missing assets return a real `404` status with the custom page, served `no-store`.
- Every header rule applies as intended.
- A clean `npm ci && npm run build` on Linux (Node 22.22) produced output identical to the local build: same file list, byte-identical CSS and binaries, and all 37 text files equal once the build hash and site URL are normalised.

**Not yet done:** an actual deploy, because there's no Cloudflare account or repository yet. See §9.

## 3. CMS setup (Decap CMS)

`/admin/` loads Decap 3.x from unpkg. The configuration is in `public/admin/config.yml`.

**Going live:**
1. Push the project to GitHub.
2. In `config.yml`, set `backend.repo` and `base_url`. The latter points to a GitHub OAuth proxy, for example a small Cloudflare Worker.
3. Connect the repository to Cloudflare Pages. Each publish from the CMS commits to `main` and triggers a rebuild.
4. For local editing, uncomment `local_backend: true` and run `npx decap-server`.

**Verified against Decap itself:** Decap 3 running in Chrome against `decap-server` on a throwaway copy of the repository.
- All 26 entries open with correct values: 8 articles, 9 specialists, 6 care areas, and the 3 settings files.
- Saving one entry of each type rewrote the file with **only the edited field changed**. No field was dropped and no type changed (23 to 81 values per file). Decap reorders keys and writes the first frontmatter key unindented, and the build parser handles both.
- The build consumed every Decap-written file. A newly created article using an uploaded image (`/images/uploads/…`) rendered correctly, with correct OG and JSON-LD image URLs.

**Known limitations:**
- Library images are stored as bare names (for example `morning-bed`), so Decap shows an empty thumbnail for them. The value is kept, and the site renders the sized AVIF/WebP set. Uploads display normally.
- On a Windows local backend, Decap wrote CRLF line endings. The build is unaffected, and `.gitattributes` normalises line endings to LF in git.
- `editorial_workflow` (draft → review → publish) needs the GitHub backend. The filesystem test ran in simple publish mode.

## 4. Form setup (Web3Forms)

- Two forms: the guided 4-step enquiry (`/enquire/`, with deep links `?care=` and `?specialist=`) and contact (`/contact/`). Both post JSON to `https://api.web3forms.com/submit`.
- Key: `content/settings/site.json` → `forms.web3forms_access_key`, or CMS → Site settings. While the key is the placeholder, the forms run in **demo mode**: they validate fully, then show success labelled "nothing was sent".
- Spam protection: Web3Forms `botcheck` honeypot. Consent is required on the enquiry form.
- Without JS, the whole form is visible and posts natively.

**Verified against the live Web3Forms API** in Chrome, under the production CSP:
- Per-step validation focuses the first invalid field.
- The review screen lists every answer.
- The CORS preflight passes.
- Web3Forms parsed every field and the subject line, then rejected only the dummy key ("Invalid Form ID/Access Key").
- The error state appeared under the Send button (`role="alert"`) with the input intact and the button reset.
- Demo-mode success messages are personalised and state that no appointment is booked.
- Deep-link prefill works, and unknown values are ignored.

**Note for testers:** Web3Forms rejects server-side requests and browsers that identify as `HeadlessChrome`. Automated tests need a normal Chrome user agent. Real visitors are unaffected.

**Still needed:** a real access key and one test submission that reaches the client's inbox (§9).

## 5. Image strategy

- **Library:** 24 photographs, each at 800, 1400 and 2200 px in **AVIF** (served first via `<picture>`) and **WebP** (fallback), plus a 1200×630 **JPEG** social image (`-og.jpg`). OG images are cropped on each image's focal point.
- **Weight:** AVIF is 32% of WebP overall (3.8 MB against 11.7 MB). Averages are 16, 43 and 103 KB for AVIF at 800, 1400 and 2200 px, against 57, 157 and 286 KB for WebP.
- **Lightbox:** loads the 2200 px AVIF when the browser chose AVIF for the thumbnail, otherwise WebP. That cuts the six gallery images from 1.8 MB to 0.67 MB.
- **Loading:**
  - Explicit dimensions on every image.
  - Dominant-colour placeholder and focal point (`object-position`) per image, from `image-credits.json`.
  - Lazy loading below the fold.
  - The hero is preloaded with `fetchpriority="high"`.
- **Credits:** all photography is from Unsplash, and all 24 credit links on `/colophon/` resolve. Every library image is referenced by the build, with nothing orphaned.
- **Adding images:** CMS uploads go to `public/images/uploads/` and are served as single files. For the sized AVIF/WebP/OG set, add files to `public/images/` with an entry in `image-credits.json`.

## 6. Performance results

Lighthouse 12.8. This is the production build on Cloudflare's local Pages runtime (Brotli on) with Lighthouse's default throttling: simulated slow 4G on mobile and the desktop preset. Twelve page templates were tested.

| | Performance | Accessibility | Best practices | SEO* |
|---|---|---|---|---|
| Mobile | **94 avg** (88 to 99) | 100 (home 97†) | 100 | 66 to 69* |
| Desktop | **100 avg** (99 to 100) | 100 (home 97†) | 100 | 66 to 69* |

- Total blocking time is 0 ms on every page, and CLS is at most 0.019.
- Mobile LCP is 2.0 to 3.4 s. Desktop LCP is 0.5 to 0.9 s.
- Page weight is 343 to 553 KB, including fonts and images.
- The lowest score is the homepage on mobile (88). Its LCP element is the hero text, which fades in by design after the fonts load.

\* The **only** failing SEO audit is `is-crawlable`, which is the intentional `noindex`. With `indexable: true`, nothing fails.
† See §7.

**Still needed:** a re-run against the deployed URL (§9). Edge latency and HTTP/2 or HTTP/3 should improve the mobile numbers slightly.

## 7. Accessibility results

- **axe-core, WCAG 2.0/2.1/2.2 A and AA:** zero violations on all 34 pages at phone (390), tablet (820) and desktop (1440) widths, with motion on and with reduced motion. That's 204 page-views.
- **Regression checks across the same 204 page-views:**
  - No horizontal overflow.
  - No broken images.
  - No console or CSP errors.
  - Exactly one `h1` per page.
  - The fixed mobile action bar never covers footer content.
- **Interaction checks:**
  - Skip link, focus-trapped menu and visible focus.
  - Accordion semantics in the care browser.
  - Lightbox on native `<dialog>`: arrow keys work, Escape closes it, and focus returns to the trigger.
  - Labelled form errors with `aria-invalid` and `aria-describedby`.
- **No-JS:** all content is reachable. *This was a v1.0 fix:* the homepage care browser previously hid five of its six areas without JS. Without JS they now display in normal flow, while the JS presentation is unchanged.
- **† Homepage 97:** the "position statement" brightens word by word as it scrolls into view. Static Lighthouse audits catch its starting state at 16% opacity. When read, it reaches full contrast (axe passes at rest). It is always full contrast under reduced motion, and screen readers read it regardless. This is a deliberate part of the frozen design and is kept as is.

## 8. v1.0 hardening changes (this pass)

- Fee wording: card labels now read "From £280". Full ranges ("£280 – £350") appear only where they're labelled as ranges.
- Replaced the weakest journal lead image (*What a health assessment can, and cannot, tell you*).
- AVIF served everywhere, including the lightbox. JPEG OG images with width and height tags, also used in JSON-LD. CMS-uploaded images no longer produce broken JSON-LD image URLs.
- `/admin/` CSP conflict fixed (§2).
- 404 page no longer declares a canonical URL or `og:url`.
- Care browser readable without JS (§7).
- Node pinned for Pages (`.node-version`). The local server now sends the correct AVIF MIME type.

## 9. Remaining real-client placeholders

**Required before a real launch:**
- [ ] **Production domain:** set `SITE_URL` in Pages, `url` in `site.json`, and `site_url` and `display_url` in `config.yml`.
- [ ] **Indexing:** set `site.json → indexable: true`. Leave it `false` for the portfolio deployment.
- [ ] **Web3Forms:** add the real access key, then send one test submission from the deployed site and confirm it arrives. Consider the `redirect` field for the no-JS fallback.
- [ ] **Decap backend:** set `backend.repo` and `base_url`, deploy the OAuth proxy, and confirm the editorial workflow on the real repository.
- [ ] **Deploy and re-audit:** run Lighthouse against the live URL and recheck headers with `curl -I`, for example on `/admin/`.

**Content that is fictional and must be replaced:**
- [ ] Practice name and identity (if not Aurevia), the address (9 Aurelian Mews, W1G 8AZ), the phone number (Ofcom drama range: 020 7946 0321) and the email (`care@aurevia.example`).
- [ ] Opening hours, nearby stations and the emergency notice.
- [ ] Nine clinicians: names, roles, rooms, days, languages, biographies and quotes. Publish only verified qualifications. Add commissioned portraits, which replace the typographic plates, and set `fictional: false`.
- [ ] Six care areas: inclusions, processes, FAQs, and **all fees**, which are illustrative.
- [ ] Eight journal articles: invented authorship and general content. They need clinical review or replacement.
- [ ] Practice page: story, first-contact team, and GP/insurer text.
- [ ] Privacy notice: rewrite for the real controller and data flows, including Web3Forms as a processor. Also the colophon.
- [ ] Concept notice: remove `concept_notice` and the footer credit line.
- [ ] Photography: replace the Unsplash library with commissioned photographs of the real premises, keeping the same file naming and credits entries.

**Optional:**
- 13 meta descriptions are 171 to 196 characters and may be truncated in search results. That's harmless while `noindex` is on, but worth trimming before indexing.
