import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, familyForCae001 } from "./causal-world-authorities.ts";
import { generateReviewedCp009Question as generateBaseReviewedCp009Question } from "./cp009-reviewed-polish.ts";
import type { CaeCandidateApplicability, CaeLocale, CaeRenderedOption, CaeSemanticCandidateAuthority, GeneratedCaeQuestion } from "./types.ts";

type TargetedCandidateMatch = Readonly<{
  event: CaeSemanticCandidateAuthority;
  applicability: CaeCandidateApplicability;
}>;

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function trim(value: string): string {
  return value.replace(/[.।]+$/u, "");
}

function targetedBridgeAlternative(
  base: GeneratedCaeQuestion,
  locale: CaeLocale,
  referenceNodeId: string,
  targetNodeId: string,
  seed: number,
  excludedTexts: readonly string[],
): TargetedCandidateMatch {
  const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === base.causalWorldId);
  if (!world) throw new Error(`${base.causalWorldId}: CP009 reviewed world not found.`);
  const family = familyForCae001(world.scenarioFamilyId);
  const variant = family.variants.find((entry) => entry.id === world.scenarioVariantId);
  if (!variant) throw new Error(`${world.id}: CP009 reviewed scenario variant not found.`);
  const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === "CAE-QL-009");
  if (!plan) throw new Error("CAE-QL-009: frozen projection authority not found.");
  const reference = world.nodes.find((node) => node.id === referenceNodeId);
  const target = world.nodes.find((node) => node.id === targetNodeId);
  if (!reference || !target) throw new Error(`${world.id}: CP009 reviewed connector nodes not found.`);

  const events = [
    ...variant.semanticCandidateEvents,
    ...variant.semanticBridgeCandidateEvents,
    ...variant.semanticEffectCandidateEvents,
  ];
  const eligible = events.flatMap((event): readonly TargetedCandidateMatch[] => {
    const applicability = event.applicability.find((rule) =>
      rule.applicableProjectionKinds.includes(plan.kind)
      && rule.eligibleTargetSemanticSlots.includes(target.semanticSlot)
      && rule.eligibleReferenceSemanticSlots.includes(reference.semanticSlot)
      && rule.eligibleRelations.includes("BRIDGE_TO_TARGET")
      && rule.editorialPlausibility === "CREDIBLE_ALTERNATIVE"
    );
    if (!applicability || excludedTexts.includes(event.text[locale])) return [];
    return [{ event, applicability }];
  });

  const unique = [...new Map(eligible.map((entry) => [entry.event.id, entry])).values()];
  if (unique.length === 0) {
    throw new Error(`${world.id}/${reference.semanticSlot}->${target.semanticSlot}: no exact target-specific credible bridge alternative.`);
  }
  return unique[mix32(seed) % unique.length]!;
}

function polishTargetedConnectorPairs(base: GeneratedCaeQuestion, locale: CaeLocale): GeneratedCaeQuestion {
  const mode = base.causalStructure.split(":")[1];
  if (mode !== "MISSING_PAIR" && mode !== "CONNECTOR_PAIR") return base;

  const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === base.causalWorldId);
  if (!world) throw new Error(`${base.causalWorldId}: CP009 reviewed world not found.`);
  if (base.causalTrace.length !== 4) throw new Error(`${base.causalStateId}: connector-pair review needs a four-event path.`);
  const [, firstConnectorId, secondConnectorId, targetId] = base.causalTrace;
  const text = (nodeId: string) => world.nodes.find((node) => node.id === nodeId)!.text[locale];
  const excludedTexts = base.causalTrace.map((nodeId) => text(nodeId));

  const afterFirst = targetedBridgeAlternative(
    base,
    locale,
    secondConnectorId!,
    targetId!,
    mix32((base.seed >>> 0) ^ 0x9a01),
    excludedTexts,
  );
  const beforeSecond = targetedBridgeAlternative(
    base,
    locale,
    firstConnectorId!,
    secondConnectorId!,
    mix32((base.seed >>> 0) ^ 0x9a02),
    [...excludedTexts, afterFirst.event.text[locale]],
  );

  const optionMetadata: readonly CaeRenderedOption[] = base.optionMetadata.map((option) => {
    if (!option.id.startsWith("NEAR_PAIR:")) return option;
    const after = option.id.endsWith(":AFTER_FIRST");
    const candidate = after ? afterFirst : beforeSecond;
    const side = after ? "AFTER_FIRST" : "BEFORE_SECOND";
    return {
      ...option,
      id: `NEAR_PAIR:TARGETED:${candidate.event.id}:${candidate.applicability.id}:${side}`,
      text: after
        ? `${trim(text(firstConnectorId!))} → ${trim(candidate.event.text[locale])}`
        : `${trim(candidate.event.text[locale])} → ${trim(text(secondConnectorId!))}`,
      distractorRole: candidate.event.mechanism,
    };
  });

  if (optionMetadata.filter((option) => option.id.startsWith("NEAR_PAIR:TARGETED:")).length !== 2) {
    throw new Error(`${base.causalStateId}: reviewed connector pair must contain two targeted near-miss alternatives.`);
  }
  if (new Set(optionMetadata.map((option) => option.text)).size !== 4) {
    throw new Error(`${base.causalStateId}: targeted connector-pair options must remain unique.`);
  }
  const correctIndex = optionMetadata.findIndex((option) => option.isCorrect);
  const itemVariantId = `${base.causalStateId}|surface:targeted-connector-pairs-v3|presentation:${optionMetadata.map((option) => option.id).join(">")}`;

  return Object.freeze({
    ...base,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    options: optionMetadata.map((option) => option.text),
    optionMetadata,
    correctIndex,
  });
}

/** Final reviewed CP009 surface: existing editorial polish plus exact scenario-targeted HARD pair distractors. */
export function generateReviewedCp009Question(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  return polishTargetedConnectorPairs(generateBaseReviewedCp009Question(input), input.locale);
}
