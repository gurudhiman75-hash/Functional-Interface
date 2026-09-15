import { voiceNarrationScene, type VoiceNarrationSceneV1 } from "./cp012-scene-types";

const replacements: Readonly<Record<string, VoiceNarrationSceneV1>> = {
  "VNR-H-001": voiceNarrationScene({
    id: "VNR-H-001", difficulty: "hard", ruleId: "GR-VNR-001", domain: "selection-panel", errorIndex: 0,
    correctSegments: ["After the panel had chosen the shortlist, the three finalists were chosen", "only after their written scores", "had been compared with the interview records", "from all twenty applicants."],
    errorSegments: ["After the panel had chosen the shortlist, the three finalists were chose", "only after their written scores", "had been compared with the interview records", "from all twenty applicants."],
    reason: "'Had chosen' is correct in the active opening clause. In the passive main clause, 'were' must be followed by the past participle 'chosen', not the past form 'chose'.",
  }),
  "VNR-H-002": voiceNarrationScene({
    id: "VNR-H-002", difficulty: "hard", ruleId: "GR-VNR-001", domain: "withdrawn-notices", errorIndex: 1,
    correctSegments: ["After the department withdrew the first draft,", "the notices were withdrawn after a second review", "by the same officials", "before the revised order was issued."],
    errorSegments: ["After the department withdrew the first draft,", "the notices were withdrew after a second review", "by the same officials", "before the revised order was issued."],
    reason: "'Withdrew' is correct as an active past-tense verb in the opening clause, but the passive construction requires 'were withdrawn'.",
  }),
  "VNR-H-023": voiceNarrationScene({
    id: "VNR-H-023", difficulty: "hard", ruleId: "GR-VNR-012", domain: "explain-to-us", errorIndex: 2,
    correctSegments: ["After the supervisor informed us that the inspection was complete,", "the engineer checked the damaged unit", "and explained to us that the sensor had failed", "because of a loose connection."],
    errorSegments: ["After the supervisor informed us that the inspection was complete,", "the engineer checked the damaged unit", "and explained us that the sensor had failed", "because of a loose connection."],
    reason: "'Inform' correctly takes the person directly ('informed us'), but 'explain' requires 'to' before the person: 'explained to us that ...'.",
  }),
  "VNR-H-024": voiceNarrationScene({
    id: "VNR-H-024", difficulty: "hard", ruleId: "GR-VNR-012", domain: "inform-us", errorIndex: 3,
    correctSegments: ["After the coordinator explained to us", "that the timetable had changed,", "she contacted the volunteers and then", "informed us that the session would start later."],
    errorSegments: ["After the coordinator explained to us", "that the timetable had changed,", "she contacted the volunteers and then", "informed to us that the session would start later."],
    reason: "'Explain' correctly uses 'to us', while 'inform' takes the person directly: 'informed us that ...', not 'informed to us'.",
  }),
};

export function remediateCp012SceneForClosureV1(scene: VoiceNarrationSceneV1): VoiceNarrationSceneV1 {
  return replacements[scene.id] ?? scene;
}
