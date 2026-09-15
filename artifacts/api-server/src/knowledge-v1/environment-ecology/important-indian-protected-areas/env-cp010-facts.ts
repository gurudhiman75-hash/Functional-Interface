export type EnvCp010FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const CORBETT_SOURCE = "UTTARAKHAND-TOURISM-CORBETT";
const KAZIRANGA_SOURCE = "UNESCO-KAZIRANGA";
const GIR_SOURCE = "GUJARAT-FOREST-GIR";
const KEOLADEO_SOURCE = "UNESCO-KEOLADEO";
const SUNDARBANS_SOURCE = "UNESCO-SUNDARBANS";
const GHNP_SOURCE = "HIMACHAL-TOURISM-GHNP";
const SILENT_SOURCE = "KERALA-FOREST-SILENT-VALLEY";
const KANHA_SOURCE = "MP-GOV-KANHA";
const RANTHAMBORE_SOURCE = "RAJASTHAN-FOREST-RANTHAMBORE";
const HEMIS_SOURCE = "LADAKH-GOV-HEMIS";

export const ENV_CP010_FACT_ROWS_V1: readonly EnvCp010FactRow[] = Object.freeze([
  { id: "env-cp010-corbett-state", label: "Corbett location", statement: "Jim Corbett National Park is in Uttarakhand", sourceIds: [CORBETT_SOURCE] },
  { id: "env-cp010-corbett-first", label: "Corbett historical identity", statement: "Jim Corbett National Park is India's first national park, created in 1936", sourceIds: [CORBETT_SOURCE] },
  { id: "env-cp010-corbett-river", label: "Corbett river", statement: "the Ramganga River is an important river of the Corbett landscape", sourceIds: [CORBETT_SOURCE] },

  { id: "env-cp010-kaziranga-state", label: "Kaziranga location", statement: "Kaziranga National Park is in Assam", sourceIds: [KAZIRANGA_SOURCE] },
  { id: "env-cp010-kaziranga-rhino", label: "Kaziranga wildlife", statement: "Kaziranga is a major stronghold of the Indian one-horned rhinoceros", sourceIds: [KAZIRANGA_SOURCE] },
  { id: "env-cp010-kaziranga-floodplain", label: "Kaziranga landscape", statement: "Kaziranga represents the Brahmaputra Valley floodplain with wet alluvial grasslands", sourceIds: [KAZIRANGA_SOURCE] },

  { id: "env-cp010-gir-state", label: "Gir location", statement: "Gir National Park and Sanctuary is in Gujarat", sourceIds: [GIR_SOURCE] },
  { id: "env-cp010-gir-lion", label: "Gir wildlife", statement: "Gir is the last natural home and principal wild refuge of the Asiatic lion", sourceIds: [GIR_SOURCE] },
  { id: "env-cp010-gir-saurashtra", label: "Gir region", statement: "Gir lies in the Saurashtra region of Gujarat", sourceIds: [GIR_SOURCE] },

  { id: "env-cp010-keoladeo-state", label: "Keoladeo location", statement: "Keoladeo National Park is in Bharatpur, Rajasthan", sourceIds: [KEOLADEO_SOURCE] },
  { id: "env-cp010-keoladeo-wetland", label: "Keoladeo habitat", statement: "Keoladeo is a managed wetland important for resident and migratory waterbirds", sourceIds: [KEOLADEO_SOURCE] },
  { id: "env-cp010-keoladeo-flyway", label: "Keoladeo birds", statement: "Keoladeo is an important wintering ground on the Central Asian migratory flyway", sourceIds: [KEOLADEO_SOURCE] },

  { id: "env-cp010-sundarbans-state", label: "Sundarbans location", statement: "Sundarbans National Park is in West Bengal", sourceIds: [SUNDARBANS_SOURCE] },
  { id: "env-cp010-sundarbans-delta", label: "Sundarbans landscape", statement: "the Sundarbans lie in the Ganges-Brahmaputra delta and form a tidal mangrove ecosystem", sourceIds: [SUNDARBANS_SOURCE] },
  { id: "env-cp010-sundarbans-tiger", label: "Sundarbans wildlife", statement: "the Sundarbans mangrove habitat supports a major tiger population", sourceIds: [SUNDARBANS_SOURCE] },

  { id: "env-cp010-ghnp-state", label: "Great Himalayan location", statement: "Great Himalayan National Park is in Kullu district of Himachal Pradesh", sourceIds: [GHNP_SOURCE] },
  { id: "env-cp010-ghnp-landscape", label: "Great Himalayan landscape", statement: "Great Himalayan National Park has high ridges, glaciers, alpine meadows, valleys and forests", sourceIds: [GHNP_SOURCE] },
  { id: "env-cp010-ghnp-unesco", label: "Great Himalayan heritage", statement: "Great Himalayan National Park Conservation Area is a UNESCO World Heritage Site", sourceIds: [GHNP_SOURCE] },

  { id: "env-cp010-silent-state", label: "Silent Valley location", statement: "Silent Valley National Park is in Kerala in the Nilgiri Hills of the Western Ghats", sourceIds: [SILENT_SOURCE] },
  { id: "env-cp010-silent-evergreen", label: "Silent Valley habitat", statement: "Silent Valley protects tropical moist evergreen rainforest", sourceIds: [SILENT_SOURCE] },
  { id: "env-cp010-silent-river", label: "Silent Valley river", statement: "the Kunthipuzha River flows through Silent Valley National Park", sourceIds: [SILENT_SOURCE] },

  { id: "env-cp010-kanha-state", label: "Kanha location", statement: "Kanha National Park spans Mandla and Balaghat districts of Madhya Pradesh", sourceIds: [KANHA_SOURCE] },
  { id: "env-cp010-kanha-barasingha", label: "Kanha wildlife", statement: "Kanha is strongly identified with conservation of the hard-ground barasingha", sourceIds: [KANHA_SOURCE] },
  { id: "env-cp010-kanha-forest", label: "Kanha vegetation", statement: "Kanha has extensive sal and bamboo forests with open meadows", sourceIds: [KANHA_SOURCE] },

  { id: "env-cp010-ranthambore-state", label: "Ranthambore location", statement: "Ranthambore National Park is in Sawai Madhopur district of Rajasthan", sourceIds: [RANTHAMBORE_SOURCE] },
  { id: "env-cp010-ranthambore-ranges", label: "Ranthambore landscape", statement: "Ranthambore lies at the junction of the Aravalli and Vindhya ranges", sourceIds: [RANTHAMBORE_SOURCE] },
  { id: "env-cp010-ranthambore-forest", label: "Ranthambore vegetation", statement: "Ranthambore is a dry-deciduous forest landscape", sourceIds: [RANTHAMBORE_SOURCE] },

  { id: "env-cp010-hemis-ut", label: "Hemis location", statement: "Hemis National Park is in the Union Territory of Ladakh", sourceIds: [HEMIS_SOURCE] },
  { id: "env-cp010-hemis-high-altitude", label: "Hemis landscape", statement: "Hemis is a high-altitude Himalayan protected area", sourceIds: [HEMIS_SOURCE] },
  { id: "env-cp010-hemis-snow-leopard", label: "Hemis wildlife", statement: "Hemis is well known for snow-leopard habitat", sourceIds: [HEMIS_SOURCE] },
]);

export const ENV_CP010_FACT_IDS_V1 = new Set(ENV_CP010_FACT_ROWS_V1.map((row) => row.id));
