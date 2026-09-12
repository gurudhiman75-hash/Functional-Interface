export type GeoPhy001Cp001DivisionRow = {
  id: string;
  division: string;
  primaryDescription: string;
  contrastDescription: string;
  broadLocation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES";

export const GEO_PHY_001_CP001_DIVISION_ROWS_V1: readonly GeoPhy001Cp001DivisionRow[] = Object.freeze([
  {
    id: "himalayan-mountains",
    division: "The Himalayan Mountains",
    primaryDescription: "geologically young and structurally fold mountains along the northern border of India",
    contrastDescription: "young fold-mountain region",
    broadLocation: "northern India",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-himalayan-young-fold"],
  },
  {
    id: "northern-plains",
    division: "The Northern Plains",
    primaryDescription: "an extensive alluvial plain formed by the Indus, Ganga and Brahmaputra river systems and their tributaries",
    contrastDescription: "alluvial depositional plain",
    broadLocation: "the region south of the Himalayas",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-northern-plains-alluvial"],
  },
  {
    id: "peninsular-plateau",
    division: "The Peninsular Plateau",
    primaryDescription: "an ancient tableland composed largely of old crystalline, igneous and metamorphic rocks",
    contrastDescription: "old stable tableland",
    broadLocation: "peninsular India",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-peninsular-old-tableland"],
  },
  {
    id: "indian-desert",
    division: "The Indian Desert",
    primaryDescription: "an arid region of undulating sandy plain lying mainly to the west of the Aravali Hills",
    contrastDescription: "arid sandy region",
    broadLocation: "western India",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-indian-desert-arid"],
  },
  {
    id: "coastal-plains",
    division: "The Coastal Plains",
    primaryDescription: "coastal lowlands extending along the Arabian Sea and the Bay of Bengal margins of the Peninsular Plateau",
    contrastDescription: "coastal lowland region",
    broadLocation: "the eastern and western coasts",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-coastal-plains-margins"],
  },
  {
    id: "islands",
    division: "The Islands",
    primaryDescription: "the offshore island groups of India, including Lakshadweep in the Arabian Sea and Andaman and Nicobar in the Bay of Bengal",
    contrastDescription: "offshore island region",
    broadLocation: "the Arabian Sea and the Bay of Bengal",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-phy-001-cp001-island-groups"],
  },
]);

export const GEO_PHY_001_CP001_DIVISION_NAMES_V1 = Object.freeze(
  GEO_PHY_001_CP001_DIVISION_ROWS_V1.map((row) => row.division),
);
