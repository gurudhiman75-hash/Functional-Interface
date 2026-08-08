export const MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY =
  "MEN-CP011-CONICAL-SHELL-OWNERSHIP-AUDIT-V1" as const;

export type MenCp011ConicalOwner =
  | "MEN-CP-008"
  | "MEN-CP-010"
  | "MEN-CP-011"
  | "MEN-CP-012"
  | "MEN-CP-013"
  | "REJECT_UNDERSPECIFIED";

export type MenCp011ConicalTask =
  | "DIRECT_CONE_VOLUME"
  | "DIRECT_CONE_CSA"
  | "DIRECT_CONE_TSA"
  | "DIRECT_CONE_CANVAS_COST"
  | "HOLLOW_CONE_MATERIAL_VOLUME"
  | "BOTH_CURVED_SURFACES"
  | "INNER_LINING_COST"
  | "FRUSTUM_MEASUREMENT"
  | "RECASTING"
  | "DRILLED_CONICAL_VOID";

export type MenCp011ConicalRelation =
  | "DIRECT_SINGLE_CONE"
  | "DIRECT_INNER_CONE_ONLY"
  | "EXPLICIT_SHARED_BASE_INNER_CONE"
  | "DECLARED_SIMILAR_SHARED_BASE_WALL"
  | "UNSPECIFIED_UNIFORM_THICKNESS"
  | "TRUNCATED_CONE"
  | "CONSERVATION_TRANSFORMATION"
  | "COMPOSITE_REMOVAL";

export interface MenCp011ConeDimensions {
  radius: bigint;
  height: bigint;
  slantHeight?: bigint;
}

export interface MenCp011ConicalScenario {
  scenarioId: string;
  task: MenCp011ConicalTask;
  relation: MenCp011ConicalRelation;
  outer?: MenCp011ConeDimensions;
  inner?: MenCp011ConeDimensions;
  shellContext: boolean;
  expectedOwner: MenCp011ConicalOwner;
}

export interface MenCp011ConicalOwnershipDecision {
  authority: typeof MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY;
  scenarioId: string;
  owner: MenCp011ConicalOwner;
  executable: boolean;
  reason: string;
  checks: Array<{ name: string; passed: boolean; message: string }>;
}

function positiveDimensions(
  label: string,
  dimensions: MenCp011ConeDimensions | undefined,
) {
  if (!dimensions) {
    return {
      name: `${label} dimensions supplied`,
      passed: false,
      message: `${label} cone dimensions are required.`,
    };
  }
  return {
    name: `${label} dimensions positive`,
    passed:
      dimensions.radius > 0n &&
      dimensions.height > 0n &&
      (dimensions.slantHeight === undefined || dimensions.slantHeight > 0n),
    message: `${label} radius, height and any supplied slant height must be positive.`,
  };
}

function slantConsistency(
  label: string,
  dimensions: MenCp011ConeDimensions | undefined,
) {
  if (!dimensions || dimensions.slantHeight === undefined) {
    return {
      name: `${label} slant-height consistency`,
      passed: true,
      message: `No ${label.toLowerCase()} slant height was supplied, so no Pythagorean check is required.`,
    };
  }
  const expectedSquare =
    dimensions.radius * dimensions.radius +
    dimensions.height * dimensions.height;
  return {
    name: `${label} slant-height consistency`,
    passed: dimensions.slantHeight * dimensions.slantHeight === expectedSquare,
    message: `${label} slant height must satisfy l² = r² + h².`,
  };
}

function shellContainmentChecks(scenario: MenCp011ConicalScenario) {
  const checks = [
    positiveDimensions("Outer", scenario.outer),
    positiveDimensions("Inner", scenario.inner),
    slantConsistency("Outer", scenario.outer),
    slantConsistency("Inner", scenario.inner),
  ];

  if (scenario.outer && scenario.inner) {
    checks.push(
      {
        name: "inner radius below outer radius",
        passed: scenario.inner.radius < scenario.outer.radius,
        message: "A conical void must have smaller base radius than the outer cone.",
      },
      {
        name: "inner height contained by outer height",
        passed: scenario.inner.height <= scenario.outer.height,
        message: "A shared-base inner cavity must not extend beyond the outer apex.",
      },
    );
  }

  if (
    scenario.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL" &&
    scenario.outer &&
    scenario.inner
  ) {
    checks.push({
      name: "declared similar-wall ratio",
      passed:
        scenario.inner.radius * scenario.outer.height ===
        scenario.outer.radius * scenario.inner.height,
      message:
        "For parallel conical walls sharing the base plane, r/R must equal h/H.",
    });
  }

  return checks;
}

function decision(
  scenario: MenCp011ConicalScenario,
  owner: MenCp011ConicalOwner,
  reason: string,
  checks: MenCp011ConicalOwnershipDecision["checks"],
): MenCp011ConicalOwnershipDecision {
  return {
    authority: MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
    scenarioId: scenario.scenarioId,
    owner,
    executable:
      owner !== "REJECT_UNDERSPECIFIED" && checks.every((check) => check.passed),
    reason,
    checks,
  };
}

export function classifyMenCp011ConicalScenario(
  scenario: MenCp011ConicalScenario,
): MenCp011ConicalOwnershipDecision {
  const outerChecks = [
    positiveDimensions("Outer", scenario.outer),
    slantConsistency("Outer", scenario.outer),
  ];

  if (
    scenario.task === "DIRECT_CONE_VOLUME" ||
    scenario.task === "DIRECT_CONE_CSA" ||
    scenario.task === "DIRECT_CONE_TSA" ||
    scenario.task === "DIRECT_CONE_CANVAS_COST"
  ) {
    return decision(
      scenario,
      "MEN-CP-008",
      "The decisive reasoning is direct measurement of one intact cone; no hollow-surface ledger is required.",
      outerChecks,
    );
  }

  if (
    scenario.task === "INNER_LINING_COST" &&
    scenario.relation === "DIRECT_INNER_CONE_ONLY"
  ) {
    const innerChecks = [
      positiveDimensions("Inner", scenario.inner),
      slantConsistency("Inner", scenario.inner),
    ];
    return decision(
      scenario,
      "MEN-CP-008",
      "When only one inner cone is measured directly, lining is a cost representation of cone curved surface area rather than shell reasoning.",
      innerChecks,
    );
  }

  if (
    scenario.task === "FRUSTUM_MEASUREMENT" ||
    scenario.relation === "TRUNCATED_CONE"
  ) {
    return decision(
      scenario,
      "MEN-CP-010",
      "A truncated cone is a frustum; frustum dimensions and formula selection are decisive.",
      outerChecks,
    );
  }

  if (
    scenario.task === "RECASTING" ||
    scenario.relation === "CONSERVATION_TRANSFORMATION"
  ) {
    return decision(
      scenario,
      "MEN-CP-012",
      "The decisive transformation is conservation of material between solids.",
      outerChecks,
    );
  }

  if (
    scenario.task === "DRILLED_CONICAL_VOID" ||
    scenario.relation === "COMPOSITE_REMOVAL"
  ) {
    return decision(
      scenario,
      "MEN-CP-013",
      "A drilled or removed cone is owned by composite-solid subtraction when no shell or vessel relation governs the cavity.",
      shellContainmentChecks(scenario),
    );
  }

  if (scenario.relation === "UNSPECIFIED_UNIFORM_THICKNESS") {
    return decision(
      scenario,
      "REJECT_UNDERSPECIFIED",
      "A single thickness value does not justify r = R − t and h = H − t for a cone. The normal-wall, radial and axial offsets are different geometric quantities.",
      [
        ...outerChecks,
        {
          name: "explicit inner relation supplied",
          passed: false,
          message:
            "Supply inner radius and height, or declare a valid similarity/parallel-wall relation.",
        },
      ],
    );
  }

  if (
    scenario.task === "HOLLOW_CONE_MATERIAL_VOLUME" ||
    scenario.task === "BOTH_CURVED_SURFACES" ||
    scenario.task === "INNER_LINING_COST"
  ) {
    const checks = shellContainmentChecks(scenario);
    const permittedRelation =
      scenario.relation === "EXPLICIT_SHARED_BASE_INNER_CONE" ||
      scenario.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL";
    checks.push({
      name: "shell relation explicitly authorised",
      passed: permittedRelation && scenario.shellContext,
      message:
        "CP-011 requires an explicit inner–outer shell/vessel relation, not a standalone cone calculation.",
    });
    return decision(
      scenario,
      permittedRelation ? "MEN-CP-011" : "REJECT_UNDERSPECIFIED",
      permittedRelation
        ? "Outer-minus-inner material or selected inner/outer conical surfaces are the decisive shell reasoning."
        : "The scenario does not provide a valid CP-011 shell relation.",
      checks,
    );
  }

  return decision(
    scenario,
    "REJECT_UNDERSPECIFIED",
    "No ownership rule matched the supplied conical scenario.",
    [],
  );
}

export const MEN_CP011_CONICAL_OWNERSHIP_FIXTURES: readonly MenCp011ConicalScenario[] = [
  {
    scenarioId: "CO-01-DIRECT-CONE-VOLUME",
    task: "DIRECT_CONE_VOLUME",
    relation: "DIRECT_SINGLE_CONE",
    outer: { radius: 3n, height: 4n, slantHeight: 5n },
    shellContext: false,
    expectedOwner: "MEN-CP-008",
  },
  {
    scenarioId: "CO-02-DIRECT-CANVAS-COST",
    task: "DIRECT_CONE_CANVAS_COST",
    relation: "DIRECT_SINGLE_CONE",
    outer: { radius: 5n, height: 12n, slantHeight: 13n },
    shellContext: false,
    expectedOwner: "MEN-CP-008",
  },
  {
    scenarioId: "CO-03-DIRECT-INNER-LINING",
    task: "INNER_LINING_COST",
    relation: "DIRECT_INNER_CONE_ONLY",
    inner: { radius: 8n, height: 15n, slantHeight: 17n },
    shellContext: false,
    expectedOwner: "MEN-CP-008",
  },
  {
    scenarioId: "CO-04-FRUSTUM",
    task: "FRUSTUM_MEASUREMENT",
    relation: "TRUNCATED_CONE",
    outer: { radius: 6n, height: 8n, slantHeight: 10n },
    shellContext: false,
    expectedOwner: "MEN-CP-010",
  },
  {
    scenarioId: "CO-05-RECASTING",
    task: "RECASTING",
    relation: "CONSERVATION_TRANSFORMATION",
    outer: { radius: 5n, height: 12n, slantHeight: 13n },
    shellContext: false,
    expectedOwner: "MEN-CP-012",
  },
  {
    scenarioId: "CO-06-DRILLED-CONE",
    task: "DRILLED_CONICAL_VOID",
    relation: "COMPOSITE_REMOVAL",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    inner: { radius: 3n, height: 4n, slantHeight: 5n },
    shellContext: false,
    expectedOwner: "MEN-CP-013",
  },
  {
    scenarioId: "CO-07-EXPLICIT-HOLLOW-CONE",
    task: "HOLLOW_CONE_MATERIAL_VOLUME",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    inner: { radius: 6n, height: 8n, slantHeight: 10n },
    shellContext: true,
    expectedOwner: "MEN-CP-011",
  },
  {
    scenarioId: "CO-08-SIMILAR-PARALLEL-WALL",
    task: "HOLLOW_CONE_MATERIAL_VOLUME",
    relation: "DECLARED_SIMILAR_SHARED_BASE_WALL",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    inner: { radius: 5n, height: 12n, slantHeight: 13n },
    shellContext: true,
    expectedOwner: "MEN-CP-011",
  },
  {
    scenarioId: "CO-09-BOTH-CURVED-SURFACES",
    task: "BOTH_CURVED_SURFACES",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    outer: { radius: 13n, height: 84n, slantHeight: 85n },
    inner: { radius: 5n, height: 12n, slantHeight: 13n },
    shellContext: true,
    expectedOwner: "MEN-CP-011",
  },
  {
    scenarioId: "CO-10-LINING-FROM-SHELL",
    task: "INNER_LINING_COST",
    relation: "DECLARED_SIMILAR_SHARED_BASE_WALL",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    inner: { radius: 5n, height: 12n, slantHeight: 13n },
    shellContext: true,
    expectedOwner: "MEN-CP-011",
  },
  {
    scenarioId: "CO-11-AMBIGUOUS-THICKNESS",
    task: "HOLLOW_CONE_MATERIAL_VOLUME",
    relation: "UNSPECIFIED_UNIFORM_THICKNESS",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    shellContext: true,
    expectedOwner: "REJECT_UNDERSPECIFIED",
  },
  {
    scenarioId: "CO-12-INNER-RADIUS-NOT-SMALLER",
    task: "HOLLOW_CONE_MATERIAL_VOLUME",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    outer: { radius: 5n, height: 12n, slantHeight: 13n },
    inner: { radius: 5n, height: 4n },
    shellContext: true,
    expectedOwner: "REJECT_UNDERSPECIFIED",
  },
  {
    scenarioId: "CO-13-BROKEN-SIMILARITY",
    task: "HOLLOW_CONE_MATERIAL_VOLUME",
    relation: "DECLARED_SIMILAR_SHARED_BASE_WALL",
    outer: { radius: 10n, height: 24n, slantHeight: 26n },
    inner: { radius: 5n, height: 8n },
    shellContext: true,
    expectedOwner: "REJECT_UNDERSPECIFIED",
  },
  {
    scenarioId: "CO-14-BROKEN-SLANT",
    task: "BOTH_CURVED_SURFACES",
    relation: "EXPLICIT_SHARED_BASE_INNER_CONE",
    outer: { radius: 3n, height: 4n, slantHeight: 6n },
    inner: { radius: 1n, height: 2n },
    shellContext: true,
    expectedOwner: "REJECT_UNDERSPECIFIED",
  },
] as const;
