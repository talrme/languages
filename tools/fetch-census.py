"""Generate the checked-in, offline ACS snapshot; never called by the website."""
import csv
import io
import json
import pathlib
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
YEAR = 2024
CODES = [2] + list(range(3, 127, 3))
FIELDS = [f"B16001_{code:03}E" for code in [1] + CODES]

def get(url):
    with urllib.request.urlopen(url, timeout=180) as response:
        return response.read()

def records(url):
    data = json.loads(get(url))
    return [dict(zip(data[0], row)) for row in data[1:]]

base = f"https://api.census.gov/data/{YEAR}/acs/acs5"
variables = json.loads(get(base + "/groups/B16001.json"))["variables"]
categories = {str(code): variables[f"B16001_{code:03}E"]["label"].replace("Estimate!!Total:!!", "").rstrip(":") for code in CODES}
select = "NAME," + ",".join(FIELDS)
print("Downloading official ACS table-based files (no API key required)...", flush=True)
bulk = f"https://www2.census.gov/programs-surveys/acs/summary_file/{YEAR}/table-based-SF/"
with urllib.request.urlopen(bulk + f"documentation/Geos{YEAR}5YR.txt", timeout=180) as response:
    geo_names = {row["GEO_ID"]: row["NAME"] for row in csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig"), delimiter="|") if row["GEO_ID"][:3] in ["010", "040", "160"] and row["GEO_ID"][3:7] == "0000"}
rows = list(csv.DictReader(io.StringIO(get(bulk + f"data/5YRData/acsdt5y{YEAR}-b16001.dat").decode("utf-8-sig")), delimiter="|"))
places, states, national = [], [], []
for source in rows:
    geo = source["GEO_ID"]
    kind = geo[:3]
    if kind not in ["010", "040", "160"] or geo[3:7] != "0000" or geo not in geo_names:
        continue
    row = {"NAME": geo_names[geo], **{f"B16001_{code:03}E": source[f"B16001_E{code:03}"] for code in [1] + CODES}}
    row["moe"] = {str(code): source[f"B16001_M{code:03}"] for code in CODES}
    if kind != "010":
        row["state"] = geo.split("US")[1][:2]
    if kind == "160":
        row["place"] = geo.split("US")[1][2:]
    {"010": national, "040": states, "160": places}[kind].append(row)
print("Downloading Census place coordinates...", flush=True)
archive = zipfile.ZipFile(io.BytesIO(get(f"https://www2.census.gov/geo/docs/maps-data/data/gazetteer/{YEAR}_Gazetteer/{YEAR}_Gaz_place_national.zip")))
text = archive.read(archive.namelist()[0]).decode("utf-8-sig")
coordinates = {}
for row in csv.DictReader(io.StringIO(text), delimiter="\t"):
    row = {key.strip(): value.strip() for key, value in row.items()}
    coordinates[row["GEOID"]] = [float(row["INTPTLAT"]), float(row["INTPTLONG"])]

def pack(row, kind):
    total = int(row[FIELDS[0]] or 0)
    if total <= 0:
        return None
    key = row.get("state", "") + row.get("place", "")
    values = [[code, int(row.get(f"B16001_{code:03}E") or 0), int(row["moe"][str(code)]) if row["moe"][str(code)].isdigit() else None] for code in CODES]
    values = sorted([value for value in values if value[1] > 0], key=lambda value: -value[1])
    # Retain all categories so hiding English or expanding the list never changes the denominator.
    return {"id": "us-" + (key or "national"), "name": row["NAME"], "kind": kind, "total": total, "values": values, **({"coords": coordinates[key]} if key in coordinates else {})}

locations = [pack(row, "city") for row in places if int(row[FIELDS[0]] or 0) >= 25000]
locations += [pack(row, "state") for row in states] + [pack(row, "country") for row in national]
locations = [row for row in locations if row]
print("Reading city-level C16001 categories from the bulk file...", flush=True)
c_codes = [2] + list(range(3, 37, 3))
c_variables = json.loads(get(base + "/groups/C16001.json"))["variables"]
categories.update({"c" + str(code): c_variables[f"C16001_{code:03}E"]["label"].replace("Estimate!!Total:!!", "").rstrip(":") for code in c_codes})
with urllib.request.urlopen(bulk + f"data/5YRData/acsdt5y{YEAR}-c16001.dat", timeout=180) as response:
    for row in csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig"), delimiter="|"):
        geo = row["GEO_ID"]
        if not geo.startswith("1600000US") or geo not in geo_names:
            continue
        total = int(row["C16001_E001"] or 0)
        if total < 25000:
            continue
        key = geo.split("US")[1]
        values = [["c" + str(code), int(row[f"C16001_E{code:03}"] or 0), int(row[f"C16001_M{code:03}"]) if row[f"C16001_M{code:03}"].isdigit() else None] for code in c_codes]
        values = sorted([value for value in values if value[1] > 0], key=lambda value: -value[1])
        locations.append({"id": "us-" + key, "name": geo_names[geo], "kind": "city", "table": "C16001", "total": total, "values": values, **({"coords": coordinates[key]} if key in coordinates else {})})
snapshot = {"year": YEAR, "source": bulk + f"data/5YRData/acsdt5y{YEAR}-b16001.dat", "basis": "Language spoken at home, residents age 5+; ACS 2020–2024 five-year estimates. Only places available in the published detailed table are included.", "categories": categories, "locations": locations}
(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data/us.json").write_text(json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")))
print(f"Saved {len(locations)} real locations; {(ROOT / 'data/us.json').stat().st_size:,} bytes", flush=True)
