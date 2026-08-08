import assert from "node:assert/strict";
import {
  MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
  MEN_CP011_CONICAL_OWNERSHIP_FIXTURES,
  classifyMenCp011ConicalScenario,
  type MenCp011ConicalOwner,
} from "./conical-ownership-canonical";

const ownerCounts: Record<MenCp011ConicalOwner, number> = {
  "MEN-CP-008": 0,
  "MEN-CP-010": 0,
  "MEN-CP-011": 0,
  "MEN-CP-012": 0,
  "MEN-CP-013": 0,
  REJECT_UNDERSPECIFIED: 0,
};

for (const scenario of MEN_CP011_CONICAL_OWNERSHIP_FIXTURES) {
  const decision = classifyMenCp011ConicalScenario(scenario);
  assert.equal(decision.authority, MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY);
  assert.equal(decision.scenarioId, scenario.scenarioId);
  assert.equal(
    decision.owner,
    scenario.expectedOwner,
    `${scenario.scenarioId} was assigned to ${decision.owner} instead of ${scenario.expectedOwner}: ${decision.reason}`,
  );
  assert.ok(decision.reason.length >= 30);

  if (scenario.expectedOwner === "REJECT_UNDERSPECIFIED") {
    assert.equal(decision.executable, false);
    assert.ok(
      decision.checks.some((check) => !check.passed) ||
        decision.reason.includes("No ownership rule"),
      `${scenario.scenarioId} was rejected without a failed geometry or ownership check.`,
    );
  } else {
    assert.equal(
      decision.executable,
      true,
      `${scenario.scenarioId} should be executable: ${decision.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join(" | ")}`,
    );
    assert.ok(decision.checks.every((check) => check.passed));
  }

  if (decision.owner === "MEN-CP-011") {
    assert.equal(scenario.shellContext, true);
    assert.ok(scenario.outer);
    assert.ok(scenario.inner);
    assert.ok(
      scenario.relation === "EXPLICIT_SHARED_BASE_INNER_CONE" ||
        scenario.relation === "DECLARED_SIMILAR_SHARED_BASE_WALL",
    );
  }

  ownerCounts[decision.owner] += 1;
}

assert.equal(MEN_CP011_CONICAL_OWNERSHIP_FIXTURES.length, 14);
assert.deepEqual(ownerCounts, {
  "MEN-CP-008": 3,
  "MEN-CP-010": 1,
  "MEN-CP-011": 4,
  "MEN-CP-012": 1,
  "MEN-CP-013": 1,
  REJECT_UNDERSPECIFIED: 4,
});

const ambiguousThickness = classifyMenCp011ConicalScenario(
  MEN_CP011_CONICAL_OWNERSHIP_FIXTURES.find(
    (scenario) => scenario.scenarioId === "CO-11-AMBIGUOUS-THICKNESS",
  )!,
);
assert.equal(ambiguousThickness.owner, "REJECT_UNDERSPECIFIED");
assert.match(ambiguousThickness.reason, /single thickness|Rejected before implementation/i);
assert.ok(
  ambiguousThickness.checks.some(
    (check) => check.name === "explicit inner relation supplied" && !check.passed,
  ),
);

console.log(
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
      scenarios: MEN_CP011_CONICAL_OWNERSHIP_FIXTURES.length,
      ownerCounts,
      ambiguousUniformThicknessRejected: true,
      initialArchitectureStillComplete: true,
      permanentQlCount: 0,
    },
    null,
    2,
  ),
);
