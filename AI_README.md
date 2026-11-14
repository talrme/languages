# Languages: AI Working Context

Owner: Tal. Repo https://github.com/talrme/languages; Pages https://talrme.github.io/languages/ . All personal sites belong in `/Users/talg/Desktop/Websites For Fun` unless explicitly directed elsewhere. The owner requested TEN extremely different fully functional staging designs before selecting a production design. Do not promote one or delete staging until instructed. Root is the gallery, staging/1 through staging/10 are apps.

## Product And Preferences

Phone first. A small Languages header with a globe, location search and optional location permission, then immediate useful phrases. No marketing hero, long intro, gratuitous subtitle or large counts. Default Oakland, English hidden, five language categories, three phrases (Thank you/Hello/Goodbye), By phrase. By language reorganizes the same content; Saved is local bookmarks. More phrases and languages are explicit selectors. All languages opens the full phrase library independently of local rankings. Practice hides native/romanized text until tapped.

Borrowed patterns from Huck, Preferences and World Flavors: local settings, instant palette changes, bottom Settings and Save / Share, PNG icon and phone installation directions, QR with the selected place URL, solid responsive dialogs with rotating X/outside click/Escape/Done dismissal, accessible controls and reduced-motion support. No giant side-scrolling tables on phones. Design 8 intentionally uses horizontally snapping phrase cards with explicit phrase navigation. No backend/account needed. Do not introduce Firebase or APIs for ordinary use.

## Architecture

- `shared/app.js`: shared app, rendering and state; data fetched only from repository `data/us.json`; no remote data or geocoding requests at runtime.
- `shared/phrases.js`: 33 language records, eight independently assembled common phrases each, romanization and important context notes; native text is intentionally Unicode. Not a certified translation database.
- `shared/countries.js`: mostly curated learning selections, NOT demographic rankings; Australia has sourced 2021 home-language percentages. Do not add invented percentages, unsupported ranks, or national figures mislabeled as city figures.
- `shared/designs.js`: 10 named design descriptors.
- `shared/styles.css`: base accessibility/responsiveness/components and strong per-design composition/typography overrides; explicit palettes afterward. Do not flatten designs into recolors.
- `tools/build.mjs`: canonical page template and generator; edits to generated staging/index pages must be made here and rebuilt. Does not touch app/data/CSS.
- `tools/fetch-census.py`: explicit bulk-data regeneration, standard-library parsing. Census query endpoints required an API key at build time; official bulk files avoid that. Census Reporter was unavailable and is NOT used. No key required.
- `tools/icons.cjs`: code-drawn globe PNG variants; Playwright renders canvas, no remote image dependency.
- `tests/browser.cjs`: self-hosting isolated checks, mock device voices. Generates previews/*.png from clean initial screens. Other screenshots go in /tmp. No real services or data writes.
- `tools/serve.cjs`: port 5198 local server, supports `/` and `/languages/`.
- `sw.js`: generated network-first same-origin GET cache with offline fallback. Initial navigation precedes worker registration; revisit/reload online to cache the current page. No promise of all designs/voices offline after one visit. Bump cache version for future incompatible changes, avoid persistent stale data.

ES modules, no framework/runtime dependency installation, vendored Lucide and QRCode (copied from Preferences, retain their license headers). Existing filenames and paths are relative for GitHub Pages subpath safety. package.json type module; tools/tests CJS use .cjs.

## Data Integrity (Important)

`data/us.json` has actual 2020–2024 ACS estimates for 1,807 geographies, all unique IDs. City source C16001, state/national source B16001. The build excludes non-total geography components (GEO_ID positions 3:7 must equal 0000), avoiding duplicate state/component overwrites. Only city records with age-5+ denominator >=25,000 are bundled. Coordinates are Gazetteer internal points (not user location). All category counts must sum to each row's denominator; tests enforce this, sort and unique IDs.

Snapshot categories are keys like `3` (B16001 Spanish) or `c3` (C16001 Spanish). Arrays are [categoryCode, estimatedCount, 90%-confidenceCountMOE]. Percent = count / original age-5+ total *100; hiding English never changes denominator. B16001 English is English ONLY at home, not every English speaker. Close ranks have sampling uncertainty. No current-day/live data claims.

City categories often combine languages. `categoryMap` can provide a clearly labeled example (Mandarin for combined Chinese, French for French/Haitian/Cajun, etc.); that percentage is NOT a language-specific estimate. Categories without a mapping intentionally display Multiple languages; user may select a learning example, with an explicit warning, not reassign demographic counts. Preserve source category labels in details. Country pages show Learning selection · not ranked and no percentages unless sourced. No silent country fallback for international cities: search result explicitly says country overview. Canada/UK selections are not country-wide Census figures. South Africa has only English currently in the library, so with English hidden it correctly offers the general library rather than inventing indigenous-language coverage.

Source files and precise limitations are in README and Sources & coverage. Phrase forms must distinguish dialect/formality/gender and context where relevant; no universal claims for yes/no, greetings or please. New phrases should be reviewed against a reliable language reference and ideally a fluent speaker. Do not conflate a language with a country's flag.

## State, Privacy And Audio

One localStorage namespace `languages-v1`, shared across designs on the same origin: selected place/view, counts, favorites, examples, English/romanization visibility, palette, speech rate and animations. Practice/reveals are session-only. No cross-phone sync. Changing a palette applies immediately; Done only closes. Share URL includes the current staging path and place ID. Install manifest starts that staging design; saved place comes from local state. Bookmarks are not in share links.

Geolocation only on explicit tap. Coordinates are compared to covered U.S. cities on-device, proposal includes distance and needs confirmation. Never silently call nearest city the user's city. Browser/OS may use a location provider; app coordinates are not persisted/uploaded. Denied/unsupported geolocation leaves manual search functional.

Web Speech: use matching voice, prefer exact locale, otherwise language match (Cantonese requires HK/yue rather than a Mandarin fallback). Missing voice disables speaker with tooltip; voiceschanged refreshes availability. Text only, no audio files/backend/TTS API key. Device may use remote voices; cannot guarantee offline playback or exact pronunciation. Do not mistake mocked audio tests for physical-phone voice QA.

## Shipping And Follow-Up

Run build, data/browser regressions, inspect actual phone/desktop screenshots, verify no horizontal overflow, keyboard focus/voice availability, palettes and close behavior before pushing. User provided Git repo and enabled Pages, so publish the staging gallery. Final production promotion is a separate approval. Keep README/AI_README current. No default real-data mutation is relevant to this project.
