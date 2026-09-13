import type { EnglishDifficulty } from "../../../../core/types";
import { CP007_SCENES_V1, type ConjunctionSceneV1 } from "./cp007-catalog-v1";

const replacements: Readonly<Record<string, ConjunctionSceneV1>> = {
  "CON-E03": {
    id: "CON-E03", difficulty: "easy", ruleId: "GR-CON-002", domain: "school",
    correctSegments: ["During the school drive,", "teachers and students", "supported the campaign", "both in class and online."],
    errorSegments: ["During the school drive,", "teachers and students", "supported the campaign", "both in class or online."],
    errorIndex: 3, correction: "both in class and online.", reason: "The fixed correlative pair is 'both ... and'.",
  },
  "CON-E05": {
    id: "CON-E05", difficulty: "easy", ruleId: "GR-CON-003", domain: "shopping",
    correctSegments: ["At the counter,", "customers may pay", "for the purchase", "either by card or in cash."],
    errorSegments: ["At the counter,", "customers may pay", "for the purchase", "either by card nor in cash."],
    errorIndex: 3, correction: "either by card or in cash.", reason: "The correct correlative pair for alternatives is 'either ... or'.",
  },
  "CON-E09": {
    id: "CON-E09", difficulty: "easy", ruleId: "GR-CON-005", domain: "music",
    correctSegments: ["For the competition,", "the singer", "prepared the entry", "not only by writing the song but also by composing the music."],
    errorSegments: ["For the competition,", "the singer", "prepared the entry", "not only by writing the song and also by composing the music."],
    errorIndex: 3, correction: "not only by writing the song but also by composing the music.", reason: "The matching pair is 'not only ... but also'.",
  },
  "CON-E13": {
    id: "CON-E13", difficulty: "easy", ruleId: "GR-CON-007", domain: "traffic",
    correctSegments: ["The bus", "reached the terminal late", "that morning", "because the road was blocked after an accident."],
    errorSegments: ["The bus", "reached the terminal late", "that morning", "because of the road was blocked after an accident."],
    errorIndex: 3, correction: "because the road was blocked after an accident.", reason: "Use 'because' before a finite clause such as 'the road was blocked'.",
  },
  "CON-E17": {
    id: "CON-E17", difficulty: "easy", ruleId: "GR-CON-009", domain: "fitness",
    correctSegments: ["Her daily routine", "is simple", "and easy to follow:", "walking in the morning, stretching after lunch, and cycling in the evening."],
    errorSegments: ["Her daily routine", "is simple", "and easy to follow:", "walking in the morning, to stretch after lunch, and cycling in the evening."],
    errorIndex: 3, correction: "walking in the morning, stretching after lunch, and cycling in the evening.", reason: "Items in a coordinated list should use the same grammatical form; all three are gerunds here.",
  },
  "CON-M03": {
    id: "CON-M03", difficulty: "medium", ruleId: "GR-CON-002", domain: "public-service",
    correctSegments: ["Under the revised scheme,", "the assistance", "is available", "both to rural workers and to small farmers."],
    errorSegments: ["Under the revised scheme,", "the assistance", "is available", "both to rural workers or to small farmers."],
    errorIndex: 3, correction: "both to rural workers and to small farmers.", reason: "Use 'both ... and' when including two groups together.",
  },
  "CON-M05": {
    id: "CON-M05", difficulty: "medium", ruleId: "GR-CON-003", domain: "admissions",
    correctSegments: ["With the application,", "a candidate", "may submit proof of identity", "either through a passport or through another approved document."],
    errorSegments: ["With the application,", "a candidate", "may submit proof of identity", "either through a passport and through another approved document."],
    errorIndex: 3, correction: "either through a passport or through another approved document.", reason: "Two alternatives after 'either' must be joined by 'or'.",
  },
  "CON-M09": {
    id: "CON-M09", difficulty: "medium", ruleId: "GR-CON-005", domain: "education",
    correctSegments: ["In each session,", "the workshop", "uses one practical example", "not only to explain the concept but also to demonstrate its use."],
    errorSegments: ["In each session,", "the workshop", "uses one practical example", "not only to explain the concept and also to demonstrate its use."],
    errorIndex: 3, correction: "not only to explain the concept but also to demonstrate its use.", reason: "Use 'not only ... but also' in the standard paired form.",
  },
  "CON-M13": {
    id: "CON-M13", difficulty: "medium", ruleId: "GR-CON-007", domain: "aviation",
    correctSegments: ["Several flights", "were delayed", "before sunrise", "because visibility had fallen sharply."],
    errorSegments: ["Several flights", "were delayed", "before sunrise", "because of visibility had fallen sharply."],
    errorIndex: 3, correction: "because visibility had fallen sharply.", reason: "A finite clause follows, so use 'because', not 'because of'.",
  },
  "CON-M17": {
    id: "CON-M17", difficulty: "medium", ruleId: "GR-CON-009", domain: "management",
    correctSegments: ["In this role,", "the supervisor", "handles three regular duties:", "planning weekly schedules, reviewing team performance, and resolving customer complaints."],
    errorSegments: ["In this role,", "the supervisor", "handles three regular duties:", "planning weekly schedules, to review team performance, and resolving customer complaints."],
    errorIndex: 3, correction: "planning weekly schedules, reviewing team performance, and resolving customer complaints.", reason: "All three duties should be expressed as parallel gerund phrases.",
  },
  "CON-H03": {
    id: "CON-H03", difficulty: "hard", ruleId: "GR-CON-002", domain: "governance",
    correctSegments: ["Without changing the funding formula,", "the reform", "strengthened accountability", "both through local oversight and through central reporting standards."],
    errorSegments: ["Without changing the funding formula,", "the reform", "strengthened accountability", "both through local oversight as well as through central reporting standards."],
    errorIndex: 3, correction: "both through local oversight and through central reporting standards.", reason: "The formal correlative construction is 'both ... and'; do not mix 'both' with 'as well as'.",
  },
  "CON-H05": {
    id: "CON-H05", difficulty: "hard", ruleId: "GR-CON-003", domain: "law",
    correctSegments: ["Within the prescribed period,", "a candidate", "may satisfy the requirement", "either by completing the course or by passing the qualifying examination."],
    errorSegments: ["Within the prescribed period,", "a candidate", "may satisfy the requirement", "either by completing the course nor by passing the qualifying examination."],
    errorIndex: 3, correction: "either by completing the course or by passing the qualifying examination.", reason: "The construction presents two alternatives, so 'either' must be paired with 'or'.",
  },
  "CON-H09": {
    id: "CON-H09", difficulty: "hard", ruleId: "GR-CON-005", domain: "public-policy",
    correctSegments: ["For applicants in remote areas,", "the revised programme", "produced two improvements", "not only by expanding access to training but also by reducing waiting times."],
    errorSegments: ["For applicants in remote areas,", "the revised programme", "produced two improvements", "not only by expanding access to training and also by reducing waiting times."],
    errorIndex: 3, correction: "not only by expanding access to training but also by reducing waiting times.", reason: "Use the complete pair 'not only ... but also'.",
  },
  "CON-H13": {
    id: "CON-H13", difficulty: "hard", ruleId: "GR-CON-007", domain: "infrastructure",
    correctSegments: ["During the monsoon period,", "construction", "slowed repeatedly", "because material deliveries were often interrupted."],
    errorSegments: ["During the monsoon period,", "construction", "slowed repeatedly", "because of material deliveries were often interrupted."],
    errorIndex: 3, correction: "because material deliveries were often interrupted.", reason: "A full clause follows, so use 'because' before 'material deliveries were often interrupted'.",
  },
};

export const CP007_SCENES_V2: readonly ConjunctionSceneV1[] = CP007_SCENES_V1.map((scene) => replacements[scene.id] ?? scene);

export const CP007_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly ConjunctionSceneV1[]>> = {
  easy: CP007_SCENES_V2.filter((scene) => scene.difficulty === "easy"),
  medium: CP007_SCENES_V2.filter((scene) => scene.difficulty === "medium"),
  hard: CP007_SCENES_V2.filter((scene) => scene.difficulty === "hard"),
};
