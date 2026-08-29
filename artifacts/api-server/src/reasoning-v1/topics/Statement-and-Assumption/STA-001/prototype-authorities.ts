import { STA_EXECUTABLE_SCENARIOS as V1_SCENARIOS } from "./prototypes.ts";
import type { StaCandidateAuthority, StaDependency, StaProposition, StaScenarioAuthority } from "./types.ts";

const SOURCE = "SOURCE_SUPPORTED_EXECUTABLE_DISCOVERY" as const;

function proposition(
  propositionId: string,
  semanticKey: string,
  oppositeSemanticKey: string,
  entities: readonly string[],
  quantifier?: StaProposition["quantifier"],
): StaProposition {
  return { propositionId, semanticKey, oppositeSemanticKey, polarity: "POSITIVE", entities, ...(quantifier ? { quantifier } : {}) };
}

function dependency(
  dependencyId: string,
  propositionId: string,
  relation: StaDependency["relation"],
  requiredFor: readonly string[],
  denialEffect: StaDependency["denialEffect"],
): StaDependency {
  return { dependencyId, propositionId, relation, requiredFor, denialEffect };
}

function candidate(
  candidateId: string,
  propositionId: string,
  textVariants: readonly [string, ...string[]],
  expectedClassification: StaCandidateAuthority["expectedClassification"],
  rationale: string,
  misconceptionClass?: StaCandidateAuthority["misconceptionClass"],
): StaCandidateAuthority {
  return {
    candidateId,
    propositionId,
    textVariants,
    expectedClassification,
    rationale,
    ...(misconceptionClass ? { misconceptionClass } : {}),
  };
}

const STA_QL002_ALL_THREE_IMPLICIT: StaScenarioAuthority = {
  scenarioId: "STA-DISC-QL002-004",
  proposedQlId: "STA-QL-002",
  checkpointId: "STA-CP-002",
  sourceProfile: "SSC",
  discourseAct: "RECOMMENDATION",
  objectiveIds: ["ENABLE_EVENING_STUDY_AFTER_LECTURES"],
  statementVariants: [
    "The college should keep the library open until 9 p.m. so evening-class students can study after lectures.",
    "To let evening-class students study after lectures, the college should extend library hours until 9 p.m.",
  ],
  propositions: [
    proposition("P1", "SOME_EVENING_STUDENTS_NEED_POST_LECTURE_STUDY_ACCESS", "NO_EVENING_STUDENT_NEEDS_POST_LECTURE_STUDY_ACCESS", ["evening-class students", "library"], "SOME"),
    proposition("P2", "LIBRARY_CAN_REMAIN_OPEN_UNTIL_9PM", "LIBRARY_CANNOT_REMAIN_OPEN_UNTIL_9PM", ["library", "9 p.m."]),
    proposition("P3", "EXTENDED_LIBRARY_HOURS_CAN_ENABLE_POST_LECTURE_STUDY", "EXTENDED_LIBRARY_HOURS_CANNOT_ENABLE_POST_LECTURE_STUDY", ["library hours", "evening-class students"]),
  ],
  explicitPropositionIds: [],
  hiddenDependencies: [
    dependency("D1", "P1", "RELEVANCE", ["ENABLE_EVENING_STUDY_AFTER_LECTURES"], "BREAKS_RELEVANCE"),
    dependency("D2", "P2", "FEASIBILITY", ["ENABLE_EVENING_STUDY_AFTER_LECTURES"], "BREAKS_FEASIBILITY"),
    dependency("D3", "P3", "EFFICACY", ["ENABLE_EVENING_STUDY_AFTER_LECTURES"], "BREAKS_RATIONALE"),
  ],
  candidates: [
    candidate("C1", "P1", ["Some evening-class students need library access after lectures.", "There are evening-class students who need a place to study after lectures."], "IMPLICIT", "The stated purpose of extending hours is to serve evening-class students after lectures; without such a need, that rationale disappears."),
    candidate("C2", "P2", ["The library can remain open until 9 p.m.", "Keeping the library open until 9 p.m. is feasible."], "IMPLICIT", "A recommendation to extend opening hours assumes the library can actually operate during those hours."),
    candidate("C3", "P3", ["Longer library hours can enable evening-class students to study after lectures.", "Extending the library hours can give evening-class students post-lecture study access."], "IMPLICIT", "The recommendation depends on the extended hours being capable of achieving its stated purpose."),
  ],
  allowedCandidateCounts: [3],
  difficulty: "Hard",
  sourceStatus: SOURCE,
};

const STA_QL004_REFINED: readonly StaScenarioAuthority[] = [
  {
    scenarioId: "STA-DISC-QL004-001-V2",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "BANKING",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_QUEUE_COMPLAINT_REDUCTION"],
    statementVariants: [
      "The new barcode scanners process each item faster, so complaints about long checkout queues are expected to fall.",
      "Because the new barcode scanners speed up item processing, the branch expects fewer complaints about long checkout queues.",
    ],
    propositions: [
      proposition("P0", "BARCODE_SCANNERS_PROCESS_ITEMS_FASTER", "BARCODE_SCANNERS_DO_NOT_PROCESS_ITEMS_FASTER", ["barcode scanners", "items"]),
      proposition("P1", "FASTER_CHECKOUT_PROCESSING_CAN_REDUCE_QUEUE_COMPLAINTS", "FASTER_CHECKOUT_PROCESSING_CANNOT_REDUCE_QUEUE_COMPLAINTS", ["checkout processing", "queue complaints"]),
      proposition("P2", "CUSTOMERS_WILL_BUY_FEWER_ITEMS", "CUSTOMERS_WILL_NOT_BUY_FEWER_ITEMS", ["customers", "items"]),
      proposition("P3", "SCANNERS_ARE_MOST_EXPENSIVE_EQUIPMENT", "SCANNERS_ARE_NOT_MOST_EXPENSIVE_EQUIPMENT", ["barcode scanners"]),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_QUEUE_COMPLAINT_REDUCTION"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["Faster checkout processing can reduce complaints about long queues.", "Reducing checkout processing time can lower queue-related complaints."], "IMPLICIT", "The prediction moves from faster item processing to fewer queue complaints; it requires a bridge that faster processing can actually improve the queue experience."),
      candidate("C2", "P2", ["Customers will buy fewer items after the scanners are installed.", "The scanners will cause customers to reduce the number of items they buy."], "NOT_IMPLICIT", "The expected fall in queue complaints does not require customers to buy fewer items.", "CONCLUSION_OR_CONSEQUENCE"),
      candidate("C3", "P3", ["The scanners are the most expensive equipment at the counters.", "No counter equipment costs more than the new scanners."], "NOT_IMPLICIT", "Equipment cost ranking has no role in the predicted change in queue complaints.", "RELATED_BUT_IRRELEVANT"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL004-002-V2",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "SSC",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_HEAT_DISCOMFORT_COMPLAINT_REDUCTION"],
    statementVariants: [
      "The proposed shade cover will block direct afternoon sun from the outdoor waiting area, so complaints about heat discomfort should decline.",
      "By blocking direct afternoon sun in the outdoor waiting area, the shade cover is expected to reduce complaints about heat discomfort.",
    ],
    propositions: [
      proposition("P0", "SHADE_COVER_BLOCKS_DIRECT_AFTERNOON_SUN", "SHADE_COVER_DOES_NOT_BLOCK_DIRECT_AFTERNOON_SUN", ["shade cover", "afternoon sun"]),
      proposition("P1", "LESS_DIRECT_SUN_CAN_REDUCE_HEAT_DISCOMFORT", "LESS_DIRECT_SUN_CANNOT_REDUCE_HEAT_DISCOMFORT", ["direct sun", "heat discomfort"]),
      proposition("P2", "ALL_VISITORS_DISLIKE_SUNLIGHT", "NOT_ALL_VISITORS_DISLIKE_SUNLIGHT", ["visitors", "sunlight"], "ALL"),
      proposition("P3", "SHADE_WILL_ELIMINATE_ALL_WAITING", "SHADE_WILL_NOT_ELIMINATE_ALL_WAITING", ["shade", "waiting"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_HEAT_DISCOMFORT_COMPLAINT_REDUCTION"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["Reducing direct sun can reduce heat discomfort in the waiting area.", "Less exposure to direct afternoon sun can make waiting more comfortable in hot weather."], "IMPLICIT", "The prediction needs a causal bridge from blocking direct sun to reducing the heat discomfort that produces the complaints."),
      candidate("C2", "P2", ["All visitors dislike sunlight.", "Every visitor dislikes being in sunlight."], "NOT_IMPLICIT", "The prediction does not require a universal preference about sunlight; it only depends on direct sun contributing to heat discomfort." , "TOO_STRONG_QUANTIFIER"),
      candidate("C3", "P3", ["The shade will eliminate all waiting.", "Once shade is added, nobody will need to wait."], "NOT_IMPLICIT", "The claim concerns discomfort complaints while waiting, not elimination of the queue itself.", "CAUSE_EFFECT_OVERREACH"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Medium",
    sourceStatus: SOURCE,
  },
  {
    scenarioId: "STA-DISC-QL004-003-V2",
    proposedQlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    sourceProfile: "CROSS_EXAM_DISCOVERY",
    discourseAct: "PREDICTION",
    objectiveIds: ["PREDICT_FORGOTTEN_APPOINTMENT_REDUCTION"],
    statementVariants: [
      "The new system sends each customer a reminder the evening before the appointment, so forgotten appointments are expected to decrease.",
      "Because customers will receive a reminder the evening before their appointment, the service centre expects fewer appointments to be forgotten.",
    ],
    propositions: [
      proposition("P0", "CUSTOMERS_RECEIVE_PRE_APPOINTMENT_REMINDER", "CUSTOMERS_DO_NOT_RECEIVE_PRE_APPOINTMENT_REMINDER", ["customers", "reminder", "appointment"]),
      proposition("P1", "TIMELY_REMINDERS_CAN_PREVENT_SOME_FORGETTING", "TIMELY_REMINDERS_CANNOT_PREVENT_ANY_FORGETTING", ["reminders", "forgetting"], "SOME"),
      proposition("P2", "EVERY_MISSED_APPOINTMENT_IS_DUE_TO_FORGETFULNESS", "NOT_EVERY_MISSED_APPOINTMENT_IS_DUE_TO_FORGETFULNESS", ["missed appointments", "forgetfulness"], "ALL"),
      proposition("P3", "REMINDERS_WILL_REMOVE_ALL_CANCELLATIONS", "REMINDERS_WILL_NOT_REMOVE_ALL_CANCELLATIONS", ["reminders", "cancellations"], "ALL"),
    ],
    explicitPropositionIds: ["P0"],
    hiddenDependencies: [dependency("D1", "P1", "EFFICACY", ["PREDICT_FORGOTTEN_APPOINTMENT_REDUCTION"], "BREAKS_RATIONALE")],
    candidates: [
      candidate("C1", "P1", ["A timely reminder can prevent at least some customers from forgetting appointments.", "Reminders sent before an appointment can stop some appointments from being forgotten."], "IMPLICIT", "The prediction depends on reminders being able to prevent at least some forgetting; otherwise receiving the reminder would not support the expected decline."),
      candidate("C2", "P2", ["Every missed appointment is caused by forgetfulness.", "Forgetfulness is the reason for all missed appointments."], "NOT_IMPLICIT", "The claim is only about forgotten appointments decreasing; it does not require forgetfulness to explain every missed appointment.", "TOO_STRONG_QUANTIFIER"),
      candidate("C3", "P3", ["Automatic reminders will eliminate all cancellations.", "No appointment will ever be cancelled after reminders are introduced."], "NOT_IMPLICIT", "The statement predicts fewer forgotten appointments, not elimination of every cancellation.", "CAUSE_EFFECT_OVERREACH"),
    ],
    allowedCandidateCounts: [2, 3],
    difficulty: "Hard",
    sourceStatus: SOURCE,
  },
] as const;

const BASE_WITHOUT_QL004 = V1_SCENARIOS.filter((scenario) => scenario.proposedQlId !== "STA-QL-004");

export const STA_EXECUTABLE_SCENARIOS: readonly StaScenarioAuthority[] = [
  ...BASE_WITHOUT_QL004,
  STA_QL002_ALL_THREE_IMPLICIT,
  ...STA_QL004_REFINED,
];

export const STA_SCENARIOS_BY_QL: Readonly<Record<StaScenarioAuthority["proposedQlId"], readonly StaScenarioAuthority[]>> = {
  "STA-QL-001": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-001"),
  "STA-QL-002": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-002"),
  "STA-QL-003": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-003"),
  "STA-QL-004": STA_EXECUTABLE_SCENARIOS.filter((scenario) => scenario.proposedQlId === "STA-QL-004"),
};
