import type { ScenarioPremiseSpec, SylScenarioSpec } from "./types";

function scenario(
  scenarioId: string,
  group: SylScenarioSpec["group"],
  sourcePatternId: string,
  topology: SylScenarioSpec["topology"],
  baseDifficulty: SylScenarioSpec["baseDifficulty"],
  premises: readonly ScenarioPremiseSpec[],
): SylScenarioSpec {
  return { scenarioId, group, sourcePatternId, topology, baseDifficulty, premises };
}

export const SYL_SCENARIOS: readonly SylScenarioSpec[] = Object.freeze([
  scenario("SYL-SC-CORE-001", "CORE", "SYL-SRC-SSC-CORE-001", "LINEAR", "EASY", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-CORE-002", "CORE", "SYL-SRC-SSC-CORE-001", "LINEAR", "EASY", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "NO", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-CORE-003", "CORE", "SYL-SRC-BANK-CORE-001", "LINEAR", "EASY", [
    { form: "SOME", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-CORE-004", "CORE", "SYL-SRC-BANK-CORE-001", "LINEAR", "MEDIUM", [
    { form: "SOME", subject: "A", predicate: "B" },
    { form: "NO", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-CORE-005", "CORE", "SYL-SRC-SSC-CORE-001", "CONVERGING", "MEDIUM", [
    { form: "NO", subject: "A", predicate: "B" },
    { form: "ALL", subject: "C", predicate: "A" },
  ]),
  scenario("SYL-SC-CORE-006", "CORE", "SYL-SRC-BANK-CORE-001", "BRANCHING", "MEDIUM", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "SOME", subject: "C", predicate: "A" },
  ]),
  scenario("SYL-SC-CORE-007", "CORE", "SYL-SRC-BANK-CORE-001", "LINEAR", "MEDIUM", [
    { form: "SOME_NOT", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-CORE-008", "CORE", "SYL-SRC-SSC-CORE-001", "BRANCHING", "HARD", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "ALL", subject: "C", predicate: "B" },
    { form: "NO", subject: "B", predicate: "D" },
  ]),
  scenario("SYL-SC-CORE-009", "CORE", "SYL-SRC-BANK-CORE-001", "MIXED", "HARD", [
    { form: "NO", subject: "A", predicate: "B" },
    { form: "SOME", subject: "C", predicate: "A" },
    { form: "ALL", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-CORE-010", "CORE", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-CORE-011", "CORE", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "SOME", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-CORE-012", "CORE", "SYL-SRC-CROSS-ADV-001", "MIXED", "HARD", [
    { form: "ALL", subject: "A", predicate: "B" },
    { form: "NO", subject: "C", predicate: "B" },
    { form: "SOME", subject: "D", predicate: "A" },
  ]),

  scenario("SYL-SC-ONLY-001", "ONLY", "SYL-SRC-BANK-ONLY-001", "LINEAR", "MEDIUM", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "ALL", subject: "A", predicate: "C" },
  ]),
  scenario("SYL-SC-ONLY-002", "ONLY", "SYL-SRC-BANK-ONLY-001", "LINEAR", "MEDIUM", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "NO", subject: "A", predicate: "C" },
  ]),
  scenario("SYL-SC-ONLY-003", "ONLY", "SYL-SRC-BANK-ONLY-001", "LINEAR", "MEDIUM", [
    { form: "ARE_ONLY", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-ONLY-004", "ONLY", "SYL-SRC-BANK-ONLY-001", "BRANCHING", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "SOME", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-ONLY-005", "ONLY", "SYL-SRC-BANK-ONLY-001", "LINEAR", "MEDIUM", [
    { form: "IDENTITY", subject: "A", predicate: "B" },
    { form: "NO", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-ONLY-006", "ONLY", "SYL-SRC-CROSS-ADV-001", "MIXED", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "ALL", subject: "C", predicate: "B" },
    { form: "NO", subject: "A", predicate: "D" },
  ]),
  scenario("SYL-SC-ONLY-007", "ONLY", "SYL-SRC-CROSS-ADV-001", "MIXED", "HARD", [
    { form: "ARE_ONLY", subject: "A", predicate: "B" },
    { form: "SOME", subject: "A", predicate: "C" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-ONLY-008", "ONLY", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "ONLY", subject: "C", predicate: "A" },
  ]),

  scenario("SYL-SC-FEW-001", "FEW", "SYL-SRC-BANK-FEW-001", "LINEAR", "MEDIUM", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-FEW-002", "FEW", "SYL-SRC-BANK-FEW-001", "LINEAR", "MEDIUM", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "NO", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-FEW-003", "FEW", "SYL-SRC-BANK-FEW-001", "LINEAR", "EASY", [
    { form: "A_FEW", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-FEW-004", "FEW", "SYL-SRC-BANK-FEW-001", "LINEAR", "HARD", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ONLY", subject: "C", predicate: "A" },
  ]),
  scenario("SYL-SC-FEW-005", "FEW", "SYL-SRC-BANK-FEW-001", "BRANCHING", "MEDIUM", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "NO", subject: "A", predicate: "C" },
  ]),
  scenario("SYL-SC-FEW-006", "FEW", "SYL-SRC-CROSS-ADV-001", "MIXED", "HARD", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ALL", subject: "C", predicate: "B" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-FEW-007", "FEW", "SYL-SRC-BANK-FEW-001", "LINEAR", "MEDIUM", [
    { form: "NOT_ALL", subject: "A", predicate: "B" },
    { form: "NO", subject: "B", predicate: "C" },
  ]),
  scenario("SYL-SC-FEW-008", "FEW", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ARE_ONLY", subject: "B", predicate: "C" },
  ]),

  scenario("SYL-SC-MIXED-001", "MIXED", "SYL-SRC-MULTILINGUAL-MIXED-001", "LINEAR", "HARD", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-002", "MIXED", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "ONLY_A_FEW", subject: "B", predicate: "C" },
    { form: "ALL", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-003", "MIXED", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "IDENTITY", subject: "A", predicate: "B" },
    { form: "ONLY_A_FEW", subject: "B", predicate: "C" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-004", "MIXED", "SYL-SRC-MULTILINGUAL-MIXED-001", "MIXED", "HARD", [
    { form: "ARE_ONLY", subject: "A", predicate: "B" },
    { form: "SOME", subject: "C", predicate: "A" },
    { form: "NO", subject: "B", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-005", "MIXED", "SYL-SRC-CROSS-ADV-001", "MIXED", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
    { form: "SOME_NOT", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-006", "MIXED", "SYL-SRC-MULTILINGUAL-MIXED-001", "LINEAR", "HARD", [
    { form: "ONLY_A_FEW", subject: "A", predicate: "B" },
    { form: "ONLY", subject: "C", predicate: "A" },
    { form: "NO", subject: "C", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-007", "MIXED", "SYL-SRC-MULTILINGUAL-MIXED-001", "MIXED", "HARD", [
    { form: "ONLY", subject: "A", predicate: "B" },
    { form: "A_FEW", subject: "C", predicate: "B" },
    { form: "NO", subject: "A", predicate: "D" },
  ]),
  scenario("SYL-SC-MIXED-008", "MIXED", "SYL-SRC-CROSS-ADV-001", "LINEAR", "HARD", [
    { form: "IDENTITY", subject: "A", predicate: "B" },
    { form: "ALL", subject: "B", predicate: "C" },
    { form: "ONLY_A_FEW", subject: "C", predicate: "D" },
  ]),
]);

export function scenariosForGroup(group: SylScenarioSpec["group"]): readonly SylScenarioSpec[] {
  return SYL_SCENARIOS.filter((entry) => entry.group === group);
}
