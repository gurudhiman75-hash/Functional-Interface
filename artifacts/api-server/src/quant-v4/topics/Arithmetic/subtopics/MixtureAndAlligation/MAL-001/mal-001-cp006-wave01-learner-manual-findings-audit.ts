import {
  generateMalCp006Wave01FinalLearnerAuthorityQuestion,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
} from "./foundation/cp006-wave01-learner-authority-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const allowedMixedDenominators = new Set([2, 3, 4, 5, 8, 10]);
let checked = 0;
let mixedFractionChecks = 0;
let grammarChecks = 0;
let spiritChecks = 0;

for (const prototypeId of MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `mal-cp006-wave01-manual-findings:${prototypeId}:${index}`;
    const question = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
      prototypeId,
      seed,
    );
    const learnerText = [
      question.stem,
      ...question.options,
      ...question.explanation.visibleLines,
      question.explanation.optionalHelp.commonMistake,
      ...question.explanation.optionalHelp.verification,
    ].join(" ");

    assert(
      !/,\s+What\s+/u.test(question.stem),
      `${seed}: comma + capital What survived.`,
    );
    assert(
      !/\blitres (?:goes|is moved [AB]→[AB])\b/iu.test(question.stem),
      `${seed}: technical/plural transfer grammar survived.`,
    );
    assert(
      !/What is the final [a-z]+\s*:\s*[a-z]+ ratio/iu.test(question.stem),
      `${seed}: colon-style ratio wording survived in prose.`,
    );
    assert(
      !/\ba (?:acid|alcohol)-water\b/iu.test(learnerText),
      `${seed}: article error survived.`,
    );
    assert(
      !/\b1 litres\b/iu.test(learnerText),
      `${seed}: singular litre error survived.`,
    );
    grammarChecks += 1;

    assert(
      !/\b\d+(?:\.\d+)?(?:\s+\d+\/\d+)?% spirit mixture\b/iu.test(learnerText),
      `${seed}: bare percent-spirit mixture wording survived.`,
    );
    assert(
      !/\ba mixture that is \d+(?:\.\d+)?(?:\s+\d+\/\d+)?% spirit\b/iu.test(learnerText),
      `${seed}: vague spirit-mixture wording survived.`,
    );
    spiritChecks += 1;

    for (const line of question.explanation.visibleLines) {
      for (const match of line.matchAll(/\b\d+\s+(\d+)\/(\d+)\b/gu)) {
        const denominator = Number(match[2]);
        assert(
          allowedMixedDenominators.has(denominator),
          `${seed}: cumbersome mixed fraction '${match[0]}' survived in visible working.`,
        );
        mixedFractionChecks += 1;
      }
    }

    if (
      prototypeId ===
      "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO"
    ) {
      const working = question.explanation.visibleLines.join(" ");
      assert(
        working.includes("Milk fraction in B"),
        `${seed}: round-trip direct-fraction working missing.`,
      );
      assert(
        !/Milk percentage in B/iu.test(working),
        `${seed}: awkward percentage conversion returned.`,
      );
    }

    checked += 1;
  }
}

assert(checked === 500, `Expected 500 manual-finding checks, got ${checked}.`);
console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP006_WAVE01_MANUAL_LEARNER_FINDINGS",
      checked,
      grammarChecks,
      spiritChecks,
      mixedFractionChecks,
    },
    null,
    2,
  ),
);
