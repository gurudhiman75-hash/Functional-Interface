import assert from "node:assert/strict";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP_IDS, type SifScenarioAuthority } from "./types.ts";
import { solveSifScenario } from "./solver.ts";

const ADVANCED_MECHANISMS = new Set([
  "CONTEXT_SYNTHESIS",
  "CONDITIONAL_DIRECTION",
  "MULTIPLE_FACTOR",
  "SUPPORT_THRESHOLD",
  "SCOPE_CONTROL",
  "TIME_SEQUENCE",
  "ADVANCED_PARAGRAPH",
  "MIXED",
]);

function visiblePresentationBurden(authority: SifScenarioAuthority): number {
  const statement = authority.statement["en-IN"];
  const wordCount = statement.trim().split(/\s+/u).length;
  const sentenceCount = Math.max(1, (statement.match(/[.!?]/gu) ?? []).length);
  const qualifierCount = (
    statement.match(/\b(but|while|provided|if|only|unless|before|after|until|however|without|not|no|yet|although|whereas|pending|except|despite|whether)\b/giu) ?? []
  ).length;

  if (
    authority.mechanisms.includes("STATED_POSITION")
    && wordCount >= 20
    && qualifierCount >= 1
  ) return 2;

  if (
    authority.mechanisms.includes("ADVANCED_PARAGRAPH")
    && wordCount >= 30
    && sentenceCount >= 3
  ) return 2;

  if (
    authority.mechanisms.includes("MIXED")
    && wordCount >= 29
    && sentenceCount >= 3
  ) return 2;

  return 0;
}

function reasoningBurden(authority: SifScenarioAuthority, answer: string): number {
  const factBurden = Math.min(3, authority.facts.length);
  const mechanismBurden = Math.min(3, authority.mechanisms.filter((m) => m !== "MIXED").length);
  const advancedBurden = authority.mechanisms.some((m) => ADVANCED_MECHANISMS.has(m)) ? 1 : 0;
  const decisionBurden =
    answer === "BOTH" ? 2
      : answer === "NEITHER" ? 2
        : answer === "EITHER" ? 3
          : 1;
  return factBurden + mechanismBurden + advancedBurden + decisionBurden + visiblePresentationBurden(authority);
}

function assertExplanationSpecificity(authority: SifScenarioAuthority, answer: string): void {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const explanation = authority.explanation[locale];
    assert.ok(explanation.trim().length >= 45, `${authority.id}/${locale}: explanation too thin`);

    // Every two-inference explanation must visibly resolve both candidate
    // positions or explicitly resolve the final answer class.
    const resolvesBoth = /\bI\b|अनुमान I|ਅਨੁਮਾਨ I/u.test(explanation)
      && /\bII\b|अनुमान II|ਅਨੁਮਾਨ II/u.test(explanation);
    const resolvesClass =
      /both|neither|either|only I|only II|only Inference I|only Inference II|both Inference I and Inference II|neither Inference I nor Inference II|either Inference I or Inference II|दोनों|न I|न II|केवल I|केवल II|केवल अनुमान I|केवल अनुमान II|अनुमान I और II दोनों|न अनुमान I.*न अनुमान II|अनुमान I या II|कोई भी अनुमान|ਦੋਵੇਂ|ਨਾ I|ਨਾ II|ਕੇਵਲ I|ਕੇਵਲ II|ਕੇਵਲ ਅਨੁਮਾਨ I|ਕੇਵਲ ਅਨੁਮਾਨ II|ਅਨੁਮਾਨ I ਅਤੇ II ਦੋਵੇਂ|ਨਾ ਅਨੁਮਾਨ I.*ਨਾ ਅਨੁਮਾਨ II|ਅਨੁਮਾਨ I ਜਾਂ II|ਕੋਈ ਵੀ ਅਨੁਮਾਨ/ui.test(explanation);

    const resolvesOnlyByContrast =
      (answer === "ONLY_I" || answer === "ONLY_II")
      && /but|however|while|does not|cannot|not stated|not given|no .*evidence|पर|लेकिन|नहीं|ਪਰ|ਨਹੀਂ/ui.test(explanation);

    assert.ok(
      resolvesBoth || resolvesClass || resolvesOnlyByContrast,
      `${authority.id}/${locale}: explanation does not resolve the two-inference decision`,
    );
  }
}

let authorityCount = 0;
let easy = 0;
let medium = 0;
let hard = 0;
let invalidCandidates = 0;
const calibrationOutliers: string[] = [];

for (const cpId of SIF_CP_IDS) {
  const authorities = listSifAuthorities(cpId);
  assert.ok(authorities.length > 0, `${cpId}: missing authority pool`);

  for (const authority of authorities) {
    authorityCount++;
    const answer = solveSifScenario(authority);
    const burden = reasoningBurden(authority, answer);

    if (authority.difficulty === "EASY") {
      easy++;
      if (burden > 6) calibrationOutliers.push(`${authority.id}: EASY burden ${burden} > 6`);
    } else if (authority.difficulty === "MEDIUM") {
      medium++;
      if (burden < 3) calibrationOutliers.push(`${authority.id}: MEDIUM burden ${burden} < 3`);
    } else {
      hard++;
      if (burden < 5) calibrationOutliers.push(`${authority.id}: HARD burden ${burden} < 5`);
    }

    for (const candidate of authority.candidates) {
      if (candidate.follows) continue;
      invalidCandidates++;

      // In an EITHER authority, both individual candidates are intentionally
      // possible but unresolved; they are not ordinary wrong-answer distractors.
      if (answer !== "EITHER") {
        assert.ok(
          candidate.distractorType,
          `${authority.id}/${candidate.id}: unsupported candidate lacks distractor provenance`,
        );
      }

      assert.ok(
        candidate.supportFactIds.length > 0,
        `${authority.id}/${candidate.id}: unsupported candidate has no declared evidence anchor`,
      );
    }

    assertExplanationSpecificity(authority, answer);

    assert.ok(
      ["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"].includes(answer),
      `${authority.id}: invalid answer class ${answer}`,
    );
  }
}

assert.ok(easy > 0, "SIF-001 has no Easy authorities");
assert.ok(medium > 0, "SIF-001 has no Medium authorities");
assert.ok(hard > 0, "SIF-001 has no Hard authorities");
assert.deepEqual(
  calibrationOutliers,
  [],
  `Difficulty calibration outliers (${calibrationOutliers.length}): ${calibrationOutliers.join("; ")}`,
);

console.log(JSON.stringify({
  status: "PASS_SIF_001_DEEP_AUDIT_WAVE2",
  authorityCount,
  difficultyCounts: { easy, medium, hard },
  invalidCandidatesChecked: invalidCandidates,
  explanationSpecificity: "BOTH_INFERENCES_OR_FINAL_CLASS_EXPLICIT",
}, null, 2));
