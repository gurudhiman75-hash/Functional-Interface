export interface ResolvedCompositionScenario {
  id: string;
  theme: string;
  roleLexemeIds: Readonly<Record<
    | "COMPONENT_A"
    | "A_ROW_1_ONLY"
    | "A_ROW_2_ONLY"
    | "COMPONENT_B"
    | "B_ROW_3_ONLY"
    | "B_ROW_4_ONLY",
    string
  >>;
  status: "REVIEWED";
}

export const RESOLVED_COMPOSITION_SCENARIOS: readonly ResolvedCompositionScenario[] = [
  {
    id: "RESOLVED-STUDENTS-READ",
    theme: "education",
    roleLexemeIds: {
      COMPONENT_A: "students",
      A_ROW_1_ONLY: "learn",
      A_ROW_2_ONLY: "play",
      COMPONENT_B: "read",
      B_ROW_3_ONLY: "children",
      B_ROW_4_ONLY: "teachers",
    },
    status: "REVIEWED",
  },
  {
    id: "RESOLVED-BIRDS-BUILD",
    theme: "nature",
    roleLexemeIds: {
      COMPONENT_A: "birds",
      A_ROW_1_ONLY: "fly",
      A_ROW_2_ONLY: "sing",
      COMPONENT_B: "build",
      B_ROW_3_ONLY: "workers",
      B_ROW_4_ONLY: "teams",
    },
    status: "REVIEWED",
  },
  {
    id: "RESOLVED-WORKERS-COMPLETE",
    theme: "work",
    roleLexemeIds: {
      COMPONENT_A: "workers",
      A_ROW_1_ONLY: "act",
      A_ROW_2_ONLY: "work",
      COMPONENT_B: "complete",
      B_ROW_3_ONLY: "teams",
      B_ROW_4_ONLY: "leaders",
    },
    status: "REVIEWED",
  },
  {
    id: "RESOLVED-CHILDREN-PLAY",
    theme: "people",
    roleLexemeIds: {
      COMPONENT_A: "children",
      A_ROW_1_ONLY: "learn",
      A_ROW_2_ONLY: "read",
      COMPONENT_B: "play",
      B_ROW_3_ONLY: "friends",
      B_ROW_4_ONLY: "teams",
    },
    status: "REVIEWED",
  },
  {
    id: "RESOLVED-DRIVERS-FOLLOW",
    theme: "civic",
    roleLexemeIds: {
      COMPONENT_A: "drivers",
      A_ROW_1_ONLY: "work",
      A_ROW_2_ONLY: "act",
      COMPONENT_B: "follow",
      B_ROW_3_ONLY: "citizens",
      B_ROW_4_ONLY: "leaders",
    },
    status: "REVIEWED",
  },
] as const;

export function getResolvedCompositionScenario(id: string): ResolvedCompositionScenario {
  const found = RESOLVED_COMPOSITION_SCENARIOS.find((scenario) => scenario.id === id);
  if (!found) throw new Error(`Unknown resolved-composition scenario '${id}'`);
  return found;
}
