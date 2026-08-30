import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import variableRangesSource from "../variable-ranges.library.json" assert { type: "json" };
import { formatRatio, normalizeRatio, rational } from "./math";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type {
  PartnershipState,
  Prt001Language,
  Prt001PilotParameters,
  Prt001TaskRegistryEntry,
  Rational,
} from "./types";

interface Scenario {
  capitalA: number;
  durationA: number;
  capitalB: number;
  durationB: number;
}

interface VariableRanges {
  samePeriodRatios: [number, number][];
  capitalScaleRupees: number[];
  shareUnitRupees: number[];
  durationsMonths: number[];
  unequalDurationScenarios: Scenario[];
  unknownCapitalScenarios: Scenario[];
  unknownDurationScenarios: Scenario[];
}

interface ObjectPools {
  partnerPairs: [string, string][];
  businesses: string[];
}

const variableRanges = variableRangesSource as unknown as VariableRanges;
const objectPools = objectPoolsSource as unknown as ObjectPools;

function formatIndianInteger(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const digits = (value < 0n ? -value : value).toString();
  if (digits.length <= 3) return `${sign}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${leading},${lastThree}`;
}

export function formatPrt001Money(value: Rational): string {
  if (value.denominator !== 1n) {
    return `₹${value.numerator}/${value.denominator}`;
  }
  return `₹${formatIndianInteger(value.numerator)}`;
}

export function formatPrt001Duration(
  value: Rational,
  language: Prt001Language = "en",
): string {
  const number =
    value.denominator === 1n
      ? value.numerator.toString()
      : `${value.numerator}/${value.denominator}`;
  if (language === "hi") return `${number} महीने`;
  if (language === "pa") return `${number} ਮਹੀਨੇ`;
  return `${number} ${value.numerator === value.denominator ? "month" : "months"}`;
}

export function localizePrt001Business(
  business: string,
  language: Prt001Language,
): string {
  if (language === "en") return business;
  const translations: Record<string, readonly [string, string]> = {
    "trading business": ["व्यापार", "ਵਪਾਰ"],
    "retail shop": ["खुदरा दुकान", "ਖੁਦਰਾ ਦੁਕਾਨ"],
    "small manufacturing unit": ["लघु निर्माण इकाई", "ਛੋਟੀ ਨਿਰਮਾਣ ਇਕਾਈ"],
    dealership: ["डीलरशिप", "ਡੀਲਰਸ਼ਿਪ"],
    "wholesale firm": ["थोक फर्म", "ਥੋਕ ਫਰਮ"],
    "logistics firm": ["लॉजिस्टिक्स फर्म", "ਲੋਜਿਸਟਿਕਸ ਫਰਮ"],
    "online retail venture": ["ऑनलाइन खुदरा उद्यम", "ਆਨਲਾਈਨ ਖੁਦਰਾ ਕਾਰੋਬਾਰ"],
    "food processing unit": ["खाद्य प्रसंस्करण इकाई", "ਖਾਦ ਪ੍ਰੋਸੈਸਿੰਗ ਇਕਾਈ"],
    "construction supplies business": ["निर्माण सामग्री व्यवसाय", "ਨਿਰਮਾਣ ਸਮੱਗਰੀ ਕਾਰੋਬਾਰ"],
    "garment wholesaling business": ["परिधान थोक व्यवसाय", "ਕੱਪੜਾ ਥੋਕ ਕਾਰੋਬਾਰ"],
    "electronics dealership": ["इलेक्ट्रॉनिक्स डीलरशिप", "ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਡੀਲਰਸ਼ਿਪ"],
    "book distribution business": ["पुस्तक वितरण व्यवसाय", "ਕਿਤਾਬ ਵੰਡ ਕਾਰੋਬਾਰ"],
  };
  return translations[business]?.[language === "hi" ? 0 : 1] ?? business;
}

function stateFromScenario(
  partnerA: string,
  partnerB: string,
  scenario: Scenario,
  grossProfit: number,
): PartnershipState {
  const totalDuration = Math.max(scenario.durationA, scenario.durationB);
  return {
    totalDuration: rational(totalDuration),
    grossProfitOrLoss: rational(grossProfit),
    partners: [
      {
        partnerId: partnerA,
        role: "UNSPECIFIED",
        capitalSegments: [
          {
            start: rational(0),
            end: rational(scenario.durationA),
            capital: rational(scenario.capitalA),
          },
        ],
      },
      {
        partnerId: partnerB,
        role: "UNSPECIFIED",
        capitalSegments: [
          {
            start: rational(0),
            end: rational(scenario.durationB),
            capital: rational(scenario.capitalB),
          },
        ],
      },
    ],
    allocations: [],
    moneyUnit: "RUPEE",
    timeUnit: "MONTH",
  };
}

export function generatePrt001PilotParameters(input: {
  questionLanguageId: string;
  seed: string;
  entry: Prt001TaskRegistryEntry;
  language?: Prt001Language;
}): Prt001PilotParameters {
  const language = input.language ?? "en";
  const random = createPrt001Random(input.seed);
  const [partnerA, partnerB] = random.pick(objectPools.partnerPairs);
  const business = random.pick(objectPools.businesses);
  let scenario: Scenario;
  if (input.entry.cpId === "PRT-CP-001") {
    const [ratioA, ratioB] = random.pick(variableRanges.samePeriodRatios);
    const scale = random.pick(variableRanges.capitalScaleRupees);
    scenario = {
      capitalA: ratioA * scale,
      durationA: 12,
      capitalB: ratioB * scale,
      durationB: 12,
    };
  } else if (
    input.entry.solveMode === "findUnknownCapitalFromShareRatioAndDurations"
  ) {
    scenario = random.pick(variableRanges.unknownCapitalScenarios);
  } else if (
    input.entry.solveMode === "findUnknownDurationFromShareRatioAndCapitals"
  ) {
    scenario = random.pick(variableRanges.unknownDurationScenarios);
  } else {
    scenario = random.pick(variableRanges.unequalDurationScenarios);
  }

  const rawWeights = [
    rational(scenario.capitalA * scenario.durationA),
    rational(scenario.capitalB * scenario.durationB),
  ];
  const ratio = normalizeRatio(rawWeights);
  const shareUnit = random.pick(variableRanges.shareUnitRupees);
  const totalProfit = Number(ratio[0]! + ratio[1]!) * shareUnit;
  const state = stateFromScenario(partnerA, partnerB, scenario, totalProfit);
  const solution = solvePrt001State(state);
  const targetPartnerId = random.next() < 0.5 ? partnerA : partnerB;
  const knownShare = solution.distributedShares[targetPartnerId]!;
  const renderVariables: Record<string, string | number> = {
    partnerA,
    partnerB,
    business: localizePrt001Business(business, language),
    capitalA: formatPrt001Money(rational(scenario.capitalA)),
    capitalB: formatPrt001Money(rational(scenario.capitalB)),
    durationA: formatPrt001Duration(rational(scenario.durationA), language),
    durationB: formatPrt001Duration(rational(scenario.durationB), language),
    totalProfit: formatPrt001Money(rational(totalProfit)),
    targetPartner: targetPartnerId,
    knownShare: formatPrt001Money(knownShare),
    profitRatioA: ratio[0]!.toString(),
    profitRatioB: ratio[1]!.toString(),
    profitRatio: formatRatio(rawWeights),
  };
  return {
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language,
    entry: input.entry,
    state,
    partnerA,
    partnerB,
    targetPartnerId,
    ...(input.entry.solveMode === "findUnknownCapitalFromShareRatioAndDurations"
      ? { targetUnknown: "CAPITAL_A" as const }
      : {}),
    ...(input.entry.solveMode === "findUnknownDurationFromShareRatioAndCapitals"
      ? { targetUnknown: "DURATION_A" as const }
      : {}),
    renderVariables,
  };
}