import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { PERCENTAGE_MOTIF_FACTORY_LIST } from "../canonical/percentage-motif-factories";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import { buildMultilingualReferenceSamples } from "../localization/renderers/export-multilingual-references";
import { validateLocalization } from "../localization/validators/localization-validator";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";

const SAMPLE_COUNT = 2000;
const DEVANAGARI_RE = /[\u0900-\u097F]/u;
const GURMUKHI_RE = /[\u0A00-\u0A7F]/u;
const NON_ENGLISH_LABEL_LEAK_RE =
  /\b(?:Change|Remaining|Apply|Loss|Profit|Required|marks|gap|relation|part|next)\b|(?:Change|Loss|Profit)\s*%/u;
const ASCII_WORD_RE = /\b[A-Za-z]{2,}\b/u;
const RESTORE_LABEL_COLLISION_RE =
  /Required increase:\s*Required|आवश्यक वृद्धि:\s*आवश्यक|ਲੋੜੀਂਦਾ ਵਾਧਾ:\s*ਲੋੜੀਂਦਾ/u;
const REVERSE_TINY_CENSUS_RE =
  /\b(?:census recorded|population of|recorded)\s+\d{1,2}\s+people\b/iu;

function buildSample(index: number) {
  const factory =
    PERCENTAGE_MOTIF_FACTORY_LIST[
      index % PERCENTAGE_MOTIF_FACTORY_LIST.length
    ]!;
  const seed =
    Math.floor(index / PERCENTAGE_MOTIF_FACTORY_LIST.length) + 1;
  const problem = factory(seed);
  const graph = buildReasoningGraph(problem);
  const signature = createProblemSignature(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: `ml-test:${index}:${signature}`,
  });
  return { problem, graph, signature, editorial };
}

function lastExplanationLine(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1) ?? "";
}

function assertCompleteEnding(explanation: string) {
  const lastLine = lastExplanationLine(explanation);
  assert.ok(lastLine && /\d/u.test(lastLine), explanation);
  assert.equal(/[:=]\s*$/u.test(lastLine), false, explanation);
  assert.equal(/(?:[+\-*/xX]|\()\s*$/u.test(lastLine), false, explanation);
}

function assertNoLabelCollision(explanation: string) {
  assert.equal(RESTORE_LABEL_COLLISION_RE.test(explanation), false, explanation);
  assert.equal(/:\S/u.test(explanation), false, explanation);
}

function buildMatchingSample(
  predicate: (sample: ReturnType<typeof buildSample>) => boolean,
  limit = 5000,
) {
  for (let index = 0; index < limit; index += 1) {
    const sample = buildSample(index);
    if (predicate(sample)) {
      return sample;
    }
  }
  throw new Error(`No matching sample found within ${limit} attempts`);
}

function localizedPair(sample: ReturnType<typeof buildSample>) {
  return {
    hi: renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    }),
    pa: renderLocalizedRealization({
      language: "pa",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    }),
  };
}

function reverseExpectedEnglishLabel(stem: string) {
  const normalized = stem.toLowerCase();
  if (/\bmarks?\b|\bscore\b/u.test(normalized)) return "Maximum marks";
  if (/\bpopulation\b|\bpeople\b/u.test(normalized)) return "Total population";
  if (/\bapplicants?\b|\bcandidates?\b/u.test(normalized)) return "Total applicants";
  if (/\bvoters?\b|\bvotes?\b/u.test(normalized)) return "Total voters";
  if (/\bsugar\b|\bstock\b/u.test(normalized)) return "Total sugar stock";
  return "Total value";
}

test("multilingual realization preserves equations and renders semantic intents deterministically", () => {
  let hindiLabels = 0;
  let punjabiLabels = 0;
  let shortcutHeadings = 0;

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const sample = buildSample(index);
    const hi = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const pa = renderLocalizedRealization({
      language: "pa",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const hiAgain = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });

    assert.deepEqual(hi, hiAgain);

    const hiValidation = validateLocalization({
      source: sample.editorial,
      localized: hi,
    });
    const paValidation = validateLocalization({
      source: sample.editorial,
      localized: pa,
    });

    assert.equal(
      hiValidation.metrics.equationPreservationScore,
      100,
      sample.signature,
    );
    assert.equal(
      paValidation.metrics.equationPreservationScore,
      100,
      sample.signature,
    );
    assert.ok(
      hiValidation.metrics.localizationCoverage >= 75,
      `${sample.signature} ${JSON.stringify(hiValidation.metrics)}`,
    );
    assert.ok(
      paValidation.metrics.localizationCoverage >= 75,
      `${sample.signature} ${JSON.stringify(paValidation.metrics)}`,
    );
    assert.ok(
      hiValidation.metrics.fallbackCount <= 1,
      sample.signature,
    );
    assert.ok(
      paValidation.metrics.fallbackCount <= 1,
      sample.signature,
    );
    assert.ok(
      hiValidation.metrics.scriptConsistencyScore >= 75,
      sample.signature,
    );
    assert.ok(
      paValidation.metrics.scriptConsistencyScore >= 75,
      sample.signature,
    );

    if (DEVANAGARI_RE.test(hi.explanation)) {
      hindiLabels += 1;
    }
    if (GURMUKHI_RE.test(pa.explanation)) {
      punjabiLabels += 1;
    }
    if (
      hi.explanation.includes("शॉर्टकट:") ||
      pa.explanation.includes("ਸ਼ਾਰਟਕੱਟ:")
    ) {
      shortcutHeadings += 1;
    }
  }

  assert.ok(hindiLabels > SAMPLE_COUNT * 0.9);
  assert.ok(punjabiLabels > SAMPLE_COUNT * 0.9);
  assert.equal(shortcutHeadings, 0);
});

test("Hindi and Punjabi percentage explanations do not leak English labels", () => {
  for (let index = 0; index < 100; index += 1) {
    const sample = buildSample(index);
    const hi = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const pa = renderLocalizedRealization({
      language: "pa",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });

    for (const localized of [hi, pa]) {
      const validation = validateLocalization({
        source: sample.editorial,
        localized,
      });
      const lastLine = localized.explanation
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .at(-1);

      assert.equal(
        validation.valid,
        true,
        `${localized.language} ${sample.signature}: ${validation.issues.map((issue) => issue.message).join("; ")}\n${localized.explanation}`,
      );
      assert.equal(
        NON_ENGLISH_LABEL_LEAK_RE.test(localized.explanation),
        false,
        `${localized.language} leaked an English label:\n${localized.explanation}`,
      );
      assert.equal(
        ASCII_WORD_RE.test(localized.explanation),
        false,
        `${localized.language} leaked ASCII words:\n${localized.explanation}`,
      );
      assert.ok(lastLine && /\d/u.test(lastLine), localized.explanation);
      assert.equal(/[:=]\s*$/u.test(lastLine ?? ""), false, localized.explanation);
      assert.equal(/(?:[+\-*/xX]|\()\s*$/u.test(lastLine ?? ""), false, localized.explanation);
    }
  }
});

test("percentage explanation final-answer polish survives SSC audit samples", () => {
  let restoreSamples = 0;
  let reverseSamples = 0;

  for (let index = 0; index < 300; index += 1) {
    const sample = buildSample(index);
    const hi = renderLocalizedRealization({
      language: "hi",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });
    const pa = renderLocalizedRealization({
      language: "pa",
      problem: sample.problem,
      graph: sample.graph,
      editorial: sample.editorial,
    });

    for (const explanation of [
      sample.editorial.explanation,
      hi.explanation,
      pa.explanation,
    ]) {
      assertCompleteEnding(explanation);
      assertNoLabelCollision(explanation);
    }

    if (sample.problem.subtype === "restore_original") {
      restoreSamples += 1;
      assert.match(
        lastExplanationLine(sample.editorial.explanation),
        /^Required increase = [-\d.]+%/u,
      );
      assert.match(lastExplanationLine(hi.explanation), /^आवश्यक वृद्धि = [-\d.]+%/u);
      assert.match(lastExplanationLine(pa.explanation), /^ਲੋੜੀਂਦਾ ਵਾਧਾ = [-\d.]+%/u);
    }

    if (sample.problem.topology?.variant === "turnout_margin") {
      assert.match(
        lastExplanationLine(sample.editorial.explanation),
        /^Registered voters = \d/u,
      );
      assert.match(lastExplanationLine(hi.explanation), /^पंजीकृत मतदाता = \d/u);
      assert.match(lastExplanationLine(pa.explanation), /^ਰਜਿਸਟਰਡ ਵੋਟਰ = \d/u);
      assert.equal(/total votes|कुल वोट|ਕੁੱਲ ਵੋਟ/iu.test(lastExplanationLine(sample.editorial.explanation)), false);
      assert.equal(/कुल वोट/u.test(lastExplanationLine(hi.explanation)), false);
      assert.equal(/ਕੁੱਲ ਵੋਟ/u.test(lastExplanationLine(pa.explanation)), false);
    }

    if (sample.problem.subtype === "reverse_percentage") {
      reverseSamples += 1;
      assert.equal(REVERSE_TINY_CENSUS_RE.test(sample.editorial.stem), false, sample.editorial.stem);
    }

    assert.equal(
      NON_ENGLISH_LABEL_LEAK_RE.test(hi.explanation),
      false,
      hi.explanation,
    );
    assert.equal(
      NON_ENGLISH_LABEL_LEAK_RE.test(pa.explanation),
      false,
      pa.explanation,
    );
  }

  assert.ok(restoreSamples > 0, `expected restore samples, got ${restoreSamples}`);
  assert.ok(reverseSamples > 0, `expected reverse samples, got ${reverseSamples}`);
});

test("percentage blocker labels and semantic families stay aligned", () => {
  const migration = buildMatchingSample(
    (sample) => sample.problem.topology?.variant === "migration_adjusted_population",
  );
  const migrationLocalized = localizedPair(migration);
  assert.match(
    migrationLocalized.hi.explanation,
    /प्रवास से जोड़ी गई जनसंख्या/u,
  );
  assert.match(
    migrationLocalized.pa.explanation,
    /ਪਰਵਾਸ ਨਾਲ ਜੋੜੀ ਗਈ ਆਬਾਦੀ/u,
  );
  assert.equal(
    /अंतिम जनसंख्या\s*[:=]\s*\n?\s*\d+\s*x\s*\d+\s*\/\s*100/u.test(
      migrationLocalized.hi.explanation,
    ),
    false,
    migrationLocalized.hi.explanation,
  );
  assert.equal(
    /ਅੰਤਿਮ ਆਬਾਦੀ\s*[:=]\s*\n?\s*\d+\s*x\s*\d+\s*\/\s*100/u.test(
      migrationLocalized.pa.explanation,
    ),
    false,
    migrationLocalized.pa.explanation,
  );

  const passGap = buildMatchingSample(
    (sample) => sample.problem.topology?.variant === "pass_fail_gap",
  );
  const passGapLocalized = localizedPair(passGap);
  assert.match(passGap.editorial.explanation, /Total marks gap/u);
  assert.match(passGap.editorial.explanation, /Percentage gap/u);
  assert.equal(/Pass mark difference/u.test(passGap.editorial.explanation), false);
  assert.notEqual(
    /Total marks gap/u.exec(passGap.editorial.explanation)?.[0],
    /Percentage gap/u.exec(passGap.editorial.explanation)?.[0],
  );
  assert.match(passGapLocalized.hi.explanation, /अंकों का कुल अंतर/u);
  assert.match(passGapLocalized.hi.explanation, /प्रतिशत अंतर/u);
  assert.match(passGapLocalized.pa.explanation, /ਅੰਕਾਂ ਦਾ ਕੁੱਲ ਅੰਤਰ/u);
  assert.match(passGapLocalized.pa.explanation, /ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ/u);

  const remainingPass = buildMatchingSample(
    (sample) => sample.problem.topology?.variant === "remaining_marks_required",
  );
  const remainingPassLocalized = localizedPair(remainingPass);
  assert.match(remainingPass.editorial.explanation, /Required percentage gap/u);
  assert.match(remainingPassLocalized.hi.explanation, /आवश्यक प्रतिशत अंतर/u);
  assert.match(remainingPassLocalized.pa.explanation, /ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ/u);

  const restore = buildMatchingSample(
    (sample) => sample.problem.subtype === "restore_original",
  );
  const restoreLocalized = localizedPair(restore);
  assert.match(restore.editorial.stem, /^Marked price was reduced/u);
  assert.equal(/\bsalary\b/iu.test(restore.editorial.stem), false, restore.editorial.stem);
  assert.match(restoreLocalized.hi.stem, /वस्तु के मूल्य/u);
  assert.match(restoreLocalized.pa.stem, /ਵਸਤੂ ਦੀ ਕੀਮਤ/u);
});

test("reverse percentage English explanations use contextual labels", () => {
  let checked = 0;
  const seenLabels = new Set<string>();

  for (let index = 0; index < 500 && checked < 20; index += 1) {
    const sample = buildSample(index);
    if (sample.problem.subtype !== "reverse_percentage") {
      continue;
    }

    checked += 1;
    const expectedLabel = reverseExpectedEnglishLabel(sample.editorial.stem);
    seenLabels.add(expectedLabel);
    assert.equal(
      /for the record|Total quantity/iu.test(sample.editorial.explanation),
      false,
      sample.editorial.explanation,
    );
    assert.match(sample.editorial.explanation, new RegExp(expectedLabel, "u"));
  }

  assert.ok(checked > 0, "expected reverse percentage samples");
  assert.ok(seenLabels.size >= 2, `expected contextual variety, got ${[...seenLabels].join(", ")}`);
});

test("multilingual reference export shape is stable", () => {
  const samples = buildMultilingualReferenceSamples();
  assert.equal(samples.length, 60);
  for (const sample of samples) {
    assert.equal(typeof sample.english.explanation, "string");
    assert.equal(typeof sample.hindi.stem, "string");
    assert.equal(typeof sample.punjabi.stem, "string");
    assert.equal(typeof sample.hindi.explanation, "string");
    assert.equal(typeof sample.punjabi.explanation, "string");
    assert.ok(DEVANAGARI_RE.test(sample.hindi.stem));
    assert.ok(GURMUKHI_RE.test(sample.punjabi.stem));
    assert.ok(DEVANAGARI_RE.test(sample.hindi.explanation));
    assert.ok(GURMUKHI_RE.test(sample.punjabi.explanation));
    assert.equal(sample.hindi.metrics.equationPreservationScore, 100);
    assert.equal(sample.punjabi.metrics.equationPreservationScore, 100);
  }

  const apiServerDir = fs.existsSync(
    path.join(process.cwd(), "artifacts/api-server/src/quant-v2"),
  )
    ? path.join(process.cwd(), "artifacts/api-server")
    : process.cwd();
  const referencePath = path.join(
    apiServerDir,
    "src/quant-v2/stability/multilingual-reference-samples/paired-realizations.json",
  );
  if (fs.existsSync(referencePath)) {
    const exported = JSON.parse(fs.readFileSync(referencePath, "utf8")) as unknown[];
    assert.equal(exported.length, 60);
  }
});

export {};
