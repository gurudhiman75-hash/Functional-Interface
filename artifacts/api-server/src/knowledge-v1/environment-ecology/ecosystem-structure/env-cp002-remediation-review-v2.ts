import type { KnowledgeV1Difficulty } from "../../types";
import { ENV_CP002_REMEDIATION_FACT_BY_ID_V2 } from "./env-cp002-remediation-facts-v2";
import type { EnvCp002ReviewQuestion } from "./env-cp002-review-types";

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

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-002-QL-013", qlName:"Ecological succession", difficulty:"Easy", stem:"The gradual replacement of one ecological community by another is called:", correct:"Ecological succession", distractors:["Biomagnification","Eutrophication","Nitrogen fixation"], explanation:"Ecological succession describes a sequence of community changes in the same area over time.", sourceFactIds:["env-cp002-v2-succession"] },
  { qlId:"ENV-002-QL-013", qlName:"Ecological succession", difficulty:"Easy", stem:"A grass-dominated area gradually becomes shrubland and later woodland. This shows:", correct:"Ecological succession", distractors:["Ozone depletion","Thermal inversion","Bioaccumulation"], explanation:"The example shows one biological community being replaced by another through time.", sourceFactIds:["env-cp002-v2-succession"] },
  { qlId:"ENV-002-QL-013", qlName:"Ecological succession", difficulty:"Medium", stem:"Which statement best describes ecological succession?", correct:"Community composition changes progressively over time", distractors:["Energy increases at every trophic level","All disturbances remove soil completely","Pollutants disappear from food chains"], explanation:"Succession concerns progressive change in community composition, not energy gain or automatic soil loss.", sourceFactIds:["env-cp002-v2-succession"] },
  { qlId:"ENV-002-QL-013", qlName:"Ecological succession", difficulty:"Hard", stem:"Which process is most directly concerned with long-term replacement of communities at one site?", correct:"Ecological succession", distractors:["Carbon sequestration","Denitrification","Biomagnification"], explanation:"Ecological succession is specifically the ordered change and replacement of communities at a site.", sourceFactIds:["env-cp002-v2-succession"] },

  { qlId:"ENV-002-QL-014", qlName:"Primary and secondary succession", difficulty:"Easy", stem:"Succession beginning on bare rock without developed soil is:", correct:"Primary succession", distractors:["Secondary succession","Ex-situ conservation","Eutrophication"], explanation:"Primary succession starts where an established community and developed soil are initially absent.", sourceFactIds:["env-cp002-v2-primary"] },
  { qlId:"ENV-002-QL-014", qlName:"Primary and secondary succession", difficulty:"Easy", stem:"Succession after a forest fire where soil remains is usually:", correct:"Secondary succession", distractors:["Primary succession","Ozone recovery","Nitrogen fixation"], explanation:"Secondary succession follows disturbance of an existing community and usually begins with soil still present.", sourceFactIds:["env-cp002-v2-secondary"] },
  { qlId:"ENV-002-QL-014", qlName:"Primary and secondary succession", difficulty:"Medium", stem:"Which type of succession is generally faster because soil is already available?", correct:"Secondary succession", distractors:["Primary succession","Hydrarch succession only","No succession occurs"], explanation:"Secondary succession normally proceeds faster because soil and some biological material remain after disturbance.", sourceFactIds:["env-cp002-v2-secondary","env-cp002-v2-rate"] },
  { qlId:"ENV-002-QL-014", qlName:"Primary and secondary succession", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"Bare lava without soil — primary succession", distractors:["Abandoned field with soil — primary succession","Burnt forest with soil — primary succession","Bare rock without soil — secondary succession"], explanation:"Primary succession begins on new substrate without developed soil; sites retaining soil normally undergo secondary succession.", sourceFactIds:["env-cp002-v2-primary","env-cp002-v2-secondary"] },

  { qlId:"ENV-002-QL-015", qlName:"Pioneer and climax communities", difficulty:"Easy", stem:"The earliest community to colonise a bare area is called the:", correct:"Pioneer community", distractors:["Climax community","Consumer community","Detrital community"], explanation:"The pioneer community is the first community to establish during the early stage of succession.", sourceFactIds:["env-cp002-v2-pioneer"] },
  { qlId:"ENV-002-QL-015", qlName:"Pioneer and climax communities", difficulty:"Easy", stem:"The relatively stable mature community at the end of classical succession is the:", correct:"Climax community", distractors:["Pioneer community","Trophic level","Detritivore group"], explanation:"The classical succession model calls the final relatively stable mature stage the climax community.", sourceFactIds:["env-cp002-v2-climax"] },
  { qlId:"ENV-002-QL-015", qlName:"Pioneer and climax communities", difficulty:"Medium", stem:"Which sequence best represents classical ecological succession?", correct:"Pioneer community → intermediate communities → climax community", distractors:["Climax community → bare rock → pioneer community","Consumer → producer → decomposer","Pollutant → food chain → ozone layer"], explanation:"Succession begins with pioneer colonisers and proceeds through changing communities toward a relatively stable mature stage.", sourceFactIds:["env-cp002-v2-pioneer","env-cp002-v2-climax"] },
  { qlId:"ENV-002-QL-015", qlName:"Pioneer and climax communities", difficulty:"Hard", stem:"Why are pioneer communities important in primary succession?", correct:"They begin colonisation of an initially bare substrate", distractors:["They permanently stop community change","They always remove the developing soil","They increase pollutant concentration in predators"], explanation:"Pioneer organisms establish first on bare substrate and begin the ecological changes that allow later communities to develop.", sourceFactIds:["env-cp002-v2-primary","env-cp002-v2-pioneer"] },
]);

export const ENV_CP002_REMEDIATION_REVIEW_V2: readonly EnvCp002ReviewQuestion[] = Object.freeze(
  S.map((seed, index) => {
    const correctIndex = index % 4;
    const options = [...seed.distractors];
    options.splice(correctIndex, 0, seed.correct);
    const sourceIds = [...new Set(seed.sourceFactIds.flatMap((id) => ENV_CP002_REMEDIATION_FACT_BY_ID_V2.get(id)?.sourceIds ?? []))];
    return Object.freeze({
      questionId: `ENV-CP002-V2-${String(index + 49).padStart(3, "0")}`,
      chapterId: "ENV-001" as const,
      cpId: "ENV-CP-002" as const,
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options,
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds,
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);
