import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP013_FACT_BY_ID_V1 } from "./env-cp013-facts";
import type { EnvCp013ReviewQuestion } from "./env-cp013-review-types";

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
  { qlId:"ENV-013-QL-001", qlName:"Atmospheric layers — order", difficulty:"Easy", stem:"Which is the lowest major layer of Earth's atmosphere?", correct:"Troposphere", distractors:["Stratosphere","Mesosphere","Thermosphere"], explanation:"The troposphere is the lowest major atmospheric layer.", sourceFactIds:["env-cp013-layer-order"] },
  { qlId:"ENV-013-QL-001", qlName:"Atmospheric layers — order", difficulty:"Easy", stem:"Which atmospheric layer lies immediately above the troposphere?", correct:"Stratosphere", distractors:["Mesosphere","Thermosphere","Exosphere"], explanation:"The stratosphere lies directly above the troposphere.", sourceFactIds:["env-cp013-layer-order"] },
  { qlId:"ENV-013-QL-001", qlName:"Atmospheric layers — order", difficulty:"Easy", stem:"Which is the correct order from lower to higher atmosphere?", correct:"Troposphere → Stratosphere → Mesosphere", distractors:["Stratosphere → Troposphere → Mesosphere","Mesosphere → Stratosphere → Troposphere","Troposphere → Mesosphere → Stratosphere"], explanation:"The first three major layers are troposphere, stratosphere and mesosphere.", sourceFactIds:["env-cp013-layer-order"] },
  { qlId:"ENV-013-QL-001", qlName:"Atmospheric layers — order", difficulty:"Easy", stem:"Which is the highest of the five major atmospheric layers?", correct:"Exosphere", distractors:["Troposphere","Stratosphere","Mesosphere"], explanation:"The exosphere is the highest major atmospheric layer.", sourceFactIds:["env-cp013-layer-order","env-cp013-exosphere-highest"] },

  { qlId:"ENV-013-QL-002", qlName:"Troposphere and dry-air basics", difficulty:"Easy", stem:"Most weather phenomena occur in the:", correct:"Troposphere", distractors:["Stratosphere","Mesosphere","Exosphere"], explanation:"Most weather occurs in the troposphere.", sourceFactIds:["env-cp013-troposphere-lowest"] },
  { qlId:"ENV-013-QL-002", qlName:"Troposphere and dry-air basics", difficulty:"Easy", stem:"Most atmospheric water vapour is found in the:", correct:"Troposphere", distractors:["Mesosphere","Thermosphere","Exosphere"], explanation:"The troposphere contains nearly all atmospheric water vapour.", sourceFactIds:["env-cp013-troposphere-water"] },
  { qlId:"ENV-013-QL-002", qlName:"Troposphere and dry-air basics", difficulty:"Easy", stem:"Which gas forms the largest share of dry air?", correct:"Nitrogen", distractors:["Oxygen","Argon","Carbon dioxide"], explanation:"Nitrogen makes up about 78% of dry air.", sourceFactIds:["env-cp013-air-nitrogen"] },
  { qlId:"ENV-013-QL-002", qlName:"Troposphere and dry-air basics", difficulty:"Easy", stem:"Oxygen forms approximately what share of dry air?", correct:"About 21%", distractors:["About 78%","About 50%","Less than 1%"], explanation:"Oxygen makes up about 21% of dry air.", sourceFactIds:["env-cp013-air-oxygen"] },

  { qlId:"ENV-013-QL-003", qlName:"Stratosphere and ozone layer", difficulty:"Easy", stem:"The protective ozone layer is mainly located in the:", correct:"Stratosphere", distractors:["Troposphere","Mesosphere","Exosphere"], explanation:"Most protective atmospheric ozone is in the stratosphere.", sourceFactIds:["env-cp013-stratosphere-ozone"] },
  { qlId:"ENV-013-QL-003", qlName:"Stratosphere and ozone layer", difficulty:"Easy", stem:"Temperature generally increases with height in the stratosphere mainly because ozone absorbs:", correct:"Ultraviolet radiation", distractors:["Sound waves","Ocean currents","Earthquakes"], explanation:"Ozone absorbs ultraviolet radiation and warms the stratosphere.", sourceFactIds:["env-cp013-stratosphere-temp"] },
  { qlId:"ENV-013-QL-003", qlName:"Stratosphere and ozone layer", difficulty:"Easy", stem:"Which layer lies between the troposphere and mesosphere?", correct:"Stratosphere", distractors:["Thermosphere","Exosphere","Ionosphere"], explanation:"The stratosphere lies above the troposphere and below the mesosphere.", sourceFactIds:["env-cp013-layer-order"] },
  { qlId:"ENV-013-QL-003", qlName:"Stratosphere and ozone layer", difficulty:"Easy", stem:"Absorption of solar UV by ozone is a key feature of the:", correct:"Stratosphere", distractors:["Troposphere only","Exosphere only","Ocean surface"], explanation:"Stratospheric ozone absorbs harmful ultraviolet radiation.", sourceFactIds:["env-cp013-stratosphere-ozone","env-cp013-ozone-uv"] },

  { qlId:"ENV-013-QL-004", qlName:"Mesosphere, thermosphere and exosphere", difficulty:"Medium", stem:"Most meteors burn up in which atmospheric layer?", correct:"Mesosphere", distractors:["Troposphere","Stratosphere","Exosphere"], explanation:"Most meteors burn up in the mesosphere.", sourceFactIds:["env-cp013-mesosphere-meteors"] },
  { qlId:"ENV-013-QL-004", qlName:"Mesosphere, thermosphere and exosphere", difficulty:"Medium", stem:"Auroras are commonly observed in which major atmospheric layer?", correct:"Thermosphere", distractors:["Troposphere","Stratosphere","Mesosphere"], explanation:"Auroras can occur in the thermosphere.", sourceFactIds:["env-cp013-thermosphere-aurora"] },
  { qlId:"ENV-013-QL-004", qlName:"Mesosphere, thermosphere and exosphere", difficulty:"Medium", stem:"The International Space Station orbits mainly in the:", correct:"Thermosphere", distractors:["Troposphere","Stratosphere","Mesosphere"], explanation:"The International Space Station orbits in the thermosphere.", sourceFactIds:["env-cp013-thermosphere-iss"] },
  { qlId:"ENV-013-QL-004", qlName:"Mesosphere, thermosphere and exosphere", difficulty:"Medium", stem:"Which major atmospheric layer gradually merges with outer space?", correct:"Exosphere", distractors:["Troposphere","Stratosphere","Mesosphere"], explanation:"The exosphere is the outermost major layer and merges gradually with space.", sourceFactIds:["env-cp013-exosphere-highest"] },

  { qlId:"ENV-013-QL-005", qlName:"Ozone and ultraviolet protection", difficulty:"Medium", stem:"The main environmental role of stratospheric ozone is to absorb harmful:", correct:"Ultraviolet radiation", distractors:["Sound energy","Ocean tides","Seismic waves"], explanation:"Stratospheric ozone absorbs harmful ultraviolet radiation from the Sun.", sourceFactIds:["env-cp013-ozone-uv"] },
  { qlId:"ENV-013-QL-005", qlName:"Ozone and ultraviolet protection", difficulty:"Medium", stem:"What is the chemical formula of ozone?", correct:"O3", distractors:["O2","CO2","N2O"], explanation:"Ozone is made of three oxygen atoms, so its formula is O3.", sourceFactIds:["env-cp013-ozone-formula"] },
  { qlId:"ENV-013-QL-005", qlName:"Ozone and ultraviolet protection", difficulty:"Medium", stem:"A thinner stratospheric ozone layer would allow more harmful radiation of which type to reach Earth's surface?", correct:"Ultraviolet", distractors:["Sound","Microwave from oceans","Seismic"], explanation:"Less stratospheric ozone means less absorption of harmful ultraviolet radiation.", sourceFactIds:["env-cp013-ozone-uv"] },
  { qlId:"ENV-013-QL-005", qlName:"Ozone and ultraviolet protection", difficulty:"Medium", stem:"Which statement about stratospheric ozone is correct?", correct:"It protects life by absorbing harmful solar UV", distractors:["It is the main cause of earthquakes","It creates ocean tides","It is harmless only at ground level"], explanation:"Stratospheric ozone acts as a protective UV shield.", sourceFactIds:["env-cp013-ozone-uv"] },

  { qlId:"ENV-013-QL-006", qlName:"Stratospheric vs ground-level ozone", difficulty:"Medium", stem:"Ozone that protects life from harmful UV is found mainly in the:", correct:"Stratosphere", distractors:["Lower troposphere near roads","Ocean floor","Soil profile"], explanation:"Protective ozone is mainly stratospheric ozone.", sourceFactIds:["env-cp013-stratosphere-ozone","env-cp013-ozone-uv"] },
  { qlId:"ENV-013-QL-006", qlName:"Stratospheric vs ground-level ozone", difficulty:"Medium", stem:"Ground-level ozone is best described as a:", correct:"Harmful air pollutant", distractors:["Protective UV shield","Major component of dry air","Primary greenhouse-free gas"], explanation:"Ground-level ozone is harmful to breathe and contributes to smog.", sourceFactIds:["env-cp013-ground-ozone"] },
  { qlId:"ENV-013-QL-006", qlName:"Stratospheric vs ground-level ozone", difficulty:"Medium", stem:"Ground-level ozone forms mainly when NOx and VOCs react in the presence of:", correct:"Sunlight", distractors:["Deep ocean pressure","Earthquakes","Snowfall only"], explanation:"Sunlight drives reactions of NOx and VOCs that form ground-level ozone.", sourceFactIds:["env-cp013-ground-ozone-formation"] },
  { qlId:"ENV-013-QL-006", qlName:"Stratospheric vs ground-level ozone", difficulty:"Medium", stem:"Which pair correctly compares ozone by location?", correct:"Stratosphere — protective; ground level — pollutant", distractors:["Stratosphere — pollutant; ground level — protective","Both locations — harmless","Both locations — only weather gases"], explanation:"Ozone protects in the stratosphere but is harmful near the ground.", sourceFactIds:["env-cp013-ozone-uv","env-cp013-ground-ozone"] },

  { qlId:"ENV-013-QL-007", qlName:"Ozone-depletion mechanism", difficulty:"Medium", stem:"Ozone-depleting substances can damage stratospheric ozone after releasing atoms of:", correct:"Chlorine or bromine", distractors:["Nitrogen or oxygen only","Helium or neon","Calcium or magnesium"], explanation:"Chlorine and bromine released from ODS can destroy stratospheric ozone.", sourceFactIds:["env-cp013-ods-mechanism"] },
  { qlId:"ENV-013-QL-007", qlName:"Ozone-depletion mechanism", difficulty:"Medium", stem:"Many ozone-depleting substances remain stable mainly in the:", correct:"Troposphere", distractors:["Earth's core","Ocean sediments only","Upper mantle"], explanation:"Many ODS are stable in the troposphere before reaching the stratosphere.", sourceFactIds:["env-cp013-ods-mechanism"] },
  { qlId:"ENV-013-QL-007", qlName:"Ozone-depletion mechanism", difficulty:"Medium", stem:"What helps break down many ozone-depleting substances in the stratosphere?", correct:"Intense ultraviolet light", distractors:["Sound waves","Ocean currents","Soil microbes only"], explanation:"Intense UV light can break down ODS and release chlorine or bromine.", sourceFactIds:["env-cp013-ods-mechanism"] },
  { qlId:"ENV-013-QL-007", qlName:"Ozone-depletion mechanism", difficulty:"Medium", stem:"Which sequence best describes ozone depletion by many ODS?", correct:"Reach stratosphere → UV breakdown → chlorine/bromine release → ozone loss", distractors:["Reach ocean → freeze → release nitrogen → ozone gain","Enter soil → form oxygen → ozone gain","Enter troposphere → become water → stop UV"], explanation:"ODS can reach the stratosphere, break down under UV and release ozone-destroying halogens.", sourceFactIds:["env-cp013-ods-mechanism"] },

  { qlId:"ENV-013-QL-008", qlName:"ODS and HFC distinction", difficulty:"Medium", stem:"Which of the following is an ozone-depleting substance?", correct:"CFC", distractors:["HFC","Nitrogen","Oxygen"], explanation:"CFCs are ozone-depleting substances.", sourceFactIds:["env-cp013-cfc","env-cp013-hfc-distinction"] },
  { qlId:"ENV-013-QL-008", qlName:"ODS and HFC distinction", difficulty:"Medium", stem:"Which group is correctly listed as ozone-depleting substances?", correct:"CFCs, HCFCs and halons", distractors:["HFCs, nitrogen and oxygen","Carbon dioxide, oxygen and argon","Methane, nitrogen and helium"], explanation:"CFCs, HCFCs and halons are recognized ozone-depleting substances.", sourceFactIds:["env-cp013-ods-examples"] },
  { qlId:"ENV-013-QL-008", qlName:"ODS and HFC distinction", difficulty:"Medium", stem:"Which statement about HFCs is correct?", correct:"They do not deplete ozone but can act as powerful greenhouse gases", distractors:["They are the main protective ozone gas","They contain ozone and increase the ozone layer","They are not greenhouse gases"], explanation:"HFCs do not deplete ozone, but many are powerful greenhouse gases.", sourceFactIds:["env-cp013-hfc-distinction"] },
  { qlId:"ENV-013-QL-008", qlName:"ODS and HFC distinction", difficulty:"Medium", stem:"Which ozone-depleting group is especially linked with bromine chemistry?", correct:"Halons", distractors:["HFCs","Carbon dioxide","Nitrogen"], explanation:"Halons are bromine-containing ozone-depleting substances.", sourceFactIds:["env-cp013-halon"] },

  { qlId:"ENV-013-QL-009", qlName:"Greenhouse effect", difficulty:"Medium", stem:"The greenhouse effect is the process by which atmospheric gases:", correct:"Trap heat near Earth's surface", distractors:["Remove all incoming sunlight","Stop Earth's rotation","Create ocean tides"], explanation:"Greenhouse gases trap part of Earth's outgoing heat near the surface.", sourceFactIds:["env-cp013-greenhouse-effect"] },
  { qlId:"ENV-013-QL-009", qlName:"Greenhouse effect", difficulty:"Medium", stem:"The natural greenhouse effect is important because it keeps Earth:", correct:"Warmer than it would otherwise be", distractors:["Completely free of heat","Without an atmosphere","At the same temperature everywhere"], explanation:"The natural greenhouse effect helps keep Earth warm enough for life.", sourceFactIds:["env-cp013-natural-greenhouse"] },
  { qlId:"ENV-013-QL-009", qlName:"Greenhouse effect", difficulty:"Medium", stem:"Which type of energy is mainly slowed from escaping to space by greenhouse gases?", correct:"Infrared heat emitted by Earth", distractors:["Sound from oceans","Seismic waves","Magnetic field lines"], explanation:"Greenhouse gases absorb and re-emit outgoing infrared heat.", sourceFactIds:["env-cp013-greenhouse-effect","env-cp013-co2-role"] },
  { qlId:"ENV-013-QL-009", qlName:"Greenhouse effect", difficulty:"Medium", stem:"Without the natural greenhouse effect, Earth's surface would generally be:", correct:"Much colder", distractors:["Much hotter because all heat stays","Unchanged","Without sunlight"], explanation:"Natural greenhouse gases keep Earth warmer than it would otherwise be.", sourceFactIds:["env-cp013-natural-greenhouse"] },

  { qlId:"ENV-013-QL-010", qlName:"Greenhouse gases", difficulty:"Medium", stem:"Which of the following is a greenhouse gas?", correct:"Methane", distractors:["Nitrogen","Oxygen","Argon"], explanation:"Methane is a greenhouse gas.", sourceFactIds:["env-cp013-ghg-list"] },
  { qlId:"ENV-013-QL-010", qlName:"Greenhouse gases", difficulty:"Medium", stem:"Which pair contains only greenhouse gases?", correct:"Carbon dioxide and nitrous oxide", distractors:["Nitrogen and oxygen","Argon and nitrogen","Oxygen and helium"], explanation:"Carbon dioxide and nitrous oxide both contribute to the greenhouse effect.", sourceFactIds:["env-cp013-ghg-list"] },
  { qlId:"ENV-013-QL-010", qlName:"Greenhouse gases", difficulty:"Medium", stem:"Water vapour is important in the greenhouse system mainly because it acts as a:", correct:"Greenhouse-gas feedback", distractors:["Non-atmospheric mineral","Source of ozone-depleting chlorine","Major dry-air inert gas"], explanation:"Water vapour is a greenhouse gas that mainly amplifies existing warming as a feedback.", sourceFactIds:["env-cp013-water-vapour-feedback"] },
  { qlId:"ENV-013-QL-010", qlName:"Greenhouse gases", difficulty:"Medium", stem:"Which of the following is NOT a major greenhouse gas?", correct:"Nitrogen", distractors:["Carbon dioxide","Methane","Nitrous oxide"], explanation:"Nitrogen is the main gas in dry air but is not a major greenhouse gas.", sourceFactIds:["env-cp013-ghg-list","env-cp013-air-nitrogen"] },

  { qlId:"ENV-013-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Mesosphere — most meteors burn up", distractors:["Troposphere — main ozone layer","Exosphere — most weather","Stratosphere — ISS orbit"], explanation:"Most meteors burn up in the mesosphere.", sourceFactIds:["env-cp013-mesosphere-meteors","env-cp013-troposphere-lowest","env-cp013-stratosphere-ozone","env-cp013-thermosphere-iss"] },
  { qlId:"ENV-013-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Ground-level ozone — protective UV shield", distractors:["Stratospheric ozone — UV protection","CFCs — ozone-depleting substances","HFCs — greenhouse gases"], explanation:"Ground-level ozone is a pollutant; protective ozone is in the stratosphere.", sourceFactIds:["env-cp013-ground-ozone","env-cp013-ozone-uv","env-cp013-cfc","env-cp013-hfc-distinction"] },
  { qlId:"ENV-013-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Thermosphere — auroras", distractors:["Mesosphere — main weather layer","Troposphere — outermost layer","Exosphere — ozone layer"], explanation:"Auroras can occur in the thermosphere.", sourceFactIds:["env-cp013-thermosphere-aurora","env-cp013-troposphere-lowest","env-cp013-exosphere-highest","env-cp013-stratosphere-ozone"] },
  { qlId:"ENV-013-QL-011", qlName:"Correct / incorrect pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"HFCs — main ozone-depleting chlorine source", distractors:["CFCs — ozone-depleting substances","Water vapour — greenhouse gas","Carbon dioxide — greenhouse gas"], explanation:"HFCs do not deplete ozone, though many are powerful greenhouse gases.", sourceFactIds:["env-cp013-hfc-distinction","env-cp013-cfc","env-cp013-ghg-list","env-cp013-co2-role"] },

  { qlId:"ENV-013-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. Most weather occurs in the troposphere.\n2. The ozone layer is mainly in the stratosphere.\n3. Most meteors burn up in the exosphere.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct; most meteors burn up in the mesosphere.", sourceFactIds:["env-cp013-troposphere-lowest","env-cp013-stratosphere-ozone","env-cp013-mesosphere-meteors"] },
  { qlId:"ENV-013-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"Consider the following statements:\n1. Stratospheric ozone absorbs harmful UV.\n2. Ground-level ozone can be harmful to breathe.\n3. HFCs are major ozone-depleting substances.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"The first two are correct; HFCs do not deplete the ozone layer.", sourceFactIds:["env-cp013-ozone-uv","env-cp013-ground-ozone","env-cp013-hfc-distinction"] },
  { qlId:"ENV-013-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"A stable compound reaches the stratosphere, breaks down under UV and releases chlorine. What is the main concern?", correct:"Ozone depletion", distractors:["Ocean acidification only","Soil salinity","Noise pollution"], explanation:"Stratospheric chlorine released from ODS can destroy ozone.", sourceFactIds:["env-cp013-ods-mechanism"] },
  { qlId:"ENV-013-QL-012", qlName:"Statements and applied identification", difficulty:"Hard", stem:"A gas traps outgoing heat but does not deplete stratospheric ozone. Which group can fit this description?", correct:"HFCs", distractors:["Halons","CFCs","Methyl bromide"], explanation:"HFCs can be powerful greenhouse gases without depleting ozone.", sourceFactIds:["env-cp013-hfc-distinction","env-cp013-ods-examples"] },
]);

function sourceIdsFor(sourceFactIds: readonly string[]): string[] {
  return [...new Set(sourceFactIds.flatMap((id) => ENV_CP013_FACT_BY_ID_V1.get(id)?.sourceIds ?? []))];
}

export function generateEnvCp013ReviewBatchV1(): EnvCp013ReviewQuestion[] {
  const byQlCount = new Map<string, number>();
  return S.map((seed, index) => {
    const local = byQlCount.get(seed.qlId) ?? 0;
    byQlCount.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local % POSITIONS.length];
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.correct);
    return {
      questionId: `ENV-CP013-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-013",
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
  });
}