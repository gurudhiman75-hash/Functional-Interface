import { causalPath } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES, withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import type { CaeCausalWorld, CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

type Mode = "FIRST_BRIDGE" | "FINAL_BRIDGE";
const MODES: readonly Mode[] = ["FIRST_BRIDGE", "FINAL_BRIDGE"];
const CHAIN_FAMILY_IDS = new Set(
  [...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES]
    .filter((family) => family.topology === "DIRECT_CHAIN")
    .map((family) => family.id),
);

const COPY: Record<CaeLocale, Readonly<{ promptFirst: string; promptFinal: string; one: string; two: string; explainFirst: string; explainFinal: string }>> = {
  "en-IN": {
    promptFirst: "Which event best completes the causal chain immediately after Statement I?",
    promptFinal: "Which event is the immediate cause of Statement II in this causal chain?",
    one: "Statement I",
    two: "Statement II",
    explainFirst: "The correct event comes directly after Statement I. The other link shown later in the chain is not immediate.",
    explainFinal: "The correct event occurs directly before Statement II. Earlier events are remote causes, not the immediate cause.",
  },
  "hi-IN": {
    promptFirst: "कौन-सी घटना कथन I के तुरंत बाद कारणात्मक श्रृंखला को सही रूप से पूरा करती है?",
    promptFinal: "इस कारणात्मक श्रृंखला में कथन II का तात्कालिक कारण कौन-सी घटना है?",
    one: "कथन I",
    two: "कथन II",
    explainFirst: "सही घटना कथन I के तुरंत बाद आती है। श्रृंखला में बाद की घटना तात्कालिक नहीं है।",
    explainFinal: "सही घटना कथन II के ठीक पहले आती है। उससे पहले की घटनाएँ दूरस्थ कारण हैं, तात्कालिक कारण नहीं।",
  },
  "pa-IN": {
    promptFirst: "ਕਿਹੜੀ ਘਟਨਾ ਕਥਨ I ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਾਰਨਾਤਮਕ ਲੜੀ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਪੂਰਾ ਕਰਦੀ ਹੈ?",
    promptFinal: "ਇਸ ਕਾਰਨਾਤਮਕ ਲੜੀ ਵਿੱਚ ਕਥਨ II ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਕਿਹੜੀ ਘਟਨਾ ਹੈ?",
    one: "ਕਥਨ I",
    two: "ਕਥਨ II",
    explainFirst: "ਸਹੀ ਘਟਨਾ ਕਥਨ I ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਆਉਂਦੀ ਹੈ। ਲੜੀ ਵਿੱਚ ਬਾਅਦ ਵਾਲੀ ਘਟਨਾ ਤੁਰੰਤ ਨਹੀਂ ਹੈ।",
    explainFinal: "ਸਹੀ ਘਟਨਾ ਕਥਨ II ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ। ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਦੀਆਂ ਘਟਨਾਵਾਂ ਦੂਰਲੇ ਕਾਰਨ ਹਨ, ਤੁਰੰਤ ਕਾਰਨ ਨਹੀਂ।",
  },
};

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const out = [...values];
  let state = mix32(seed ^ 0x6b71d6);
  for (let index = out.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [out[index], out[swap]] = [out[swap]!, out[index]!];
  }
  return out;
}

function trim(value: string): string {
  return value.replace(/[.।]+$/u, "");
}

function path4(world: CaeCausalWorld): readonly string[] | null {
  const roots = world.nodes.filter((node) => !world.edges.some((edge) => edge.to === node.id));
  const leaves = world.nodes.filter((node) => !world.edges.some((edge) => edge.from === node.id));
  for (const root of roots) {
    for (const leaf of leaves) {
      const path = causalPath(world, root.id, leaf.id);
      if (path?.length === 4) return path;
    }
  }
  return null;
}

export function generateCp006BridgeDistanceQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  return withCae001SaturationWave2(() => {
    const worlds = CAE_001_CAUSAL_WORLDS.filter((world) => CHAIN_FAMILY_IDS.has(world.scenarioFamilyId) && path4(world));
    if (worlds.length === 0) throw new Error("CAE CP006 bridge-distance: no four-event chain worlds are available.");

    const selectionSeed = mix32((input.seed >>> 0) ^ 0x6b1d9e);
    const world = worlds[selectionSeed % worlds.length]!;
    const path = path4(world)!;
    const mode = MODES[mix32(selectionSeed ^ 0x61) % MODES.length]!;
    const targetIndex = mode === "FIRST_BRIDGE" ? 1 : 2;
    const correctNode = world.nodes.find((node) => node.id === path[targetIndex])!;
    const source = world.nodes.find((node) => node.id === path[0])!;
    const final = world.nodes.find((node) => node.id === path[3])!;

    const siblingCandidates = worlds
      .filter((candidate) => candidate.scenarioFamilyId === world.scenarioFamilyId && candidate.id !== world.id)
      .map((candidate) => {
        const candidatePath = path4(candidate)!;
        return candidate.nodes.find((node) => node.id === candidatePath[targetIndex])!;
      });
    if (siblingCandidates.length < 3) throw new Error(`${world.scenarioFamilyId}: CP006 bridge-distance needs three same-family distractors.`);

    const chosenDistractors = shuffled(siblingCandidates, selectionSeed ^ 0xd157).slice(0, 3);
    const rendered: readonly CaeRenderedOption[] = shuffled([
      { id: `CORRECT:${correctNode.semanticSlot}`, text: correctNode.text[input.locale], isCorrect: true },
      ...chosenDistractors.map((node, index) => ({
        id: `SAME_FAMILY_BRIDGE_${index + 1}`,
        text: node.text[input.locale],
        isCorrect: false,
        distractorRole: "INDIRECTNESS_CONFUSION" as const,
      })),
    ], selectionSeed ^ 0x0b71);
    const correctIndex = rendered.findIndex((option) => option.isCorrect);
    const copy = COPY[input.locale];
    const chainText = path.map((id) => trim(world.nodes.find((node) => node.id === id)!.text[input.locale])).join(" → ");
    const stateId = [
      "projection:CAE-PLAN-CAUSAL-DISTANCE",
      `family:${world.scenarioFamilyId}`,
      `variant:${world.scenarioVariantId}`,
      `operation:${mode}`,
      `missing:${correctNode.semanticSlot}`,
      "endpoints:cause>terminal",
    ].join("|");
    const itemVariantId = `${stateId}|profile:FOUR_WAY|presentation:${rendered.map((option) => option.id).join(">")}`;
    const evidence: CaeDifficultyEvidence = {
      causalDistance: 3,
      hiddenLinks: 2,
      topologyComplexity: 4,
      plausibleDistractors: 3,
      visibleEventCount: 2,
      inferenceBurden: mode === "FIRST_BRIDGE" ? 4 : 5,
      candidatePlausibilityBurden: 5,
      score: mode === "FIRST_BRIDGE" ? 17 : 18,
    };

    return Object.freeze({
      chapterId: "CAE-001",
      checkpointId: "CAE-CP-006",
      qlId: "CAE-QL-006",
      projectionId: "CAE-PLAN-CAUSAL-DISTANCE",
      scenarioFamilyId: world.scenarioFamilyId,
      scenarioVariantId: world.scenarioVariantId,
      causalStateId: stateId,
      itemVariantId,
      semanticInstanceId: itemVariantId,
      causalWorldId: world.id,
      causalStructure: `CAUSAL_DISTANCE:${mode}:cause>bridge>effect>terminal`,
      locale: input.locale,
      seed: input.seed,
      difficulty: "HARD",
      difficultyEvidence: evidence,
      questionProfile: "FOUR_WAY",
      visibleContext: { backdrop: world.backdrop?.[input.locale] ?? null, visibleNodeIds: [source.id, final.id], hiddenNodeIds: path.slice(1, 3) },
      stem: `${mode === "FIRST_BRIDGE" ? copy.promptFirst : copy.promptFinal}\n\n${copy.one}: ${source.text[input.locale]}\n\n${copy.two}: ${final.text[input.locale]}`,
      options: rendered.map((option) => option.text),
      correctIndex,
      answerId: mode,
      explanation: `${chainText}. ${mode === "FIRST_BRIDGE" ? copy.explainFirst : copy.explainFinal}`,
      causalTrace: path,
      distractorMechanisms: rendered.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
      candidateComparisons: [],
      optionMetadata: rendered,
      metadata: {
        solver: "CAE_CAUSAL_WORLD_SOLVER_V3",
        sourceMode: "CURATED_COMPOSABLE_SCENARIO",
        qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockEligible: false,
        publicEligible: false,
      },
    });
  });
}
