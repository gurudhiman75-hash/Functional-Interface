import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV12Final, generateCp005ReviewSetV12Final } from "./english-review-runtime-v12-final";
import {
  TSD_CP005_V13_OBJECT_POOLS,
  type Cp005V13ObjectContext,
  type Cp005V13ObjectTopology,
} from "./english-object-pool-v13";

export type TsdCp005EnglishReviewQuestionV13 = TsdCp005EnglishReviewQuestion & Readonly<{
  objectContextId: string;
  objectFamily: string;
  endpointFamily: string;
  objectTopology: Cp005V13ObjectTopology;
}>;

function topologyFor(permanentQlId: string): Cp005V13ObjectTopology {
  const ql = Number(permanentQlId.slice(-3));
  if (ql >= 58 && ql <= 62) return "OPPOSITE_ONE_WAY";
  if ([63, 64, 65, 70].includes(ql)) return "OPPOSITE_REPEAT";
  if (ql >= 66 && ql <= 68) return "SAME_START_RETURN";
  if (ql === 69) return "OPPOSITE_HALT";
  throw new Error(`${permanentQlId}: CP005 V13 topology mapping missing`);
}

export function cp005V13ObjectContextFor(permanentQlId: string, ordinal: number): Cp005V13ObjectContext {
  const topology = topologyFor(permanentQlId);
  const pool = TSD_CP005_V13_OBJECT_POOLS[topology];
  const ql = Number(permanentQlId.slice(-3));
  const start = ((ql - 58) * 5) % pool.length;
  return pool[(start + ordinal) % pool.length]!;
}

function objectizeStem(base: string, context: Cp005V13ObjectContext): string {
  const ratioToken = "__CP005_RATIO_A_B__";
  let stem = base.replaceAll("A:B", ratioToken);

  stem = stem
    .replace(/The travellers A and B/g, `${context.actorA} and ${context.actorB}`)
    .replace(/Travellers A and B/g, `${context.actorA} and ${context.actorB}`)
    .replace(/travellers A and B/g, `${context.actorA} and ${context.actorB}`)
    .replace(/Two travellers/g, `Two ${context.plural}`)
    .replace(/two travellers/g, `two ${context.plural}`)
    .replace(/traveller A/g, context.actorA)
    .replace(/traveller B/g, context.actorB)
    .replace(/Traveller A/g, context.actorA)
    .replace(/Traveller B/g, context.actorB)
    .replace(/Given A =/g, `Given ${context.actorA}'s speed =`)
    .replace(/\bA's speed\b/g, `${context.actorA}'s speed`)
    .replace(/\bB's speed\b/g, `${context.actorB}'s speed`)
    .replace(/\bA's\b/g, `${context.actorA}'s`)
    .replace(/\bB's\b/g, `${context.actorB}'s`)
    .replace(/\bA\b/g, context.actorA)
    .replace(/\bB\b/g, context.actorB)
    .replaceAll(ratioToken, "A:B");

  if (context.routeKind === "RAIL") {
    stem = stem.replace(/\broad\b/g, "rail line");
  } else if (context.routeKind === "TRACK") {
    stem = stem.replace(/\broad\b/g, "test track");
  }

  stem = stem
    .replace(new RegExp(`Given ${context.actorA} =`, "g"), `Given ${context.actorA}'s speed =`)
    .replace(new RegExp(`, ${context.actorA} first\\.`, "g"), `, with ${context.actorA} first.`)
    .replace(new RegExp(`the returning ${context.actorA}`, "g"), `returning ${context.actorA}`);

  return `${context.intro} ${stem}`;
}

export function generateCp005ReviewSetV13(perAuthority = 6): readonly TsdCp005EnglishReviewQuestionV13[] {
  const counters = new Map<string, number>();
  return Object.freeze(generateCp005ReviewSetV12Final(perAuthority).map((question) => {
    const ordinal = counters.get(question.permanentQlId) ?? 0;
    counters.set(question.permanentQlId, ordinal + 1);
    const context = cp005V13ObjectContextFor(question.permanentQlId, ordinal);
    return Object.freeze({
      ...question,
      stem: objectizeStem(question.stem, context),
      objectContextId: context.id,
      objectFamily: context.objectFamily,
      endpointFamily: context.endpointFamily,
      objectTopology: context.topology,
    });
  }));
}

/** V13 expands selected English object/context presentation only. */
export function generateCp005EnglishAuditPoolV13(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV12Final(perAuthority);
}
