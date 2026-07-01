import type {
  EEV2DetailMode,
  EEV2Visibility,
  ExplanationPlan,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION = "1.0.0" as const;
interface PunjabiRoleAsset { sentenceTemplate: string; mathTemplate?: string }
type PunjabiAssets = Readonly<Record<EEV2DetailMode, Readonly<
  Record<PercentOfKnownNumberRoleKind, PunjabiRoleAsset>
>>>;
const math = {
  single: "1\\% = {{knownQuantity}} \\div {{knownUnitCount}} = {{singleUnitValue}}",
  target: "{{targetUnitCount}}\\% = {{singleUnitValue}} \\times {{targetUnitCount}} = {{targetQuantity}}",
  verify: "{{singleUnitValue}} \\times {{knownUnitCount}} = {{knownQuantity}}",
};
export const PERCENT_OF_KNOWN_NUMBER_PUNJABI_ASSETS: PunjabiAssets = {
  short: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "{{knownUnitCount}}% ਦਾ ਮੁੱਲ {{knownQuantity}} ਹੈ।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownUnitCount}} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕਾਂ ਦਾ ਮੁੱਲ {{knownQuantity}} ਹੈ।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "ਪਹਿਲਾਂ 1% ਦਾ ਮੁੱਲ ਕੱਢੋ।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "ਸਾਨੂੰ {{targetUnitCount}}% ਦਾ ਮੁੱਲ ਚਾਹੀਦਾ ਹੈ।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "1% ਦੇ ਮੁੱਲ ਨੂੰ {{targetUnitCount}} ਨਾਲ ਗੁਣਾ ਕਰੋ।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "ਇਸ ਲਈ {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਜਾਂਚ ਕਰੋ।", mathTemplate: math.verify },
  },
  standard: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "ਸੰਖਿਆ ਦਾ {{knownUnitCount}}% ਮੁੱਲ {{knownQuantity}} ਹੈ।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownUnitCount}} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕਾਂ ਦਾ ਮੁੱਲ {{knownQuantity}} ਹੈ।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "1% ਦਾ ਮੁੱਲ ਕੱਢਣ ਲਈ {{knownQuantity}} ਨੂੰ {{knownUnitCount}} ਨਾਲ ਭਾਗ ਦਿਓ।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "ਸਵਾਲ ਵਿੱਚ ਉਸੇ ਸੰਖਿਆ ਦਾ {{targetUnitCount}}% ਪੁੱਛਿਆ ਗਿਆ ਹੈ।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "1% ਦੇ ਮੁੱਲ ਨੂੰ {{targetUnitCount}} ਨਾਲ ਗੁਣਾ ਕਰੋ।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "ਇਸ ਲਈ {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "1% ਦੇ ਮੁੱਲ ਨੂੰ {{knownUnitCount}} ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਦਿੱਤਾ ਮੁੱਲ ਵਾਪਸ ਮਿਲਦਾ ਹੈ।", mathTemplate: math.verify },
  },
  detailed: {
    RELATIONSHIP_CONTEXT: { sentenceTemplate: "ਸੰਖਿਆ ਦਾ {{knownUnitCount}}% ਮੁੱਲ {{knownQuantity}} ਹੈ।" },
    KNOWN_UNIT_MAPPING: { sentenceTemplate: "{{knownQuantity}} ਦਾ ਮੁੱਲ {{knownUnitCount}} ਬਰਾਬਰ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕਾਂ ਵਿੱਚ ਵੰਡਿਆ ਹੋਇਆ ਹੈ।" },
    SINGLE_UNIT_DERIVATION: { sentenceTemplate: "ਇੱਕ ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਦਾ ਮੁੱਲ ਕੱਢਣ ਲਈ ਦਿੱਤੇ ਮੁੱਲ ਨੂੰ {{knownUnitCount}} ਨਾਲ ਭਾਗ ਦਿਓ।", mathTemplate: math.single },
    TARGET_UNIT_IDENTIFICATION: { sentenceTemplate: "ਲੋੜੀਂਦਾ ਮੁੱਲ {{targetUnitCount}} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕਾਂ ਦੇ ਬਰਾਬਰ ਹੈ।" },
    TARGET_SCALE_DERIVATION: { sentenceTemplate: "ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢਣ ਲਈ 1% ਦੇ ਮੁੱਲ ਨੂੰ {{targetUnitCount}} ਨਾਲ ਗੁਣਾ ਕਰੋ।", mathTemplate: math.target },
    ANSWER_INTERPRETATION: { sentenceTemplate: "ਇਸ ਲਈ {{answerInterpretation}}।" },
    VERIFICATION: { sentenceTemplate: "1% ਦੇ ਮੁੱਲ ਨੂੰ {{knownUnitCount}} ਤੱਕ ਵਧਾਉਣ ਤੇ ਦਿੱਤਾ ਮੁੱਲ ਫਿਰ ਮਿਲ ਜਾਂਦਾ ਹੈ।", mathTemplate: math.verify },
  },
};
export interface RenderedPunjabiRoleContent {
  roleId: string; roleKind: PercentOfKnownNumberRoleKind; locale: "pa";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION;
  visibility: EEV2Visibility; sentence: string; math?: string;
}
export interface RenderedPunjabiRoleSet {
  planId: string; planVersion: string; methodFamily: string;
  detailMode: EEV2DetailMode; locale: "pa";
  languageFamilyVersion: typeof PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION;
  roles: readonly RenderedPunjabiRoleContent[];
}
const SOURCES = {
  knownUnitCount: "rate1", knownQuantity: "value1", targetUnitCount: "rate2",
  singleUnitValue: "singleUnitValue", targetQuantity: "targetQuantity",
} as const;
const UNITS: Readonly<Record<string, string>> = {
  students: "ਵਿਦਿਆਰਥੀ", people: "ਲੋਕ", votes: "ਵੋਟਾਂ", rupees: "ਰੁਪਏ",
  kilograms: "ਕਿਲੋਗ੍ਰਾਮ", litres: "ਲੀਟਰ",
};
type Slot = keyof typeof SOURCES;
type Slots = Record<Slot | "answerInterpretation", string>;
function slots(trace: TutorThinkingTrace): Slots {
  const values = new Map(trace.valueRefs.map((ref) => [ref.sourceKey, ref.value]));
  const result = {} as Record<Slot, string>;
  for (const [slot, source] of Object.entries(SOURCES) as [Slot, string][]) {
    const value = values.get(source);
    if (value === undefined) throw new Error(`ਪੰਜਾਬੀ ਮੁੱਲ ਉਪਲਬਧ ਨਹੀਂ ਹੈ: ${source}`);
    result[slot] = String(value);
  }
  const unit = trace.unitRefs.find((ref) => ref.refId === "unit:quantity")?.semanticUnit;
  if (!unit) throw new Error("ਪੰਜਾਬੀ ਇਕਾਈ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।");
  if (unit !== "abstract-number" && !UNITS[unit]) throw new Error(`ਪੰਜਾਬੀ ਇਕਾਈ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ: ${unit}`);
  return {
    ...result,
    answerInterpretation: unit === "abstract-number"
      ? `ਲੋੜੀਂਦਾ ਮੁੱਲ ${result.targetQuantity} ਹੈ`
      : `ਲੋੜੀਂਦੀ ਮਾਤਰਾ ${result.targetQuantity} ${UNITS[unit]} ਹੈ`,
  };
}
function bind(template: string, values: Slots): string {
  return template.replace(/\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g, (_match, name: string) => {
    if (!Object.hasOwn(values, name)) throw new Error(`ਪੰਜਾਬੀ ਥਾਂ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ: ${name}`);
    return values[name as keyof Slots];
  });
}
export function renderPercentOfKnownNumberPunjabi(
  plan: ExplanationPlan,
  trace: TutorThinkingTrace,
): RenderedPunjabiRoleSet {
  if (plan.methodFamily !== "UNIT_VALUE") throw new Error(`ਅਸਮਰਥਿਤ ਵਿਧੀ ਪਰਿਵਾਰ: ${plan.methodFamily}`);
  if (trace.taskKind !== "percentOfKnownNumber") throw new Error(`ਅਸਮਰਥਿਤ ਸਵਾਲ ਕਿਸਮ: ${trace.taskKind}`);
  const values = slots(trace);
  const assets = PERCENT_OF_KNOWN_NUMBER_PUNJABI_ASSETS[plan.detailMode];
  return {
    planId: plan.planId, planVersion: plan.planVersion,
    methodFamily: plan.methodFamily, detailMode: plan.detailMode,
    locale: "pa", languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION,
    roles: plan.roles.map((role) => {
      const roleKind = role.roleKind as PercentOfKnownNumberRoleKind;
      const asset = assets[roleKind];
      if (!asset) throw new Error(`ਪੰਜਾਬੀ ਭੂਮਿਕਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ: ${role.roleKind}`);
      return {
        roleId: role.roleId, roleKind, locale: "pa" as const,
        languageFamilyVersion: PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION,
        visibility: role.visibility, sentence: bind(asset.sentenceTemplate, values),
        math: asset.mathTemplate ? bind(asset.mathTemplate, values) : undefined,
      };
    }),
  };
}

