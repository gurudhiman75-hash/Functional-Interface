import { checkpointForClockTask, type ClockTaskId } from './runtime/catalog';
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
} from './runtime/exam-natural-governance';
import { CLOCK_DIFFICULTY_AUDIT } from './runtime/difficulty-governance';
import { CLOCK_SOURCE_SATURATION_POLICY } from './runtime/source-saturation';

export const CLK_001_PERMANENT_FREEZE_VERSION = 'CLK_001_PERMANENT_V1' as const;

export const CLK_001_PERMANENT_QL_SPECS = [
  ['CLK-QL-001', 'HAND_MOTION', 'HAND_HOUR_ROTATION', 'Hand movement and rate'],
  ['CLK-QL-002', 'DIAL_SPACE_CONVERSION', 'MINUTE_SPACES_TO_ANGLE', 'Clock-dial spaces and angle conversion'],
  ['CLK-QL-003', 'ANGLE_AT_STATED_TIME', 'SMALLER_ANGLE_AT_TIME', 'Angle between hands at a stated time'],
  ['CLK-QL-004', 'HAND_RELATION_CLASSIFICATION', 'CLASSIFY_HAND_RELATION', 'Classify the relation between clock hands'],
  ['CLK-QL-005', 'TIME_FOR_ARBITRARY_ANGLE', 'ONE_TIME_FOR_ANGLE_IN_HOUR', 'Find time for a given angle'],
  ['CLK-QL-006', 'SPECIAL_HAND_EVENT_TIME', 'COINCIDENCE_IN_HOUR', 'Coincidence, opposition and right-angle event times'],
  ['CLK-QL-007', 'SPECIAL_EVENT_RECURRENCE', 'GAP_BETWEEN_SPECIAL_EVENTS', 'Gap between recurring hand events'],
  ['CLK-QL-008', 'EVENT_COUNT_IN_INTERVAL', 'COUNT_COINCIDENCES', 'Count hand events in a time interval'],
  ['CLK-QL-009', 'EVENT_RECURRENCE_POSITION', 'NTH_OCCURRENCE', 'Locate the nth hand event'],
  ['CLK-QL-010', 'UNIFORM_FAULTY_CLOCK_MAPPING', 'DISPLAYED_FROM_ACTUAL_ELAPSED', 'Map actual time to a uniformly faulty clock'],
  ['CLK-QL-011', 'UNIFORM_GAIN_LOSS_ERROR', 'ERROR_AFTER_ACTUAL_DURATION', 'Clock gain or loss after elapsed time'],
  ['CLK-QL-012', 'INITIAL_OFFSET_CLOCK', 'INITIAL_OFFSET_CORRECT_RATE', 'Clock with an initial fixed error'],
  ['CLK-QL-013', 'INFER_FAULTY_CLOCK_MODEL', 'DERIVE_RATE_FROM_OBSERVATIONS', 'Infer faulty-clock rate from observations'],
  ['CLK-QL-014', 'MULTIDAY_FAULTY_CLOCK', 'MULTIDAY_ACTUAL_FROM_DISPLAY', 'Multi-day faulty-clock conversion'],
  ['CLK-QL-015', 'NEXT_CORRECT_READING', 'NEXT_CORRECT_READING', 'Next correct reading of a faulty analog clock'],
  ['CLK-QL-016', 'TWO_FAULTY_CLOCKS', 'COMPARE_TWO_FAULTY_CLOCKS', 'Compare two faulty clocks'],
  ['CLK-QL-017', 'FAULT_FROM_COINCIDENCE_RECURRENCE', 'GAIN_FROM_COINCIDENCE_INTERVAL', 'Infer gain or loss from hand-event recurrence'],
  ['CLK-QL-018', 'STRIKE_GAP_MECHANICS', 'DURATION_FOR_N_STRIKES', 'Striking-clock interval mechanics'],
  ['CLK-QL-019', 'STANDARD_HOUR_STRIKE_TOTAL', 'TOTAL_STRIKES_24_HOURS', 'Total strikes in a standard clock schedule'],
  ['CLK-QL-020', 'VERTICAL_MIRROR_TIME', 'MIRROR_FROM_ACTUAL', 'Vertical mirror time'],
  ['CLK-QL-021', 'CLOCK_DIAGRAM_TIME', 'READ_TIME_FROM_DIAGRAM', 'Read time from an analog clock diagram'],
  ['CLK-QL-022', 'CLOCK_DIAGRAM_ANGLE', 'READ_ANGLE_TYPE_FROM_DIAGRAM', 'Read hand relation or angle from a diagram'],
  ['CLK-QL-023', 'HAND_INTERCHANGE', 'TIME_AFTER_HANDS_INTERCHANGED', 'Interchanged hour and minute hands'],
] as const;

export type ClockPermanentQlId = (typeof CLK_001_PERMANENT_QL_SPECS)[number][0];

export type ClockPermanentContract = Readonly<{
  qlId: ClockPermanentQlId;
  cluster: string;
  anchorTaskId: ClockTaskId;
  checkpointCode: ReturnType<typeof checkpointForClockTask>;
  studentTask: string;
  ownedTaskIds: readonly ClockTaskId[];
  defaultDifficulty: 'FOUNDATION' | 'STANDARD' | 'ADVANCED';
  sourceEvidenceRefs: readonly string[];
}>;

function activeTasksForCluster(cluster: string): ClockTaskId[] {
  return (Object.keys(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION) as ClockTaskId[])
    .filter((taskId) => {
      const record = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
      return record.cluster === cluster &&
        (record.disposition === 'PROVISIONAL_AUTHORITY_ANCHOR' ||
         record.disposition === 'MERGE_AS_QUERY_OR_RENDERER_VARIANT');
    });
}

export const CLK_001_PERMANENT_CONTRACTS: readonly ClockPermanentContract[] =
  CLK_001_PERMANENT_QL_SPECS.map(([qlId, cluster, anchorTaskId, studentTask]) => ({
    qlId,
    cluster,
    anchorTaskId,
    checkpointCode: checkpointForClockTask(anchorTaskId),
    studentTask,
    ownedTaskIds: activeTasksForCluster(cluster),
    defaultDifficulty: CLOCK_DIFFICULTY_AUDIT[anchorTaskId].difficulty,
    sourceEvidenceRefs: CLOCK_EFFECTIVE_SOURCE_AUDIT[anchorTaskId].evidenceRefs,
  }));

export const CLK_001_PERMANENT_QL_IDS = CLK_001_PERMANENT_CONTRACTS.map(
  (contract) => contract.qlId,
) as ClockPermanentQlId[];

export const CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS =
  CLK_001_PERMANENT_CONTRACTS
    .filter((contract) =>
      contract.sourceEvidenceRefs.length > 0 &&
      contract.sourceEvidenceRefs.every((ref) => ref === 'CLK_V2_DESIGN'),
    )
    .map((contract) => contract.qlId) as ClockPermanentQlId[];

export const CLK_001_EXTERNALLY_EVIDENCED_QL_IDS =
  CLK_001_PERMANENT_QL_IDS.filter(
    (qlId) => !CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS.includes(qlId),
  ) as ClockPermanentQlId[];

export function getClockPermanentContract(qlId: ClockPermanentQlId): ClockPermanentContract {
  const contract = CLK_001_PERMANENT_CONTRACTS.find((candidate) => candidate.qlId === qlId);
  if (!contract) throw new Error('Unknown CLK-001 permanent QL: ' + qlId);
  return contract;
}

export function isClockPermanentQlId(value: string): value is ClockPermanentQlId {
  return CLK_001_PERMANENT_QL_IDS.includes(value as ClockPermanentQlId);
}

if (!CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete) {
  throw new Error('CLK-001 permanent allocation requires completed source saturation.');
}
if (CLK_001_PERMANENT_CONTRACTS.length !== 23) {
  throw new Error('CLK-001 permanent allocation must contain exactly 23 semantic authorities.');
}
if (new Set(CLK_001_PERMANENT_QL_IDS).size !== 23) {
  throw new Error('CLK-001 permanent QL IDs must be unique.');
}
if (new Set(CLK_001_PERMANENT_CONTRACTS.map((entry) => entry.cluster)).size !== 23) {
  throw new Error('CLK-001 permanent QLs must map one-to-one to the 23 effective authority clusters.');
}
for (const contract of CLK_001_PERMANENT_CONTRACTS) {
  if (!contract.ownedTaskIds.includes(contract.anchorTaskId)) {
    throw new Error(contract.qlId + ' does not own its anchor task.');
  }
  if (CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[contract.anchorTaskId].disposition !== 'PROVISIONAL_AUTHORITY_ANCHOR') {
    throw new Error(contract.qlId + ' must point to a frozen authority anchor, not a merged or held variant.');
  }
}
