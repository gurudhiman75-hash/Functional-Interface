import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type { DifficultyDimensions, Eng001SentenceCandidate, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";

interface NounPair { id: string; singular: string; plural: string; }
interface ActionPair { id: string; singularVerb: string; pluralVerb: string; segment3: string; segment4: string; }
interface CountItem { id: string; plural: string; modifier: string; }
interface CountPredicate { id: string; singularVerb: string; pluralVerb: string; tail: string; }
interface RolePair { id: string; singular: string; plural: string; }
interface CollectiveBundle { id: string; subject: string; correctVerb: string; wrongVerb: string; segment3: string; segment4: string; subjectHead: string; mode: "unit" | "members"; }
interface InterveningBundle { id: string; subject: string; modifier: string; correctVerb: string; wrongVerb: string; tail: string; subjectHead: string; distractorCue: string; }

const PEOPLE: readonly NounPair[] = [
  { id: "candidate", singular: "candidate", plural: "candidates" },
  { id: "applicant", singular: "applicant", plural: "applicants" },
  { id: "employee", singular: "employee", plural: "employees" },
  { id: "participant", singular: "participant", plural: "participants" },
  { id: "student", singular: "student", plural: "students" },
  { id: "trainee", singular: "trainee", plural: "trainees" },
  { id: "officer", singular: "officer", plural: "officers" },
  { id: "worker", singular: "worker", plural: "workers" },
] as const;

const PERSON_ACTIONS: readonly ActionPair[] = [
  { id: "submit-documents", singularVerb: "has submitted", pluralVerb: "have submitted", segment3: "the required documents", segment4: "before the deadline." },
  { id: "receive-message", singularVerb: "has received", pluralVerb: "have received", segment3: "a confirmation message", segment4: "from the office." },
  { id: "need-id", singularVerb: "needs", pluralVerb: "need", segment3: "a valid identity card", segment4: "at the entrance." },
  { id: "complete-form", singularVerb: "has completed", pluralVerb: "have completed", segment3: "the verification form", segment4: "without any correction." },
  { id: "attend-session", singularVerb: "is attending", pluralVerb: "are attending", segment3: "the scheduled training session", segment4: "this week." },
  { id: "verify-entries", singularVerb: "was available", pluralVerb: "were available", segment3: "to verify the entries", segment4: "before closing time." },
] as const;

const PERSON_MODIFIERS = [
  { id: "final-round", text: "selected for the final round" },
  { id: "morning-shift", text: "assigned to the morning shift" },
  { id: "training-list", text: "included in the training list" },
  { id: "verification-list", text: "listed for document verification" },
] as const;

const COUNT_ITEMS: readonly CountItem[] = [
  { id: "complaints", plural: "complaints", modifier: "received during the first week" },
  { id: "applications", plural: "applications", modifier: "received through the online portal" },
  { id: "requests", plural: "requests", modifier: "submitted by the field offices" },
  { id: "vacancies", plural: "vacancies", modifier: "reported by the departments" },
  { id: "participants", plural: "participants", modifier: "registered for the current session" },
  { id: "cases", plural: "cases", modifier: "listed for review this month" },
] as const;

const COUNT_PREDICATES: readonly CountPredicate[] = [
  { id: "increase", singularVerb: "has increased", pluralVerb: "have increased", tail: "since registration opened." },
  { id: "fall", singularVerb: "has fallen", pluralVerb: "have fallen", tail: "after the new procedure was introduced." },
  { id: "remain-high", singularVerb: "remains", pluralVerb: "remain", tail: "higher than last month's figure." },
  { id: "expected-rise", singularVerb: "is expected", pluralVerb: "are expected", tail: "to rise before the final date." },
] as const;

const ROLES: readonly RolePair[] = [
  { id: "manager", singular: "The manager", plural: "The managers" },
  { id: "supervisor", singular: "The supervisor", plural: "The supervisors" },
  { id: "coordinator", singular: "The coordinator", plural: "The coordinators" },
  { id: "officer", singular: "The officer", plural: "The officers" },
  { id: "teacher", singular: "The teacher", plural: "The teachers" },
  { id: "engineer", singular: "The engineer", plural: "The engineers" },
] as const;

const ROLE_ACTIONS: readonly ActionPair[] = [
  { id: "review-list", singularVerb: "is reviewing", pluralVerb: "are reviewing", segment3: "the final list", segment4: "before publication." },
  { id: "check-records", singularVerb: "has checked", pluralVerb: "have checked", segment3: "the supporting records", segment4: "carefully." },
  { id: "attend-briefing", singularVerb: "is attending", pluralVerb: "are attending", segment3: "the scheduled briefing", segment4: "this afternoon." },
  { id: "present-meeting", singularVerb: "was present", pluralVerb: "were present", segment3: "at the inspection meeting", segment4: "yesterday." },
  { id: "approve-schedule", singularVerb: "has approved", pluralVerb: "have approved", segment3: "the revised schedule", segment4: "for next week." },
] as const;

const ADDITIVE_PLURAL = [
  { id: "along-assistants", text: "along with two assistants" },
  { id: "together-clerks", text: "together with the senior clerks" },
  { id: "aswell-officers", text: "as well as the field officers" },
] as const;

const ADDITIVE_SINGULAR = [
  { id: "along-manager", text: "along with the manager" },
  { id: "together-coordinator", text: "together with the coordinator" },
  { id: "aswell-officer", text: "as well as the senior officer" },
] as const;

const ADDITIVE_HARD = [
  { id: "schedule-safety", subject: "The maintenance schedule", additive: "as well as the revised safety instructions", correctVerb: "was circulated", wrongVerb: "were circulated", tail: "to all section heads yesterday.", subjectHead: "schedule", distractor: "instructions" },
  { id: "report-annexures", subject: "The audit report", additive: "together with its supporting annexures", correctVerb: "has been sent", wrongVerb: "have been sent", tail: "to the review committee.", subjectHead: "report", distractor: "annexures" },
  { id: "proposal-notes", subject: "The final proposal", additive: "along with the explanatory notes", correctVerb: "is being examined", wrongVerb: "are being examined", tail: "by the legal section.", subjectHead: "proposal", distractor: "notes" },
  { id: "notice-guidelines", subject: "The official notice", additive: "as well as the revised guidelines", correctVerb: "has been uploaded", wrongVerb: "have been uploaded", tail: "to the department website.", subjectHead: "notice", distractor: "guidelines" },
] as const;

const PROX_SINGULAR = ["the branch manager", "the clerk", "the supervisor", "the coordinator"] as const;
const PROX_PLURAL = ["the senior accountants", "the field officers", "the assistants", "the trainees"] as const;
const PROX_PREDICATES: readonly ActionPair[] = [
  { id: "available", singularVerb: "was available", pluralVerb: "were available", segment3: "to verify the entries", segment4: "before the counter closed." },
  { id: "expected", singularVerb: "is expected", pluralVerb: "are expected", segment3: "to attend the briefing", segment4: "tomorrow morning." },
  { id: "responsible", singularVerb: "was responsible", pluralVerb: "were responsible", segment3: "for checking the records", segment4: "during the inspection." },
  { id: "scheduled", singularVerb: "is scheduled", pluralVerb: "are scheduled", segment3: "to present the figures", segment4: "at the next meeting." },
] as const;
const PROX_MODIFIERS = ["from the regional office", "assigned to the audit team", "listed for the morning session"] as const;

const COLLECTIVE_UNIT: readonly CollectiveBundle[] = [
  { id: "committee-approve", subject: "The committee", correctVerb: "has approved", wrongVerb: "have approved", segment3: "the revised proposal", segment4: "at its final meeting.", subjectHead: "committee", mode: "unit" },
  { id: "team-win", subject: "The team", correctVerb: "has won", wrongVerb: "have won", segment3: "the final match", segment4: "by a narrow margin.", subjectHead: "team", mode: "unit" },
  { id: "jury-unanimous", subject: "The jury", correctVerb: "has reached", wrongVerb: "have reached", segment3: "a unanimous decision", segment4: "after deliberation.", subjectHead: "jury", mode: "unit" },
  { id: "board-recommendation", subject: "The board", correctVerb: "has issued", wrongVerb: "have issued", segment3: "its final recommendation", segment4: "after the review.", subjectHead: "board", mode: "unit" },
  { id: "panel-select", subject: "The panel", correctVerb: "has selected", wrongVerb: "have selected", segment3: "the final candidates", segment4: "for the next stage.", subjectHead: "panel", mode: "unit" },
] as const;

const COLLECTIVE_MEMBER: readonly CollectiveBundle[] = [
  { id: "jury-divided", subject: "The jury", correctVerb: "were divided", wrongVerb: "was divided", segment3: "in their opinions", segment4: "over the final verdict.", subjectHead: "jury", mode: "members" },
  { id: "committee-divided", subject: "The committee", correctVerb: "were divided", wrongVerb: "was divided", segment3: "in their views", segment4: "on the revised proposal.", subjectHead: "committee", mode: "members" },
  { id: "audience-seats", subject: "The audience", correctVerb: "were taking", wrongVerb: "was taking", segment3: "their seats", segment4: "one by one before the programme began.", subjectHead: "audience", mode: "members" },
] as const;

const INTERVENING_MEDIUM: readonly InterveningBundle[] = [
  { id: "quality-products", subject: "The quality of the products", modifier: "sold through this outlet", correctVerb: "has improved", wrongVerb: "have improved", tail: "significantly this year.", subjectHead: "quality", distractorCue: "products" },
  { id: "condition-roads", subject: "The condition of the roads", modifier: "in the outer districts", correctVerb: "remains", wrongVerb: "remain", tail: "a matter of concern.", subjectHead: "condition", distractorCue: "roads" },
  { id: "accuracy-records", subject: "The accuracy of the records", modifier: "kept in these files", correctVerb: "has improved", wrongVerb: "have improved", tail: "after the latest audit.", subjectHead: "accuracy", distractorCue: "records" },
  { id: "availability-workers", subject: "The availability of trained workers", modifier: "in rural areas", correctVerb: "remains", wrongVerb: "remain", tail: "limited during peak season.", subjectHead: "availability", distractorCue: "workers" },
] as const;

const INTERVENING_HARD: readonly InterveningBundle[] = [
  { id: "list-items-teams", subject: "The list of items", modifier: "required for the two field teams", correctVerb: "is displayed", wrongVerb: "are displayed", tail: "beside the issue counter.", subjectHead: "list", distractorCue: "items / teams" },
  { id: "cost-materials-units", subject: "The cost of materials", modifier: "supplied to the three project units", correctVerb: "has increased", wrongVerb: "have increased", tail: "during the last quarter.", subjectHead: "cost", distractorCue: "materials / units" },
  { id: "performance-machines-workshops", subject: "The performance of machines", modifier: "installed in the two new workshops", correctVerb: "has improved", wrongVerb: "have improved", tail: "after the latest servicing cycle.", subjectHead: "performance", distractorCue: "machines / workshops" },
  { id: "reliability-reports-teams", subject: "The reliability of reports", modifier: "prepared by the regional teams", correctVerb: "remains", wrongVerb: "remain", tail: "under close review.", subjectHead: "reliability", distractorCue: "reports / teams" },
] as const;

function dims(
  ruleComplexity: DifficultyDimensions["ruleComplexity"],
  dependencyDistance: DifficultyDimensions["dependencyDistance"],
  distractorSimilarity: DifficultyDimensions["distractorSimilarity"],
  sentenceLength: DifficultyDimensions["sentenceLength"],
  ruleInteraction: DifficultyDimensions["ruleInteraction"],
  lexicalLoad: DifficultyDimensions["lexicalLoad"],
): DifficultyDimensions {
  return { ruleComplexity, dependencyDistance, distractorSimilarity, sentenceLength, ruleInteraction, lexicalLoad };
}

function buildCandidate(input: {
  candidateId: string;
  ruleId: GrammarRuleId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  correctSegments: readonly string[];
  errorSegments: readonly string[];
  errorIndex: number;
  errorSpan: string;
  correction: string;
  subjectHead: string;
  distractorCue?: string;
  explanationApplication: string;
  tags: readonly string[];
}): Eng001SentenceCandidate {
  const mutationId = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId].mutationId;
  const derived = classifyEnglishDifficulty(input.dimensions);
  if (derived !== input.difficulty) {
    throw new Error(`${input.candidateId} difficulty mismatch: requested ${input.difficulty}, derived ${derived}`);
  }
  return { ...input, mutationId };
}

const person = (seed: string) => deterministicPick(`${seed}:person`, PEOPLE);
const personAction = (seed: string) => deterministicPick(`${seed}:action`, PERSON_ACTIONS);

function renderBasic(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty !== "easy") throw new Error("GR-SVA-001 is easy-only in CP001 V2");
  const p = person(seed);
  const action = personAction(seed);
  const plural = deterministicPick(`${seed}:number`, [false, true] as const);
  const subject = `The ${plural ? p.plural : p.singular}`;
  const correctVerb = plural ? action.pluralVerb : action.singularVerb;
  const wrongVerb = plural ? action.singularVerb : action.pluralVerb;
  return buildCandidate({
    candidateId: `P001:${p.id}:${action.id}:${plural ? "PL" : "SG"}`,
    ruleId: "GR-SVA-001",
    difficulty,
    dimensions: dims(1, 1, 1, 1, 1, 1),
    correctSegments: [subject, correctVerb, action.segment3, action.segment4],
    errorSegments: [subject, wrongVerb, action.segment3, action.segment4],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: plural ? p.plural : p.singular,
    explanationApplication: `The subject “${subject}” is ${plural ? "plural" : "singular"}, so the finite verb must be “${correctVerb}”.`,
    tags: ["pattern:basic", "domain:general"],
  });
}

function renderEachEvery(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const p = person(seed);
  const action = personAction(seed);
  const each = deterministicPick(`${seed}:form`, [true, false] as const);
  const subject = each ? `Each of the ${p.plural}` : `Every ${p.singular}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `P002:${each ? "each" : "every"}:${p.id}:${action.id}:E`,
      ruleId: "GR-SVA-002",
      difficulty,
      dimensions: dims(2, 1, 2, 1, 1, 1),
      correctSegments: [subject, action.singularVerb, action.segment3, action.segment4],
      errorSegments: [subject, action.pluralVerb, action.segment3, action.segment4],
      errorIndex: 1,
      errorSpan: action.pluralVerb,
      correction: action.singularVerb,
      subjectHead: each ? "Each" : subject,
      distractorCue: each ? p.plural : undefined,
      explanationApplication: each
        ? `“Each” is the singular head; the plural noun “${p.plural}” is inside the of-phrase and does not control the verb.`
        : `A noun phrase introduced by “every” is singular, so “${action.singularVerb}” is required.`,
      tags: [`pattern:${each ? "each-of" : "every"}`, "domain:general"],
    });
  }
  const modifier = deterministicPick(`${seed}:modifier`, PERSON_MODIFIERS);
  return buildCandidate({
    candidateId: `P002:${each ? "each" : "every"}:${p.id}:${action.id}:${modifier.id}:M`,
    ruleId: "GR-SVA-002",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1, 1),
    correctSegments: [subject, modifier.text, action.singularVerb, `${action.segment3} ${action.segment4}`],
    errorSegments: [subject, modifier.text, action.pluralVerb, `${action.segment3} ${action.segment4}`],
    errorIndex: 2,
    errorSpan: action.pluralVerb,
    correction: action.singularVerb,
    subjectHead: each ? "Each" : subject,
    distractorCue: each ? `${p.plural} / modifier noun` : "modifier noun",
    explanationApplication: each
      ? "The head remains the singular word “Each” even though plural material appears before the verb."
      : `“Every ${p.singular}” is singular; the intervening modifier does not change the agreement.`,
    tags: [`pattern:${each ? "each-of" : "every"}`, "dependency:intervening-modifier", "domain:general"],
  });
}

function renderOneOf(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const p = person(seed);
  const action = personAction(seed);
  const subject = `One of the ${p.plural}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `P003:${p.id}:${action.id}:E`,
      ruleId: "GR-SVA-003",
      difficulty,
      dimensions: dims(2, 2, 2, 1, 1, 1),
      correctSegments: [subject, action.singularVerb, action.segment3, action.segment4],
      errorSegments: [subject, action.pluralVerb, action.segment3, action.segment4],
      errorIndex: 1,
      errorSpan: action.pluralVerb,
      correction: action.singularVerb,
      subjectHead: "One",
      distractorCue: p.plural,
      explanationApplication: `The head subject is “One”, not the plural noun “${p.plural}”, so “${action.singularVerb}” is required.`,
      tags: ["pattern:one-of", "domain:general"],
    });
  }
  const modifier = deterministicPick(`${seed}:modifier`, PERSON_MODIFIERS);
  return buildCandidate({
    candidateId: `P003:${p.id}:${action.id}:${modifier.id}:M`,
    ruleId: "GR-SVA-003",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1, 1),
    correctSegments: [subject, modifier.text, action.singularVerb, `${action.segment3} ${action.segment4}`],
    errorSegments: [subject, modifier.text, action.pluralVerb, `${action.segment3} ${action.segment4}`],
    errorIndex: 2,
    errorSpan: action.pluralVerb,
    correction: action.singularVerb,
    subjectHead: "One",
    distractorCue: `${p.plural} / modifier noun`,
    explanationApplication: "The head subject is still the singular word “One”; the plural nouns between it and the verb do not control agreement.",
    tags: ["pattern:one-of", "dependency:intervening-modifier", "domain:general"],
  });
}

function renderNumberPhrase(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty === "medium") {
    const p = person(seed);
    const action = personAction(seed);
    const subject = `A number of ${p.plural}`;
    return buildCandidate({
      candidateId: `P004:a-number:${p.id}:${action.id}:M`,
      ruleId: "GR-SVA-004",
      difficulty,
      dimensions: dims(3, 2, 3, 2, 1, 1),
      correctSegments: [subject, action.pluralVerb, action.segment3, action.segment4],
      errorSegments: [subject, action.singularVerb, action.segment3, action.segment4],
      errorIndex: 1,
      errorSpan: action.singularVerb,
      correction: action.pluralVerb,
      subjectHead: subject,
      explanationApplication: `“A number of ${p.plural}” means several ${p.plural} and therefore takes the plural verb “${action.pluralVerb}”.`,
      tags: ["pattern:a-number-of", "domain:general"],
    });
  }
  const item = deterministicPick(`${seed}:item`, COUNT_ITEMS);
  const predicate = deterministicPick(`${seed}:pred`, COUNT_PREDICATES);
  const subject = `The number of ${item.plural}`;
  return buildCandidate({
    candidateId: `P004:the-number:${item.id}:${predicate.id}:H`,
    ruleId: "GR-SVA-004",
    difficulty,
    dimensions: dims(3, 4, 4, 3, 1, 1),
    correctSegments: [subject, item.modifier, predicate.singularVerb, predicate.tail],
    errorSegments: [subject, item.modifier, predicate.pluralVerb, predicate.tail],
    errorIndex: 2,
    errorSpan: predicate.pluralVerb,
    correction: predicate.singularVerb,
    subjectHead: "The number",
    distractorCue: item.plural,
    explanationApplication: `“The number of ${item.plural}” refers to one total. The plural noun “${item.plural}” is inside the of-phrase, so the singular verb “${predicate.singularVerb}” is required.`,
    tags: ["pattern:the-number-of", "dependency:long", "domain:administration"],
  });
}

function renderAdditive(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty === "medium") {
    const role = deterministicPick(`${seed}:role`, ROLES);
    const action = deterministicPick(`${seed}:action`, ROLE_ACTIONS);
    const mainPlural = deterministicPick(`${seed}:main-number`, [false, true] as const);
    const additive = mainPlural
      ? deterministicPick(`${seed}:add`, ADDITIVE_SINGULAR)
      : deterministicPick(`${seed}:add`, ADDITIVE_PLURAL);
    const subject = mainPlural ? role.plural : role.singular;
    const correctVerb = mainPlural ? action.pluralVerb : action.singularVerb;
    const wrongVerb = mainPlural ? action.singularVerb : action.pluralVerb;
    return buildCandidate({
      candidateId: `P005:${role.id}:${action.id}:${additive.id}:${mainPlural ? "PL" : "SG"}:M`,
      ruleId: "GR-SVA-005",
      difficulty,
      dimensions: dims(3, 3, 3, 2, 1, 1),
      correctSegments: [`${subject},`, `${additive.text},`, correctVerb, `${action.segment3} ${action.segment4}`],
      errorSegments: [`${subject},`, `${additive.text},`, wrongVerb, `${action.segment3} ${action.segment4}`],
      errorIndex: 2,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: subject,
      distractorCue: additive.text,
      explanationApplication: `The phrase “${additive.text}” adds information but does not change the number of the main subject “${subject}”.`,
      tags: ["pattern:additive-phrase", "domain:workplace"],
    });
  }
  const bundle = deterministicPick(`${seed}:hard-bundle`, ADDITIVE_HARD);
  return buildCandidate({
    candidateId: `P005:${bundle.id}:H`,
    ruleId: "GR-SVA-005",
    difficulty,
    dimensions: dims(3, 4, 4, 3, 1, 1),
    correctSegments: [`${bundle.subject},`, `${bundle.additive},`, bundle.correctVerb, bundle.tail],
    errorSegments: [`${bundle.subject},`, `${bundle.additive},`, bundle.wrongVerb, bundle.tail],
    errorIndex: 2,
    errorSpan: bundle.wrongVerb,
    correction: bundle.correctVerb,
    subjectHead: bundle.subjectHead,
    distractorCue: bundle.distractor,
    explanationApplication: `The additive phrase does not form a compound subject; agreement stays with the singular head “${bundle.subjectHead}”.`,
    tags: ["pattern:additive-phrase", "dependency:long", "domain:administration"],
  });
}

function renderProximity(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const singular = deterministicPick(`${seed}:sg`, PROX_SINGULAR);
  const plural = deterministicPick(`${seed}:pl`, PROX_PLURAL);
  const predicate = deterministicPick(`${seed}:pred`, PROX_PREDICATES);
  const nearPlural = deterministicPick(`${seed}:near`, [false, true] as const);
  const subject = nearPlural ? `Either ${singular} or ${plural}` : `Neither ${plural} nor ${singular}`;
  const correctVerb = nearPlural ? predicate.pluralVerb : predicate.singularVerb;
  const wrongVerb = nearPlural ? predicate.singularVerb : predicate.pluralVerb;
  const near = nearPlural ? plural : singular;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `P006:${nearPlural ? "either" : "neither"}:${predicate.id}:${singular}:${plural}:M`,
      ruleId: "GR-SVA-006",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, correctVerb, predicate.segment3, predicate.segment4],
      errorSegments: [subject, wrongVerb, predicate.segment3, predicate.segment4],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: near,
      distractorCue: nearPlural ? singular : plural,
      explanationApplication: `The nearer subject is “${near}”, which is ${nearPlural ? "plural" : "singular"}; therefore “${correctVerb}” is required.`,
      tags: [`pattern:${nearPlural ? "either-or" : "neither-nor"}`, "agreement:proximity", "domain:workplace"],
    });
  }
  const modifier = deterministicPick(`${seed}:modifier`, PROX_MODIFIERS);
  return buildCandidate({
    candidateId: `P006:${nearPlural ? "either" : "neither"}:${predicate.id}:${modifier}:${near}:H`,
    ruleId: "GR-SVA-006",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, correctVerb, `${predicate.segment3} ${predicate.segment4}`],
    errorSegments: [subject, modifier, wrongVerb, `${predicate.segment3} ${predicate.segment4}`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: near,
    distractorCue: nearPlural ? singular : plural,
    explanationApplication: `Even with the intervening phrase “${modifier}”, the nearer subject remains “${near}”, so the verb must be “${correctVerb}”.`,
    tags: [`pattern:${nearPlural ? "either-or" : "neither-nor"}`, "agreement:proximity", "dependency:intervening-modifier", "domain:workplace"],
  });
}

function renderCollective(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const pool = difficulty === "hard" ? COLLECTIVE_MEMBER : COLLECTIVE_UNIT;
  const bundle = deterministicPick(`${seed}:collective`, pool);
  const dimensions = difficulty === "hard" ? dims(4, 3, 4, 3, 2, 1) : dims(3, 2, 3, 2, 1, 1);
  const explanationApplication = bundle.mode === "unit"
    ? `The context presents “${bundle.subjectHead}” as one unit, so the singular agreement “${bundle.correctVerb}” is required.`
    : `The context presents the members separately (“${bundle.segment3}”), so plural agreement “${bundle.correctVerb}” is required in the target exam convention.`;
  return buildCandidate({
    candidateId: `P007:${bundle.id}:${difficulty}`,
    ruleId: "GR-SVA-007",
    difficulty,
    dimensions,
    correctSegments: [bundle.subject, bundle.correctVerb, bundle.segment3, bundle.segment4],
    errorSegments: [bundle.subject, bundle.wrongVerb, bundle.segment3, bundle.segment4],
    errorIndex: 1,
    errorSpan: bundle.wrongVerb,
    correction: bundle.correctVerb,
    subjectHead: bundle.subjectHead,
    distractorCue: bundle.mode,
    explanationApplication,
    tags: [`pattern:collective-${bundle.mode}`, "ambiguity:context-guarded", "domain:general"],
  });
}

function renderMoreThanOne(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const p = person(seed);
  const action = personAction(seed);
  const subject = `More than one ${p.singular}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `P008:${p.id}:${action.id}:M`,
      ruleId: "GR-SVA-008",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, action.singularVerb, action.segment3, action.segment4],
      errorSegments: [subject, action.pluralVerb, action.segment3, action.segment4],
      errorIndex: 1,
      errorSpan: action.pluralVerb,
      correction: action.singularVerb,
      subjectHead: subject,
      explanationApplication: `The construction “more than one + singular noun” takes singular agreement, so “${action.singularVerb}” is required.`,
      tags: ["pattern:more-than-one", "domain:general"],
    });
  }
  const modifier = deterministicPick(`${seed}:modifier`, ["from the shortlisted group", "in the current batch", "on the final list"] as const);
  return buildCandidate({
    candidateId: `P008:${p.id}:${action.id}:${modifier}:H`,
    ruleId: "GR-SVA-008",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, action.singularVerb, `${action.segment3} ${action.segment4}`],
    errorSegments: [subject, modifier, action.pluralVerb, `${action.segment3} ${action.segment4}`],
    errorIndex: 2,
    errorSpan: action.pluralVerb,
    correction: action.singularVerb,
    subjectHead: subject,
    distractorCue: modifier,
    explanationApplication: `The intervening phrase does not change the fixed singular agreement of “more than one ${p.singular}”.`,
    tags: ["pattern:more-than-one", "dependency:intervening-modifier", "domain:general"],
  });
}

function renderManyA(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const p = person(seed);
  const action = personAction(seed);
  const article = /^[aeiou]/i.test(p.singular) ? "an" : "a";
  const subject = `Many ${article} ${p.singular}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `P009:${p.id}:${action.id}:M`,
      ruleId: "GR-SVA-009",
      difficulty,
      dimensions: dims(4, 2, 4, 2, 1, 1),
      correctSegments: [subject, action.singularVerb, action.segment3, action.segment4],
      errorSegments: [subject, action.pluralVerb, action.segment3, action.segment4],
      errorIndex: 1,
      errorSpan: action.pluralVerb,
      correction: action.singularVerb,
      subjectHead: subject,
      explanationApplication: "Although “many” suggests plurality in meaning, the construction “many a/an + singular noun” takes a singular verb.",
      tags: ["pattern:many-a", "domain:general"],
    });
  }
  const modifier = deterministicPick(`${seed}:modifier`, ["in the current batch", "from these small units", "on the approved list"] as const);
  return buildCandidate({
    candidateId: `P009:${p.id}:${action.id}:${modifier}:H`,
    ruleId: "GR-SVA-009",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1, 1),
    correctSegments: [subject, modifier, action.singularVerb, `${action.segment3} ${action.segment4}`],
    errorSegments: [subject, modifier, action.pluralVerb, `${action.segment3} ${action.segment4}`],
    errorIndex: 2,
    errorSpan: action.pluralVerb,
    correction: action.singularVerb,
    subjectHead: subject,
    distractorCue: modifier,
    explanationApplication: `“Many ${article} ${p.singular}” still takes singular agreement; the intervening phrase does not change that.`,
    tags: ["pattern:many-a", "dependency:intervening-modifier", "domain:general"],
  });
}

function renderIntervening(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const bundle = deterministicPick(`${seed}:intervening`, difficulty === "hard" ? INTERVENING_HARD : INTERVENING_MEDIUM);
  const dimensions = difficulty === "hard" ? dims(3, 5, 5, 4, 1, 1) : dims(2, 3, 4, 2, 1, 1);
  return buildCandidate({
    candidateId: `P010:${bundle.id}:${difficulty}`,
    ruleId: "GR-SVA-010",
    difficulty,
    dimensions,
    correctSegments: [bundle.subject, bundle.modifier, bundle.correctVerb, bundle.tail],
    errorSegments: [bundle.subject, bundle.modifier, bundle.wrongVerb, bundle.tail],
    errorIndex: 2,
    errorSpan: bundle.wrongVerb,
    correction: bundle.correctVerb,
    subjectHead: bundle.subjectHead,
    distractorCue: bundle.distractorCue,
    explanationApplication: `The true subject head is the singular noun “${bundle.subjectHead}”. The nearby plural noun(s) “${bundle.distractorCue}” are embedded inside intervening phrases and do not control the verb.`,
    tags: ["pattern:intervening-phrase", difficulty === "hard" ? "dependency:double-distractor" : "dependency:single-distractor", "domain:general"],
  });
}

const RENDERERS: Record<GrammarRuleId, (difficulty: EnglishDifficulty, seed: string) => Eng001SentenceCandidate> = {
  "GR-SVA-001": renderBasic,
  "GR-SVA-002": renderEachEvery,
  "GR-SVA-003": renderOneOf,
  "GR-SVA-004": renderNumberPhrase,
  "GR-SVA-005": renderAdditive,
  "GR-SVA-006": renderProximity,
  "GR-SVA-007": renderCollective,
  "GR-SVA-008": renderMoreThanOne,
  "GR-SVA-009": renderManyA,
  "GR-SVA-010": renderIntervening,
};

export const ENG001_CP001_NO_ERROR_RULE_IDS: readonly GrammarRuleId[] = [
  "GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005", "GR-SVA-006",
  "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010",
] as const;

export function rulesForDifficulty(difficulty: EnglishDifficulty): readonly GrammarRuleId[] {
  return Object.values(SUBJECT_VERB_AGREEMENT_RULE_BY_ID)
    .filter((rule) => rule.allowedDifficulties.includes(difficulty))
    .map((rule) => rule.ruleId);
}

export function buildEng001Cp001CandidateV2(input: {
  ruleId: GrammarRuleId;
  difficulty: EnglishDifficulty;
  seed: string;
}): Eng001SentenceCandidate {
  const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[input.ruleId];
  if (!rule.allowedDifficulties.includes(input.difficulty)) {
    throw new Error(`${input.ruleId} does not support ${input.difficulty} in CP001 V2`);
  }
  return RENDERERS[input.ruleId](input.difficulty, input.seed);
}
