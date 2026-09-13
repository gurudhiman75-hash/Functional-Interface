export const GEO_PHY_001_CP008_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
} as const);

export type GeoPhy001Cp008FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP008_FACTS_V1: readonly GeoPhy001Cp008FactRow[] = Object.freeze([
  {
    id: "aravali-trend",
    fact: "The Aravali Hills are highly eroded and extend from Gujarat towards Delhi in a southwest-to-northeast direction.",
    shortFact: "Aravali extends from Gujarat towards Delhi in a southwest-to-northeast direction",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-aravali-trend"],
  },
  {
    id: "guru-shikhar",
    fact: "Guru Shikhar, in the Mount Abu area of Rajasthan, is the highest peak of the Aravali Range.",
    shortFact: "Guru Shikhar is the highest peak of the Aravali Range",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-guru-shikhar-aravali"],
  },
  {
    id: "narmada-between",
    fact: "The Narmada valley lies between the Vindhya Range to the north and the Satpura Range to the south.",
    shortFact: "Narmada lies between Vindhya in the north and Satpura in the south",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9, GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-narmada-vindhya-satpura"],
  },
  {
    id: "deccan-edges",
    fact: "The Western Ghats and Eastern Ghats mark the western and eastern edges of the Deccan Plateau respectively.",
    shortFact: "Western and Eastern Ghats form the western and eastern edges of the Deccan Plateau",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp008-deccan-ghat-edges"],
  },
  {
    id: "western-higher",
    fact: "The Western Ghats are higher than the Eastern Ghats.",
    shortFact: "Western Ghats are higher than Eastern Ghats",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp008-western-ghats-higher"],
  },
  {
    id: "western-continuous",
    fact: "The Western Ghats form a more continuous mountain wall and are crossed mainly through passes.",
    shortFact: "Western Ghats are more continuous and are crossed mainly through passes",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp008-western-ghats-continuous"],
  },
  {
    id: "eastern-discontinuous",
    fact: "The Eastern Ghats are discontinuous and are cut by rivers flowing towards the Bay of Bengal.",
    shortFact: "Eastern Ghats are discontinuous and cut by east-flowing rivers",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp008-eastern-ghats-discontinuous"],
  },
  {
    id: "sahyadri",
    fact: "Sahyadri is a widely used name for the Western Ghats, especially in their northern and central part.",
    shortFact: "Sahyadri is a name used for the Western Ghats",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-sahyadri-western-ghats"],
  },
  {
    id: "nilgiri-meeting",
    fact: "The Nilgiri Hills are at the southern meeting zone of the Western and Eastern Ghats.",
    shortFact: "Nilgiri Hills lie where the Western and Eastern Ghats meet in the south",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-nilgiri-ghats-meeting"],
  },
  {
    id: "anaimalai-cardamom",
    fact: "South of the Nilgiri Hills, the Western Ghats continue through the Anaimalai and Cardamom Hills.",
    shortFact: "Anaimalai and Cardamom Hills are southern parts of the Western Ghats system",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-anaimalai-cardamom-western-ghats"],
  },
  {
    id: "anamudi",
    fact: "Anamudi is a major peak of the Western Ghats in Kerala and rises to about 2,695 metres.",
    shortFact: "Anamudi is a major Western Ghats peak in Kerala",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9, GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-anamudi-western-ghats"],
  },
  {
    id: "doddabetta",
    fact: "Doddabetta is the highest peak of the Nilgiri Hills and rises to about 2,637 metres.",
    shortFact: "Doddabetta is the highest peak of the Nilgiri Hills",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9, GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-doddabetta-nilgiri"],
  },
  {
    id: "mahendragiri",
    fact: "Mahendragiri is an important peak of the Eastern Ghats in Odisha.",
    shortFact: "Mahendragiri is an Eastern Ghats peak in Odisha",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp008-mahendragiri-eastern-ghats"],
  },
  {
    id: "mahadev-maikal",
    fact: "The Mahadev Hills and Maikal Range belong to the broader Satpura highland system.",
    shortFact: "Mahadev Hills and Maikal Range are linked with the Satpura system",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class9, GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-mahadev-maikal-satpura"],
  },
  {
    id: "kaimur-vindhya",
    fact: "The Kaimur Range is an eastern extension of the Vindhyan system.",
    shortFact: "Kaimur Range is an eastern extension of the Vindhyan system",
    sourceIds: [GEO_PHY_001_CP008_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp008-kaimur-vindhya"],
  },
]);
