export const TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2 = Object.freeze({
  version: "TRG001_EXTERNAL_MATERIAL_REMEDIATION_P2" as const,
  candidateId: "TRG-001-P2-EXT-TRIPLE-ANGLE" as const,
  sourceAnchor: "Disha SSC Mathematics Guide p410 Q29" as const,
  targetPackage: "TRG-001" as const,
  targetCp: "TRG-CP-006" as const,
  permanentQlBinding: null,
  status: "AUDIT_REMEDIATION_CANDIDATE" as const,
  questionStudioDiscoverable: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

function hash(text: string) {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let i = values.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

type Option = Readonly<{
  label: "A" | "B" | "C" | "D";
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}>;

function makeOptions(seed: string, correct: string, distractors: Array<readonly [string, string]>) {
  const raw = [
    { display: correct, isCorrect: true, misconceptionId: null as string | null },
    ...distractors.map(([display, misconceptionId]) => ({ display, isCorrect: false, misconceptionId })),
  ];
  const options = shuffle(seed, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    ...entry,
  })) as Option[];
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

export function generateTrg001ExternalTripleAngleCandidate(seed: string) {
  const variant = hash(`${seed}|triple-angle`) % 2;

  if (variant === 0) {
    const correct = "cos 3θ";
    const built = makeOptions(`${seed}|identity-options`, correct, [
      ["cos 2θ", "CONFUSED_DOUBLE_ANGLE"],
      ["−cos 3θ", "SIGN_REVERSED"],
      ["sin 3θ", "FUNCTION_SWAP"],
    ]);
    return Object.freeze({
      candidateId: TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.candidateId,
      seed,
      solveMode: "identifyCosTripleAngleFromCubicExpression" as const,
      difficulty: "Medium" as const,
      target: "RELATION" as const,
      stem: "Which expression is equal to 4cos³θ − 3cosθ?",
      options: built.options,
      correctIndex: built.correctIndex,
      answer: correct,
      explanation: Object.freeze({
        keyRule: "Use cos 3θ = 4cos³θ − 3cosθ.",
        steps: Object.freeze([
          Object.freeze({ title: "Step 1", body: "Compare the given expression with the standard triple-angle identity." }),
          Object.freeze({ title: "Answer", body: "Therefore, 4cos³θ − 3cosθ = cos 3θ." }),
        ]),
      }),
      sourceEvidence: Object.freeze({
        kind: "UPLOADED_SSC_BOOK_ARCHETYPE" as const,
        sourceAnchor: TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.sourceAnchor,
        exactCopy: false as const,
      }),
      questionStudioDiscoverable: false as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    });
  }

  const correct = "−cos 3θ";
  const built = makeOptions(`${seed}|reverse-options`, correct, [
    ["cos 3θ", "SIGN_REVERSED"],
    ["−cos 2θ", "CONFUSED_DOUBLE_ANGLE"],
    ["sin 3θ", "FUNCTION_SWAP"],
  ]);
  return Object.freeze({
    candidateId: TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.candidateId,
    seed,
    solveMode: "identifyNegativeCosTripleAngleFromCubicExpression" as const,
    difficulty: "Medium" as const,
    target: "RELATION" as const,
    stem: "Simplify 3cosθ − 4cos³θ.",
    options: built.options,
    correctIndex: built.correctIndex,
    answer: correct,
    explanation: Object.freeze({
      keyRule: "Use cos 3θ = 4cos³θ − 3cosθ.",
      steps: Object.freeze([
        Object.freeze({ title: "Step 1", body: "3cosθ − 4cos³θ is the negative of 4cos³θ − 3cosθ." }),
        Object.freeze({ title: "Answer", body: "Hence, 3cosθ − 4cos³θ = −cos 3θ." }),
      ]),
    }),
    sourceEvidence: Object.freeze({
      kind: "UPLOADED_SSC_BOOK_ARCHETYPE" as const,
      sourceAnchor: TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.sourceAnchor,
      exactCopy: false as const,
    }),
    questionStudioDiscoverable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
}
