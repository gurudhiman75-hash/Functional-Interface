import { idiomaticUsageScene, type IdiomaticUsageSceneV1 } from "./cp013-scene-types";

const replacements: Readonly<Record<string, IdiomaticUsageSceneV1>> = {
  "USG-H-007": idiomaticUsageScene({
    id: "USG-H-007", difficulty: "hard", ruleId: "GR-USG-004", domain: "diagnostic-system", errorIndex: 2,
    correctSegments: ["Although the older unit is able to detect large pressure changes,", "the upgraded diagnostic system has proved more sensitive", "and is capable of identifying very small variations", "before they affect the final reading."],
    errorSegments: ["Although the older unit is able to detect large pressure changes,", "the upgraded diagnostic system has proved more sensitive", "and is capable to identify very small variations", "before they affect the final reading."],
    reason: "'Able to detect' is correct with 'able'. The adjective 'capable' follows a different pattern: 'capable of + -ing', so 'capable of identifying' is required.",
  }),
  "USG-H-008": idiomaticUsageScene({
    id: "USG-H-008", difficulty: "hard", ruleId: "GR-USG-004", domain: "legal-analysis", errorIndex: 3,
    correctSegments: ["The junior analyst was able to trace the disputed reference without assistance,", "and after reviewing the complete case file", "the panel concluded that she was fully capable", "of identifying the conflict between the two clauses."],
    errorSegments: ["The junior analyst was able to trace the disputed reference without assistance,", "and after reviewing the complete case file", "the panel concluded that she was fully capable", "to identify the conflict between the two clauses."],
    reason: "The nearby phrase 'able to trace' is correct, but 'capable' takes 'of + -ing': 'capable of identifying'.",
  }),
  "USG-H-009": idiomaticUsageScene({
    id: "USG-H-009", difficulty: "hard", ruleId: "GR-USG-005", domain: "audit-reconciliation", errorIndex: 0,
    correctSegments: ["Although the branch asked for extra time, the external auditors insisted on reconciling every unmatched transaction", "before signing the report", "because the temporary difference", "still appeared in the ledger."],
    errorSegments: ["Although the branch asked for extra time, the external auditors insisted for reconciling every unmatched transaction", "before signing the report", "because the temporary difference", "still appeared in the ledger."],
    reason: "'Ask for' is correct in the opening contrast, but the verb 'insist' takes 'on' before an activity: 'insisted on reconciling'.",
  }),
  "USG-H-010": idiomaticUsageScene({
    id: "USG-H-010", difficulty: "hard", ruleId: "GR-USG-005", domain: "quality-certificate", errorIndex: 1,
    correctSegments: ["After the supplier applied for a fresh laboratory test,", "the procurement unit insisted on an independent quality certificate", "before accepting the replacement batch", "from a separate testing agency."],
    errorSegments: ["After the supplier applied for a fresh laboratory test,", "the procurement unit insisted for an independent quality certificate", "before accepting the replacement batch", "from a separate testing agency."],
    reason: "'Apply for' is correct with the noun phrase in the opening clause. With 'insist', the standard complement is 'on': 'insisted on an independent quality certificate'.",
  }),
  "USG-H-011": idiomaticUsageScene({
    id: "USG-H-011", difficulty: "hard", ruleId: "GR-USG-006", domain: "permissions-control", errorIndex: 2,
    correctSegments: ["The revised permissions policy allows approved supervisors to amend current records,", "but it adds a second approval step", "to prevent unauthorized users from altering archived records", "without a traceable request."],
    errorSegments: ["The revised permissions policy allows approved supervisors to amend current records,", "but it adds a second approval step", "to prevent unauthorized users to alter archived records", "without a traceable request."],
    reason: "'Allow + object + to-infinitive' is correct in the first clause. 'Prevent' uses a different pattern: 'prevent + object + from + -ing'.",
  }),
  "USG-H-012": idiomaticUsageScene({
    id: "USG-H-012", difficulty: "hard", ruleId: "GR-USG-006", domain: "sample-contamination", errorIndex: 3,
    correctSegments: ["The transport box allows technicians to inspect the labels without opening the inner seal,", "while each sample container is sealed twice", "to prevent airborne particles", "from contaminating the stored material."],
    errorSegments: ["The transport box allows technicians to inspect the labels without opening the inner seal,", "while each sample container is sealed twice", "to prevent airborne particles", "to contaminate the stored material."],
    reason: "The opening clause correctly uses 'allow + object + to-infinitive'. The prevention pattern is 'prevent + object + from + -ing'.",
  }),
  "USG-H-013": idiomaticUsageScene({
    id: "USG-H-013", difficulty: "hard", ruleId: "GR-USG-007", domain: "budget-release", errorIndex: 0,
    correctSegments: ["In spite of repeated requests, the finance division released the grant despite continued pressure for another delay", "after completing the verification", "of every supporting document", "from the participating units."],
    errorSegments: ["In spite of repeated requests, the finance division released the grant despite of continued pressure for another delay", "after completing the verification", "of every supporting document", "from the participating units."],
    reason: "'In spite of' correctly includes 'of'. By contrast, 'despite' takes its noun phrase directly, so 'despite continued pressure' is required.",
  }),
  "USG-H-014": idiomaticUsageScene({
    id: "USG-H-014", difficulty: "hard", ruleId: "GR-USG-007", domain: "field-survey", errorIndex: 1,
    correctSegments: ["Despite several incomplete household responses,", "the field survey remained usable in spite of the missing entries", "because the unanswered items", "were too few to affect the overall result."],
    errorSegments: ["Despite several incomplete household responses,", "the field survey remained usable in spite the missing entries", "because the unanswered items", "were too few to affect the overall result."],
    reason: "'Despite' correctly takes a noun phrase directly, but the fixed expression with 'spite' is 'in spite of'.",
  }),
};

export function remediateCp013SceneForClosureV1(scene: IdiomaticUsageSceneV1): IdiomaticUsageSceneV1 {
  return replacements[scene.id] ?? scene;
}
