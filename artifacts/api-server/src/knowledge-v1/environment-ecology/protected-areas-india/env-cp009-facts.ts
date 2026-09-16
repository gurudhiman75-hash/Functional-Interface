export type EnvCp009FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const ACT_SOURCE = "INDIA-CODE-WILDLIFE-PROTECTION-ACT-1972";
const MOEFCC_SOURCE = "MOEFCC-WILDLIFE-PROTECTED-AREAS";

export const ENV_CP009_FACT_ROWS_V1: readonly EnvCp009FactRow[] = Object.freeze([
  { id: "env-cp009-protected-area-definition", label: "Protected area definition", statement: "under the Wild Life (Protection) Act, protected area means a National Park, sanctuary, conservation reserve or community reserve", sourceIds: [ACT_SOURCE, MOEFCC_SOURCE] },
  { id: "env-cp009-sanctuary", label: "Wildlife sanctuary", statement: "sanctuary is a protected-area category declared under Chapter IV of the Wild Life (Protection) Act", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-national-park", label: "National Park", statement: "National Park is a protected-area category declared under section 35 for protecting, propagating or developing wildlife or its environment", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-conservation-reserve", label: "Conservation reserve", statement: "conservation reserve is a protected-area category declared under section 36A", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-conservation-land", label: "Conservation reserve land", statement: "a conservation reserve is declared on an area owned by Government after consultation with local communities", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-conservation-link", label: "Conservation reserve location", statement: "conservation reserves particularly include Government-owned areas adjacent to National Parks or sanctuaries and areas linking protected areas", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-community-reserve", label: "Community reserve", statement: "community reserve is a protected-area category declared under section 36C", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-community-land", label: "Community reserve land", statement: "community reserve may be declared on private or community land not already within a National Park, sanctuary or conservation reserve", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-community-voluntary", label: "Community participation", statement: "community reserve declaration requires a community or individual to have volunteered to conserve wildlife and its habitat", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-conservation-management", label: "Conservation reserve management", statement: "the conservation reserve management committee advises the Chief Wild Life Warden on conserving, managing and maintaining the reserve", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-community-management", label: "Community reserve management", statement: "the community reserve management committee is responsible for conserving, maintaining and managing the community reserve", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-biosphere-distinction", label: "Biosphere reserve distinction", statement: "biosphere reserve is not one of the four categories in the Act's statutory definition of protected area", sourceIds: [ACT_SOURCE, MOEFCC_SOURCE] },
  { id: "env-cp009-section-sanctuary", label: "Sanctuary provisions", statement: "sanctuaries are dealt with in sections 18 to 34A of Chapter IV, including declaration under section 26A", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-section-national-park", label: "National Park section", statement: "section 35 deals with declaration of National Parks", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-section-conservation", label: "Conservation reserve section", statement: "section 36A deals with declaration and management of conservation reserves", sourceIds: [ACT_SOURCE] },
  { id: "env-cp009-section-community", label: "Community reserve section", statement: "section 36C deals with declaration and management of community reserves", sourceIds: [ACT_SOURCE] },
]);

export const ENV_CP009_FACT_IDS_V1 = new Set(ENV_CP009_FACT_ROWS_V1.map((row) => row.id));
