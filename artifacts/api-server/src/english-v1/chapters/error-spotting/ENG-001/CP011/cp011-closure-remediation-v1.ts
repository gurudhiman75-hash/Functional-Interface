import { conditionalScene, type ConditionalSceneV1 } from "./cp011-scene-types";

const replacements: Readonly<Record<string, ConditionalSceneV1>> = {
  "CND-E15": conditionalScene({
    id: "CND-E15", difficulty: "easy", ruleId: "GR-CND-008", domain: "library-card", errorIndex: 2,
    correctSegments: ["The library rule allows borrowing only after a valid card is shown,", "so you cannot borrow these books", "unless you show", "your membership card."],
    errorSegments: ["The library rule allows borrowing only after a valid card is shown,", "so you cannot borrow these books", "unless you do not show", "your membership card."],
    reason: "The first clause makes the intended requirement explicit: a card must be shown. Since 'unless' already means 'if not', adding 'do not' reverses that stated rule; the clause must be 'unless you show'.",
  }),
  "CND-E16": conditionalScene({
    id: "CND-E16", difficulty: "easy", ruleId: "GR-CND-008", domain: "fee-payment", errorIndex: 3,
    correctSegments: ["The published rule says the fee must be paid for acceptance,", "and the application will not be accepted", "after Friday", "unless the fee is paid."],
    errorSegments: ["The published rule says the fee must be paid for acceptance,", "and the application will not be accepted", "after Friday", "unless the fee is not paid."],
    reason: "The stated rule requires payment. 'Unless' supplies the negative condition by itself, so the following clause stays positive: 'unless the fee is paid'.",
  }),
  "CND-E19": conditionalScene({
    id: "CND-E19", difficulty: "easy", ruleId: "GR-CND-008", domain: "printer-paper", errorIndex: 2,
    correctSegments: ["The printer can continue only while paper is available,", "so it will stop during the job", "unless you refill", "the paper tray."],
    errorSegments: ["The printer can continue only while paper is available,", "so it will stop during the job", "unless you do not refill", "the paper tray."],
    reason: "The opening rule establishes that more paper is needed. 'Unless' already means 'if you do not', so the intended warning is 'unless you refill', not 'unless you do not refill'.",
  }),
  "CND-E20": conditionalScene({
    id: "CND-E20", difficulty: "easy", ruleId: "GR-CND-008", domain: "course-certificate", errorIndex: 3,
    correctSegments: ["The course rules award the final certificate only after every module is completed,", "so you will not receive", "the certificate", "unless you complete every module."],
    errorSegments: ["The course rules award the final certificate only after every module is completed,", "so you will not receive", "the certificate", "unless you do not complete every module."],
    reason: "The stated requirement is completion of every module. With 'unless', the clause remains positive: 'unless you complete every module'.",
  }),
  "CND-M15": conditionalScene({
    id: "CND-M15", difficulty: "medium", ruleId: "GR-CND-008", domain: "entry-pass", errorIndex: 2,
    correctSegments: ["Security instructions permit entry only to visitors carrying a valid pass,", "so visitors will not be admitted to the research wing", "unless they carry", "a valid entry pass."],
    errorSegments: ["Security instructions permit entry only to visitors carrying a valid pass,", "so visitors will not be admitted to the research wing", "unless they do not carry", "a valid entry pass."],
    reason: "The access requirement is explicitly stated in the opening clause. Because 'unless' means 'if not', a second negative would reverse the rule; use 'unless they carry'.",
  }),
  "CND-M16": conditionalScene({
    id: "CND-M16", difficulty: "medium", ruleId: "GR-CND-008", domain: "backup-policy", errorIndex: 3,
    correctSegments: ["The recovery policy protects current files only when a recent backup is kept,", "so the files may be lost", "during a system failure", "unless a current backup is kept."],
    errorSegments: ["The recovery policy protects current files only when a recent backup is kept,", "so the files may be lost", "during a system failure", "unless a current backup is not kept."],
    reason: "The policy explicitly requires a backup. 'Unless' already expresses the negative condition, so the following clause must be positive: 'unless a current backup is kept'.",
  }),
  "CND-H15": conditionalScene({
    id: "CND-H15", difficulty: "hard", ruleId: "GR-CND-008", domain: "data-disclosure", errorIndex: 2,
    correctSegments: ["The disclosure protocol states that outside access requires approved ethics clearance,", "so the agency cannot release the dataset to an external researcher", "unless the applicant obtains", "the required clearance before access is granted."],
    errorSegments: ["The disclosure protocol states that outside access requires approved ethics clearance,", "so the agency cannot release the dataset to an external researcher", "unless the applicant does not obtain", "the required clearance before access is granted."],
    reason: "The first clause fixes the intended condition: clearance is required. Since 'unless' already means 'if not', adding 'does not' would reverse that requirement; use 'unless the applicant obtains'.",
  }),
  "CND-H16": conditionalScene({
    id: "CND-H16", difficulty: "hard", ruleId: "GR-CND-008", domain: "contract-renewal", errorIndex: 3,
    correctSegments: ["The renewal clause states that the agreement continues only after both parties confirm renewal in writing,", "so it will lapse automatically", "at the end of the current term", "unless both parties renew it in writing."],
    errorSegments: ["The renewal clause states that the agreement continues only after both parties confirm renewal in writing,", "so it will lapse automatically", "at the end of the current term", "unless both parties do not renew it in writing."],
    reason: "The contract itself establishes renewal as the condition for continuation. 'Unless' supplies the negative meaning, so the clause must be 'unless both parties renew it in writing'.",
  }),
};

export function remediateCp011SceneForClosureV1(scene: ConditionalSceneV1): ConditionalSceneV1 {
  return replacements[scene.id] ?? scene;
}
