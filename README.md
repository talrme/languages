# Languages

**Live site: [talrme.github.io/languages](https://talrme.github.io/languages/)**

**Repository: [talrme/languages](https://github.com/talrme/languages)**

Ten fully working, deliberately different staging designs. The root page is the design gallery; no production design has been selected yet.

| Option | Design | Open |
| --- | --- | --- |
| 1 | Pocket Atlas: quiet green editorial index | [Try](https://talrme.github.io/languages/staging/1/) |
| 2 | Departures: dark airport board and citrus accents | [Try](https://talrme.github.io/languages/staging/2/) |
| 3 | Post Office: sky-blue stationery and postcard panels | [Try](https://talrme.github.io/languages/staging/3/) |
| 4 | Say It!: yellow pop art and chunky color blocks | [Try](https://talrme.github.io/languages/staging/4/) |
| 5 | Night Radio: dark, sound-focused, pink and serif | [Try](https://talrme.github.io/languages/staging/5/) |
| 6 | Field Journal: ruled notebook and serif index | [Try](https://talrme.github.io/languages/staging/6/) |
| 7 | Metro Lines: connected stops and transit colors | [Try](https://talrme.github.io/languages/staging/7/) |
| 8 | Flash Club: horizontally scrollable flashcard deck | [Try](https://talrme.github.io/languages/staging/8/) |
| 9 | Color Blocks: multicolored editorial mosaic | [Try](https://talrme.github.io/languages/staging/9/) |
| 10 | Air: spacious, restrained typography | [Try](https://talrme.github.io/languages/staging/10/) |

## Using The App

Search a city, state or country. Oakland opens initially, with English hidden and five language categories. Switch between **By phrase**, **By language** and **Saved**. Choose 3/5/8 phrases and 5/8/all language categories. The separate All languages library provides 33 language phrasebooks, independent of location.

The initial phrases are Thank you, Hello and Goodbye; expand to Please, Excuse me, Sorry, Yes and No. Native writing and, where appropriate, romanization are provided. Tap wording for context and politeness notes. Mandarin is an example, not an individual population estimate, when the Census groups Chinese languages together.

Bookmark phrases on this device. Practice hides translations until tapped. Settings changes apply immediately and persist locally: location, view, counts, bookmarks, example-language choices, English visibility, romanization, speech speed, animations and palette. No accounts or cross-device sync are needed or implemented. Shared links carry the selected location and staging design; they do not share private bookmarks.

Tap the location arrow to request device location. The app proposes the closest covered U.S. city and gives its distance; you must confirm it. It does not silently treat nearby-city figures as your exact location. Unlisted international cities with known country mappings offer an explicitly labeled country overview. Other unlisted places need a state/country search. Coordinates are processed locally, not saved or sent to this app's servers; the browser/OS location provider may use its own services.

Settings, sources, the library and Save / Share are at the bottom. Modals close using X, Done, Escape or an outside tap. Save / Share includes a location-specific link, QR code, clipboard/native sharing, and iPhone/Android home-screen directions. The globe PNG is the browser and phone icon.

## What The Data Means

**There are no invented population counts or percentages.** The repository includes real Census estimates for 1,807 U.S. geographies (cities with 25,000+ age-5+ residents where the source has data, states/DC/PR and the U.S.). Coverage is a bounded catalog, not every possible location worldwide.

- **U.S. cities:** ACS 2020–2024 five-year table **C16001**, which combines some languages into broad categories.
- **States and the U.S.:** the same ACS release, table **B16001**, with more language detail.
- **Denominator:** all residents age 5+ in the selected geography. Hiding English does not renormalize percentages. “English” means English only at home, not everyone who speaks English.
- **Uncertainty:** category details show the estimated count and its 90% margin of error. Ranking by estimates is not proof that closely estimated categories have a statistically reliable order.
- **Grouped categories:** counts remain grouped. For example, Chinese includes Mandarin/Cantonese; the displayed Mandarin phrase is explicitly an example. Unmapped categories show Multiple languages rather than invented translations. You may choose an example language for learning; this does not assign the category's population to that language.
- **Country/territory profiles:** mostly curated learning-language selections, **not measured top-five population rankings**, and intentionally without percentages. They are incomplete and omit languages not yet in the starter phrase library. Australia is the exception: it uses published 2021 home-language percentages. Different measures/years are not directly comparable.
- **Phrase library:** starter, common forms, not certified translations. Region, context, politeness and gender may change the best expression. Romanization is approximate; review with a fluent speaker before high-stakes use. Yes/No equivalents are especially context-dependent. [Wikivoyage phrasebooks](https://en.wikivoyage.org/wiki/Phrasebooks) provide additional learning references; the app's short phrase entries are independently assembled, not a scraped dictionary.

Official sources:

- [Census language-use methodology](https://www.census.gov/topics/population/language-use/about.html)
- [C16001 city-category source file](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-c16001.dat)
- [B16001 detailed source file](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-b16001.dat)
- [Census geography names](https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/documentation/Geos20245YR.txt)
- [Census place coordinates](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_place_national.zip)
- [Australia 2021 Census language use](https://www.abs.gov.au/statistics/people/people-and-communities/cultural-diversity-census/2021)

## Audio, Size And Offline Use

Speaker buttons use the device's Web Speech voices. No audio recordings, paid API, translation service, API keys or backend are bundled. If a matching voice is unavailable, that button is disabled with an explanatory tooltip. Accents, quality and offline availability differ by phone; a device voice may contact its own service. It never substitutes an unrelated language voice. Cantonese requires a matching Hong Kong/Cantonese voice.

The U.S. snapshot is about **627 KB uncompressed**. Phrase text is about 8 KB. All page data is read from files in this repository; there are no live Census queries, analytics or automatic location requests. Local files still need an initial HTTP download. The service worker caches successful same-origin GETs after installation for offline revisits; visit/reload a design online before relying on it offline. Unvisited pages and voices are not guaranteed offline. Gallery preview images are separate and lazy-loaded.

## Local Development And Publishing

No framework, install or build is required to serve the checked-in site. Use Cursor Live Server from Websites For Fun at `/languages/`, or run `node tools/serve.cjs` and visit **http://127.0.0.1:5198/**. Opening HTML directly as a file is not supported because the app uses modules and a local JSON snapshot.

Run `node tools/build.mjs` after changing the staging HTML template or design list. It regenerates the gallery, ten app entry pages, manifests and service worker. Data and handwritten shared modules are not overwritten. `python3 tools/fetch-census.py` rebuilds the Census snapshot from official bulk files without an API key; it is an explicit maintenance operation, not a browser action. The large source download is reduced to the small checked-in snapshot.

GitHub Pages: deploy **main / root**. All paths work under `/languages/`. No Firebase, Google Sheet, GitHub Action or secrets are required.

## Verification

`node tests/browser.cjs` starts its own local server and tests all ten designs at 320px, 390px and 1280px, with all four palette settings. It covers data/category totals, real Oakland data, search, both views, expanded counts, bookmarking/reload, practice, audio controls with simulated voices, modal dismissal, sharing/QR, sources and the full language library. It also captures real gallery previews and phone/desktop screenshots. Run `node tools/icons.cjs` to regenerate the code-drawn globe PNGs.

Browser tests need Playwright and Chrome. They do not establish native voice quality on physical phones; audio availability and pronunciation still deserve a phone check. Keep this file and **AI_README.md** updated.
