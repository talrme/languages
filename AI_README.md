# Languages: AI Working Context

Owner: Tal. Repo https://github.com/talrme/languages; live https://talrme.github.io/languages/ . All personal websites belong in `/Users/talg/Desktop/Websites For Fun` unless directed otherwise. Owner selected **Metro Lines (former staging 7)** for production and explicitly requested deletion of other designs/staging. Do not recreate a gallery. Commit/push normal completed changes unless the owner asks for local-only work.

## Product Preferences

Phone first, compact Languages header and globe, location search, then useful phrases. No marketing hero, subtitle or giant counts. Default Oakland, English hidden, five individual languages, three phrases (Thank you/Hello/Goodbye), **By language first/default**. By phrase reorganizes the same data; Saved is local bookmarks. Language counts 5/8/10/15/20/25/30/All; phrase counts 3/5/8/10/15/20/30/40/50. Both menus have Choose… for locally persisted custom sets. Independent All languages library and Practice mode remain.

Never display Multiple languages, Other Asian/Pacific or another grouped placeholder as a language. Every supported location must offer at least ten named language choices with complete phrases. Approximate learning picks are acceptable; fake demographic percentages are not. The explicit blue About languages spoken here link below the location explains this. Each language's percentage/info button gives provenance.

Worldwide is a compact toggle beside search, not another country. First click chooses world mode, second restores state.previousPlace (or Oakland); manual place search still works. Search aliases include global and most spoken languages. Persist/share it with place='worldwide'. Existing English/custom phrase/language preferences remain applicable. Custom sets are explicitly personal, not worldwide ranking; numeric counts/All restore automatic ordering. In world mode hide numeric count options above the supported ranked-language total; if an old numeric count exceeds it, use All.

Patterns borrowed from Huck/Preferences/World Flavors: immediate local settings, four palettes, bottom Settings and Save / Share, globe PNG for favicon/phone, QR/share selected-place URL, solid dialogs with X/outside-tap/Escape/Done dismissal, keyboard access, reduced motion. No horizontal page overflow on phones. No backend/account.

## Architecture

- `tools/page.html`: canonical production HTML. Run `node tools/build.mjs` after changes; generated `index.html`, manifest and service worker are checked in. No staging generation.
- `shared/app.js`: DOM rendering, interaction, state, search, geolocation, sources, practice/bookmarks, matching device voices and share dialogs. Only data fetch is local `data/us.json`.
- `shared/selection.js`: pure `selectLanguages(place,snapshot,locations)` builds unique individual language choices. Local Census rows are traversed in source rank order; individual estimates retain numbers, recognizable combined categories yield named examples without numbers. City lists use parent-state/national additions, country lists start with curated IDs, then regional/wider suggestions fill the list. Every row identifies estimate/local-example/regional/country/suggestion provenance. No mutation of raw snapshot.
- `shared/phrases.js`: **36** languages, **50** words/phrases each. Stable original eight keys preserved; exports phraseDefinitions (key/name/group), phraseKeys, phraseNames and combined language dictionaries. Checks complete array lengths. Optional romanization and context notes; not every new phrase has romanization. Unicode is intentional. No certified translation claim.
- `shared/extended-phrases.js`: 42 additional definitions and independently assembled translation arrays, indexed by the same definition order. Greetings, conversation, understanding, getting around, food/drink, time, numbers. Any edit must keep all 36 arrays aligned; pure tests require exactly 50 complete entries. Number forms/greetings vary by context; don't claim fluent validation.
- `shared/countries.js`: 50 curated country/territory profiles, generally not demographic ranks; Australia has sourced 2021 home-language shares.
- `shared/worldwide.js`: separate world pseudo-place with 23 supported language IDs and actual world ranks, from the 2026 Ethnologue table reproduced at the pinned Wikipedia reference. First/second-language totals, not native-only. Source links/year are bundled; no runtime fetch. Language varieties must match: Modern Standard Arabic, Iranian Persian; don't map Western Punjabi's rank to the Eastern Punjabi phrasebook. No fabricated numbers. selectLanguages returns ranked rows first plus explicit unranked library choices for custom selection; rows() excludes unranked additions in automatic world mode. All means the supported ranking, not every language in the world.
- `shared/styles.css`: Metro Lines composition (`data-design=7`), generic controls/accessibility, phone adaptations and four palette overrides. Other design CSS removed.
- `tools/fetch-census.py`: explicit official-bulk-file snapshot regeneration, no API key. Census query endpoints required a key and Census Reporter was unavailable; neither is used at runtime.
- `tools/icons.cjs`: canvas-drawn PNG globe variants, no remote image dependency.
- `tools/serve.cjs`: port 5198, serves `/` and `/languages/`.
- `tests/selection.mjs`: every-place pure data/selection checks.
- `tests/browser.cjs`: isolated server on5298, Playwright/Chrome, mock voices, no external data writes. Phone/desktop screenshots in `/tmp`.
- `tests/offline.cjs`: isolated server on5299, real service-worker installation, subpath and offline navigation/search checks.
- `tests/customization.cjs`: isolated server on5300; maximum-size view, count presets, custom checklists/filtering/all/clear/apply/cancel, persistence, explicit English, both views, every palette and phone/desktop overflow.
- `tests/worldwide.cjs`: isolated server on5301; world order, supported-only ranking, sources, English/custom behavior, persistence/deep links, location return/search and responsive themes.
- `sw.js`: generated network-first same-origin GET cache, offline fallback. Uses `languages-worldwide-v4`, removes older Languages caches on activation. Bump cache version when needed; visit/reload online before offline reliance.

ES modules, no framework. Vendored Lucide/QRCode retain original licenses. Paths must work under GitHub Pages `/languages/`; share/install point to root app, not staging.

## Data Integrity

Snapshot has actual ACS 2020–2024 estimates for **1,807 unique U.S. geographies**. City C16001 and state/national B16001. Builder excludes non-total geography components (`GEO_ID[3:7] == 0000`) to avoid duplicate state overwrites. Cities require age-5+ denominator >=25,000. Gazetteer coordinates are place internal points, not users.

Raw arrays are `[categoryCode,estimate,90%-confidence count MOE]`; keys include `c3` (city Spanish) and `3` (detailed Spanish). Raw category totals must sum to denominator; never alter them to fit the phrase UI. Individual local percentage = count/original denominator*100. Hiding English never renormalizes. English means English only at home. Close estimates may not have statistically reliable rank order.

Combined Chinese maps to Mandarin/Cantonese learning choices, French/Haitian/Cajun to French/Haitian Creole, etc., with no falsely attributed counts. Unsupported broad Other categories are skipped. Supplemented state/national/country/general learning picks must not acquire local percentages. Info panels explain basis. Country selections are approximate learning lists, not top-ten statistics. Don't silently label country data as city figures. Phrase context matters (dialect/formality/gender, yes/no variations); review new forms with references and ideally a fluent speaker. Don't conflate languages with national flags.

## State, Privacy, Audio

Keep localStorage key `languages-v1` to preserve users' settings/bookmarks. `layoutVersion:2` one-time migration resets older view preferences to By language; later choices persist normally. Obsolete example-category preferences are ignored. Local state includes location/view/counts/favorites, customLanguages/customPhrases arrays, English/romanization visibility, palette, rate and animation preference. Custom arrays are deduplicated/validated at startup. count/phrases can be the string 'custom'; don't blindly coerce them to numbers. Empty custom sets revert safely at startup.

Checklist edits are transactional: picker holds a draft Set, Apply saves a nonempty selection, Cancel/X/Escape/backdrop discard the draft. Search filters visibility without dropping hidden selections. All/Clear apply to the full checklist. Previously applied custom sets are restored on reopening, even after using a numeric preset. Custom languages are alphabetically ordered and remain the same across locations; rows look up current place provenance without inventing percentages. Explicit English selection overrides automatic Hide English. Numeric/All counts restore local-informed ranking. Custom phrases keep canonical phrase order. The adjacent sliders buttons reopen active custom sets; maintain phone-sized toolbar dimensions. Practice/reveals are session-only. No cross-phone sync. Share includes selected-place ID, not private bookmarks/custom sets. Done only closes settings; ordinary settings save immediately.

Geolocation only after explicit click. Process on-device, show nearby covered U.S. city/distance and require confirmation; don't claim nearest city is exact location. Coordinates not persisted/uploaded by app; browser/OS provider may use network. Denial leaves search working.

Web Speech uses matching voice, exact locale preferred; Cantonese requires HK/yue, not a Mandarin fallback. Missing voice disables speaker with explanation; voiceschanged updates availability. Device voices may contact their own services. No bundled recordings, TTS backend/key or guarantee of offline voices. Mocked tests cannot establish physical-phone voice quality.

## Shipping

Keep README and AI_README current. Run build, selection tests, browser tests; inspect phone/desktop screenshots, themes, modal closing and overflow. Test offline changes if touching service worker. No staging directories/previews/design registry should remain. Update All Websites if description/icon/URL changes; bump its data cache query. GitHub Pages is main/root with no secrets or setup required.
