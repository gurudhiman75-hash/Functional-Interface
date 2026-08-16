import { mkdirSync, writeFileSync } from "node:fs";
import { generateGlyphStringProofQuestion } from "../foundation/spatial/glyph-string-proof-generator";
import { spatialPerceptualSignatureV2, validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { SpatialSeededRandom } from "../foundation/spatial/seed";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
type Chapter = "MIR-001" | "WAT-001";
type Mode = "LATIN_GLYPH_STRING" | "WESTERN_ARABIC_DIGIT_STRING";
type Slot = 0 | 1 | 2 | 3;

const LATIN = ["LATIN-F","LATIN-L","LATIN-P","LATIN-R","LATIN-K","LATIN-Q"] as const;
const DIGITS = ["DIGIT-2","DIGIT-4","DIGIT-5","DIGIT-7"] as const;
const CHAPTERS: Chapter[] = ["MIR-001","WAT-001"];
const MODES: Mode[] = ["LATIN_GLYPH_STRING","WESTERN_ARABIC_DIGIT_STRING"];
const TARGET_PER_MODE = 100;
const TARGET_PER_SLOT_PER_MODE = 25;

function perceptualQuestionKey(source: any, options: readonly any[], correctOptionIndex: number): string {
  const optionSignatures = options.map((option) => spatialPerceptualSignatureV2(option.scene));
  return JSON.stringify({
    source: spatialPerceptualSignatureV2(source),
    options: [...optionSignatures].sort(),
    correct: optionSignatures[correctOptionIndex],
  });
}

const results: Record<string, { accepted: number; attempts: number; perceptualRejects: number; generatorRejects: number; slots: [number,number,number,number] }> = {};

for (const chapterCode of CHAPTERS) {
  const requestedTransform = chapterCode === "MIR-001" ? "REFLECT_VERTICAL" : "REFLECT_HORIZONTAL";
  const instructionKey = chapterCode === "MIR-001" ? "MIR_SELECT_STRING" : "WAT_SELECT_STRING";
  for (const stimulusKind of MODES) {
    const key = `${chapterCode}:${stimulusKind}`;
    const stats = { accepted: 0, attempts: 0, perceptualRejects: 0, generatorRejects: 0, slots: [0,0,0,0] as [number,number,number,number] };
    const seen = new Set<string>();
    for (let attempt = 0; attempt < 20000 && stats.accepted < TARGET_PER_MODE; attempt += 1) {
      stats.attempts += 1;
      const seed = `SPA-PQL-STRING-BALANCE:${chapterCode}:${stimulusKind}:${attempt}`;
      const rng = new SpatialSeededRandom(seed);
      const pool = stimulusKind === "LATIN_GLYPH_STRING" ? LATIN : DIGITS;
      const length = rng.int(2, 4);
      const glyphIds = Array.from({ length }, () => rng.pick(pool));
      let q: ReturnType<typeof generateGlyphStringProofQuestion>;
      try {
        q = generateGlyphStringProofQuestion({
          seed,
          chapterCode,
          prototypeId: `${chapterCode}-${stimulusKind}-${attempt}`,
          requestedTransform,
          instructionKey,
          glyphIds,
          stimulusKind,
        });
      } catch {
        stats.generatorRejects += 1;
        continue;
      }
      const slot = q.correctOptionIndex as Slot;
      if (stats.slots[slot] >= TARGET_PER_SLOT_PER_MODE) continue;
      const scenes = [q.sourceScene, ...q.options.map((option) => option.scene)];
      if (scenes.some((scene) => !validateSpatialScene(scene).ok)) {
        stats.generatorRejects += 1;
        continue;
      }
      if (!validateSpatialOptionUniqueness(q.options.map((option) => option.scene)).ok ||
          !validateSpatialPerceptualOptionUniquenessV2(q.options.map((option) => option.scene)).ok ||
          !validateLearnerVisibleExplanationV2(Object.values(q.learnerExplanation)).ok) {
        stats.generatorRejects += 1;
        continue;
      }
      const perceptualKey = perceptualQuestionKey(q.sourceScene, q.options, q.correctOptionIndex);
      if (seen.has(perceptualKey)) {
        stats.perceptualRejects += 1;
        continue;
      }
      seen.add(perceptualKey);
      stats.accepted += 1;
      stats.slots[slot] += 1;
    }
    assert(stats.accepted === TARGET_PER_MODE, `${key}: accepted ${stats.accepted}/${TARGET_PER_MODE}.`);
    assert(stats.slots.every((count) => count === TARGET_PER_SLOT_PER_MODE), `${key}: slots ${stats.slots.join("/")} instead of 25/25/25/25.`);
    results[key] = stats;
  }
}

assert(Object.values(results).reduce((sum, stats) => sum + stats.accepted, 0) === 400, "Expected 400 balanced string questions.");
const evidence = {
  status: "PASS_SPA_FND_001_PROPOSED_QL_STRING_MODALITY_BALANCE_V1",
  scale: {
    chapters: 2,
    modesPerChapter: 2,
    targetPerMode: TARGET_PER_MODE,
    totalAccepted: 400,
    results,
  },
  checks: {
    mirrorLatin100: results["MIR-001:LATIN_GLYPH_STRING"]?.accepted === 100,
    mirrorDigits100: results["MIR-001:WESTERN_ARABIC_DIGIT_STRING"]?.accepted === 100,
    waterLatin100: results["WAT-001:LATIN_GLYPH_STRING"]?.accepted === 100,
    waterDigits100: results["WAT-001:WESTERN_ARABIC_DIGIT_STRING"]?.accepted === 100,
    twentyFivePerAnswerSlotPerMode: Object.values(results).every((stats) => stats.slots.every((count) => count === 25)),
    perceptualQuestionUniquenessWithinEachMode: true,
    semanticAndPerceptualOptionUniqueness: true,
    learnerVisibleExplanations: true,
  },
  lifecycle: {
    permanentQlId: null,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    englishHumanFreeze: false,
  },
  nextGate: "SPATIAL_PROPOSED_QL_HUMAN_REVIEW_V1",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-proposed-ql-string-modality-balance-v1-evidence.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
