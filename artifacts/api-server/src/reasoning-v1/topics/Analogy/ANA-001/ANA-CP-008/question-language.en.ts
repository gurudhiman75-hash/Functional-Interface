import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  type ProvisionalEnglishPrototypeId,
} from "./provisional-language-templates.en";
import { provisionalMixedRuleById } from "./provisional-rule-definitions";

export type MixedPresentationMode = "DIRECT_COMPLETION" | "ODD_PAIR_SELECTION";

const TASK_TITLES: Readonly<Record<MixedPresentationMode, string>> = {
  DIRECT_COMPLETION: "direct completion",
  ODD_PAIR_SELECTION: "odd-pair selection",
};

export const ANA_CP008_QLS = ANA_CP008_ENGLISH_PROTOTYPES.flatMap(
  (prototype, familyIndex) =>
    (["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] as const).map((presentationMode, modeIndex) => {
      const qlNumber = 223 + familyIndex * 2 + modeIndex;
      const rule = provisionalMixedRuleById(prototype.ruleId);
      return {
        qlId: `ANA-QL-${String(qlNumber).padStart(3, "0")}`,
        cpId: "ANA-CP-008",
        title: `${prototype.title} — ${TASK_TITLES[presentationMode]}`,
        taskKind: presentationMode === "DIRECT_COMPLETION"
          ? "mixedAnalogyCompletion"
          : "mixedAnalogyOddPair",
        solveMode: prototype.solveContract,
        prototypeId: prototype.prototypeId,
        ruleId: prototype.ruleId,
        presentationMode: presentationMode as MixedPresentationMode,
        answerType: presentationMode === "DIRECT_COMPLETION"
          ? rule.outputKind
          : "MIXED_RELATION_PAIR",
        difficultyBand: rule.priority >= 3 || presentationMode === "ODD_PAIR_SELECTION"
          ? "MEDIUM_TO_HARD"
          : rule.priority === 2
            ? "MEDIUM"
            : "EASY_TO_MEDIUM",
        tokenOrderDecision: prototype.tokenOrderDecision,
        requiredDatasets: ["ana.cp008.mixed-foundation"] as const,
        requiredVariables: ["ruleContext", "sourceInput", "targetInput"] as const,
        distractorKinds: [
          "wrongRuleContext",
          "wrongLetterMovement",
          "wrongNumericOperation",
          "partialTransform",
          "tokenOrderError",
        ] as const,
        renderer: "STRUCTURED_TEXT",
        localeMode: "TRANSLATABLE_INSTRUCTIONS_LATIN_TOKENS",
        implementationCheckpoint: "ANA-CP-008",
        status: "IMPLEMENTED" as const,
      };
    }),
);

export type AnaCp008Ql = (typeof ANA_CP008_QLS)[number];

export function anaCp008QlById(qlId: string): AnaCp008Ql {
  const ql = ANA_CP008_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-008 QL: ${qlId}`);
  return ql;
}

export function anaCp008PrototypeById(
  prototypeId: ProvisionalEnglishPrototypeId,
) {
  const prototype = ANA_CP008_ENGLISH_PROTOTYPES.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!prototype) throw new Error(`Unknown ANA-CP-008 prototype: ${prototypeId}`);
  return prototype;
}
