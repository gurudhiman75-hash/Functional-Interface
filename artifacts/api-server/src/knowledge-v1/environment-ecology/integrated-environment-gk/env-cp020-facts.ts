export type EnvCp020FactRow = {
  id: string;
  statement: string;
  sourceCpIds: readonly string[];
};

export const ENV_CP020_FACTS_V1: readonly EnvCp020FactRow[] = Object.freeze([
  { id:"env-cp020-food-energy", statement:"Energy flows through trophic levels and decreases at higher trophic levels; food chains and food webs express feeding relationships.", sourceCpIds:["ENV-CP-002","ENV-CP-003"] },
  { id:"env-cp020-decomposer-cycle", statement:"Decomposers break down dead organic matter and return nutrients to ecosystem cycles.", sourceCpIds:["ENV-CP-003","ENV-CP-004"] },
  { id:"env-cp020-nitrogen", statement:"Nitrogen fixation converts atmospheric nitrogen into biologically usable forms, while denitrification returns nitrogen to the atmosphere.", sourceCpIds:["ENV-CP-004"] },
  { id:"env-cp020-biome-biodiversity", statement:"Tropical rainforests are warm, wet and highly biodiverse; deserts are defined by very low rainfall.", sourceCpIds:["ENV-CP-005","ENV-CP-006"] },
  { id:"env-cp020-endemic-hotspot", statement:"Biodiversity hotspots combine exceptional endemism with severe habitat loss, making them high conservation priorities.", sourceCpIds:["ENV-CP-006","ENV-CP-007"] },
  { id:"env-cp020-india-hotspots", statement:"Parts of India fall within the Himalaya, Indo-Burma, Western Ghats–Sri Lanka and Sundaland biodiversity hotspots.", sourceCpIds:["ENV-CP-007"] },
  { id:"env-cp020-in-situ", statement:"In-situ conservation protects species in their natural habitats; ex-situ conservation protects them outside natural habitats.", sourceCpIds:["ENV-CP-008"] },
  { id:"env-cp020-protected-category", statement:"National parks and wildlife sanctuaries are protected-area categories; biosphere reserves use broader zonation concepts.", sourceCpIds:["ENV-CP-009"] },
  { id:"env-cp020-site-species", statement:"Gir is strongly associated with the Asiatic lion; Kaziranga with the one-horned rhinoceros; Keibul Lamjao with Sangai.", sourceCpIds:["ENV-CP-010","ENV-CP-019"] },
  { id:"env-cp020-pollution-source", statement:"Sulphur dioxide is associated with acid rain; excessive nutrients can cause eutrophication; particulate matter affects air quality and health.", sourceCpIds:["ENV-CP-011","ENV-CP-012"] },
  { id:"env-cp020-biomagnification", statement:"Biomagnification is the increase in concentration of certain persistent pollutants at higher trophic levels.", sourceCpIds:["ENV-CP-003","ENV-CP-012"] },
  { id:"env-cp020-ozone", statement:"Stratospheric ozone protects life from harmful ultraviolet radiation; CFCs historically contributed to ozone depletion.", sourceCpIds:["ENV-CP-013","ENV-CP-017"] },
  { id:"env-cp020-greenhouse", statement:"Greenhouse gases warm the lower atmosphere by trapping outgoing infrared radiation; climate change includes long-term shifts in climate patterns.", sourceCpIds:["ENV-CP-013","ENV-CP-014"] },
  { id:"env-cp020-law-board", statement:"The Water Act and Air Act underpin pollution-control institutions; CPCB has an apex national coordination role and SPCBs operate at state level.", sourceCpIds:["ENV-CP-015","ENV-CP-016"] },
  { id:"env-cp020-ngt", statement:"The National Green Tribunal is a specialized environmental adjudicatory body established under the NGT Act, 2010.", sourceCpIds:["ENV-CP-015"] },
  { id:"env-cp020-biodiversity-governance", statement:"NBA operates nationally, State Biodiversity Boards at state level, and Biodiversity Management Committees at local level; BMCs are linked with People’s Biodiversity Registers.", sourceCpIds:["ENV-CP-015","ENV-CP-016"] },
  { id:"env-cp020-surveys", statement:"FSI focuses on forest resources, BSI on plant diversity and ZSI on animal diversity.", sourceCpIds:["ENV-CP-016"] },
  { id:"env-cp020-cites-cms", statement:"CITES regulates international wildlife trade, while CMS focuses on conservation of migratory wild animals.", sourceCpIds:["ENV-CP-017"] },
  { id:"env-cp020-basel-stockholm-minamata", statement:"Basel addresses hazardous wastes, Stockholm persistent organic pollutants, and Minamata mercury.", sourceCpIds:["ENV-CP-017"] },
  { id:"env-cp020-climate-treaties", statement:"UNFCCC is the climate framework; Kyoto set differentiated targets for specified developed parties; Paris uses nationally determined contributions.", sourceCpIds:["ENV-CP-014","ENV-CP-017"] },
  { id:"env-cp020-tiger", statement:"Project Tiger began in 1973; NTCA provides statutory tiger-conservation oversight; tiger reserves use core and buffer management zones.", sourceCpIds:["ENV-CP-016","ENV-CP-018"] },
  { id:"env-cp020-mstripes", statement:"M-STrIPES supports monitoring, patrolling and ecological management in tiger reserves.", sourceCpIds:["ENV-CP-018"] },
  { id:"env-cp020-ramsar-sites", statement:"Chilika is a brackish lagoon in Odisha; Loktak in Manipur is known for phumdis; Wular is a freshwater lake in Jammu and Kashmir.", sourceCpIds:["ENV-CP-019"] },
  { id:"env-cp020-punjab-wetlands", statement:"Harike, Kanjli and Ropar are Ramsar Sites in Punjab; Harike lies near the Beas–Sutlej confluence.", sourceCpIds:["ENV-CP-019"] },
  { id:"env-cp020-wetland-special", statement:"East Kolkata Wetlands is known for wastewater-based resource recovery; Sambhar is saline; Tsomoriri is high-altitude.", sourceCpIds:["ENV-CP-019"] },
  { id:"env-cp020-ramsar-convention", statement:"Ramsar concerns wetlands and wise use, while the Montreux Record highlights Ramsar Sites facing ecological-character concerns.", sourceCpIds:["ENV-CP-017","ENV-CP-019"] },
]);

export const ENV_CP020_FACT_BY_ID_V1 = Object.freeze(
  Object.fromEntries(ENV_CP020_FACTS_V1.map((row) => [row.id, row])) as Record<string, EnvCp020FactRow>,
);
