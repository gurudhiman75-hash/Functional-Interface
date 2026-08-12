import { TSD_CP004_AUTHORITIES, TSD_CP004_CHECKPOINT_ID } from "./authority";
import { generateCp004CanonicalState } from "./generation";
import { buildCp004EnglishExplanation, buildCp004OptionAudit, buildCp004Visual, cp004Difficulty, renderCp004EnglishStem } from "./presentation";
import { solveCp004 } from "./solver";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004Question } from "./types";
import { verifyCp004 } from "./verifier";

function polishEnglishStem(stem: string): string {
  return stem
    .replace(/\. Find the first meeting time\.$/u, ". After how many minutes will they meet for the first time?")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function validateQuestion(question: TsdCp004Question): string[] {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem must end with a question mark");
  if (/\bfind\b[^?]*\.$/iu.test(question.stem)) errors.push("Instruction-style stem must be a direct exam question");
  if (question.options.length !== 4) errors.push("Exactly four options are required");
  if (new Set(question.options).size !== 4) errors.push("Options must be unique");
  if (question.correctIndex < 0 || question.correctIndex > 3) errors.push("Correct index must be between 0 and 3");
  if (question.options[question.correctIndex] !== question.solution.answerText) errors.push("Correct option does not match solution answer");
  if (question.optionAudit.filter((x) => x.isCorrect).length !== 1) errors.push("Exactly one option audit must be correct");
  if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") errors.push("Correct option misconception id must be CORRECT");
  if (question.explanation.steps.length < 3) errors.push("Explanation needs at least three connected steps");
  if (!question.explanation.answer.includes(question.solution.answerText)) errors.push("Explanation answer must contain the exact answer text");
  const verifier = verifyCp004(question.state, question.solution);
  if (!verifier.valid) errors.push(...verifier.errors);
  if (question.permanentQlId !== null) errors.push("CP004 review runtime must not allocate permanent QLs before count approval");
  if (question.questionStudioDiscoverable) errors.push("Question Studio must remain disabled");
  if (question.questionBankStatus !== "NOT_STORED") errors.push("Question Bank must remain NOT_STORED");
  if (question.testEligibility !== "INELIGIBLE") errors.push("Test eligibility must remain INELIGIBLE");
  if (question.publiclyPublishable) errors.push("Public delivery must remain false");
  return errors;
}

export function generateCp004FinalEnglishQuestion(authorityId: TsdCp004AuthorityId, seed: string): TsdCp004Question {
  const authority = TSD_CP004_AUTHORITIES.find((item) => item.authorityId === authorityId);
  if (!authority) throw new Error(`Unknown CP004 authority: ${authorityId}`);
  const state = generateCp004CanonicalState(authorityId, seed);
  const solution = solveCp004(state);
  const optionAudit = buildCp004OptionAudit(state, solution, seed);
  const options = Object.freeze(optionAudit.map((x) => x.text));
  const correctIndex = optionAudit.findIndex((x) => x.isCorrect);
  const question: TsdCp004Question = Object.freeze({
    chapterId: "TSD-001",
    checkpointId: TSD_CP004_CHECKPOINT_ID,
    authorityId,
    candidateQlId: authority.candidateQlId,
    permanentQlId: null,
    language: "en",
    seed,
    difficulty: cp004Difficulty(state),
    state,
    stem: polishEnglishStem(renderCp004EnglishStem(state)),
    visual: buildCp004Visual(state),
    options,
    correctIndex,
    optionAudit,
    solution,
    explanation: buildCp004EnglishExplanation(state, solution),
    reviewStatus: "CP004_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
  const errors = validateQuestion(question);
  if (errors.length) throw new Error(`Invalid CP004 final question ${authorityId}/${seed}: ${errors.join("; ")}`);
  return question;
}

export function generateCp004FinalEnglishCorpus(seedsPerAuthority = 50): readonly TsdCp004Question[] {
  if (!Number.isInteger(seedsPerAuthority) || seedsPerAuthority < 1) throw new Error("seedsPerAuthority must be a positive integer");
  const questions: TsdCp004Question[] = [];
  for (const authority of TSD_CP004_AUTHORITIES) {
    for (let i = 0; i < seedsPerAuthority; i += 1) {
      questions.push(generateCp004FinalEnglishQuestion(authority.authorityId, `cp004-${authority.authorityId.toLowerCase()}-${String(i + 1).padStart(3, "0")}`));
    }
  }
  return Object.freeze(questions);
}

export function generateCp004FinalEnglishReviewCorpus(): readonly TsdCp004Question[] {
  const questions: TsdCp004Question[] = [];
  for (const authority of TSD_CP004_AUTHORITIES) {
    for (let variant = 0; variant < 3; variant += 1) {
      let found: TsdCp004Question | null = null;
      for (let i = variant; i < 600; i += 3) {
        const candidate = generateCp004FinalEnglishQuestion(authority.authorityId, `cp004-review-${authority.authorityId.toLowerCase()}-${i}`);
        if (candidate.state.variant === variant) {
          found = candidate;
          break;
        }
      }
      if (!found) throw new Error(`Unable to find final review variant ${variant} for ${authority.authorityId}`);
      questions.push(found);
    }
  }
  return Object.freeze(questions);
}

export function validateCp004FinalEnglishCorpus(corpus: readonly TsdCp004Question[]) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const authoritySet = new Set<TsdCp004AuthorityId>();
  const positions = [0, 0, 0, 0];
  const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
  for (const question of corpus) {
    const errors = validateQuestion(question);
    if (errors.length) throw new Error(`CP004 final corpus validation failed: ${errors.join("; ")}`);
    authoritySet.add(question.authorityId);
    stems.add(question.stem.replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/g, "#"));
    fingerprints.add(question.solution.mathematicalFingerprint);
    positions[question.correctIndex] += 1;
    difficulties[question.difficulty] += 1;
  }
  return Object.freeze({
    questions: corpus.length,
    authorities: authoritySet.size,
    uniqueStems: stems.size,
    uniqueMathFingerprints: fingerprints.size,
    answerPositions: Object.freeze(positions as [number, number, number, number]),
    difficulties: Object.freeze(difficulties),
  });
}
