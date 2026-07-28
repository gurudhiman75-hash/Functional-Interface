import type { NumCp003RetainedAnswerSemantic } from "./types";
import { NUM_CP003_RETAINED_TEMPLATE_REGISTRY } from "./template-registry";

export type NumCp003RetainedTemplateLabel =
  (typeof NUM_CP003_RETAINED_TEMPLATE_REGISTRY)[number]["temporaryTemplateLabel"];

export type NumCp003Difficulty = "Easy" | "Medium" | "Hard";
export type NumCp003ExtremumDirection = "LARGEST" | "SMALLEST" | "LEAST" | "GREATEST";

export interface NumCp003RetainedOptionAudit {
  text: string;
  misconceptionId: string;
  diagnostic: string;
}

export interface NumCp003RetainedExplanation {
  coreConcept: string;
  strategy: string;
  steps: string[];
  shortcut: string;
  verification: string;
  conclusion: string;
  traps: string[];
}

export interface NumCp003ReasoningNode {
  id: string;
  kind: "GIVEN" | "RULE" | "ENUMERATION" | "DERIVATION" | "VERIFICATION" | "CONCLUSION";
  text: string;
  dependsOn: string[];
}

export type NumCp003RetainedHiddenState =
  | {
      kind: "DIRECT_DIVISIBILITY";
      number: bigint;
      requestedPolarity: "DIVISIBLE" | "NOT_DIVISIBLE";
      divisorOptions: bigint[];
    }
  | {
      kind: "SINGLE_DIGIT_CANDIDATE_SET";
      template: string;
      divisors: bigint[];
      domain: number[];
      validDigits: number[];
      projection: string;
      extremumDirection?: "LARGEST" | "SMALLEST" | "GREATEST" | "SMALLEST_NUMBER";
    }
  | {
      kind: "ORDERED_PAIR_CANDIDATE_SET";
      template: string;
      divisors: bigint[];
      relation?: { kind: "DIGIT_SUM"; value: number };
      validPairs: Array<[number, number]>;
      projection: string;
    }
  | {
      kind: "DIGIT_BOUND_MULTIPLE";
      digits: number;
      divisor: bigint;
      direction: "LEAST" | "GREATEST";
      lowerBoundary: bigint;
      upperBoundary: bigint;
      answer: bigint;
    }
  | {
      kind: "ONE_DIVISOR_RANGE";
      lower: bigint;
      upper: bigint;
      divisor: bigint;
      count: bigint;
    }
  | {
      kind: "IMPLICIT_REPEATED_NUMERAL";
      block: string;
      repeats: number;
      number: bigint;
      divisorOptions: bigint[];
    }
  | {
      kind: "LINKED_ARITHMETIC_DIVISIBILITY";
      addend: bigint;
      sourcePattern: string;
      resultPattern: string;
      divisor: bigint;
      arithmeticPairs: Array<[number, number]>;
      validPairs: Array<[number, number]>;
      direction: "LARGEST" | "SMALLEST";
      answerDigit: number;
    }
  | {
      kind: "DATA_SUFFICIENCY";
      template: string;
      domain: number[];
      statementI: string;
      statementII: string;
      candidatesI: number[];
      candidatesII: number[];
      candidatesTogether: number[];
      sufficiencyClass: "I_ALONE" | "II_ALONE" | "EACH_ALONE" | "BOTH_TOGETHER" | "INSUFFICIENT";
    }
  | {
      kind: "CLAIM_VALIDATION";
      requestedPolarity: "CORRECT" | "INCORRECT";
      claims: Array<{ text: string; number: bigint; divisor: bigint; isTrue: boolean }>;
    };

export interface NumCp003RawRetainedQuestion {
  difficulty: NumCp003Difficulty;
  answerSemantic: NumCp003RetainedAnswerSemantic;
  stem: string;
  answer: string;
  optionAudit: NumCp003RetainedOptionAudit[];
  hiddenState: NumCp003RetainedHiddenState;
  explanation: NumCp003RetainedExplanation;
  reasoningNodes: NumCp003ReasoningNode[];
  fingerprint: string;
}

export interface NumCp003RetainedQuestion {
  canonicalProblemId: "NUM-CP-003";
  temporaryTemplateLabel: NumCp003RetainedTemplateLabel;
  permanentQlId: null;
  seed: string;
  difficulty: NumCp003Difficulty;
  answerSemantic: NumCp003RetainedAnswerSemantic;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: NumCp003RetainedOptionAudit[];
  hiddenState: NumCp003RetainedHiddenState;
  explanation: NumCp003RetainedExplanation;
  reasoningGraph: { nodes: NumCp003ReasoningNode[] };
  fingerprint: string;
  validation: { ok: boolean; errors: string[]; verifierAnswer: string };
  reviewStatus: "UNREVIEWED_RETAINED_CANDIDATE";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
