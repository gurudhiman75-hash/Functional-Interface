import { modifierScene, type ModifierSceneV1 } from "./cp010-scene-types";

export const CP010_EASY_SCENES_V1: readonly ModifierSceneV1[] = [
  modifierScene({
    id: "MOD-E01", difficulty: "easy", ruleId: "GR-MOD-001", domain: "warehouse", errorIndex: 0,
    correctSegments: ["Walking through the warehouse, the inspector noticed several damaged boxes", "near the loading bay", "during the morning check", "before the area opened."],
    errorSegments: ["Walking through the warehouse, several damaged boxes were noticed by the inspector", "near the loading bay", "during the morning check", "before the area opened."],
    reason: "The inspector is the person walking through the warehouse, so the introductory participial phrase must attach to 'the inspector', not to 'several damaged boxes'.",
  }),
  modifierScene({
    id: "MOD-E02", difficulty: "easy", ruleId: "GR-MOD-001", domain: "school", errorIndex: 1,
    correctSegments: ["Crossing the school courtyard,", "the teacher saw two students", "near the office", "before assembly."],
    errorSegments: ["Crossing the school courtyard,", "two students were seen by the teacher", "near the office", "before assembly."],
    reason: "The teacher is the person crossing the courtyard, so the subject after the opening phrase must be 'the teacher'.",
  }),
  modifierScene({
    id: "MOD-E03", difficulty: "easy", ruleId: "GR-MOD-002", domain: "office", errorIndex: 2,
    correctSegments: ["Having checked the attendance sheet,", "and confirmed the absentees,", "the supervisor signed the register", "before the meeting began."],
    errorSegments: ["Having checked the attendance sheet,", "and confirmed the absentees,", "the register was signed by the supervisor", "before the meeting began."],
    reason: "The supervisor checked the sheet and confirmed the absentees, so the main clause must keep the supervisor as its subject rather than making 'the register' the subject.",
  }),
  modifierScene({
    id: "MOD-E04", difficulty: "easy", ruleId: "GR-MOD-002", domain: "exam-room", errorIndex: 3,
    correctSegments: ["After being warned twice", "for talking to another candidate", "during the final hour,", "the candidate left the hall quietly."],
    errorSegments: ["After being warned twice", "for talking to another candidate", "during the final hour,", "the hall was left quietly by the candidate."],
    reason: "The person who was warned was the candidate, so the subject after the introductory modifier must be 'the candidate', not 'the hall'.",
  }),
  modifierScene({
    id: "MOD-E05", difficulty: "easy", ruleId: "GR-MOD-003", domain: "journey", errorIndex: 0,
    correctSegments: ["Tired after the long journey, Riya found the hotel welcoming", "when she arrived", "with the rest of the group", "late in the evening."],
    errorSegments: ["Tired after the long journey, the hotel looked welcoming to Riya", "when she arrived", "with the rest of the group", "late in the evening."],
    reason: "The opening adjective phrase describes Riya, not the hotel, so Riya must be the subject of the main clause.",
  }),
  modifierScene({
    id: "MOD-E06", difficulty: "easy", ruleId: "GR-MOD-003", domain: "weather", errorIndex: 1,
    correctSegments: ["Cold and wet after the walk,", "the hikers changed their clothes", "as soon as they reached", "the guest house."],
    errorSegments: ["Cold and wet after the walk,", "the guest house welcomed the hikers", "as soon as they reached", "the guest house."],
    reason: "The opening description applies to the hikers, so the hikers must be the subject immediately after it.",
  }),
  modifierScene({
    id: "MOD-E07", difficulty: "easy", ruleId: "GR-MOD-004", domain: "library", errorIndex: 2,
    correctSegments: ["The librarian handed", "the book", "that had a torn cover to the student", "at the counter."],
    errorSegments: ["The librarian handed", "the book", "to the student that had a torn cover", "at the counter."],
    reason: "The relative clause 'that had a torn cover' describes the book, so it must follow 'book' rather than 'student'.",
  }),
  modifierScene({
    id: "MOD-E08", difficulty: "easy", ruleId: "GR-MOD-004", domain: "vehicle", errorIndex: 3,
    correctSegments: ["After the initial inspection,", "the mechanic showed the owner", "the windscreen", "that had a long crack before preparing the estimate."],
    errorSegments: ["After the initial inspection,", "the mechanic showed the owner", "the windscreen", "before preparing the estimate that had a long crack."],
    reason: "The relative clause 'that had a long crack' describes the windscreen, so it must follow 'windscreen' rather than 'estimate'.",
  }),
  modifierScene({
    id: "MOD-E09", difficulty: "easy", ruleId: "GR-MOD-005", domain: "clerical-work", errorIndex: 0,
    correctSegments: ["The clerk checked only the signatures, not the figures,", "before returning", "the file", "to the accounts section."],
    errorSegments: ["Only the clerk checked the signatures, not the figures,", "before returning", "the file", "to the accounts section."],
    reason: "The contrast 'not the figures' shows that 'only' limits what was checked, so it should stand before 'the signatures'.",
  }),
  modifierScene({
    id: "MOD-E10", difficulty: "easy", ruleId: "GR-MOD-005", domain: "training", errorIndex: 1,
    correctSegments: ["During the first session,", "the trainer asked only the new recruits, not the senior staff, to stay back", "for an extra drill", "after lunch."],
    errorSegments: ["During the first session,", "only the trainer asked the new recruits, not the senior staff, to stay back", "for an extra drill", "after lunch."],
    reason: "The contrast identifies the new recruits as the limited group, so 'only' must modify 'the new recruits', not 'the trainer'.",
  }),
  modifierScene({
    id: "MOD-E11", difficulty: "easy", ruleId: "GR-MOD-006", domain: "discount", errorIndex: 2,
    correctSegments: ["The festival discount", "reduced the marked price", "by almost twenty per cent", "at the checkout."],
    errorSegments: ["The festival discount", "reduced the marked price", "almost by twenty per cent", "at the checkout."],
    reason: "'Almost' modifies the amount 'twenty per cent', so it should be placed directly before that amount.",
  }),
  modifierScene({
    id: "MOD-E12", difficulty: "easy", ruleId: "GR-MOD-006", domain: "survey", errorIndex: 3,
    correctSegments: ["By the end of the drive,", "the fuel tank was", "almost empty,", "with barely a litre left."],
    errorSegments: ["By the end of the drive,", "the fuel tank was", "almost empty,", "with a litre almost left."],
    reason: "'Almost' should modify the state or quantity being approached; 'a litre almost left' is not the intended or natural modifier placement here.",
  }),
  modifierScene({
    id: "MOD-E13", difficulty: "easy", ruleId: "GR-MOD-007", domain: "report", errorIndex: 0,
    correctSegments: ["The officer had not even opened the report", "when the reminder arrived", "from headquarters", "that afternoon."],
    errorSegments: ["The officer had even not opened the report", "when the reminder arrived", "from headquarters", "that afternoon."],
    reason: "In a negative perfect construction, 'even' naturally follows 'not' and comes before the focused main verb phrase.",
  }),
  modifierScene({
    id: "MOD-E14", difficulty: "easy", ruleId: "GR-MOD-007", domain: "meeting", errorIndex: 1,
    correctSegments: ["By noon,", "the committee had not even discussed the first proposal", "although three hours", "had already passed."],
    errorSegments: ["By noon,", "the committee had even not discussed the first proposal", "although three hours", "had already passed."],
    reason: "With 'had not', the focus adverb 'even' should come after 'not' before the main verb.",
  }),
  modifierScene({
    id: "MOD-E15", difficulty: "easy", ruleId: "GR-MOD-008", domain: "office-routine", errorIndex: 2,
    correctSegments: ["At the front desk,", "the receptionist", "usually answers all visitor calls", "before forwarding them."],
    errorSegments: ["At the front desk,", "the receptionist", "answers usually all visitor calls", "before forwarding them."],
    reason: "The frequency adverb 'usually' should normally come before the main verb 'answers' rather than between the verb and its object.",
  }),
  modifierScene({
    id: "MOD-E16", difficulty: "easy", ruleId: "GR-MOD-008", domain: "records", errorIndex: 3,
    correctSegments: ["During routine inspections,", "after closing time,", "in the records section,", "staff members rarely leave confidential files on open desks."],
    errorSegments: ["During routine inspections,", "after closing time,", "in the records section,", "staff members leave rarely confidential files on open desks."],
    reason: "The frequency adverb 'rarely' should normally come before the main verb 'leave', not between the verb and its object.",
  }),
  modifierScene({
    id: "MOD-E17", difficulty: "easy", ruleId: "GR-MOD-009", domain: "instruction", errorIndex: 0,
    correctSegments: ["The instructor explained the procedure clearly", "to the new operators", "before the machine", "was switched on."],
    errorSegments: ["The instructor explained clearly the procedure", "to the new operators", "before the machine", "was switched on."],
    reason: "With a transitive verb and a clear object, the manner adverb is most naturally placed after the object: 'explained the procedure clearly'.",
  }),
  modifierScene({
    id: "MOD-E18", difficulty: "easy", ruleId: "GR-MOD-009", domain: "documents", errorIndex: 1,
    correctSegments: ["The clerk", "placed the documents carefully", "in the marked tray", "after checking them."],
    errorSegments: ["The clerk", "placed carefully the documents", "in the marked tray", "after checking them."],
    reason: "The manner adverb should not split 'placed' from its object here; 'placed the documents carefully' is the natural exam-standard order.",
  }),
  modifierScene({
    id: "MOD-E19", difficulty: "easy", ruleId: "GR-MOD-010", domain: "electronics", errorIndex: 2,
    correctSegments: ["Before closing time,", "the customer returned", "the tablet with a cracked screen to the service desk", "for inspection."],
    errorSegments: ["Before closing time,", "the customer returned", "the tablet to the service desk with a cracked screen", "for inspection."],
    reason: "The phrase 'with a cracked screen' describes the tablet, so it should remain next to 'tablet', not next to 'service desk'.",
  }),
  modifierScene({
    id: "MOD-E20", difficulty: "easy", ruleId: "GR-MOD-010", domain: "transport", errorIndex: 3,
    correctSegments: ["During the evening shift,", "before allowing entry,", "the guard checked the papers", "of the truck carrying chemical drums near the main gate."],
    errorSegments: ["During the evening shift,", "before allowing entry,", "the guard checked the papers", "of the truck near the main gate carrying chemical drums."],
    reason: "The participial phrase 'carrying chemical drums' describes the truck and should stay next to 'truck', not next to 'main gate'.",
  }),
];
