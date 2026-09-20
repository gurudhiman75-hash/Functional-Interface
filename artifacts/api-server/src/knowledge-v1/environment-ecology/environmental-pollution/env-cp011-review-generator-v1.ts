import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp011ReviewQuestion } from "./env-cp011-review-types";

type Seed = {
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  correct: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceFactIds: readonly string[];
};

const SOURCE_IDS = ["CPCB-ENVIRONMENTAL-POLLUTION-CONTROL", "US-EPA-NONPOINT-SOURCE-BASIC"] as const;
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-011-QL-001", qlName:"Pollution types", difficulty:"Easy", stem:"Excessive sound from traffic and loudspeakers is classified as:", correct:"Noise pollution", distractors:["Water pollution","Soil pollution","Thermal pollution"], explanation:"Unwanted excessive sound is noise pollution.", sourceFactIds:["env-cp011-types","env-cp011-noise-sources"] },
  { qlId:"ENV-011-QL-001", qlName:"Pollution types", difficulty:"Easy", stem:"Contamination of rivers by untreated sewage is primarily a form of:", correct:"Water pollution", distractors:["Noise pollution","Soil pollution","Light pollution"], explanation:"Untreated sewage contaminates water bodies.", sourceFactIds:["env-cp011-types","env-cp011-water-sources"] },
  { qlId:"ENV-011-QL-001", qlName:"Pollution types", difficulty:"Easy", stem:"Contamination of land by improperly dumped waste is mainly:", correct:"Soil pollution", distractors:["Air pollution","Noise pollution","Thermal inversion"], explanation:"Improper waste disposal can contaminate soil.", sourceFactIds:["env-cp011-types","env-cp011-soil-sources"] },
  { qlId:"ENV-011-QL-001", qlName:"Pollution types", difficulty:"Easy", stem:"Smoke and harmful gases released into the atmosphere cause:", correct:"Air pollution", distractors:["Water pollution","Soil erosion","Noise pollution"], explanation:"Atmospheric contamination is air pollution.", sourceFactIds:["env-cp011-types","env-cp011-air-sources"] },

  { qlId:"ENV-011-QL-002", qlName:"Air-pollution sources", difficulty:"Easy", stem:"Which is a common source of urban air pollution?", correct:"Vehicle exhaust", distractors:["Groundwater recharge","Seed banking","Rainwater harvesting"], explanation:"Vehicle exhaust is a common urban air-pollution source.", sourceFactIds:["env-cp011-air-sources"] },
  { qlId:"ENV-011-QL-002", qlName:"Air-pollution sources", difficulty:"Easy", stem:"Industrial combustion mainly contributes to which type of pollution?", correct:"Air pollution", distractors:["Noise pollution only","Soil pollution only","Groundwater recharge"], explanation:"Combustion releases pollutants into the air.", sourceFactIds:["env-cp011-air-sources"] },
  { qlId:"ENV-011-QL-002", qlName:"Air-pollution sources", difficulty:"Easy", stem:"Road dust and construction dust mainly increase pollution in the:", correct:"Air", distractors:["Deep ocean","Aquifer only","Stratosphere only"], explanation:"Dust-producing activities add particulate matter to ambient air.", sourceFactIds:["env-cp011-air-sources"] },
  { qlId:"ENV-011-QL-002", qlName:"Air-pollution sources", difficulty:"Easy", stem:"Which activity most directly releases combustion emissions to ambient air?", correct:"Burning fuel in engines", distractors:["Filtering drinking water","Composting leaves","Planting shelterbelts"], explanation:"Fuel combustion in engines directly releases air emissions.", sourceFactIds:["env-cp011-air-sources"] },

  { qlId:"ENV-011-QL-003", qlName:"Water-pollution sources", difficulty:"Easy", stem:"Which is a major source of water pollution?", correct:"Untreated sewage", distractors:["Afforestation","Solar power","Wind energy"], explanation:"Untreated sewage can directly contaminate water bodies.", sourceFactIds:["env-cp011-water-sources"] },
  { qlId:"ENV-011-QL-003", qlName:"Water-pollution sources", difficulty:"Easy", stem:"Discharge of untreated industrial effluent into a river causes:", correct:"Water pollution", distractors:["Noise pollution","Soil formation","Groundwater recharge"], explanation:"Industrial effluent can pollute receiving water.", sourceFactIds:["env-cp011-water-sources"] },
  { qlId:"ENV-011-QL-003", qlName:"Water-pollution sources", difficulty:"Easy", stem:"Rainwater carrying contaminants from fields into streams is an example of:", correct:"Runoff pollution", distractors:["Ex-situ conservation","Noise control","Thermal insulation"], explanation:"Runoff can carry pollutants from land into surface water.", sourceFactIds:["env-cp011-water-sources","env-cp011-nonpoint-source"] },
  { qlId:"ENV-011-QL-003", qlName:"Water-pollution sources", difficulty:"Easy", stem:"Which activity most directly reduces sewage-related water pollution?", correct:"Treating sewage before discharge", distractors:["Increasing traffic","Burning more fuel","Removing roadside trees"], explanation:"Sewage treatment reduces pollutants before discharge.", sourceFactIds:["env-cp011-water-sources","env-cp011-secondary-treatment"] },

  { qlId:"ENV-011-QL-004", qlName:"Soil-pollution sources", difficulty:"Medium", stem:"Which practice can directly contaminate soil?", correct:"Unsafe dumping of hazardous waste", distractors:["Rainwater harvesting","Contour ploughing","Afforestation"], explanation:"Unsafe waste dumping can introduce contaminants into soil.", sourceFactIds:["env-cp011-soil-sources"] },
  { qlId:"ENV-011-QL-004", qlName:"Soil-pollution sources", difficulty:"Medium", stem:"Excessive or unsafe use of agricultural chemicals may contribute to:", correct:"Soil pollution", distractors:["Noise pollution","Ocean upwelling","Tidal energy"], explanation:"Improper chemical use can contaminate soil.", sourceFactIds:["env-cp011-soil-sources"] },
  { qlId:"ENV-011-QL-004", qlName:"Soil-pollution sources", difficulty:"Medium", stem:"Which measure best helps prevent soil contamination from waste?", correct:"Controlled collection and safe disposal", distractors:["Open dumping","Unlined disposal everywhere","Mixing hazardous waste with soil"], explanation:"Safe collection and disposal reduce contact between waste and soil.", sourceFactIds:["env-cp011-soil-sources","env-cp011-source-reduction"] },
  { qlId:"ENV-011-QL-004", qlName:"Soil-pollution sources", difficulty:"Medium", stem:"Open dumping of mixed waste most directly threatens:", correct:"Soil and nearby water", distractors:["Only upper atmosphere","Only ocean tides","Only solar radiation"], explanation:"Leachate and direct contact can contaminate soil and nearby water.", sourceFactIds:["env-cp011-soil-sources","env-cp011-water-sources"] },

  { qlId:"ENV-011-QL-005", qlName:"Noise pollution", difficulty:"Medium", stem:"Which is a common source of noise pollution?", correct:"Heavy traffic", distractors:["Seed bank","Wetland restoration","Groundwater recharge"], explanation:"Road traffic is a common source of environmental noise.", sourceFactIds:["env-cp011-noise-sources"] },
  { qlId:"ENV-011-QL-005", qlName:"Noise pollution", difficulty:"Medium", stem:"Acoustic enclosures are mainly used to control pollution from:", correct:"Noisy machinery and generator sets", distractors:["Sewage discharge","Agricultural runoff","Soil salinity"], explanation:"Acoustic enclosures reduce sound emitted by machinery.", sourceFactIds:["env-cp011-noise-sources"] },
  { qlId:"ENV-011-QL-005", qlName:"Noise pollution", difficulty:"Medium", stem:"Which measure can reduce traffic-noise exposure near a road?", correct:"Noise barriers", distractors:["Sewage aeration","Electrostatic precipitation of water","Chlorination of soil"], explanation:"Noise barriers reduce sound transmission from roads.", sourceFactIds:["env-cp011-noise-sources"] },
  { qlId:"ENV-011-QL-005", qlName:"Noise pollution", difficulty:"Medium", stem:"Loudspeakers used at very high volume mainly add to:", correct:"Noise pollution", distractors:["Water pollution","Soil pollution","Groundwater depletion"], explanation:"High-volume amplified sound increases environmental noise.", sourceFactIds:["env-cp011-noise-sources"] },

  { qlId:"ENV-011-QL-006", qlName:"Point vs non-point source", difficulty:"Medium", stem:"Wastewater released through a specific discharge pipe is a:", correct:"Point source", distractors:["Non-point source","Natural sink","Secondary pollutant"], explanation:"A specific pipe is a discrete point of discharge.", sourceFactIds:["env-cp011-point-source"] },
  { qlId:"ENV-011-QL-006", qlName:"Point vs non-point source", difficulty:"Medium", stem:"Agricultural runoff entering a river from a broad area is usually a:", correct:"Non-point source", distractors:["Point source","Stack emission","Closed-loop source"], explanation:"Diffuse runoff over a broad area is non-point pollution.", sourceFactIds:["env-cp011-nonpoint-source"] },
  { qlId:"ENV-011-QL-006", qlName:"Point vs non-point source", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Factory effluent pipe — point source", distractors:["Farm runoff — point source","Urban runoff — single stack source","Diffuse drainage — point source"], explanation:"A factory discharge pipe is a discrete point source.", sourceFactIds:["env-cp011-point-source","env-cp011-nonpoint-source"] },
  { qlId:"ENV-011-QL-006", qlName:"Point vs non-point source", difficulty:"Medium", stem:"Pollution carried by rainwater from many streets into a river is best classified as:", correct:"Non-point pollution", distractors:["Point pollution from one pipe","Ex-situ pollution","Primary treatment"], explanation:"Runoff from many surfaces is diffuse non-point pollution.", sourceFactIds:["env-cp011-nonpoint-source"] },

  { qlId:"ENV-011-QL-007", qlName:"Primary vs secondary pollutant", difficulty:"Medium", stem:"A pollutant emitted directly from a source is called a:", correct:"Primary pollutant", distractors:["Secondary pollutant","Tertiary pollutant","Non-point pollutant only"], explanation:"Primary pollutants are emitted directly.", sourceFactIds:["env-cp011-primary-pollutant"] },
  { qlId:"ENV-011-QL-007", qlName:"Primary vs secondary pollutant", difficulty:"Medium", stem:"A pollutant formed in the atmosphere by chemical reactions is a:", correct:"Secondary pollutant", distractors:["Primary pollutant","Point source","Sediment"], explanation:"Secondary pollutants form through reactions after emission.", sourceFactIds:["env-cp011-secondary-pollutant"] },
  { qlId:"ENV-011-QL-007", qlName:"Primary vs secondary pollutant", difficulty:"Medium", stem:"Which statement correctly distinguishes primary and secondary pollutants?", correct:"Primary pollutants are emitted directly; secondary pollutants form after reactions", distractors:["Both must be emitted directly","Secondary pollutants come only from water","Primary pollutants form only after reactions"], explanation:"The distinction depends on direct emission versus later formation.", sourceFactIds:["env-cp011-primary-pollutant","env-cp011-secondary-pollutant"] },
  { qlId:"ENV-011-QL-007", qlName:"Primary vs secondary pollutant", difficulty:"Medium", stem:"Formation after atmospheric reactions is the defining feature of a:", correct:"Secondary pollutant", distractors:["Primary pollutant","Point source","Noise source"], explanation:"Secondary pollutants are produced by reactions in the environment.", sourceFactIds:["env-cp011-secondary-pollutant"] },

  { qlId:"ENV-011-QL-008", qlName:"Sewage-treatment stages", difficulty:"Medium", stem:"Screening and sedimentation are mainly part of:", correct:"Primary sewage treatment", distractors:["Secondary biological treatment","Tertiary polishing only","Noise control"], explanation:"Primary treatment mainly removes solids by physical processes.", sourceFactIds:["env-cp011-primary-treatment"] },
  { qlId:"ENV-011-QL-008", qlName:"Sewage-treatment stages", difficulty:"Medium", stem:"Biological breakdown of biodegradable organic matter mainly occurs during:", correct:"Secondary sewage treatment", distractors:["Primary screening only","Tertiary disinfection only","Air filtration"], explanation:"Secondary treatment mainly relies on biological processes.", sourceFactIds:["env-cp011-secondary-treatment"] },
  { qlId:"ENV-011-QL-008", qlName:"Sewage-treatment stages", difficulty:"Medium", stem:"Advanced polishing after primary and secondary treatment is called:", correct:"Tertiary treatment", distractors:["Primary treatment","Secondary treatment","Open dumping"], explanation:"Tertiary treatment provides further advanced removal or polishing.", sourceFactIds:["env-cp011-tertiary-treatment"] },
  { qlId:"ENV-011-QL-008", qlName:"Sewage-treatment stages", difficulty:"Medium", stem:"Which is the correct sequence of sewage-treatment stages?", correct:"Primary → Secondary → Tertiary", distractors:["Secondary → Primary → Tertiary","Tertiary → Primary → Secondary","Primary → Tertiary → Secondary"], explanation:"Treatment generally progresses from primary to secondary and then tertiary.", sourceFactIds:["env-cp011-primary-treatment","env-cp011-secondary-treatment","env-cp011-tertiary-treatment"] },

  { qlId:"ENV-011-QL-009", qlName:"Air-pollution control devices", difficulty:"Medium", stem:"Which device removes particles from flue gas using electrical forces?", correct:"Electrostatic precipitator", distractors:["Septic tank","Noise barrier","Sedimentation pond"], explanation:"An ESP electrically charges and collects suspended particles.", sourceFactIds:["env-cp011-esp"] },
  { qlId:"ENV-011-QL-009", qlName:"Air-pollution control devices", difficulty:"Medium", stem:"A cyclone separator removes particulate matter mainly by:", correct:"Centrifugal action", distractors:["Biological oxidation","Chlorination","Ultraviolet radiation"], explanation:"Cyclones separate particles using centrifugal force.", sourceFactIds:["env-cp011-cyclone"] },
  { qlId:"ENV-011-QL-009", qlName:"Air-pollution control devices", difficulty:"Medium", stem:"Which air-pollution control device uses filter fabric?", correct:"Bag filter", distractors:["Cyclone separator","Noise barrier","Primary clarifier"], explanation:"Bag filters trap particles on fabric filters.", sourceFactIds:["env-cp011-bag-filter"] },
  { qlId:"ENV-011-QL-009", qlName:"Air-pollution control devices", difficulty:"Medium", stem:"Which device commonly uses liquid contact to remove selected contaminants from a gas stream?", correct:"Scrubber", distractors:["Seed bank","Aeration tank","Noise barrier"], explanation:"Scrubbers contact gas with a liquid or other medium to remove contaminants.", sourceFactIds:["env-cp011-scrubber"] },

  { qlId:"ENV-011-QL-010", qlName:"Pollution prevention and waste hierarchy", difficulty:"Medium", stem:"Which approach prevents pollution before waste is generated?", correct:"Source reduction", distractors:["Open dumping","Dilution after discharge","Uncontrolled burning"], explanation:"Source reduction prevents or reduces waste generation at the beginning.", sourceFactIds:["env-cp011-source-reduction"] },
  { qlId:"ENV-011-QL-010", qlName:"Pollution prevention and waste hierarchy", difficulty:"Medium", stem:"Reusing a material instead of discarding it mainly helps by:", correct:"Reducing waste generation", distractors:["Increasing disposal demand","Increasing open burning","Creating more untreated effluent"], explanation:"Reuse reduces the amount of waste needing treatment or disposal.", sourceFactIds:["env-cp011-reuse-recycle"] },
  { qlId:"ENV-011-QL-010", qlName:"Pollution prevention and waste hierarchy", difficulty:"Medium", stem:"Recycling mainly reduces pollution pressure by:", correct:"Diverting usable material from the waste stream", distractors:["Increasing raw waste disposal","Replacing sewage treatment","Increasing noise at source"], explanation:"Recycling recovers material that would otherwise enter the waste stream.", sourceFactIds:["env-cp011-reuse-recycle"] },
  { qlId:"ENV-011-QL-010", qlName:"Pollution prevention and waste hierarchy", difficulty:"Medium", stem:"Which is preferable to uncontrolled disposal of reusable material?", correct:"Reuse or recycling", distractors:["Open burning","Open dumping","Direct river disposal"], explanation:"Reuse and recycling reduce waste requiring final disposal.", sourceFactIds:["env-cp011-reuse-recycle","env-cp011-source-reduction"] },

  { qlId:"ENV-011-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Electrostatic precipitator — particulate control", distractors:["Noise barrier — sewage treatment","Primary clarifier — traffic noise control","Seed bank — air-pollution device"], explanation:"An electrostatic precipitator is used to remove particles from gas streams.", sourceFactIds:["env-cp011-esp"] },
  { qlId:"ENV-011-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Secondary sewage treatment — mainly physical screening", distractors:["Primary treatment — sedimentation","Tertiary treatment — advanced polishing","Secondary treatment — biological processes"], explanation:"Physical screening belongs mainly to primary treatment, not secondary treatment.", sourceFactIds:["env-cp011-primary-treatment","env-cp011-secondary-treatment","env-cp011-tertiary-treatment"] },
  { qlId:"ENV-011-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Agricultural runoff — non-point source", distractors:["Factory discharge pipe — non-point source","Traffic horn — water point source","Bag filter — sewage treatment"], explanation:"Agricultural runoff is typically diffuse non-point pollution.", sourceFactIds:["env-cp011-nonpoint-source"] },
  { qlId:"ENV-011-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Bag filter — noise control", distractors:["Cyclone separator — particulate control","Scrubber — gas-stream cleaning","Noise barrier — noise control"], explanation:"A bag filter controls particulate air pollution, not noise.", sourceFactIds:["env-cp011-bag-filter","env-cp011-noise-sources"] },

  { qlId:"ENV-011-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. A discharge pipe is a point source.\n2. Agricultural runoff is usually non-point pollution.\n3. Non-point pollution must come from one identifiable pipe.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct; non-point pollution is diffuse.", sourceFactIds:["env-cp011-point-source","env-cp011-nonpoint-source"] },
  { qlId:"ENV-011-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. Primary treatment is mainly physical.\n2. Secondary treatment is mainly biological.\n3. Tertiary treatment comes before primary treatment.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"The first two are correct; tertiary treatment follows earlier stages.", sourceFactIds:["env-cp011-primary-treatment","env-cp011-secondary-treatment","env-cp011-tertiary-treatment"] },
  { qlId:"ENV-011-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"A factory wants to remove fine suspended particles from flue gas using electrical forces. Which device is suitable?", correct:"Electrostatic precipitator", distractors:["Noise barrier","Primary clarifier","Seed bank"], explanation:"An ESP uses electrical forces to collect particles from gas streams.", sourceFactIds:["env-cp011-esp"] },
  { qlId:"ENV-011-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Rainfall washes contaminants from many farms into a river. This is best classified as:", correct:"Non-point water pollution", distractors:["Point discharge from one pipe","Primary air pollution only","Noise pollution"], explanation:"Diffuse runoff from many farms is non-point pollution.", sourceFactIds:["env-cp011-nonpoint-source","env-cp011-water-sources"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-011 requires four unique options");
  return options;
}

export function generateEnvCp011ReviewBatchV1(): EnvCp011ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP011-V1-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-011",
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: place(seed.correct, seed.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}
