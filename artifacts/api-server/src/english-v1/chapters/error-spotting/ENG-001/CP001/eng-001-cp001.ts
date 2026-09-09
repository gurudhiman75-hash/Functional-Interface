import { deterministicIndex, deterministicPick } from "../../../../core/deterministic";
import type {
  DifficultyDimensions,
  Eng001QlId,
  Eng001Question,
  Eng001SentenceCandidate,
  EnglishDifficulty,
  GrammarRuleId,
} from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";

const dims = (
  ruleComplexity: DifficultyDimensions["ruleComplexity"],
  dependencyDistance: DifficultyDimensions["dependencyDistance"],
  distractorSimilarity: DifficultyDimensions["distractorSimilarity"],
  sentenceLength: DifficultyDimensions["sentenceLength"],
  ruleInteraction: DifficultyDimensions["ruleInteraction"],
  lexicalLoad: DifficultyDimensions["lexicalLoad"],
): DifficultyDimensions => ({ ruleComplexity, dependencyDistance, distractorSimilarity, sentenceLength, ruleInteraction, lexicalLoad });

const c = (candidate: Eng001SentenceCandidate): Eng001SentenceCandidate => candidate;

export const ENG001_CP001_CANDIDATES: readonly Eng001SentenceCandidate[] = [
  c({ candidateId: "SVA001-E-01", ruleId: "GR-SVA-001", mutationId: "MUT-SVA-NUMBER-001", difficulty: "easy", dimensions: dims(1,1,1,1,1,1), correctSegments: ["My younger brother", "is attending", "a short computer course", "this month."], errorSegments: ["My younger brother", "are attending", "a short computer course", "this month."], errorIndex: 1, errorSpan: "are attending", correction: "is attending", subjectHead: "brother", explanationApplication: "The subject 'My younger brother' is singular, so it requires the singular verb form 'is attending'.", tags: ["basic", "singular-subject"] }),
  c({ candidateId: "SVA001-E-02", ruleId: "GR-SVA-001", mutationId: "MUT-SVA-NUMBER-001", difficulty: "easy", dimensions: dims(1,1,1,1,1,1), correctSegments: ["The new machines", "operate", "without interruption", "during the night shift."], errorSegments: ["The new machines", "operates", "without interruption", "during the night shift."], errorIndex: 1, errorSpan: "operates", correction: "operate", subjectHead: "machines", explanationApplication: "The subject 'machines' is plural, so the present-tense verb must be 'operate', not 'operates'.", tags: ["basic", "plural-subject"] }),
  c({ candidateId: "SVA001-M-01", ruleId: "GR-SVA-001", mutationId: "MUT-SVA-NUMBER-001", difficulty: "medium", dimensions: dims(1,2,2,2,1,1), correctSegments: ["The revised schedule", "for the evening buses", "shows", "two additional departures."], errorSegments: ["The revised schedule", "for the evening buses", "show", "two additional departures."], errorIndex: 2, errorSpan: "show", correction: "shows", subjectHead: "schedule", distractorCue: "buses", explanationApplication: "The head subject is 'schedule', not the plural noun 'buses' inside the following phrase; therefore 'shows' is required.", tags: ["basic", "intervening-noun"] }),
  c({ candidateId: "SVA002-E-01", ruleId: "GR-SVA-002", mutationId: "MUT-SVA-EACH-EVERY-001", difficulty: "easy", dimensions: dims(2,1,2,1,1,1), correctSegments: ["Each of the applicants", "has received", "a confirmation message", "from the office."], errorSegments: ["Each of the applicants", "have received", "a confirmation message", "from the office."], errorIndex: 1, errorSpan: "have received", correction: "has received", subjectHead: "Each", distractorCue: "applicants", explanationApplication: "'Each' is the grammatical head and is singular. The plural noun 'applicants' appears inside the 'of' phrase and does not make the subject plural.", tags: ["each-of", "proximity-trap"] }),
  c({ candidateId: "SVA002-E-02", ruleId: "GR-SVA-002", mutationId: "MUT-SVA-EACH-EVERY-001", difficulty: "easy", dimensions: dims(2,1,1,1,1,1), correctSegments: ["Every participant", "needs", "a valid identity card", "at the entrance."], errorSegments: ["Every participant", "need", "a valid identity card", "at the entrance."], errorIndex: 1, errorSpan: "need", correction: "needs", subjectHead: "Every participant", explanationApplication: "A noun phrase introduced by 'every' is treated as singular, so the verb must be 'needs'.", tags: ["every", "singular-determiner"] }),
  c({ candidateId: "SVA002-M-01", ruleId: "GR-SVA-002", mutationId: "MUT-SVA-EACH-EVERY-001", difficulty: "medium", dimensions: dims(2,3,3,2,1,1), correctSegments: ["Each of the files", "stored in these folders", "contains", "a signed copy of the order."], errorSegments: ["Each of the files", "stored in these folders", "contain", "a signed copy of the order."], errorIndex: 2, errorSpan: "contain", correction: "contains", subjectHead: "Each", distractorCue: "files / folders", explanationApplication: "Despite the nearby plural nouns 'files' and 'folders', the head subject is the singular word 'Each', so 'contains' is required.", tags: ["each-of", "long-dependency"] }),
  c({ candidateId: "SVA003-E-01", ruleId: "GR-SVA-003", mutationId: "MUT-SVA-ONE-OF-001", difficulty: "easy", dimensions: dims(2,2,2,1,1,1), correctSegments: ["One of the students", "has volunteered", "to organise the books", "after class."], errorSegments: ["One of the students", "have volunteered", "to organise the books", "after class."], errorIndex: 1, errorSpan: "have volunteered", correction: "has volunteered", subjectHead: "One", distractorCue: "students", explanationApplication: "In 'one of the students', the head subject is 'one', which is singular; therefore 'has volunteered' is correct.", tags: ["one-of"] }),
  c({ candidateId: "SVA003-M-01", ruleId: "GR-SVA-003", mutationId: "MUT-SVA-ONE-OF-001", difficulty: "medium", dimensions: dims(2,3,3,2,1,1), correctSegments: ["One of the proposals", "submitted by the regional offices", "appears", "to meet every requirement."], errorSegments: ["One of the proposals", "submitted by the regional offices", "appear", "to meet every requirement."], errorIndex: 2, errorSpan: "appear", correction: "appears", subjectHead: "One", distractorCue: "proposals / offices", explanationApplication: "The subject head is the singular word 'One'. The plural nouns in the following phrases do not control the verb, so 'appears' is required.", tags: ["one-of", "long-dependency"] }),
  c({ candidateId: "SVA004-M-01", ruleId: "GR-SVA-004", mutationId: "MUT-SVA-NUMBER-PHRASE-001", difficulty: "medium", dimensions: dims(3,2,3,2,1,1), correctSegments: ["A number of employees", "have requested", "a change in the reporting time", "for next week."], errorSegments: ["A number of employees", "has requested", "a change in the reporting time", "for next week."], errorIndex: 1, errorSpan: "has requested", correction: "have requested", subjectHead: "A number of employees", explanationApplication: "The expression 'a number of + plural noun' means several employees and takes a plural verb, so 'have requested' is required.", tags: ["a-number-of"] }),
  c({ candidateId: "SVA004-H-01", ruleId: "GR-SVA-004", mutationId: "MUT-SVA-NUMBER-PHRASE-001", difficulty: "hard", dimensions: dims(3,3,4,3,1,1), correctSegments: ["The number of complaints", "received during the first week", "has fallen", "since the new system was introduced."], errorSegments: ["The number of complaints", "received during the first week", "have fallen", "since the new system was introduced."], errorIndex: 2, errorSpan: "have fallen", correction: "has fallen", subjectHead: "The number", distractorCue: "complaints", explanationApplication: "'The number of complaints' refers to one number or total, so the subject is singular and takes 'has fallen'.", tags: ["the-number-of", "contrast-family"] }),
  c({ candidateId: "SVA005-M-01", ruleId: "GR-SVA-005", mutationId: "MUT-SVA-ADDITIVE-PHRASE-001", difficulty: "medium", dimensions: dims(3,3,3,2,1,1), correctSegments: ["The manager", "along with two assistants", "is reviewing", "the final list."], errorSegments: ["The manager", "along with two assistants", "are reviewing", "the final list."], errorIndex: 2, errorSpan: "are reviewing", correction: "is reviewing", subjectHead: "manager", distractorCue: "assistants", explanationApplication: "'Along with two assistants' is additional information. The main subject is the singular noun 'manager', so the verb must be 'is reviewing'.", tags: ["along-with"] }),
  c({ candidateId: "SVA005-H-01", ruleId: "GR-SVA-005", mutationId: "MUT-SVA-ADDITIVE-PHRASE-001", difficulty: "hard", dimensions: dims(3,4,4,3,1,1), correctSegments: ["The maintenance schedule", "as well as the revised safety instructions", "was circulated", "to all section heads yesterday."], errorSegments: ["The maintenance schedule", "as well as the revised safety instructions", "were circulated", "to all section heads yesterday."], errorIndex: 2, errorSpan: "were circulated", correction: "was circulated", subjectHead: "schedule", distractorCue: "instructions", explanationApplication: "The phrase beginning 'as well as' does not form a compound subject. Agreement is controlled by the singular head 'schedule', so 'was circulated' is correct.", tags: ["as-well-as", "long-dependency"] }),
  c({ candidateId: "SVA006-M-01", ruleId: "GR-SVA-006", mutationId: "MUT-SVA-PROXIMITY-001", difficulty: "medium", dimensions: dims(4,2,4,2,1,1), correctSegments: ["Neither the supervisors nor the clerk", "was available", "to verify the entries", "before the counter closed."], errorSegments: ["Neither the supervisors nor the clerk", "were available", "to verify the entries", "before the counter closed."], errorIndex: 1, errorSpan: "were available", correction: "was available", subjectHead: "clerk", distractorCue: "supervisors", explanationApplication: "With 'neither...nor', the target exam convention makes the verb agree with the nearer subject. Here the nearer subject is singular 'clerk', so 'was' is required.", tags: ["neither-nor", "proximity"] }),
  c({ candidateId: "SVA006-H-01", ruleId: "GR-SVA-006", mutationId: "MUT-SVA-PROXIMITY-001", difficulty: "hard", dimensions: dims(4,3,4,3,1,1), correctSegments: ["Either the branch manager or the senior accountants", "are expected", "to present the verified figures", "at tomorrow's meeting."], errorSegments: ["Either the branch manager or the senior accountants", "is expected", "to present the verified figures", "at tomorrow's meeting."], errorIndex: 1, errorSpan: "is expected", correction: "are expected", subjectHead: "senior accountants", distractorCue: "branch manager", explanationApplication: "In the 'either...or' structure, the nearer subject is the plural phrase 'senior accountants'; therefore the plural verb 'are expected' is required.", tags: ["either-or", "proximity"] }),
  c({ candidateId: "SVA007-M-01", ruleId: "GR-SVA-007", mutationId: "MUT-SVA-COLLECTIVE-001", difficulty: "medium", dimensions: dims(3,2,3,2,1,1), correctSegments: ["The committee", "has approved", "the revised timetable", "for the training programme."], errorSegments: ["The committee", "have approved", "the revised timetable", "for the training programme."], errorIndex: 1, errorSpan: "have approved", correction: "has approved", subjectHead: "committee", explanationApplication: "The committee is presented as one decision-making unit, so the singular verb 'has approved' is used.", tags: ["collective-unit"] }),
  c({ candidateId: "SVA007-H-01", ruleId: "GR-SVA-007", mutationId: "MUT-SVA-COLLECTIVE-001", difficulty: "hard", dimensions: dims(3,3,4,3,1,2), correctSegments: ["The jury", "after examining the complete record", "has reached", "a unanimous decision."], errorSegments: ["The jury", "after examining the complete record", "have reached", "a unanimous decision."], errorIndex: 2, errorSpan: "have reached", correction: "has reached", subjectHead: "jury", explanationApplication: "The words 'a unanimous decision' make the unit reading explicit: the jury acts as one body, so the singular verb 'has reached' is required.", tags: ["collective-unit", "ambiguity-guarded"] }),
  c({ candidateId: "SVA008-M-01", ruleId: "GR-SVA-008", mutationId: "MUT-SVA-MORE-THAN-ONE-001", difficulty: "medium", dimensions: dims(4,2,4,2,1,1), correctSegments: ["More than one candidate", "has asked", "for additional time", "to submit the document."], errorSegments: ["More than one candidate", "have asked", "for additional time", "to submit the document."], errorIndex: 1, errorSpan: "have asked", correction: "has asked", subjectHead: "More than one candidate", explanationApplication: "The fixed construction 'more than one + singular noun' takes a singular verb, so 'has asked' is required.", tags: ["more-than-one"] }),
  c({ candidateId: "SVA008-H-01", ruleId: "GR-SVA-008", mutationId: "MUT-SVA-MORE-THAN-ONE-001", difficulty: "hard", dimensions: dims(4,3,4,3,1,1), correctSegments: ["More than one proposal", "from the shortlisted groups", "has been examined", "by the review panel."], errorSegments: ["More than one proposal", "from the shortlisted groups", "have been examined", "by the review panel."], errorIndex: 2, errorSpan: "have been examined", correction: "has been examined", subjectHead: "More than one proposal", distractorCue: "groups", explanationApplication: "'More than one proposal' takes singular agreement. The nearby plural noun 'groups' is inside a prepositional phrase and does not change that, so 'has been examined' is correct.", tags: ["more-than-one", "intervening-noun"] }),
  c({ candidateId: "SVA009-M-01", ruleId: "GR-SVA-009", mutationId: "MUT-SVA-MANY-A-001", difficulty: "medium", dimensions: dims(4,2,4,2,1,1), correctSegments: ["Many a traveller", "has faced", "the same difficulty", "on this route."], errorSegments: ["Many a traveller", "have faced", "the same difficulty", "on this route."], errorIndex: 1, errorSpan: "have faced", correction: "has faced", subjectHead: "Many a traveller", explanationApplication: "Although 'many' suggests plurality in meaning, the construction 'many a + singular noun' takes a singular verb, so 'has faced' is correct.", tags: ["many-a"] }),
  c({ candidateId: "SVA009-H-01", ruleId: "GR-SVA-009", mutationId: "MUT-SVA-MANY-A-001", difficulty: "hard", dimensions: dims(4,3,4,3,1,2), correctSegments: ["Many a skilled worker", "in these small workshops", "has learned", "the craft through years of practice."], errorSegments: ["Many a skilled worker", "in these small workshops", "have learned", "the craft through years of practice."], errorIndex: 2, errorSpan: "have learned", correction: "has learned", subjectHead: "Many a skilled worker", distractorCue: "workshops", explanationApplication: "The subject uses 'many a + singular noun', which requires singular agreement. The plural noun 'workshops' is only part of an intervening phrase.", tags: ["many-a", "long-dependency"] }),
  c({ candidateId: "SVA010-M-01", ruleId: "GR-SVA-010", mutationId: "MUT-SVA-INTERVENING-PP-001", difficulty: "medium", dimensions: dims(2,3,4,2,1,1), correctSegments: ["The quality of the products", "sold through this outlet", "has improved", "during the past year."], errorSegments: ["The quality of the products", "sold through this outlet", "have improved", "during the past year."], errorIndex: 2, errorSpan: "have improved", correction: "has improved", subjectHead: "quality", distractorCue: "products", explanationApplication: "The subject head is the singular noun 'quality'. 'Of the products' is a prepositional phrase, so the plural noun 'products' does not control the verb.", tags: ["intervening-pp", "classic-proximity-trap"] }),
  c({ candidateId: "SVA010-H-01", ruleId: "GR-SVA-010", mutationId: "MUT-SVA-INTERVENING-PP-001", difficulty: "hard", dimensions: dims(2,5,5,4,1,1), correctSegments: ["The list of items", "required for the two field teams", "is displayed", "beside the issue counter."], errorSegments: ["The list of items", "required for the two field teams", "are displayed", "beside the issue counter."], errorIndex: 2, errorSpan: "are displayed", correction: "is displayed", subjectHead: "list", distractorCue: "items / teams", explanationApplication: "The finite verb agrees with the singular head 'list'. The plural nouns 'items' and 'teams' are embedded inside phrases between the subject head and verb.", tags: ["intervening-pp", "double-proximity-trap"] }),
] as const;

const STEMS: Record<Eng001QlId, readonly string[]> = {
  "ENG-001-QL001": ["Identify the segment that contains a grammatical error.", "Choose the segment that contains a grammatical error.", "Select the part of the sentence that contains an error."],
  "ENG-001-QL002": ["The sentence is divided into three segments. One may contain an error. Select that segment; if there is no error, choose 'No error'.", "One of the three segments may contain a grammatical error. Choose the incorrect segment, or select 'No error' if the sentence is correct."],
  "ENG-001-QL007": ["Examine the sentence and select the erroneous segment. If the sentence is grammatically correct, choose 'No error'.", "Choose the segment containing a grammatical error. If there is no error, select 'No error'."],
};

function sentenceFromSegments(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+([,.!?;:])/g, "$1");
}

function mergeFourToThree(segments: readonly string[], errorIndex: number | null, seed: string): { segments: string[]; errorIndex: number | null } {
  const mergeAt = deterministicIndex(`${seed}:merge`, 3);
  const merged: string[] = [];
  let mappedError: number | null = null;
  for (let index = 0; index < segments.length; index += 1) {
    if (index === mergeAt) {
      const next = `${segments[index]} ${segments[index + 1]}`;
      const newIndex = merged.length;
      merged.push(next);
      if (errorIndex === index || errorIndex === index + 1) mappedError = newIndex;
      index += 1;
      continue;
    }
    const newIndex = merged.length;
    merged.push(segments[index]!);
    if (errorIndex === index) mappedError = newIndex;
  }
  return { segments: merged, errorIndex: mappedError };
}

function optionLabels(count: number, includeNoError: boolean): string[] {
  const labels = Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
  return includeNoError ? [...labels, "No error"] : labels;
}

function chooseCandidate(ruleId: GrammarRuleId | undefined, difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const pool = ENG001_CP001_CANDIDATES.filter((candidate) => candidate.difficulty === difficulty && (!ruleId || candidate.ruleId === ruleId));
  if (pool.length === 0) throw new Error(`No ENG-001-CP001 candidate for rule=${ruleId ?? "any"}, difficulty=${difficulty}`);
  return deterministicPick(`${seed}:candidate`, pool);
}

export interface GenerateEng001Cp001Input {
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: GrammarRuleId;
}

export function generateEng001Cp001Question(input: GenerateEng001Cp001Input): Eng001Question {
  const qlId = input.qlId ?? deterministicPick(`${input.seed}:ql`, ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const);
  const candidate = chooseCandidate(input.ruleId, input.difficulty, input.seed);
  const isNoError = qlId === "ENG-001-QL007";
  const sourceSegments = isNoError ? candidate.correctSegments : candidate.errorSegments;
  const sourceErrorIndex = isNoError ? null : candidate.errorIndex;
  const shaped = qlId === "ENG-001-QL002" ? mergeFourToThree(sourceSegments, sourceErrorIndex, input.seed) : { segments: [...sourceSegments], errorIndex: sourceErrorIndex };
  const includeNoError = qlId !== "ENG-001-QL001";
  const options = optionLabels(shaped.segments.length, includeNoError);
  const correctOptionIndex = shaped.errorIndex ?? shaped.segments.length;
  const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[candidate.ruleId];
  const answerLabel = options[correctOptionIndex]!;
  const correctedSentence = sentenceFromSegments(candidate.correctSegments);
  const explanation = isNoError
    ? `There is no error. ${rule.principle} ${candidate.explanationApplication} Correct sentence: ${correctedSentence}`
    : `The error is in segment ${answerLabel}: "${shaped.segments[shaped.errorIndex!]!}". ${rule.principle} ${candidate.explanationApplication} Replace "${candidate.errorSpan}" with "${candidate.correction}". Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-001-CP001:${qlId}:${candidate.candidateId}:${input.seed}`,
    stem: deterministicPick(`${input.seed}:stem:${qlId}`, STEMS[qlId]),
    segments: shaped.segments,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-001",
      cpId: "ENG-001-CP001",
      qlId,
      ruleId: candidate.ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      answerSegment: answerLabel,
      hasNoError: isNoError,
      seed: input.seed,
      candidateId: candidate.candidateId,
      reviewOnly: true,
    },
  };
}
