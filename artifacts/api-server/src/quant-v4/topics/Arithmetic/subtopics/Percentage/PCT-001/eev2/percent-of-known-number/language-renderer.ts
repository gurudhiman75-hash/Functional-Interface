import type {
  EEV2Visibility,
  ExplanationPlan,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_ASSETS,
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
} from "./english-language-family";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export interface RenderedEnglishRoleContent {
  roleId: string;
  roleKind: PercentOfKnownNumberRoleKind;
  locale: "en";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION;
  visibility: EEV2Visibility;
  sentence: string;
  math?: string;
}

export interface RenderedEnglishRoleSet {
  planId: string;
  planVersion: string;
  methodFamily: string;
  detailMode: ExplanationPlan["detailMode"];
  locale: "en";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION;
  roles: readonly RenderedEnglishRoleContent[];
}

const VALUE_SLOT_SOURCES = {
  knownUnitCount: "rate1",
  knownQuantity: "value1",
  targetUnitCount: "rate2",
  singleUnitValue: "singleUnitValue",
  targetQuantity: "targetQuantity",
} as const;

type ValueSlotName = keyof typeof VALUE_SLOT_SOURCES;
type LanguageSlots = Record<ValueSlotName | "answerInterpretation", string>;

function requireValueSlots(trace: TutorThinkingTrace): LanguageSlots {
  const values = new Map(
    trace.valueRefs.map((reference) => [
      reference.sourceKey,
      reference.value,
    ]),
  );

  const slots = {} as Record<ValueSlotName, string>;
  for (const [slotName, sourceKey] of Object.entries(VALUE_SLOT_SOURCES) as [
    ValueSlotName,
    (typeof VALUE_SLOT_SOURCES)[ValueSlotName],
  ][]) {
    const value = values.get(sourceKey);
    if (value === undefined) {
      throw new Error(`Missing language value reference: ${sourceKey}`);
    }
    slots[slotName] = String(value);
  }

  const quantityUnit = trace.unitRefs.find(
    (reference) => reference.refId === "unit:quantity",
  )?.semanticUnit;
  if (!quantityUnit) {
    throw new Error("Missing language unit reference: unit:quantity");
  }

  return {
    ...slots,
    answerInterpretation:
      quantityUnit === "abstract-number"
        ? `the required value is ${slots.targetQuantity}`
        : `the required quantity is ${slots.targetQuantity} ${quantityUnit}`,
  };
}

function bindApprovedTemplate(
  template: string,
  slots: LanguageSlots,
): string {
  return template.replace(
    /\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g,
    (_match, slotName: string) => {
      if (!Object.hasOwn(slots, slotName)) {
        throw new Error(`Unsupported English language slot: ${slotName}`);
      }
      return slots[slotName as keyof LanguageSlots];
    },
  );
}

export function renderPercentOfKnownNumberEnglish(
  plan: ExplanationPlan,
  trace: TutorThinkingTrace,
): RenderedEnglishRoleSet {
  if (plan.methodFamily !== "UNIT_VALUE") {
    throw new Error(`Unsupported method family: ${plan.methodFamily}`);
  }
  if (trace.taskKind !== "percentOfKnownNumber") {
    throw new Error(`Unsupported task kind: ${trace.taskKind}`);
  }

  const slots = requireValueSlots(trace);
  const assets = PERCENT_OF_KNOWN_NUMBER_ENGLISH_ASSETS[plan.detailMode];
  const roles = plan.roles.map((role) => {
    if (!Object.hasOwn(assets, role.roleKind)) {
      throw new Error(`Missing English role asset: ${role.roleKind}`);
    }
    const roleKind = role.roleKind as PercentOfKnownNumberRoleKind;
    const asset = assets[roleKind];
    return {
      roleId: role.roleId,
      roleKind,
      locale: "en" as const,
      languageFamilyVersion:
        PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
      visibility: role.visibility,
      sentence: bindApprovedTemplate(asset.sentenceTemplate, slots),
      math: asset.mathTemplate
        ? bindApprovedTemplate(asset.mathTemplate, slots)
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
      PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
    roles,
  };
}
