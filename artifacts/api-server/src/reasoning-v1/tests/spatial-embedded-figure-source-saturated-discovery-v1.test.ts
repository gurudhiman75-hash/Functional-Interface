import { EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_QL_PROPOSALS_V1,
  EMBEDDED_FIGURE_SOURCE_RECORDS_V1,
  EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1,
} from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const direct = EMBEDDED_FIGURE_SOURCE_RECORDS_V1.filter((source) => source.evidenceLevel === "DIRECT_PYQ_MIRROR");
const banking = EMBEDDED_FIGURE_SOURCE_RECORDS_V1.filter((source) => source.examScope === "BANKING");
const general = EMBEDDED_FIGURE_SOURCE_RECORDS_V1.filter((source) => source.evidenceLevel === "GENERAL_TAXONOMY");
const directFamilies = new Set(direct.map((source) => source.examFamily));
const directYears = new Set(direct.map((source) => source.year));

assert(direct.length >= 19, `Expected at least 19 direct SSC PYQ mirrors, got ${direct.length}.`);
for (const family of ["SSC CGL", "SSC CHSL", "SSC CPO", "SSC GD", "SSC Selection Post"]) {
  assert(directFamilies.has(family), `Direct EMB source inventory is missing ${family}.`);
}
for (const year of [2019, 2020, 2022, 2023, 2024, 2025]) {
  assert(directYears.has(year), `Direct EMB source inventory is missing year ${year}.`);
}

assert(direct.every((source) => source.examScope === "SSC"), "A direct source was incorrectly promoted outside verified SSC scope.");
assert(direct.every((source) => source.promptRule === "ROTATION_NOT_ALLOWED"), "A direct SSC source contradicts the fixed-orientation core rule.");
assert(direct.every((source) => source.optionCount === 4), "A direct SSC source does not preserve the observed four-option contract.");
assert(new Set(EMBEDDED_FIGURE_SOURCE_RECORDS_V1.map((source) => source.sourceId)).size === EMBEDDED_FIGURE_SOURCE_RECORDS_V1.length, "Source IDs are not unique.");
assert(new Set(EMBEDDED_FIGURE_SOURCE_RECORDS_V1.map((source) => source.url)).size === EMBEDDED_FIGURE_SOURCE_RECORDS_V1.length, "Source URLs are duplicated in the authority manifest.");
assert(EMBEDDED_FIGURE_SOURCE_RECORDS_V1.every((source) => /^https:\/\//.test(source.url)), "Every source must retain a concrete HTTPS provenance URL.");

assert(banking.length >= 2, "Banking secondary evidence is too thin to record its current boundary.");
assert(banking.every((source) => source.evidenceLevel === "SECONDARY_SYLLABUS"), "Banking evidence was overclaimed as direct PYQ evidence.");
assert(!direct.some((source) => source.examScope === "BANKING"), "Banking direct-paper ownership was claimed without direct evidence.");
assert(general.length >= 1 && general.every((source) => source.promptRule === "MULTIPLE_POLICIES_DESCRIBED"), "General rotation/reflection capability evidence is missing.");

const active = EMBEDDED_FIGURE_QL_PROPOSALS_V1.filter((proposal) => proposal.status === "SOURCE_BACKED_CORE");
const held = EMBEDDED_FIGURE_QL_PROPOSALS_V1.filter((proposal) => proposal.status === "HOLD_DIRECT_PYQ_RULE_EVIDENCE");
assert(active.length === 1 && active[0]!.proposalId === "EMB-PROP-01", "Exactly one source-backed EMB rule class should be active after consolidation.");
assert(active[0]!.equivalencePolicy === "FIXED_ORIENTATION", "Source-backed proposal lost the fixed-orientation rule.");
assert(held.length === 2, "Rotation/reflection extensions must remain held until direct rule evidence exists.");
assert(held.some((proposal) => proposal.proposalId === "EMB-PROP-02" && proposal.equivalencePolicy === "ROTATION_ALLOWED_REFLECTION_DISALLOWED"), "Rotation hold is missing.");
assert(held.some((proposal) => proposal.proposalId === "EMB-PROP-03" && proposal.equivalencePolicy === "ROTATION_AND_REFLECTION_ALLOWED"), "Reflection hold is missing.");

assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.directPyqCount === direct.length, "Discovery authority direct-source count drifted.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.corePolicy === EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1.coreExamPolicy, "Source-discovery core rule and graph-engine core rule disagree.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.sourceScope.ssc === "DIRECT_MULTI_EXAM_MULTI_YEAR_PYQ_MIRROR_EVIDENCE", "SSC source scope is understated or overclaimed.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.sourceScope.banking === "SECONDARY_TOPIC_EVIDENCE_DIRECT_PYQ_RULE_PENDING", "Banking evidence boundary drifted.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.sourceScope.punjabState === "NOT_ESTABLISHED_NO_COVERAGE_CLAIM", "Punjab-state scope must remain unclaimed without evidence.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.permanentQlCount === 0, "Source discovery allocated a permanent EMB QL prematurely.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.nextFreeSpatialQlId === "SPA-QL-041", "Next free Spatial ID changed before EMB allocation approval.");
assert(!EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.lifecycle.permanentQlAllocationAuthorized, "Source discovery must not authorize permanent allocation.");
assert(!EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.lifecycle.questionStudioRegistered, "Source discovery must not register Question Studio.");
assert(!EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.lifecycle.questionBankWritable, "Source discovery must not enable Question Bank writes.");
assert(!EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.lifecycle.automaticStudentPublication, "Source discovery must never enable automatic publication.");

const evidence = {
  status: "PASS_EMB_001_SOURCE_SATURATED_DISCOVERY_V1",
  authorityId: EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  directPyqCount: direct.length,
  directExamFamilies: [...directFamilies].sort(),
  directYears: [...directYears].filter((year): year is number => year !== null).sort(),
  bankingSecondarySourceCount: banking.length,
  generalTaxonomySourceCount: general.length,
  proposalStatus: Object.fromEntries(EMBEDDED_FIGURE_QL_PROPOSALS_V1.map((proposal) => [proposal.proposalId, proposal.status])),
  checks: {
    multiExamDirectSscEvidence: true,
    multiYearDirectSscEvidence: true,
    fixedOrientationUnanimousAcrossDirectSources: true,
    fourOptionContractAcrossDirectSources: true,
    bankingNotOverclaimed: true,
    punjabStateNotOverclaimed: true,
    rotationReflectionRemainEvidenceHolds: true,
    curriculumConsolidatedToOneActiveRuleClass: true,
    graphEnginePolicyAligned: true,
    permanentQlAllocationStillZero: true,
    nextSpatialIdStillFree: true,
  },
  nextGate: EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.nextGate,
};

console.log(JSON.stringify(evidence, null, 2));
