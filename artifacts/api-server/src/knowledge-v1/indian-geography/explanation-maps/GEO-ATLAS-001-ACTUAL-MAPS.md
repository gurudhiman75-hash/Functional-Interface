# GEO-ATLAS-001 — Actual Geography Explanation Maps

**Status:** Architecture accepted for implementation; replaces schematic diagrams as the target Geography explanation visual.

## 1. Goal

Geography explanations must use real geospatial geometry, not hand-positioned relationship diagrams.

A learner map must show the actual shape and relative position of the river, state, lake, pass, source, confluence or other feature involved in the explanation. Question logic must reference semantic geography IDs only. Coordinates and linework belong to a separate versioned atlas authority.

Core pipeline:

`authoritative GIS source -> ingestion -> normalization -> named-feature matching -> simplification -> atlas bundle -> question map spec -> viewport/highlight renderer -> SVG`

Questions must never contain manually authored x/y diagram coordinates.

## 2. Data authority stack

### 2.1 India river geometry — primary

Use the National Water Informatics Centre / Government of India OGD **Shapefile of Rivers** as the primary geometry source for rivers inside India.

The published resource states that its shapefile contains major and minor rivers of the entire country and is released under NDSAP / Government Open Data licensing.

Atlas source ID:

`NWIC-OGD-INDIA-RIVERS-2022`

Use for:
- main river courses inside India
- tributary geometry
- confluence geometry where both relevant segments are covered
- river/state visual association
- local river-course explanation maps

### 2.2 India political/administrative boundaries

For political maps of India, Survey of India published/digital boundary data is the boundary standard.

Atlas source ID:

`SOI-ADMIN-BOUNDARY-AUTHORITY`

Use for:
- India outline
- state / UT boundaries
- district boundaries when required

Do not substitute arbitrary third-party political boundaries for learner-facing India maps.

NWIC OGD administrative boundaries may be used where appropriate after checking that the rendered boundary representation conforms to the Survey of India standard.

### 2.3 Hydrological boundaries

Use NWIC OGD hydrological boundary shapefiles for:
- basin
- sub-basin
- watershed

Atlas source ID:

`NWIC-OGD-HYDRO-BOUNDARIES-2022`

### 2.4 Transboundary river continuation

Some systems, especially Indus and Brahmaputra, need geometry outside India. Use a separately licensed transboundary hydrography source such as HydroRIVERS for non-India continuation when an official Indian source does not provide the needed linework.

Atlas source ID:

`HYDRORIVERS-TRANSBOUNDARY-V1`

Rules:
- Indian political boundary depiction must still follow Survey of India authority.
- Transboundary hydrography is a river-geometry authority, not a political-boundary authority.
- Source attribution and license metadata must travel with each compiled feature.

### 2.5 Optional neutral context

Natural Earth public-domain physical layers may be used for non-authoritative context such as coastline or generalized terrain only when useful. They must not override Survey of India political-boundary authority.

## 3. Raw-data policy

Do not load national shapefiles in the browser.

Raw GIS downloads are build inputs, not runtime assets.

Recommended structure:

```text
geography-atlas/
  sources/
    source-manifest.json
  ingest/
    ingest-rivers.ts
    ingest-boundaries.ts
    ingest-hydro-boundaries.ts
  aliases/
    river-aliases.ts
    place-aliases.ts
  compiled/
    geo-atlas-001-rivers.topo.json
    geo-atlas-001-boundaries.topo.json
    geo-atlas-001-points.json
    geo-atlas-001-manifest.json
```

The repository may store only the compact compiled atlas if raw-source licensing or repository size makes storing the source archive undesirable. The source manifest must retain the source URL, publication metadata, checksum, retrieval date, license and transformation history.

## 4. Coordinate system

Normalize all atlas geometry to WGS84 longitude/latitude (`EPSG:4326`).

Rendering may project that geometry to screen coordinates, but the stored atlas coordinates remain geographic coordinates.

No question or content record may contain presentation x/y coordinates as geography truth.

## 5. Feature IDs

Every geographic object receives a stable canonical ID.

Examples:

```text
geo:river:indus
geo:river:jhelum
geo:river:chenab
geo:river:ravi
geo:river:beas
geo:river:satluj
geo:lake:wular
geo:source:beas-kund
geo:pass:rohtang
geo:place:tandi
geo:place:harike
geo:place:trimmu
geo:place:panjnad
geo:state:punjab
geo:state:himachal-pradesh
```

The alias layer resolves source spellings and variants such as `Satluj` / `Sutlej` without changing the canonical content-engine name.

## 6. Compiled atlas feature contract

```ts
type GeographyAtlasFeatureV1 = {
  atlasVersion: "GEO_ATLAS_001";
  featureId: string;
  featureType: "river" | "boundary" | "basin" | "lake" | "source" | "pass" | "place" | "dam" | "reservoir";
  canonicalName: string;
  aliases: string[];
  geometry: GeoJSON.Geometry;
  bbox: [number, number, number, number];
  source: {
    authorityId: string;
    sourceUrl: string;
    licenseId: string;
    retrievedAt: string;
    rawChecksum: string;
  };
  transform: {
    sourceCrs: string;
    normalizedCrs: "EPSG:4326";
    simplificationLevel: "none" | "mini-map" | "overview";
    geometryChecksum: string;
  };
  review: {
    status: "REVIEW_REQUIRED" | "APPROVED";
    reviewerNotes?: string;
  };
};
```

## 7. Question-side map contract

Questions reference atlas features; they do not supply geometry.

```ts
type GeographyExplanationAtlasRequestV1 = {
  schemaVersion: "GEO_EXPLANATION_ATLAS_REQUEST_V1";
  atlasVersion: "GEO_ATLAS_001";
  mapKind: "SOURCE" | "TRIBUTARY" | "CONFLUENCE" | "COURSE" | "SYSTEM" | "STATE_ASSOCIATION" | "BASIN";
  primaryFeatureIds: string[];
  contextFeatureIds: string[];
  markerFeatureIds: string[];
  labelFeatureIds: string[];
  viewport: "AUTO" | {
    bbox: [number, number, number, number];
  };
  sourceFactIds: string[];
};
```

Example — Beas joins Satluj at Harike:

```ts
{
  schemaVersion: "GEO_EXPLANATION_ATLAS_REQUEST_V1",
  atlasVersion: "GEO_ATLAS_001",
  mapKind: "CONFLUENCE",
  primaryFeatureIds: ["geo:river:beas", "geo:river:satluj"],
  contextFeatureIds: ["geo:state:punjab"],
  markerFeatureIds: ["geo:place:harike"],
  labelFeatureIds: ["geo:river:beas", "geo:river:satluj", "geo:place:harike"],
  viewport: "AUTO",
  sourceFactIds: ["geo-riv-001-cp002-beas-joins-satluj", "geo-riv-001-cp002-beas-satluj-confluence-harike"]
}
```

## 8. Renderer behavior

The renderer must:

1. Load approved atlas features by ID.
2. Compute the bounding box of the primary features and markers.
3. Add controlled padding.
4. Clip long rivers to the explanation viewport where appropriate.
5. Project real longitude/latitude geometry into the mini-map SVG.
6. Draw relevant river segments strongly.
7. Draw nearby river/state/basin context lightly.
8. Place only 2–5 useful labels.
9. Use collision-aware label placement.
10. Mark exact source/confluence/pass/dam coordinates when present.
11. Include a small north indicator and scale bar when scale is meaningful.
12. Include source attribution outside or beneath the map where required by the dataset license.

The renderer must never move a feature to make the composition look better.

## 9. Mini-map sizes

Recommended default learner explanation size:

- desktop: `360 x 210`
- mobile: responsive width, same aspect ratio

Map density should remain low enough to understand in one glance.

## 10. Detail levels

Compile multiple topology-preserving detail levels rather than sending raw shapefile complexity.

Suggested bundles:

- `mini-map`: optimized for ~360 px explanations
- `overview`: optimized for chapter-level maps
- `full`: editorial/debug only

Simplification must preserve confluences and connected river topology. A confluence point may never be simplified into disconnected lines.

## 11. Named-river matching

A raw shapefile may split one named river into several line features. Ingestion must therefore:

1. inspect source attributes;
2. normalize names;
3. resolve aliases;
4. merge contiguous segments that belong to the same canonical river;
5. preserve tributary branches as distinct features;
6. validate expected confluences;
7. emit a geometry review report.

No fuzzy name match is allowed to silently become approved atlas geometry.

## 12. CP002 target maps

For the Indus System review, the first actual-map set should include:

1. Beas source — Beas Kund / Rohtang area
2. Beas → Satluj confluence at Harike
3. Jhelum source at Verinag + Srinagar + Wular course
4. Chandra + Bhaga confluence at Tandi forming Chenab
5. Satluj entering India through Shipkila
6. Jhelum → Chenab at Trimmu
7. Satluj → Chenab at Panjnad
8. Indus-system overview with the five principal tributaries

For source/confluence facts outside India, use the approved transboundary river geometry authority and reviewed coordinates. Do not invent positions from text descriptions.

## 13. Visual style

Actual geography remains visually simple:

- light land background
- official/approved boundary line in muted stroke
- context rivers thin and muted
- answer river(s) thicker and highlighted
- relevant point marker
- maximum 5 labels
- no road-map clutter
- no commercial map tiles
- no screenshot dependencies

The map should look like a clean exam atlas inset, not Google Maps.

## 14. Quality gates

A learner-facing actual map fails if:

- any referenced atlas feature is missing;
- any primary geometry is unreviewed;
- source/license metadata is missing;
- Indian political boundaries are not from/conformant with the accepted boundary authority;
- a confluence is visually disconnected;
- the highlighted river is not inside the computed viewport;
- marker-to-geometry distance exceeds the accepted tolerance;
- label collision hides the answer feature;
- the renderer falls back to schematic geometry;
- the map is shown as authoritative while `notToScale` or hand-positioned coordinates remain.

## 15. Lifecycle rule

`SCHEMATIC` diagrams may remain as internal debugging aids, but they are **not learner-map authority** and must not be used as the approval target for Geography explanations.

Learner-facing Geography explanation maps require:

`geometryMode = ATLAS`

and an approved `GEO_ATLAS_001` feature bundle.

## 16. Implementation order

### A. Atlas ingestion proof
- acquire NWIC OGD river shapefile;
- record source/license/checksum;
- ingest to WGS84;
- inspect attributes and aliases;
- extract Beas + Satluj + Harike area;
- render first actual confluence map.

### B. Boundary layer
- ingest approved India/state boundary data;
- validate against Survey of India boundary standard;
- add Punjab/Himachal context.

### C. CP002 pilot
- build the eight target maps above;
- compare each with authoritative source material;
- review visually in Question Studio;
- freeze atlas features only after editorial approval.

### D. Generalize
- Ganga/Brahmaputra
- peninsular rivers
- dams/reservoirs
- mountains/passes
- parks
- physical divisions

## 17. Acceptance criterion

A reviewer should be able to look at the mini-map and say:

> This is the real geographic course/location, simplified for a small exam explanation, not a diagram pretending to be a map.
