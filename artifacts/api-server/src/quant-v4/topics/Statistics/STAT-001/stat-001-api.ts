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
 * Collision-safe public API for Quant V4 Statistics package STAT-001.
 *
 * Historical Phase-0 internals keep the Sta001* compatibility names, while
 * all new integrations should use Stat001* / STAT001_* names so they cannot
 * be confused with Reasoning STA-001 (Statement & Assumption).
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
