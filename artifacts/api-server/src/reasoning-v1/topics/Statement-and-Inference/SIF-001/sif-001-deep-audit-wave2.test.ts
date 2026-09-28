import assert from "node:assert/strict";
import { listSifAuthorities } from "./authorities.ts";
import { SIF_CP_IDS, type SifScenarioAuthority } from "./types.ts";
import { solveSifScenario } from "./solver.ts";

const ADVANCED_MECHANISMS = new Set([
  "CONTEXT_SYNTHESIS",
  "DATA_COMPARISON",
  "CONDITIONAL_DIRECTION",
  "MULTIPLE_FACTOR",
  "SUPPORT_THRESHOLD",
  "SCOPE_CONTROL",
  "TIME_SEQUENCE",
  "STATED_POSITION",
  "ADVANCED_PARAGRAPH",
  "MIXED",
]);

function reasoningBurden(authority: SifScenarioAuthority, answer: string): number {
  const factBurden = Math.min(3, authority.facts.length);
  const mechanismBurden = Math.min(3, authority.mechanisms.filter((m) => m !== "MIXED").length);
  const advancedBurden = authority.mechanisms.some((m) => ADVANCED_MECHANISMS.has(m)) ? 1 : 0;
  const decisionBurden =
    answer === "BOTH" ? 2
      : answer === "NEITHER" ? 2
        : answer === "EITHER" ? 3
          : 1;
  return factBurden + mechanismBurden + advancedBurden + decisionBurden;
}

function assertExplanationSpecificity(authority: SifScenarioAuthority): void {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const explanation = authority.explanation[locale];
    assert.ok(explanation.trim().length >= 45, `${authority.id}/${locale}: explanation too thin`);

    // Every two-inference explanation must visibly resolve both candidate
    // positions or explicitly resolve the final answer class.
    const resolvesBoth = /\bI\b|अनुमान I|ਅਨੁਮਾਨ I/u.test(explanation)
      && /\bII\b|अनुमान II|ਅਨੁਮਾਨ II/u.test(explanation);
    const resolvesClass =
      /both|neither|either|only I|only II|दोनों|न I|न II|केवल I|केवल II|कोई भी अनुमान|ਦੋਵੇਂ|ਨਾ I|ਨਾ II|ਕੇਵਲ I|ਕੇਵਲ II|ਕੋਈ ਵੀ ਅਨੁਮਾਨ/ui.test(explanation);

    assert.ok(
      resolvesBoth || resolvesClass,
      `${authority.id}/${locale}: explanation does not explicitly resolve the two-inference decision`,
    );
  }
}

let authorityCount = 0;
let easy = 0;
let medium = 0;
let hard = 0;
let invalidCandidates = 0;

for (const cpId of SIF_CP_IDS) {
  const authorities = listSifAuthorities(cpId);
  assert.ok(authorities.length > 0, `${cpId}: missing authority pool`);

  for (const authority of authorities) {
    authorityCount++;
    const answer = solveSifScenario(authority);
    const burden = reasoningBurden(authority, answer);

    if (authority.difficulty === "EASY") {
      easy++;
      assert.ok(
        burden <= 6,
        `${authority.id}: Easy authority has excessive reasoning burden (${burden})`,
      );
    } else if (authority.difficulty === "MEDIUM") {
      medium++;
      assert.ok(
        burden >= 3,
        `${authority.id}: Medium authority is structurally too thin (${burden})`,
      );
    } else {
      hard++;
      assert.ok(
        burden >= 5,
        `${authority.id}: Hard authority lacks structural reasoning burden (${burden})`,
      );
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

    assertExplanationSpecificity(authority);

    assert.ok(
      ["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"].includes(answer),
      `${authority.id}: invalid answer class ${answer}`,
    );
  }
}

assert.ok(easy > 0, "SIF-001 has no Easy authorities");
assert.ok(medium > 0, "SIF-001 has no Medium authorities");
assert.ok(hard > 0, "SIF-001 has no Hard authorities");

console.log(JSON.stringify({
  status: "PASS_SIF_001_DEEP_AUDIT_WAVE2",
  authorityCount,
  difficultyCounts: { easy, medium, hard },
  invalidCandidatesChecked: invalidCandidates,
  explanationSpecificity: "BOTH_INFERENCES_OR_FINAL_CLASS_EXPLICIT",
}, null, 2));
