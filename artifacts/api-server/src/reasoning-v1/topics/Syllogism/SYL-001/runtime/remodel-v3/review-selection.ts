import type { SylLocale } from "../../foundation/types";
import { SYL_QL_REGISTRY } from "../ql-registry";
import type { SylQlId } from "../types";
import { generateSylQuestionV3 } from "./generator";

export const SYL_V3_REVIEW_LOCALES: readonly SylLocale[] = Object.freeze(["en-IN", "hi-IN", "pa-IN"]);
export const SYL_V3_REVIEW_TARGET_PER_QL = 6;

export interface SylV3ReviewSelection {
  readonly selectedSeedsByQl: Readonly<Record<SylQlId, readonly number[]>>;
  readonly questions: readonly ReturnType<typeof generateSylQuestionV3>[];
  readonly uniqueLogicalPayloadCount: number;
}

function selectUniqueSeedsForQl(qlId: SylQlId): readonly number[] {
  const selected: number[] = [];
  const seen = new Set<string>();
  for (let seed = 0; seed < 2_000 && selected.length < SYL_V3_REVIEW_TARGET_PER_QL; seed += 1) {
    const candidate = generateSylQuestionV3(qlId, seed, "en-IN");
    if (seen.has(candidate.contentIdentity)) continue;
    seen.add(candidate.contentIdentity);
    selected.push(seed);
  }
  if (selected.length !== SYL_V3_REVIEW_TARGET_PER_QL) {
    throw new Error(`${qlId} exposes only ${selected.length} distinct V3 review payloads.`);
  }
  return Object.freeze(selected);
}

export function buildSylV3ReviewSelection(): SylV3ReviewSelection {
  const selectedSeedsByQl = Object.fromEntries(
    SYL_QL_REGISTRY.map((definition) => [definition.qlId, selectUniqueSeedsForQl(definition.qlId)]),
  ) as Record<SylQlId, readonly number[]>;
  const questions = Object.freeze(SYL_QL_REGISTRY.flatMap((definition) =>
    selectedSeedsByQl[definition.qlId].flatMap((seed) =>
      SYL_V3_REVIEW_LOCALES.map((locale) => generateSylQuestionV3(definition.qlId, seed, locale)),
    ),
  ));
  const uniqueLogicalPayloadCount = new Set(questions.map((question) => question.contentIdentity)).size;
  const expected = SYL_QL_REGISTRY.length * SYL_V3_REVIEW_TARGET_PER_QL;
  if (uniqueLogicalPayloadCount !== expected) {
    throw new Error(`V3 review selection contains ${uniqueLogicalPayloadCount} unique logical payloads; ${expected} are required.`);
  }
  return Object.freeze({
    selectedSeedsByQl: Object.freeze(selectedSeedsByQl),
    questions,
    uniqueLogicalPayloadCount,
  });
}
