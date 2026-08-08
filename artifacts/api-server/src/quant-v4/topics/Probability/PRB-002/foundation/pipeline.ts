import { runProbabilityPackagePipeline } from "../../shared/pipeline";
import {
  buildProbabilityMockPolicy,
  remodelExamReadinessExplanation,
  remodelExamReadinessStem,
} from "../../shared/exam-readiness-remodeler";
import { renderProbabilityMathLines, renderProbabilityMathText } from "../../shared/math-text";
import type {
  GeneratedParameters,
  ProbabilityGenerationInput,
  ProbabilityQuestion,
  SolvedProbability,
} from "../../shared/types";
import { PRB_002_LIBRARIES } from "./library";

export const PRB_002_PACKAGE_ID = "PRB-002" as const;
export const PRB_002_CP_IDS = ["PRB-CP-006", "PRB-CP-007", "PRB-CP-008", "PRB-CP-009"] as const;
export type Prb002CanonicalProblemId = (typeof PRB_002_CP_IDS)[number];

export function getPrb002ActiveCanonicalProblemIds(): readonly Prb002CanonicalProblemId[] {
  return PRB_002_CP_IDS;
}

export function listPrb002QuestionEntries() {
  return PRB_002_LIBRARIES.registry.map((entry) => ({ ...entry }));
}

function wordCount(lines: string[]): number {
  return lines.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function applyExamReadinessRemediation(question: ProbabilityQuestion): ProbabilityQuestion {
  const entry = PRB_002_LIBRARIES.registry.find((item) => item.qlId === question.questionLanguageId);
  if (!entry) throw new Error(`Missing PRB-002 registry entry ${question.questionLanguageId}`);

  const parameters = question.parameters as GeneratedParameters;
  const solved = {
    exactDisplay: String(question.solver.exactAnswer ?? question.answer),
    evidence: question.solver.evidence ?? {},
  } as unknown as SolvedProbability;

  const remediatedStem = remodelExamReadinessStem(entry, parameters, question.stem);
  const remediatedExplanation = remodelExamReadinessExplanation(
    entry,
    parameters,
    solved,
    question.explanation.lines,
  );
  const stemChanged = remediatedStem !== question.stem;
  const explanationChanged = remediatedExplanation !== question.explanation.lines;
  const mockPolicy = buildProbabilityMockPolicy(entry);

  return {
    ...question,
    stem: stemChanged ? renderProbabilityMathText(remediatedStem) : question.stem,
    explanation: explanationChanged
      ? {
          ...question.explanation,
          explanationId: `${entry.qlId}-${entry.explanationStrategyId}-EXAM-READY-V7`,
          lines: renderProbabilityMathLines(remediatedExplanation),
          wordCount: wordCount(remediatedExplanation),
        }
      : question.explanation,
    difficultyAssessment: mockPolicy.effectiveDifficulty === question.difficultyBand
      ? question.difficultyAssessment
      : {
          ...question.difficultyAssessment,
          reason: `${question.difficultyAssessment.reason} Effective mock tier: ${mockPolicy.effectiveDifficulty}; the registry label is retained for compatibility.`,
        },
    parameters: { ...question.parameters, mockPolicy },
    traceability: {
      ...question.traceability,
      mockPolicy,
      testEligibility: mockPolicy.eligible ? "ELIGIBLE_WITH_FAMILY_LIMIT" : "LEARNING_ONLY",
      effectiveDifficulty: mockPolicy.effectiveDifficulty,
      academicRemediationVersion: "PRB-EXAM-READINESS-V7",
    },
  };
}

export function runPrb002Pipeline(
  cpId: Prb002CanonicalProblemId = PRB_002_CP_IDS[0],
  input: ProbabilityGenerationInput = {},
): ProbabilityQuestion {
  return applyExamReadinessRemediation(runProbabilityPackagePipeline(PRB_002_LIBRARIES, cpId, input));
}
