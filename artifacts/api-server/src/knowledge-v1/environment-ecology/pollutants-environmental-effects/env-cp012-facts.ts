export type EnvCp012FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const EPA_NUTRIENT = "US-EPA-NUTRIENT-POLLUTION";
const USGS_BOD = "USGS-BOD-WATER";
const EPA_COD = "US-EPA-COD-REGISTRY";
const EPA_ACID = "US-EPA-ACID-RAIN";
const EPA_CO = "US-EPA-CARBON-MONOXIDE";
const EPA_PM = "US-EPA-PARTICULATE-MATTER";
const EPA_BIOMAG = "US-EPA-BIOACCUMULATION-BIOMAGNIFICATION";
const WHO_LEAD = "WHO-LEAD-POISONING";
const WHO_MERCURY = "WHO-MERCURY-HEALTH";
const WHO_ARSENIC = "WHO-ARSENIC";
const WHO_CADMIUM = "WHO-CADMIUM";

export const ENV_CP012_FACT_ROWS_V1: readonly EnvCp012FactRow[] = Object.freeze([
  { id: "env-cp012-nutrient-eutrophication", label: "Nutrient pollution", statement: "excess nitrogen and phosphorus can cause rapid algal growth and eutrophication in water bodies", sourceIds: [EPA_NUTRIENT] },
  { id: "env-cp012-algal-oxygen", label: "Algal bloom oxygen effect", statement: "large algal blooms and their decomposition can reduce dissolved oxygen and create hypoxic conditions", sourceIds: [EPA_NUTRIENT] },
  { id: "env-cp012-bod-definition", label: "BOD", statement: "biochemical oxygen demand is the oxygen consumed by microorganisms while decomposing organic matter under aerobic conditions", sourceIds: [USGS_BOD] },
  { id: "env-cp012-bod-do", label: "BOD and DO", statement: "high biodegradable organic pollution can raise BOD and reduce dissolved oxygen available to aquatic life", sourceIds: [USGS_BOD] },
  { id: "env-cp012-cod-definition", label: "COD", statement: "chemical oxygen demand measures the oxygen equivalent of material in a sample that can be oxidized by a strong chemical oxidant", sourceIds: [EPA_COD] },
  { id: "env-cp012-acid-rain-precursors", label: "Acid rain precursors", statement: "sulfur dioxide and nitrogen oxides are major precursor gases of acid rain", sourceIds: [EPA_ACID] },
  { id: "env-cp012-acid-rain-acids", label: "Acid rain acids", statement: "SO2 and NOx can react in the atmosphere to form sulfuric and nitric acids", sourceIds: [EPA_ACID] },
  { id: "env-cp012-co-oxygen", label: "Carbon monoxide", statement: "carbon monoxide reduces oxygen transport in blood by forming carboxyhemoglobin", sourceIds: [EPA_CO] },
  { id: "env-cp012-co-combustion", label: "Carbon monoxide source", statement: "carbon monoxide is produced by incomplete combustion and is emitted by vehicles and other fuel-burning equipment", sourceIds: [EPA_CO] },
  { id: "env-cp012-pm-lungs", label: "Particulate matter", statement: "small particulate matter can penetrate deep into the lungs and some particles can enter the bloodstream", sourceIds: [EPA_PM] },
  { id: "env-cp012-pm-health", label: "PM health effects", statement: "particulate pollution is linked with respiratory and cardiovascular effects including aggravated asthma and reduced lung function", sourceIds: [EPA_PM] },
  { id: "env-cp012-bioaccumulation", label: "Bioaccumulation", statement: "bioaccumulation is the build-up of a contaminant within an organism over time", sourceIds: [EPA_BIOMAG] },
  { id: "env-cp012-biomagnification", label: "Biomagnification", statement: "biomagnification is increasing contaminant concentration at successive trophic levels in a food chain", sourceIds: [EPA_BIOMAG] },
  { id: "env-cp012-persistent-biomag", label: "Persistent pollutants", statement: "persistent chemicals such as DDT and PCBs can biomagnify through food chains", sourceIds: [EPA_BIOMAG] },
  { id: "env-cp012-mercury-food-chain", label: "Methylmercury food chain", statement: "methylmercury builds up in aquatic organisms and generally reaches higher concentrations in large predatory fish", sourceIds: [EPA_BIOMAG, WHO_MERCURY] },
  { id: "env-cp012-lead-neuro", label: "Lead neurotoxicity", statement: "lead is a cumulative toxicant and can permanently harm the developing brain and nervous system of children", sourceIds: [WHO_LEAD] },
  { id: "env-cp012-lead-systems", label: "Lead body effects", statement: "lead can affect neurological, cardiovascular, kidney and blood-forming systems", sourceIds: [WHO_LEAD] },
  { id: "env-cp012-mercury-neuro", label: "Mercury toxicity", statement: "mercury can damage the nervous system and kidneys and is especially dangerous to the developing fetus", sourceIds: [WHO_MERCURY] },
  { id: "env-cp012-mercury-exposure", label: "Methylmercury exposure", statement: "people are mainly exposed to methylmercury through contaminated fish and shellfish", sourceIds: [WHO_MERCURY] },
  { id: "env-cp012-arsenic-groundwater", label: "Arsenic groundwater", statement: "contaminated groundwater is a major source of inorganic arsenic exposure", sourceIds: [WHO_ARSENIC] },
  { id: "env-cp012-arsenic-effects", label: "Arsenic chronic effects", statement: "long-term inorganic arsenic exposure can cause characteristic skin lesions and increase cancer risk", sourceIds: [WHO_ARSENIC] },
  { id: "env-cp012-cadmium-effects", label: "Cadmium toxicity", statement: "cadmium has toxic effects on kidneys and the skeletal and respiratory systems", sourceIds: [WHO_CADMIUM] },
]);

export const ENV_CP012_FACT_IDS_V1 = new Set(ENV_CP012_FACT_ROWS_V1.map((row) => row.id));
