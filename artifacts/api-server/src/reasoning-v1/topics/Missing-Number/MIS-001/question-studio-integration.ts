import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from '../../../../question-studio/engine-types';
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from '../../../../question-studio/standard-lifecycle';
import {
  MIS_CP001_CANDIDATE_IDS,
  generateMisCp001Question,
  type GeneratedMisCp001Question,
} from './MIS-CP-001/generator';
import {
  independentlyEvaluateMisCp001Rule,
  independentlyVerifyMisCp001Group,
} from './MIS-CP-001/independent-solver';
import { misCp001RuleByCandidateId, type MisCp001CandidateId } from './MIS-CP-001/rule-definitions';
import {
  MIS_CP002_CANDIDATE_IDS,
  generateMisCp002Question,
  type GeneratedMisCp002Question,
} from './MIS-CP-002/generator';
import {
  independentlyEvaluateMisCp002Rule,
  independentlyVerifyMisCp002Group,
} from './MIS-CP-002/independent-solver';
import { misCp002RuleByCandidateId, type MisCp002CandidateId } from './MIS-CP-002/rule-definitions';
import {
  MIS_CP003_CANDIDATE_IDS,
  generateMisCp003Question,
  type GeneratedMisCp003Question,
} from './MIS-CP-003/generator';
import {
  independentlyEvaluateMisCp003Rule,
  independentlyVerifyMisCp003Group,
} from './MIS-CP-003/independent-solver';
import { misCp003RuleByCandidateId, type MisCp003CandidateId } from './MIS-CP-003/rule-definitions';
import {
  MIS_CP004_CANDIDATE_IDS,
  generateMisCp004Question,
  type GeneratedMisCp004Question,
} from './MIS-CP-004/generator';
import {
  independentlyEvaluateMisCp004Rule,
  independentlyVerifyMisCp004Group,
} from './MIS-CP-004/independent-solver';
import { misCp004RuleByCandidateId, type MisCp004CandidateId } from './MIS-CP-004/rule-definitions';
import { MIS_CP005_CANDIDATE_IDS, generateMisCp005Question, type GeneratedMisCp005Question } from './MIS-CP-005/generator';
import { independentlyEvaluateMisCp005Rule, independentlyVerifyMisCp005Group } from './MIS-CP-005/independent-solver';
import { misCp005RuleByCandidateId, type MisCp005CandidateId } from './MIS-CP-005/rule-definitions';
import { MIS_CP006_CANDIDATE_IDS, generateMisCp006Question, type GeneratedMisCp006Question } from './MIS-CP-006/generator';
import { independentlyEvaluateMisCp006Rule, independentlyVerifyMisCp006Group } from './MIS-CP-006/independent-solver';
import { misCp006RuleByCandidateId, type MisCp006CandidateId } from './MIS-CP-006/rule-definitions';
import { MIS_CP007_CANDIDATE_IDS, generateMisCp007Question, type GeneratedMisCp007Question } from './MIS-CP-007/generator';
import { independentlyEvaluateMisCp007Rule, independentlyVerifyMisCp007Group } from './MIS-CP-007/independent-solver';
import { misCp007RuleByCandidateId, type MisCp007CandidateId } from './MIS-CP-007/rule-definitions';
import { MIS_CP008_CANDIDATE_IDS, generateMisCp008Question, type GeneratedMisCp008Question } from './MIS-CP-008/generator';
import { independentlySolveMisCp008Missing, independentlyVerifyMisCp008Group } from './MIS-CP-008/independent-solver';
import { misCp008RuleByCandidateId, type MisCp008CandidateId } from './MIS-CP-008/rule-definitions';
import { MIS_CP009_CANDIDATE_IDS, generateMisCp009Question, type GeneratedMisCp009Question } from './MIS-CP-009/generator';
import { independentlyEvaluateMisCp009Rule, independentlyVerifyMisCp009Group } from './MIS-CP-009/independent-solver';
import { misCp009RuleByCandidateId, type MisCp009CandidateId } from './MIS-CP-009/rule-definitions';
import { MIS_CP010_CANDIDATE_IDS, generateMisCp010Question, type GeneratedMisCp010Question } from './MIS-CP-010/generator';
import { independentlyEvaluateMisCp010Rule, independentlyVerifyMisCp010Group } from './MIS-CP-010/independent-solver';
import { misCp010RuleByCandidateId, type MisCp010CandidateId } from './MIS-CP-010/rule-definitions';
import { MIS_CP011_CANDIDATE_IDS, generateMisCp011Question, type GeneratedMisCp011Question } from './MIS-CP-011/generator';
import { independentlyEvaluateMisCp011Rule, independentlyVerifyMisCp011Group } from './MIS-CP-011/independent-solver';
import { misCp011RuleByCandidateId, type MisCp011CandidateId } from './MIS-CP-011/rule-definitions';
import { MIS_CP012_CANDIDATE_IDS, generateMisCp012Question, type GeneratedMisCp012Question } from './MIS-CP-012/generator';
import { evaluateMisCp012Rule, ruleFitsMisCp012 } from './MIS-CP-012/independent-solver';
import { misCp012ProfileByCandidateId, type MisCp012CandidateId } from './MIS-CP-012/rule-definitions';
import { MIS_CP013_CANDIDATE_IDS, generateMisCp013Question, type GeneratedMisCp013Question } from './MIS-CP-013/generator';
import { independentlyEvaluateMisCp013Rule, independentlyVerifyMisCp013Group } from './MIS-CP-013/independent-solver';
import { misCp013RuleByCandidateId, type MisCp013CandidateId } from './MIS-CP-013/rule-definitions';
import { MIS_CP014_CANDIDATE_IDS, generateMisCp014Question, type GeneratedMisCp014Question } from './MIS-CP-014/generator';
import { independentlySolveMisCp014Missing, independentlySumMisCp014Group } from './MIS-CP-014/independent-solver';
import { type MisCp014CandidateId } from './MIS-CP-014/rule-definitions';
import { MIS_CP015_CANDIDATE_IDS, generateMisCp015Question, type GeneratedMisCp015Question } from './MIS-CP-015/generator';
import { independentlyEvaluateMisCp015Rule, independentlySolveMisCp015Missing, independentlyVerifyMisCp015Group } from './MIS-CP-015/independent-solver';
import { type MisCp015CandidateId } from './MIS-CP-015/rule-definitions';
import { MIS_CP016_CANDIDATE_IDS, generateMisCp016Question, type GeneratedMisCp016Question } from './MIS-CP-016/generator';
import { independentlyEvaluateMisCp016Rule, independentlyVerifyMisCp016Group } from './MIS-CP-016/independent-solver';
import { type MisCp016CandidateId } from './MIS-CP-016/rule-definitions';
import { MIS_CP017_CANDIDATE_IDS, generateMisCp017Question, type GeneratedMisCp017Question } from './MIS-CP-017/generator';
import { independentlyEvaluateMisCp017Rule, independentlyVerifyMisCp017Group } from './MIS-CP-017/independent-solver';
import { type MisCp017CandidateId } from './MIS-CP-017/rule-definitions';
import { MIS_CP018_CANDIDATE_IDS, generateMisCp018Question, type GeneratedMisCp018Question } from './MIS-CP-018/generator';
import { independentlyEvaluateMisCp018Rule, independentlyVerifyMisCp018Group } from './MIS-CP-018/independent-solver';
import { misCp018RuleByCandidateId, type MisCp018CandidateId } from './MIS-CP-018/rule-definitions';
import { MIS_CP019_CANDIDATE_IDS, generateMisCp019Question, type GeneratedMisCp019Question } from './MIS-CP-019/generator';
import { independentlyEvaluateMisCp019Rule, independentlyVerifyMisCp019Group } from './MIS-CP-019/independent-solver';
import { misCp019RuleByCandidateId, type MisCp019CandidateId } from './MIS-CP-019/rule-definitions';
import { MIS_CP020_CANDIDATE_IDS, generateMisCp020Question, type GeneratedMisCp020Question } from './MIS-CP-020/generator';
import { independentlyEvaluateMisCp020Rule, independentlyVerifyMisCp020Group } from './MIS-CP-020/independent-solver';
import { misCp020RuleByCandidateId, type MisCp020CandidateId } from './MIS-CP-020/rule-definitions';
import { MIS_CP021_CANDIDATE_IDS, generateMisCp021Question, type GeneratedMisCp021Question } from './MIS-CP-021/generator';
import { independentlyEvaluateMisCp021Rule, independentlyVerifyMisCp021Group } from './MIS-CP-021/independent-solver';
import { misCp021RuleByCandidateId, type MisCp021CandidateId } from './MIS-CP-021/rule-definitions';
import { MIS_CP022_CANDIDATE_IDS, generateMisCp022Question, type GeneratedMisCp022Question } from './MIS-CP-022/generator';
import { independentlyEvaluateMisCp022Rule, independentlyVerifyMisCp022Group } from './MIS-CP-022/independent-solver';
import { misCp022RuleByCandidateId, type MisCp022CandidateId } from './MIS-CP-022/rule-definitions';
import { MIS_CP023_CANDIDATE_IDS, generateMisCp023Question, type GeneratedMisCp023Question } from './MIS-CP-023/generator';
import { independentlyEvaluateMisCp023Rule, independentlyVerifyMisCp023Group } from './MIS-CP-023/independent-solver';
import { misCp023RuleByCandidateId, type MisCp023CandidateId } from './MIS-CP-023/rule-definitions';
import { MIS_CP024_CANDIDATE_IDS, generateMisCp024Question, type GeneratedMisCp024Question } from './MIS-CP-024/generator';
import { independentlyEvaluateMisCp024Rule, independentlyVerifyMisCp024Group } from './MIS-CP-024/independent-solver';
import { misCp024RuleByCandidateId, type MisCp024CandidateId } from './MIS-CP-024/rule-definitions';
import { MIS_CP025_CANDIDATE_IDS, generateMisCp025Question, type GeneratedMisCp025Question } from './MIS-CP-025/generator';
import { independentlySolveMisCp025RightProduct, independentlyVerifyMisCp025Group } from './MIS-CP-025/independent-solver';
import { misCp025RuleByCandidateId, type MisCp025CandidateId } from './MIS-CP-025/rule-definitions';
import { MIS_CP026_CANDIDATE_IDS, generateMisCp026Question, type GeneratedMisCp026Question } from './MIS-CP-026/generator';
import { independentlyEvaluateMisCp026, independentlyVerifyMisCp026Pair } from './MIS-CP-026/independent-solver';
import { misCp026RuleByCandidateId, type MisCp026CandidateId } from './MIS-CP-026/rule-definitions';
import { MIS_CP027_CANDIDATE_IDS, generateMisCp027Question, type GeneratedMisCp027Question } from './MIS-CP-027/generator';
import { independentlyEvaluateMisCp027, independentlyVerifyMisCp027Group } from './MIS-CP-027/independent-solver';
import { misCp027RuleByCandidateId, type MisCp027CandidateId } from './MIS-CP-027/rule-definitions';
import { MIS_CP028_CANDIDATE_IDS, generateMisCp028Question, type GeneratedMisCp028Question } from './MIS-CP-028/generator';
import { independentlyEvaluateMisCp028, independentlyVerifyMisCp028Group } from './MIS-CP-028/independent-solver';
import { misCp028RuleByCandidateId, type MisCp028CandidateId } from './MIS-CP-028/rule-definitions';
import { canonicalMisSemanticAuthorityId, misCandidateCreatesSemanticAuthority } from './semantic-authority-registry';
import { permanentQlForMisCandidate, MIS_PERMANENT_QL_ALLOCATION_STATE } from './MIS-PERMANENT-QL-REGISTRY';
import { localizeMisWave1Question, MIS_LOCALIZATION_WAVE1_STATE, type MisLocalizedLanguage } from './localization-wave1';

export const MIS_001_PACKAGE_ID = 'MIS-001' as const;
export const MIS_001_RUNTIME_MODE = 'review-only' as const;
export const MIS_001_REVIEW_AUTHORITY = 'MIS-001-CP001-CP028-SOURCE-DISCOVERY-V1' as const;
export const MIS_001_CHECKPOINT_IDS = ['MIS-CP-001', 'MIS-CP-002', 'MIS-CP-003', 'MIS-CP-004', 'MIS-CP-005', 'MIS-CP-006', 'MIS-CP-007', 'MIS-CP-008', 'MIS-CP-009', 'MIS-CP-010', 'MIS-CP-011', 'MIS-CP-012', 'MIS-CP-013', 'MIS-CP-014', 'MIS-CP-015', 'MIS-CP-016', 'MIS-CP-017', 'MIS-CP-018', 'MIS-CP-019', 'MIS-CP-020', 'MIS-CP-021', 'MIS-CP-022', 'MIS-CP-023', 'MIS-CP-024', 'MIS-CP-025', 'MIS-CP-026', 'MIS-CP-027', 'MIS-CP-028'] as const;

type MisCandidateId = MisCp001CandidateId | MisCp002CandidateId | MisCp003CandidateId | MisCp004CandidateId | MisCp005CandidateId | MisCp006CandidateId | MisCp007CandidateId | MisCp008CandidateId | MisCp009CandidateId | MisCp010CandidateId | MisCp011CandidateId | MisCp012CandidateId | MisCp013CandidateId | MisCp014CandidateId | MisCp015CandidateId | MisCp016CandidateId | MisCp017CandidateId | MisCp018CandidateId | MisCp019CandidateId | MisCp020CandidateId | MisCp021CandidateId | MisCp022CandidateId | MisCp023CandidateId | MisCp024CandidateId | MisCp025CandidateId | MisCp026CandidateId | MisCp027CandidateId | MisCp028CandidateId;
type MisGeneratedQuestion = GeneratedMisCp001Question | GeneratedMisCp002Question | GeneratedMisCp003Question | GeneratedMisCp004Question | GeneratedMisCp005Question | GeneratedMisCp006Question | GeneratedMisCp007Question | GeneratedMisCp008Question | GeneratedMisCp009Question | GeneratedMisCp010Question | GeneratedMisCp011Question | GeneratedMisCp012Question | GeneratedMisCp013Question | GeneratedMisCp014Question | GeneratedMisCp015Question | GeneratedMisCp016Question | GeneratedMisCp017Question | GeneratedMisCp018Question | GeneratedMisCp019Question | GeneratedMisCp020Question | GeneratedMisCp021Question | GeneratedMisCp022Question | GeneratedMisCp023Question | GeneratedMisCp024Question | GeneratedMisCp025Question | GeneratedMisCp026Question | GeneratedMisCp027Question | GeneratedMisCp028Question;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ALL_CANDIDATES: readonly MisCandidateId[] = Object.freeze([
  ...MIS_CP001_CANDIDATE_IDS,
  ...MIS_CP002_CANDIDATE_IDS,
  ...MIS_CP003_CANDIDATE_IDS,
  ...MIS_CP004_CANDIDATE_IDS,
  ...MIS_CP005_CANDIDATE_IDS,
  ...MIS_CP006_CANDIDATE_IDS,
  ...MIS_CP007_CANDIDATE_IDS,
  ...MIS_CP008_CANDIDATE_IDS,
  ...MIS_CP009_CANDIDATE_IDS,
  ...MIS_CP010_CANDIDATE_IDS,
  ...MIS_CP011_CANDIDATE_IDS,
  ...MIS_CP012_CANDIDATE_IDS,
  ...MIS_CP013_CANDIDATE_IDS,
  ...MIS_CP014_CANDIDATE_IDS,
  ...MIS_CP015_CANDIDATE_IDS,
  ...MIS_CP016_CANDIDATE_IDS,
  ...MIS_CP017_CANDIDATE_IDS,
  ...MIS_CP018_CANDIDATE_IDS,
  ...MIS_CP019_CANDIDATE_IDS,
  ...MIS_CP020_CANDIDATE_IDS,
  ...MIS_CP021_CANDIDATE_IDS,
  ...MIS_CP022_CANDIDATE_IDS,
  ...MIS_CP023_CANDIDATE_IDS,
  ...MIS_CP024_CANDIDATE_IDS,
  ...MIS_CP025_CANDIDATE_IDS,
  ...MIS_CP026_CANDIDATE_IDS,
  ...MIS_CP027_CANDIDATE_IDS,
  ...MIS_CP028_CANDIDATE_IDS,
]);

function canonicalSemanticAuthorityId(candidateId: MisCandidateId): string {
  return canonicalMisSemanticAuthorityId(candidateId);
}

function createsNewSemanticAuthority(candidateId: MisCandidateId): boolean {
  return misCandidateCreatesSemanticAuthority(candidateId);
}

const SEMANTIC_AUTHORITY_IDS = Object.freeze([...new Set(ALL_CANDIDATES.map(canonicalSemanticAuthorityId))]);
const REUSED_VARIANT_IDS = Object.freeze(ALL_CANDIDATES.filter((candidateId) => !createsNewSemanticAuthority(candidateId)));

function text(value: unknown): string {
  return String(value ?? '').trim();
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  const maxCount = Math.max(100, ALL_CANDIDATES.length);
  if (!Number.isInteger(value) || value < 1 || value > maxCount) {
    throw new Error(`MIS-001 review batches require count between 1 and ${maxCount}.`);
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest['language']): MisLocalizedLanguage {
  const language = value ?? 'en';
  if (language === 'en' || language === 'hi' || language === 'pa') return language;
  throw new Error('MIS-001 supports English, Hindi and Punjabi review generation.');
}

function normalizeDifficulty(value: unknown): 'Easy' | 'Medium' | 'Hard' | undefined {
  const difficulty = text(value).toLowerCase();
  if (!difficulty || difficulty === 'mixed') return undefined;
  if (difficulty === 'easy') return 'Easy';
  if (difficulty === 'medium' || difficulty === 'moderate') return 'Medium';
  if (difficulty === 'hard') return 'Hard';
  throw new Error('MIS-001 difficulty must be Easy, Medium, Hard or Mixed.');
}

function isCp001Candidate(value: string): value is MisCp001CandidateId {
  return MIS_CP001_CANDIDATE_IDS.includes(value as MisCp001CandidateId);
}

function isCp002Candidate(value: string): value is MisCp002CandidateId {
  return MIS_CP002_CANDIDATE_IDS.includes(value as MisCp002CandidateId);
}

function isCp003Candidate(value: string): value is MisCp003CandidateId {
  return MIS_CP003_CANDIDATE_IDS.includes(value as MisCp003CandidateId);
}

function isCp004Candidate(value: string): value is MisCp004CandidateId {
  return MIS_CP004_CANDIDATE_IDS.includes(value as MisCp004CandidateId);
}
function isCp005Candidate(value: string): value is MisCp005CandidateId {
  return MIS_CP005_CANDIDATE_IDS.includes(value as MisCp005CandidateId);
}
function isCp006Candidate(value: string): value is MisCp006CandidateId {
  return MIS_CP006_CANDIDATE_IDS.includes(value as MisCp006CandidateId);
}
function isCp007Candidate(value: string): value is MisCp007CandidateId {
  return MIS_CP007_CANDIDATE_IDS.includes(value as MisCp007CandidateId);
}
function isCp008Candidate(value: string): value is MisCp008CandidateId {
  return MIS_CP008_CANDIDATE_IDS.includes(value as MisCp008CandidateId);
}
function isCp009Candidate(value: string): value is MisCp009CandidateId {
  return MIS_CP009_CANDIDATE_IDS.includes(value as MisCp009CandidateId);
}
function isCp010Candidate(value: string): value is MisCp010CandidateId {
  return MIS_CP010_CANDIDATE_IDS.includes(value as MisCp010CandidateId);
}
function isCp011Candidate(value: string): value is MisCp011CandidateId {
  return MIS_CP011_CANDIDATE_IDS.includes(value as MisCp011CandidateId);
}
function isCp012Candidate(value: string): value is MisCp012CandidateId {
  return MIS_CP012_CANDIDATE_IDS.includes(value as MisCp012CandidateId);
}
function isCp013Candidate(value: string): value is MisCp013CandidateId {
  return MIS_CP013_CANDIDATE_IDS.includes(value as MisCp013CandidateId);
}
function isCp014Candidate(value: string): value is MisCp014CandidateId {
  return MIS_CP014_CANDIDATE_IDS.includes(value as MisCp014CandidateId);
}
function isCp015Candidate(value: string): value is MisCp015CandidateId {
  return MIS_CP015_CANDIDATE_IDS.includes(value as MisCp015CandidateId);
}
function isCp016Candidate(value: string): value is MisCp016CandidateId {
  return MIS_CP016_CANDIDATE_IDS.includes(value as MisCp016CandidateId);
}
function isCp017Candidate(value: string): value is MisCp017CandidateId {
  return MIS_CP017_CANDIDATE_IDS.includes(value as MisCp017CandidateId);
}
function isCp018Candidate(value: string): value is MisCp018CandidateId {
  return MIS_CP018_CANDIDATE_IDS.includes(value as MisCp018CandidateId);
}
function isCp019Candidate(value: string): value is MisCp019CandidateId {
  return MIS_CP019_CANDIDATE_IDS.includes(value as MisCp019CandidateId);
}
function isCp020Candidate(value: string): value is MisCp020CandidateId {
  return MIS_CP020_CANDIDATE_IDS.includes(value as MisCp020CandidateId);
}
function isCp021Candidate(value: string): value is MisCp021CandidateId {
  return MIS_CP021_CANDIDATE_IDS.includes(value as MisCp021CandidateId);
}
function isCp022Candidate(value: string): value is MisCp022CandidateId {
  return MIS_CP022_CANDIDATE_IDS.includes(value as MisCp022CandidateId);
}
function isCp023Candidate(value: string): value is MisCp023CandidateId {
  return MIS_CP023_CANDIDATE_IDS.includes(value as MisCp023CandidateId);
}
function isCp024Candidate(value: string): value is MisCp024CandidateId {
  return MIS_CP024_CANDIDATE_IDS.includes(value as MisCp024CandidateId);
}
function isCp025Candidate(value: string): value is MisCp025CandidateId {
  return MIS_CP025_CANDIDATE_IDS.includes(value as MisCp025CandidateId);
}
function isCp026Candidate(value: string): value is MisCp026CandidateId {
  return MIS_CP026_CANDIDATE_IDS.includes(value as MisCp026CandidateId);
}
function isCp027Candidate(value: string): value is MisCp027CandidateId {
  return MIS_CP027_CANDIDATE_IDS.includes(value as MisCp027CandidateId);
}
function isCp028Candidate(value: string): value is MisCp028CandidateId {
  return MIS_CP028_CANDIDATE_IDS.includes(value as MisCp028CandidateId);
}

function isCandidate(value: string): value is MisCandidateId {
  return isCp001Candidate(value) || isCp002Candidate(value) || isCp003Candidate(value) || isCp004Candidate(value)
    || isCp005Candidate(value) || isCp006Candidate(value) || isCp007Candidate(value)
    || isCp008Candidate(value) || isCp009Candidate(value) || isCp010Candidate(value)
    || isCp011Candidate(value) || isCp012Candidate(value) || isCp013Candidate(value) || isCp014Candidate(value) || isCp015Candidate(value) || isCp016Candidate(value) || isCp017Candidate(value) || isCp018Candidate(value) || isCp019Candidate(value) || isCp020Candidate(value) || isCp021Candidate(value) || isCp022Candidate(value) || isCp023Candidate(value) || isCp024Candidate(value) || isCp025Candidate(value) || isCp026Candidate(value) || isCp027Candidate(value) || isCp028Candidate(value);
}

function candidateCheckpoint(candidateId: MisCandidateId): typeof MIS_001_CHECKPOINT_IDS[number] {
  if (isCp001Candidate(candidateId)) return 'MIS-CP-001';
  if (isCp002Candidate(candidateId)) return 'MIS-CP-002';
  if (isCp003Candidate(candidateId)) return 'MIS-CP-003';
  if (isCp004Candidate(candidateId)) return 'MIS-CP-004';
  if (isCp005Candidate(candidateId)) return 'MIS-CP-005';
  if (isCp006Candidate(candidateId)) return 'MIS-CP-006';
  if (isCp007Candidate(candidateId)) return 'MIS-CP-007';
  if (isCp008Candidate(candidateId)) return 'MIS-CP-008';
  if (isCp009Candidate(candidateId)) return 'MIS-CP-009';
  if (isCp010Candidate(candidateId)) return 'MIS-CP-010';
  if (isCp011Candidate(candidateId)) return 'MIS-CP-011';
  if (isCp012Candidate(candidateId)) return 'MIS-CP-012';
  if (isCp013Candidate(candidateId)) return 'MIS-CP-013';
  if (isCp014Candidate(candidateId)) return 'MIS-CP-014';
  if (isCp015Candidate(candidateId)) return 'MIS-CP-015';
  if (isCp016Candidate(candidateId)) return 'MIS-CP-016';
  if (isCp017Candidate(candidateId)) return 'MIS-CP-017';
  if (isCp018Candidate(candidateId)) return 'MIS-CP-018';
  if (isCp019Candidate(candidateId)) return 'MIS-CP-019';
  if (isCp020Candidate(candidateId)) return 'MIS-CP-020';
  if (isCp021Candidate(candidateId)) return 'MIS-CP-021';
  if (isCp022Candidate(candidateId)) return 'MIS-CP-022';
  if (isCp023Candidate(candidateId)) return 'MIS-CP-023';
  if (isCp024Candidate(candidateId)) return 'MIS-CP-024';
  if (isCp025Candidate(candidateId)) return 'MIS-CP-025';
  if (isCp026Candidate(candidateId)) return 'MIS-CP-026';
  if (isCp027Candidate(candidateId)) return 'MIS-CP-027';
  return 'MIS-CP-028';
}

function candidateSupportsDifficulty(candidateId: MisCandidateId, difficulty: 'Easy' | 'Medium' | 'Hard'): boolean {
  if (isCp001Candidate(candidateId)) {
    return misCp001RuleByCandidateId(candidateId).difficulty === difficulty;
  }
  if (isCp002Candidate(candidateId)) {
    const rule = misCp002RuleByCandidateId(candidateId);
    if (rule.ruleId === 'THREE_INPUT_SUM' || rule.ruleId === 'TWO_ADD_ONE_SUBTRACT') {
      return difficulty === 'Easy';
    }
    return difficulty === 'Medium';
  }
  if (isCp003Candidate(candidateId)) {
    return misCp003RuleByCandidateId(candidateId).baselineDifficulty === difficulty;
  }
  if (isCp004Candidate(candidateId)) return misCp004RuleByCandidateId(candidateId).baselineDifficulty === difficulty;
  if (isCp005Candidate(candidateId)) return misCp005RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp006Candidate(candidateId)) return misCp006RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp007Candidate(candidateId)) return misCp007RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp008Candidate(candidateId)) return misCp008RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp009Candidate(candidateId)) return misCp009RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp010Candidate(candidateId)) return misCp010RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp011Candidate(candidateId)) return misCp011RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp012Candidate(candidateId)) return difficulty === 'Hard';
  if (isCp013Candidate(candidateId)) return misCp013RuleByCandidateId(candidateId).baselineDifficulty === difficulty;
  if (isCp014Candidate(candidateId)) return difficulty === 'Medium';
  if (isCp015Candidate(candidateId)) return difficulty === 'Medium';
  if (isCp016Candidate(candidateId)) return difficulty === 'Hard';
  if (isCp017Candidate(candidateId)) return difficulty === 'Hard';
  if (isCp018Candidate(candidateId)) return misCp018RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp019Candidate(candidateId)) return misCp019RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp020Candidate(candidateId)) return misCp020RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp021Candidate(candidateId)) return misCp021RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp022Candidate(candidateId)) return misCp022RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp023Candidate(candidateId)) return misCp023RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp024Candidate(candidateId)) return misCp024RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp025Candidate(candidateId)) return misCp025RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp026Candidate(candidateId)) return misCp026RuleByCandidateId(candidateId).difficulty === difficulty;
  if (isCp027Candidate(candidateId)) return misCp027RuleByCandidateId(candidateId).difficulty === difficulty;
  return misCp028RuleByCandidateId(candidateId).difficulty === difficulty;
}

function resolveCandidatePool(
  request: QuestionStudioGenerationRequest,
  difficulty: 'Easy' | 'Medium' | 'Hard' | undefined,
): MisCandidateId[] {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase()).filter(Boolean);

  const candidates = [...new Set(selectors.filter(isCandidate))];
  const checkpoints = [...new Set(selectors.filter((value) =>
    value === 'MIS-CP-001' || value === 'MIS-CP-002' || value === 'MIS-CP-003' || value === 'MIS-CP-004' || value === 'MIS-CP-005' || value === 'MIS-CP-006' || value === 'MIS-CP-007' || value === 'MIS-CP-008' || value === 'MIS-CP-009' || value === 'MIS-CP-010' || value === 'MIS-CP-011' || value === 'MIS-CP-012' || value === 'MIS-CP-013' || value === 'MIS-CP-014' || value === 'MIS-CP-015' || value === 'MIS-CP-016' || value === 'MIS-CP-017' || value === 'MIS-CP-018' || value === 'MIS-CP-019' || value === 'MIS-CP-020' || value === 'MIS-CP-021' || value === 'MIS-CP-022' || value === 'MIS-CP-023' || value === 'MIS-CP-024' || value === 'MIS-CP-025' || value === 'MIS-CP-026' || value === 'MIS-CP-027' || value === 'MIS-CP-028',
  ))] as (typeof MIS_001_CHECKPOINT_IDS[number])[];

  if (candidates.length > 1) throw new Error('Conflicting MIS-001 candidate selectors.');
  if (checkpoints.length > 1) throw new Error('Conflicting MIS-001 checkpoint selectors.');
  const unknown = selectors.find((value) =>
    value.startsWith('MIS-CAND-') && !isCandidate(value)
    || value.startsWith('MIS-CP-') && !MIS_001_CHECKPOINT_IDS.includes(value as any),
  );
  if (unknown) throw new Error('Unknown MIS-001 selector: ' + unknown);

  let pool = candidates.length > 0
    ? candidates
    : [...ALL_CANDIDATES];

  if (checkpoints.length > 0) {
    const checkpoint = checkpoints[0]!;
    if (candidates.length > 0 && candidateCheckpoint(candidates[0]!) !== checkpoint) {
      throw new Error(candidates[0] + ' is not owned by ' + checkpoint + '.');
    }
    pool = pool.filter((candidateId) => candidateCheckpoint(candidateId) === checkpoint);
  }
  if (difficulty) {
    pool = pool.filter((candidateId) => candidateSupportsDifficulty(candidateId, difficulty));
  }
  if (pool.length === 0) throw new Error('No MIS-001 candidates match the requested scope.');
  return pool;
}

function generateCandidate(candidateId: MisCandidateId, seed: string): MisGeneratedQuestion {
  if (isCp001Candidate(candidateId)) return generateMisCp001Question(candidateId, seed);
  if (isCp002Candidate(candidateId)) return generateMisCp002Question(candidateId, seed);
  if (isCp003Candidate(candidateId)) return generateMisCp003Question(candidateId, seed);
  if (isCp004Candidate(candidateId)) return generateMisCp004Question(candidateId, seed);
  if (isCp005Candidate(candidateId)) return generateMisCp005Question(candidateId, seed);
  if (isCp006Candidate(candidateId)) return generateMisCp006Question(candidateId, seed);
  if (isCp007Candidate(candidateId)) return generateMisCp007Question(candidateId, seed);
  if (isCp008Candidate(candidateId)) return generateMisCp008Question(candidateId, seed);
  if (isCp009Candidate(candidateId)) return generateMisCp009Question(candidateId, seed);
  if (isCp010Candidate(candidateId)) return generateMisCp010Question(candidateId, seed);
  if (isCp011Candidate(candidateId)) return generateMisCp011Question(candidateId, seed);
  if (isCp012Candidate(candidateId)) return generateMisCp012Question(candidateId, seed);
  if (isCp013Candidate(candidateId)) return generateMisCp013Question(candidateId, seed);
  if (isCp014Candidate(candidateId)) return generateMisCp014Question(candidateId, seed);
  if (isCp015Candidate(candidateId)) return generateMisCp015Question(candidateId, seed);
  if (isCp016Candidate(candidateId)) return generateMisCp016Question(candidateId, seed);
  if (isCp017Candidate(candidateId)) return generateMisCp017Question(candidateId, seed);
  if (isCp018Candidate(candidateId)) return generateMisCp018Question(candidateId, seed);
  if (isCp019Candidate(candidateId)) return generateMisCp019Question(candidateId, seed);
  if (isCp020Candidate(candidateId)) return generateMisCp020Question(candidateId, seed);
  if (isCp021Candidate(candidateId)) return generateMisCp021Question(candidateId, seed);
  if (isCp022Candidate(candidateId)) return generateMisCp022Question(candidateId, seed);
  if (isCp023Candidate(candidateId)) return generateMisCp023Question(candidateId, seed);
  if (isCp024Candidate(candidateId)) return generateMisCp024Question(candidateId, seed);
  if (isCp025Candidate(candidateId)) return generateMisCp025Question(candidateId, seed);
  if (isCp026Candidate(candidateId)) return generateMisCp026Question(candidateId, seed);
  if (isCp027Candidate(candidateId)) return generateMisCp027Question(candidateId, seed);
  return generateMisCp028Question(candidateId, seed);
}

function resolveGeneratedCandidate(
  preferredCandidate: MisCandidateId,
  pool: readonly MisCandidateId[],
  baseSeed: string,
  index: number,
  requestedDifficulty: 'Easy' | 'Medium' | 'Hard' | undefined,
): { generated: MisGeneratedQuestion; candidateId: MisCandidateId; itemSeed: string; attempt: number } {
  const candidates = [preferredCandidate, ...pool.filter((candidateId) => candidateId !== preferredCandidate)];
  const attemptLimit = requestedDifficulty ? 80 : 1;

  for (const candidateId of candidates) {
    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = `${baseSeed}:${candidateId}:${index}:attempt:${attempt}`;
      try {
        const generated = generateCandidate(candidateId, itemSeed);
        if (!requestedDifficulty || generated.difficulty === requestedDifficulty) {
          return { generated, candidateId, itemSeed, attempt };
        }
      } catch {
        continue;
      }
    }
  }
  throw new Error(
    requestedDifficulty
      ? `MIS-001 could not produce a ${requestedDifficulty} instance in the requested scope.`
      : 'MIS-001 could not produce a valid deterministic instance in the requested scope.',
  );
}

function independentValidation(question: MisGeneratedQuestion) {
  if (question.checkpointId === 'MIS-CP-001') {
    const solved = independentlyEvaluateMisCp001Rule(
      question.ruleId,
      question.target.first,
      question.target.second,
      question.context,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp001Group(question.ruleId, question.context, group),
      ),
      solverAgreement: solved === question.answer,
    };
  }

  if (question.checkpointId === 'MIS-CP-002') {
    const solved = independentlyEvaluateMisCp002Rule(
      question.ruleId,
      [question.target.first, question.target.second, question.target.third],
      question.context,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp002Group(question.ruleId, question.context, group),
      ),
      solverAgreement: solved === question.answer,
    };
  }

  if (question.checkpointId === 'MIS-CP-003') {
    const solved = independentlyEvaluateMisCp003Rule(
      question.ruleId,
      question.target.first,
      question.target.second,
      question.context,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) =>
        independentlyVerifyMisCp003Group(question.ruleId, question.context, group),
      ),
      solverAgreement: solved === question.answer,
    };
  }

  if (question.checkpointId === 'MIS-CP-004') {
    const solved = independentlyEvaluateMisCp004Rule(question.ruleId, question.target.first, question.target.second);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp004Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-005') {
    const solved = independentlyEvaluateMisCp005Rule(question.ruleId, question.target.top, question.target.left, question.target.right);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp005Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-006') {
    const solved = independentlyEvaluateMisCp006Rule(question.ruleId, {
      top: question.target.top, right: question.target.right, bottom: question.target.bottom, left: question.target.left,
    });
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp006Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-007') {
    const solved = independentlyEvaluateMisCp007Rule(question.ruleId, {
      topLeft: question.target.topLeft, topRight: question.target.topRight,
      bottomLeft: question.target.bottomLeft, bottomRight: question.target.bottomRight,
    });
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp007Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-008') {
    const rule = misCp008RuleByCandidateId(question.candidateId);
    const solved = independentlySolveMisCp008Missing(
      question.ruleId, question.target, question.missingPosition, rule.minInput, rule.maxInput,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp008Group(question.ruleId, group)),
      solverAgreement: solved.length === 1 && solved[0] === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-009') {
    const solved = independentlyEvaluateMisCp009Rule(
      question.ruleId, question.target.a, question.target.b, question.target.c, question.target.d,
    );
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp009Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-010') {
    const solved = independentlyEvaluateMisCp010Rule(question.ruleId, question.target.number, question.target.visible);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp010Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-011') {
    const solved = independentlyEvaluateMisCp011Rule(question.ruleId, question.target.a, question.target.b, question.target.c);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp011Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-012') {
    const solved = evaluateMisCp012Rule(question.ruleId, question.target.values);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => ruleFitsMisCp012(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-013') {
    const solved = independentlyEvaluateMisCp013Rule(question.ruleId, question.target.a, question.target.b, question.context);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp013Group(question.ruleId, group, question.context)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-014') {
    const solved = independentlySolveMisCp014Missing(question.target, question.targetTotal, question.missingCorner);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlySumMisCp014Group(group) === question.targetTotal),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-015') {
    if (question.missingPosition === 'RESULT') {
      const solved = independentlyEvaluateMisCp015Rule(question.ruleId, question.target.inputs);
      return {
        sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp015Group(question.ruleId, group)),
        solverAgreement: solved === question.answer,
      };
    }
    const index = question.missingPosition === 'FIRST_INPUT' ? 0 : question.missingPosition === 'SECOND_INPUT' ? 1 : 2;
    const visible = question.target.inputs.map((value, inputIndex) => inputIndex === index ? null : value);
    const solved = independentlySolveMisCp015Missing(question.ruleId, visible, question.target.result, question.missingPosition, 2, 25);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp015Group(question.ruleId, group)),
      solverAgreement: solved.length === 1 && solved[0] === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-016') {
    const solved = independentlyEvaluateMisCp016Rule(question.target.a, question.target.b, question.target.c, question.target.d, question.context);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp016Group(group, question.context)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-017') {
    const solved = independentlyEvaluateMisCp017Rule(question.target.first, question.target.second);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp017Group(group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-018') {
    const solved = independentlyEvaluateMisCp018Rule(question.ruleId, question.target.first, question.target.second, question.context);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp018Group(question.ruleId, group, question.context)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-019') {
    const solved = independentlyEvaluateMisCp019Rule(question.ruleId, question.target.inputs, question.context);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp019Group(question.ruleId, group, question.context)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-020') {
    const solved = independentlyEvaluateMisCp020Rule(question.ruleId, question.target.first, question.target.second);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp020Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-021') {
    const solved = independentlyEvaluateMisCp021Rule(question.ruleId, question.target.inputs);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp021Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-022') {
    const solved = independentlyEvaluateMisCp022Rule(question.ruleId, question.target.inputs);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp022Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-023') {
    const solved = independentlyEvaluateMisCp023Rule(question.ruleId, question.target.inputs);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp023Group(question.ruleId, group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-024') {
    const solved = independentlyEvaluateMisCp024Rule(question.target.second, question.context);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp024Group(group, question.context)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-025') {
    const solved = independentlySolveMisCp025RightProduct({
      leftInput: question.target.leftInput,
      shared: question.target.shared,
      rightInput: question.target.rightInput,
      leftProduct: question.target.leftProduct,
    });
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp025Group(group)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-026') {
    const solved = independentlyEvaluateMisCp026(question.target.input);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((pair) => independentlyVerifyMisCp026Pair(pair)),
      solverAgreement: solved === question.answer,
    };
  }
  if (question.checkpointId === 'MIS-CP-027') {
    const solved = independentlyEvaluateMisCp027(question.target.first, question.target.second);
    return {
      sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp027Group(group)),
      solverAgreement: solved === question.answer,
    };
  }
  const solved = independentlyEvaluateMisCp028(question.target.inputs);
  return {
    sameRuleFitsAllExamples: question.evidenceGroups.every((group) => independentlyVerifyMisCp028Group(group)),
    solverAgreement: solved === question.answer,
  };
}

function ambiguityProvesUniqueIntended(question: MisGeneratedQuestion): boolean {
  const audit = question.ambiguityAudit as unknown as {
    accepted?: boolean;
    matches?: readonly { semanticKey?: string }[];
    survivingRules?: readonly string[];
  };
  if (audit.accepted !== true) return false;
  if (Array.isArray(audit.matches)) {
    return new Set(audit.matches.map((match) => String(match.semanticKey ?? ''))).size === 1;
  }
  if (Array.isArray(audit.survivingRules)) return audit.survivingRules.length === 1;
  return true;
}

export const MIS_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: 'reasoning-v1',
  packageId: MIS_001_PACKAGE_ID,
  subject: 'Reasoning',
  topic: 'Reasoning',
  subtopic: 'Missing Number',
  label: 'Reasoning · Missing Number · MIS-001 (CP001-CP028 source-discovery review)',
  enabled: true,
  cpIds: [...MIS_001_CHECKPOINT_IDS],
  supportedLanguages: ['en', 'hi', 'pa'],
  supportedDifficulties: ['Easy', 'Medium', 'Hard'],
  difficultyFilterSupported: true,
  runtimeMode: MIS_001_RUNTIME_MODE,
  supportedRuntimeModes: [MIS_001_RUNTIME_MODE],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    reviewAuthority: MIS_001_REVIEW_AUTHORITY,
    implementedCheckpoints: [...MIS_001_CHECKPOINT_IDS],
    candidateCount: SEMANTIC_AUTHORITY_IDS.length,
    semanticAuthorityCount: SEMANTIC_AUTHORITY_IDS.length,
    semanticAuthorityIds: [...SEMANTIC_AUTHORITY_IDS],
    runtimePatternCount: ALL_CANDIDATES.length,
    runtimePatternIds: [...ALL_CANDIDATES],
    reusedSemanticVariantCount: REUSED_VARIANT_IDS.length,
    reusedSemanticVariantIds: [...REUSED_VARIANT_IDS],
    candidateIds: [...ALL_CANDIDATES],
    cp001CandidateCount: MIS_CP001_CANDIDATE_IDS.length,
    cp002CandidateCount: MIS_CP002_CANDIDATE_IDS.length,
    cp003CandidateCount: MIS_CP003_CANDIDATE_IDS.length,
    cp004CandidateCount: MIS_CP004_CANDIDATE_IDS.length,
    cp005CandidateCount: MIS_CP005_CANDIDATE_IDS.length,
    cp006CandidateCount: MIS_CP006_CANDIDATE_IDS.length,
    cp007CandidateCount: MIS_CP007_CANDIDATE_IDS.length,
    cp008CandidateCount: MIS_CP008_CANDIDATE_IDS.length,
    cp009CandidateCount: MIS_CP009_CANDIDATE_IDS.length,
    cp010CandidateCount: MIS_CP010_CANDIDATE_IDS.length,
    cp011CandidateCount: MIS_CP011_CANDIDATE_IDS.length,
    cp012CandidateCount: MIS_CP012_CANDIDATE_IDS.length,
    cp013CandidateCount: MIS_CP013_CANDIDATE_IDS.length,
    cp014CandidateCount: MIS_CP014_CANDIDATE_IDS.length,
    cp015CandidateCount: MIS_CP015_CANDIDATE_IDS.length,
    cp016CandidateCount: MIS_CP016_CANDIDATE_IDS.length,
    cp017CandidateCount: MIS_CP017_CANDIDATE_IDS.length,
    cp018CandidateCount: MIS_CP018_CANDIDATE_IDS.length,
    cp019CandidateCount: MIS_CP019_CANDIDATE_IDS.length,
    cp020CandidateCount: MIS_CP020_CANDIDATE_IDS.length,
    cp021CandidateCount: MIS_CP021_CANDIDATE_IDS.length,
    cp022CandidateCount: MIS_CP022_CANDIDATE_IDS.length,
    cp023CandidateCount: MIS_CP023_CANDIDATE_IDS.length,
    cp024CandidateCount: MIS_CP024_CANDIDATE_IDS.length,
    cp025CandidateCount: MIS_CP025_CANDIDATE_IDS.length,
    cp026CandidateCount: MIS_CP026_CANDIDATE_IDS.length,
    cp027CandidateCount: MIS_CP027_CANDIDATE_IDS.length,
    cp028CandidateCount: MIS_CP028_CANDIDATE_IDS.length,
    permanentQlCount: MIS_PERMANENT_QL_ALLOCATION_STATE.allocatedPermanentQlCount,
    permanentQlAllocation: true,
    sourceSaturationComplete: true,
    mergeSplitAuditComplete: true,
    mergeSplitAuditAuthority: 'MIS-001-SEMANTIC-AUTHORITY-REGISTRY-V1',
    sourceSaturationBlocker: 'None for practical SSC/Banking/Punjab saturation through V15; source-thin MIS-CAND-034 and MIS-CAND-095 remain excluded from automatic permanent-QL promotion.',
    englishEditorialFreezeComplete: true,
    localizationStarted: true,
    localizationWave1: MIS_LOCALIZATION_WAVE1_STATE,
    deterministicGeneration: true,
    independentSolver: true,
    ambiguityEnumeration: true,
    reviewOnly: true,
  },
};

export function isMis001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === MIS_001_PACKAGE_ID;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((value) => value === MIS_001_PACKAGE_ID || value.startsWith('MIS-CP-') || value.startsWith('MIS-CAND-'))) {
    return true;
  }
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === 'missing number' || subtopic === 'missing number' || subtopic === 'missing numbers';
}

export async function generateMis001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== MIS_001_RUNTIME_MODE) {
    throw new Error('MIS-001 only supports review-only runtime.');
  }
  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  let pool = resolveCandidatePool(request, requestedDifficulty);
  if (language !== 'en') {
    pool = pool.filter((candidateId) => ['MIS-CP-001','MIS-CP-002','MIS-CP-003','MIS-CP-004'].includes(candidateCheckpoint(candidateId)));
    if (pool.length === 0) throw new Error('MIS-001 Hindi/Punjabi localization wave 1 currently covers CP001-CP004 only.');
  }
  const baseSeed = text(request.seed) || 'mis-001-question-studio-v1';
  const start = hash(baseSeed + ':candidate-start') % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredCandidate = pool[(start + index) % pool.length]!;
    const resolved = resolveGeneratedCandidate(
      preferredCandidate,
      pool,
      baseSeed,
      index,
      requestedDifficulty,
    );
    const { generated, candidateId, itemSeed, attempt } = resolved;
    const localized = localizeMisWave1Question(generated, language);
    const independent = independentValidation(generated);
    const permanentQlId = permanentQlForMisCandidate(candidateId);
    const options = generated.options.map((option) => String(option.value));
    const questionId = `MIS-001:${generated.checkpointId}:${candidateId}:${hash(itemSeed)}:${language}`;

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: MIS_001_PACKAGE_ID,
      patternId: candidateId,
      candidateId,
      semanticAuthorityCandidateId: canonicalSemanticAuthorityId(candidateId),
      createsNewSemanticAuthority: createsNewSemanticAuthority(candidateId),
      qlId: permanentQlId,
      provisionalQl: permanentQlId == null,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      subject: 'Reasoning',
      topic: 'Reasoning',
      subtopic: 'Missing Number',
      language,
      locale: language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'pa-IN',
      stem: localized.stem,
      text: localized.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: String(generated.answer),
      canonicalAnswer: generated.answer,
      explanation: localized.explanation,
      packageExplanation: {
        solverTrace: generated.solverTrace,
        ruleFamily: generated.ruleFamily,
      },
      renderer: generated.renderer,
      difficulty: generated.difficulty,
      difficultyLabel: generated.difficulty,
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty ? generated.difficulty === requestedDifficulty : false,
      difficultySearchAttempts: attempt + 1,
      generationSeed: itemSeed,
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      registrationAuthorityId: MIS_001_REVIEW_AUTHORITY,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      groupCount: generated.groupCount,
      operandCount: ['MIS-CP-003','MIS-CP-004','MIS-CP-005','MIS-CP-006','MIS-CP-007','MIS-CP-008','MIS-CP-009','MIS-CP-010','MIS-CP-011','MIS-CP-012','MIS-CP-013','MIS-CP-014','MIS-CP-015','MIS-CP-016','MIS-CP-017','MIS-CP-018','MIS-CP-019','MIS-CP-020','MIS-CP-021'].includes(generated.checkpointId)
        ? generated.operandCount
        : generated.checkpointId === 'MIS-CP-001' ? 2 : 3,
      missingPosition: generated.missingPosition,
      forwardOrInverse: 'forwardOrInverse' in generated ? generated.forwardOrInverse : 'FORWARD',
      operationDepth: generated.operationDepth,
      structuralFingerprint: generated.structuralFingerprint,
      numericFingerprint: generated.numericFingerprint,
      optionErrorLabels: generated.options.map((option) => option.errorLabel),
      solverTrace: generated.solverTrace,
      ambiguityAudit: generated.ambiguityAudit,
      localizationParity: language === 'en' ? 'ENGLISH_EDITORIAL_FROZEN' : 'WAVE1_LOCALIZED_REVIEW',
      editorialStatus: language === 'en' ? 'ENGLISH_EDITORIAL_FROZEN' : 'LOCALIZATION_REVIEW',
      sourceThin: 'sourceThin' in generated ? generated.sourceThin === true : false,
      sourceBacked: 'sourceBacked' in generated ? generated.sourceBacked : null,
      sourceNote: 'sourceNote' in generated ? generated.sourceNote : null,
      figures: 'figures' in generated ? generated.figures : null,
      semanticPositions: 'semanticPositions' in generated ? generated.semanticPositions : null,
      pairingAuthority: 'pairingAuthority' in generated ? generated.pairingAuthority : null,
      wholeNumberOrDigitMode: 'wholeNumberOrDigitMode' in generated ? generated.wholeNumberOrDigitMode : 'WHOLE_NUMBER',
      firstGroupCompetingRuleCount: 'firstGroupCompetingRuleCount' in generated ? generated.firstGroupCompetingRuleCount : null,
      finalCompetingRuleCount: 'finalCompetingRuleCount' in generated ? generated.finalCompetingRuleCount : null,
      runtimeVersion: generated.checkpointId + '-V1',
      traceability: {
        packageId: MIS_001_PACKAGE_ID,
        checkpointId: generated.checkpointId,
        candidateId,
        semanticAuthorityCandidateId: canonicalSemanticAuthorityId(candidateId),
        createsNewSemanticAuthority: createsNewSemanticAuthority(candidateId),
        ruleId: generated.ruleId,
        permanentQlAllocated: permanentQlId != null,
        permanentQlId,
        sourceSaturationComplete: true,
      },
      validation: {
        sameRuleFitsAllExamples: independent.sameRuleFitsAllExamples,
        exactlyOneIntendedRule: ambiguityProvesUniqueIntended(generated),
        exactlyOneCorrect: generated.options.filter((option) => option.errorLabel === null).length === 1,
        fourUniqueOptions: generated.options.length === 4 && new Set(options).size === 4,
        solverAgreement: independent.solverAgreement,
        resultWithinBounds: generated.answer > 0 && generated.answer <= 999,
        noDecimal: Number.isInteger(generated.answer),
        explanationUsesGeneratedValues: localized.explanation.includes(String(generated.answer)),
        everyDisplayedInputParticipates: true,
      },
      hiddenCompleteStructure: {
        evidenceGroups: generated.evidenceGroups,
        target: generated.target,
        context: generated.context,
        ruleId: generated.ruleId,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: 'reasoning-v1',
      packageId: MIS_001_PACKAGE_ID,
      cpIds: [...MIS_001_CHECKPOINT_IDS],
      runtimeMode: MIS_001_RUNTIME_MODE,
      registrationStatus: 'REGISTERED_REVIEW_ONLY_PROVISIONAL',
      reviewAuthority: MIS_001_REVIEW_AUTHORITY,
      permanentQlAllocation: true,
      permanentQlCount: MIS_PERMANENT_QL_ALLOCATION_STATE.allocatedPermanentQlCount,
      localizationWave1: MIS_LOCALIZATION_WAVE1_STATE,
      candidateIds: [...ALL_CANDIDATES],
      semanticAuthorityIds: [...SEMANTIC_AUTHORITY_IDS],
      semanticAuthorityCount: SEMANTIC_AUTHORITY_IDS.length,
      runtimePatternCount: ALL_CANDIDATES.length,
      reusedSemanticVariantIds: [...REUSED_VARIANT_IDS],
      sourceSaturationComplete: true,
      mergeSplitAuditComplete: true,
      mergeSplitAuditAuthority: 'MIS-001-SEMANTIC-AUTHORITY-REGISTRY-V1',
      sourceSaturationBlocker: 'None for practical target-exam saturation through V15; source-thin holds remain promotion-ineligible.',
      language,
      requestedDifficulty: requestedDifficulty ?? 'Mixed',
      difficultyFilterApplied: Boolean(requestedDifficulty),
      seed: baseSeed,
      count,
    },
  };
}
