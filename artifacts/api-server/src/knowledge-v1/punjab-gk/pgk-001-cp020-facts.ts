export const PGK_001_CP020_SOURCE_IDS = Object.freeze({
  censusPunjabPca2011: "orgi-census-2011-punjab-pca",
  censusPunjabDchb2011: "orgi-census-2011-punjab-dchb",
  censusChildSexRatio2011: "orgi-census-2011-child-sex-ratio",
  censusEducationC08Punjab: "orgi-census-2011-c08-punjab",
  censusScheduledCastePunjab: "orgi-census-2011-sc-punjab",
  punjabEconomicSurveyCensusTables: "punjab-economic-survey-census-2011-tables",
} as const);

export const PGK_001_CP020_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP020_SOURCE_IDS.censusPunjabPca2011]: {
    authority: "Office of the Registrar General & Census Commissioner, India",
    title: "Census 2011 — Primary Census Abstract, Punjab",
    url: "https://censusindia.gov.in/nada/index.php/catalog/?sk=primary+census+abstract+punjab+2011",
  },
  [PGK_001_CP020_SOURCE_IDS.censusPunjabDchb2011]: {
    authority: "Directorate of Census Operations, Punjab",
    title: "Census of India 2011 — Punjab District Census Handbooks",
    url: "https://censusindia.gov.in/nada/index.php/catalog/?sk=district+census+handbook+punjab",
  },
  [PGK_001_CP020_SOURCE_IDS.censusChildSexRatio2011]: {
    authority: "Office of the Registrar General & Census Commissioner, India",
    title: "Census of India 2011 — Child Sex Ratio",
    url: "https://censusindia.gov.in/nada/index.php/catalog/42610/download/46272/Census%20of%20India%202011-Child%20Sex%20Ratio.pdf",
  },
  [PGK_001_CP020_SOURCE_IDS.censusEducationC08Punjab]: {
    authority: "Office of the Registrar General & Census Commissioner, India",
    title: "C-08: Educational level by age and sex, Punjab — 2011",
    url: "https://censusindia.gov.in/nada/index.php/catalog/44818",
  },
  [PGK_001_CP020_SOURCE_IDS.censusScheduledCastePunjab]: {
    authority: "Office of the Registrar General & Census Commissioner, India",
    title: "A-10: Individual Scheduled Caste Primary Census Abstract, Punjab — 2011",
    url: "https://censusindia.gov.in/nada/index.php/catalog/42915",
  },
  [PGK_001_CP020_SOURCE_IDS.punjabEconomicSurveyCensusTables]: {
    authority: "Government of Punjab",
    title: "Punjab Economic Survey — Census 2011 demographic tables",
    url: "https://punjab.gov.in/",
    resolutionStatus: "PINPOINT_URL_PENDING",
  },
} as const);

export const PGK_001_CP020_FACTS = Object.freeze([
  { id: "population-total", snapshot: "CENSUS_2011", value: 27743338, statement: "Punjab's Census 2011 population was 27,743,338.", sourceKeys: ["censusPunjabPca2011", "censusPunjabDchb2011"] },
  { id: "population-male", snapshot: "CENSUS_2011", value: 14639465, statement: "Punjab's male population in Census 2011 was 14,639,465.", sourceKeys: ["censusPunjabPca2011"] },
  { id: "population-female", snapshot: "CENSUS_2011", value: 13103873, statement: "Punjab's female population in Census 2011 was 13,103,873.", sourceKeys: ["censusPunjabPca2011"] },
  { id: "decadal-growth", snapshot: "CENSUS_2011", value: 13.89, unit: "percent", statement: "Punjab's population grew by 13.89% during 2001-2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "density", snapshot: "CENSUS_2011", value: 551, unit: "persons_per_sq_km", statement: "Punjab's Census 2011 population density was 551 persons per sq km.", sourceKeys: ["censusPunjabDchb2011"] },

  { id: "sex-ratio-total", snapshot: "CENSUS_2011", value: 895, statement: "Punjab's sex ratio was 895 females per 1000 males in Census 2011.", sourceKeys: ["censusPunjabPca2011", "censusPunjabDchb2011"] },
  { id: "sex-ratio-rural", snapshot: "CENSUS_2011", value: 907, statement: "Punjab's rural sex ratio was 907 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "sex-ratio-urban", snapshot: "CENSUS_2011", value: 875, statement: "Punjab's urban sex ratio was 875 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "child-sex-ratio-total", snapshot: "CENSUS_2011", value: 846, statement: "Punjab's child sex ratio for age 0-6 was 846 in Census 2011.", sourceKeys: ["censusChildSexRatio2011", "censusPunjabDchb2011"] },
  { id: "child-sex-ratio-rural", snapshot: "CENSUS_2011", value: 844, statement: "Punjab's rural child sex ratio was 844 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "child-sex-ratio-urban", snapshot: "CENSUS_2011", value: 852, statement: "Punjab's urban child sex ratio was 852 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },

  { id: "literacy-total", snapshot: "CENSUS_2011", value: 75.84, unit: "percent", statement: "Punjab's total literacy rate was 75.84% in Census 2011.", sourceKeys: ["censusEducationC08Punjab", "punjabEconomicSurveyCensusTables"] },
  { id: "literacy-male", snapshot: "CENSUS_2011", value: 80.44, unit: "percent", statement: "Punjab's male literacy rate was 80.44% in Census 2011.", sourceKeys: ["censusEducationC08Punjab", "punjabEconomicSurveyCensusTables"] },
  { id: "literacy-female", snapshot: "CENSUS_2011", value: 70.73, unit: "percent", statement: "Punjab's female literacy rate was 70.73% in Census 2011.", sourceKeys: ["censusEducationC08Punjab", "punjabEconomicSurveyCensusTables"] },
  { id: "literacy-rural", snapshot: "CENSUS_2011", value: 71.42, unit: "percent", statement: "Punjab's rural literacy rate was 71.42% in Census 2011.", sourceKeys: ["punjabEconomicSurveyCensusTables"] },
  { id: "literacy-urban", snapshot: "CENSUS_2011", value: 83.18, unit: "percent", statement: "Punjab's urban literacy rate was 83.18% in Census 2011.", sourceKeys: ["punjabEconomicSurveyCensusTables"] },
  { id: "literacy-definition", snapshot: "CENSUS_2011", statement: "Effective literacy rate is calculated for persons aged 7 years and above.", sourceKeys: ["censusEducationC08Punjab"] },

  { id: "rural-population", snapshot: "CENSUS_2011", value: 17344192, statement: "Punjab's rural population was 17,344,192 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "urban-population", snapshot: "CENSUS_2011", value: 10399146, statement: "Punjab's urban population was 10,399,146 in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "rural-share", snapshot: "CENSUS_2011", value: 62.52, unit: "percent", statement: "Rural residents formed 62.52% of Punjab's population in Census 2011.", sourceKeys: ["censusPunjabDchb2011", "punjabEconomicSurveyCensusTables"] },
  { id: "urban-share", snapshot: "CENSUS_2011", value: 37.48, unit: "percent", statement: "Urban residents formed 37.48% of Punjab's population in Census 2011.", sourceKeys: ["censusPunjabDchb2011", "punjabEconomicSurveyCensusTables"] },

  { id: "sc-population", snapshot: "CENSUS_2011", value: 8860179, statement: "Punjab's Scheduled Caste population was 8,860,179 in Census 2011.", sourceKeys: ["censusScheduledCastePunjab"] },
  { id: "sc-share", snapshot: "CENSUS_2011", value: 31.94, unit: "percent", statement: "Scheduled Castes formed 31.94% of Punjab's population in Census 2011.", sourceKeys: ["censusScheduledCastePunjab", "punjabEconomicSurveyCensusTables"] },

  { id: "district-population-high", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Ludhiana", statement: "Ludhiana was Punjab's most populous district in the Census 2011 20-district geography.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "district-population-low", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Barnala", statement: "Barnala was Punjab's least populous district in the Census 2011 20-district geography.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "district-sex-ratio-high", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Hoshiarpur", value: 961, statement: "Hoshiarpur had the highest district sex ratio in Punjab in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "district-sex-ratio-low", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Bathinda", value: 868, statement: "Bathinda had the lowest district sex ratio in Punjab in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "district-literacy-high", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Hoshiarpur", value: 84.6, unit: "percent", statement: "Hoshiarpur had Punjab's highest district literacy rate in Census 2011.", sourceKeys: ["punjabEconomicSurveyCensusTables"] },
  { id: "district-literacy-low", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Mansa", value: 61.8, unit: "percent", statement: "Mansa had Punjab's lowest district literacy rate in Census 2011.", sourceKeys: ["punjabEconomicSurveyCensusTables", "censusPunjabDchb2011"] },
  { id: "district-density-high", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Ludhiana", value: 978, unit: "persons_per_sq_km", statement: "Ludhiana had Punjab's highest district population density in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
  { id: "district-density-low", snapshot: "CENSUS_2011_20_DISTRICTS", district: "Muktsar", value: 348, unit: "persons_per_sq_km", statement: "Muktsar had Punjab's lowest district population density in Census 2011.", sourceKeys: ["censusPunjabDchb2011"] },
] as const);

export const PGK_001_CP020_FACT_IDS = Object.freeze(PGK_001_CP020_FACTS.map((fact) => fact.id));
