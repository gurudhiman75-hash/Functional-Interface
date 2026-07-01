import * as fs from "fs";
import * as path from "path";

export interface CPRecord {
  cpId: string;
  cpName: string;
  solverIdentity: string;
  evidencePattern: string[];
  tracePattern: string[];
  graphPattern: string[];
  plannerStructure: string;
  packageCount: number;
  contextsCovered: string[];
  examplesCovered: string[];
  mathSequence: string[];
  equivalentExpectedCPs: string[];
  classification: "EXACT" | "MERGED" | "PARTIAL" | "MISSING" | "UNEXPECTED";
}

export const implementedInventory: CPRecord[] = [
  {
    cpId: "PCT-CP-001",
    cpName: "Set Overlap & Inclusion-Exclusion",
    solverIdentity: "InclusionExclusionSolver",
    evidencePattern: ["total", "groupA", "groupB", "intersection", "union"],
    tracePattern: ["scenarioId", "semanticDomain", "entityIds"],
    graphPattern: ["root", "groupA", "groupB", "intersection", "answer"],
    plannerStructure: "Linear Overlap Solver",
    packageCount: 20,
    contextsCovered: ["Pass/Fail", "Venn Diagram", "Both/Only"],
    examplesCovered: ["Subject Pass Rates", "Survey Results"],
    mathSequence: ["Total = A + B + C - AB - BC - AC + ABC"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  },
  {
    cpId: "PCT-CP-002",
    cpName: "Miscalculation & Percentage Error",
    solverIdentity: "FractionalErrorSolver",
    evidencePattern: ["intendedValue", "actualValue", "errorAmount"],
    tracePattern: ["scenarioId", "semanticDomain"],
    graphPattern: ["intendedNode", "actualNode", "errorNode", "answer"],
    plannerStructure: "Difference Ratio Engine",
    packageCount: 20,
    contextsCovered: ["Clerical Error", "Wrong Fraction"],
    examplesCovered: ["Multiplier Inversion", "Divisor Inversion"],
    mathSequence: ["|True - Error| / True * 100"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  },
  {
    cpId: "PCT-CP-003",
    cpName: "Tiered Slabs & Thresholds",
    solverIdentity: "TieredCommissionSolver",
    evidencePattern: ["baseThresholds", "tieredRates", "accumulatedSum"],
    tracePattern: ["scenarioId", "semanticDomain"],
    graphPattern: ["baseNode", "slab1", "slab2", "answer"],
    plannerStructure: "Piecewise Function Dispatcher",
    packageCount: 20,
    contextsCovered: ["Sales Commission", "Income Tax"],
    examplesCovered: ["Brokerage Fees", "Bonus Rates"],
    mathSequence: ["Sum(Rate_i * min(Base, Limit_i - Limit_{i-1}))"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  },
  {
    cpId: "PCT-CP-004",
    cpName: "Weighted Sub-group Attributes",
    solverIdentity: "WeightedSubgroupSolver",
    evidencePattern: ["globalBase", "subBaseRatios", "subBaseRates"],
    tracePattern: ["scenarioId", "semanticDomain"],
    graphPattern: ["globalNode", "subNodeA", "subNodeB", "answer"],
    plannerStructure: "Hierarchical Aggregator",
    packageCount: 20,
    contextsCovered: ["Population Mix", "Branch Demographics"],
    examplesCovered: ["Married Females %", "Department Sales %"],
    mathSequence: ["Total_Rate = sum(Sub_Ratio * Sub_Rate)"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  },
  {
    cpId: "PCT-CP-005",
    cpName: "Repeated Replacement Operations",
    solverIdentity: "RepeatedReplacementSolver",
    evidencePattern: ["initialVolume", "replacementVolume", "iterations", "finalConcentration"],
    tracePattern: ["scenarioId", "semanticDomain"],
    graphPattern: ["initialState", "iterationSteps", "finalState", "answer"],
    plannerStructure: "Iterative Multiplier",
    packageCount: 20,
    contextsCovered: ["Milk-Water Substitution", "Chemical Dilution"],
    examplesCovered: ["Iterative Drawing", "Variable-rate Replacement"],
    mathSequence: ["Final = Initial * Product(1 - rate_i)"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  },
  {
    cpId: "PCT-CP-006",
    cpName: "Multi-Stage Attrition & Elections",
    solverIdentity: "MultiStageAttritionSolver",
    evidencePattern: ["totalBase", "validFraction", "winnerFraction", "marginOfVictory"],
    tracePattern: ["scenarioId", "semanticDomain"],
    graphPattern: ["totalVoters", "castVotes", "validVotes", "winnerVotes", "answer"],
    plannerStructure: "Chained Difference Engine",
    packageCount: 20,
    contextsCovered: ["Election Margin", "Multi-stage Dropouts"],
    examplesCovered: ["Invalid Votes", "Non-voters"],
    mathSequence: ["Winner - Loser = Margin", "Valid = Cast - Invalid"],
    equivalentExpectedCPs: [],
    classification: "UNEXPECTED"
  }
];

export const expectedInventory: CPRecord[] = [
  { cpId: "CP-001", cpName: "Whole from Part", classification: "MISSING" } as CPRecord,
  { cpId: "CP-002", cpName: "Another Percentage from Known Percentage", classification: "MISSING" } as CPRecord,
  { cpId: "CP-003", cpName: "Percentage from Part and Whole", classification: "MISSING" } as CPRecord,
  { cpId: "CP-004", cpName: "Reverse Percentage Mapping", classification: "MISSING" } as CPRecord,
  { cpId: "CP-005", cpName: "Ratio <-> Percentage Conversion", classification: "MISSING" } as CPRecord,
  { cpId: "CP-006", cpName: "Complementary Percentage", classification: "MISSING" } as CPRecord,
  { cpId: "CP-007", cpName: "Difference Between Percentage Parts", classification: "MISSING" } as CPRecord,
  { cpId: "CP-008", cpName: "Percentage Partition", classification: "MISSING" } as CPRecord,
  { cpId: "CP-009", cpName: "Missing Percentage", classification: "MISSING" } as CPRecord,
  { cpId: "CP-010", cpName: "Multi-category Percentage Distribution", classification: "MISSING" } as CPRecord,
];

if (require.main === module) {
  fs.writeFileSync(path.join(__dirname, "cp-inventory.json"), JSON.stringify({ implementedInventory, expectedInventory }, null, 2));
  console.log("Written cp-inventory.json");
}
