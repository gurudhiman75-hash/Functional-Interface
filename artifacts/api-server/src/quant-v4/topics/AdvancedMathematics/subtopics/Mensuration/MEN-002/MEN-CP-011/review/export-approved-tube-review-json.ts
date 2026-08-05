import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MEN_CP_011_FOUNDATION_PROTOTYPES } from "../../cp011-foundation/registry";
import { generateMenCp011FoundationPrototype } from "../../cp011-foundation/runtime";

const SOURCE_AUTHORITY = "New-main@1245b2a95da0243da85d4826949b60e49ac0e74a";
const DIAGRAM_AUTHORITY = "TUBE_EXAMTREE_APPROVED_V1";
const SAMPLE_COUNT_PER_PROTOTYPE = 12;

const records = MEN_CP_011_FOUNDATION_PROTOTYPES.flatMap((definition) =>
  Array.from({ length: SAMPLE_COUNT_PER_PROTOTYPE }, (_, index) => {
    const sampleNumber = index + 1;
    const seed = `approved-tube-owner-review:${definition.prototypeId}:${sampleNumber}`;
    const question = generateMenCp011FoundationPrototype(definition.prototypeId, seed);
    return {
      reviewId: `${definition.prototypeId}::${sampleNumber}`,
      sampleNumber,
      definition: {
        prototypeId: definition.prototypeId,
        solveMode: definition.solveMode,
        target: definition.target,
        representation: definition.representation,
        disposition: definition.disposition,
      },
      question: {
        packageId: question.packageId,
        canonicalProblemId: question.canonicalProblemId,
        permanentQlId: question.permanentQlId,
        waveId: question.waveId,
        prototypeId: question.prototypeId,
        solveMode: question.solveMode,
        language: question.language,
        seed: question.seed,
        difficulty: question.difficulty,
        target: question.target,
        piPolicy: question.piPolicy,
        stem: question.stem,
        options: question.options.map((option) => ({
          label: option.label,
          display: option.display,
          isCorrect: option.isCorrect,
          misconceptionId: option.misconceptionId,
        })),
        correctIndex: question.correctIndex,
        answer: question.answer,
        unit: question.unit,
        explanation: {
          keyRule: question.explanation.keyRule,
          steps: question.explanation.steps.map((step) => ({ ...step })),
          shortcut: question.explanation.shortcut,
          traps: [...question.explanation.traps],
        },
        diagram: {
          kind: question.diagram.kind,
          svg: question.diagram.svg,
          accessibleText: question.diagram.accessibleText,
          visibleLabels: [...question.diagram.visibleLabels],
          notToScale: question.diagram.notToScale,
        },
        state: {
          representation: question.state.representation,
          outerRadius: question.state.outerRadius.toString(),
          innerRadius: question.state.innerRadius.toString(),
          height: question.state.height.toString(),
          thickness: question.state.thickness.toString(),
          outerDiameter: question.state.outerDiameter.toString(),
          innerDiameter: question.state.innerDiameter.toString(),
          ringCoefficient: question.state.ringCoefficient.toString(),
          surfaceLedger: question.state.surfaceLedger.map((entry) => ({ ...entry })),
        },
        verification: { ...question.verification },
        validation: {
          valid: question.validation.valid,
          checks: question.validation.checks.map((check) => ({ ...check })),
        },
        reviewStatus: question.reviewStatus,
        questionBankStatus: question.questionBankStatus,
        testEligibility: question.testEligibility,
        publiclyPublishable: question.publiclyPublishable,
        questionStudioDiscoverable: question.questionStudioDiscoverable,
      },
    };
  }),
);

const payload = {
  meta: {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    chapter: "Surface Exposure, Open/Closed & Hollow Solids",
    wave: "MEN-CP-011-FOUNDATION-WAVE-01",
    sourceAuthority: SOURCE_AUTHORITY,
    diagramAuthority: DIAGRAM_AUTHORITY,
    permanentQlCount: 0,
    prototypeCount: MEN_CP_011_FOUNDATION_PROTOTYPES.length,
    sampleCountPerPrototype: SAMPLE_COUNT_PER_PROTOTYPE,
    recordCount: records.length,
    lifecycle: {
      reviewStatus: "UNREVIEWED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  },
  records,
};

if (payload.meta.prototypeCount !== 4 || payload.meta.recordCount !== 48) {
  throw new Error(`Unexpected review inventory: ${payload.meta.prototypeCount} prototypes and ${payload.meta.recordCount} records.`);
}
if (!records.every((record) => record.question.validation.valid && record.question.verification.valid)) {
  throw new Error("Every review record must retain valid runtime and independent proof.");
}
if (!records.every((record) => record.question.permanentQlId === null)) {
  throw new Error("The approved foundation review may not allocate permanent QLs.");
}
if (!records.every((record) => /^(Think|Picture)\b/.test(record.question.explanation.keyRule))) {
  throw new Error("Every explanation must begin with a physical visual anchor.");
}
if (!records.every((record) => record.question.explanation.steps.every((step) => step.body.includes("Unit check:")))) {
  throw new Error("Every worked step must retain its unit check.");
}
if (!records.every((record) => record.question.explanation.traps.every((trap) => /\[[A-Z0-9_]+\]$/.test(trap)))) {
  throw new Error("Every wrong-option diagnosis must end with a public trap code.");
}
if (!records.every((record) => {
  const svg = record.question.diagram.svg;
  return record.question.diagram.notToScale &&
    svg.includes(`data-diagram-version="${DIAGRAM_AUTHORITY}"`) &&
    svg.includes('data-view="single-closed-tube"') &&
    svg.includes('data-closure="uncut-wall"') &&
    svg.includes('data-background="white"') &&
    svg.includes('data-region="top-outer-ellipse"') &&
    svg.includes('data-region="top-inner-ellipse"') &&
    svg.includes('data-region="bottom-outer-ellipse"') &&
    svg.includes('data-region="bottom-inner-hidden-ellipse"') &&
    svg.includes('data-region="hidden-inner-left-wall"') &&
    svg.includes('data-region="hidden-inner-right-wall"') &&
    svg.includes('data-region="variable-legend"') &&
    svg.includes('data-position="outside-right"') &&
    !svg.includes('data-view="end-cross-section"') &&
    !svg.includes('data-view="longitudinal-section"') &&
    !svg.includes('data-role="radius-vertical-guide"') &&
    !/fill="#dfe9ff"|fill="#c7d8ff"|fill="#6366f1"/.test(svg);
})) {
  throw new Error("Every review record must retain the approved single uncut ExamTree tube topology.");
}
if (!records.every((record) => {
  const { representation, innerRadius } = record.question.state;
  const svg = record.question.diagram.svg;
  if (representation === "DIAMETERS") {
    return svg.includes('data-dimension="outer-diameter" data-orientation="horizontal"') &&
      svg.includes('data-dimension="inner-diameter" data-orientation="horizontal"') &&
      !svg.includes('data-dimension="outer-radius"') &&
      !svg.includes('data-dimension="inner-radius"');
  }
  if (representation === "OUTER_RADIUS_AND_THICKNESS") {
    return svg.includes('data-dimension="outer-radius" data-orientation="horizontal"') &&
      svg.includes('data-dimension="inner-radius" data-orientation="horizontal"') &&
      svg.includes('data-dimension="wall-thickness" data-orientation="horizontal" data-alignment="top-rim"');
  }
  if (representation === "INVERSE_INNER_RADIUS") {
    return svg.includes('data-dimension="outer-radius" data-orientation="horizontal"') &&
      svg.includes('data-dimension="inner-radius" data-orientation="horizontal"') &&
      svg.includes("r = ?") &&
      !svg.includes(`r = ${innerRadius} cm`);
  }
  return svg.includes('data-dimension="outer-radius" data-orientation="horizontal"') &&
    svg.includes('data-dimension="inner-radius" data-orientation="horizontal"') &&
    !svg.includes('data-dimension="outer-diameter"') &&
    !svg.includes('data-dimension="inner-diameter"');
})) {
  throw new Error("The approved diagram must retain representation-correct top-face measurements and inverse unknowns.");
}

const outputPath = resolve("dist/review/MEN-CP-011-Approved-Tube-Review-Source.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${outputPath}`);
console.log(`Exported ${payload.meta.recordCount} approved review records from ${payload.meta.sourceAuthority}.`);
