import {
  MEN_CP_010_PERMANENT_ALLOCATION,
  type MenCp010PermanentQlId,
} from "./allocation";

export const MEN_CP_010_EXAM_REALISM_PROFILE_V2_AUTHORITY =
  "MEN-CP010-EXAM-REALISM-PROFILE-V2" as const;

export type MenCp010SscPriority = "CORE" | "STANDARD" | "EXTENDED" | "ENRICHMENT";

export interface MenCp010ExamRealismProfile {
  readonly authority: typeof MEN_CP_010_EXAM_REALISM_PROFILE_V2_AUTHORITY;
  readonly qlId: MenCp010PermanentQlId;
  readonly sscPriority: MenCp010SscPriority;
  readonly sscDefaultWeight: 0 | 1 | 2 | 4;
  readonly bankingDefaultWeight: 0;
  readonly punjabStateDefaultWeight: 0;
  readonly rationale: string;
}

const CORE = new Set<MenCp010PermanentQlId>([
  "MEN-002-QL-124",
  "MEN-002-QL-126",
  "MEN-002-QL-128",
  "MEN-002-QL-129",
  "MEN-002-QL-140",
  "MEN-002-QL-145",
  "MEN-002-QL-147",
]);

const STANDARD = new Set<MenCp010PermanentQlId>([
  "MEN-002-QL-125",
  "MEN-002-QL-127",
  "MEN-002-QL-130",
  "MEN-002-QL-133",
  "MEN-002-QL-136",
  "MEN-002-QL-137",
  "MEN-002-QL-138",
  "MEN-002-QL-139",
  "MEN-002-QL-141",
  "MEN-002-QL-142",
  "MEN-002-QL-144",
  "MEN-002-QL-146",
  "MEN-002-QL-148",
]);

const EXTENDED = new Set<MenCp010PermanentQlId>([
  "MEN-002-QL-131",
  "MEN-002-QL-134",
  "MEN-002-QL-143",
]);

const RATIONALE: Partial<Record<MenCp010PermanentQlId, string>> = {
  "MEN-002-QL-124": "Direct and derived pyramid volume is repeatedly represented in SSC pyramid questions.",
  "MEN-002-QL-126": "Slant-height recovery is a common bridge step in SSC pyramid surface/volume questions.",
  "MEN-002-QL-128": "Pyramid lateral/total surface area is a recurring SSC target and often requires a derived slant height.",
  "MEN-002-QL-129": "Direct conical-frustum volume appears in SSC CGL previous-paper material.",
  "MEN-002-QL-140": "Same-base/same-height prism-pyramid volume comparison has direct SSC previous-paper evidence.",
  "MEN-002-QL-145": "Percentage change of pyramid volume is SSC-relevant, especially when dimensions change independently.",
  "MEN-002-QL-147": "Recovering pyramid slant height from surface evidence has direct SSC previous-paper evidence.",
  "MEN-002-QL-132": "General regular-polygon frustum surface work is mathematically valid but exceeds normal SSC pyramid emphasis.",
  "MEN-002-QL-135": "Polygonal-frustum inverse-volume height is valid but should not occupy default SSC mock weight without stronger source evidence.",
  "MEN-002-QL-149": "General polygonal-frustum surface inverse is enrichment-level for the current SSC target set.",
};

function priorityFor(qlId: MenCp010PermanentQlId): MenCp010SscPriority {
  if (CORE.has(qlId)) return "CORE";
  if (STANDARD.has(qlId)) return "STANDARD";
  if (EXTENDED.has(qlId)) return "EXTENDED";
  return "ENRICHMENT";
}

function weightFor(priority: MenCp010SscPriority): 0 | 1 | 2 | 4 {
  if (priority === "CORE") return 4;
  if (priority === "STANDARD") return 2;
  if (priority === "EXTENDED") return 1;
  return 0;
}

export const MEN_CP_010_EXAM_REALISM_PROFILES: readonly MenCp010ExamRealismProfile[] =
  MEN_CP_010_PERMANENT_ALLOCATION.map((allocation) => {
    const sscPriority = priorityFor(allocation.qlId);
    return {
      authority: MEN_CP_010_EXAM_REALISM_PROFILE_V2_AUTHORITY,
      qlId: allocation.qlId,
      sscPriority,
      sscDefaultWeight: weightFor(sscPriority),
      bankingDefaultWeight: 0,
      punjabStateDefaultWeight: 0,
      rationale:
        RATIONALE[allocation.qlId] ??
        (sscPriority === "STANDARD"
          ? "Valid SSC support family; include below the direct/core pyramid-frustum patterns."
          : sscPriority === "EXTENDED"
            ? "Source-valid but lower-frequency advanced solid-mensuration representation."
            : "Keep available for enrichment/manual blueprints, not default SSC sampling."),
    } as const;
  });

const PROFILE_BY_QL = new Map(MEN_CP_010_EXAM_REALISM_PROFILES.map((row) => [row.qlId, row]));

export function getMenCp010ExamRealismProfile(qlId: MenCp010PermanentQlId) {
  const row = PROFILE_BY_QL.get(qlId);
  if (!row) throw new Error(`Unknown MEN-CP-010 exam-realism profile: ${qlId}`);
  return row;
}

export function listMenCp010DefaultSscQlIds() {
  return MEN_CP_010_EXAM_REALISM_PROFILES
    .filter((row) => row.sscDefaultWeight > 0)
    .map((row) => row.qlId);
}

export function auditMenCp010ExamRealismProfiles() {
  const priorities = { CORE: 0, STANDARD: 0, EXTENDED: 0, ENRICHMENT: 0 };
  for (const row of MEN_CP_010_EXAM_REALISM_PROFILES) priorities[row.sscPriority] += 1;
  return {
    authority: MEN_CP_010_EXAM_REALISM_PROFILE_V2_AUTHORITY,
    profileCount: MEN_CP_010_EXAM_REALISM_PROFILES.length,
    priorities,
    sscDefaultEnabledCount: MEN_CP_010_EXAM_REALISM_PROFILES.filter((row) => row.sscDefaultWeight > 0).length,
    bankingDefaultEnabledCount: MEN_CP_010_EXAM_REALISM_PROFILES.filter((row) => row.bankingDefaultWeight > 0).length,
    punjabStateDefaultEnabledCount: MEN_CP_010_EXAM_REALISM_PROFILES.filter((row) => row.punjabStateDefaultWeight > 0).length,
    productLocked: true,
  } as const;
}
