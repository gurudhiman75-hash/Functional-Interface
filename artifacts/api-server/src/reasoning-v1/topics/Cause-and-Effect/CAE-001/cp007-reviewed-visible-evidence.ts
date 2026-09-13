import { CP007_FALSE_CAUSATION_WORLDS, generateCp007FalseCausationQuestion } from "./cp007-false-causation.ts";
import type { CaeLocale, GeneratedCaeQuestion } from "./types.ts";

const CONTEXT_LABEL: Readonly<Record<CaeLocale, string>> = {
  "en-IN": "Additional information:",
  "hi-IN": "अतिरिक्त जानकारी:",
  "pa-IN": "ਵਾਧੂ ਜਾਣਕਾਰੀ:",
};

/**
 * Human-review hardening for CP007.
 *
 * The base false-causation authority owns the parallel causal graph. This
 * reviewed projection keeps that graph/answer intact but exposes the two
 * independent causal facts that the explanation relies on. A learner must
 * never be asked to distinguish "common cause" from "mere association" by
 * using evidence that exists only in hidden metadata.
 */
export function generateReviewedCp007FalseCausationQuestion(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  const base = generateCp007FalseCausationQuestion(input);
  const world = CP007_FALSE_CAUSATION_WORLDS.find((entry) => entry.id === base.causalWorldId);
  if (!world) throw new Error(`${base.causalWorldId}: reviewed CP007 world is missing`);

  const visibleEffects = base.visibleContext.visibleNodeIds.map((id) => {
    const node = world.nodes.find((entry) => entry.id === id);
    if (!node) throw new Error(`${base.causalStateId}: visible CP007 node '${id}' is missing`);
    return node;
  });

  const evidenceCauses = visibleEffects.map((effect) => {
    const incoming = world.edges.find((edge) => edge.to === effect.id);
    if (!incoming) throw new Error(`${base.causalStateId}: visible CP007 effect '${effect.id}' has no supported cause`);
    const cause = world.nodes.find((node) => node.id === incoming.from);
    if (!cause) throw new Error(`${base.causalStateId}: CP007 cause '${incoming.from}' is missing`);
    return cause;
  });

  const allVisibleNodeIds = [
    visibleEffects[0]!.id,
    visibleEffects[1]!.id,
    evidenceCauses[0]!.id,
    evidenceCauses[1]!.id,
  ] as const;
  const causalStateId = `${base.causalStateId}|evidence:independent-causes-visible`;
  const itemVariantId = `${causalStateId}|presentation:${base.optionMetadata.map((option) => option.id).join(">")}`;
  const stem = `${base.stem}\n\n${CONTEXT_LABEL[input.locale]}\n${evidenceCauses[0]!.text[input.locale]}\n${evidenceCauses[1]!.text[input.locale]}`;

  return Object.freeze({
    ...base,
    causalStateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    visibleContext: {
      ...base.visibleContext,
      visibleNodeIds: allVisibleNodeIds,
      hiddenNodeIds: [],
    },
    stem,
    causalTrace: [evidenceCauses[0]!.id, visibleEffects[0]!.id, evidenceCauses[1]!.id, visibleEffects[1]!.id],
  });
}
