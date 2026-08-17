import {
  generateFigureCompletionPermanentEnglishQuestionV1,
  type FigureCompletionPermanentQlIdV1,
} from "../foundation/spatial/figure-completion-permanent-english-runtime-v1";

const QLS: readonly FigureCompletionPermanentQlIdV1[] = [
  "SPA-QL-031",
  "SPA-QL-032",
  "SPA-QL-033",
  "SPA-QL-034",
];
const REVIEW_PER_QL = 12;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const prototypeCounts: Record<string, number> = {};
let audited = 0;

for (const qlId of QLS) {
  for (let index = 0; index < REVIEW_PER_QL; index += 1) {
    const seed = `FGC-PERMANENT-ENGLISH-REVIEW:${qlId}:${String(index).padStart(4, "0")}`;
    const desiredCorrectOptionIndex = (index % 4) as 0 | 1 | 2 | 3;
    const question = generateFigureCompletionPermanentEnglishQuestionV1({
      qlId,
      seed,
      desiredCorrectOptionIndex,
    });
    const explanation = question.explanation;
    const combined = [
      explanation.observation,
      explanation.rule,
      explanation.application,
      explanation.check,
    ].join(" ").toLowerCase();

    assert(!combined.includes("visible-state relation"), `${qlId}/${seed}: generic visible-state wording is forbidden.`);
    assert(!combined.includes("all visible completion rules together"), `${qlId}/${seed}: generic all-rules wording is forbidden.`);
    assert(!combined.includes("by observing"), `${qlId}/${seed}: rule-free observation wording is forbidden.`);
    assert(explanation.check.includes(`Option ${question.answer}`), `${qlId}/${seed}: answer check must name the actual answer option.`);

    switch (question.prototypeId) {
      case "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY":
        assert(!combined.includes("contour"), `${qlId}/${seed}: learner explanation should say parallel lines, not contour.`);
        assert(explanation.check.includes("direction and spacing"), `${qlId}/${seed}: parallel-line check must name direction and spacing.`);
        break;
      case "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY":
        assert(explanation.check.includes("crossed lines") && explanation.check.includes("dot"), `${qlId}/${seed}: mirror-symmetry check must name both crossed lines and dot.`);
        assert(explanation.application.includes("both centre lines"), `${qlId}/${seed}: mirror application must state both reflections.`);
        break;
      case "FGC-PROT-07-MIRROR-STATE-REVERSAL":
        assert(explanation.check.includes("mirrored position") && explanation.check.includes("filled/outline"), `${qlId}/${seed}: compound mirror-state check must name both required rules.`);
        assert(explanation.rule.includes("filled/outline reversal"), `${qlId}/${seed}: compound state rule must be stated plainly.`);
        break;
      case "FGC-PROT-08-ARC-QUADRANT-SYMMETRY":
        assert(!combined.includes("radial symmetry"), `${qlId}/${seed}: arc explanation should avoid unnecessary technical wording.`);
        assert(explanation.check.includes("both arcs") && explanation.check.includes("diagonal"), `${qlId}/${seed}: arc check must name the decisive visual features.`);
        break;
      case "FGC-PROT-10-SHAPE-CONTACT-STATE":
        assert(explanation.check.includes("filled/outline contacts") && explanation.check.includes("right-angle corner"), `${qlId}/${seed}: contact-state check must name fill states and corner geometry.`);
        assert(explanation.application.includes("filled circle") && explanation.application.includes("outline circle"), `${qlId}/${seed}: contact-state application must map both visible fill states.`);
        break;
    }

    prototypeCounts[question.prototypeId] = (prototypeCounts[question.prototypeId] ?? 0) + 1;
    audited += 1;
  }
}

assert(audited === 48, `FGC permanent English editorial audit expected 48 questions, got ${audited}.`);
for (const requiredPrototype of [
  "FGC-PROT-01-STRAIGHT-CONTINUITY",
  "FGC-PROT-02-CURVED-PATH-CONTINUITY",
  "FGC-PROT-03-JUNCTION-CONTINUITY",
  "FGC-PROT-04-NESTED-CONTOUR-CONTINUITY",
  "FGC-PROT-05-COMPOUND-CONTOUR-MARKER",
  "FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY",
  "FGC-PROT-07-MIRROR-STATE-REVERSAL",
  "FGC-PROT-08-ARC-QUADRANT-SYMMETRY",
  "FGC-PROT-09-COMPONENT-COUNT-ORIENTATION",
  "FGC-PROT-10-SHAPE-CONTACT-STATE",
]) {
  assert((prototypeCounts[requiredPrototype] ?? 0) > 0, `Editorial review pack did not exercise ${requiredPrototype}.`);
}

console.log(JSON.stringify({
  status: "PASS_FGC_001_PERMANENT_ENGLISH_EDITORIAL_V1",
  audited,
  prototypeCounts,
  guarantees: [
    "student-facing checks name the decisive visible rule",
    "generic visible-state/all-rules checks are prohibited",
    "parallel-line wording avoids unnecessary contour terminology",
    "arc wording avoids unnecessary radial-symmetry terminology",
    "compound questions explicitly name both geometry and state requirements",
  ],
}, null, 2));
