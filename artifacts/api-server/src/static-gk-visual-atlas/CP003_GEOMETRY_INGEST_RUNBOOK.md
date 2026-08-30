# CP-003 — Official India Geometry Ingest Runbook

## Objective

Create the canonical India administrative geometry bundle used by Static GK Visual Atlas scenes without substituting AI-generated, hand-drawn, or third-party political boundaries.

## Authoritative source

- Publisher: Survey of India
- Product: Administrative Boundary Database
- Product code: `OVSF/1M/7`
- Type: SHAPEFILE
- Coverage: Entire country up to district level with headquarters
- Portal: `https://onlinemaps.surveyofindia.gov.in/Digital_Products.aspx`

Survey of India currently lists this product at zero price. Its current FAQ also states that the Administrative Boundary Database is available through **Quick Access without registration or login**. Acquisition is still an interactive official-portal step: do not replace it with an unofficial mirror merely because a stable machine-download URL is not exposed to the renderer pipeline.

## Never do this

- Do not use an AI-generated India outline.
- Do not trace a screenshot/PDF to create production state boundaries.
- Do not silently substitute Natural Earth, DataMeet, Wikimedia, Google Maps, OpenStreetMap, or another political-boundary source for `OVSF/1M/7`.
- Do not commit the raw source archive to Git unless Survey of India redistribution terms have been explicitly reviewed and approved.
- Do not mark a scene `render-ready` without a SHA-256-backed ingest receipt.

## Acquisition

1. Open the official Survey of India Online Maps Portal.
2. Use **Quick Access → Administrative Boundary Database**; the current Survey of India FAQ says this dataset can be downloaded without registration/login.
3. Download product `OVSF/1M/7` directly from the official portal.
4. Record the acquisition date and original archive filename.
5. Calculate the archive SHA-256 before conversion.

Example:

```bash
sha256sum <downloaded-archive>
```

## Conversion

Convert the official shapefile to GeoJSON in WGS84 / EPSG:4326 with a pinned GDAL/ogr2ogr version. Record the exact tool version and command in the ingest receipt.

Illustrative command only — adjust the input layer name after inspecting the official archive:

```bash
ogr2ogr \
  -f GeoJSON \
  -t_srs EPSG:4326 \
  canonical-admin-raw.geojson \
  <official-input.shp>
```

Do not guess source field names. Inspect the official schema first, then call `normalizeIndiaAdminGeoJson` with the actual state/district field names.

## Canonical normalization contract

The canonical GeoJSON must:

- be a `FeatureCollection`;
- contain only Polygon/MultiPolygon administrative geometry;
- use EPSG:4326 longitude/latitude coordinates;
- expose normalized `stateName` and `stateCode` properties on every feature;
- preserve original official properties in addition to the normalized fields;
- retain district fields when available;
- include the eight Tropic-of-Cancer states required by `SGK-VIS-IND-GEO-001`.

## Ingest receipt

Create a JSON receipt matching `StaticGkGeometryIngestReceipt` with:

- `geometryId = geo.india.admin-boundaries.v1`
- `sourcePublisher = Survey of India`
- `sourceProductCode = OVSF/1M/7`
- source archive filename and SHA-256
- canonical GeoJSON SHA-256
- acquisition date
- conversion tool/version
- exact conversion command/notes
- feature count
- administrative-unit count
- reviewer identity

## Validation

Bundle and run the validator against the normalized GeoJSON and receipt. The validator fails closed when:

- the source publisher/product is not the locked Survey of India source;
- checksums are missing or malformed;
- coordinates fall outside EPSG:4326 bounds;
- normalized state names/codes are absent;
- receipt counts do not match the canonical file;
- one of the eight required Tropic-of-Cancer states is missing;
- the canonical GeoJSON digest differs from the receipt.

The **same checksum verification is repeated inside the scene-compiler gate**, so a caller cannot bypass integrity checks by invoking the compiler directly with a mutated geometry object.

The `SGK-VIS-IND-GEO-001` scene compiler then performs an additional spatial gate: latitude `23.5` must intersect every locked state and the resulting segments must preserve the fact-locked west-to-east sequence.

## Visual QA output

Once the bundle passes validation, run the Tropic scene/contact-sheet exporters. They generate the render-ready scene JSON plus 1080×1920 SVG frames at representative timestamps. This is the first visual QA stage before animation/video rendering.

The SVG renderer:

- uses a deterministic Mercator projection;
- fits only the supplied official geometry into the vertical-video safe area;
- renders the computed latitude segments rather than a screen-positioned line;
- highlights states according to the locked cue timeline;
- displays the final quiz card from the fact pack.

## QA reference

Use the latest official Survey of India Political Map of India as an independent visual reference for state/UT depiction. The geometry source of truth remains the checksummed `OVSF/1M/7` ingest, not a raster/PDF trace.

## CP-003 completion definition

CP-003 is complete only when all of the following are true:

1. official archive acquired;
2. archive checksum recorded;
3. canonical EPSG:4326 GeoJSON produced;
4. normalized schema validated;
5. canonical checksum recorded and verified;
6. all eight Tropic-state intersections pass;
7. west-to-east order passes;
8. SVG contact-sheet visual QA passes;
9. independent official-map visual QA passes;
10. ingest receipt reviewed;
11. geometry registry status promoted from `source-selected` to `validated`/`approved`.
