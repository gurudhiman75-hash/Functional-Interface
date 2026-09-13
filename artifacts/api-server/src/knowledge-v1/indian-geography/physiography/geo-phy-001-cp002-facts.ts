export type GeoPhy001Cp002LongitudinalRow = {
  id: string;
  range: string;
  alias: string;
  position: string;
  feature: string;
  altitude: string;
  associatedFeature: string;
  sourceFactIds: readonly string[];
};

export type GeoPhy001Cp002RegionalRow = {
  id: string;
  division: string;
  westBoundary: string;
  eastBoundary: string;
  note: string;
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP002_SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES";

export const GEO_PHY_001_CP002_LONGITUDINAL_ROWS_V1: readonly GeoPhy001Cp002LongitudinalRow[] = Object.freeze([
  {
    id: "himadri",
    range: "Great Himalayas",
    alias: "Himadri",
    position: "northernmost range of the Himalayas",
    feature: "the most continuous Himalayan range containing the loftiest peaks",
    altitude: "an average height of about 6,000 metres",
    associatedFeature: "perennially snowbound peaks with many glaciers",
    sourceFactIds: ["geo-phy-001-cp002-himadri-position", "geo-phy-001-cp002-himadri-height", "geo-phy-001-cp002-himadri-glaciers"],
  },
  {
    id: "himachal",
    range: "Lesser Himalayas",
    alias: "Himachal",
    position: "range lying south of the Himadri",
    feature: "a highly rugged mountain system whose ranges are mainly composed of compressed and altered rocks",
    altitude: "an average altitude of about 3,700 to 4,500 metres",
    associatedFeature: "the Kashmir, Kangra and Kullu valleys are associated with this zone",
    sourceFactIds: ["geo-phy-001-cp002-himachal-position", "geo-phy-001-cp002-himachal-altitude", "geo-phy-001-cp002-himachal-valleys"],
  },
  {
    id: "shiwalik",
    range: "Outer Himalayas",
    alias: "Shiwaliks",
    position: "outermost range of the Himalayas",
    feature: "a range composed of unconsolidated sediments brought down by rivers from the ranges farther north",
    altitude: "an altitude generally varying between about 900 and 1,100 metres",
    associatedFeature: "Duns occur between the Lesser Himalayas and the Shiwaliks",
    sourceFactIds: ["geo-phy-001-cp002-shiwalik-position", "geo-phy-001-cp002-shiwalik-altitude", "geo-phy-001-cp002-duns"],
  },
]);

export const GEO_PHY_001_CP002_REGIONAL_ROWS_V1: readonly GeoPhy001Cp002RegionalRow[] = Object.freeze([
  {
    id: "punjab",
    division: "Punjab Himalaya",
    westBoundary: "Indus",
    eastBoundary: "Satluj",
    note: "also described regionally as the Kashmir and Himachal Himalaya from west to east",
    sourceFactIds: ["geo-phy-001-cp002-punjab-himalaya-boundaries"],
  },
  {
    id: "kumaon",
    division: "Kumaon Himalayas",
    westBoundary: "Satluj",
    eastBoundary: "Kali",
    note: "lies between the Satluj and Kali rivers",
    sourceFactIds: ["geo-phy-001-cp002-kumaon-boundaries"],
  },
  {
    id: "nepal",
    division: "Nepal Himalayas",
    westBoundary: "Kali",
    eastBoundary: "Teesta",
    note: "lies between the Kali and Teesta rivers",
    sourceFactIds: ["geo-phy-001-cp002-nepal-boundaries"],
  },
  {
    id: "assam",
    division: "Assam Himalayas",
    westBoundary: "Teesta",
    eastBoundary: "Dihang",
    note: "lies between the Teesta and Dihang rivers",
    sourceFactIds: ["geo-phy-001-cp002-assam-boundaries"],
  },
]);

export const GEO_PHY_001_CP002_PURVACHAL_V1 = Object.freeze({
  division: "Purvachal",
  alternateName: "Eastern hills and mountains",
  startsBeyond: "Dihang gorge",
  orientation: "the Himalayas bend sharply south and spread along India's eastern boundary",
  components: ["Patkai Hills", "Naga Hills", "Manipur Hills", "Mizo Hills"],
  feature: "mostly parallel ranges and valleys, largely composed of strong sandstones",
  sourceFactIds: ["geo-phy-001-cp002-purvachal-location", "geo-phy-001-cp002-purvachal-components", "geo-phy-001-cp002-purvachal-feature"],
});
