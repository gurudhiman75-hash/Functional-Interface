import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { SEA_CP002_BLUEPRINTS, generateMixedFacingCaselet } from "./cp002/generator.ts";
import { SEA_CP003_BLUEPRINTS, generateCircularCaselet } from "./cp003/generator.ts";
import { SEA_CP004_BLUEPRINTS, generateOutwardCaselet } from "./cp004/generator.ts";
import { SEA_CP005_BLUEPRINTS, generateMixedCircleCaselet } from "./cp005/generator.ts";
import { projectSea001EnglishReviewV1 } from "./english-review-v1.ts";
import {
  buildCircularRelativeDescriptionExtensionV1,
  buildExtremeEndPairExtensionV1,
} from "./query-extensions-v1.ts";
import {
  buildMixedFacingCountExtensionV2,
  buildMixedFacingEndAndFacingExtensionV2,
} from "./query-extensions-v2.ts";
import { sea001QlForReviewExtension, type Sea001QlId } from "./ql-registry.ts";
import { assessSea001DifficultyV1 } from "./difficulty-v1.ts";

export interface Sea001EnglishReviewPackItemV1 {
  itemId: string;
  checkpointId: string;
  blueprintAuthorityId: string;
  qlId: Sea001QlId;
  sourceKind: "RUNTIME_CHILD" | "REVIEW_EXTENSION";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  diagramPolicy: "EXPLANATION_ONLY";
  reviewStatus: "UNREVIEWED";
}

function cp1SeatCount(key: string): number {
  return (key.split("|")[1] ?? "").split(">").filter(Boolean).length;
}
function orderSeatCount(key: string): number {
  return (key.split("|")[0] ?? "").split(">").filter(Boolean).length;
}

function runtimeItems(caselet: any, seatCount: number): Sea001EnglishReviewPackItemV1[] {
  return caselet.children.map((child: any) => {
    const projected = projectSea001EnglishReviewV1({
      checkpointId: caselet.checkpointId,
      caseletId: caselet.caseletId,
      setupText: caselet.setupText,
      clueTexts: caselet.clueTexts,
      checkpointSkillCoverage: caselet.checkpointSkillCoverage,
      seatCount,
      child,
    });
    return {
      itemId: `${caselet.caseletId}:Q${child.questionOrder}`,
      checkpointId: caselet.checkpointId,
      blueprintAuthorityId: caselet.blueprintAuthorityId,
      qlId: projected.qlId,
      sourceKind: "RUNTIME_CHILD",
      stem: projected.stem,
      options: projected.options,
      correctIndex: projected.correctIndex,
      explanation: projected.explanation,
      difficulty: projected.difficulty.band,
      diagramPolicy: "EXPLANATION_ONLY",
      reviewStatus: "UNREVIEWED",
    };
  });
}

function extensionExplanation(extension: any): string {
  if (extension.kind === "EXTREME_END_PAIR") {
    const answer = Array.isArray(extension.answer) ? extension.answer.join(" and ") : String(extension.answer);
    return `${answer} occupy the two extreme seats in the verified row. Hence, that pair is correct.`;
  }
  if (extension.kind === "RELATIVE_POSITION_DESCRIPTION") {
    return `Trace the target person from the reference in the verified circular arrangement. The relation is ${String(extension.answer).toLowerCase()}. Hence, that option is correct.`;
  }
  if (extension.kind === "DEFINITELY_TRUE_RELATION_STATEMENT") {
    return `Check each option against the verified arrangement. Only “${String(extension.answer)}” matches the actual positions, so it is definitely true.`;
  }
  if (extension.kind === "FACING_DIRECTION_COUNT") {
    return `Count only the people facing the direction named in the question. The verified facing pattern gives ${String(extension.answer)}, so that is the correct answer.`;
  }
  if (extension.kind === "END_PERSON_AND_FACING") {
    return `Read the requested extreme seat, then note that person's facing from the verified mixed-facing row. The correct person-direction pair is ${String(extension.answer)}.`;
  }
  throw new Error(`Unsupported SEA-001 review extension ${String(extension.kind)}`);
}

function extensionItem(input: {
  caselet: any;
  extension: any;
  checkpointId: "SEA-CP-001" | "SEA-CP-002" | "SEA-CP-003";
  seatCount: number;
  blueprintAuthorityId: string;
}): Sea001EnglishReviewPackItemV1 {
  const qlId = sea001QlForReviewExtension(input.extension.kind);
  const difficulty = assessSea001DifficultyV1({
    checkpointId: input.checkpointId,
    queryContractId: qlId === "SEA-QL-009" ? "SEA-EXT-FACING" : qlId === "SEA-QL-003" ? "SEA-EXT-RELATION" : "SEA-QC-001",
    seatCount: input.seatCount,
    clueCount: input.caselet.clueTexts.length,
    checkpointSkillCoverage: input.caselet.checkpointSkillCoverage,
    answerType: input.extension.answerType,
  });
  return {
    itemId: `${input.caselet.caseletId}:${input.extension.kind}`,
    checkpointId: input.checkpointId,
    blueprintAuthorityId: input.blueprintAuthorityId,
    qlId,
    sourceKind: "REVIEW_EXTENSION",
    stem: input.extension.stem,
    options: input.extension.options,
    correctIndex: input.extension.correctIndex,
    explanation: extensionExplanation(input.extension),
    difficulty: difficulty.band,
    diagramPolicy: "EXPLANATION_ONLY",
    reviewStatus: "UNREVIEWED",
  };
}

export function buildSea001EnglishReviewPackV1(): readonly Sea001EnglishReviewPackItemV1[] {
  const items: Sea001EnglishReviewPackItemV1[] = [];

  for (const blueprint of SEA_001_BLUEPRINTS) {
    for (let sample = 0; sample < 4; sample += 1) {
      const c = generateSeaCp001Caselet({ blueprintId: blueprint, seed: `SEA-ENG-REVIEW-CP1-${blueprint}-${sample}` });
      const seatCount = cp1SeatCount(c.solverOracleAgreement.productionKeys[0]!);
      items.push(...runtimeItems(c, seatCount));
      if (sample === 0) {
        items.push(extensionItem({
          caselet: c,
          extension: buildExtremeEndPairExtensionV1(c),
          checkpointId: "SEA-CP-001",
          seatCount,
          blueprintAuthorityId: blueprint,
        }));
      }
    }
  }

  for (const blueprint of SEA_CP002_BLUEPRINTS) {
    for (let sample = 0; sample < 4; sample += 1) {
      const c = generateMixedFacingCaselet(`SEA-ENG-REVIEW-CP2-${blueprint}-${sample}`, blueprint);
      const seatCount = orderSeatCount(c.solverOracleAgreement.productionKeys[0]!);
      items.push(...runtimeItems(c, seatCount));
      if (sample === 0) {
        items.push(extensionItem({ caselet: c, extension: buildMixedFacingCountExtensionV2(c), checkpointId: "SEA-CP-002", seatCount, blueprintAuthorityId: blueprint }));
        items.push(extensionItem({ caselet: c, extension: buildMixedFacingEndAndFacingExtensionV2(c), checkpointId: "SEA-CP-002", seatCount, blueprintAuthorityId: blueprint }));
      }
    }
  }

  for (const blueprint of SEA_CP003_BLUEPRINTS) {
    for (let sample = 0; sample < 4; sample += 1) {
      const c = generateCircularCaselet(`SEA-ENG-REVIEW-CP3-${blueprint}-${sample}`, blueprint);
      items.push(...runtimeItems(c, c.topologySnapshot.seatCount));
      if (sample === 0) {
        for (const extension of buildCircularRelativeDescriptionExtensionV1(c)) {
          items.push(extensionItem({ caselet: c, extension, checkpointId: "SEA-CP-003", seatCount: c.topologySnapshot.seatCount, blueprintAuthorityId: blueprint }));
        }
      }
    }
  }

  for (const blueprint of SEA_CP004_BLUEPRINTS) {
    for (let sample = 0; sample < 4; sample += 1) {
      const c = generateOutwardCaselet(`SEA-ENG-REVIEW-CP4-${blueprint}-${sample}`, blueprint);
      items.push(...runtimeItems(c, c.topologySnapshot.seatCount));
    }
  }

  for (const blueprint of SEA_CP005_BLUEPRINTS) {
    for (let sample = 0; sample < 4; sample += 1) {
      const c = generateMixedCircleCaselet(`SEA-ENG-REVIEW-CP5-${blueprint}-${sample}`, blueprint);
      items.push(...runtimeItems(c, orderSeatCount(c.solverOracleAgreement.productionKeys[0]!)));
    }
  }

  return Object.freeze(items);
}

export const SEA_001_ENGLISH_REVIEW_PACK_V1 = Object.freeze({
  authorityId: "SEA_001_ENGLISH_REVIEW_PACK_V1",
  samplesPerBlueprint: 4,
  blueprintCount: 20,
  permanentQlCount: 9,
  manualReviewRequired: true,
  englishFreezePermitted: false,
  diagramPolicy: "EXPLANATION_ONLY",
  downstreamActivationPermitted: false,
});
