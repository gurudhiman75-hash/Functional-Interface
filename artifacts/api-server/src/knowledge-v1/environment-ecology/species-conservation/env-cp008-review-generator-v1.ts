import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp008ReviewQuestion } from "./env-cp008-review-types";

type Seed = {
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  correct: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const IUCN = "IUCN-RED-LIST-CATEGORIES";
const CBD = "CBD-IN-SITU-EX-SITU";
const IUCN_EX = "IUCN-EX-SITU-GUIDELINES";
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-008-QL-001", qlName:"IUCN Red List purpose", difficulty:"Easy", stem:"The IUCN Red List mainly classifies species according to:", correct:"Risk of extinction", distractors:["Body size","Economic value","Geographic area only"], explanation:"The Red List assesses extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-red-list-purpose"] },
  { qlId:"ENV-008-QL-001", qlName:"IUCN Red List purpose", difficulty:"Easy", stem:"Which organisation publishes the Red List of Threatened Species?", correct:"IUCN", distractors:["UNESCO","WHO","WTO"], explanation:"The IUCN publishes the Red List.", sourceIds:[IUCN], sourceFactIds:["env-cp008-red-list-purpose"] },
  { qlId:"ENV-008-QL-001", qlName:"IUCN Red List purpose", difficulty:"Easy", stem:"The IUCN Red List is primarily used to indicate a species’:", correct:"Extinction risk", distractors:["Market price","Average body weight","Migration distance"], explanation:"Its categories show extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-red-list-purpose"] },
  { qlId:"ENV-008-QL-001", qlName:"IUCN Red List purpose", difficulty:"Easy", stem:"Which of the following is the main purpose of IUCN Red List categories?", correct:"Assessing conservation status by extinction risk", distractors:["Naming new species","Defining national boundaries","Classifying soil types"], explanation:"The categories classify taxa by extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-red-list-purpose"] },

  { qlId:"ENV-008-QL-002", qlName:"Threatened categories", difficulty:"Easy", stem:"Which set contains only IUCN threatened categories?", correct:"CR, EN and VU", distractors:["EX, EW and DD","NT, LC and DD","CR, NT and LC"], explanation:"CR, EN and VU are the threatened categories.", sourceIds:[IUCN], sourceFactIds:["env-cp008-threatened"] },
  { qlId:"ENV-008-QL-002", qlName:"Threatened categories", difficulty:"Easy", stem:"Which IUCN category is included among the threatened categories?", correct:"Vulnerable", distractors:["Near Threatened","Least Concern","Data Deficient"], explanation:"Vulnerable is one of the three threatened categories.", sourceIds:[IUCN], sourceFactIds:["env-cp008-threatened","env-cp008-vu"] },
  { qlId:"ENV-008-QL-002", qlName:"Threatened categories", difficulty:"Easy", stem:"Which category is NOT included in the IUCN threatened group?", correct:"Near Threatened", distractors:["Critically Endangered","Endangered","Vulnerable"], explanation:"Near Threatened is outside the threatened group.", sourceIds:[IUCN], sourceFactIds:["env-cp008-threatened","env-cp008-nt"] },
  { qlId:"ENV-008-QL-002", qlName:"Threatened categories", difficulty:"Easy", stem:"Critically Endangered, Endangered and Vulnerable are collectively called:", correct:"Threatened categories", distractors:["Extinct categories","Unevaluated categories","Data-deficient categories"], explanation:"CR, EN and VU are collectively threatened.", sourceIds:[IUCN], sourceFactIds:["env-cp008-threatened"] },

  { qlId:"ENV-008-QL-003", qlName:"CR-EN-VU risk order", difficulty:"Easy", stem:"Which IUCN category indicates the highest extinction risk among CR, EN and VU?", correct:"Critically Endangered", distractors:["Endangered","Vulnerable","Near Threatened"], explanation:"CR has the highest risk among these categories.", sourceIds:[IUCN], sourceFactIds:["env-cp008-cr","env-cp008-risk-order"] },
  { qlId:"ENV-008-QL-003", qlName:"CR-EN-VU risk order", difficulty:"Easy", stem:"Which is the correct order of decreasing extinction risk?", correct:"CR → EN → VU", distractors:["VU → EN → CR","EN → CR → VU","CR → VU → EN"], explanation:"Risk decreases from CR to EN to VU.", sourceIds:[IUCN], sourceFactIds:["env-cp008-risk-order"] },
  { qlId:"ENV-008-QL-003", qlName:"CR-EN-VU risk order", difficulty:"Easy", stem:"An Endangered species faces a _____ risk of extinction in the wild.", correct:"Very high", distractors:["Extremely high","High","Low"], explanation:"Endangered means very high extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-en"] },
  { qlId:"ENV-008-QL-003", qlName:"CR-EN-VU risk order", difficulty:"Easy", stem:"A Vulnerable species faces a _____ risk of extinction in the wild.", correct:"High", distractors:["Extremely high","Very high","No"], explanation:"Vulnerable means high extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-vu"] },

  { qlId:"ENV-008-QL-004", qlName:"EX and EW", difficulty:"Medium", stem:"A species surviving only in captivity or cultivation is placed in which IUCN category?", correct:"Extinct in the Wild", distractors:["Extinct","Critically Endangered","Data Deficient"], explanation:"EW means it no longer survives in its natural wild range.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ew"] },
  { qlId:"ENV-008-QL-004", qlName:"EX and EW", difficulty:"Medium", stem:"Which IUCN category means there is no reasonable doubt that the last individual has died?", correct:"Extinct", distractors:["Extinct in the Wild","Critically Endangered","Not Evaluated"], explanation:"EX means the taxon is extinct.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ex"] },
  { qlId:"ENV-008-QL-004", qlName:"EX and EW", difficulty:"Medium", stem:"Which statement correctly distinguishes EX from EW?", correct:"EW survives only outside its natural wild range; EX does not survive", distractors:["EX survives only in zoos; EW has no survivors","Both mean exactly the same thing","EW means the species has never been assessed"], explanation:"EW still has surviving individuals; EX does not.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ex","env-cp008-ew"] },
  { qlId:"ENV-008-QL-004", qlName:"EX and EW", difficulty:"Medium", stem:"A taxon exists in a captive breeding centre but not in its natural habitat. Its category is:", correct:"Extinct in the Wild", distractors:["Extinct","Least Concern","Not Evaluated"], explanation:"Survival only in captivity fits EW.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ew"] },

  { qlId:"ENV-008-QL-005", qlName:"NT and LC", difficulty:"Medium", stem:"A taxon close to qualifying for a threatened category is classified as:", correct:"Near Threatened", distractors:["Least Concern","Data Deficient","Extinct in the Wild"], explanation:"NT is close to qualifying as threatened.", sourceIds:[IUCN], sourceFactIds:["env-cp008-nt"] },
  { qlId:"ENV-008-QL-005", qlName:"NT and LC", difficulty:"Medium", stem:"Which IUCN category applies after assessment when a taxon does not qualify for CR, EN, VU or NT?", correct:"Least Concern", distractors:["Data Deficient","Not Evaluated","Extinct in the Wild"], explanation:"LC is used after assessment when those higher-risk categories do not apply.", sourceIds:[IUCN], sourceFactIds:["env-cp008-lc"] },
  { qlId:"ENV-008-QL-005", qlName:"NT and LC", difficulty:"Medium", stem:"Which category is closer to the threatened group?", correct:"Near Threatened", distractors:["Least Concern","Not Evaluated","Data Deficient"], explanation:"NT is close to qualifying as threatened.", sourceIds:[IUCN], sourceFactIds:["env-cp008-nt"] },
  { qlId:"ENV-008-QL-005", qlName:"NT and LC", difficulty:"Medium", stem:"Which statement about Least Concern is correct?", correct:"The taxon has been evaluated and does not qualify for NT or a threatened category", distractors:["The taxon has not been evaluated","The taxon is extinct in nature","The taxon has insufficient data for assessment"], explanation:"LC follows evaluation and indicates lower extinction risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-lc"] },

  { qlId:"ENV-008-QL-006", qlName:"DD and NE", difficulty:"Medium", stem:"Insufficient information for a proper extinction-risk assessment is classified as:", correct:"Data Deficient", distractors:["Not Evaluated","Least Concern","Near Threatened"], explanation:"DD means the available data are inadequate for assessment.", sourceIds:[IUCN], sourceFactIds:["env-cp008-dd"] },
  { qlId:"ENV-008-QL-006", qlName:"DD and NE", difficulty:"Medium", stem:"A taxon not yet assessed against the IUCN criteria is classified as:", correct:"Not Evaluated", distractors:["Data Deficient","Least Concern","Vulnerable"], explanation:"NE means it has not yet been evaluated.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ne"] },
  { qlId:"ENV-008-QL-006", qlName:"DD and NE", difficulty:"Medium", stem:"Which statement about Data Deficient is correct?", correct:"It does not mean the species is at low risk", distractors:["It is another name for Least Concern","It means the species is extinct","It means no assessment has ever been attempted"], explanation:"DD means information is insufficient, not that risk is low.", sourceIds:[IUCN], sourceFactIds:["env-cp008-dd"] },
  { qlId:"ENV-008-QL-006", qlName:"DD and NE", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"NE — not yet evaluated", distractors:["DD — low extinction risk","LC — insufficient information","NT — extinct in the wild"], explanation:"NE means Not Evaluated.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ne"] },

  { qlId:"ENV-008-QL-007", qlName:"IUCN abbreviations", difficulty:"Medium", stem:"What is the correct IUCN abbreviation for Critically Endangered?", correct:"CR", distractors:["CE","CD","CT"], explanation:"The official abbreviation is CR.", sourceIds:[IUCN], sourceFactIds:["env-cp008-abbreviations","env-cp008-cr"] },
  { qlId:"ENV-008-QL-007", qlName:"IUCN abbreviations", difficulty:"Medium", stem:"The IUCN abbreviation EN stands for:", correct:"Endangered", distractors:["Extinct in Nature","Endemic","Environmentally Normal"], explanation:"EN stands for Endangered.", sourceIds:[IUCN], sourceFactIds:["env-cp008-abbreviations","env-cp008-en"] },
  { qlId:"ENV-008-QL-007", qlName:"IUCN abbreviations", difficulty:"Medium", stem:"Which IUCN category is represented by VU?", correct:"Vulnerable", distractors:["Very Uncommon","Viable Unit","Variable Unknown"], explanation:"VU stands for Vulnerable.", sourceIds:[IUCN], sourceFactIds:["env-cp008-abbreviations","env-cp008-vu"] },
  { qlId:"ENV-008-QL-007", qlName:"IUCN abbreviations", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"EW — Extinct in the Wild", distractors:["EX — Endangered","DD — Declining Danger","NE — Near Extinct"], explanation:"EW is the abbreviation for Extinct in the Wild.", sourceIds:[IUCN], sourceFactIds:["env-cp008-abbreviations","env-cp008-ew"] },

  { qlId:"ENV-008-QL-008", qlName:"In-situ conservation", difficulty:"Medium", stem:"Conserving a species in its natural surroundings is called:", correct:"In-situ conservation", distractors:["Ex-situ conservation","Captive breeding only","Cryopreservation"], explanation:"In-situ conservation protects species in natural surroundings.", sourceIds:[CBD], sourceFactIds:["env-cp008-in-situ"] },
  { qlId:"ENV-008-QL-008", qlName:"In-situ conservation", difficulty:"Medium", stem:"Which action is an example of in-situ conservation?", correct:"Protecting a wild population in its natural habitat", distractors:["Keeping seeds in a seed bank","Maintaining animals only in a zoo","Storing tissue in a gene bank"], explanation:"In-situ conservation works in the natural habitat.", sourceIds:[CBD], sourceFactIds:["env-cp008-in-situ"] },
  { qlId:"ENV-008-QL-008", qlName:"In-situ conservation", difficulty:"Medium", stem:"The main feature of in-situ conservation is that species are conserved:", correct:"Within their natural surroundings", distractors:["Only in laboratories","Only in zoos","Only as stored seeds"], explanation:"In-situ means conservation in natural surroundings.", sourceIds:[CBD], sourceFactIds:["env-cp008-in-situ"] },
  { qlId:"ENV-008-QL-008", qlName:"In-situ conservation", difficulty:"Medium", stem:"Maintaining a viable wild population in its natural habitat is an example of:", correct:"In-situ conservation", distractors:["Ex-situ conservation","Gene banking","Captive storage"], explanation:"A wild population in its natural habitat is conserved in situ.", sourceIds:[CBD], sourceFactIds:["env-cp008-in-situ"] },

  { qlId:"ENV-008-QL-009", qlName:"Ex-situ conservation", difficulty:"Medium", stem:"Conservation outside a species’ natural habitat is called:", correct:"Ex-situ conservation", distractors:["In-situ conservation","Habitat succession","Natural selection"], explanation:"Ex-situ means conservation outside the natural habitat.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ"] },
  { qlId:"ENV-008-QL-009", qlName:"Ex-situ conservation", difficulty:"Medium", stem:"Which of the following is an ex-situ conservation method?", correct:"Seed banking", distractors:["Protecting a wild population in its habitat","Restoring a natural habitat around a wild population","Maintaining natural ecological interactions in the wild"], explanation:"Seed banks conserve material outside the natural habitat.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ","env-cp008-ex-situ-examples"] },
  { qlId:"ENV-008-QL-009", qlName:"Ex-situ conservation", difficulty:"Medium", stem:"Captive breeding is classified as:", correct:"Ex-situ conservation", distractors:["In-situ conservation","Natural succession","Habitat classification"], explanation:"Captive breeding occurs outside normal natural conditions.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ-examples"] },
  { qlId:"ENV-008-QL-009", qlName:"Ex-situ conservation", difficulty:"Medium", stem:"Which facility is most directly used for ex-situ plant conservation?", correct:"Botanical garden", distractors:["Natural river basin","Wild breeding ground","Unmanaged forest habitat"], explanation:"Botanical gardens conserve plants outside natural habitats.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ-examples"] },

  { qlId:"ENV-008-QL-010", qlName:"In-situ vs ex-situ examples", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Seed bank — ex-situ conservation", distractors:["Wild population in natural habitat — ex-situ conservation","Zoo — in-situ conservation","Botanical garden — in-situ conservation"], explanation:"A seed bank is an ex-situ method.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ-examples"] },
  { qlId:"ENV-008-QL-010", qlName:"In-situ vs ex-situ examples", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Natural habitat protection — in-situ conservation", distractors:["Seed bank — in-situ conservation","Zoo — in-situ conservation","Gene bank — in-situ conservation"], explanation:"Protecting species in natural habitat is in situ.", sourceIds:[CBD], sourceFactIds:["env-cp008-in-situ"] },
  { qlId:"ENV-008-QL-010", qlName:"In-situ vs ex-situ examples", difficulty:"Medium", stem:"Which method conserves genetic material outside the natural habitat?", correct:"Gene bank", distractors:["Wild habitat protection","Natural population recovery in place","Habitat restoration around a wild population"], explanation:"Gene banks are ex-situ conservation facilities.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-ex-situ-examples"] },
  { qlId:"ENV-008-QL-010", qlName:"In-situ vs ex-situ examples", difficulty:"Medium", stem:"Which statement correctly compares in-situ and ex-situ conservation?", correct:"In-situ works in natural surroundings; ex-situ works outside them", distractors:["Both always occur only in zoos","In-situ occurs only in laboratories","Ex-situ always occurs in natural habitat"], explanation:"The key difference is whether conservation occurs in natural surroundings.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-in-situ","env-cp008-ex-situ"] },

  { qlId:"ENV-008-QL-011", qlName:"Correct / incorrect concept pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Data Deficient — low extinction risk", distractors:["Near Threatened — close to threatened","Least Concern — evaluated at lower risk","Not Evaluated — not yet assessed"], explanation:"DD means insufficient information, not low risk.", sourceIds:[IUCN], sourceFactIds:["env-cp008-dd","env-cp008-nt","env-cp008-lc","env-cp008-ne"] },
  { qlId:"ENV-008-QL-011", qlName:"Correct / incorrect concept pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"CR — extremely high extinction risk", distractors:["EN — low extinction risk","VU — no extinction risk","NT — already extinct"], explanation:"CR means extremely high extinction risk in the wild.", sourceIds:[IUCN], sourceFactIds:["env-cp008-cr"] },
  { qlId:"ENV-008-QL-011", qlName:"Correct / incorrect concept pair", difficulty:"Hard", stem:"Which pair is incorrectly matched?", correct:"Zoo — in-situ conservation", distractors:["Seed bank — ex-situ conservation","Wild habitat protection — in-situ conservation","Botanical garden — ex-situ conservation"], explanation:"A zoo is an ex-situ conservation facility.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-in-situ","env-cp008-ex-situ-examples"] },
  { qlId:"ENV-008-QL-011", qlName:"Correct / incorrect concept pair", difficulty:"Hard", stem:"Which pair is correctly matched?", correct:"EW — survives only outside the natural wild range", distractors:["EX — survives only in captivity","NE — insufficient data after assessment","DD — not yet evaluated"], explanation:"EW still survives, but not in its natural wild range.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ew","env-cp008-ex","env-cp008-dd","env-cp008-ne"] },

  { qlId:"ENV-008-QL-012", qlName:"Statements and applied classification", difficulty:"Hard", stem:"Consider the following statements:\n1. CR, EN and VU are threatened categories.\n2. NT is a threatened category.\n3. DD means available information is inadequate for assessment.\nHow many statements are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 3 are correct.", sourceIds:[IUCN], sourceFactIds:["env-cp008-threatened","env-cp008-nt","env-cp008-dd"] },
  { qlId:"ENV-008-QL-012", qlName:"Statements and applied classification", difficulty:"Hard", stem:"Consider the following statements:\n1. EW can include taxa surviving only in captivity.\n2. EX means the last individual is considered dead.\n3. EW and EX mean exactly the same thing.\nHow many statements are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ew","env-cp008-ex"] },
  { qlId:"ENV-008-QL-012", qlName:"Statements and applied classification", difficulty:"Hard", stem:"A species survives only in a captive breeding programme. Which IUCN category best fits this condition?", correct:"Extinct in the Wild", distractors:["Extinct","Least Concern","Not Evaluated"], explanation:"Survival only in captivity fits EW.", sourceIds:[IUCN], sourceFactIds:["env-cp008-ew"] },
  { qlId:"ENV-008-QL-012", qlName:"Statements and applied classification", difficulty:"Hard", stem:"Seeds of a threatened plant are stored in a seed bank while wild populations are also protected. This combines:", correct:"Ex-situ and in-situ conservation", distractors:["Only in-situ conservation","Only ex-situ conservation","Neither form of conservation"], explanation:"Seed banking is ex situ; protecting wild populations is in situ.", sourceIds:[CBD,IUCN_EX], sourceFactIds:["env-cp008-in-situ","env-cp008-ex-situ-examples","env-cp008-complement"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-008 requires four unique options");
  return options;
}

export function generateEnvCp008ReviewBatchV1(): EnvCp008ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP008-V1-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-008",
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: place(seed.correct, seed.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds: [...seed.sourceIds],
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}
