import type {
  EEV2Visibility,
  ExplanationPlan,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_V2_ASSETS,
} from "./english-language-family.v2";
import {
  buildPercentOfKnownNumberRealismModel,
  realizeContextualRoleSentence,
  type PercentOfKnownNumberRealismContext,
  type PercentOfKnownNumberRealismValues,
} from "./context-realism";
import { renderPedagogicalIntent } from "./intent-renderer";
import { buildPercentOfKnownNumberPedagogicalIntent } from "./pedagogical-intent";
import { formatNumberForPresentation } from "./number-formatting";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export interface RenderedEnglishV2RoleContent {
  roleId: string;
  roleKind: PercentOfKnownNumberRoleKind;
  locale: "en";
  languageFamilyVersion:
    typeof PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION;
  visibility: EEV2Visibility;
  sentence: string;
  math?: string;
}

export interface RenderedEnglishV2RoleSet {
  planId: string;
  planVersion: string;
  methodFamily: string;
  detailMode: ExplanationPlan["detailMode"];
  locale: "en";
  languageFamilyVersion:
    typeof PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION;
  roles: readonly RenderedEnglishV2RoleContent[];
}

type ValueSlot =
  | "knownUnitCount"
  | "knownQuantity"
  | "targetUnitCount"
  | "singleUnitValue"
  | "targetQuantity";

type EnglishV2Slots = Record<
  | ValueSlot
  | "sharedContext"
  | "contextObject"
  | "knownQuantityDisplay"
  | "singleUnitValueDisplay"
  | "targetQuantityDisplay"
  | "knownQuantityMath"
  | "singleUnitValueMath"
  | "targetQuantityMath",
  string
>;

const SOURCES: Readonly<Record<ValueSlot, string>> = {
  knownUnitCount: "rate1",
  knownQuantity: "value1",
  targetUnitCount: "rate2",
  singleUnitValue: "singleUnitValue",
  targetQuantity: "targetQuantity",
};

const UNIT_LABELS: Readonly<Record<string, string>> = {
  students: "students",
  employees: "employees",
  books: "books",
  trees: "trees",
  animals: "animals",
  workers: "workers",
  families: "families",
  people: "people",
  votes: "votes",
};

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function formatNumber(value: number): {
  plain: string;
  approximate: boolean;
} {
  const formatted = formatNumberForPresentation(value);
  return {
    plain: formatted.grouped,
    approximate: formatted.approximate,
  };
}

function displayValue(
  value: number,
  semanticUnit: string,
): { display: string; math: string } {
  const formatted = formatNumber(value);
  const prefix = formatted.approximate ? "about " : "";
  const mathPrefix = formatted.approximate ? "\\approx " : "";
  if (semanticUnit === "rupees") {
    return {
      display: `${prefix}₹${formatted.plain}`,
      math: `${mathPrefix}\\text{₹}${formatted.plain}`,
    };
  }
  if (semanticUnit === "abstract-number") {
    return {
      display: `${prefix}${formatted.plain}`,
      math: `${mathPrefix}${formatted.plain}`,
    };
  }
  const label = UNIT_LABELS[semanticUnit] ?? semanticUnit;
  return {
    display: `${prefix}${formatted.plain} ${label}`,
    math: `${mathPrefix}${formatted.plain}\\text{ ${label}}`,
  };
}

function contextSlots(semanticUnit: string): {
  sharedContext: string;
  contextObject: string;
} {
  if (semanticUnit === "abstract-number") {
    return {
      sharedContext: "the same number",
      contextObject: "the number",
    };
  }
  if (semanticUnit === "rupees") {
    return {
      sharedContext: "the same amount",
      contextObject: "the amount",
    };
  }
  const label = UNIT_LABELS[semanticUnit] ?? semanticUnit;
  return {
    sharedContext: `the same group of ${label}`,
    contextObject: `the ${label}`,
  };
}

function requireSlots(
  trace: TutorThinkingTrace,
  realismContext?: Omit<PercentOfKnownNumberRealismContext, "semanticUnit">,
): {
  slots: EnglishV2Slots;
  realism?: ReturnType<typeof buildPercentOfKnownNumberRealismModel>;
  values: PercentOfKnownNumberRealismValues;
} {
  const refs = new Map(
    trace.valueRefs.map((reference) => [
      reference.sourceKey,
      reference.value,
    ]),
  );
  const numeric = {} as Record<ValueSlot, number>;
  for (const [slot, source] of Object.entries(SOURCES) as [
    ValueSlot,
    string,
  ][]) {
    const value = refs.get(source);
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Missing finite English v2 value: ${source}`);
    }
    numeric[slot] = value;
  }
  const semanticUnit = trace.unitRefs.find(
    (reference) => reference.refId === "unit:quantity",
  )?.semanticUnit;
  if (!semanticUnit) {
    throw new Error("Missing English v2 unit reference: unit:quantity");
  }
  const realism = realismContext
    ? buildPercentOfKnownNumberRealismModel(
        { ...realismContext, semanticUnit },
        numeric,
      )
    : undefined;
  const known =
    realism?.known ?? displayValue(numeric.knownQuantity, semanticUnit);
  const single =
    realism?.single ?? displayValue(numeric.singleUnitValue, semanticUnit);
  const target =
    realism?.targetMath ?? displayValue(numeric.targetQuantity, semanticUnit);
  return {
    values: numeric,
    realism,
    slots: {
    knownUnitCount: String(numeric.knownUnitCount),
    knownQuantity: String(numeric.knownQuantity),
    targetUnitCount: String(numeric.targetUnitCount),
    singleUnitValue: String(numeric.singleUnitValue),
    targetQuantity: String(numeric.targetQuantity),
    ...contextSlots(semanticUnit),
    knownQuantityDisplay: known.display,
    singleUnitValueDisplay: single.display,
    targetQuantityDisplay: target.display,
    knownQuantityMath: known.math,
    singleUnitValueMath: single.math,
    targetQuantityMath: target.math,
    },
  };
}

function bind(template: string, slots: EnglishV2Slots): string {
  return template.replace(
    /\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g,
    (_match, slot: string) => {
      if (!Object.hasOwn(slots, slot)) {
        throw new Error(`Unsupported English v2 slot: ${slot}`);
      }
      return slots[slot as keyof EnglishV2Slots];
    },
  );
}

export function renderPercentOfKnownNumberEnglishV2(
  plan: ExplanationPlan,
  trace: TutorThinkingTrace,
  realismContext?: Omit<PercentOfKnownNumberRealismContext, "semanticUnit">,
): RenderedEnglishV2RoleSet {
  if (plan.methodFamily !== "UNIT_VALUE") {
    throw new Error(`Unsupported method family: ${plan.methodFamily}`);
  }
  if (trace.taskKind !== "percentOfKnownNumber") {
    throw new Error(`Unsupported task kind: ${trace.taskKind}`);
  }
  const { slots, realism, values } = requireSlots(trace, realismContext);
  const intent = realism
    ? buildPercentOfKnownNumberPedagogicalIntent(values, realism)
    : undefined;
  const assets = PERCENT_OF_KNOWN_NUMBER_ENGLISH_V2_ASSETS[plan.detailMode];
  const roles = plan.roles.map((role) => {
    const roleKind = role.roleKind as PercentOfKnownNumberRoleKind;
    const asset = assets[roleKind];
    if (!asset) throw new Error(`Missing English v2 role: ${role.roleKind}`);
    const variant =
      stableHash(`${trace.traceId}|${plan.detailMode}|${roleKind}`) %
      asset.sentenceTemplates.length;
    const fallbackSentence = realism
      ? realizeContextualRoleSentence({
          traceId: trace.traceId,
          detailMode: plan.detailMode,
          roleKind,
          values,
          model: realism,
        })
      : bind(asset.sentenceTemplates[variant]!, slots);
    const intentRendered =
      realism && intent
        ? renderPedagogicalIntent({
            detailMode: plan.detailMode,
            roleKind,
            values,
            model: realism,
            intent,
            fallbackSentence,
          })
        : {
            sentence: fallbackSentence,
            suppressMath: false,
          };
    return {
      roleId: role.roleId,
      roleKind,
      locale: "en" as const,
      languageFamilyVersion:
        PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
      visibility: role.visibility,
      sentence: intentRendered.sentence,
      math:
        asset.mathTemplate && !intentRendered.suppressMath
          ? bind(asset.mathTemplate, slots)
          : undefined,
    };
  });
  return {
    planId: plan.planId,
    planVersion: plan.planVersion,
    methodFamily: plan.methodFamily,
    detailMode: plan.detailMode,
    locale: "en",
    languageFamilyVersion:
      PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
    roles,
  };
}
