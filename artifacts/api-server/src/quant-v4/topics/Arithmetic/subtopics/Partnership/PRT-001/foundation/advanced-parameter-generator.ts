import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import advancedScenariosSource from "../advanced-scenarios.library.json" assert { type: "json" };
import { normalizeRatio, rational, subtractRational } from "./math";
import {
  formatPrt001Duration,
  formatPrt001Money,
  localizePrt001Business,
} from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type {
  CapitalSegment,
  Partner,
  PartnershipState,
  PreDistributionAllocation,
  Prt001Language,
  Prt001PilotParameters,
  Prt001TaskRegistryEntry,
  Rational,
} from "./types";

interface ObjectPools {
  partnerPairs: [string, string][];
  businesses: string[];
}
interface JoinLaterScenario { capitalA: number; capitalB: number; joinAfterB: number; }
interface LeaveScenario { capitalA: number; leaveAfterA: number; capitalB: number; }
interface StaggeredScenario { capitalA: number; capitalB: number; joinAfterB: number; capitalC: number; joinAfterC: number; }
interface CapitalChangeScenario { initialCapitalA: number; finalCapitalA: number; changeMonth: number; capitalB: number; }
interface SalaryScenario { capitalA: number; capitalB: number; salary: number; distributableUnit: number; }
interface CommissionScenario { capitalA: number; capitalB: number; commissionPercent: number; grossProfit: number; }
interface DeductionScenario { capitalA: number; capitalB: number; deduction: number; grossProfit: number; }
interface LateJoinChangeScenario extends CapitalChangeScenario { joinAfterB: number; }
interface DynamicSalaryScenario extends CapitalChangeScenario { salary: number; distributableUnit: number; }
interface JoinDeductionScenario extends JoinLaterScenario { deduction: number; distributableUnit: number; }
interface AdvancedScenarios {
  joinLater: JoinLaterScenario[];
  leaveEarly: LeaveScenario[];
  staggeredThree: StaggeredScenario[];
  capitalAddition: CapitalChangeScenario[];
  capitalWithdrawal: CapitalChangeScenario[];
  equalProfitChangeTime: CapitalChangeScenario[];
  salary: SalaryScenario[];
  commission: CommissionScenario[];
  charity: DeductionScenario[];
  lateJoinCapitalChange: LateJoinChangeScenario[];
  dynamicSalary: DynamicSalaryScenario[];
  joinWithDeduction: JoinDeductionScenario[];
}

const objectPools = objectPoolsSource as unknown as ObjectPools;
const advancedScenarios = advancedScenariosSource as unknown as AdvancedScenarios;

const segment = (start: number, end: number, capital: number): CapitalSegment => ({
  start: rational(start),
  end: rational(end),
  capital: rational(capital),
});
function partner(partnerId: string, segments: readonly CapitalSegment[], role: Partner["role"] = "UNSPECIFIED"): Partner {
  return { partnerId, role, capitalSegments: segments };
}
function makeState(partners: readonly Partner[], grossProfit: number, allocations: readonly PreDistributionAllocation[] = []): PartnershipState {
  return { totalDuration: rational(12), grossProfitOrLoss: rational(grossProfit), partners, allocations, moneyUnit: "RUPEE", timeUnit: "MONTH" };
}
function cleanGross(partners: readonly Partner[], perPart: number): number {
  const probe = solvePrt001State(makeState(partners, 1));
  return Number(probe.normalizedRatio.reduce((sum, item) => sum + item, 0n)) * perPart;
}
function abs(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

export function generatePrt001AdvancedParameters(input: {
  questionLanguageId: string;
  seed: string;
  entry: Prt001TaskRegistryEntry;
  language: Prt001Language;
}): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("advanced PRT-001 requires three names");
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  let state: PartnershipState;
  let targetPartnerId: string | undefined;

  switch (input.entry.solveMode) {
    case "findProfitRatioWhenPartnerJoinsLater":
    case "findUnknownJoinTimeFromProfitRatio": {
      const s = random.pick(advancedScenarios.joinLater);
      const partners = [
        partner(partnerA, [segment(0, 12, money(s.capitalA))]),
        partner(partnerB, [segment(s.joinAfterB, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([12_000, 15_000, 20_000]))));
      break;
    }
    case "findShareWhenPartnerLeavesEarly": {
      const s = random.pick(advancedScenarios.leaveEarly);
      const partners = [
        partner(partnerA, [segment(0, s.leaveAfterA, money(s.capitalA))]),
        partner(partnerB, [segment(0, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([12_000, 18_000, 24_000]))));
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    }
    case "findProfitRatioWithMultipleStaggeredJoins":
    case "findThreePartnerProfitRatio":
    case "findMultiPartnerSharesFromTotalProfit":
    case "findUnknownCapitalInThreePartnerSystem":
    case "findTotalProfitFromOnePartnerShareInMultiPartnerSystem":
    case "findMultiPartnerSharesWithStaggeredEvents": {
      const s = random.pick(advancedScenarios.staggeredThree);
      const partners = [
        partner(partnerA, [segment(0, 12, money(s.capitalA))]),
        partner(partnerB, [segment(s.joinAfterB, 12, money(s.capitalB))]),
        partner(partnerC, [segment(s.joinAfterC, 12, money(s.capitalC))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([10_000, 15_000, 20_000]))));
      if (
        input.entry.solveMode === "findMultiPartnerSharesFromTotalProfit" ||
        input.entry.solveMode === "findTotalProfitFromOnePartnerShareInMultiPartnerSystem" ||
        input.entry.solveMode === "findMultiPartnerSharesWithStaggeredEvents"
      ) targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      break;
    }
    case "findProfitRatioAfterCapitalAddition":
    case "findUnknownAddedCapitalFromProfitRatio": {
      const s = random.pick(advancedScenarios.capitalAddition);
      const partners = [
        partner(partnerA, [
          segment(0, s.changeMonth, money(s.initialCapitalA)),
          segment(s.changeMonth, 12, money(s.finalCapitalA)),
        ]),
        partner(partnerB, [segment(0, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([12_000, 16_000, 20_000]))));
      break;
    }
    case "findShareAfterCapitalWithdrawal": {
      const s = random.pick(advancedScenarios.capitalWithdrawal);
      const partners = [
        partner(partnerA, [
          segment(0, s.changeMonth, money(s.initialCapitalA)),
          segment(s.changeMonth, 12, money(s.finalCapitalA)),
        ]),
        partner(partnerB, [segment(0, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([12_000, 18_000, 24_000]))));
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    }
    case "findEventTimeForEqualProfitShares": {
      const s = random.pick(advancedScenarios.equalProfitChangeTime);
      const partners = [
        partner(partnerA, [
          segment(0, s.changeMonth, money(s.initialCapitalA)),
          segment(s.changeMonth, 12, money(s.finalCapitalA)),
        ]),
        partner(partnerB, [segment(0, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([12_000, 18_000, 24_000]))));
      break;
    }
    case "findActivePartnerTotalReceiptWithFixedSalary":
    case "findUnknownSalaryFromFinalPartnerReceipts": {
      const s = random.pick(advancedScenarios.salary);
      const partners = [
        partner(partnerA, [segment(0, 12, money(s.capitalA))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.capitalB))], "SLEEPING"),
      ];
      const distributable = cleanGross(partners, money(s.distributableUnit));
      state = makeState(partners, distributable + money(s.salary), [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: rational(money(s.salary)), recipientPartnerId: partnerA, sequence: 1 }]);
      targetPartnerId = partnerA;
      break;
    }
    case "findOtherPartnerShareWithPercentCommission": {
      const s = random.pick(advancedScenarios.commission);
      state = makeState(
        [partner(partnerA, [segment(0, 12, money(s.capitalA))], "ACTIVE"), partner(partnerB, [segment(0, 12, money(s.capitalB))])],
        money(s.grossProfit),
        [{ kind: "COMMISSION", basis: "PERCENT_OF_GROSS_PROFIT", value: rational(s.commissionPercent), recipientPartnerId: partnerA, sequence: 1 }],
      );
      targetPartnerId = partnerB;
      break;
    }
    case "findSharesAfterCharityDeduction": {
      const s = random.pick(advancedScenarios.charity);
      state = makeState(
        [partner(partnerA, [segment(0, 12, money(s.capitalA))]), partner(partnerB, [segment(0, 12, money(s.capitalB))])],
        money(s.grossProfit),
        [{ kind: "CHARITY", basis: "FIXED_AMOUNT", value: rational(money(s.deduction)), sequence: 1 }],
      );
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    }
    case "findShareWithLateJoinAndCapitalChange": {
      const s = random.pick(advancedScenarios.lateJoinCapitalChange);
      const partners = [
        partner(partnerA, [segment(0, s.changeMonth, money(s.initialCapitalA)), segment(s.changeMonth, 12, money(s.finalCapitalA))]),
        partner(partnerB, [segment(s.joinAfterB, 12, money(s.capitalB))]),
      ];
      state = makeState(partners, cleanGross(partners, money(random.pick([10_000, 15_000, 20_000]))));
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    }
    case "findShareWithDynamicCapitalAndWorkingPartnerSalary": {
      const s = random.pick(advancedScenarios.dynamicSalary);
      const partners = [
        partner(partnerA, [segment(0, s.changeMonth, money(s.initialCapitalA)), segment(s.changeMonth, 12, money(s.finalCapitalA))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.capitalB))]),
      ];
      const distributable = cleanGross(partners, money(s.distributableUnit));
      state = makeState(partners, distributable + money(s.salary), [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: rational(money(s.salary)), recipientPartnerId: partnerA, sequence: 1 }]);
      targetPartnerId = partnerA;
      break;
    }
    case "findUnknownJoinTimeWithPreDistributionDeduction": {
      const s = random.pick(advancedScenarios.joinWithDeduction);
      const partners = [
        partner(partnerA, [segment(0, 12, money(s.capitalA))]),
        partner(partnerB, [segment(s.joinAfterB, 12, money(s.capitalB))]),
      ];
      const distributable = cleanGross(partners, money(s.distributableUnit));
      state = makeState(partners, distributable + money(s.deduction), [{ kind: "RESERVE", basis: "FIXED_AMOUNT", value: rational(money(s.deduction)), sequence: 1 }]);
      targetPartnerId = partnerB;
      break;
    }
    default:
      throw new Error(`advanced generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const segmentsA = state.partners[0]!.capitalSegments;
  const segmentsB = state.partners[1]!.capitalSegments;
  const segmentsC = state.partners[2]?.capitalSegments;
  const ratio = normalizeRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
  const firstA = segmentsA[0]!;
  const lastA = segmentsA[segmentsA.length - 1]!;
  const firstB = segmentsB[0]!;
  const firstC = segmentsC?.[0];
  const salary = solution.pool.executions.find((item) => item.kind === "SALARY")?.amount;
  const commission = solution.pool.executions.find((item) => item.kind === "COMMISSION");
  const deduction = solution.pool.executions.find((item) => !item.recipientPartnerId)?.amount;
  const targetShare = targetPartnerId ? solution.distributedShares[targetPartnerId] : undefined;
  const targetReceipt = targetPartnerId ? solution.finalPartnerReceipts[targetPartnerId] : undefined;
  const addedCapital = subtractRational(lastA.capital, firstA.capital);
  const renderVariables: Record<string, string | number> = {
    partnerA,
    partnerB,
    partnerC,
    business,
    capitalA: formatPrt001Money(firstA.capital),
    capitalB: formatPrt001Money(firstB.capital),
    capitalC: firstC ? formatPrt001Money(firstC.capital) : "",
    initialCapitalA: formatPrt001Money(firstA.capital),
    finalCapitalA: formatPrt001Money(lastA.capital),
    addedCapital: formatPrt001Money(abs(addedCapital)),
    withdrawnCapital: formatPrt001Money(abs(addedCapital)),
    durationA: formatPrt001Duration(subtractRational(firstA.end, firstA.start), input.language),
    durationB: formatPrt001Duration(subtractRational(firstB.end, firstB.start), input.language),
    durationC: firstC ? formatPrt001Duration(subtractRational(firstC.end, firstC.start), input.language) : "",
    joinAfter: formatPrt001Duration(firstB.start, input.language),
    joinAfterB: formatPrt001Duration(firstB.start, input.language),
    joinAfterC: firstC ? formatPrt001Duration(firstC.start, input.language) : "",
    leaveAfter: formatPrt001Duration(firstA.end, input.language),
    changeMonth: formatPrt001Duration(lastA.start, input.language),
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    targetPartner: targetPartnerId ?? partnerA,
    knownShare: targetShare ? formatPrt001Money(targetShare) : "",
    finalReceipt: targetReceipt ? formatPrt001Money(targetReceipt) : "",
    salary: salary ? formatPrt001Money(salary) : "",
    deduction: deduction ? formatPrt001Money(deduction) : "",
    commissionPercent: commission ? Number(state.allocations.find((item) => item.kind === "COMMISSION")!.value.numerator) : 10,
    profitRatioA: ratio[0]!.toString(),
    profitRatioB: ratio[1]!.toString(),
    profitRatioC: ratio[2]?.toString() ?? "",
  };
  return {
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: input.language,
    entry: input.entry,
    state,
    partnerA,
    partnerB,
    partnerC,
    targetPartnerId,
    renderVariables,
  };
}
