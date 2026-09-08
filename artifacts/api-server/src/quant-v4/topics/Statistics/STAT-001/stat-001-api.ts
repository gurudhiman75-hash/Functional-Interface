import {
  generateSta001Question,
  STA001_CONTRACTS,
} from "./central-tendency";
import { independentlyVerifySta001Question } from "./independent-verifier";
import type {
  Sta001ContractId,
  Sta001Difficulty,
  Sta001ExamProfile,
  Sta001Explanation,
  Sta001Option,
  Sta001Question,
  Sta001SolveMode,
  Sta001State,
  Sta001ValidationCheck,
} from "./types";

/**
 * Canonical public API for Quant V4 Statistics package STAT-001.
 *
 * The original Phase-0 implementation used `Sta001*` internal identifiers
 * before the global namespace collision with Reasoning STA-001 was corrected.
 * Keep those internals stable for this review checkpoint, but expose only
 * unambiguous `Stat001*` names to new callers.
 */
export const STAT001_CONTRACTS = STA001_CONTRACTS;
export const generateStat001Question = generateSta001Question;
export const independentlyVerifyStat001Question = independentlyVerifySta001Question;

export type Stat001ExamProfile = Sta001ExamProfile;
export type Stat001ContractId = Sta001ContractId;
export type Stat001SolveMode = Sta001SolveMode;
export type Stat001Difficulty = Sta001Difficulty;
export type Stat001State = Sta001State;
export type Stat001Option = Sta001Option;
export type Stat001Explanation = Sta001Explanation;
export type Stat001ValidationCheck = Sta001ValidationCheck;
export type Stat001Question = Sta001Question;
