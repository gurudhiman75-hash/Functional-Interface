import type {
  EEV2DetailMode,
  EEV2Visibility,
} from "../../../../../../../common/eev2/contracts";
import {
  PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
  type PercentOfKnownNumberRoleKind,
} from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_LANGUAGE_PARITY_VERSION = "1.0.0" as const;
export interface ParityRenderedRole {
  roleId: string;
  roleKind: PercentOfKnownNumberRoleKind;
  visibility: EEV2Visibility;
  sentence: string;
  math?: string;
}
export interface ParityRenderedRoleSet {
  planId: string;
  planVersion: string;
  methodFamily: string;
  detailMode: EEV2DetailMode;
  locale: "en" | "hi" | "pa";
  roles: readonly ParityRenderedRole[];
}
export interface LanguageDensityMetric {
  locale: "en" | "hi" | "pa";
  visibleSentenceCount: number;
  visibleTokenCount: number;
  averageTokensPerVisibleRole: number;
}
export interface LanguageParityReport {
  parityVersion: typeof PERCENT_OF_KNOWN_NUMBER_LANGUAGE_PARITY_VERSION;
  passed: boolean;
  failures: readonly string[];
  density: readonly LanguageDensityMetric[];
}
function visible(set: ParityRenderedRoleSet) {
  return set.roles.filter((role) => role.visibility.state !== "hidden");
}
function sentenceCount(sentence: string): number {
  return (sentence.match(/[.!?।](?:\s|$)/gu) ?? []).length;
}
function density(set: ParityRenderedRoleSet): LanguageDensityMetric {
  const roles = visible(set);
  const tokens = roles.reduce(
    (sum, role) => sum + role.sentence.trim().split(/\s+/u).filter(Boolean).length,
    0,
  );
  return {
    locale: set.locale,
    visibleSentenceCount: roles.reduce(
      (sum, role) => sum + sentenceCount(role.sentence),
      0,
    ),
    visibleTokenCount: tokens,
    averageTokensPerVisibleRole: roles.length === 0 ? 0 : tokens / roles.length,
  };
}
export function checkPercentOfKnownNumberLanguageParity(
  english: ParityRenderedRoleSet,
  hindi: ParityRenderedRoleSet,
  punjabi: ParityRenderedRoleSet,
): LanguageParityReport {
  const sets = [english, hindi, punjabi] as const;
  const failures: string[] = [];
  if (sets.map((set) => set.locale).join("|") !== "en|hi|pa") {
    failures.push("Locales must be supplied in English, Hindi, Punjabi order.");
  }
  for (const set of sets) {
    if (set.planId !== english.planId) failures.push(`${set.locale}: plan mismatch`);
    if (set.planVersion !== english.planVersion) failures.push(`${set.locale}: plan-version mismatch`);
    if (set.methodFamily !== english.methodFamily) failures.push(`${set.locale}: method-family mismatch`);
    if (set.detailMode !== english.detailMode) failures.push(`${set.locale}: detail-mode mismatch`);
    if (
      set.roles.map((role) => role.roleKind).join("|") !==
      PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS.join("|")
    ) failures.push(`${set.locale}: role coverage or ordering mismatch`);
  }
  for (let index = 0; index < english.roles.length; index += 1) {
    const reference = english.roles[index]!;
    for (const set of [hindi, punjabi]) {
      const role = set.roles[index];
      if (!role) continue;
      if (JSON.stringify(role.visibility) !== JSON.stringify(reference.visibility)) {
        failures.push(`${set.locale}:${reference.roleKind}: visibility mismatch`);
      }
      if ((role.math ?? null) !== (reference.math ?? null)) {
        failures.push(`${set.locale}:${reference.roleKind}: mathematical evidence mismatch`);
      }
      if (sentenceCount(role.sentence) !== 1) {
        failures.push(`${set.locale}:${reference.roleKind}: one sentence required`);
      }
    }
  }
  for (const set of sets) {
    const unit = set.roles.find((role) => role.roleKind === "SINGLE_UNIT_DERIVATION");
    const answer = set.roles.find((role) => role.roleKind === "ANSWER_INTERPRETATION");
    if (!unit || unit.visibility.state === "hidden" || !unit.math) {
      failures.push(`${set.locale}: one-unit derivation is not visible`);
    }
    if (!answer || answer.visibility.state === "hidden" || !answer.sentence.trim()) {
      failures.push(`${set.locale}: answer interpretation is not visible`);
    }
  }
  const metrics = sets.map(density);
  const counts = metrics.map((metric) => metric.visibleTokenCount);
  if (Math.min(...counts) === 0 || Math.max(...counts) / Math.min(...counts) > 1.75) {
    failures.push("Cognitive density differs materially across locales.");
  }
  if (new Set(metrics.map((metric) => metric.visibleSentenceCount)).size !== 1) {
    failures.push("Visible sentence counts differ across locales.");
  }
  return {
    parityVersion: PERCENT_OF_KNOWN_NUMBER_LANGUAGE_PARITY_VERSION,
    passed: failures.length === 0,
    failures,
    density: metrics,
  };
}

