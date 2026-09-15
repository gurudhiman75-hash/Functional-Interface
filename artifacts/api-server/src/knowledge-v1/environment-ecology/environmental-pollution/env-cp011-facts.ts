export type EnvCp011FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const CPCB_SOURCE = "CPCB-ENVIRONMENTAL-POLLUTION-CONTROL";
const EPA_SOURCE = "US-EPA-NONPOINT-SOURCE-BASIC";

export const ENV_CP011_FACT_ROWS_V1: readonly EnvCp011FactRow[] = Object.freeze([
  { id: "env-cp011-types", label: "Pollution types", statement: "major pollution types include air, water, soil and noise pollution", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-air-sources", label: "Air pollution sources", statement: "combustion, industry, traffic and dust-generating activities are common air-pollution sources", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-water-sources", label: "Water pollution sources", statement: "untreated sewage, industrial effluent and runoff are common water-pollution sources", sourceIds: [CPCB_SOURCE, EPA_SOURCE] },
  { id: "env-cp011-soil-sources", label: "Soil pollution sources", statement: "improper waste disposal and excessive or unsafe chemical use can contaminate soil", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-noise-sources", label: "Noise pollution sources", statement: "traffic, loudspeakers, generators, construction and industrial machinery are common noise sources", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-point-source", label: "Point source", statement: "a point source is a discernible, confined or discrete source from which pollutants are discharged", sourceIds: [EPA_SOURCE] },
  { id: "env-cp011-nonpoint-source", label: "Non-point source", statement: "non-point pollution comes from diffuse sources, often through runoff or drainage over broad areas", sourceIds: [EPA_SOURCE] },
  { id: "env-cp011-primary-pollutant", label: "Primary pollutant", statement: "a primary pollutant is emitted directly from a source", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-secondary-pollutant", label: "Secondary pollutant", statement: "a secondary pollutant forms in the environment through reactions involving other pollutants", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-primary-treatment", label: "Primary sewage treatment", statement: "primary sewage treatment mainly uses physical processes such as screening and sedimentation", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-secondary-treatment", label: "Secondary sewage treatment", statement: "secondary sewage treatment mainly uses biological processes to remove biodegradable organic matter", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-tertiary-treatment", label: "Tertiary sewage treatment", statement: "tertiary treatment provides further advanced treatment or polishing after primary and secondary stages", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-esp", label: "Electrostatic precipitator", statement: "an electrostatic precipitator removes suspended particles from a gas stream using electrical forces", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-cyclone", label: "Cyclone separator", statement: "a cyclone separator removes particulate matter by centrifugal action", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-bag-filter", label: "Bag filter", statement: "a bag or fabric filter removes particulate matter by passing gas through filter fabric", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-scrubber", label: "Scrubber", statement: "scrubbers use contact with a liquid or other medium to remove selected gaseous contaminants and/or particles", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-source-reduction", label: "Source reduction", statement: "preventing or reducing waste generation at source is preferred to managing pollution after it is created", sourceIds: [CPCB_SOURCE] },
  { id: "env-cp011-reuse-recycle", label: "Reuse and recycling", statement: "reuse and recycling can reduce the quantity of waste requiring treatment or disposal", sourceIds: [CPCB_SOURCE] },
]);

export const ENV_CP011_FACT_IDS_V1 = new Set(ENV_CP011_FACT_ROWS_V1.map((row) => row.id));
