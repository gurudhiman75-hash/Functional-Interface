export const GEO_RIV_001_CP005_SOURCE_AUTHORITIES_V1 = Object.freeze({
  "CWC-HYDROLOGICAL-DATA-2021": Object.freeze({
    sourceId: "CWC-HYDROLOGICAL-DATA-2021",
    authority: "Central Water Commission, Government of India",
    title: "Hydrological Data (Unclassified) Book, 2021",
    url: "https://cwc.gov.in/sites/default/files/hydrological-data-unclassified-book-2021.pdf",
    role: "PRIMARY_BASIN_TRUTH_AUTHORITY",
  }),
  "INDIA-WRIS-GODAVARI-BASIN": Object.freeze({
    sourceId: "INDIA-WRIS-GODAVARI-BASIN",
    authority: "India-WRIS / Central Water Commission",
    title: "Godavari Basin Report",
    url: "https://indiawris.gov.in/downloads/Godavari%20Basin.pdf",
    role: "GODAVARI_COURSE_AND_TRIBUTARY_AUTHORITY",
  }),
  "INDIA-WRIS-KRISHNA-BASIN": Object.freeze({
    sourceId: "INDIA-WRIS-KRISHNA-BASIN",
    authority: "India-WRIS / Central Water Commission",
    title: "Krishna Basin Report",
    url: "https://indiawris.gov.in/downloads/Krishna%20Basin.pdf",
    role: "KRISHNA_COURSE_AND_TRIBUTARY_AUTHORITY",
  }),
  "CWC-KGBO-BOOKLET": Object.freeze({
    sourceId: "CWC-KGBO-BOOKLET",
    authority: "Krishna Godavari Basin Organisation, Central Water Commission",
    title: "Krishna Godavari Basin Organisation Booklet",
    url: "https://cwc.gov.in/sites/default/files/final-kgbo-booklet-printing.pdf",
    role: "KRISHNA_BANK_TRIBUTARY_AUTHORITY",
  }),
  "CWC-MAHANADI-PMP-ATLAS": Object.freeze({
    sourceId: "CWC-MAHANADI-PMP-ATLAS",
    authority: "Central Water Commission, Government of India",
    title: "PMP Atlas for Mahanadi and Adjoining River Basins",
    url: "https://cwc.gov.in/sites/default/files/mahanadi-basin-volume-i.pdf",
    role: "MAHANADI_AND_EASTERN_RIVERS_AUTHORITY",
  }),
  "CWC-CAUVERY-PMP-ATLAS": Object.freeze({
    sourceId: "CWC-CAUVERY-PMP-ATLAS",
    authority: "Central Water Commission, Government of India",
    title: "PMP Atlas for Cauvery and Other East Flowing River Basins",
    url: "https://cwc.gov.in/sites/default/files/cauvery-basin-final-report-a4.pdf",
    role: "CAUVERY_PENNAR_AND_SOUTH_EAST_RIVERS_AUTHORITY",
  }),
  "ODISHA-TOPOGRAPHY-RIVERS": Object.freeze({
    sourceId: "ODISHA-TOPOGRAPHY-RIVERS",
    authority: "Government of Odisha",
    title: "Odisha Profile — Topography and Rivers",
    url: "https://www.odisha.gov.in/en/odisha-profile/topography",
    role: "BRAHMANI_FORMATION_AUTHORITY",
  }),
  "DHAMTARI-MAHANADI-SOURCE": Object.freeze({
    sourceId: "DHAMTARI-MAHANADI-SOURCE",
    authority: "Dhamtari District Administration, Government of Chhattisgarh",
    title: "Dhamtari District — Mahanadi source at Sihawa",
    url: "https://dhamtari.gov.in/en/about-district/",
    role: "MAHANADI_SOURCE_REGION_AUTHORITY",
  }),
  "NASHIK-GODAVARI-DAKSHIN-GANGA": Object.freeze({
    sourceId: "NASHIK-GODAVARI-DAKSHIN-GANGA",
    authority: "Nashik District Administration, Government of Maharashtra",
    title: "Nashik Culture & Heritage — Godavari Darshan",
    url: "https://nashik.gov.in/en/tourism/culture-heritage/",
    role: "GODAVARI_NICKNAME_AND_TRIMBAKESHWAR_AUTHORITY",
  }),
});

export type GeoRiv001Cp005SourceId = keyof typeof GEO_RIV_001_CP005_SOURCE_AUTHORITIES_V1;

export function toGeoRiv001Cp005FactSource(sourceId: string, locator: string) {
  const source = GEO_RIV_001_CP005_SOURCE_AUTHORITIES_V1[sourceId as GeoRiv001Cp005SourceId];
  if (!source) throw new Error(`Unknown GEO-RIV-001 CP005 source authority: ${sourceId}`);
  return {
    sourceId: source.sourceId,
    authority: source.authority,
    title: source.title,
    url: source.url,
    locator,
  };
}
