import { createHash } from "node:crypto";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
  generateArgCp007ExamProfileQuestion,
} from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import { ARG_QL_IDS, type ArgLocale, type ArgQlId } from "./types.ts";

export const ARG_CP010_CHECKPOINT_ID = "ARG-CP-010" as const;
export const ARG_CP010_AUTHORITY = "ARG_CP010_CORRELATED_REAL_PAPER_REMEDIATION_V1" as const;

type CorrelatedScenario = Readonly<{
  id: string;
  sourceSeed: number;
  rationale: string;
}>;

export const ARG_CP010_CORRELATED_SCENARIOS: Readonly<Record<ArgQlId, readonly CorrelatedScenario[]>> = Object.freeze({
  "ARG-QL-001": Object.freeze([
    Object.freeze({ id: "RECRUITMENT_MODEL_ANSWER", sourceSeed: 0, rationale: "Recruitment board + model-answer points is a coherent post-process transparency pair." }),
    Object.freeze({ id: "UNIVERSITY_EVALUATION_CRITERIA", sourceSeed: 9, rationale: "University + evaluation criteria is a coherent post-process transparency pair." }),
    Object.freeze({ id: "LICENSING_GRIEVANCE_CONTACT", sourceSeed: 6, rationale: "Licensing authority + grievance contact is coherent after a completed process." }),
    Object.freeze({ id: "SCHOLARSHIP_GRIEVANCE_CONTACT", sourceSeed: 11, rationale: "Scholarship authority + grievance contact is coherent after a completed process." }),
  ]),
  "ARG-QL-002": Object.freeze([
    Object.freeze({ id: "BANK_REGISTERED_MOBILE", sourceSeed: 0, rationale: "Bank + registered mobile number is a natural account-security pair." }),
    Object.freeze({ id: "WALLET_RECOVERY_EMAIL", sourceSeed: 9, rationale: "Payment wallet + recovery email is a natural account-security pair." }),
    Object.freeze({ id: "INSURANCE_PAYOUT_ACCOUNT", sourceSeed: 2, rationale: "Insurance portal + payout account is a natural high-risk change pair." }),
    Object.freeze({ id: "BROKERAGE_TRANSACTION_LIMIT", sourceSeed: 11, rationale: "Brokerage app + transaction limit is a natural account-control pair." }),
  ]),
  "ARG-QL-003": Object.freeze([
    Object.freeze({ id: "PASSPORT_DOCUMENT_SERVICE", sourceSeed: 0, rationale: "Passport centre + routine document services is operationally natural." }),
    Object.freeze({ id: "HOSPITAL_REGISTRATION", sourceSeed: 9, rationale: "District hospital + registration services is operationally natural." }),
    Object.freeze({ id: "MUNICIPAL_FEE_PAYMENT", sourceSeed: 2, rationale: "Municipal office + fee-payment services is operationally natural." }),
    Object.freeze({ id: "CITIZEN_CENTRE_CERTIFICATE", sourceSeed: 11, rationale: "Citizen-service centre + standard certificate services is operationally natural." }),
  ]),
  "ARG-QL-004": Object.freeze([
    Object.freeze({ id: "MARKET_EVENING_PEAK", sourceSeed: 0, rationale: "Market street + evening peak is a realistic restriction context." }),
    Object.freeze({ id: "SCHOOL_CLOSING_TIME", sourceSeed: 9, rationale: "School-zone road + school closing time is a realistic restriction context." }),
    Object.freeze({ id: "STATION_EVENING_PEAK", sourceSeed: 10, rationale: "Station-front road + evening peak is a realistic restriction context." }),
    Object.freeze({ id: "HOSPITAL_MORNING_RUSH", sourceSeed: 7, rationale: "Hospital approach road + morning rush is a realistic restriction context." }),
  ]),
  "ARG-QL-005": Object.freeze([
    Object.freeze({ id: "OFFICE_SCREEN_RECORDING", sourceSeed: 0, rationale: "Office employees + continuous screen recording is a credible monitoring pair." }),
    Object.freeze({ id: "REMOTE_KEYSTROKE_LOGGING", sourceSeed: 13, rationale: "Remote employees + keystroke logging is a credible monitoring pair." }),
    Object.freeze({ id: "FIELD_LOCATION_TRACKING", sourceSeed: 14, rationale: "Field staff + location tracking is a credible monitoring pair." }),
    Object.freeze({ id: "CONTRACT_WEBCAM_MONITORING", sourceSeed: 11, rationale: "Contract workers + webcam activity monitoring is a credible monitoring pair." }),
  ]),
  "ARG-QL-006": Object.freeze([
    Object.freeze({ id: "MARKETPLACE_BUYER_COMPLAINT", sourceSeed: 0, rationale: "Online marketplace + buyer complaint is a coherent due-process pair." }),
    Object.freeze({ id: "EXAM_AUTHORITY_CHEATING_COMPLAINT", sourceSeed: 9, rationale: "Examination authority + cheating complaint is a coherent due-process pair." }),
    Object.freeze({ id: "BANK_FRAUD_FLAG", sourceSeed: 2, rationale: "Bank + automated fraud flag is a coherent due-process pair." }),
    Object.freeze({ id: "COLLEGE_MISCONDUCT_ALLEGATION", sourceSeed: 11, rationale: "College + misconduct allegation is a coherent due-process pair." }),
  ]),
});

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function normalizedSeed(value: number): number {
  return Math.trunc(Number.isFinite(value) ? value : 0);
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function stableHash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

export function resolveArgCp010Scenario(input: { readonly qlId: ArgQlId; readonly seed: number }) {
  const seed = normalizedSeed(input.seed);
  const scenarios = ARG_CP010_CORRELATED_SCENARIOS[input.qlId];
  if (scenarios.length !== 4) throw new Error(`${input.qlId}: CP010 requires exactly four explicit compatibility scenarios`);
  const scenarioIndex = positiveModulo(seed, scenarios.length);
  const scenario = scenarios[scenarioIndex]!;
  const presentationBlock = Math.floor(seed / scenarios.length);
  // CP007 A/B pairing repeats every 16 seeds. Adding a multiple of 16 preserves
  // the explicitly approved semantic pair while allowing combination-option rotation.
  const sourceSeed = scenario.sourceSeed + 16 * presentationBlock;
  return Object.freeze({ scenarioIndex, scenario, presentationBlock, sourceSeed });
}

export function generateArgCp010RealPaperQuestion(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale | string;
  readonly seed: number;
  readonly profile: ArgCp007ExamProfile;
  readonly difficulty: ArgCp007Difficulty;
}) {
  const resolved = resolveArgCp010Scenario({ qlId: input.qlId, seed: input.seed });
  const source = generateArgCp007ExamProfileQuestion({
    qlId: input.qlId,
    locale: input.locale,
    seed: resolved.sourceSeed,
    profile: input.profile,
    difficulty: input.difficulty,
  });

  const contentFingerprint = hash([
    ARG_CP010_AUTHORITY,
    input.qlId,
    input.profile,
    input.difficulty,
    source.locale,
    normalizedSeed(input.seed),
    resolved.scenario.id,
    source.statement,
    source.arguments,
    source.options,
    source.correctIndex,
  ]);

  return Object.freeze({
    ...source,
    checkpointId: ARG_CP010_CHECKPOINT_ID,
    authority: ARG_CP010_AUTHORITY,
    scenarioId: `${source.templateId}-CP010-${resolved.scenario.id}-${source.profile}-${resolved.presentationBlock}`,
    seed: normalizedSeed(input.seed),
    contentFingerprint,
    metadata: Object.freeze({
      ...source.metadata,
      authority: ARG_CP010_AUTHORITY,
      sourceRealPaperAuthority: source.authority,
      sourceRealPaperCheckpoint: source.checkpointId,
      historicalRealPaperFreezeAuthority: "ARG_CP008_REAL_PAPER_CLOSURE_V1" as const,
      englishEditorialAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
      localizedEditorialAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
      correlatedScenarioModel: "ARG_CP010_EXPLICIT_COMPATIBILITY_SET_V1" as const,
      correlatedScenarioId: resolved.scenario.id,
      correlatedScenarioIndex: resolved.scenarioIndex,
      correlatedSourceSeed: resolved.sourceSeed,
      correlatedScenarioRationale: resolved.scenario.rationale,
      realPaperEditorialRemediation: true as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export function generateArgCp010RealPaperBatch(input: {
  readonly profile: ArgCp007ExamProfile;
  readonly qlId?: ArgQlId;
  readonly locale?: ArgLocale | string;
  readonly difficulty: ArgCp007Difficulty;
  readonly seed?: string;
  readonly count?: number;
}) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[input.profile];
  if (!(profileMeta.supportedDifficulties as readonly string[]).includes(input.difficulty)) {
    throw new Error(`${input.profile} does not support ${input.difficulty}.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const seedText = String(input.seed ?? "ARG-CP010-DEFAULT");
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = input.qlId ?? ARG_QL_IDS[index % ARG_QL_IDS.length]!;
    const seed = stableHash(`${ARG_CP010_AUTHORITY}:${seedText}:${input.profile}:${input.difficulty}:${qlId}:${index}`) & 0x7fffffff;
    return generateArgCp010RealPaperQuestion({
      qlId,
      locale: input.locale ?? "en-IN",
      seed,
      profile: input.profile,
      difficulty: input.difficulty,
    });
  }));

  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP010_CHECKPOINT_ID,
    authority: ARG_CP010_AUTHORITY,
    profile: input.profile,
    difficulty: input.difficulty,
    questions,
    generationContext: Object.freeze({
      chapterId: "ARG-001" as const,
      checkpointId: ARG_CP010_CHECKPOINT_ID,
      authority: ARG_CP010_AUTHORITY,
      examProfile: input.profile,
      correlatedScenarioModel: "ARG_CP010_EXPLICIT_COMPATIBILITY_SET_V1" as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}
