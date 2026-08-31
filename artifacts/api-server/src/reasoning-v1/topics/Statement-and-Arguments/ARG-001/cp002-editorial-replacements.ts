import type { ArgArgumentAuthority, ArgScenarioAuthority, ArgStance, ArgWeaknessDefect } from "./types.ts";

type AuthorityOverrides = Partial<Omit<ArgArgumentAuthority, "id" | "stance" | "text" | "expectedStrength" | "weaknessDefects">>;

function strong(id: string, stance: ArgStance, text: string, overrides: AuthorityOverrides = {}): ArgArgumentAuthority {
  return Object.freeze({
    id, stance, text, expectedStrength: "STRONG" as const,
    relevance: "DIRECT" as const, materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const, feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const, stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const, weaknessDefects: Object.freeze([]), ...overrides,
  });
}

function weak(id: string, stance: ArgStance, text: string, defect: ArgWeaknessDefect, overrides: AuthorityOverrides = {}): ArgArgumentAuthority {
  return Object.freeze({
    id, stance, text, expectedStrength: "WEAK" as const,
    relevance: "DIRECT" as const, materiality: "MAJOR" as const,
    support: "PLAUSIBLE" as const, feasibility: "REALISTIC" as const,
    scope: "CALIBRATED" as const, stakeholderLegitimacy: "LEGITIMATE" as const,
    issueMatch: "EXACT" as const, weaknessDefects: Object.freeze([defect]), ...overrides,
  });
}

export const ARG_CP002_EDITORIAL_REPLACEMENTS: readonly ArgScenarioAuthority[] = Object.freeze([
  {
    id: "ARG-SC-001",
    qlId: "ARG-QL-001",
    difficulty: "MEDIUM",
    domain: "TRANSPORT",
    statement: "Should helmets be made compulsory for riders of electric two-wheelers on public roads?",
    arguments: [
      strong("ARG-SC-001-I", "SUPPORTS", "Yes. Riders of electric two-wheelers can suffer serious head injury in a road accident, so protective headgear addresses a material safety risk."),
      weak("ARG-SC-001-II", "OPPOSES", "No. Electric two-wheelers are often used for shorter local trips, so riders on such trips do not need protection from head injury.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "OVERBROAD" }),
    ],
    expectedAnswerClass: "ONLY_I",
  },
  {
    id: "ARG-SC-004",
    qlId: "ARG-QL-001",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Should public-service counters remain open thirty minutes later on working days?",
    arguments: [
      weak("ARG-SC-004-I", "SUPPORTS", "Yes. Extending counter hours by thirty minutes will completely eliminate waiting queues at every office.", "OVERGENERALIZATION", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-004-II", "OPPOSES", "No. People who need service near closing time are always careless and their need should not affect office timings.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "ARG-SC-020",
    qlId: "ARG-QL-005",
    difficulty: "MEDIUM",
    domain: "EDUCATION",
    statement: "Should a college publicly display the names of students who submit assignments after the deadline?",
    arguments: [
      weak("ARG-SC-020-I", "SUPPORTS", "Yes. Publicly naming late submitters will make every student punctual in all future academic work.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-020-II", "OPPOSES", "No. Publishing a student's name is always unacceptable in every context, regardless of purpose, consent or the information disclosed.", "ABSOLUTE_CLAIM", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "ARG-SC-028",
    qlId: "ARG-QL-001",
    difficulty: "MEDIUM",
    domain: "PUBLIC_ADMIN",
    statement: "Should application acknowledgement receipts include the service helpline number?",
    arguments: [
      weak("ARG-SC-028-I", "SUPPORTS", "Yes. Printing the helpline number on a receipt guarantees that every future service complaint will be resolved immediately.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED", scope: "ABSOLUTE_UNJUSTIFIED" }),
      weak("ARG-SC-028-II", "OPPOSES", "No. The helpline number should not be printed because acknowledgement receipts should not contain helpline numbers.", "RESTATES_ISSUE", { support: "ASSERTED" }),
    ],
    expectedAnswerClass: "NEITHER",
  },
  {
    id: "ARG-SC-044",
    qlId: "ARG-QL-005",
    difficulty: "HARD",
    domain: "WORKPLACE",
    statement: "Should an employer publish employees' home addresses in a directory accessible to all staff?",
    arguments: [
      weak("ARG-SC-044-I", "SUPPORTS", "Yes. Sharing home addresses will automatically make all colleagues trust one another more.", "UNSUPPORTED_CAUSAL_LEAP", { support: "ASSERTED" }),
      weak("ARG-SC-044-II", "OPPOSES", "No. Any employee who wants a home address kept private must be hiding something suspicious.", "PREJUDICIAL_STEREOTYPE", { stakeholderLegitimacy: "PREJUDICIAL", support: "FALLACIOUS" }),
    ],
    expectedAnswerClass: "NEITHER",
  },
]);
