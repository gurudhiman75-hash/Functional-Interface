export const GEO_PHY_001_CP009_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
  govt: "GOV-INDIA-PHYSIOGRAPHY-PASSES-VALLEYS",
} as const);

export type GeoPhy001Cp009FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP009_FACTS_V1: readonly GeoPhy001Cp009FactRow[] = Object.freeze([
  { id: "zoji-la", fact: "Zoji La links the Kashmir Valley with Ladakh and lies on the Srinagar–Leh route.", shortFact: "Zoji La links Kashmir Valley with Ladakh", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11, GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-zoji-la-kashmir-ladakh"] },
  { id: "banihal", fact: "Banihal Pass lies in the Pir Panjal range and is associated with the route from the Jammu side into the Kashmir Valley.", shortFact: "Banihal Pass is in the Pir Panjal range", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11, GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-banihal-pir-panjal"] },
  { id: "rohtang", fact: "Rohtang Pass in Himachal Pradesh links the Kullu Valley with Lahaul–Spiti.", shortFact: "Rohtang links Kullu with Lahaul–Spiti", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-rohtang-kullu-lahaul-spiti"] },
  { id: "shipki-la", fact: "Shipki La is in Himachal Pradesh near the India–Tibet border; the Sutlej enters India through this Himalayan corridor.", shortFact: "Shipki La is in Himachal Pradesh near the Sutlej entry corridor", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11, GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-shipki-la-himachal-sutlej"] },
  { id: "nathu-la", fact: "Nathu La is a high Himalayan pass in Sikkim on the route towards Tibet/China.", shortFact: "Nathu La is in Sikkim", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-nathu-la-sikkim"] },
  { id: "khardung-la", fact: "Khardung La lies north of Leh in Ladakh and is on the route towards the Nubra Valley.", shortFact: "Khardung La lies north of Leh towards Nubra Valley", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-khardung-la-leh-nubra"] },
  { id: "kashmir-valley", fact: "The Kashmir Valley lies between the Greater Himalaya and the Pir Panjal range.", shortFact: "Kashmir Valley lies between Greater Himalaya and Pir Panjal", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11], sourceFactIds: ["geo-phy-001-cp009-kashmir-between-ranges"] },
  { id: "jhelum", fact: "The Jhelum River flows through the Kashmir Valley.", shortFact: "Jhelum flows through Kashmir Valley", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11], sourceFactIds: ["geo-phy-001-cp009-jhelum-kashmir-valley"] },
  { id: "kullu", fact: "Kullu Valley in Himachal Pradesh is formed along the Beas River.", shortFact: "Kullu Valley lies along the Beas", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-kullu-beas"] },
  { id: "kangra", fact: "Kangra Valley in Himachal Pradesh lies between the Dhauladhar range and the Shiwalik hills.", shortFact: "Kangra Valley lies between Dhauladhar and Shiwaliks", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-kangra-dhauladhar-shiwalik"] },
  { id: "dehra-dun", fact: "Dehra Dun is a longitudinal valley between the Lesser Himalaya and the Shiwalik range.", shortFact: "Dehra Dun lies between Lesser Himalaya and Shiwaliks", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class9], sourceFactIds: ["geo-phy-001-cp009-dehra-dun-longitudinal-valley"] },
  { id: "palghat", fact: "The Palghat (Palakkad) Gap lies between the Nilgiri Hills and the Anaimalai Hills and provides an important low passage between Kerala and Tamil Nadu.", shortFact: "Palghat Gap lies between Nilgiri and Anaimalai hills", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.class11, GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-palghat-nilgiri-anaimalai"] },
  { id: "bhor", fact: "Bhor Ghat is an important Western Ghats route in Maharashtra on the Mumbai–Pune corridor.", shortFact: "Bhor Ghat is on the Mumbai–Pune corridor", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-bhor-mumbai-pune"] },
  { id: "thal", fact: "Thal Ghat is an important Western Ghats route in Maharashtra on the Mumbai–Nashik corridor.", shortFact: "Thal Ghat is on the Mumbai–Nashik corridor", sourceIds: [GEO_PHY_001_CP009_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp009-thal-mumbai-nashik"] },
]);
