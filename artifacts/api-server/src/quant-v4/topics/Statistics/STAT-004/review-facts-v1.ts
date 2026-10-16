import { pick, seededRandom } from "../shared/exact";
import type { Stat004ContractId } from "./types";

const frequencyCases = [
  { frequencies: [7, 6, 9], stated: 22 },
  { frequencies: [8, 5, 6], stated: 20 },
  { frequencies: [12, 4, 7], stated: 23 },
] as const;
const rawData = [
  [3, 7, 5, 8, 4, 6, 9, 5],
  [2, 4, 6, 7, 9, 10, 5, 8, 3, 6],
  [1, 5, 5, 7, 8, 9, 4, 6, 10, 3, 7, 2],
  [4, 6, 8, 5, 7, 9, 3, 6, 10, 4],
  [2, 3, 5, 8, 8, 7, 6, 4, 9, 10, 5, 3],
  [1, 4, 6, 6, 8, 9, 2, 5, 7, 10, 4, 8],
] as const;
type VariantKind = Exclude<
  Stat004ContractId,
  | "DISCRETE_VS_CONTINUOUS_VARIABLE"
  | "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION"
  | "FREQUENCY_TABLE_CHECK"
  | "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS"
  | "BUILD_A_BASIC_FREQUENCY_TABLE"
>;
export type Stat004ReviewFacts =
  | { readonly kind: VariantKind; readonly variant: number }
  | {
      readonly kind: "DISCRETE_VS_CONTINUOUS_VARIABLE";
      readonly measured: number;
      readonly counted: number;
      readonly askMeasured: boolean;
    }
  | {
      readonly kind: "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION";
      readonly chronological: boolean;
    }
  | {
      readonly kind: "FREQUENCY_TABLE_CHECK";
      readonly frequencies: readonly number[];
      readonly stated: number;
    }
  | {
      readonly kind: "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS";
      readonly boundary: number;
    }
  | {
      readonly kind: "BUILD_A_BASIC_FREQUENCY_TABLE";
      readonly values: readonly number[];
    };

/** Shared stimulus authority. Draw order matches the established English generator. */
export function buildStat004ReviewFacts(
  contractId: Stat004ContractId,
  seed: string,
): Stat004ReviewFacts {
  const random = seededRandom(`${seed}:${contractId}:stimulus`);
  const variant = (length: number) =>
    pick(
      random,
      Array.from({ length }, (_, i) => i),
    );
  switch (contractId) {
    case "PRIMARY_VS_SECONDARY_SOURCE":
      return { kind: contractId, variant: variant(6) };
    case "CENSUS_VS_SAMPLE_ENUMERATION":
      return { kind: contractId, variant: variant(6) };
    case "DIRECT_PERSONAL_INVESTIGATION":
      return { kind: contractId, variant: variant(4) };
    case "INDIRECT_ORAL_INVESTIGATION":
      return { kind: contractId, variant: variant(3) };
    case "SCHEDULE_VS_QUESTIONNAIRE":
      return { kind: contractId, variant: variant(3) };
    case "OBSERVATION_METHOD":
      return { kind: contractId, variant: variant(6) };
    case "SECONDARY_DATA_FITNESS":
      return { kind: contractId, variant: variant(4) };
    case "QUALITATIVE_CLASSIFICATION":
      return { kind: contractId, variant: variant(4) };
    case "DISCRETE_VS_CONTINUOUS_VARIABLE":
      return {
        kind: contractId,
        measured: variant(4),
        counted: variant(6),
        askMeasured: random() < 0.5,
      };
    case "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION":
      return { kind: contractId, chronological: random() < 0.5 };
    case "ONE_WAY_VS_TWO_WAY_CLASSIFICATION":
      return { kind: contractId, variant: variant(3) };
    case "TABLE_COMPONENTS":
      return { kind: contractId, variant: variant(2) };
    case "FREQUENCY_TABLE_CHECK": {
      const selected = pick(random, frequencyCases);
      return {
        kind: contractId,
        frequencies: [...selected.frequencies],
        stated: selected.stated,
      };
    }
    case "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS":
      return { kind: contractId, boundary: pick(random, [10, 20, 30]) };
    case "BUILD_A_BASIC_FREQUENCY_TABLE":
      return { kind: contractId, values: [...pick(random, rawData)] };
    default: {
      const neverKind: never = contractId;
      throw new Error(`Unknown STAT-004 facts ${neverKind}`);
    }
  }
}
