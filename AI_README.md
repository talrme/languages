# Languages: AI Working Context

Owner: Tal. Repo https://github.com/talrme/languages; live https://talrme.github.io/languages/ . All personal websites belong in `/Users/talg/Desktop/Websites For Fun` unless directed otherwise. Owner selected **Metro Lines (former staging 7)** for production and explicitly requested deletion of other designs/staging. Do not recreate a gallery. Commit/push normal completed changes unless the owner asks for local-only work.

## Product Preferences

Phone first, compact Languages header and globe, location search, then useful phrases. No marketing hero, subtitle or giant counts. Default Oakland, English hidden, five individual languages, three phrases (Thank you/Hello/Goodbye), **By language first/default**. By phrase reorganizes the same data; Saved is local bookmarks. Language count 5/8/10/All; phrase count 3/5/8. Independent All languages library and Practice mode remain.

Never display Multiple languages, Other Asian/Pacific or another grouped placeholder as a language. Every supported location must offer at least ten named language choices with complete phrases. Approximate learning picks are acceptable; fake demographic percentages are not. The explicit blue About languages spoken here link below the location explains this. Each language's percentage/info button gives provenance.

Patterns borrowed from Huck/Preferences/World Flavors: immediate local settings, four palettes, bottom Settings and Save / Share, globe PNG for favicon/phone, QR/share selected-place URL, solid dialogs with X/outside-tap/Escape/Done dismissal, keyboard access, reduced motion. No horizontal page overflow on phones. No backend/account.

## Architecture

- `tools/page.html`: canonical production HTML. Run `node tools/build.mjs` after changes; generated `index.html`, manifest and service worker are checked in. No staging generation.
- `shared/app.js`: DOM rendering, interaction, state, search, geolocation, sources, practice/bookmarks, matching device voices and share dialogs. Only data fetch is local `data/us.json`.
- `shared/selection.js`: pure `selectLanguages(place,snapshot,locations)` builds unique individual language choices. Local Census rows are traversed in source rank order; individual estimates retain numbers, recognizable combined categories yield named examples without numbers. City lists use parent-state/national additions, country lists start with curated IDs, then regional/wider suggestions fill the list. Every row identifies estimate/local-example/regional/country/suggestion provenance. No mutation of raw snapshot.
- `shared/phrases.js`: **36** languages, eight common phrases each, optional romanization and context notes. Unicode is intentional. Includes Afrikaans/Zulu/Xhosa for useful South Africa coverage. No certified translation claim.
- `shared/countries.js`: 50 curated country/territory profiles, generally not demographic ranks; Australia has sourced 2021 home-language shares.
- `shared/styles.css`: Metro Lines composition (`data-design=7`), generic controls/accessibility, phone adaptations and four palette overrides. Other design CSS removed.
- `tools/fetch-census.py`: explicit official-bulk-file snapshot regeneration, no API key. Census query endpoints required a key and Census Reporter was unavailable; neither is used at runtime.
- `tools/icons.cjs`: canvas-drawn PNG globe variants, no remote image dependency.
- `tools/serve.cjs`: port 5198, serves `/` and `/languages/`.
- `tests/selection.mjs`: every-place pure data/selection checks.
- `tests/browser.cjs`: isolated server on5298, Playwright/Chrome, mock voices, no external data writes. Phone/desktop screenshots in `/tmp`.
- `tests/offline.cjs`: isolated server on5299, real service-worker installation, subpath and offline navigation/search checks.
- `sw.js`: generated network-first same-origin GET cache, offline fallback. Promotion uses `languages-metro-v2`, removes older Languages caches on activation. Bump cache version when needed; visit/reload online before offline reliance.

ES modules, no framework. Vendored Lucide/QRCode retain original licenses. Paths must work under GitHub Pages `/languages/`; share/install point to root app, not staging.

## Data Integrity

Snapshot has actual ACS 2020–2024 estimates for **1,807 unique U.S. geographies**. City C16001 and state/national B16001. Builder excludes non-total geography components (`GEO_ID[3:7] == 0000`) to avoid duplicate state overwrites. Cities require age-5+ denominator >=25,000. Gazetteer coordinates are place internal points, not users.

Raw arrays are `[categoryCode,estimate,90%-confidence count MOE]`; keys include `c3` (city Spanish) and `3` (detailed Spanish). Raw category totals must sum to denominator; never alter them to fit the phrase UI. Individual local percentage = count/original denominator*100. Hiding English never renormalizes. English means English only at home. Close estimates may not have statistically reliable rank order.

Combined Chinese maps to Mandarin/Cantonese learning choices, French/Haitian/Cajun to French/Haitian Creole, etc., with no falsely attributed counts. Unsupported broad Other categories are skipped. Supplemented state/national/country/general learning picks must not acquire local percentages. Info panels explain basis. Country selections are approximate learning lists, not top-ten statistics. Don't silently label country data as city figures. Phrase context matters (dialect/formality/gender, yes/no variations); review new forms with references and ideally a fluent speaker. Don't conflate languages with national flags.

## State, Privacy, Audio

Keep localStorage key `languages-v1` to preserve users' settings/bookmarks. `layoutVersion:2` one-time migration resets older view preferences to By language; later choices persist normally. Obsolete example-category preferences are ignored. Local state includes location/view/counts/favorites, English/romanization visibility, palette, rate and animation preference. Practice/reveals are session-only. No cross-phone sync. Share includes selected-place ID, not private bookmarks. Done only closes settings; controls save immediately.

Geolocation only after explicit click. Process on-device, show nearby covered U.S. city/distance and require confirmation; don't claim nearest city is exact location. Coordinates not persisted/uploaded by app; browser/OS provider may use network. Denial leaves search working.

Web Speech uses matching voice, exact locale preferred; Cantonese requires HK/yue, not a Mandarin fallback. Missing voice disables speaker with explanation; voiceschanged updates availability. Device voices may contact their own services. No bundled recordings, TTS backend/key or guarantee of offline voices. Mocked tests cannot establish physical-phone voice quality.

## Shipping

Keep README and AI_README current. Run build, selection tests, browser tests; inspect phone/desktop screenshots, themes, modal closing and overflow. Test offline changes if touching service worker. No staging directories/previews/design registry should remain. Update All Websites if description/icon/URL changes; bump its data cache query. GitHub Pages is main/root with no secrets or setup required.
