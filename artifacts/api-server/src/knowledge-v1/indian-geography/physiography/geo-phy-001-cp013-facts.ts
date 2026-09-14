export const GEO_PHY_001_CP013_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
  govt: "GOVT-INDIA-GEOGRAPHY-REGIONAL-LOCATION",
} as const);

export type GeoPhy001Cp013FactRow = {
  id: string;
  fact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const sourceIds = Object.freeze([
  GEO_PHY_001_CP013_SOURCE_IDS.class9,
  GEO_PHY_001_CP013_SOURCE_IDS.class11,
  GEO_PHY_001_CP013_SOURCE_IDS.govt,
]);

const rawFacts: Readonly<Record<string, string>> = Object.freeze({
  major: "India's six major physiographic divisions are the Himalayas, Northern Plains, Peninsular Plateau, Indian Desert, Coastal Plains and Islands.",
  himalaya: "The Himalayas form a young mountain system along northern India.",
  himadri: "The Great Himalaya or Himadri is the northernmost and highest Himalayan range.",
  himachal: "The Lesser Himalaya or Himachal lies south of the Great Himalaya.",
  shiwalik: "The Shiwalik is the outermost Himalayan range.",
  plains: "The Northern Plains were built by river deposits from the Indus, Ganga and Brahmaputra systems.",
  bhabar: "Bhabar is a narrow pebble belt along the Himalayan foothills where many streams disappear into porous deposits.",
  terai: "Terai lies south of Bhabar and is a wet, marshy belt where many streams re-emerge.",
  bhangar: "Bhangar is older alluvium and commonly occurs above the active floodplain.",
  khadar: "Khadar is newer alluvium renewed by floods in active floodplains.",
  plateau: "The Peninsular Plateau is an old, stable landmass covering much of central and southern India.",
  central: "The Central Highlands lie mainly north of the Narmada, while the Deccan Plateau lies mainly south of it.",
  deccan: "The Deccan Plateau forms a broad triangular plateau south of the Narmada.",
  desert: "The Indian Desert lies mainly west of the Aravali Range and has many sand dunes.",
  luni: "The Luni is the main river of the Indian Desert region.",
  wg: "The Western Ghats are generally higher and more continuous than the Eastern Ghats.",
  eg: "The Eastern Ghats are discontinuous and are cut by rivers flowing towards the Bay of Bengal.",
  westcoast: "The Western Coastal Plain is narrow and lies between the Western Ghats and the Arabian Sea.",
  eastcoast: "The Eastern Coastal Plain is broader and lies between the Eastern Ghats and the Bay of Bengal.",
  eastdelta: "Large east-flowing rivers such as the Mahanadi, Godavari, Krishna and Kaveri form deltas on the eastern coast.",
  lakshadweep: "Lakshadweep lies in the Arabian Sea and is known for coral islands.",
  andaman: "The Andaman and Nicobar Islands lie in the Bay of Bengal in a long north-south chain.",
  nilgiri: "The Nilgiri Hills lie where the Western and Eastern Ghats meet.",
  anamudi: "Anamudi is a high peak in the Western Ghats of Kerala.",
  guru: "Guru Shikhar is the highest peak of the Aravali Range and lies in Rajasthan.",
  zoji: "Zoji La links the Kashmir Valley with Ladakh on the Srinagar-Leh route.",
  rohtang: "Rohtang Pass links Kullu Valley with Lahaul-Spiti in Himachal Pradesh.",
  nathu: "Nathu La is a Himalayan pass in Sikkim on the route towards Tibet.",
  palghat: "Palghat Gap lies between the Nilgiri and Anaimalai Hills and gives a route between Kerala and Tamil Nadu.",
  kashmir: "Kashmir Valley lies between the Greater Himalaya and the Pir Panjal range.",
  kullu: "Kullu Valley lies along the Beas River in Himachal Pradesh.",
  dehradun: "Dehra Dun lies between the Lesser Himalaya and the Shiwalik range.",
  malwa: "The Malwa Plateau lies mainly in Madhya Pradesh and extends into Rajasthan.",
  chota: "The Chota Nagpur Plateau lies mainly in Jharkhand.",
  meghalaya: "The Meghalaya Plateau includes the Garo, Khasi and Jaintia Hills.",
  karbi: "Karbi Anglong and the North Cachar Hills are in Assam.",
  bastar: "The Bastar Plateau lies mainly in Chhattisgarh.",
  anaimalai: "The Anaimalai Hills lie along the Tamil Nadu-Kerala border region.",
  cardamom: "The Cardamom Hills lie mainly in Kerala.",
  bhor: "Bhor Ghat is on the Mumbai-Pune route through the Western Ghats.",
  thal: "Thal Ghat is on the Mumbai-Nashik route through the Western Ghats."
});

export const GEO_PHY_001_CP013_FACTS_V1: readonly GeoPhy001Cp013FactRow[] = Object.freeze(
  Object.entries(rawFacts).map(([id, fact]) =>
    Object.freeze({
      id,
      fact,
      sourceIds,
      sourceFactIds: Object.freeze([`geo-phy-001-cp013-${id}`]),
    }),
  ),
);
