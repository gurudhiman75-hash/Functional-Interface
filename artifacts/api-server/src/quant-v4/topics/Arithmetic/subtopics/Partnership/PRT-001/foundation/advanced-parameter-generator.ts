import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
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
} from "./types";

interface ObjectPools {
  partnerPairs: [string, string][];
  businesses: string[];
}

const objectPools = objectPoolsSource as unknown as ObjectPools;

const segment = (
  start: number,
  end: number,
  capital: number,
): CapitalSegment => ({
  start: rational(start),
  end: rational(end),
  capital: rational(capital),
});

function partner(
  partnerId: string,
  segments: readonly CapitalSegment[],
  role: Partner["role"] = "UNSPECIFIED",
): Partner {
  return { partnerId, role, capitalSegments: segments };
}

function makeState(
  partners: readonly Partner[],
  grossProfit: number,
  allocations: readonly PreDistributionAllocation[] = [],
): PartnershipState {
  return {
    totalDuration: rational(12),
    grossProfitOrLoss: rational(grossProfit),
    partners,
    allocations,
    moneyUnit: "RUPEE",
    timeUnit: "MONTH",
  };
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
  if (!partnerA || !partnerB || !partnerC)
    throw new Error("advanced PRT-001 requires three names");
  const scale = random.pick([1, 2]);
  const money = (value: number) => value * scale;
  const business = localizePrt001Business(
    random.pick(objectPools.businesses),
    input.language,
  );
  let state: PartnershipState;
  let targetPartnerId: string | undefined;

  switch (input.entry.solveMode) {
    case "findProfitRatioWhenPartnerJoinsLater":
    case "findUnknownJoinTimeFromProfitRatio":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(30_000))]),
          partner(partnerB, [segment(4, 12, money(45_000))]),
        ],
        money(60_000),
      );
      break;
    case "findShareWhenPartnerLeavesEarly":
      state = makeState(
        [
          partner(partnerA, [segment(0, 8, money(36_000))]),
          partner(partnerB, [segment(0, 12, money(24_000))]),
        ],
        money(72_000),
      );
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    case "findProfitRatioWithMultipleStaggeredJoins":
    case "findThreePartnerProfitRatio":
    case "findMultiPartnerSharesFromTotalProfit":
    case "findUnknownCapitalInThreePartnerSystem":
    case "findTotalProfitFromOnePartnerShareInMultiPartnerSystem":
    case "findMultiPartnerSharesWithStaggeredEvents":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(20_000))]),
          partner(partnerB, [segment(4, 12, money(30_000))]),
          partner(partnerC, [segment(6, 12, money(40_000))]),
        ],
        money(90_000),
      );
      if (
        input.entry.solveMode === "findMultiPartnerSharesFromTotalProfit" ||
        input.entry.solveMode ===
          "findTotalProfitFromOnePartnerShareInMultiPartnerSystem" ||
        input.entry.solveMode === "findMultiPartnerSharesWithStaggeredEvents"
      )
        targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      break;
    case "findProfitRatioAfterCapitalAddition":
    case "findUnknownAddedCapitalFromProfitRatio":
      state = makeState(
        [
          partner(partnerA, [
            segment(0, 6, money(20_000)),
            segment(6, 12, money(30_000)),
          ]),
          partner(partnerB, [segment(0, 12, money(25_000))]),
        ],
        money(72_000),
      );
      break;
    case "findShareAfterCapitalWithdrawal":
      state = makeState(
        [
          partner(partnerA, [
            segment(0, 6, money(40_000)),
            segment(6, 12, money(30_000)),
          ]),
          partner(partnerB, [segment(0, 12, money(35_000))]),
        ],
        money(84_000),
      );
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    case "findEventTimeForEqualProfitShares":
      state = makeState(
        [
          partner(partnerA, [
            segment(0, 6, money(20_000)),
            segment(6, 12, money(40_000)),
          ]),
          partner(partnerB, [segment(0, 12, money(30_000))]),
        ],
        money(72_000),
      );
      break;
    case "findActivePartnerTotalReceiptWithFixedSalary":
    case "findUnknownSalaryFromFinalPartnerReceipts":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(20_000))], "ACTIVE"),
          partner(partnerB, [segment(0, 12, money(40_000))], "SLEEPING"),
        ],
        money(120_000),
        [
          {
            kind: "SALARY",
            basis: "FIXED_AMOUNT",
            value: rational(money(12_000)),
            recipientPartnerId: partnerA,
            sequence: 1,
          },
        ],
      );
      targetPartnerId = partnerA;
      break;
    case "findOtherPartnerShareWithPercentCommission":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(30_000))], "ACTIVE"),
          partner(partnerB, [segment(0, 12, money(30_000))]),
        ],
        money(100_000),
        [
          {
            kind: "COMMISSION",
            basis: "PERCENT_OF_GROSS_PROFIT",
            value: rational(10),
            recipientPartnerId: partnerA,
            sequence: 1,
          },
        ],
      );
      targetPartnerId = partnerB;
      break;
    case "findSharesAfterCharityDeduction":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(20_000))]),
          partner(partnerB, [segment(0, 12, money(30_000))]),
        ],
        money(100_000),
        [
          {
            kind: "CHARITY",
            basis: "FIXED_AMOUNT",
            value: rational(money(10_000)),
            sequence: 1,
          },
        ],
      );
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    case "findShareWithLateJoinAndCapitalChange":
      state = makeState(
        [
          partner(partnerA, [
            segment(0, 6, money(20_000)),
            segment(6, 12, money(30_000)),
          ]),
          partner(partnerB, [segment(4, 12, money(45_000))]),
        ],
        money(110_000),
      );
      targetPartnerId = random.pick([partnerA, partnerB]);
      break;
    case "findShareWithDynamicCapitalAndWorkingPartnerSalary":
      state = makeState(
        [
          partner(
            partnerA,
            [segment(0, 6, money(20_000)), segment(6, 12, money(30_000))],
            "ACTIVE",
          ),
          partner(partnerB, [segment(0, 12, money(25_000))]),
        ],
        money(96_000),
        [
          {
            kind: "SALARY",
            basis: "FIXED_AMOUNT",
            value: rational(money(12_000)),
            recipientPartnerId: partnerA,
            sequence: 1,
          },
        ],
      );
      targetPartnerId = partnerA;
      break;
    case "findUnknownJoinTimeWithPreDistributionDeduction":
      state = makeState(
        [
          partner(partnerA, [segment(0, 12, money(30_000))]),
          partner(partnerB, [segment(4, 12, money(45_000))]),
        ],
        money(100_000),
        [
          {
            kind: "RESERVE",
            basis: "FIXED_AMOUNT",
            value: rational(money(10_000)),
            sequence: 1,
          },
        ],
      );
      targetPartnerId = partnerB;
      break;
    default:
      throw new Error(
        `advanced generator does not support ${input.entry.solveMode}`,
      );
  }

  const solution = solvePrt001State(state);
  const segmentsA = state.partners[0]!.capitalSegments;
  const segmentsB = state.partners[1]!.capitalSegments;
  const segmentsC = state.partners[2]?.capitalSegments;
  const ratio = normalizeRatio(
    solution.timeline.weights.map((item) => item.effectiveCapital),
  );
  const firstA = segmentsA[0]!;
  const lastA = segmentsA[segmentsA.length - 1]!;
  const firstB = segmentsB[0]!;
  const firstC = segmentsC?.[0];
  const salary = solution.pool.executions.find(
    (item) => item.kind === "SALARY",
  )?.amount;
  const deduction = solution.pool.executions.find(
    (item) => !item.recipientPartnerId,
  )?.amount;
  const targetShare = targetPartnerId
    ? solution.distributedShares[targetPartnerId]
    : undefined;
  const targetReceipt = targetPartnerId
    ? solution.finalPartnerReceipts[targetPartnerId]
    : undefined;
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
    addedCapital: formatPrt001Money(addedCapital),
    withdrawnCapital: formatPrt001Money(
      rational(-addedCapital.numerator, addedCapital.denominator),
    ),
    durationA: formatPrt001Duration(
      subtractRational(firstA.end, firstA.start),
      input.language,
    ),
    durationB: formatPrt001Duration(
      subtractRational(firstB.end, firstB.start),
      input.language,
    ),
    durationC: firstC
      ? formatPrt001Duration(
          subtractRational(firstC.end, firstC.start),
          input.language,
        )
      : "",
    joinAfter: formatPrt001Duration(firstB.start, input.language),
    joinAfterB: formatPrt001Duration(firstB.start, input.language),
    joinAfterC: firstC
      ? formatPrt001Duration(firstC.start, input.language)
      : "",
    leaveAfter: formatPrt001Duration(firstA.end, input.language),
    changeMonth: formatPrt001Duration(lastA.start, input.language),
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    targetPartner: targetPartnerId ?? partnerA,
    knownShare: targetShare ? formatPrt001Money(targetShare) : "",
    finalReceipt: targetReceipt ? formatPrt001Money(targetReceipt) : "",
    salary: salary ? formatPrt001Money(salary) : "",
    deduction: deduction ? formatPrt001Money(deduction) : "",
    commissionPercent: 10,
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
