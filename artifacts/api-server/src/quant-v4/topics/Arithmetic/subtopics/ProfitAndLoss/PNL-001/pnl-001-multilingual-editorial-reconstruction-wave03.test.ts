import assert from "node:assert/strict";

import {
  validateStructuredEditorialEntry,
  type StructuredEditorialEntry,
} from "./foundation/editorial-content";
import { buildAllNormalizedMultilingualEditorialLibraries as buildWave02Libraries } from "./foundation/editorial-v2-multilingual-naturalness-wave02";
import { buildAllWave03MultilingualEditorialLibraries } from "./foundation/editorial-v2-multilingual-reconstruction-wave03";

const STEP_PREFIXES = [
  "दिए आँकड़ों से — ",
  "सही आधार पर — ",
  "इस चरण में ",
  "अब ",
  "प्रश्न की शर्त के अनुसार — ",
  "संबंधित राशि पर — ",
  "जाँच के साथ — ",
  "क्रमवार — ",
  "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ — ",
  "ਸਹੀ ਆਧਾਰ ਉੱਤੇ — ",
  "ਇਸ ਪੜਾਅ ਵਿੱਚ ",
  "ਹੁਣ ",
  "ਸਵਾਲ ਦੀ ਸ਼ਰਤ ਅਨੁਸਾਰ — ",
  "ਸਬੰਧਤ ਰਕਮ ਉੱਤੇ — ",
  "ਜਾਂਚ ਸਮੇਤ — ",
  "ਕ੍ਰਮਵਾਰ — ",
] as const;

const PUNJABI_LITERAL_LEAKS = [
  "ਜਾਣੇ ਮੂਲ ਮੁੱਲ",
  "ਜਾਣਿਆ ਮੂਲ ਮੁੱਲ",
  "ਅੰਤਿਮ ਮੰਗ ਨਾ ਭੁੱਲੋ",
  "ਸੌਖੇ ਭਾਗ ਮੰਨੋ",
] as const;

const TASK_SPECIFIC_CORRECTIONS = new Set([
  "PNL-QL-165",
  "PNL-QL-176",
]);

function target(entry: StructuredEditorialEntry): string {
  return entry.stem.prompt.replace(/[?？।.]+$/u, "").trim();
}

function prose(entry: StructuredEditorialEntry): string {
  return [
    entry.explanation.opening,
    entry.explanation.concept,
    ...entry.explanation.steps.flatMap((step) => [step.title, step.body]),
    entry.explanation.conclusion,
    entry.explanation.commonTrap ?? "",
    entry.explanation.shortcut ?? "",
  ].join("\n");
}

function stemTopology(entry: StructuredEditorialEntry): readonly string[] {
  return entry.stem.blocks.map((block) => block.type);
}

function stemEquations(entry: StructuredEditorialEntry): readonly string[] {
  return entry.stem.blocks
    .filter(
      (
        block,
      ): block is Extract<
        (typeof entry.stem.blocks)[number],
        { type: "equation" }
      > => block.type === "equation",
    )
    .map((block) => block.latex);
}

const sourceLibraries = buildWave02Libraries();
const candidateLibraries = buildAllWave03MultilingualEditorialLibraries();
assert.equal(
  candidateLibraries.length,
  12,
  "Wave 03 must contain all 12 Hindi/Punjabi libraries.",
);
assert.equal(candidateLibraries.length, sourceLibraries.length);

let entriesChecked = 0;
let equationsChecked = 0;
let taskSpecificCorrections = 0;

for (
  let libraryIndex = 0;
  libraryIndex < sourceLibraries.length;
  libraryIndex += 1
) {
  const sourceLibrary = sourceLibraries[libraryIndex]!;
  const candidateLibrary = candidateLibraries[libraryIndex]!;

  assert.equal(candidateLibrary.cpId, sourceLibrary.cpId);
  assert.equal(candidateLibrary.language, sourceLibrary.language);
  assert.equal(candidateLibrary.entryCount, sourceLibrary.entryCount);
  assert.deepEqual(
    Object.keys(candidateLibrary.entries),
    Object.keys(sourceLibrary.entries),
  );

  for (const [qlId, sourceEntry] of Object.entries(sourceLibrary.entries)) {
    const candidateEntry = candidateLibrary.entries[qlId];
    assert.ok(candidateEntry, `${qlId}: Wave 03 entry is missing.`);
    entriesChecked += 1;

    assert.deepEqual(
      stemTopology(candidateEntry),
      stemTopology(sourceEntry),
      `${qlId}: stem topology changed.`,
    );
    assert.deepEqual(
      stemEquations(candidateEntry),
      stemEquations(sourceEntry),
      `${qlId}: stem MathJax changed.`,
    );
    assert.equal(
      candidateEntry.stem.prompt,
      sourceEntry.stem.prompt,
      `${qlId}: final prompt changed.`,
    );
    assert.equal(
      candidateEntry.difficulty,
      sourceEntry.difficulty,
      `${qlId}: difficulty changed.`,
    );
    assert.equal(
      candidateEntry.difficultyRationale,
      sourceEntry.difficultyRationale,
      `${qlId}: difficulty rationale changed.`,
    );
    assert.equal(
      candidateEntry.explanation.finalAnswerLatex,
      sourceEntry.explanation.finalAnswerLatex,
      `${qlId}: final-answer MathJax changed.`,
    );

    if (TASK_SPECIFIC_CORRECTIONS.has(qlId)) {
      taskSpecificCorrections += 1;
      assert.equal(
        candidateEntry.explanation.steps.length,
        1,
        `${qlId}: corrected native explanation must match the one-step English task.`,
      );
      const sourceEquation = sourceEntry.explanation.steps.find(
        (step) => step.equationLatex,
      )?.equationLatex;
      const candidateEquation =
        candidateEntry.explanation.steps[0]?.equationLatex;
      assert.ok(sourceEquation, `${qlId}: source equation is missing.`);
      assert.ok(
        candidateEquation?.startsWith(sourceEquation),
        `${qlId}: corrected equation must preserve the canonical identity before substitution.`,
      );
      assert.ok(
        candidateEquation.includes("{"),
        `${qlId}: corrected equation must expose runtime value substitution.`,
      );
      equationsChecked += 1;
    } else {
      assert.equal(
        candidateEntry.explanation.steps.length,
        sourceEntry.explanation.steps.length,
        `${qlId}: step count changed.`,
      );
      for (
        let stepIndex = 0;
        stepIndex < sourceEntry.explanation.steps.length;
        stepIndex += 1
      ) {
        const sourceStep = sourceEntry.explanation.steps[stepIndex]!;
        const candidateStep = candidateEntry.explanation.steps[stepIndex]!;
        assert.equal(
          candidateStep.equationLatex,
          sourceStep.equationLatex,
          `${qlId}/step-${stepIndex + 1}: equation MathJax changed.`,
        );
        if (sourceStep.equationLatex) equationsChecked += 1;
      }
    }

    for (
      let stepIndex = 0;
      stepIndex < candidateEntry.explanation.steps.length;
      stepIndex += 1
    ) {
      const candidateStep = candidateEntry.explanation.steps[stepIndex]!;
      assert.ok(
        STEP_PREFIXES.every(
          (prefix) => !candidateStep.title.startsWith(prefix),
        ),
        `${qlId}/step-${stepIndex + 1}: synthetic title prefix remains: ${candidateStep.title}`,
      );
    }

    const quotedTarget = `“${target(candidateEntry)}”`;
    for (const [field, value] of [
      ["opening", candidateEntry.explanation.opening],
      ["concept", candidateEntry.explanation.concept],
      ["conclusion", candidateEntry.explanation.conclusion],
      ["commonTrap", candidateEntry.explanation.commonTrap ?? ""],
    ] as const) {
      assert.ok(
        !value.includes(quotedTarget),
        `${qlId}/${field}: prompt echo remains.`,
      );
      assert.ok(
        value.trim().length > 0,
        `${qlId}/${field}: prose became empty.`,
      );
    }

    if (candidateLibrary.language === "pa") {
      const entryProse = prose(candidateEntry);
      for (const phrase of PUNJABI_LITERAL_LEAKS) {
        assert.ok(
          !entryProse.includes(phrase),
          `${qlId}: Punjabi literal-translation leak remains: ${phrase}`,
        );
      }
    }

    assert.deepEqual(
      validateStructuredEditorialEntry(candidateEntry),
      [],
      `${qlId}: reconstructed entry is invalid.`,
    );
  }
}

assert.equal(
  entriesChecked,
  372,
  "Wave 03 must validate all 372 multilingual entries.",
);
assert.equal(
  taskSpecificCorrections,
  4,
  "Both corrected QLs must be rebuilt in Hindi and Punjabi.",
);
assert.ok(
  equationsChecked > 0,
  "Wave 03 must preserve solver-owned equation MathJax.",
);

console.log(
  JSON.stringify(
    {
      ok: true,
      librariesChecked: candidateLibraries.length,
      entriesChecked,
      equationsChecked,
      taskSpecificCorrections,
      promptEchoes: 0,
      syntheticStepPrefixes: 0,
      mathematicalAuthorityChanges: 0,
    },
    null,
    2,
  ),
);
