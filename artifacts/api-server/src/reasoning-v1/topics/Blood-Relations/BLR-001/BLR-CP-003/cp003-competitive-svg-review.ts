import { stableHash } from "../foundation/prng";
import {
  buildBlrCp003CompetitiveRawContexts,
  type BlrCp003CompetitiveRawContext,
} from "./cp003-competitive-exam-gate";
import {
  generateBlrCp003CompetitiveReviewV4Bundle,
  type BlrCp003CompetitiveReviewV4Record,
  type BlrCp003CompetitiveReviewV4RejectedRecord,
} from "./cp003-competitive-review-v4";
import {
  buildBlrCp003SvgFamilyTree,
  type BlrCp003SvgFamilyTreeDiagram,
  type BlrCp003SvgTargetOverride,
} from "./cp003-svg-family-tree";

export type BlrCp003CompetitiveSvgReviewRecord = BlrCp003CompetitiveReviewV4Record & {
  proceduralLogic: BlrCp003SvgFamilyTreeDiagram;
  metadata: BlrCp003CompetitiveReviewV4Record["metadata"] & {
    runtimeVersion: "blr-cp003-competitive-svg-review-v5";
    hasSvgFamilyTree: true;
    svgRenderer: "native-inline-svg-v1";
  };
};

export interface BlrCp003CompetitiveSvgReviewBundle {
  selected: readonly BlrCp003CompetitiveSvgReviewRecord[];
  rejected: readonly BlrCp003CompetitiveReviewV4RejectedRecord[];
  sourceRecordCount: number;
  sourceEligibleRecordCount: number;
  supplementalRecordCount: number;
}

function contextKey(scenarioId: string, seed: number, itemId: string): string {
  return `${scenarioId}::${seed}::${itemId}`;
}

function personIdForName(
  context: BlrCp003CompetitiveRawContext,
  name: string,
): string | null {
  const matches = Object.entries(context.personNames)
    .filter(([, displayName]) => displayName === name.trim())
    .map(([personId]) => personId);
  return matches.length === 1 ? matches[0]! : null;
}

function targetOverrideForSupplement(
  record: BlrCp003CompetitiveReviewV4Record,
  context: BlrCp003CompetitiveRawContext,
): BlrCp003SvgTargetOverride | undefined {
  if (!record.metadata.supplementalDerivedItem) return undefined;
  const match = /^Who is the .+ of (.+)\?$/.exec(record.stem);
  const answerName = record.options[record.correctIndex]?.text;
  if (!match || !answerName) return undefined;
  const subjectId = personIdForName(context, answerName);
  const referenceId = personIdForName(context, match[1]!);
  return subjectId && referenceId
    ? { subjectId, referenceId, answerLabel: answerName }
    : undefined;
}

function sourceContextForRecord(
  record: BlrCp003CompetitiveReviewV4Record,
  contexts: ReadonlyMap<string, BlrCp003CompetitiveRawContext>,
): BlrCp003CompetitiveRawContext {
  const exact = contexts.get(contextKey(record.scenarioId, record.seed, record.itemId));
  if (exact) return exact;
  const fallback = [...contexts.values()].find(
    (context) => context.scenarioId === record.scenarioId && context.seed === record.seed,
  );
  if (!fallback) {
    throw new Error(`Missing CP-003 SVG source context for ${record.itemId}.`);
  }
  return fallback;
}

function upgradeSvgRecord(
  record: BlrCp003CompetitiveReviewV4Record,
  context: BlrCp003CompetitiveRawContext,
): BlrCp003CompetitiveSvgReviewRecord {
  const proceduralLogic = buildBlrCp003SvgFamilyTree(
    context,
    record,
    targetOverrideForSupplement(record, context),
  );
  return {
    ...record,
    proceduralLogic,
    metadata: {
      ...record.metadata,
      runtimeVersion: "blr-cp003-competitive-svg-review-v5",
      hasSvgFamilyTree: true,
      svgRenderer: "native-inline-svg-v1",
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        proceduralLogic.kind,
        proceduralLogic.version,
        ...proceduralLogic.nodes.flatMap((node) => [
          node.id,
          node.label,
          node.gender,
          node.generation,
        ]),
        ...proceduralLogic.edges.flatMap((edge) => [
          edge.id,
          edge.type,
          edge.sourceId,
          edge.targetId,
        ]),
        ...(proceduralLogic.query?.pathPersonIds ?? []),
      ]),
    },
  };
}

export function generateBlrCp003CompetitiveSvgReviewBundle(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003CompetitiveSvgReviewBundle {
  const bundle = generateBlrCp003CompetitiveReviewV4Bundle(seeds);
  const contexts = buildBlrCp003CompetitiveRawContexts(seeds);
  const selected = bundle.selected.map((record) =>
    upgradeSvgRecord(record, sourceContextForRecord(record, contexts)),
  );
  return {
    ...bundle,
    selected,
  };
}

export function generateBlrCp003CompetitiveSvgReviewRecords(
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly BlrCp003CompetitiveSvgReviewRecord[] {
  return generateBlrCp003CompetitiveSvgReviewBundle(seeds).selected;
}
