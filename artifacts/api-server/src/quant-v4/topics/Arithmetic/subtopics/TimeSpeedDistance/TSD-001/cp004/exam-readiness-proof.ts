import type { TsdCp004GeneratedQuestion } from "./runtime-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hasBadNumericArticle(stem: string): boolean {
  return /\b(?:a|A)\s+(?:8[\d,]*(?:\.\d+)?|11(?:\.\d+)?|18(?:\.\d+)?)(?=\s|$)/.test(stem);
}

export function assertCp004FinalExamReadiness(
  audit: readonly TsdCp004GeneratedQuestion[],
  selected: readonly TsdCp004GeneratedQuestion[],
): void {
  assert(audit.length > 0 && selected.length > 0, "CP004 exam-readiness proof requires generated questions");

  assert(audit.every((row) => !hasBadNumericArticle(row.stem)), "numeric article error such as 'a 84 km' leaked into CP004 stems");
  assert(selected.every((row) => !hasBadNumericArticle(row.stem)), "numeric article error leaked into the 60-question review surface");

  assert(
    audit.every((row) => !/How much distance does the faster vehicle gain in one hour\?/i.test(row.stem)),
    "relative-speed stem asks for distance while the answer unit is speed",
  );

  const startDelayRows = audit.filter((row) => row.solveMode === "findStartDelayFromCatchUpState");
  assert(startDelayRows.length > 0, "start-delay solve mode missing from CP004 audit");
  assert(
    startDelayRows.every((row) => /same (?:point|checkpoint)/i.test(row.stem)),
    "start-delay question does not establish a common starting point/checkpoint",
  );

  const oppositeRelativeDistanceRows = audit.filter(
    (row) => row.solveMode === "findRelativeDistanceCoveredInGivenTime" && row.input.directionCase !== "SAME",
  );
  assert(oppositeRelativeDistanceRows.length > 0, "opposite relative-distance mode missing from CP004 audit");
  assert(
    oppositeRelativeDistanceRows.every((row) => /opposite|oppositely/i.test(row.stem)),
    "relative-distance question does not state the opposite-direction relation explicitly",
  );

  const oppositeTargetRows = audit.filter(
    (row) => row.solveMode === "findSpeedNeededToAvoidOrCauseMeeting" && row.input.directionCase !== "SAME",
  );
  assert(oppositeTargetRows.length > 0, "opposite target-meeting mode missing from CP004 audit");
  assert(
    oppositeTargetRows.every((row) => /towards|approach/i.test(row.stem)),
    "target-meeting question does not state the closing direction explicitly",
  );

  assert(
    audit.every((row) => !row.stem.includes("The relative-motion equation for two vehicles")),
    "engine-like relative-motion equation wording leaked into learner stems",
  );
  assert(
    audit.every((row) => !row.stem.includes("route is shared until first meeting")),
    "awkward route-sharing wording leaked into learner stems",
  );

  const selectedQl048 = selected.filter((row) => row.permanentQlId === "TSD-QL-048");
  assert(selectedQl048.length === 6, "expected six TSD-QL-048 review questions");
  assert(
    selectedQl048.every((row) => row.solution.unit === "SPEED" && !/How much distance/i.test(row.stem)),
    "TSD-QL-048 review contains a distance/speed semantic mismatch",
  );
}
