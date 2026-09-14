import { causalPath } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS, familyForCae001 } from "./causal-world-authorities.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES, withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeCausalWorld, CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion } from "./types.ts";

type Mode = "MISSING_SINGLE" | "MISSING_PAIR" | "RELATION_TYPE" | "CONNECTOR_PAIR" | "NEXT_OUTCOME" | "COMMON_CAUSE_RECONSTRUCTION";
const MODES: readonly Mode[] = ["MISSING_SINGLE", "MISSING_PAIR", "RELATION_TYPE", "CONNECTOR_PAIR", "NEXT_OUTCOME", "COMMON_CAUSE_RECONSTRUCTION"];
const CANDIDATE_READY = new Set(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS);
const BRANCH_IDS = new Set(CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE").map((family) => family.id));

const COPY: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": { missingSingle: "Which event most logically completes the causal sequence?", missingPair: "Which pair of events correctly completes the two missing steps?", relationType: "Which relationship between P and S is supported by the causal information?", connectorPair: "Which pair forms the two-step connector between P and S?", nextOutcome: "The first three events are known. Which event most logically follows next?", commonCause: "Which hidden event best explains both observations?", observationOne: "Observation I", observationTwo: "Observation II", direct: "P is the direct cause of S.", indirect: "P is an indirect cause of S.", common: "P and S are effects of a common cause.", none: "No causal relationship is established between P and S.", missingExplanation: "The missing event is the direct bridge between the two shown events.", pairExplanation: "These are the two intermediate events in the correct order.", relationExplanation: "P reaches S through intermediate events, so the relationship is indirect rather than direct.", connectorExplanation: "These two events lie between P and S on the same causal path.", nextExplanation: "This is the next downstream event supported by the causal chain.", commonExplanation: "The hidden event produces both visible outcomes; neither visible outcome causes the other." },
  "hi-IN": { missingSingle: "कौन-सी घटना कारणात्मक क्रम को सबसे तार्किक रूप से पूरा करती है?", missingPair: "कौन-सी घटनाओं की जोड़ी दो लुप्त चरणों को सही क्रम में पूरा करती है?", relationType: "कारणात्मक जानकारी के आधार पर P और S के बीच कौन-सा संबंध समर्थित है?", connectorPair: "P और S के बीच दो-चरणीय जोड़ कौन-सी घटनाओं की जोड़ी बनाती है?", nextOutcome: "पहली तीन घटनाएं ज्ञात हैं। इसके बाद कौन-सी घटना सबसे तार्किक रूप से आएगी?", commonCause: "कौन-सी छिपी घटना दोनों अवलोकनों को सबसे अच्छी तरह समझाती है?", observationOne: "अवलोकन I", observationTwo: "अवलोकन II", direct: "P, S का प्रत्यक्ष कारण है।", indirect: "P, S का अप्रत्यक्ष कारण है।", common: "P और S एक सामान्य कारण के प्रभाव हैं।", none: "P और S के बीच कोई कारणात्मक संबंध स्थापित नहीं है।", missingExplanation: "लुप्त घटना दिखाई गई दोनों घटनाओं के बीच प्रत्यक्ष सेतु है।", pairExplanation: "ये सही क्रम में दो मध्यवर्ती घटनाएं हैं।", relationExplanation: "P मध्यवर्ती घटनाओं के माध्यम से S तक पहुँचता है, इसलिए संबंध प्रत्यक्ष नहीं बल्कि अप्रत्यक्ष है।", connectorExplanation: "ये दोनों घटनाएं उसी कारणात्मक पथ पर P और S के बीच आती हैं।", nextExplanation: "यह कारणात्मक श्रृंखला से समर्थित अगली घटना है।", commonExplanation: "छिपी घटना दोनों दिखाई गई घटनाओं को उत्पन्न करती है; दिखाई गई कोई भी घटना दूसरी का कारण नहीं है।" },
  "pa-IN": { missingSingle: "ਕਿਹੜੀ ਘਟਨਾ ਕਾਰਨਾਤਮਕ ਕ੍ਰਮ ਨੂੰ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਢੰਗ ਨਾਲ ਪੂਰਾ ਕਰਦੀ ਹੈ?", missingPair: "ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਜੋੜੀ ਦੋ ਲਾਪਤਾ ਪੜਾਅ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਪੂਰੇ ਕਰਦੀ ਹੈ?", relationType: "ਕਾਰਨਾਤਮਕ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ P ਅਤੇ S ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਸਮਰਥਿਤ ਹੈ?", connectorPair: "P ਅਤੇ S ਵਿਚਕਾਰ ਦੋ-ਪੜਾਅ ਜੋੜ ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਜੋੜੀ ਬਣਾਉਂਦੀ ਹੈ?", nextOutcome: "ਪਹਿਲੀਆਂ ਤਿੰਨ ਘਟਨਾਵਾਂ ਜਾਣੀਆਂ ਹਨ। ਅਗਲੀ ਸਭ ਤੋਂ ਤਰਕਸੰਗਤ ਘਟਨਾ ਕਿਹੜੀ ਹੈ?", commonCause: "ਕਿਹੜੀ ਲੁਕੀ ਘਟਨਾ ਦੋਵੇਂ ਨਿਰੀਖਣਾਂ ਨੂੰ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?", observationOne: "ਨਿਰੀਖਣ I", observationTwo: "ਨਿਰੀਖਣ II", direct: "P, S ਦਾ ਸਿੱਧਾ ਕਾਰਨ ਹੈ।", indirect: "P, S ਦਾ ਅਪ੍ਰਤੱਖ ਕਾਰਨ ਹੈ।", common: "P ਅਤੇ S ਇੱਕ ਸਾਂਝੇ ਕਾਰਨ ਦੇ ਪ੍ਰਭਾਵ ਹਨ।", none: "P ਅਤੇ S ਵਿਚਕਾਰ ਕੋਈ ਕਾਰਨਾਤਮਕ ਸੰਬੰਧ ਸਥਾਪਤ ਨਹੀਂ ਹੈ।", missingExplanation: "ਲਾਪਤਾ ਘਟਨਾ ਦਿਖਾਈਆਂ ਦੋ ਘਟਨਾਵਾਂ ਵਿਚਕਾਰ ਸਿੱਧਾ ਪੁਲ ਹੈ।", pairExplanation: "ਇਹ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਦੋ ਵਿਚਕਾਰਲੀਆਂ ਘਟਨਾਵਾਂ ਹਨ।", relationExplanation: "P ਵਿਚਕਾਰਲੀਆਂ ਘਟਨਾਵਾਂ ਰਾਹੀਂ S ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ, ਇਸ ਲਈ ਸੰਬੰਧ ਸਿੱਧਾ ਨਹੀਂ ਸਗੋਂ ਅਪ੍ਰਤੱਖ ਹੈ।", connectorExplanation: "ਇਹ ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਉਸੇ ਕਾਰਨਾਤਮਕ ਰਸਤੇ ਉੱਤੇ P ਅਤੇ S ਵਿਚਕਾਰ ਆਉਂਦੀਆਂ ਹਨ।", nextExplanation: "ਇਹ ਕਾਰਨਾਤਮਕ ਲੜੀ ਤੋਂ ਸਮਰਥਿਤ ਅਗਲੀ ਘਟਨਾ ਹੈ।", commonExplanation: "ਲੁਕੀ ਘਟਨਾ ਦੋਵੇਂ ਦਿਖਾਈਆਂ ਘਟਨਾਵਾਂ ਨੂੰ ਪੈਦਾ ਕਰਦੀ ਹੈ; ਦਿਖਾਈਆਂ ਘਟਨਾਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਦੂਜੇ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੈ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let s = mix32(seed ^ 0x9a11c9); for (let i = out.length - 1; i > 0; i -= 1) { s = mix32(s + i); const j = s % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function trim(value: string): string { return value.replace(/[.।]+$/u, ""); }
function path4(world: CaeCausalWorld): readonly string[] | null { const roots = world.nodes.filter((n) => !world.edges.some((e) => e.to === n.id)); const leaves = world.nodes.filter((n) => !world.edges.some((e) => e.from === n.id)); for (const root of roots) for (const leaf of leaves) { const path = causalPath(world, root.id, leaf.id); if (path?.length === 4) return path; } return null; }
function evidence(mode: Mode): CaeDifficultyEvidence { const hard = mode === "MISSING_PAIR" || mode === "CONNECTOR_PAIR" || mode === "COMMON_CAUSE_RECONSTRUCTION"; return { causalDistance: mode === "RELATION_TYPE" ? 3 : 2, hiddenLinks: mode === "MISSING_PAIR" || mode === "CONNECTOR_PAIR" ? 2 : 1, topologyComplexity: mode === "COMMON_CAUSE_RECONSTRUCTION" ? 3 : 4, plausibleDistractors: hard ? 3 : 2, visibleEventCount: mode === "RELATION_TYPE" ? 4 : 2, inferenceBurden: hard ? 5 : 4, candidatePlausibilityBurden: hard ? 5 : 3, score: hard ? 19 : 15 }; }
function option(id: string, text: string, correct: boolean, role: CaeRenderedOption["distractorRole"] = "INDIRECTNESS_CONFUSION"): CaeRenderedOption { return { id, text, isCorrect: correct, distractorRole: correct ? undefined : role }; }

export function generateCp009SaturationQuestion(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  return withCae001SaturationWave2(() => {
    const selectionSeed = mix32((input.seed >>> 0) ^ 0x9909cafe);
    const mode = MODES[mix32(selectionSeed ^ 0x99) % MODES.length]!;
    const copy = COPY[input.locale];
    let world: CaeCausalWorld; let trace: readonly string[]; let visibleIds: readonly string[]; let options: readonly CaeRenderedOption[]; let answerId: string; let stem: string; let explanation: string;

    if (mode === "COMMON_CAUSE_RECONSTRUCTION") {
      const worlds = CAE_001_CAUSAL_WORLDS.filter((entry) => BRANCH_IDS.has(entry.scenarioFamilyId));
      if (!worlds.length) throw new Error("CP009 saturation: no branching worlds.");
      world = worlds[selectionSeed % worlds.length]!;
      const cause = world.nodes.find((n) => n.role === "CAUSE")!;
      const effects = world.nodes.filter((n) => n.role === "EFFECT");
      if (effects.length < 2) throw new Error(`${world.id}: branching saturation world needs two effects.`);
      trace = [cause.id, effects[0]!.id, effects[1]!.id]; visibleIds = [effects[0]!.id, effects[1]!.id]; answerId = cause.id;
      const siblingCauses = worlds
        .filter((entry) => entry.scenarioFamilyId === world.scenarioFamilyId && entry.id !== world.id)
        .map((entry) => entry.nodes.find((node) => node.role === "CAUSE"))
        .filter((node): node is NonNullable<typeof node> => Boolean(node))
        .filter((node) => node.text[input.locale] !== cause.text[input.locale]);
      if (siblingCauses.length < 3) throw new Error(`${world.id}: CP009 common-cause saturation needs three same-family alternative causes.`);
      const wrong = shuffled(siblingCauses, selectionSeed ^ 0x33).slice(0, 3).map((node, index) => option(`REVIEW_ALT:${world.scenarioFamilyId}:${index + 1}`, node.text[input.locale], false, "COMMON_CAUSE_CONFUSION"));
      options = shuffled([option(cause.id, cause.text[input.locale], true), ...wrong], selectionSeed);
      stem = `${copy.commonCause}\n\n${copy.observationOne}: ${effects[0]!.text[input.locale]}\n${copy.observationTwo}: ${effects[1]!.text[input.locale]}`;
      explanation = `${trim(cause.text[input.locale])} → ${trim(effects[0]!.text[input.locale])} / ${trim(effects[1]!.text[input.locale])}. ${copy.commonExplanation}`;
    } else {
      const worlds = CAE_001_CAUSAL_WORLDS.filter((entry) => CANDIDATE_READY.has(entry.scenarioFamilyId) && path4(entry) !== null);
      if (!worlds.length) throw new Error("CP009 saturation: no candidate-ready chain worlds.");
      world = worlds[selectionSeed % worlds.length]!; const path = path4(world)!; trace = path;
      const family = familyForCae001(world.scenarioFamilyId); const variant = family.variants.find((v) => v.id === world.scenarioVariantId)!;
      const txt = (id: string) => world.nodes.find((n) => n.id === id)!.text[input.locale];
      const bridgeAlts = [...variant.semanticBridgeCandidateEvents, ...variant.semanticCandidateEvents, ...variant.semanticEffectCandidateEvents];
      const effectAlts = [...variant.semanticEffectCandidateEvents, ...variant.semanticBridgeCandidateEvents, ...variant.semanticCandidateEvents];
      if (mode === "MISSING_SINGLE") {
        visibleIds = [path[0]!, path[2]!]; answerId = path[1]!;
        const wrong = bridgeAlts.slice(0, 3).map((c) => option(`EDITORIAL_SAME_SCENARIO:${world.scenarioVariantId}:${c.id}`, c.text[input.locale], false, c.mechanism));
        options = shuffled([option(answerId, txt(answerId), true), ...wrong], selectionSeed); stem = `${copy.missingSingle}\n\nP. ${txt(path[0]!)}\nR. ${txt(path[2]!)}`; explanation = `${trim(txt(path[0]!))} → ${trim(txt(path[1]!))} → ${trim(txt(path[2]!))}. ${copy.missingExplanation}`;
      } else if (mode === "NEXT_OUTCOME") {
        visibleIds = [path[0]!, path[1]!, path[2]!]; answerId = path[3]!;
        const wrong = effectAlts.slice(0, 3).map((c) => option(`EDITORIAL_SAME_SCENARIO:${world.scenarioVariantId}:${c.id}`, c.text[input.locale], false, c.mechanism));
        options = shuffled([option(answerId, txt(answerId), true), ...wrong], selectionSeed); stem = `${copy.nextOutcome}\n\nP. ${txt(path[0]!)}\nQ. ${txt(path[1]!)}\nR. ${txt(path[2]!)}`; explanation = `${path.map((id) => trim(txt(id))).join(" → ")}. ${copy.nextExplanation}`;
      } else if (mode === "RELATION_TYPE") {
        visibleIds = path; answerId = "INDIRECT";
        options = shuffled([option("DIRECT", copy.direct, false), option("INDIRECT", copy.indirect, true), option("COMMON", copy.common, false, "COMMON_CAUSE_CONFUSION"), option("NONE", copy.none, false, "CORRELATION")], selectionSeed); stem = `${copy.relationType}\n\nP. ${txt(path[0]!)}\nQ. ${txt(path[1]!)}\nR. ${txt(path[2]!)}\nS. ${txt(path[3]!)}`; explanation = `${path.map((id) => trim(txt(id))).join(" → ")}. ${copy.relationExplanation}`;
      } else {
        visibleIds = [path[0]!, path[3]!]; answerId = `${path[1]!}|${path[2]!}`;
        const altA = bridgeAlts[0]!, altB = bridgeAlts[1]!;
        const trueA = txt(path[1]!), trueB = txt(path[2]!);
        const pair = (id: string, a: string, b: string, correct: boolean, role: CaeRenderedOption["distractorRole"]) => option(id, `${trim(a)} → ${trim(b)}`, correct, role);
        options = shuffled([
          pair(answerId, trueA, trueB, true, undefined),
          pair(`NEAR_PAIR:TARGETED:${world.scenarioVariantId}:A`, trueA, altA.text[input.locale], false, altA.mechanism),
          pair(`NEAR_PAIR:TARGETED:${world.scenarioVariantId}:B`, altB.text[input.locale], trueB, false, altB.mechanism),
          pair(`REVERSED:${world.scenarioVariantId}`, trueB, trueA, false, "TEMPORAL_VIOLATION"),
        ], selectionSeed);
        stem = `${mode === "MISSING_PAIR" ? copy.missingPair : copy.connectorPair}\n\nP. ${txt(path[0]!)}\nS. ${txt(path[3]!)}`;
        explanation = `${trim(txt(path[0]!))} → ${trueA} → ${trueB} → ${trim(txt(path[3]!))}. ${mode === "MISSING_PAIR" ? copy.pairExplanation : copy.connectorExplanation}`;
      }
    }

    if (options.length !== 4 || options.filter((o) => o.isCorrect).length !== 1 || new Set(options.map((o) => o.text)).size !== 4) throw new Error(`${world.id}/${mode}: CP009 saturation option integrity failure.`);
    const difficulty = mode === "RELATION_TYPE" || mode === "MISSING_SINGLE" || mode === "NEXT_OUTCOME" ? "MEDIUM" : "HARD";
    const causalStateId = `projection:CAE-PLAN-INTEGRATED-V2|world:${world.id}|mode:${mode}|saturation:wave3`;
    const itemVariantId = `${causalStateId}|presentation:${options.map((o) => o.id).join(">")}`;
    return Object.freeze({ chapterId: "CAE-001", checkpointId: "CAE-CP-009", qlId: "CAE-QL-009", projectionId: "CAE-PLAN-INTEGRATED-V2", scenarioFamilyId: world.scenarioFamilyId, scenarioVariantId: world.scenarioVariantId, causalStateId, itemVariantId, semanticInstanceId: itemVariantId, causalWorldId: world.id, causalStructure: `INTEGRATED:${mode}`, locale: input.locale, seed: input.seed, difficulty, difficultyEvidence: evidence(mode), questionProfile: "FOUR_WAY", visibleContext: { backdrop: null, visibleNodeIds: visibleIds, hiddenNodeIds: world.nodes.map((n) => n.id).filter((id) => !visibleIds.includes(id)) }, stem, options: options.map((o) => o.text), correctIndex: options.findIndex((o) => o.isCorrect), answerId, explanation, causalTrace: trace, distractorMechanisms: options.flatMap((o) => o.distractorRole ? [o.distractorRole] : []), candidateComparisons: [], optionMetadata: options, metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false } });
  });
}
