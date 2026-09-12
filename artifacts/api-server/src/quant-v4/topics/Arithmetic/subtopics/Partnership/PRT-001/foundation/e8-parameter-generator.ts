import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { rational, subtractRational } from "./math";
import { formatPrt001Money, localizePrt001Business } from "./parameter-generator";
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

const objectPools = objectPoolsSource as unknown as ObjectPools;

const segment = (start: number, end: number, capital: number): CapitalSegment => ({
  start: rational(start),
  end: rational(end),
  capital: rational(capital),
});

const partner = (
  partnerId: string,
  capitalSegments: readonly CapitalSegment[],
  role: Partner["role"] = "UNSPECIFIED",
): Partner => ({ partnerId, role, capitalSegments });

function abs(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function longDuration(months: number, language: Prt001Language): string {
  if (months % 12 === 0) {
    const years = months / 12;
    if (language === "hi") return `${years} वर्ष`;
    if (language === "pa") return `${years} ਸਾਲ`;
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  if (language === "hi") return `${months} महीने`;
  if (language === "pa") return `${months} ਮਹੀਨੇ`;
  return `${months} months`;
}

export function isPrt001E8QuestionLanguageId(questionLanguageId: string): boolean {
  return questionLanguageId === "PRT-QL-104" || questionLanguageId === "PRT-QL-105";
}

export function generatePrt001E8Parameters(input: {
  questionLanguageId: string;
  seed: string;
  entry: Prt001TaskRegistryEntry;
  language: Prt001Language;
}): Prt001PilotParameters {
  if (!isPrt001E8QuestionLanguageId(input.questionLanguageId)) {
    throw new Error(`E8 generator does not own ${input.questionLanguageId}`);
  }

  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E8 requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const renderVariables: Record<string, string | number> = { partnerA, partnerB, partnerC, business };

  if (input.questionLanguageId === "PRT-QL-104") {
    const scenario = random.pick([
      { a: 20_000, b: 30_000, gross: 100_000, equalSplit: 60 },
      { a: 30_000, b: 45_000, gross: 120_000, equalSplit: 50 },
      { a: 40_000, b: 60_000, gross: 150_000, equalSplit: 40 },
      { a: 50_000, b: 40_000, gross: 180_000, equalSplit: 60 },
      { a: 125_000, b: 85_000, gross: 39_375, equalSplit: 60 },
    ]);
    const equalAllowancePercent = scenario.equalSplit / 2;
    const allocations: PreDistributionAllocation[] = [
      {
        kind: "BONUS",
        basis: "PERCENT_OF_GROSS_PROFIT",
        value: rational(equalAllowancePercent),
        recipientPartnerId: partnerA,
        sequence: 1,
      },
      {
        kind: "BONUS",
        basis: "PERCENT_OF_GROSS_PROFIT",
        value: rational(equalAllowancePercent),
        recipientPartnerId: partnerB,
        sequence: 2,
      },
    ];
    state = {
      totalDuration: rational(12),
      grossProfitOrLoss: rational(money(scenario.gross)),
      partners: [
        partner(partnerA, [segment(0, 12, money(scenario.a))]),
        partner(partnerB, [segment(0, 12, money(scenario.b))]),
      ],
      allocations,
      moneyUnit: "RUPEE",
      timeUnit: "MONTH",
    };
    const solution = solvePrt001State(state);
    const shareDifference = abs(subtractRational(solution.finalPartnerReceipts[partnerA]!, solution.finalPartnerReceipts[partnerB]!));
    Object.assign(renderVariables, {
      capitalA: formatPrt001Money(rational(money(scenario.a))),
      capitalB: formatPrt001Money(rational(money(scenario.b))),
      equalSplitPercent: scenario.equalSplit,
      capitalSplitPercent: 100 - scenario.equalSplit,
      shareDifference: formatPrt001Money(shareDifference),
    });
  } else {
    const scenario = random.pick([
      { a: 75_000, b0: 100_000, withdrawn: 20_000, change: 12, c: 150_000, total: 36, gross: 187_000 },
      { a: 60_000, b0: 90_000, withdrawn: 30_000, change: 6, c: 120_000, total: 24, gross: 330_000 },
      { a: 80_000, b0: 120_000, withdrawn: 30_000, change: 10, c: 100_000, total: 30, gross: 280_000 },
      { a: 50_000, b0: 80_000, withdrawn: 20_000, change: 24, c: 100_000, total: 48, gross: 440_000 },
    ]);
    const b1 = scenario.b0 - scenario.withdrawn;
    state = {
      totalDuration: rational(scenario.total),
      grossProfitOrLoss: rational(money(scenario.gross)),
      partners: [
        partner(partnerA, [segment(0, scenario.total, money(scenario.a))]),
        partner(partnerB, [
          segment(0, scenario.change, money(scenario.b0)),
          segment(scenario.change, scenario.total, money(b1)),
        ]),
        partner(partnerC, [segment(0, scenario.total, money(scenario.c))]),
      ],
      allocations: [],
      moneyUnit: "RUPEE",
      timeUnit: "MONTH",
    };
    targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
    Object.assign(renderVariables, {
      capitalA: formatPrt001Money(rational(money(scenario.a))),
      initialCapitalB: formatPrt001Money(rational(money(scenario.b0))),
      withdrawnCapitalB: formatPrt001Money(rational(money(scenario.withdrawn))),
      changeAfterB: longDuration(scenario.change, input.language),
      capitalC: formatPrt001Money(rational(money(scenario.c))),
      totalDuration: longDuration(scenario.total, input.language),
      totalProfit: formatPrt001Money(rational(money(scenario.gross))),
      targetPartner: targetPartnerId,
    });
  }

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
