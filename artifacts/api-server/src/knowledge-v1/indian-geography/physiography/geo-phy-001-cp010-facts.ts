export const GEO_PHY_001_CP010_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
  govt: "GOVT-INDIA-GEOGRAPHY-REGIONAL-LOCATION",
} as const);

export type GeoPhy001Cp010FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP010_FACTS_V1: readonly GeoPhy001Cp010FactRow[] = Object.freeze([
  { id: "malwa", fact: "The Malwa Plateau lies mainly in western Madhya Pradesh and extends into southeastern Rajasthan.", shortFact: "Malwa: western Madhya Pradesh and southeastern Rajasthan", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-malwa-mp-rajasthan"] },
  { id: "bundelkhand", fact: "Bundelkhand spreads across northern Madhya Pradesh and southern Uttar Pradesh.", shortFact: "Bundelkhand: northern Madhya Pradesh and southern Uttar Pradesh", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-bundelkhand-mp-up"] },
  { id: "baghelkhand", fact: "Baghelkhand lies mainly in northeastern Madhya Pradesh and extends into southeastern Uttar Pradesh.", shortFact: "Baghelkhand: northeastern Madhya Pradesh and southeastern Uttar Pradesh", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-baghelkhand-mp-up"] },
  { id: "chotanagpur", fact: "The Chota Nagpur Plateau lies mainly in Jharkhand and extends into nearby parts of Odisha, West Bengal and Chhattisgarh.", shortFact: "Chota Nagpur lies mainly in Jharkhand", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.class11], sourceFactIds: ["geo-phy-001-cp010-chotanagpur-jharkhand"] },
  { id: "ranchi", fact: "The Ranchi Plateau is an important part of the Chota Nagpur Plateau in Jharkhand.", shortFact: "Ranchi Plateau: Jharkhand", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-ranchi-jharkhand"] },
  { id: "meghalaya", fact: "The Meghalaya Plateau lies in Meghalaya. The Garo, Khasi and Jaintia Hills occur across it from west to east.", shortFact: "Meghalaya Plateau: Garo, Khasi and Jaintia Hills", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.class11], sourceFactIds: ["geo-phy-001-cp010-meghalaya-garo-khasi-jaintia"] },
  { id: "karbi", fact: "The Karbi Anglong plateau and hills are in Assam.", shortFact: "Karbi Anglong: Assam", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-karbi-anglong-assam"] },
  { id: "north-cachar", fact: "The North Cachar Hills, now largely within Dima Hasao district, are in Assam.", shortFact: "North Cachar Hills: Assam", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-north-cachar-assam"] },
  { id: "deccan", fact: "The Deccan Plateau extends across large parts of Maharashtra, Karnataka, Telangana and Andhra Pradesh.", shortFact: "Deccan Plateau: large parts of Maharashtra, Karnataka, Telangana and Andhra Pradesh", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.class11], sourceFactIds: ["geo-phy-001-cp010-deccan-major-states"] },
  { id: "karnataka", fact: "The Karnataka Plateau forms part of the Deccan Plateau in Karnataka.", shortFact: "Karnataka Plateau: Karnataka", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-karnataka-plateau"] },
  { id: "telangana", fact: "The Telangana Plateau lies mainly in Telangana and forms part of the Deccan Plateau.", shortFact: "Telangana Plateau: Telangana", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-telangana-plateau"] },
  { id: "bastar", fact: "The Bastar Plateau lies mainly in southern Chhattisgarh.", shortFact: "Bastar Plateau: southern Chhattisgarh", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-bastar-chhattisgarh"] },
  { id: "nilgiri", fact: "The Nilgiri Hills lie around the meeting area of Tamil Nadu, Kerala and Karnataka.", shortFact: "Nilgiri Hills: Tamil Nadu-Kerala-Karnataka meeting area", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class9, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-nilgiri-three-states"] },
  { id: "anaimalai", fact: "The Anaimalai Hills lie along the Tamil Nadu-Kerala border region.", shortFact: "Anaimalai Hills: Tamil Nadu-Kerala border", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-anaimalai-tn-kerala"] },
  { id: "cardamom", fact: "The Cardamom Hills lie mainly in Kerala and extend towards Tamil Nadu.", shortFact: "Cardamom Hills: mainly Kerala, towards Tamil Nadu", sourceIds: [GEO_PHY_001_CP010_SOURCE_IDS.class11, GEO_PHY_001_CP010_SOURCE_IDS.govt], sourceFactIds: ["geo-phy-001-cp010-cardamom-kerala-tn"] },
]);
