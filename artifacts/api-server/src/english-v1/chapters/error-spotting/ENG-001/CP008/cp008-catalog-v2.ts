import type { EnglishDifficulty } from "../../../../core/types";
import { CP008_SCENES_V1, type NounQuantifierSceneV1 } from "./cp008-catalog-v1";

const replacements: Readonly<Record<string, Partial<NounQuantifierSceneV1>>> = {
  "NQN-E04": {
    correctSegments: ["Before lunch,", "the clerk worked alone", "and completed", "a few pending forms."],
    errorSegments: ["Before lunch,", "the clerk worked alone", "and completed", "a little pending forms."],
    errorIndex: 3,
    correction: "a few pending forms.",
  },
  "NQN-E08": {
    correctSegments: ["Compared with yesterday's soup,", "this one", "contains", "less salt."],
    errorSegments: ["Compared with yesterday's soup,", "this one", "contains", "fewer salt."],
    errorIndex: 3,
    correction: "less salt.",
  },
  "NQN-M06": {
    correctSegments: ["Although the work continued", "throughout the afternoon,", "the team made", "very little progress."],
    errorSegments: ["Although the work continued", "throughout the afternoon,", "the team made", "very few progress."],
    errorIndex: 3,
    correction: "very little progress.",
  },
  "NQN-M10": {
    correctSegments: ["During peak hours,", "for the whole building,", "the monitoring system measured", "the amount of electricity used."],
    errorSegments: ["During peak hours,", "for the whole building,", "the monitoring system measured", "the number of electricity used."],
    errorIndex: 3,
    correction: "the amount of electricity used.",
  },

  // Hard closure recalibration: each target sits beside a grammatical competing
  // form so difficulty comes from tracking the head noun, not spotting a cartoonish local form.
  "NQN-H01": {
    correctSegments: ["Although much of the consultation focused on cost,", "many local organisations", "still raised concerns", "about the revised guidelines."],
    errorSegments: ["Although much of the consultation focused on cost,", "much local organisations", "still raised concerns", "about the revised guidelines."],
    errorIndex: 1,
    correction: "many local organisations",
    reason: "'Much' correctly refers to the uncountable consultation content in the opening clause, but 'organisations' is a plural countable noun and therefore needs 'many'.",
  },
  "NQN-H02": {
    correctSegments: ["Although many minor forms were removed,", "the revised procedure still required", "much less paperwork", "than the previous system."],
    errorSegments: ["Although many minor forms were removed,", "the revised procedure still required", "many less paperwork", "than the previous system."],
    errorIndex: 2,
    correction: "much less paperwork",
    reason: "'Many' correctly modifies the plural noun 'forms', but 'paperwork' is uncountable, so the degree phrase must be 'much less paperwork'.",
  },
  "NQN-H03": {
    correctSegments: ["Although little time remained after the first test,", "a few later trials", "produced consistent results", "under the same conditions."],
    errorSegments: ["Although little time remained after the first test,", "a little later trials", "produced consistent results", "under the same conditions."],
    errorIndex: 1,
    correction: "a few later trials",
    reason: "'Little' is correct with uncountable 'time', but 'trials' is plural and countable, so the second quantifier must be 'a few'.",
  },
  "NQN-H04": {
    correctSegments: ["Although little flexibility remained after the deadline,", "the office accepted", "a few late applications", "for documented emergencies."],
    errorSegments: ["Although little flexibility remained after the deadline,", "the office accepted", "a little late applications", "for documented emergencies."],
    errorIndex: 2,
    correction: "a few late applications",
    reason: "'Little' correctly modifies uncountable 'flexibility', whereas plural countable 'applications' requires 'a few'.",
  },
  "NQN-H05": {
    correctSegments: ["Although a few witness statements were available,", "the researchers still had", "very little evidence", "to support the early claim."],
    errorSegments: ["Although a few witness statements were available,", "the researchers still had", "very few evidence", "to support the early claim."],
    errorIndex: 2,
    correction: "very little evidence",
    reason: "'A few' is correct with countable 'statements', but 'evidence' is uncountable in this sense and therefore takes 'little', not 'few'.",
  },
  "NQN-H06": {
    correctSegments: ["Although a few wet patches were still visible,", "only a little moisture", "remained in the soil", "near the surface."],
    errorSegments: ["Although a few wet patches were still visible,", "only a few moisture", "remained in the soil", "near the surface."],
    errorIndex: 1,
    correction: "only a little moisture",
    reason: "'A few' correctly modifies countable 'patches', but 'moisture' is uncountable and needs 'a little'.",
  },
  "NQN-H07": {
    correctSegments: ["Although less staff time was spent on routine entry,", "the branch recorded", "fewer manual transactions", "during the busiest hours."],
    errorSegments: ["Although less staff time was spent on routine entry,", "the branch recorded", "less manual transactions", "during the busiest hours."],
    errorIndex: 2,
    correction: "fewer manual transactions",
    reason: "'Less' correctly modifies uncountable 'staff time', but plural countable 'transactions' requires 'fewer'.",
  },
  "NQN-H08": {
    correctSegments: ["Although fewer cleaning cycles were needed,", "the modified process", "used considerably less water", "while producing the same output."],
    errorSegments: ["Although fewer cleaning cycles were needed,", "the modified process", "used considerably fewer water", "while producing the same output."],
    errorIndex: 2,
    correction: "used considerably less water",
    reason: "'Fewer' correctly modifies countable 'cycles', but 'water' is uncountable and therefore takes 'less'.",
  },
  "NQN-H09": {
    correctSegments: ["Although the amount of time spent on each call fell,", "the number of appointments", "cancelled at short notice", "also declined steadily."],
    errorSegments: ["Although the amount of time spent on each call fell,", "the amount of appointments", "cancelled at short notice", "also declined steadily."],
    errorIndex: 1,
    correction: "the number of appointments",
    reason: "'Amount' is correct with uncountable 'time', but plural countable 'appointments' must be measured by 'number'.",
  },
  "NQN-H10": {
    correctSegments: ["Although the number of operating hours varied by unit,", "the review compared", "the amount of fuel consumed", "during normal operation."],
    errorSegments: ["Although the number of operating hours varied by unit,", "the review compared", "the number of fuel consumed", "during normal operation."],
    errorIndex: 2,
    correction: "the amount of fuel consumed",
    reason: "'Number' correctly measures countable 'hours', but 'fuel' is uncountable, so the second expression must use 'amount'.",
  },
  "NQN-H11": {
    correctSegments: ["After considering several witness statements,", "the panel reviewed", "all the available evidence", "before issuing its order."],
    errorSegments: ["After considering several witness statements,", "the panel reviewed", "all the available evidences", "before issuing its order."],
    errorIndex: 2,
    correction: "all the available evidence",
    reason: "The nearby plural 'statements' is countable, but 'evidence' is normally uncountable in this sense and does not take the regular plural '-s'.",
  },
  "NQN-H12": {
    correctSegments: ["After several bags were tagged separately,", "the airline transferred", "the passengers' remaining luggage", "to a later service."],
    errorSegments: ["After several bags were tagged separately,", "the airline transferred", "the passengers' remaining luggages", "to a later service."],
    errorIndex: 2,
    correction: "the passengers' remaining luggage",
    reason: "Individual 'bags' may be counted, but 'luggage' is an uncountable collective noun and does not normally become 'luggages'.",
  },
  "NQN-H13": {
    correctSegments: ["Although one tooth had already been treated,", "the scan showed that", "several of the patient's teeth", "still required further treatment."],
    errorSegments: ["Although one tooth had already been treated,", "the scan showed that", "several of the patient's tooths", "still required further treatment."],
    errorIndex: 2,
    correction: "several of the patient's teeth",
    reason: "The singular form 'tooth' is correct after 'one', but after 'several' the irregular plural must be 'teeth'.",
  },
  "NQN-H14": {
    correctSegments: ["After one mouse was caught near the entrance,", "the night survey team later observed", "three mice", "near the storage shed."],
    errorSegments: ["After one mouse was caught near the entrance,", "the night survey team later observed", "three mouses", "near the storage shed."],
    errorIndex: 2,
    correction: "three mice",
    reason: "The singular 'mouse' is correct after 'one', while the plural after 'three' is the irregular form 'mice'.",
  },
  "NQN-H15": {
    correctSegments: ["While one telescope remained fixed on the ridge,", "each field team carried", "a pair of binoculars", "for observations at shorter distances."],
    errorSegments: ["While one telescope remained fixed on the ridge,", "each field team carried", "a pair of binocular", "for observations at shorter distances."],
    errorIndex: 2,
    correction: "a pair of binoculars",
    reason: "The singular unit is expressed by 'a pair', but the plural-only noun itself remains 'binoculars'.",
  },
  "NQN-H16": {
    correctSegments: ["Although one scalpel was left on the tray,", "the technician returned", "both pairs of scissors", "to the locked cabinet."],
    errorSegments: ["Although one scalpel was left on the tray,", "the technician returned", "both pairs of scissor", "to the locked cabinet."],
    errorIndex: 2,
    correction: "both pairs of scissors",
    reason: "The count is carried by 'pairs'; the plural-only noun remains 'scissors' even after 'both pairs of'.",
  },
  "NQN-H17": {
    correctSegments: ["After discussing several possible actions,", "the adviser finally offered", "two practical pieces of advice", "based on recent cases."],
    errorSegments: ["After discussing several possible actions,", "the adviser finally offered", "two practical advices", "based on recent cases."],
    errorIndex: 2,
    correction: "two practical pieces of advice",
    reason: "'Actions' can be counted directly, but 'advice' is uncountable and needs a unit expression such as 'pieces of advice'.",
  },
  "NQN-H18": {
    correctSegments: ["Although three old devices were removed from service,", "the inventory showed that the laboratory needed", "three additional items of equipment", "for the new project."],
    errorSegments: ["Although three old devices were removed from service,", "the inventory showed that the laboratory needed", "three additional equipments", "for the new project."],
    errorIndex: 2,
    correction: "three additional items of equipment",
    reason: "'Devices' can be counted directly, but 'equipment' is uncountable and must be counted through a unit expression such as 'items of equipment'.",
  },
  "NQN-H19": {
    correctSegments: ["After the chairperson heard one final objection,", "she listened to a further request from", "one of the representatives", "before closing the meeting."],
    errorSegments: ["After the chairperson heard one final objection,", "she listened to a further request from", "one of the representative", "before closing the meeting."],
    errorIndex: 2,
    correction: "one of the representatives",
    reason: "The singular idea is carried by 'one'; the noun after 'one of the' names the larger group and must therefore be plural: 'representatives'.",
  },
  "NQN-H20": {
    correctSegments: ["Although every group had a different topic,", "each of the groups", "submitted a complete report", "before the common deadline."],
    errorSegments: ["Although every group had a different topic,", "each of the group", "submitted a complete report", "before the common deadline."],
    errorIndex: 1,
    correction: "each of the groups",
    reason: "'Every group' correctly uses a singular noun, but after 'each of the' the noun denotes the set being selected from and must be plural: 'groups'.",
  },
};

export const CP008_SCENES_V2: readonly NounQuantifierSceneV1[] = CP008_SCENES_V1.map((scene) => {
  const patch = replacements[scene.id];
  return patch ? { ...scene, ...patch } as NounQuantifierSceneV1 : scene;
});

export const CP008_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly NounQuantifierSceneV1[]>> = {
  easy: CP008_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP008_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP008_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
};
