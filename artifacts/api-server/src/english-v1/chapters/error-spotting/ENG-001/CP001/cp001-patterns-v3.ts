import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { DifficultyDimensions, Eng001SentenceCandidate, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import { BASE_BUNDLES, type SemanticBundle, type SemanticDomain } from "./cp001-base-bundles-v3";
import { ADDITIVE_BUNDLES, COLLECTIVE_MEMBER, COLLECTIVE_UNIT, INTERVENING_HARD, INTERVENING_MEDIUM, NUMBER_TOTAL_BUNDLES, PROXIMITY_BUNDLES } from "./cp001-rule-bundles-v3";

function dims(ruleComplexity: DifficultyDimensions["ruleComplexity"], dependencyDistance: DifficultyDimensions["dependencyDistance"], distractorSimilarity: DifficultyDimensions["distractorSimilarity"], sentenceLength: DifficultyDimensions["sentenceLength"], ruleInteraction: DifficultyDimensions["ruleInteraction"], lexicalLoad: DifficultyDimensions["lexicalLoad"]): DifficultyDimensions {
  return { ruleComplexity, dependencyDistance, distractorSimilarity, sentenceLength, ruleInteraction, lexicalLoad };
}

function buildCandidate(input: { candidateId: string; ruleId: GrammarRuleId; difficulty: EnglishDifficulty; dimensions: DifficultyDimensions; correctSegments: readonly string[]; errorSegments: readonly string[]; errorIndex: number; errorSpan: string; correction: string; subjectHead: string; distractorCue?: string; explanationApplication: string; tags: readonly string[]; }): Eng001SentenceCandidate {
  const mutationId = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId].mutationId;
  const derived = classifyEnglishDifficulty(input.dimensions);
  if (derived !== input.difficulty) throw new Error(`${input.candidateId} difficulty mismatch: requested ${input.difficulty}, derived ${derived}`);
  return { ...input, mutationId };
}

function baseBundle(seed: string): SemanticBundle { return deterministicPick(`${seed}:semantic-bundle`, BASE_BUNDLES); }
function modifierFor(bundle: SemanticBundle, seed: string): string { return deterministicPick(`${seed}:modifier:${bundle.id}`, bundle.modifiers); }
function domainTag(domain: SemanticDomain): string { return `domain:${domain}`; }

function renderBasic(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = baseBundle(seed);
  const plural = deterministicPick(`${seed}:number`, [false, true] as const);
  const subject = `The ${plural ? bundle.plural : bundle.singular}`;
  const correctVerb = plural ? bundle.pluralVerb : bundle.singularVerb;
  const wrongVerb = plural ? bundle.singularVerb : bundle.pluralVerb;
  if (difficulty === "easy") {
    return buildCandidate({ candidateId: `V3:P001:${bundle.id}:${plural ? "PL" : "SG"}:E`, ruleId: "GR-SVA-001", difficulty, dimensions: dims(1,1,1,1,1,1), correctSegments: [subject, correctVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, wrongVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: wrongVerb, correction: correctVerb, subjectHead: plural ? bundle.plural : bundle.singular, explanationApplication: `The subject “${subject}” is ${plural ? "plural" : "singular"}, so the finite verb must be “${correctVerb}”.`, tags: ["pattern:basic", domainTag(bundle.domain)] });
  }
  const modifier = modifierFor(bundle, seed);
  return buildCandidate({ candidateId: `V3:P001:${bundle.id}:${plural ? "PL" : "SG"}:${modifier}:M`, ruleId: "GR-SVA-001", difficulty, dimensions: dims(1,3,3,2,1,1), correctSegments: [subject, modifier, correctVerb, `${bundle.segment3} ${bundle.segment4}`], errorSegments: [subject, modifier, wrongVerb, `${bundle.segment3} ${bundle.segment4}`], errorIndex: 2, errorSpan: wrongVerb, correction: correctVerb, subjectHead: plural ? bundle.plural : bundle.singular, distractorCue: "intervening modifier", explanationApplication: `The modifier “${modifier}” does not change the number of the subject “${subject}”.`, tags: ["pattern:basic", "dependency:modifier", domainTag(bundle.domain)] });
}

function renderEachEvery(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = baseBundle(seed);
  const each = deterministicPick(`${seed}:form`, [true, false] as const);
  const subject = each ? `Each of the ${bundle.plural}` : `Every ${bundle.singular}`;
  const modifier = modifierFor(bundle, seed);
  const explanation = each ? `“Each” is the singular head; the plural noun “${bundle.plural}” does not control the verb.` : `The phrase “Every ${bundle.singular}” is singular and therefore takes “${bundle.singularVerb}”.`;
  if (difficulty === "easy") {
    return buildCandidate({ candidateId: `V3:P002:${bundle.id}:${each ? "each" : "every"}:E`, ruleId: "GR-SVA-002", difficulty, dimensions: dims(2,1,2,1,1,1), correctSegments: [subject, bundle.singularVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, bundle.pluralVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: each ? "Each" : subject, distractorCue: each ? bundle.plural : undefined, explanationApplication: explanation, tags: [`pattern:${each ? "each-of" : "every"}`, domainTag(bundle.domain)] });
  }
  return buildCandidate({ candidateId: `V3:P002:${bundle.id}:${each ? "each" : "every"}:${modifier}:M`, ruleId: "GR-SVA-002", difficulty, dimensions: dims(2,3,3,2,1,1), correctSegments: [subject, modifier, bundle.singularVerb, `${bundle.segment3} ${bundle.segment4}`], errorSegments: [subject, modifier, bundle.pluralVerb, `${bundle.segment3} ${bundle.segment4}`], errorIndex: 2, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: each ? "Each" : subject, distractorCue: each ? bundle.plural : "modifier noun", explanationApplication: `${explanation} The intervening phrase “${modifier}” does not alter that agreement.`, tags: [`pattern:${each ? "each-of" : "every"}`, "dependency:modifier", domainTag(bundle.domain)] });
}

function renderOneOf(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = baseBundle(seed);
  const subject = `One of the ${bundle.plural}`;
  if (difficulty === "easy") {
    return buildCandidate({ candidateId: `V3:P003:${bundle.id}:E`, ruleId: "GR-SVA-003", difficulty, dimensions: dims(2,2,2,1,1,1), correctSegments: [subject, bundle.singularVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, bundle.pluralVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: "One", distractorCue: bundle.plural, explanationApplication: `The head subject is “One”, not “${bundle.plural}”, so “${bundle.singularVerb}” is required.`, tags: ["pattern:one-of", domainTag(bundle.domain)] });
  }
  const modifier = modifierFor(bundle, seed);
  return buildCandidate({ candidateId: `V3:P003:${bundle.id}:${modifier}:M`, ruleId: "GR-SVA-003", difficulty, dimensions: dims(2,3,3,2,1,1), correctSegments: [subject, modifier, bundle.singularVerb, `${bundle.segment3} ${bundle.segment4}`], errorSegments: [subject, modifier, bundle.pluralVerb, `${bundle.segment3} ${bundle.segment4}`], errorIndex: 2, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: "One", distractorCue: `${bundle.plural} / modifier noun`, explanationApplication: `The singular head “One” controls agreement even though the plural noun “${bundle.plural}” and a modifier appear before the verb.`, tags: ["pattern:one-of", "dependency:modifier", domainTag(bundle.domain)] });
}

function renderNumberPhrase(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty === "medium") {
    const bundle = baseBundle(seed);
    const subject = `A number of ${bundle.plural}`;
    return buildCandidate({ candidateId: `V3:P004:a-number:${bundle.id}:M`, ruleId: "GR-SVA-004", difficulty, dimensions: dims(3,2,3,2,1,1), correctSegments: [subject, bundle.pluralVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, bundle.singularVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.singularVerb, correction: bundle.pluralVerb, subjectHead: subject, explanationApplication: `“A number of ${bundle.plural}” means several ${bundle.plural} and takes plural agreement.`, tags: ["pattern:a-number-of", domainTag(bundle.domain)] });
  }
  const bundle = deterministicPick(`${seed}:number-total`, NUMBER_TOTAL_BUNDLES);
  return buildCandidate({ candidateId: `V3:P004:the-number:${bundle.id}:H`, ruleId: "GR-SVA-004", difficulty, dimensions: dims(3,4,4,3,1,1), correctSegments: [bundle.subject, bundle.modifier, bundle.singularVerb, bundle.tail], errorSegments: [bundle.subject, bundle.modifier, bundle.pluralVerb, bundle.tail], errorIndex: 2, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: "The number", distractorCue: bundle.distractorCue, explanationApplication: `“${bundle.subject}” refers to one total, so the singular verb “${bundle.singularVerb}” is required.`, tags: ["pattern:the-number-of", "dependency:long", domainTag(bundle.domain)] });
}

function renderAdditive(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = deterministicPick(`${seed}:additive`, ADDITIVE_BUNDLES.filter((entry) => entry.difficulty === difficulty));
  return buildCandidate({ candidateId: `V3:P005:${bundle.id}:${difficulty}`, ruleId: "GR-SVA-005", difficulty, dimensions: difficulty === "hard" ? dims(3,4,4,3,1,1) : dims(3,3,3,2,1,1), correctSegments: [`${bundle.subject},`, `${bundle.additive},`, bundle.correctVerb, bundle.tail], errorSegments: [`${bundle.subject},`, `${bundle.additive},`, bundle.wrongVerb, bundle.tail], errorIndex: 2, errorSpan: bundle.wrongVerb, correction: bundle.correctVerb, subjectHead: bundle.subjectHead, distractorCue: bundle.distractorCue, explanationApplication: `The additive phrase “${bundle.additive}” does not form a compound subject; agreement remains with “${bundle.subjectHead}”.`, tags: ["pattern:additive-phrase", difficulty === "hard" ? "dependency:long" : "dependency:medium", domainTag(bundle.domain)] });
}

function renderProximity(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = deterministicPick(`${seed}:proximity`, PROXIMITY_BUNDLES.filter((entry) => entry.difficulty === difficulty));
  const dimensions = difficulty === "hard" ? dims(4,4,4,3,1,1) : dims(4,2,4,2,1,1);
  const correctSegments = bundle.modifier ? [bundle.subject, bundle.modifier, bundle.correctVerb, bundle.tail] : [bundle.subject, bundle.correctVerb, "", bundle.tail];
  const errorSegments = bundle.modifier ? [bundle.subject, bundle.modifier, bundle.wrongVerb, bundle.tail] : [bundle.subject, bundle.wrongVerb, "", bundle.tail];
  if (!bundle.modifier) {
    correctSegments[2] = bundle.tail.split(" ").slice(0,3).join(" "); correctSegments[3] = bundle.tail.split(" ").slice(3).join(" "); errorSegments[2] = correctSegments[2]; errorSegments[3] = correctSegments[3];
  }
  const errorIndex = bundle.modifier ? 2 : 1;
  return buildCandidate({ candidateId: `V3:P006:${bundle.id}:${difficulty}`, ruleId: "GR-SVA-006", difficulty, dimensions, correctSegments, errorSegments, errorIndex, errorSpan: bundle.wrongVerb, correction: bundle.correctVerb, subjectHead: bundle.nearerSubject, distractorCue: bundle.distractorCue, explanationApplication: `The nearer subject is “${bundle.nearerSubject}”, which is ${bundle.nearerNumber}; therefore “${bundle.correctVerb}” is required.`, tags: ["pattern:proximity", bundle.modifier ? "dependency:modifier" : "dependency:direct", domainTag(bundle.domain)] });
}

function renderCollective(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = deterministicPick(`${seed}:collective`, difficulty === "hard" ? COLLECTIVE_MEMBER : COLLECTIVE_UNIT);
  return buildCandidate({ candidateId: `V3:P007:${bundle.id}:${difficulty}`, ruleId: "GR-SVA-007", difficulty, dimensions: difficulty === "hard" ? dims(4,3,4,3,2,1) : dims(3,2,3,2,1,1), correctSegments: [bundle.subject, bundle.correctVerb, bundle.segment3, bundle.segment4], errorSegments: [bundle.subject, bundle.wrongVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.wrongVerb, correction: bundle.correctVerb, subjectHead: bundle.subjectHead, distractorCue: bundle.mode, explanationApplication: bundle.mode === "unit" ? `The context presents “${bundle.subjectHead}” as one unit, so singular agreement “${bundle.correctVerb}” is required.` : `The words “${bundle.segment3}” present the members separately, so plural agreement “${bundle.correctVerb}” is required in the target exam convention.`, tags: [`pattern:collective-${bundle.mode}`, "ambiguity:context-guarded", domainTag(bundle.domain)] });
}

function renderMoreThanOne(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = baseBundle(seed); const subject = `More than one ${bundle.singular}`;
  if (difficulty === "medium") return buildCandidate({ candidateId: `V3:P008:${bundle.id}:M`, ruleId: "GR-SVA-008", difficulty, dimensions: dims(4,2,4,2,1,1), correctSegments: [subject, bundle.singularVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, bundle.pluralVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: subject, explanationApplication: `The construction “more than one + singular noun” takes singular agreement, so “${bundle.singularVerb}” is required.`, tags: ["pattern:more-than-one", domainTag(bundle.domain)] });
  const modifier = modifierFor(bundle, seed);
  return buildCandidate({ candidateId: `V3:P008:${bundle.id}:${modifier}:H`, ruleId: "GR-SVA-008", difficulty, dimensions: dims(4,4,4,3,1,1), correctSegments: [subject, modifier, bundle.singularVerb, `${bundle.segment3} ${bundle.segment4}`], errorSegments: [subject, modifier, bundle.pluralVerb, `${bundle.segment3} ${bundle.segment4}`], errorIndex: 2, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: subject, distractorCue: modifier, explanationApplication: `The intervening phrase “${modifier}” does not change the singular agreement required by “${subject}”.`, tags: ["pattern:more-than-one", "dependency:modifier", domainTag(bundle.domain)] });
}

function renderManyA(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = baseBundle(seed); const article = /^[aeiou]/i.test(bundle.singular) ? "an" : "a"; const subject = `Many ${article} ${bundle.singular}`;
  if (difficulty === "medium") return buildCandidate({ candidateId: `V3:P009:${bundle.id}:M`, ruleId: "GR-SVA-009", difficulty, dimensions: dims(4,2,4,2,1,1), correctSegments: [subject, bundle.singularVerb, bundle.segment3, bundle.segment4], errorSegments: [subject, bundle.pluralVerb, bundle.segment3, bundle.segment4], errorIndex: 1, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: subject, explanationApplication: `The construction “many ${article} + singular noun” takes singular agreement.`, tags: ["pattern:many-a", domainTag(bundle.domain)] });
  const modifier = modifierFor(bundle, seed);
  return buildCandidate({ candidateId: `V3:P009:${bundle.id}:${modifier}:H`, ruleId: "GR-SVA-009", difficulty, dimensions: dims(4,4,4,3,1,1), correctSegments: [subject, modifier, bundle.singularVerb, `${bundle.segment3} ${bundle.segment4}`], errorSegments: [subject, modifier, bundle.pluralVerb, `${bundle.segment3} ${bundle.segment4}`], errorIndex: 2, errorSpan: bundle.pluralVerb, correction: bundle.singularVerb, subjectHead: subject, distractorCue: modifier, explanationApplication: `“${subject}” still takes singular agreement; the intervening phrase “${modifier}” does not change that.`, tags: ["pattern:many-a", "dependency:modifier", domainTag(bundle.domain)] });
}

function renderIntervening(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = deterministicPick(`${seed}:intervening`, difficulty === "hard" ? INTERVENING_HARD : INTERVENING_MEDIUM);
  return buildCandidate({ candidateId: `V3:P010:${bundle.id}:${difficulty}`, ruleId: "GR-SVA-010", difficulty, dimensions: difficulty === "hard" ? dims(3,5,5,4,1,1) : dims(2,3,4,2,1,1), correctSegments: [bundle.subject, bundle.modifier, bundle.correctVerb, bundle.tail], errorSegments: [bundle.subject, bundle.modifier, bundle.wrongVerb, bundle.tail], errorIndex: 2, errorSpan: bundle.wrongVerb, correction: bundle.correctVerb, subjectHead: bundle.subjectHead, distractorCue: bundle.distractorCue, explanationApplication: `The true subject head is “${bundle.subjectHead}”. The nearby plural noun(s) “${bundle.distractorCue}” are inside intervening phrases and do not control the verb.`, tags: ["pattern:intervening-phrase", difficulty === "hard" ? "dependency:multiple-distractors" : "dependency:single-distractor", domainTag(bundle.domain)] });
}

const RENDERERS: Record<GrammarRuleId, (difficulty: EnglishDifficulty, seed: string) => Eng001SentenceCandidate> = { "GR-SVA-001": renderBasic, "GR-SVA-002": renderEachEvery, "GR-SVA-003": renderOneOf, "GR-SVA-004": renderNumberPhrase, "GR-SVA-005": renderAdditive, "GR-SVA-006": renderProximity, "GR-SVA-007": renderCollective, "GR-SVA-008": renderMoreThanOne, "GR-SVA-009": renderManyA, "GR-SVA-010": renderIntervening };

export const ENG001_CP001_V3_NO_ERROR_RULE_IDS: readonly GrammarRuleId[] = ["GR-SVA-002","GR-SVA-003","GR-SVA-004","GR-SVA-005","GR-SVA-006","GR-SVA-007","GR-SVA-008","GR-SVA-009","GR-SVA-010"] as const;
export function rulesForDifficultyV3(difficulty: EnglishDifficulty): readonly GrammarRuleId[] { return Object.values(SUBJECT_VERB_AGREEMENT_RULE_BY_ID).filter((rule) => rule.allowedDifficulties.includes(difficulty)).map((rule) => rule.ruleId); }
export function buildEng001Cp001CandidateV3(input: { ruleId: GrammarRuleId; difficulty: EnglishDifficulty; seed: string; }): Eng001SentenceCandidate { const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId]; if (!rule.allowedDifficulties.includes(input.difficulty)) throw new Error(`${input.ruleId} does not support ${input.difficulty} in CP001 V3`); return RENDERERS[input.ruleId](input.difficulty, input.seed); }
export function semanticDomainOf(candidate: Eng001SentenceCandidate): string | null { return candidate.tags.find((tag) => tag.startsWith("domain:"))?.slice("domain:".length) ?? null; }
