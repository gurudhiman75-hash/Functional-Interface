import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL001_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL001-T01", qlId: "ARG-QL-001", archetype: "SAFETY_MATERIALITY", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["electric scooters", "electric motorcycles", "low-powered electric mopeds", "shared electric two-wheelers"],
      ["public roads", "mixed-traffic urban roads", "busy market roads", "commuter corridors"],
      ["serious head injury in a collision", "head injury after a fall", "impact injury in mixed traffic", "head trauma in a road crash"],
      ["certified helmets", "protective helmets", "standard-compliant helmets", "approved headgear"],
    ],
    statement: "Should {d} be compulsory for riders of {a} on {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Riders of {a} on {b} can suffer {c}, so {d} addresses a material safety risk.", explanation: "The argument directly connects {d} to a serious safety risk faced by riders of {a}." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "No. {a} are often used for short local trips, so riders on {b} do not need {d} against {c}.", explanation: "Trip length does not establish that the risk of {c} disappears, so the reason does not defeat the safety case." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T02", qlId: "ARG-QL-001", archetype: "TRANSPARENCY_MATERIALITY", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      ["a university essay examination", "a descriptive recruitment examination", "a semester written examination", "a state-level written test"],
      ["model answer outlines", "indicative marking points", "sample response frameworks", "evaluation-guidance notes"],
      ["the expected scope of an answer", "the main points rewarded in evaluation", "the level of detail expected", "the structure used in assessment"],
      ["after the final result", "after the objection period", "once evaluation is complete", "after marks are finalised"],
    ],
    statement: "Should the authority publish {b} for {a} {d}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "POPULARITY_OR_AUTHORITY_APPEAL", text: "Yes. Publishing {b} {d} will make the authority look more impressive because websites with more documents appear more active.", explanation: "Appearance or popularity is not a material reason for deciding whether {b} should be published." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} can help candidates understand {c} and make the evaluation basis of {a} more transparent.", explanation: "The argument identifies a direct transparency and evaluation benefit tied to {b}." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T03", qlId: "ARG-QL-001", archetype: "SECURITY_VS_SERVICE_FRICTION", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["online card payments", "mobile-banking transfers", "UPI payments", "internet-banking transfers"],
      ["a suspected account compromise", "an unrecognised transaction alert", "a lost phone", "a phishing incident"],
      ["temporarily disable transactions", "place a temporary payment lock", "pause outgoing digital payments", "activate an emergency transaction freeze"],
      ["the banking app", "the verified mobile portal", "internet banking", "the bank's authenticated self-service channel"],
    ],
    statement: "Should customers be able to {c} for {a} through {d} when they notice {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. After {b}, the ability to {c} through {d} can reduce the risk of further unauthorised {a} while the customer seeks help.", explanation: "The argument raises a direct and material fraud-control benefit." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If {c} is too easy to trigger accidentally in {d}, genuine customers may block urgent {a}, so clear recovery and confirmation controls are necessary.", explanation: "The argument raises a material service-friction risk directly relevant to the design of the control." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T04", qlId: "ARG-QL-001", archetype: "SERVICE_HOURS_OVERCLAIM", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["passport-service counters", "district certificate counters", "municipal payment counters", "public grievance counters"],
      ["twenty minutes", "thirty minutes", "forty-five minutes", "one hour"],
      ["working days", "high-demand weekdays", "the first week of each month", "notified peak-service days"],
      ["late-arriving applicants", "citizens reaching near closing time", "walk-in users", "people needing same-day assistance"],
    ],
    statement: "Should {a} remain open {b} longer on {c} for {d}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "Yes. Keeping {a} open {b} longer on {c} will completely eliminate queues for all {d}.", explanation: "A limited extension does not justify the claim that every queue will disappear." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. {d} are always careless, so their service needs should never affect the timings of {a} on {c}.", explanation: "The argument relies on a stereotype rather than a material assessment of demand, staffing or service access." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T05", qlId: "ARG-QL-001", archetype: "CONSUMER_HARM_MATERIALITY", difficulty: "EASY", answerClass: "ONLY_I",
    dimensions: [
      ["packaged snacks", "ready-to-eat meals", "bakery products", "packaged beverages"],
      ["allergen warnings", "high-risk ingredient warnings", "cross-contamination warnings", "ingredient sensitivity warnings"],
      ["a clearly boxed section", "the front information panel", "a prominent label section", "a high-visibility warning area"],
      ["consumers with serious food allergies", "buyers with known ingredient allergies", "people avoiding a medically relevant ingredient", "consumers vulnerable to severe allergic reactions"],
    ],
    statement: "Should {a} display {b} in {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {d} need visible {b} on {a} to avoid products that may expose them to a serious health risk.", explanation: "The argument identifies a direct and material consumer-safety reason for prominent {b}." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "TRIVIAL_CONSIDERATION", text: "No. Using {c} for {b} leaves slightly less room for decorative design on {a}.", explanation: "Minor loss of decorative space is trivial compared with the stated consumer-safety issue." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T06", qlId: "ARG-QL-001", archetype: "PROCEDURAL_ERROR_CORRECTION", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      ["a recruitment application", "a scholarship application", "an entrance-test application", "a professional-registration form"],
      ["a spelling error in the name field", "an incorrect category selection", "a mistyped graduation year", "an incorrect correspondence address"],
      ["a two-day correction window", "a three-day correction window", "one notified correction opportunity", "a short pre-lock correction period"],
      ["before final data lock", "before admit cards are generated", "before eligibility scrutiny begins", "before the application database is frozen"],
    ],
    statement: "Should applicants be allowed {c} to correct {b} in {a} {d}?",
    arguments: [
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "TRIVIAL_CONSIDERATION", text: "No. Some applicants prefer a form that can never be changed after the first submission, so {c} should not be offered.", explanation: "A preference for irreversible forms is not a material reason against correcting a fixable application error." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {c} {d} can prevent an otherwise eligible applicant from being excluded because of {b} while preserving a final deadline for {a}.", explanation: "The argument directly addresses procedural fairness without removing the final lock." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T07", qlId: "ARG-QL-001", archetype: "SERVICE_EXPECTATION_MATERIALITY", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["a municipal grievance portal", "a university service portal", "a utility complaint portal", "a district citizen-service portal"],
      ["expected response times", "target resolution windows", "expected acknowledgement periods", "service-response benchmarks"],
      ["routine complaints", "document requests", "billing complaints", "service-delivery grievances"],
      ["simple and complex cases", "urgent and routine cases", "cases needing field verification and desk review", "categories with very different investigation needs"],
    ],
    statement: "Should {a} display {b} for {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Publishing {b} for {c} gives users a service expectation and makes prolonged unexplained delays easier to identify.", explanation: "The argument raises a material transparency benefit directly tied to service handling." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If one fixed {b} is shown despite {d}, the portal may create expectations that cannot be met; categories need realistic differentiation.", explanation: "The argument raises a material design problem: {d} can make a single undifferentiated benchmark misleading." },
    ],
  },
  {
    id: "ARG-CP003-QL001-T08", qlId: "ARG-QL-001", archetype: "HELPLINE_RESTATEMENT_OVERCLAIM", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["application acknowledgement receipts", "fee-payment receipts", "service request receipts", "appointment confirmation slips"],
      ["the service helpline number", "the grievance contact number", "the support-desk number", "the official assistance number"],
      ["application status enquiries", "payment queries", "appointment problems", "service-delivery questions"],
      ["routine follow-up", "post-submission assistance", "customer support", "status clarification"],
    ],
    statement: "Should {a} include {b} for {d} about {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "Yes. Printing {b} on {a} guarantees that every {c} raised during {d} will be resolved immediately.", explanation: "Providing a contact number does not guarantee immediate resolution of every query or complaint." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "RESTATES_ISSUE", text: "No. {b} should not be printed on {a} because receipts used for {d} about {c} should not contain that number.", explanation: "The statement simply repeats the proposed rejection without giving a material reason." },
    ],
  },
];
