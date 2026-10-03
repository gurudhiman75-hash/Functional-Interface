import assert from "node:assert/strict";

import { generateStcV22Question } from "./editorial-v2-2-generator.ts";
import { STC_V22_TEMPLATES_BY_QL } from "./editorial-v2-2-templates.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const locales: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const probeSeeds = [0, 31, 255, 511, 1023, 1535, 2047] as const;

const HARD_ARCHETYPES = new Set([
  "CONTRAST_CONCESSION",
  "QUOTED_CLAIM",
  "ADVICE_WARNING",
  "CONDITIONAL_TRIGGER",
  "EVENT_SEQUENCE",
  "FORECAST_OUTLOOK",
  "SURVEY_REPORT",
  "RULE_ELIGIBILITY",
  "DIRECT_COMPARISON",
]);

function qualifierCount(text: string): number {
  return (
    text.match(
      /\b(but|while|however|although|unless|only|if|before|after|until|despite|whereas|may|might|can|could|must|all|none|no|not|never|always|highest|lowest|more|less|at least|at most)\b/giu,
    ) ?? []
  ).length;
}

function visibleBurden(question: ReturnType<typeof generateStcV22Question>): number {
  const stemWords = question.stem.trim().split(/\s+/u).length;
  const conclusionWords = question.conclusions
    .map((value) => value.trim().split(/\s+/u).length)
    .reduce((sum, value) => sum + value, 0);
  const qualifiers = qualifierCount([question.stem, ...question.conclusions].join(" "));
  const sentences = Math.max(1, (question.stem.match(/[.!?।]/gu) ?? []).length);

  let score = 0;
  if (stemWords >= 18) score += 1;
  if (stemWords >= 30) score += 1;
  if (conclusionWords >= 18) score += 1;
  if (qualifiers >= 2) score += 1;
  if (qualifiers >= 4) score += 1;
  if (sentences >= 2) score += 1;
  if (HARD_ARCHETYPES.has(question.surfaceArchetype)) score += 1;
  if (["STC-QL-003", "STC-QL-004", "STC-QL-005", "STC-QL-006"].includes(question.qlId)) score += 1;
  return score;
}

let generated = 0;
const hardScores: number[] = [];
const mediumScores: number[] = [];
const easyScores: number[] = [];
const hardOutliers: string[] = [];
const easyOutliers: string[] = [];

for (const qlId of STC_QL_IDS) {
  const templates = STC_V22_TEMPLATES_BY_QL[qlId];

  for (const template of templates) {
    const templateIndex = templates.findIndex((entry) => entry.id === template.id);
    const matchingSeeds: number[] = [];

    // Find deterministic seeds that land on this exact template. Difficulty
    // must then remain the template's structural authority across variants.
    for (let seed = 0; seed < 2048 && matchingSeeds.length < probeSeeds.length; seed += 1) {
      const q = generateStcV22Question({ qlId, locale: "en-IN", seed });
      if (q.templateId === template.id) matchingSeeds.push(seed);
    }
    assert.equal(matchingSeeds.length, probeSeeds.length, `${template.id}: insufficient deterministic variant probes`);

    for (const [probeIndex, seed] of matchingSeeds.entries()) {
      const triplet = locales.map((locale) => generateStcV22Question({ qlId, locale, seed }));
      const english = triplet[0]!;

      assert.equal(english.templateId, template.id);
      assert.equal(english.difficulty, template.difficulty, `${template.id}: generated difficulty drifted from template authority`);

      for (const q of triplet) {
        assert.equal(q.templateId, template.id);
        assert.equal(q.difficulty, template.difficulty, `${template.id}/${q.locale}: locale changed difficulty`);
        assert.equal(q.answerClass, english.answerClass, `${template.id}/${q.locale}: answer-class parity drift`);
        assert.equal(q.correctIndex, english.correctIndex, `${template.id}/${q.locale}: correct-index parity drift`);
        generated++;
      }

      const score = visibleBurden(english);
      if (template.difficulty === "EASY") {
        easyScores.push(score);
        if (score > 6) easyOutliers.push(`${template.id}/probe${probeIndex}: EASY visible burden ${score}`);
      } else if (template.difficulty === "MEDIUM") {
        mediumScores.push(score);
      } else {
        hardScores.push(score);
        if (score < 3) hardOutliers.push(`${template.id}/probe${probeIndex}: HARD visible burden ${score}`);
      }
    }
  }
}

assert.deepEqual(easyOutliers, [], `Easy calibration outliers: ${easyOutliers.join("; ")}`);
assert.deepEqual(hardOutliers, [], `Hard calibration outliers: ${hardOutliers.join("; ")}`);

const avg = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
assert.ok(avg(hardScores) > avg(mediumScores), `Hard average burden must exceed Medium: ${avg(hardScores)} <= ${avg(mediumScores)}`);
assert.ok(avg(mediumScores) >= avg(easyScores), `Medium average burden must not be below Easy: ${avg(mediumScores)} < ${avg(easyScores)}`);

console.log(JSON.stringify({
  status: "PASS_STC_001_DEEP_AUDIT_WAVE2",
  templateCount: STC_QL_IDS.reduce((sum, qlId) => sum + STC_V22_TEMPLATES_BY_QL[qlId].length, 0),
  generated,
  difficultyProbe: {
    easyAverageBurden: avg(easyScores),
    mediumAverageBurden: avg(mediumScores),
    hardAverageBurden: avg(hardScores),
    seedDrivenDifficulty: false,
    localeDrivenDifficulty: false,
  },
}, null, 2));
