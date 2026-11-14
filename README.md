# Languages

**Live site: [talrme.github.io/languages](https://talrme.github.io/languages/)**

[Repository](https://github.com/talrme/languages)

Metro Lines is the production design. The staging gallery and other designs have been removed.

## Using The App

Search a city, state or country. Oakland opens initially, with English hidden, five languages and three phrases. **By language** is the first and default view; switch to By phrase or Saved whenever you like. Languages offers 5, 8, 10, 15, 20, 25, 30 or All. Phrases offers 3, 5, 8, 10, 15, 20, 30, 40 or 50. Every location offers at least ten individual languages, with no grouped placeholders or empty translations. The independent All languages library contains 36 phrasebooks, each with 50 words and phrases.

The initial phrases are Thank you, Hello and Goodbye. Expanded choices cover politeness, greetings, conversation, understanding, food/drink, directions, time and numbers. Select **Choose…** in either menu for a searchable checklist with All/Clear and an Apply button. After applying, the menu shows how many you picked; its adjacent sliders icon reopens your selection. Cancel, X, Escape and outside taps discard uncommitted changes; at least one item is required. Your last custom set is remembered even while using quick counts.

Select **Worldwide** beside the search field for the most-spoken languages by **total speakers** (native plus second-language speakers), not a location. Tap it again to return to your previous place, or search for another city/country. Searching Worldwide or global also works. The mode is remembered locally and shareable with `?place=worldwide`. English follows your existing Hide English setting; custom language selections remain custom until you choose a numeric count or All.

Worldwide uses the 2026 Ethnologue total-speaker table reproduced in the reference below. Its automatic list includes only the **23 supported phrasebooks** in that table (22 when English is hidden), preserving their relative rank. Some world ranks are missing because those languages do not yet have phrasebooks. Counts larger than the available ranking are hidden; an existing larger count becomes All. Other library languages remain explicitly selectable through Choose…, without a claimed global rank. No local percentages or guessed worldwide shares are displayed. About worldwide languages explains the basis; each language's information button shows its actual reference rank where available.

Custom languages are an explicit personal selection, independent of local ranking and the automatic Hide English filter. Selecting English explicitly includes it. Custom sets stay selected when changing location; only their supported local percentages change. Select a numeric count or All to return to automatic location-informed ordering. Chosen phrases remain in phrasebook order and work in both views and practice; the independent library always offers all 50. Bookmarks are independent of display filters.

Tap wording for context; speaker buttons use matching voices available on your device. Missing voices are disabled, never replaced with an unrelated language. Pronunciation, accents and offline speech depend on your phone and its voice services. Romanization is available for some entries, not universally for all 50. Number words are standalone learning forms, not rules for counting every kind of object. These independently assembled forms are not a substitute for fluent-speaker review, especially for gender, formality or high-stakes use.

Bookmark phrases and use Practice to hide translations until tapped. Settings apply immediately and stay on this device: location, view, counts, applied custom sets, bookmarks, English visibility, romanization, speech speed, animations and palette. Existing staging bookmarks/settings are preserved; promotion switches older installs to By language once, after which your view choice is remembered. There is no account, backend or cross-device sync. Shared links carry the location, not your personal custom sets.

**About languages spoken here**, underneath the location, explains the selection and sources. Tap a language's percentage or information icon for its specific basis. The location arrow requests device location only when tapped, proposes a nearby covered U.S. city with its distance, and requires confirmation. Unlisted international cities may offer an explicitly labeled country overview; other places need a state/country search. Coordinates are processed locally, not saved or uploaded by this app; browser/OS location services may have their own network activity.

Bottom controls open Settings, sources, the library and Save / Share. Dialogs close with X, Done, Escape or an outside tap. Save / Share includes a location-specific link, QR code, clipboard/native sharing and iPhone/Android home-screen directions. The globe PNG is the favicon and phone icon. Private bookmarks are not included in links.

## Selection And Sources

**No population counts or percentages are invented.** This is a practical phrasebook, not an exact demographic top-ten ranking.

- The real U.S. snapshot covers **1,807 geographies**: covered cities with 25,000+ residents age 5+, states/DC/PR and the U.S. City data comes from ACS 2020–2024 **C16001**; state/national data uses **B16001**.
- Named local estimates and recognizable languages from combined categories lead the list. Combined categories become individual learning choices, never population shares: Mandarin and Cantonese, for example, have phrases but no percentage attributed from the combined Chinese count. Broad unspecified categories are not displayed as languages.
- Short city lists are supplemented from state/national sources, then regional/wider learning selections. Country profiles start with curated learning choices. Every displayed row names an actual supported language and has phrases. Supplemental selections are approximate learning suggestions, not claims about precise local rank.
- Percentages appear only for supported individual-language estimates. The denominator is all residents age 5+; hiding English does not renormalize it. English means English only at home, not everyone who knows English. Details include the source estimate and 90% margin of error where available; close ranks may not be statistically distinct.
- **50 country/territory profiles** are curated learning selections, not measured rankings. Australia additionally has published 2021 home-language percentages. Different years/measures are not directly comparable.
- Common phrase forms vary by region, politeness, speaker and context; romanization is approximate. Check with a fluent speaker before high-stakes use. No certified-translation claim is made.

References:

- [Census language-use methodology](https://www.census.gov/topics/population/language-use/about.html)
- [Official city source: C16001](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-c16001.dat)
- [Official detailed source: B16001](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-b16001.dat)
- [Census geography names](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/documentation/Geos20245YR.txt)
- [Census place coordinates](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_place_national.zip)
- [Australia 2021 Census](https://www.abs.gov.au/statistics/people/people-and-communities/cultural-diversity-census/2021)
- [Wikivoyage phrasebooks](https://en.wikivoyage.org/wiki/Phrasebooks), including reference checks for [Afrikaans](https://en.wikivoyage.org/wiki/Afrikaans_phrasebook), [Zulu](https://en.wikivoyage.org/wiki/Zulu_phrasebook) and [Xhosa](https://en.wikivoyage.org/wiki/Xhosa_phrasebook).
- [Omniglot: Xhosa context reference](https://www.omniglot.com/language/phrases/xhosa.php) for greetings, singular/plural address and common expressions. This app is not a scraped phrasebook or a certified translation collection.
- [Worldwide total-speaker table, 2026 snapshot](https://en.wikipedia.org/w/index.php?title=List_of_languages_by_total_number_of_speakers&oldid=1385320542), reproducing [Ethnologue](https://www.ethnologue.com/insights/ethnologue200/). Rankings depend on language/variety boundaries and estimates; this app uses Modern Standard Arabic and Iranian Persian, and does not substitute Eastern Punjabi for Western Punjabi.

## Development

Static ES modules, no framework, API keys, Firebase, Google Sheet or build-time service required. GitHub Pages deploys **main / root**. All page data comes from repository files, with no runtime Census or translation requests, analytics or automatic location requests. The U.S. snapshot is about 627 KB uncompressed.

Serve with Cursor Live Server from Websites For Fun at `/languages/`, or run `node tools/serve.cjs` and open **http://127.0.0.1:5198/**. Direct file opening does not support the modules/JSON fetch.

Edit `tools/page.html`, then run `node tools/build.mjs` to regenerate production HTML, the manifest and service worker. This does not recreate staging. App, selection, phrase and styling modules live in `shared/`. `python3 tools/fetch-census.py` explicitly regenerates the snapshot from official bulk files without a Census API key. `node tools/icons.cjs` regenerates globe PNGs.

The service worker caches successful same-origin GETs and uses network-first/offline fallback. Reload online after installation before relying on an offline revisit; unvisited resources and device voices are not guaranteed offline. Promotion removes obsolete Languages caches.

## Verification

- `node tests/selection.mjs`: every location has at least ten unique non-English languages with complete phrases; source totals are preserved and supplemental selections have no invented percentages.
- `node tests/browser.cjs`: self-hosted port 5298, Chrome/Playwright; tests promotion/migration, search, language/phrase views, counts, bookmarks/reload, simulated speech, practice, source details, dialogs, sharing/QR and all palettes at 320/390/1280px. Screenshots go to `/tmp`.
- `node tests/offline.cjs`: self-hosted port 5299; verifies the production subpath, service-worker caching, offline reload and offline country search.
- `node tests/customization.cjs`: self-hosted port 5300; verifies all 50 words/phrases, intermediate language counts, custom checklists, search, cancel/apply/empty safeguards, persistence, explicit English selection, both views and all palettes at 320/390/1280px. Also exercises the maximum 35 non-English languages × 50 phrases.
- `node tests/worldwide.cjs`: self-hosted port 5301; worldwide ordering, supported-only ranks, English visibility, custom selections, sources, global search, previous-location return, persistence, shared deep links and responsive palettes.

Browser tests require Playwright and Chrome. Simulated voices do not establish native-phone pronunciation quality. Keep this README and AI_README updated together.
