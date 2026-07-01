import type {
  EEV2DetailMode,
  EEV2Visibility,
  ExplanationPlan,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION = "1.0.0" as const;
interface HindiRoleAsset { sentenceTemplate: string; mathTemplate?: string }
type HindiAssets = Readonly<Record<EEV2DetailMode, Readonly<
  Record<PercentOfKnownNumberRoleKind, HindiRoleAsset>
>>>;

const math = {
  single:
    "1\\% = {{knownQuantity}} \\div {{knownUnitCount}} = {{singleUnitValue}}",
  target:
    "{{targetUnitCount}}\\% = {{singleUnitValue}} \\times {{targetUnitCount}} = {{targetQuantity}}",
  verify:
    "{{singleUnitValue}} \\times {{knownUnitCount}} = {{knownQuantity}}",
};

export const PERCENT_OF_KNOWN_NUMBER_HINDI_ASSETS: HindiAssets = {
  short: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "{{knownUnitCount}}% का मान {{knownQuantity}} है।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownUnitCount}} प्रतिशत बिंदुओं का मान {{knownQuantity}} है।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "पहले 1% का मान निकालें।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "हमें {{targetUnitCount}}% का मान चाहिए।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "1% के मान को {{targetUnitCount}} से गुणा करें।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "अतः {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "दिए गए प्रतिशत से जाँच करें।", mathTemplate: math.verify },
  },
  standard: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "संख्या का {{knownUnitCount}}% मान {{knownQuantity}} है।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownUnitCount}} प्रतिशत बिंदुओं का मान {{knownQuantity}} है।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "1% का मान पाने के लिए {{knownQuantity}} को {{knownUnitCount}} से भाग दें।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "प्रश्न में उसी संख्या का {{targetUnitCount}}% पूछा गया है।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "1% के मान को {{targetUnitCount}} से गुणा करें।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "अतः {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "1% के मान को {{knownUnitCount}} से गुणा करने पर दिया गया मान वापस मिलता है।", mathTemplate: math.verify },
  },
  detailed: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "संख्या का {{knownUnitCount}}% मान {{knownQuantity}} है।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownQuantity}} का मान {{knownUnitCount}} समान प्रतिशत बिंदुओं में बँटा है।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "एक प्रतिशत बिंदु का मान पाने के लिए दिए गए मान को {{knownUnitCount}} से भाग दें।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "आवश्यक मान {{targetUnitCount}} प्रतिशत बिंदुओं के बराबर है।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "आवश्यक मान पाने के लिए 1% के मान को {{targetUnitCount}} से गुणा करें।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "अतः {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "1% के मान को {{knownUnitCount}} तक बढ़ाने पर दिया गया मान फिर मिल जाता है।", mathTemplate: math.verify },
  },
};

export interface RenderedHindiRoleContent {
  roleId: string;
  roleKind: PercentOfKnownNumberRoleKind;
  locale: "hi";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION;
  visibility: EEV2Visibility;
  sentence: string;
  math?: string;
}
export interface RenderedHindiRoleSet {
  planId: string;
  planVersion: string;
  methodFamily: string;
  detailMode: EEV2DetailMode;
  locale: "hi";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION;
  roles: readonly RenderedHindiRoleContent[];
}

const SOURCES = {
  knownUnitCount: "rate1",
  knownQuantity: "value1",
  targetUnitCount: "rate2",
  singleUnitValue: "singleUnitValue",
  targetQuantity: "targetQuantity",
} as const;
const UNITS: Readonly<Record<string, string>> = {
  students: "विद्यार्थी", people: "लोग", votes: "मत", rupees: "रुपये",
  kilograms: "किलोग्राम", litres: "लीटर",
};
type Slot = keyof typeof SOURCES;
type Slots = Record<Slot | "answerInterpretation", string>;

function slots(trace: TutorThinkingTrace): Slots {
  const values = new Map(trace.valueRefs.map((ref) => [ref.sourceKey, ref.value]));
  const result = {} as Record<Slot, string>;
  for (const [slot, source] of Object.entries(SOURCES) as [Slot, string][]) {
    const value = values.get(source);
    if (value === undefined) throw new Error(`हिंदी मान उपलब्ध नहीं है: ${source}`);
    result[slot] = String(value);
  }
  const unit = trace.unitRefs.find((ref) => ref.refId === "unit:quantity")?.semanticUnit;
  if (!unit) throw new Error("हिंदी इकाई उपलब्ध नहीं है।");
  if (unit !== "abstract-number" && !UNITS[unit]) {
    throw new Error(`हिंदी इकाई समर्थित नहीं है: ${unit}`);
  }
  return {
    ...result,
    answerInterpretation: unit === "abstract-number"
      ? `आवश्यक मान ${result.targetQuantity} है`
      : `आवश्यक मात्रा ${result.targetQuantity} ${UNITS[unit]} है`,
  };
}
function bind(template: string, values: Slots): string {
  return template.replace(/\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g, (_match, name: string) => {
    if (!Object.hasOwn(values, name)) throw new Error(`हिंदी स्थान समर्थित नहीं है: ${name}`);
    return values[name as keyof Slots];
  });
}

export function renderPercentOfKnownNumberHindi(
  plan: ExplanationPlan,
  trace: TutorThinkingTrace,
): RenderedHindiRoleSet {
  if (plan.methodFamily !== "UNIT_VALUE") throw new Error(`असमर्थित विधि परिवार: ${plan.methodFamily}`);
  if (trace.taskKind !== "percentOfKnownNumber") throw new Error(`असमर्थित प्रश्न प्रकार: ${trace.taskKind}`);
  const values = slots(trace);
  const assets = PERCENT_OF_KNOWN_NUMBER_HINDI_ASSETS[plan.detailMode];
  return {
    planId: plan.planId,
    planVersion: plan.planVersion,
    methodFamily: plan.methodFamily,
    detailMode: plan.detailMode,
    locale: "hi",
    languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION,
    roles: plan.roles.map((role) => {
      const roleKind = role.roleKind as PercentOfKnownNumberRoleKind;
      const asset = assets[roleKind];
      if (!asset) throw new Error(`हिंदी भूमिका उपलब्ध नहीं है: ${role.roleKind}`);
      return {
        roleId: role.roleId, roleKind, locale: "hi" as const,
        languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION,
        visibility: role.visibility,
        sentence: bind(asset.sentenceTemplate, values),
        math: asset.mathTemplate ? bind(asset.mathTemplate, values) : undefined,
      };
    }),
  };
}

