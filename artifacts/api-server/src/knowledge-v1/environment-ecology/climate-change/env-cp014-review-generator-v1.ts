import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP014_FACT_BY_ID_V1 } from "./env-cp014-facts";
import type { EnvCp014ReviewQuestion } from "./env-cp014-review-types";

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

const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-014-QL-001", qlName:"Human-caused warming", difficulty:"Easy", stem:"Recent global warming is mainly caused by:", correct:"Human greenhouse-gas emissions", distractors:["Ocean tides","Volcanic activity alone","Solar changes alone"], explanation:"Human greenhouse-gas emissions are the main cause of recent global warming.", sourceFactIds:["env-cp014-human-warming"] },
  { qlId:"ENV-014-QL-001", qlName:"Human-caused warming", difficulty:"Easy", stem:"Human influence has warmed the:", correct:"Atmosphere, ocean and land", distractors:["Atmosphere only","Ocean only","Polar regions only"], explanation:"Human influence has warmed the atmosphere, ocean and land.", sourceFactIds:["env-cp014-system-warming"] },
  { qlId:"ENV-014-QL-001", qlName:"Human-caused warming", difficulty:"Easy", stem:"Burning fossil fuels mainly increases:", correct:"Greenhouse-gas emissions", distractors:["Earth's rotation","Ocean tides","Incoming sunlight"], explanation:"Fossil-fuel burning is a major source of greenhouse-gas emissions.", sourceFactIds:["env-cp014-ghg-sources"] },
  { qlId:"ENV-014-QL-001", qlName:"Human-caused warming", difficulty:"Easy", stem:"Land-use change can increase warming by:", correct:"Releasing greenhouse gases and reducing carbon sinks", distractors:["Stopping evaporation","Reducing gravity","Increasing Earth's distance from the Sun"], explanation:"Land-use change can release greenhouse gases and reduce carbon storage.", sourceFactIds:["env-cp014-ghg-sources","env-cp014-carbon-sinks"] },

  { qlId:"ENV-014-QL-002", qlName:"Evidence of climate change", difficulty:"Easy", stem:"Which is evidence of climate change?", correct:"Rising global temperature", distractors:["Falling global temperature","Growth of all glaciers","Falling global sea level"], explanation:"Rising global surface temperature is a major climate-change indicator.", sourceFactIds:["env-cp014-temperature-evidence"] },
  { qlId:"ENV-014-QL-002", qlName:"Evidence of climate change", difficulty:"Easy", stem:"Which ocean change shows a warming climate?", correct:"Rising ocean temperature", distractors:["Cooling of all oceans","Falling sea level everywhere","Growth of all glaciers"], explanation:"The global ocean has warmed along with the climate system.", sourceFactIds:["env-cp014-ocean-warming"] },
  { qlId:"ENV-014-QL-002", qlName:"Evidence of climate change", difficulty:"Easy", stem:"Shrinking glaciers are a change in the:", correct:"Cryosphere", distractors:["Lithosphere","Magnetosphere","Earth's core"], explanation:"Glaciers are part of the cryosphere.", sourceFactIds:["env-cp014-glacier-loss"] },
  { qlId:"ENV-014-QL-002", qlName:"Evidence of climate change", difficulty:"Easy", stem:"Which set shows a warming climate?", correct:"Rising temperature, ocean warming and glacier loss", distractors:["Cooling, glacier growth and falling seas","Stable temperature and growing glaciers","Only changes in tides"], explanation:"Rising temperature, warmer oceans and glacier loss are observed climate indicators.", sourceFactIds:["env-cp014-temperature-evidence","env-cp014-ocean-warming","env-cp014-glacier-loss"] },

  { qlId:"ENV-014-QL-003", qlName:"Sea-level rise", difficulty:"Easy", stem:"Why does warm seawater raise sea level?", correct:"It expands", distractors:["It freezes","It loses all salt","It becomes heavier and sinks"], explanation:"Seawater expands as it warms, raising sea level.", sourceFactIds:["env-cp014-sea-level-causes"] },
  { qlId:"ENV-014-QL-003", qlName:"Sea-level rise", difficulty:"Easy", stem:"What raises sea level by adding water to the ocean?", correct:"Melting land ice", distractors:["Melting floating sea ice only","Formation of sea ice","Ocean evaporation"], explanation:"Melting glaciers and ice sheets on land add water to the ocean.", sourceFactIds:["env-cp014-land-ice"] },
  { qlId:"ENV-014-QL-003", qlName:"Sea-level rise", difficulty:"Easy", stem:"Which is NOT a main direct cause of sea-level rise?", correct:"Melting floating sea ice", distractors:["Thermal expansion","Melting mountain glaciers","Ice-sheet loss on land"], explanation:"Floating sea ice already displaces water; land-ice melt directly adds water.", sourceFactIds:["env-cp014-sea-ice-distinction","env-cp014-sea-level-causes"] },
  { qlId:"ENV-014-QL-003", qlName:"Sea-level rise", difficulty:"Easy", stem:"The main causes of sea-level rise are:", correct:"Thermal expansion and melting land ice", distractors:["Tides and earthquakes","Sea-ice melt and winds","Salinity and ocean currents"], explanation:"Warming seawater expands and melting land ice adds water to the ocean.", sourceFactIds:["env-cp014-sea-level-causes"] },

  { qlId:"ENV-014-QL-004", qlName:"Cryosphere changes", difficulty:"Medium", stem:"Glaciers are part of the:", correct:"Cryosphere", distractors:["Magnetosphere","Mantle","Core"], explanation:"The cryosphere includes glaciers and ice sheets.", sourceFactIds:["env-cp014-glacier-loss"] },
  { qlId:"ENV-014-QL-004", qlName:"Cryosphere changes", difficulty:"Medium", stem:"Why does melting land ice raise sea level?", correct:"It adds water to the ocean", distractors:["It removes ocean water","It stops thermal expansion","It lowers ocean volume"], explanation:"Land-ice melt transfers stored water from land to the ocean.", sourceFactIds:["env-cp014-land-ice"] },
  { qlId:"ENV-014-QL-004", qlName:"Cryosphere changes", difficulty:"Medium", stem:"Which melt directly raises global sea level?", correct:"Land ice", distractors:["Floating sea ice only","Cloud ice only","Frost on plants"], explanation:"Melting land ice directly adds new water to the ocean.", sourceFactIds:["env-cp014-land-ice","env-cp014-sea-ice-distinction"] },
  { qlId:"ENV-014-QL-004", qlName:"Cryosphere changes", difficulty:"Medium", stem:"Which shows loss of land ice?", correct:"Shrinking glaciers and ice sheets", distractors:["Higher ocean tides","More atmospheric nitrogen","Faster plate movement"], explanation:"Glacier retreat and ice-sheet mass loss show declining land ice.", sourceFactIds:["env-cp014-glacier-loss"] },

  { qlId:"ENV-014-QL-005", qlName:"Weather and climate extremes", difficulty:"Medium", stem:"With warming, heatwaves generally become:", correct:"More frequent and more intense", distractors:["Less frequent everywhere","Weaker everywhere","Unchanged everywhere"], explanation:"Hot extremes have become more frequent and intense across most land regions.", sourceFactIds:["env-cp014-hot-extremes"] },
  { qlId:"ENV-014-QL-005", qlName:"Weather and climate extremes", difficulty:"Medium", stem:"With more warming, heavy rainfall generally becomes:", correct:"More intense", distractors:["Always weaker","Impossible","Unrelated to warming"], explanation:"Heavy precipitation generally becomes more intense as warming increases.", sourceFactIds:["env-cp014-heavy-rain"] },
  { qlId:"ENV-014-QL-005", qlName:"Weather and climate extremes", difficulty:"Medium", stem:"Which extreme is strongly linked with global warming?", correct:"Heatwaves", distractors:["Earthquakes","Volcanic eruptions","Tsunamis"], explanation:"Human-caused warming is a major driver of stronger hot extremes.", sourceFactIds:["env-cp014-hot-extremes"] },
  { qlId:"ENV-014-QL-005", qlName:"Weather and climate extremes", difficulty:"Medium", stem:"Which statement is correct?", correct:"Warming can intensify heat and heavy rainfall", distractors:["Climate change affects no extremes","Every extreme changes the same way everywhere","Only earthquakes respond to warming"], explanation:"Warming can strengthen heat extremes and heavy precipitation.", sourceFactIds:["env-cp014-hot-extremes","env-cp014-heavy-rain"] },

  { qlId:"ENV-014-QL-006", qlName:"Ocean warming and acidification", difficulty:"Medium", stem:"Ocean acidification is mainly caused by absorption of:", correct:"Carbon dioxide", distractors:["Helium","Argon","Nitrogen"], explanation:"Seawater absorbs carbon dioxide, which increases acidity.", sourceFactIds:["env-cp014-ocean-acidification"] },
  { qlId:"ENV-014-QL-006", qlName:"Ocean warming and acidification", difficulty:"Medium", stem:"As ocean acidity increases, seawater pH:", correct:"Decreases", distractors:["Increases","Stays exactly 7","Becomes unrelated to carbon dioxide"], explanation:"Greater acidity means a lower pH.", sourceFactIds:["env-cp014-ocean-acidification"] },
  { qlId:"ENV-014-QL-006", qlName:"Ocean warming and acidification", difficulty:"Medium", stem:"Which ocean change shows climate warming?", correct:"Rising ocean temperature", distractors:["Cooling of all oceans","Loss of all dissolved salts","Permanent sea-level fall"], explanation:"The ocean has warmed as part of climate-system warming.", sourceFactIds:["env-cp014-ocean-warming"] },
  { qlId:"ENV-014-QL-006", qlName:"Ocean warming and acidification", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"CO2 absorption — ocean acidification", distractors:["Ocean warming — sea-level fall","Land-ice melt — lower sea level","Ocean acidification — higher pH"], explanation:"Carbon dioxide absorbed by seawater drives ocean acidification.", sourceFactIds:["env-cp014-ocean-acidification"] },

  { qlId:"ENV-014-QL-007", qlName:"Climate-change impacts", difficulty:"Medium", stem:"Climate change can affect:", correct:"Food, water, health and ecosystems", distractors:["Only tectonic plates","Only the magnetic field","Only ocean tides"], explanation:"Climate change affects both natural systems and human societies.", sourceFactIds:["env-cp014-impacts"] },
  { qlId:"ENV-014-QL-007", qlName:"Climate-change impacts", difficulty:"Medium", stem:"A major climate-change impact is:", correct:"Higher risks to ecosystems and people", distractors:["End of all weather hazards","Permanent fall in sea level","Equal benefits in every region"], explanation:"Climate change increases risks to ecosystems and human systems.", sourceFactIds:["env-cp014-impacts"] },
  { qlId:"ENV-014-QL-007", qlName:"Climate-change impacts", difficulty:"Medium", stem:"Food and water security are affected by changes in:", correct:"Temperature, rainfall and extremes", distractors:["Earth's core only","Magnetic north only","Lunar phases only"], explanation:"Temperature, rainfall and extremes can affect food and water security.", sourceFactIds:["env-cp014-impacts","env-cp014-hot-extremes","env-cp014-heavy-rain"] },
  { qlId:"ENV-014-QL-007", qlName:"Climate-change impacts", difficulty:"Medium", stem:"Climate impacts affect:", correct:"Ecosystems and human societies", distractors:["Only oceans","Only polar wildlife","Only mountains"], explanation:"Climate impacts occur across ecosystems and human societies.", sourceFactIds:["env-cp014-impacts"] },

  { qlId:"ENV-014-QL-008", qlName:"Mitigation", difficulty:"Medium", stem:"Climate mitigation mainly means:", correct:"Reducing emissions or increasing carbon sinks", distractors:["Increasing vulnerability","Measuring earthquakes","Responding only after disasters"], explanation:"Mitigation reduces greenhouse-gas sources or increases removals.", sourceFactIds:["env-cp014-mitigation-definition"] },
  { qlId:"ENV-014-QL-008", qlName:"Mitigation", difficulty:"Medium", stem:"Using renewable energy instead of fossil fuels is:", correct:"Mitigation", distractors:["Adaptation","Weather forecasting","Disaster relief"], explanation:"Renewable energy can reduce greenhouse-gas emissions.", sourceFactIds:["env-cp014-mitigation-examples"] },
  { qlId:"ENV-014-QL-008", qlName:"Mitigation", difficulty:"Medium", stem:"Energy efficiency is mainly a:", correct:"Mitigation measure", distractors:["Adaptation measure","Sea-level indicator","Ozone-depletion process"], explanation:"Energy efficiency can reduce energy use and emissions.", sourceFactIds:["env-cp014-mitigation-examples"] },
  { qlId:"ENV-014-QL-008", qlName:"Mitigation", difficulty:"Medium", stem:"Protecting forests helps mitigation by:", correct:"Maintaining carbon sinks", distractors:["Increasing fossil-fuel use","Increasing sea-level rise","Reducing all rainfall"], explanation:"Forests remove and store carbon dioxide.", sourceFactIds:["env-cp014-mitigation-examples","env-cp014-carbon-sinks"] },

  { qlId:"ENV-014-QL-009", qlName:"Adaptation", difficulty:"Medium", stem:"Climate adaptation mainly means:", correct:"Reducing vulnerability to climate impacts", distractors:["Increasing emissions","Causing warming","Destroying carbon sinks"], explanation:"Adaptation reduces harm from current or expected climate impacts.", sourceFactIds:["env-cp014-adaptation-definition"] },
  { qlId:"ENV-014-QL-009", qlName:"Adaptation", difficulty:"Medium", stem:"Flood defences are an example of:", correct:"Adaptation", distractors:["Mitigation only","Ozone protection","Carbon accounting"], explanation:"Flood defences reduce vulnerability to climate impacts.", sourceFactIds:["env-cp014-adaptation-examples"] },
  { qlId:"ENV-014-QL-009", qlName:"Adaptation", difficulty:"Medium", stem:"Drought-resilient crops are an example of:", correct:"Adaptation", distractors:["Mitigation only","Ozone depletion","Carbon combustion"], explanation:"Drought-resilient crops help agriculture cope with climate impacts.", sourceFactIds:["env-cp014-adaptation-examples"] },
  { qlId:"ENV-014-QL-009", qlName:"Adaptation", difficulty:"Medium", stem:"Climate early-warning systems are mainly:", correct:"Adaptation", distractors:["Fossil-fuel expansion","Greenhouse-gas generation","Ozone depletion"], explanation:"Early-warning systems help people prepare for climate hazards.", sourceFactIds:["env-cp014-adaptation-examples"] },

  { qlId:"ENV-014-QL-010", qlName:"Mitigation vs adaptation and sinks", difficulty:"Medium", stem:"Mitigation acts on causes; adaptation acts on:", correct:"Impacts and vulnerability", distractors:["Earth's orbit","Plate tectonics","Ocean tides"], explanation:"Mitigation tackles causes; adaptation reduces climate impacts and vulnerability.", sourceFactIds:["env-cp014-mitigation-adaptation"] },
  { qlId:"ENV-014-QL-010", qlName:"Mitigation vs adaptation and sinks", difficulty:"Medium", stem:"Which is a carbon sink?", correct:"Forest", distractors:["Coal power plant","Petrol engine","Cement kiln"], explanation:"Forests remove and store carbon dioxide from the atmosphere.", sourceFactIds:["env-cp014-carbon-sinks"] },
  { qlId:"ENV-014-QL-010", qlName:"Mitigation vs adaptation and sinks", difficulty:"Medium", stem:"Increasing carbon sinks is a form of:", correct:"Mitigation", distractors:["Adaptation only","Weather observation","Disaster reporting"], explanation:"Increasing carbon sinks removes more greenhouse gases from the atmosphere.", sourceFactIds:["env-cp014-enhance-sinks","env-cp014-mitigation-definition"] },
  { qlId:"ENV-014-QL-010", qlName:"Mitigation vs adaptation and sinks", difficulty:"Medium", stem:"Which pair is mitigation first, adaptation second?", correct:"Renewable energy; flood defence", distractors:["Flood defence; renewable energy","Early warning; drought-resilient crop","Coal expansion; deforestation"], explanation:"Renewable energy reduces emissions; flood defence reduces vulnerability.", sourceFactIds:["env-cp014-mitigation-examples","env-cp014-adaptation-examples","env-cp014-mitigation-adaptation"] },

  { qlId:"ENV-014-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Thermal expansion — sea-level rise", distractors:["Land-ice melt — sea-level fall","Mitigation — higher vulnerability","Adaptation — higher emissions"], explanation:"Warming seawater expands and contributes to sea-level rise.", sourceFactIds:["env-cp014-sea-level-causes"] },
  { qlId:"ENV-014-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Flood defence — mitigation", distractors:["Renewable energy — mitigation","Drought-resilient crops — adaptation","Forest protection — sink enhancement"], explanation:"Flood defence is adaptation because it reduces climate risk.", sourceFactIds:["env-cp014-adaptation-examples","env-cp014-mitigation-examples"] },
  { qlId:"ENV-014-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Carbon sink — removes CO2", distractors:["Ocean acidification — higher pH","Heatwave — cryosphere growth","Flood defence — mitigation"], explanation:"A carbon sink removes carbon dioxide from the atmosphere.", sourceFactIds:["env-cp014-carbon-sinks"] },
  { qlId:"ENV-014-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Ocean acidification — higher pH", distractors:["Hot extremes — stronger with warming","Land-ice melt — sea-level rise","Energy efficiency — mitigation"], explanation:"Ocean acidification lowers seawater pH.", sourceFactIds:["env-cp014-ocean-acidification","env-cp014-hot-extremes","env-cp014-land-ice","env-cp014-mitigation-examples"] },

  { qlId:"ENV-014-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the statements:\n1. Human emissions cause recent warming.\n2. Ocean warming and glacier loss are observed.\n3. Floating sea ice is the main direct cause of sea-level rise.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct; floating sea ice is not the main direct cause of sea-level rise.", sourceFactIds:["env-cp014-human-warming","env-cp014-ocean-warming","env-cp014-glacier-loss","env-cp014-sea-ice-distinction"] },
  { qlId:"ENV-014-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the statements:\n1. Mitigation can reduce emissions.\n2. Adaptation can reduce vulnerability.\n3. Flood defence is mainly mitigation.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"The first two are correct; flood defence is adaptation.", sourceFactIds:["env-cp014-mitigation-definition","env-cp014-adaptation-definition","env-cp014-adaptation-examples"] },
  { qlId:"ENV-014-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Sea walls and flood warnings are mainly:", correct:"Adaptation", distractors:["Mitigation only","Ozone depletion","Carbon-source expansion"], explanation:"These measures reduce vulnerability to climate impacts.", sourceFactIds:["env-cp014-adaptation-examples","env-cp014-adaptation-definition"] },
  { qlId:"ENV-014-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Solar power and forest restoration mainly support:", correct:"Mitigation", distractors:["Adaptation only","Higher emissions","Ocean acidification"], explanation:"Solar power can cut emissions and forest restoration can increase carbon sinks.", sourceFactIds:["env-cp014-mitigation-examples","env-cp014-carbon-sinks","env-cp014-enhance-sinks"] },
]);

function sourceIdsFor(sourceFactIds: readonly string[]): string[] {
  return [...new Set(sourceFactIds.flatMap((id) => ENV_CP014_FACT_BY_ID_V1.get(id)?.sourceIds ?? []))];
}

export const ENV_CP014_REVIEW_QUESTIONS_V1: readonly EnvCp014ReviewQuestion[] = Object.freeze(
  S.map((seed, index) => {
    const localIndex = index % 4;
    const correctIndex = POSITIONS[localIndex];
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.correct);
    return {
      questionId: `ENV-CP014-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-014",
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options,
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds: sourceIdsFor(seed.sourceFactIds),
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  }),
);
