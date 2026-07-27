export type AnaCp009BoundaryVerdict =
  | "QUARANTINE_META_FIXTURE"
  | "QUARANTINE_AMBIGUOUS_FIXTURE"
  | "DELEGATE_CP008"
  | "PRESENTATION_AUDIT_PENDING";

export interface AnaCp009SourceFixture {
  fixtureId: string;
  exam: string;
  promptShape: "MISSING_OUTPUT" | "MISSING_INPUT";
  sourcePairs: readonly string[];
  targetPair: string;
  answer: string;
  verdict: AnaCp009BoundaryVerdict;
  ruleSummary: string;
  crossPairDependency: boolean;
  qlIds: readonly [];
}

export const ANA_CP009_PROVISIONAL_SOURCE_FIXTURES: readonly AnaCp009SourceFixture[] = [
  {
    fixtureId: "ANA-CP009-SF-001",
    exam: "SSC GD Constable 2026 — 20 May 2026 Shift 2",
    promptShape: "MISSING_OUTPUT",
    sourcePairs: ["ZKX102:UHW204", "LST305:QPI610"],
    targetPair: "XYR126:?",
    answer: "OVU252",
    verdict: "QUARANTINE_META_FIXTURE",
    ruleSummary: "The numeric multiplier stays fixed while the three-position letter vector changes across complete pairs; the available text explanation does not yet define one canonical generative progression.",
    crossPairDependency: true,
    qlIds: [],
  },
  {
    fixtureId: "ANA-CP009-SF-002",
    exam: "SSC CHSL 2025 source mirror",
    promptShape: "MISSING_OUTPUT",
    sourcePairs: ["SL23:RY11", "MB39:HS27"],
    targetPair: "EW26:?",
    answer: "CK40",
    verdict: "QUARANTINE_AMBIGUOUS_FIXTURE",
    ruleSummary: "The available invariant-plus-letter-movement prose accepts multiple target outputs, including two published options, so an additional source condition is required before a generative authority can be admitted.",
    crossPairDependency: true,
    qlIds: [],
  },
  {
    fixtureId: "ANA-CP009-SF-003",
    exam: "SSC CHSL 2025 Tier-1 — 30 Nov 2025 Shift 2",
    promptShape: "MISSING_OUTPUT",
    sourcePairs: ["LW72:UJ215", "CA93:YA278"],
    targetPair: "FX103:?",
    answer: "VD308",
    verdict: "DELEGATE_CP008",
    ruleSummary: "A stable pair-local letter vector and whole-number operation apply to every pair; the third pair supplies more evidence but no meta-rule.",
    crossPairDependency: false,
    qlIds: [],
  },
  {
    fixtureId: "ANA-CP009-SF-004",
    exam: "SSC CHSL 2025 source mirror",
    promptShape: "MISSING_OUTPUT",
    sourcePairs: ["AZ205:CB112", "CB200:ED107"],
    targetPair: "XM999:?",
    answer: "ZO906",
    verdict: "DELEGATE_CP008",
    ruleSummary: "Both letters move forward by two cyclic positions and the whole number decreases by 93 in every pair.",
    crossPairDependency: false,
    qlIds: [],
  },
  {
    fixtureId: "ANA-CP009-SF-005",
    exam: "SSC MTS 2025 — 10 Feb 2026 Shift 3",
    promptShape: "MISSING_INPUT",
    sourcePairs: ["ZWX42:BBD84", "ALP61:CQV122"],
    targetPair: "?:LMT92",
    answer: "JHN46",
    verdict: "PRESENTATION_AUDIT_PENDING",
    ruleSummary: "The blank is on the input side, but ownership must follow the underlying pair-local authority rather than the inverse presentation alone.",
    crossPairDependency: false,
    qlIds: [],
  },
] as const;
