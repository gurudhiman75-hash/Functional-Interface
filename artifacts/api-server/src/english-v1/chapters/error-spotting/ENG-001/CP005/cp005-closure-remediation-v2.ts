import type { PrepositionSceneV1 } from "./cp005-catalog-v1";
import { remediateCp005SceneForClosureV1 } from "./cp005-closure-remediation-v1";

const balancedHard: Readonly<Record<string, PrepositionSceneV1>> = {
  "PRP-H02": {
    id: "PRP-H02", domain: "astronomy", ruleId: "GR-PRP-001", difficulty: "hard",
    correctSegments: ["On Tuesday, the observation window will open at 3:30 a.m.", "if the sky remains clear", "according to the", "revised schedule."],
    errorSegments: ["On Tuesday, the observation window will open on 3:30 a.m.", "if the sky remains clear", "according to the", "revised schedule."],
    errorIndex: 0, correction: "On Tuesday, the observation window will open at 3:30 a.m.",
    reason: "'On' is correct with the day 'Tuesday', but an exact clock time takes 'at'.",
  },
  "PRP-H03": {
    id: "PRP-H03", domain: "infrastructure", ruleId: "GR-PRP-002", difficulty: "hard",
    correctSegments: ["Although the spare barriers are stored in the depot,", "a warning sign", "has been fixed on the outer gate", "so that approaching drivers can see it from a distance."],
    errorSegments: ["Although the spare barriers are stored in the depot,", "a warning sign", "has been fixed in the outer gate", "so that approaching drivers can see it from a distance."],
    errorIndex: 2, correction: "has been fixed on the outer gate",
    reason: "'In' correctly marks storage inside the depot, but a sign attached to the surface of the gate is 'on' the gate.",
  },
  "PRP-H04": {
    id: "PRP-H04", domain: "records", ruleId: "GR-PRP-002", difficulty: "hard",
    correctSegments: ["A notice is pasted on the cabinet door,", "while the registrar keeps the key,", "and the original certificates are", "kept in the locked cabinet during office hours."],
    errorSegments: ["A notice is pasted on the cabinet door,", "while the registrar keeps the key,", "and the original certificates are", "kept on the locked cabinet during office hours."],
    errorIndex: 3, correction: "kept in the locked cabinet during office hours.",
    reason: "The notice is correctly 'on' a surface, whereas documents stored inside an enclosed cabinet are kept 'in' it.",
  },
  "PRP-H06": {
    id: "PRP-H06", domain: "utilities", ruleId: "GR-PRP-003", difficulty: "hard",
    correctSegments: ["Since the repair began shortly after dawn, the crew has been working for more than six hours", "because the damaged line", "supplies power to several", "public buildings."],
    errorSegments: ["Since the repair began shortly after dawn, the crew has been working since more than six hours", "because the damaged line", "supplies power to several", "public buildings."],
    errorIndex: 0, correction: "Since the repair began shortly after dawn, the crew has been working for more than six hours",
    reason: "'Since' correctly introduces the starting event; a length of time such as 'more than six hours' takes 'for'.",
  },
  "PRP-H07": {
    id: "PRP-H07", domain: "procurement", ruleId: "GR-PRP-004", difficulty: "hard",
    correctSegments: ["Although the receiving office will remain open until 5 p.m.,", "the selected supplier must deliver", "all listed equipment by 5 p.m.", "if installation is to begin the following morning."],
    errorSegments: ["Although the receiving office will remain open until 5 p.m.,", "the selected supplier must deliver", "all listed equipment until 5 p.m.", "if installation is to begin the following morning."],
    errorIndex: 2, correction: "all listed equipment by 5 p.m.",
    reason: "'Until' correctly describes how long the office remains open; a completion deadline for delivery requires 'by'.",
  },
  "PRP-H08": {
    id: "PRP-H08", domain: "healthcare", ruleId: "GR-PRP-004", difficulty: "hard",
    correctSegments: ["The replacement team is expected by midnight,", "but the emergency counter", "will remain staffed", "until the team arrives so that patients are not left without assistance."],
    errorSegments: ["The replacement team is expected by midnight,", "but the emergency counter", "will remain staffed", "by the team arrives so that patients are not left without assistance."],
    errorIndex: 3, correction: "until the team arrives so that patients are not left without assistance.",
    reason: "'By midnight' correctly marks a deadline, while a continuing state up to an event is expressed with 'until the team arrives'.",
  },
  "PRP-H10": {
    id: "PRP-H10", domain: "relief", ruleId: "GR-PRP-005", difficulty: "hard",
    correctSegments: ["After the two relief agencies finalised their arrangement, blankets were shared among the families waiting outside", "because the night", "temperature had", "fallen sharply."],
    errorSegments: ["After the two relief agencies finalised their arrangement, blankets were shared between the families waiting outside", "because the night", "temperature had", "fallen sharply."],
    errorIndex: 0, correction: "After the two relief agencies finalised their arrangement, blankets were shared among the families waiting outside",
    reason: "The arrangement is between two named agencies, whereas distribution within a group of families is expressed with 'among'.",
  },
  "PRP-H11": {
    id: "PRP-H11", domain: "emergency-service", ruleId: "GR-PRP-006", difficulty: "hard",
    correctSegments: ["While staff remained in the control room,", "fresh air from outside", "was drawn into the building", "through an open service door during the evacuation."],
    errorSegments: ["While staff remained in the control room,", "fresh air from outside", "was drawn in the building", "through an open service door during the evacuation."],
    errorIndex: 2, correction: "was drawn into the building",
    reason: "'In' correctly describes the staff's position; movement from outside to the interior of the building requires 'into'.",
  },
  "PRP-H12": {
    id: "PRP-H12", domain: "laboratory", ruleId: "GR-PRP-006", difficulty: "hard",
    correctSegments: ["After the probe was lowered into the solution,", "while temperature readings are taken,", "the probe then remains", "in the liquid throughout the trial."],
    errorSegments: ["After the probe was lowered into the solution,", "while temperature readings are taken,", "the probe then remains", "into the liquid throughout the trial."],
    errorIndex: 3, correction: "in the liquid throughout the trial.",
    reason: "'Into' correctly marks the earlier movement; after 'remains', the sentence describes position and therefore needs 'in'.",
  },
  "PRP-H14": {
    id: "PRP-H14", domain: "training", ruleId: "GR-PRP-008", difficulty: "hard",
    correctSegments: ["Although responsible for screening difficult applications, the newly appointed officer is already familiar with the procedure", "used for cases", "that require", "manual review."],
    errorSegments: ["Although responsible for screening difficult applications, the newly appointed officer is already familiar to the procedure", "used for cases", "that require", "manual review."],
    errorIndex: 0, correction: "Although responsible for screening difficult applications, the newly appointed officer is already familiar with the procedure",
    reason: "'Responsible for' is correct before the activity 'screening'; the adjective 'familiar' takes 'with'.",
  },
  "PRP-H15": {
    id: "PRP-H15", domain: "policy", ruleId: "GR-PRP-009", difficulty: "hard",
    correctSegments: ["Although the written guidelines call for a record of every exception,", "the review committee also", "insists on recording the reason for each departure", "so that later decisions can be checked against the same standard."],
    errorSegments: ["Although the written guidelines call for a record of every exception,", "the review committee also", "insists for recording the reason for each departure", "so that later decisions can be checked against the same standard."],
    errorIndex: 2, correction: "insists on recording the reason for each departure",
    reason: "'Call for' is correctly used in the opening clause, while the verb 'insist' takes 'on' before the required action.",
  },
  "PRP-H16": {
    id: "PRP-H16", domain: "safety", ruleId: "GR-PRP-009", difficulty: "hard",
    correctSegments: ["While authorised contractors are allowed to enter through the service gate,", "the temporary barrier", "is designed", "to prevent visitors from entering the restricted area until repair work is complete."],
    errorSegments: ["While authorised contractors are allowed to enter through the service gate,", "the temporary barrier", "is designed", "to prevent visitors to enter the restricted area until repair work is complete."],
    errorIndex: 3, correction: "to prevent visitors from entering the restricted area until repair work is complete.",
    reason: "'Allow' correctly takes object + to-infinitive, but the standard pattern is 'prevent someone from doing something'.",
  },
  "PRP-H18": {
    id: "PRP-H18", domain: "economics", ruleId: "GR-PRP-010", difficulty: "hard",
    correctSegments: ["The sudden increase in fuel costs was one reason for the revision", "of the transport allowance", "during the financial year", "despite stable wage rates."],
    errorSegments: ["The sudden increase in fuel costs was one reason of the revision", "of the transport allowance", "during the financial year", "despite stable wage rates."],
    errorIndex: 0, correction: "The sudden increase in fuel costs was one reason for the revision",
    reason: "'Increase in' and 'revision of' are correct noun complements here; the standard expression is 'reason for'.",
  },
  "PRP-H19": {
    id: "PRP-H19", domain: "planning", ruleId: "GR-PRP-010", difficulty: "hard",
    correctSegments: ["After identifying the reason for the shortage,", "the committee proposed", "a practical solution to the problem", "without reducing the number of services available to the public."],
    errorSegments: ["After identifying the reason for the shortage,", "the committee proposed", "a practical solution of the problem", "without reducing the number of services available to the public."],
    errorIndex: 2, correction: "a practical solution to the problem",
    reason: "'Reason for' is correct in the opening phrase; the standard noun complement is 'solution to a problem'.",
  },
  "PRP-H20": {
    id: "PRP-H20", domain: "labour", ruleId: "GR-PRP-010", difficulty: "hard",
    correctSegments: ["Because demand for trained technicians has grown sharply,", "several units", "have reported during the expansion phase", "a recent rise in vacancies."],
    errorSegments: ["Because demand for trained technicians has grown sharply,", "several units", "have reported during the expansion phase", "a recent rise on vacancies."],
    errorIndex: 3, correction: "a recent rise in vacancies.",
    reason: "'Demand for' is correct in the first clause; when naming what has risen, the noun 'rise' takes 'in'.",
  },
};

export function remediateCp005SceneForClosureV2(scene: PrepositionSceneV1): PrepositionSceneV1 {
  const strengthened = remediateCp005SceneForClosureV1(scene);
  return balancedHard[strengthened.id] ?? strengthened;
}
