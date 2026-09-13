import type { EnglishDifficulty } from "../../../../core/types";
import { CP006_SCENES_BY_DIFFICULTY_V2, type ComparisonSceneV1 } from "./cp006-catalog-v2";

/**
 * V3 is an editorial layout pass, not a new grammar-rule layer. It rewrites
 * selected authored scenes so the keyed error can sit naturally in A, C or D
 * instead of inheriting the V1 catalog's fixed Part-B boundary. Every layout
 * preserves exactly one changed segment and ordinary exam-style word order.
 */
const LAYOUT_FIXES: Readonly<Record<string, Partial<ComparisonSceneV1>>> = Object.freeze({
  // ---------- Part A layouts ----------
  "CMP-E03": {
    correctSegments: ["Clear after the rain,", "the road now looks", "safe for traffic", "and vehicles are moving again."],
    errorSegments: ["Clearly after the rain,", "the road now looks", "safe for traffic", "and vehicles are moving again."],
    errorIndex: 0,
    correction: "Clear after the rain,",
    reason: "Clear is an adjective describing the road; clearly is an adverb.",
  },
  "CMP-E05": {
    correctSegments: ["As simple as the earlier version,", "the new form", "can be completed", "without extra guidance."],
    errorSegments: ["As simpler as the earlier version,", "the new form", "can be completed", "without extra guidance."],
    errorIndex: 0,
    correction: "As simple as the earlier version,",
    reason: "Use the positive degree simple between as and as.",
  },
  "CMP-E09": {
    correctSegments: ["The smallest planet", "in the solar system", "is Mercury", "by diameter."],
    errorSegments: ["Smallest planet", "in the solar system", "is Mercury", "by diameter."],
    errorIndex: 0,
    correction: "The smallest planet",
    reason: "Use the before an ordinary superlative that identifies one member of a group.",
  },
  "CMP-E11": {
    correctSegments: ["Easier than the old process,", "the revised procedure", "is preferred", "by new employees."],
    errorSegments: ["More easier than the old process,", "the revised procedure", "is preferred", "by new employees."],
    errorIndex: 0,
    correction: "Easier than the old process,",
    reason: "Easier is already comparative, so more must not be added.",
  },
  "CMP-E13": {
    correctSegments: ["Better than her first attempt,", "her second attempt", "showed improvement", "in every section."],
    errorSegments: ["Best than her first attempt,", "her second attempt", "showed improvement", "in every section."],
    errorIndex: 0,
    correction: "Better than her first attempt,",
    reason: "Two attempts are being compared, so use the comparative better, not the superlative best.",
  },
  "CMP-M04": {
    correctSegments: ["Clear to most candidates,", "the revised instructions", "seem easier", "after the examples were added."],
    errorSegments: ["Clearly to most candidates,", "the revised instructions", "seem easier", "after the examples were added."],
    errorIndex: 0,
    correction: "Clear to most candidates,",
    reason: "Clear is the adjective that describes the instructions after the linking verb seem.",
  },
  "CMP-M09": {
    correctSegments: ["One of the oldest colleges", "in the region,", "the institute still offers", "this course every year."],
    errorSegments: ["One of the oldest college", "in the region,", "the institute still offers", "this course every year."],
    errorIndex: 0,
    correction: "One of the oldest colleges",
    reason: "After one of the, the noun naming the group must be plural: colleges.",
  },
  "CMP-M12": {
    correctSegments: ["The fastest delivery", "recorded by the depot", "was completed", "during the final week of the quarter."],
    errorSegments: ["The most fastest delivery", "recorded by the depot", "was completed", "during the final week of the quarter."],
    errorIndex: 0,
    correction: "The fastest delivery",
    reason: "Fastest is already superlative, so most must not be added.",
  },
  "CMP-M18": {
    correctSegments: ["The clearest provision", "in the revised rules", "appears near the end", "of the notification."],
    errorSegments: ["Clearest provision", "in the revised rules", "appears near the end", "of the notification."],
    errorIndex: 0,
    correction: "The clearest provision",
    reason: "The is required before the ordinary superlative clearest in this group comparison.",
  },
  "CMP-H05": {
    correctSegments: ["As stable as the previous quarter's measure,", "the revised index", "remained after seasonal effects", "were removed from the data."],
    errorSegments: ["As more stable as the previous quarter's measure,", "the revised index", "remained after seasonal effects", "were removed from the data."],
    errorIndex: 0,
    correction: "As stable as the previous quarter's measure,",
    reason: "The as ... as structure requires the positive degree stable.",
  },
  "CMP-H09": {
    correctSegments: ["The most complete file", "among all applications received before the deadline", "was examined first", "by the scrutiny team."],
    errorSegments: ["Most complete file", "among all applications received before the deadline", "was examined first", "by the scrutiny team."],
    errorIndex: 0,
    correction: "The most complete file",
    reason: "The definite article the is required before the ordinary superlative most complete.",
  },
  "CMP-H14": {
    correctSegments: ["The highest yield", "among the plots under identical irrigation", "came from the northern plot", "during the final harvest."],
    errorSegments: ["The most highest yield", "among the plots under identical irrigation", "came from the northern plot", "during the final harvest."],
    errorIndex: 0,
    correction: "The highest yield",
    reason: "Highest is already superlative, so most must not be added.",
  },
  "CMP-H19": {
    correctSegments: ["The worst defect rate", "among the three recalibrated batches", "was recorded in the first batch", "under the revised inspection method."],
    errorSegments: ["The worse defect rate", "among the three recalibrated batches", "was recorded in the first batch", "under the revised inspection method."],
    errorIndex: 0,
    correction: "The worst defect rate",
    reason: "Three batches are compared, so use the superlative worst rather than the comparative worse.",
  },
  "CMP-H20": {
    correctSegments: ["The most practical proposal", "accepted by every department", "reduced duplicate paperwork", "without changing the approval process."],
    errorSegments: ["Most practical proposal", "accepted by every department", "reduced duplicate paperwork", "without changing the approval process."],
    errorIndex: 0,
    correction: "The most practical proposal",
    reason: "The definite article the is required before the ordinary superlative most practical.",
  },
  "CMP-M17": {
    correctSegments: ["The best sales record", "among all five outlets", "belonged to this outlet", "during the festival."],
    errorSegments: ["The better sales record", "among all five outlets", "belonged to this outlet", "during the festival."],
    errorIndex: 0,
    correction: "The best sales record",
    reason: "The comparison covers all five outlets, so use the superlative best rather than the comparative better.",
  },

  // ---------- Part C layouts ----------
  "CMP-E01": {
    correctSegments: ["Before the counter closed for the day,", "the clerk", "completed the register carefully", "at the main desk."],
    errorSegments: ["Before the counter closed for the day,", "the clerk", "completed the register careful", "at the main desk."],
    errorIndex: 2,
    correction: "completed the register carefully",
    reason: "Carefully is the adverb that tells how the clerk completed the register.",
  },
  "CMP-E06": {
    correctSegments: ["In the final lap,", "Ravi", "ran as fast as his teammate", "until the finish."],
    errorSegments: ["In the final lap,", "Ravi", "ran as faster as his teammate", "until the finish."],
    errorIndex: 2,
    correction: "ran as fast as his teammate",
    reason: "Use the positive degree fast in the as ... as structure.",
  },
  "CMP-E08": {
    correctSegments: ["By several acres,", "this field", "is larger than the one near the road", "according to the survey."],
    errorSegments: ["By several acres,", "this field", "is large than the one near the road", "according to the survey."],
    errorIndex: 2,
    correction: "is larger than the one near the road",
    reason: "A comparison of two fields requires the comparative form larger.",
  },
  "CMP-E14": {
    correctSegments: ["Compared with noon,", "the visibility", "was worse after sunset", "because the fog grew thicker."],
    errorSegments: ["Compared with noon,", "the visibility", "was worst after sunset", "because the fog grew thicker."],
    errorIndex: 2,
    correction: "was worse after sunset",
    reason: "Two states of visibility are compared, so use the comparative worse, not the superlative worst.",
  },
  "CMP-E16": {
    correctSegments: ["After the final quality check,", "the fresh stock", "appears ready for sale", "at the front counter."],
    errorSegments: ["After the final quality check,", "the fresh stock", "appears readily for sale", "at the front counter."],
    errorIndex: 2,
    correction: "appears ready for sale",
    reason: "Appears is a linking verb here, so the adjective ready describes the stock.",
  },
  "CMP-M01": {
    correctSegments: ["Before accepting the revised statement,", "the audit team", "examined the supporting records closely", "against the original vouchers."],
    errorSegments: ["Before accepting the revised statement,", "the audit team", "examined the supporting records close", "against the original vouchers."],
    errorIndex: 2,
    correction: "examined the supporting records closely",
    reason: "Closely is the adverb that describes the manner of examination.",
  },
  "CMP-M05": {
    correctSegments: ["After the repair,", "the machine", "runs as smoothly as the newer unit", "on the next line."],
    errorSegments: ["After the repair,", "the machine", "runs as more smoothly as the newer unit", "on the next line."],
    errorIndex: 2,
    correction: "runs as smoothly as the newer unit",
    reason: "The as ... as frame takes the positive degree smoothly.",
  },
  "CMP-M07": {
    correctSegments: ["Across the canal,", "the eastern bridge", "is wider than the older bridge", "used by local traffic."],
    errorSegments: ["Across the canal,", "the eastern bridge", "is widest than the older bridge", "used by local traffic."],
    errorIndex: 2,
    correction: "is wider than the older bridge",
    reason: "Two bridges are being compared, so the comparative wider is required.",
  },
  "CMP-M11": {
    correctSegments: ["For field teams,", "the revised schedule", "is simpler than the original schedule", "used last month."],
    errorSegments: ["For field teams,", "the revised schedule", "is more simpler than the original schedule", "used last month."],
    errorIndex: 2,
    correction: "is simpler than the original schedule",
    reason: "Simpler already expresses the comparative degree; more must not be added.",
  },
  "CMP-M16": {
    correctSegments: ["In two categories,", "the latest survey", "produced worse results than the previous survey", "conducted last year."],
    errorSegments: ["In two categories,", "the latest survey", "produced worst results than the previous survey", "conducted last year."],
    errorIndex: 2,
    correction: "produced worse results than the previous survey",
    reason: "Two surveys are directly compared with than, so use the comparative worse rather than the superlative worst.",
  },
  "CMP-H02": {
    correctSegments: ["After the initial readings were discarded,", "the researchers", "measured the remaining samples accurately", "under the same controlled conditions."],
    errorSegments: ["After the initial readings were discarded,", "the researchers", "measured the remaining samples accurate", "under the same controlled conditions."],
    errorIndex: 2,
    correction: "measured the remaining samples accurately",
    reason: "Accurately describes how the researchers measured the samples, so the adverb is required.",
  },
  "CMP-H06": {
    correctSegments: ["At full load,", "the older unit", "performs as efficiently as the replacement", "under the specified test conditions."],
    errorSegments: ["At full load,", "the older unit", "performs as more efficiently as the replacement", "under the specified test conditions."],
    errorIndex: 2,
    correction: "performs as efficiently as the replacement",
    reason: "Use the positive degree efficiently inside the as ... as frame.",
  },
  "CMP-H11": {
    correctSegments: ["After the latest expansion was completed,", "the terminal", "became one of the busiest transport hubs", "serving the northern region."],
    errorSegments: ["After the latest expansion was completed,", "the terminal", "became one of the busiest transport hub", "serving the northern region."],
    errorIndex: 2,
    correction: "became one of the busiest transport hubs",
    reason: "After one of the + superlative, the noun naming the group must be plural: hubs.",
  },
  "CMP-H13": {
    correctSegments: ["Under a comparable workload,", "the newer model", "responds faster than the older version", "on the same network."],
    errorSegments: ["Under a comparable workload,", "the newer model", "responds more faster than the older version", "on the same network."],
    errorIndex: 2,
    correction: "responds faster than the older version",
    reason: "Faster is already comparative; more must not be added.",
  },
  "CMP-H18": {
    correctSegments: ["Although both teams improved after the break,", "the second team", "performed better than the first team", "in the final round."],
    errorSegments: ["Although both teams improved after the break,", "the second team", "performed best than the first team", "in the final round."],
    errorIndex: 2,
    correction: "performed better than the first team",
    reason: "Two teams are directly compared with than, so use the comparative better rather than the superlative best.",
  },

  // ---------- Part D layouts ----------
  "CMP-E02": {
    correctSegments: ["Before starting the exercise,", "the students", "listened to the instructions", "quietly."],
    errorSegments: ["Before starting the exercise,", "the students", "listened to the instructions", "quiet."],
    errorIndex: 3,
    correction: "quietly.",
    reason: "Quietly is the adverb needed to describe how the students listened.",
  },
  "CMP-E04": {
    correctSegments: ["After taking the prescribed medicine,", "the patient", "said that she felt", "comfortable this morning."],
    errorSegments: ["After taking the prescribed medicine,", "the patient", "said that she felt", "comfortably this morning."],
    errorIndex: 3,
    correction: "comfortable this morning.",
    reason: "Felt is a linking verb here, so comfortable is the adjective describing the patient.",
  },
  "CMP-E07": {
    correctSegments: ["In the handbook,", "the previous chapter", "is longer than", "this chapter."],
    errorSegments: ["In the handbook,", "the previous chapter", "is longer compared with", "this chapter."],
    errorIndex: 2,
    correction: "is longer than",
    reason: "A direct comparison of two chapters uses the comparative with than.",
  },
  "CMP-E15": {
    correctSegments: ["At the help desk,", "the officer", "explained the procedure", "clearly to the applicants."],
    errorSegments: ["At the help desk,", "the officer", "explained the procedure", "clear to the applicants."],
    errorIndex: 3,
    correction: "clearly to the applicants.",
    reason: "Clearly is the adverb that describes how the procedure was explained.",
  },
  "CMP-E20": {
    correctSegments: ["During peak hours,", "drivers usually find", "this route", "better than the longer route."],
    errorSegments: ["During peak hours,", "drivers usually find", "this route", "best than the longer route."],
    errorIndex: 3,
    correction: "better than the longer route.",
    reason: "Two routes are compared, so use the comparative better, not the superlative best.",
  },
  "CMP-M02": {
    correctSegments: ["Before the pressure was tested again,", "the technician", "adjusted the valve", "precisely."],
    errorSegments: ["Before the pressure was tested again,", "the technician", "adjusted the valve", "precise."],
    errorIndex: 3,
    correction: "precisely.",
    reason: "Precisely is the adverb that modifies the action adjusted.",
  },
  "CMP-M03": {
    correctSegments: ["Until the storm reached the valley,", "the river", "continued to look", "calm despite the wind."],
    errorSegments: ["Until the storm reached the valley,", "the river", "continued to look", "calmly despite the wind."],
    errorIndex: 3,
    correction: "calm despite the wind.",
    reason: "Look is a linking verb here, so calm is the adjective describing the river.",
  },
  "CMP-M08": {
    correctSegments: ["For this purpose,", "the new test", "has proved", "more reliable than the earlier method."],
    errorSegments: ["For this purpose,", "the new test", "has proved", "most reliable than the earlier method."],
    errorIndex: 3,
    correction: "more reliable than the earlier method.",
    reason: "A comparison of two methods requires the comparative more reliable.",
  },
  "CMP-M14": {
    correctSegments: ["Under the same test,", "the new processor", "proved", "much faster than the earlier model."],
    errorSegments: ["Under the same test,", "the new processor", "proved", "very faster than the earlier model."],
    errorIndex: 3,
    correction: "much faster than the earlier model.",
    reason: "Much is a standard intensifier with faster; very is not used directly before this comparative.",
  },
  "CMP-M20": {
    correctSegments: ["On this route,", "the express service", "is", "a little quicker than the regular service."],
    errorSegments: ["On this route,", "the express service", "is", "very quicker than the regular service."],
    errorIndex: 3,
    correction: "a little quicker than the regular service.",
    reason: "A little can modify a comparative; very quicker is not the standard construction.",
  },
  "CMP-H01": {
    correctSegments: ["Although the file contained several detailed annexures,", "the reviewing officer", "checked each entry", "thoroughly before forwarding the case."],
    errorSegments: ["Although the file contained several detailed annexures,", "the reviewing officer", "checked each entry", "thorough before forwarding the case."],
    errorIndex: 3,
    correction: "thoroughly before forwarding the case.",
    reason: "Thoroughly is the adverb that modifies the action checked.",
  },
  "CMP-H03": {
    correctSegments: ["Even after the dosage was reduced,", "the patient's condition", "continued to remain", "unusually stable throughout observation."],
    errorSegments: ["Even after the dosage was reduced,", "the patient's condition", "continued to remain", "unusually stably throughout observation."],
    errorIndex: 3,
    correction: "unusually stable throughout observation.",
    reason: "Remain is a linking verb here; unusually modifies the adjective stable, which describes the condition.",
  },
  "CMP-H07": {
    correctSegments: ["For frequent small payments,", "customers generally find", "the digital option", "more convenient than the paper method."],
    errorSegments: ["For frequent small payments,", "customers generally find", "the digital option", "most convenient than the paper method."],
    errorIndex: 3,
    correction: "more convenient than the paper method.",
    reason: "Two methods are compared, so the comparative more convenient is required.",
  },
  "CMP-H12": {
    correctSegments: ["After the unnecessary approval stage was removed,", "staff found", "the revised workflow", "simpler than the older procedure."],
    errorSegments: ["After the unnecessary approval stage was removed,", "staff found", "the revised workflow", "more simpler than the older procedure."],
    errorIndex: 3,
    correction: "simpler than the older procedure.",
    reason: "Simpler already expresses the comparative degree; more simpler is a double comparative.",
  },
  "CMP-H17": {
    correctSegments: ["Once the damaged road section was repaired,", "commuters found", "the morning journey", "much shorter than the previous week."],
    errorSegments: ["Once the damaged road section was repaired,", "commuters found", "the morning journey", "very shorter than the previous week."],
    errorIndex: 3,
    correction: "much shorter than the previous week.",
    reason: "Much is a standard intensifier with shorter; very shorter is not.",
  },
});

const applyLayoutFix = (scene: ComparisonSceneV1): ComparisonSceneV1 => {
  const fix = LAYOUT_FIXES[scene.id];
  return fix ? { ...scene, ...fix } : scene;
};

export const CP006_SCENES_BY_DIFFICULTY_V3: Readonly<Record<EnglishDifficulty, readonly ComparisonSceneV1[]>> = Object.freeze({
  easy: CP006_SCENES_BY_DIFFICULTY_V2.easy.map(applyLayoutFix),
  medium: CP006_SCENES_BY_DIFFICULTY_V2.medium.map(applyLayoutFix),
  hard: CP006_SCENES_BY_DIFFICULTY_V2.hard.map(applyLayoutFix),
});

export const CP006_SCENES_V3: readonly ComparisonSceneV1[] = Object.freeze([
  ...CP006_SCENES_BY_DIFFICULTY_V3.easy,
  ...CP006_SCENES_BY_DIFFICULTY_V3.medium,
  ...CP006_SCENES_BY_DIFFICULTY_V3.hard,
]);
