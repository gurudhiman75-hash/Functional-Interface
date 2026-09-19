import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp012ReviewQuestion } from "./env-cp012-review-types";

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

const SOURCE_IDS = [
  "US-EPA-NUTRIENT-POLLUTION",
  "USGS-BOD-WATER",
  "US-EPA-COD-REGISTRY",
  "US-EPA-ACID-RAIN",
  "US-EPA-CARBON-MONOXIDE",
  "US-EPA-PARTICULATE-MATTER",
  "US-EPA-BIOACCUMULATION-BIOMAGNIFICATION",
  "WHO-LEAD-POISONING",
  "WHO-MERCURY-HEALTH",
  "WHO-ARSENIC",
  "WHO-CADMIUM",
] as const;
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-012-QL-001", qlName:"Eutrophication", difficulty:"Easy", stem:"Excess nitrogen and phosphorus in a lake most directly promote:", correct:"Eutrophication", distractors:["Thermal inversion","Ozone depletion","Soil salinization"], explanation:"Excess nutrients can trigger rapid algal growth and eutrophication.", sourceFactIds:["env-cp012-nutrient-eutrophication"] },
  { qlId:"ENV-012-QL-001", qlName:"Eutrophication", difficulty:"Easy", stem:"Which nutrients commonly drive eutrophication in water bodies?", correct:"Nitrogen and phosphorus", distractors:["Calcium and magnesium","Helium and neon","Silicon and aluminium"], explanation:"Excess nitrogen and phosphorus commonly drive nutrient pollution.", sourceFactIds:["env-cp012-nutrient-eutrophication"] },
  { qlId:"ENV-012-QL-001", qlName:"Eutrophication", difficulty:"Easy", stem:"A dense algal bloom dies and decomposes. What commonly happens next?", correct:"Dissolved oxygen falls", distractors:["Dissolved oxygen always rises","Water becomes salt-free","All nutrients disappear"], explanation:"Decomposition uses oxygen and can lower dissolved oxygen.", sourceFactIds:["env-cp012-algal-oxygen"] },
  { qlId:"ENV-012-QL-001", qlName:"Eutrophication", difficulty:"Easy", stem:"Low-oxygen dead zones in nutrient-rich water are mainly linked with:", correct:"Excess nutrient pollution", distractors:["Magnetic storms","Groundwater recharge","Rock weathering alone"], explanation:"Nutrient-driven blooms can lead to oxygen depletion and dead zones.", sourceFactIds:["env-cp012-nutrient-eutrophication","env-cp012-algal-oxygen"] },

  { qlId:"ENV-012-QL-002", qlName:"BOD and dissolved oxygen", difficulty:"Easy", stem:"Biochemical oxygen demand (BOD) measures oxygen used mainly by:", correct:"Microorganisms decomposing organic matter", distractors:["Wind moving surface water","Fish producing oxygen","Minerals settling by gravity"], explanation:"BOD measures oxygen consumed during microbial decomposition of organic matter.", sourceFactIds:["env-cp012-bod-definition"] },
  { qlId:"ENV-012-QL-002", qlName:"BOD and dissolved oxygen", difficulty:"Easy", stem:"A high BOD in polluted water usually indicates:", correct:"High microbial oxygen demand", distractors:["No organic matter","Very high dissolved oxygen by definition","Absence of microorganisms"], explanation:"More biodegradable organic matter generally creates greater oxygen demand.", sourceFactIds:["env-cp012-bod-definition","env-cp012-bod-do"] },
  { qlId:"ENV-012-QL-002", qlName:"BOD and dissolved oxygen", difficulty:"Easy", stem:"If BOD rises sharply in a stream, dissolved oxygen is likely to:", correct:"Decrease", distractors:["Increase without limit","Remain unrelated","Turn into nitrogen"], explanation:"High BOD can consume oxygen faster than it is replaced.", sourceFactIds:["env-cp012-bod-do"] },
  { qlId:"ENV-012-QL-002", qlName:"BOD and dissolved oxygen", difficulty:"Easy", stem:"Which water-quality measure is most directly linked with biodegradable organic pollution?", correct:"BOD", distractors:["Sound level","Wind speed","Soil texture"], explanation:"BOD is widely used as an indicator of biodegradable organic pollution.", sourceFactIds:["env-cp012-bod-definition"] },

  { qlId:"ENV-012-QL-003", qlName:"Acid rain", difficulty:"Easy", stem:"The main gaseous precursors of acid rain are:", correct:"Sulfur dioxide and nitrogen oxides", distractors:["Oxygen and argon","Methane and helium","Hydrogen and neon"], explanation:"SO2 and NOx are the main acid-rain precursor gases.", sourceFactIds:["env-cp012-acid-rain-precursors"] },
  { qlId:"ENV-012-QL-003", qlName:"Acid rain", difficulty:"Easy", stem:"Sulfur dioxide contributes to acid rain mainly by forming:", correct:"Sulfuric acid", distractors:["Methane","Ammonia","Ozone only"], explanation:"Atmospheric SO2 can be converted to sulfuric acid.", sourceFactIds:["env-cp012-acid-rain-acids"] },
  { qlId:"ENV-012-QL-003", qlName:"Acid rain", difficulty:"Easy", stem:"Nitrogen oxides contribute to acid deposition mainly through formation of:", correct:"Nitric acid", distractors:["Carbon monoxide","Calcium carbonate","Hydrogen gas"], explanation:"NOx can form nitric acid in the atmosphere.", sourceFactIds:["env-cp012-acid-rain-acids"] },
  { qlId:"ENV-012-QL-003", qlName:"Acid rain", difficulty:"Easy", stem:"Which pollutant mainly reduces blood oxygen transport rather than acting as an acid-rain precursor?", correct:"Carbon monoxide", distractors:["Sulfur dioxide","Nitrogen dioxide","Nitric oxide"], explanation:"CO reduces oxygen transport; SO2 and nitrogen oxides are acid-rain precursors.", sourceFactIds:["env-cp012-acid-rain-precursors","env-cp012-co-oxygen"] },

  { qlId:"ENV-012-QL-004", qlName:"Carbon monoxide", difficulty:"Medium", stem:"Carbon monoxide reduces oxygen transport in blood by forming:", correct:"Carboxyhemoglobin", distractors:["Oxychloride","Nitrate pigment","Carbonate crystals"], explanation:"CO binds with hemoglobin to form carboxyhemoglobin.", sourceFactIds:["env-cp012-co-oxygen"] },
  { qlId:"ENV-012-QL-004", qlName:"Carbon monoxide", difficulty:"Medium", stem:"Carbon monoxide is commonly produced by:", correct:"Incomplete combustion", distractors:["Complete photosynthesis","Evaporation of pure water","Nitrogen fixation"], explanation:"Incomplete combustion of fuel is a major source of CO.", sourceFactIds:["env-cp012-co-combustion"] },
  { qlId:"ENV-012-QL-004", qlName:"Carbon monoxide", difficulty:"Medium", stem:"The main immediate danger of carbon monoxide exposure is reduced:", correct:"Oxygen delivery to tissues", distractors:["Bone mineralization only","Soil fertility","Water hardness"], explanation:"CO reduces the amount of oxygen that blood can transport.", sourceFactIds:["env-cp012-co-oxygen"] },
  { qlId:"ENV-012-QL-004", qlName:"Carbon monoxide", difficulty:"Medium", stem:"Which source can release carbon monoxide?", correct:"Vehicle exhaust", distractors:["Rainwater harvesting tank","Seed bank","Solar panel surface"], explanation:"Fuel-burning vehicles are common sources of carbon monoxide.", sourceFactIds:["env-cp012-co-combustion"] },

  { qlId:"ENV-012-QL-005", qlName:"Particulate matter", difficulty:"Medium", stem:"Fine particulate matter can be especially harmful because it can:", correct:"Penetrate deep into the lungs", distractors:["Remain only in the stratosphere","Increase blood oxygen directly","Remove all respiratory irritants"], explanation:"Small particles can travel deep into the respiratory system.", sourceFactIds:["env-cp012-pm-lungs"] },
  { qlId:"ENV-012-QL-005", qlName:"Particulate matter", difficulty:"Medium", stem:"Some very small inhaled particles may pass from the lungs into the:", correct:"Bloodstream", distractors:["Bone marrow only","Stomach without inhalation","Outer hair only"], explanation:"Some fine particles can pass from the lungs into the bloodstream.", sourceFactIds:["env-cp012-pm-lungs"] },
  { qlId:"ENV-012-QL-005", qlName:"Particulate matter", difficulty:"Medium", stem:"Particulate pollution is strongly linked with problems of the:", correct:"Lungs and cardiovascular system", distractors:["Teeth only","Fingernails only","Hair pigment only"], explanation:"Particle pollution can affect both the lungs and the heart.", sourceFactIds:["env-cp012-pm-health"] },
  { qlId:"ENV-012-QL-005", qlName:"Particulate matter", difficulty:"Medium", stem:"Which health effect is commonly linked with particulate pollution?", correct:"Aggravated asthma", distractors:["Improved lung function","Higher blood oxygen","Prevention of coughing"], explanation:"Particulate pollution can aggravate asthma and reduce lung function.", sourceFactIds:["env-cp012-pm-health"] },

  { qlId:"ENV-012-QL-006", qlName:"Bioaccumulation vs biomagnification", difficulty:"Medium", stem:"Build-up of a contaminant within one organism over time is called:", correct:"Bioaccumulation", distractors:["Biomagnification","Eutrophication","Acid deposition"], explanation:"Bioaccumulation occurs within an individual organism.", sourceFactIds:["env-cp012-bioaccumulation"] },
  { qlId:"ENV-012-QL-006", qlName:"Bioaccumulation vs biomagnification", difficulty:"Medium", stem:"Increasing contaminant concentration at successive trophic levels is called:", correct:"Biomagnification", distractors:["Bioaccumulation within one organism","Nitrification","Sedimentation"], explanation:"Biomagnification is an increase in concentration up the food chain.", sourceFactIds:["env-cp012-biomagnification"] },
  { qlId:"ENV-012-QL-006", qlName:"Bioaccumulation vs biomagnification", difficulty:"Medium", stem:"Which substances are classic examples of persistent pollutants that can biomagnify?", correct:"DDT and PCBs", distractors:["Oxygen and nitrogen","Water and sodium chloride","Calcium and magnesium"], explanation:"Persistent chemicals such as DDT and PCBs can biomagnify through food chains.", sourceFactIds:["env-cp012-persistent-biomag"] },
  { qlId:"ENV-012-QL-006", qlName:"Bioaccumulation vs biomagnification", difficulty:"Medium", stem:"In a contaminated aquatic food chain, the highest pollutant concentration is often found in:", correct:"Top predators", distractors:["Pure water only","Lowest trophic level always","Mineral sediment only"], explanation:"Biomagnification can produce the highest concentrations in top predators.", sourceFactIds:["env-cp012-biomagnification","env-cp012-persistent-biomag"] },

  { qlId:"ENV-012-QL-007", qlName:"Lead", difficulty:"Medium", stem:"Lead exposure is especially harmful to the developing:", correct:"Brain and nervous system", distractors:["Hair shaft only","Tooth enamel only","Skin pigment only"], explanation:"Children are especially vulnerable to lead's neurotoxic effects.", sourceFactIds:["env-cp012-lead-neuro"] },
  { qlId:"ENV-012-QL-007", qlName:"Lead", difficulty:"Medium", stem:"Which pollutant is a cumulative toxic metal that can impair child brain development?", correct:"Lead", distractors:["Helium","Argon","Nitrogen"], explanation:"Lead can accumulate in the body and harm the developing nervous system.", sourceFactIds:["env-cp012-lead-neuro"] },
  { qlId:"ENV-012-QL-007", qlName:"Lead", difficulty:"Medium", stem:"Lead exposure can affect which group of body systems?", correct:"Neurological, cardiovascular and renal systems", distractors:["Only hair and nails","Only tooth enamel","Only skeletal muscle"], explanation:"Lead can affect the nervous, cardiovascular and kidney systems.", sourceFactIds:["env-cp012-lead-systems"] },
  { qlId:"ENV-012-QL-007", qlName:"Lead", difficulty:"Medium", stem:"Which group is particularly vulnerable to the neurotoxic effects of lead?", correct:"Young children", distractors:["Only healthy adults","Only athletes","Only deep-sea divers"], explanation:"Young children are especially vulnerable because the brain is still developing.", sourceFactIds:["env-cp012-lead-neuro"] },

  { qlId:"ENV-012-QL-008", qlName:"Mercury", difficulty:"Medium", stem:"People are commonly exposed to methylmercury through eating contaminated:", correct:"Fish and shellfish", distractors:["Rock salt only","Pure distilled water","Fresh air"], explanation:"Fish and shellfish are a major route of methylmercury exposure.", sourceFactIds:["env-cp012-mercury-exposure"] },
  { qlId:"ENV-012-QL-008", qlName:"Mercury", difficulty:"Medium", stem:"Mercury can have toxic effects especially on the:", correct:"Nervous system and kidneys", distractors:["Hair colour only","Tooth shape only","Fingerprints only"], explanation:"Mercury can damage the nervous system and kidneys.", sourceFactIds:["env-cp012-mercury-neuro"] },
  { qlId:"ENV-012-QL-008", qlName:"Mercury", difficulty:"Medium", stem:"In an aquatic food chain, methylmercury is often highest in:", correct:"Large predatory fish", distractors:["Rainwater droplets only","Sand grains only","Aquatic plants in every case"], explanation:"Methylmercury generally reaches higher levels in large predatory fish.", sourceFactIds:["env-cp012-mercury-food-chain"] },
  { qlId:"ENV-012-QL-008", qlName:"Mercury", difficulty:"Medium", stem:"Mercury exposure is especially concerning during pregnancy because it can harm the:", correct:"Developing fetus", distractors:["Soil texture","Rainfall pattern","Water hardness"], explanation:"Mercury can threaten fetal neurological development.", sourceFactIds:["env-cp012-mercury-neuro"] },

  { qlId:"ENV-012-QL-009", qlName:"Arsenic", difficulty:"Medium", stem:"A major route of chronic inorganic arsenic exposure is:", correct:"Contaminated groundwater", distractors:["Pure oxygen","Filtered sunlight","Wind energy"], explanation:"Contaminated groundwater is a major source of arsenic exposure.", sourceFactIds:["env-cp012-arsenic-groundwater"] },
  { qlId:"ENV-012-QL-009", qlName:"Arsenic", difficulty:"Medium", stem:"Long-term arsenic exposure is classically linked with:", correct:"Skin lesions", distractors:["Improved vision","Stronger tooth enamel","Higher lung capacity"], explanation:"Chronic arsenic exposure can cause characteristic skin lesions.", sourceFactIds:["env-cp012-arsenic-effects"] },
  { qlId:"ENV-012-QL-009", qlName:"Arsenic", difficulty:"Medium", stem:"Chronic inorganic arsenic exposure can increase the risk of:", correct:"Cancer", distractors:["Improved immunity","Faster bone healing","Higher blood oxygen"], explanation:"Long-term arsenic exposure is linked with several cancers.", sourceFactIds:["env-cp012-arsenic-effects"] },
  { qlId:"ENV-012-QL-009", qlName:"Arsenic", difficulty:"Medium", stem:"Which pollutant is strongly linked with groundwater contamination and chronic skin changes?", correct:"Arsenic", distractors:["Helium","Neon","Oxygen"], explanation:"Arsenic-contaminated groundwater can cause chronic skin changes.", sourceFactIds:["env-cp012-arsenic-groundwater","env-cp012-arsenic-effects"] },

  { qlId:"ENV-012-QL-010", qlName:"Cadmium and COD", difficulty:"Medium", stem:"Cadmium toxicity most directly affects the kidneys and the:", correct:"Skeletal and respiratory systems", distractors:["Hair and nails only","Eyes only","Taste buds only"], explanation:"Cadmium can damage kidneys and the skeletal and respiratory systems.", sourceFactIds:["env-cp012-cadmium-effects"] },
  { qlId:"ENV-012-QL-010", qlName:"Cadmium and COD", difficulty:"Medium", stem:"Which heavy metal is well known for kidney and skeletal toxicity?", correct:"Cadmium", distractors:["Helium","Argon","Neon"], explanation:"Cadmium has important kidney and skeletal toxic effects.", sourceFactIds:["env-cp012-cadmium-effects"] },
  { qlId:"ENV-012-QL-010", qlName:"Cadmium and COD", difficulty:"Medium", stem:"Chemical oxygen demand (COD) measures the oxygen equivalent of material oxidized by a:", correct:"Strong chemical oxidant", distractors:["Sound wave","Magnetic field","Biological predator"], explanation:"COD uses chemical oxidation to estimate oxygen-equivalent demand.", sourceFactIds:["env-cp012-cod-definition"] },
  { qlId:"ENV-012-QL-010", qlName:"Cadmium and COD", difficulty:"Medium", stem:"Which water-quality measure relies on chemical oxidation rather than microbial decomposition?", correct:"COD", distractors:["BOD","Noise level","Turbidity alone"], explanation:"COD measures chemically oxidizable material using a strong oxidant.", sourceFactIds:["env-cp012-cod-definition"] },

  { qlId:"ENV-012-QL-011", qlName:"Correct / incorrect pollutant-effect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Carbon monoxide — reduced oxygen transport", distractors:["Lead — improved brain development","Arsenic — increased lung capacity","Cadmium — stronger bones"], explanation:"CO reduces oxygen transport by forming carboxyhemoglobin.", sourceFactIds:["env-cp012-co-oxygen"] },
  { qlId:"ENV-012-QL-011", qlName:"Correct / incorrect pollutant-effect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Lead — improved nervous-system development", distractors:["Mercury — neurological toxicity","Arsenic — skin lesions","Cadmium — kidney toxicity"], explanation:"Lead can damage, not improve, the developing nervous system.", sourceFactIds:["env-cp012-lead-neuro","env-cp012-mercury-neuro","env-cp012-arsenic-effects","env-cp012-cadmium-effects"] },
  { qlId:"ENV-012-QL-011", qlName:"Correct / incorrect pollutant-effect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Excess nutrients — eutrophication", distractors:["SO2 and NOx — oxygen enrichment","Fine PM — improved lung function","Methylmercury — lowest in predatory fish"], explanation:"Excess nitrogen and phosphorus can drive eutrophication.", sourceFactIds:["env-cp012-nutrient-eutrophication"] },
  { qlId:"ENV-012-QL-011", qlName:"Correct / incorrect pollutant-effect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Biomagnification — decreasing concentration up a food chain", distractors:["Bioaccumulation — build-up within an organism","Acid rain — SO2 and NOx","BOD — microbial oxygen demand"], explanation:"Biomagnification means concentration increases at higher trophic levels.", sourceFactIds:["env-cp012-biomagnification","env-cp012-bioaccumulation","env-cp012-acid-rain-precursors","env-cp012-bod-definition"] },

  { qlId:"ENV-012-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. Excess nutrients can cause algal blooms.\n2. Decomposition of blooms can lower dissolved oxygen.\n3. Eutrophication always raises dissolved oxygen.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct; eutrophication can lower oxygen.", sourceFactIds:["env-cp012-nutrient-eutrophication","env-cp012-algal-oxygen"] },
  { qlId:"ENV-012-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. CO reduces oxygen transport in blood.\n2. Fine PM can penetrate deep into the lungs.\n3. Lead is harmless to the developing brain.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct; lead can harm brain development.", sourceFactIds:["env-cp012-co-oxygen","env-cp012-pm-lungs","env-cp012-lead-neuro"] },
  { qlId:"ENV-012-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"A lake receives excess fertilizer, develops an algal bloom and later shows fish deaths from low oxygen. The process is:", correct:"Eutrophication", distractors:["Biomagnification","Acid deposition","Thermal inversion"], explanation:"Excess nutrients can trigger blooms followed by oxygen depletion.", sourceFactIds:["env-cp012-nutrient-eutrophication","env-cp012-algal-oxygen"] },
  { qlId:"ENV-012-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"A persistent contaminant becomes more concentrated from plankton to small fish to predatory fish. This is:", correct:"Biomagnification", distractors:["Bioaccumulation within one organism only","Eutrophication","Sedimentation"], explanation:"Increasing concentration across trophic levels is biomagnification.", sourceFactIds:["env-cp012-biomagnification"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-012 requires four unique options");
  return options;
}

export function generateEnvCp012ReviewBatchV1(): EnvCp012ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP012-V1-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-012",
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
