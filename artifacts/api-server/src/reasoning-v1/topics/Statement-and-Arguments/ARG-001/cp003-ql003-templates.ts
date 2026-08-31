import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL003_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL003-T01", qlId: "ARG-QL-003", archetype: "QUEUE_CAPACITY_IMPLEMENTATION", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["district certificate offices", "passport service centres", "municipal tax offices", "public hospital registration desks"],
      ["online appointments", "time-slot booking", "scheduled visit slots", "advance queue reservations"],
      ["long walk-in queues", "heavy morning crowding", "unpredictable arrival peaks", "crowding around service counters"],
      ["services with predictable handling time", "routine document services", "repeatable counter services", "standard registration services"],
    ],
    statement: "Should {a} introduce {b} for {d} where there are {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} can spread arrivals across the day and reduce {c} for {d} at {a}.", explanation: "The argument gives a practical queue-management mechanism tied to the service." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "No. {b} at {a} would require every citizen using {d} to own an expensive desktop computer, so it cannot work where there are {c}.", explanation: "The argument assumes an unnecessary implementation requirement; appointment access need not depend on owning a desktop computer." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T02", qlId: "ARG-QL-003", archetype: "DIGITAL_ONLY_ACCESS_FEASIBILITY", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      ["cash withdrawal support", "cash deposit service", "passbook assistance", "in-person account support"],
      ["a rural branch", "a semi-urban branch", "a remote service point", "a small-town branch"],
      ["unreliable mobile connectivity", "limited smartphone access", "low digital literacy among some users", "intermittent internet service"],
      ["digital-only channels", "app-only service", "self-service digital terminals", "online-only banking"],
    ],
    statement: "Should {b} discontinue {a} and provide only {d}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "Yes. Once {d} is introduced, it requires no staff, connectivity or user support, so {a} at {b} becomes unnecessary even with {c}.", explanation: "The argument assumes away real infrastructure and support needs." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. With {c}, removing {a} from {b} may leave some customers without practical access to essential banking services despite the availability of {d}.", explanation: "The argument identifies a concrete implementation and access constraint." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T03", qlId: "ARG-QL-003", archetype: "TRAFFIC_DIVERSION_IMPLEMENTATION", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["a central market street", "a heritage shopping lane", "a station-front road", "a busy bazaar corridor"],
      ["peak shopping hours", "the evening rush", "weekend market hours", "the busiest two hours"],
      ["pedestrian-only access", "a vehicle restriction", "a no-through-traffic rule", "restricted motor access"],
      ["nearby narrow streets", "delivery access routes", "adjoining residential lanes", "parallel traffic corridors"],
    ],
    statement: "Should {a} use {c} during {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {c} during {b} can reduce conflict between dense pedestrian movement and vehicles on {a}.", explanation: "The argument identifies a direct operational safety and congestion benefit." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. Traffic and deliveries may shift to {d}, so diversion capacity and access arrangements must be workable before {c} is imposed on {a} during {b}.", explanation: "The argument raises a credible implementation consequence rather than a remote objection." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T04", qlId: "ARG-QL-003", archetype: "RAPID_INFRASTRUCTURE_TRANSITION", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["recruitment examinations", "licensing examinations", "university entrance tests", "departmental promotion tests"],
      ["computer-based testing", "remote-proctored testing", "tablet-based testing", "digital examination centres"],
      ["from next month", "within two weeks", "for the next examination cycle", "with immediate effect"],
      ["secure devices and centres", "trained invigilators", "stable connectivity", "candidate support and fallback arrangements"],
    ],
    statement: "Should every {a} move entirely to {b} {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "Yes. Once the decision is announced, enough {d} for {b} will automatically become available everywhere {c}.", explanation: "Announcement does not create the required infrastructure or capacity." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "ABSOLUTE_CLAIM", text: "No. {b} can never be conducted securely under any circumstances, regardless of {d}.", explanation: "The absolute rejection is unsupported and ignores conditions under which digital testing can be secure." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T05", qlId: "ARG-QL-003", archetype: "TOKEN_SYSTEM_OPERATIONAL_FEASIBILITY", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["outpatient registration", "diagnostic billing", "pharmacy collection", "non-emergency consultation queues"],
      ["district hospitals", "large community health centres", "public diagnostic centres", "high-volume clinics"],
      ["token displays", "numbered queue screens", "digital turn displays", "electronic queue boards"],
      ["crowding around counters", "uncertainty about turn order", "repeated queue enquiries", "standing in dense lines"],
    ],
    statement: "Should {b} use {c} for {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {c} can organise turn-taking for {a} and reduce {d} at {b}.", explanation: "The argument identifies a realistic operational benefit of queue displays." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "No. Installing {c} for {a} would require rebuilding every part of {b} from the ground up just to address {d}.", explanation: "The claimed implementation burden is fanciful and not inherent in installing a queue display." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T06", qlId: "ARG-QL-003", archetype: "WASTE_SEGREGATION_TRANSITION_READINESS", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      ["large apartment complexes", "commercial markets", "institutional campuses", "large office parks"],
      ["wet and dry waste", "recyclable and residual waste", "organic and non-organic waste", "food waste and other waste"],
      ["from next week", "with seven days' notice", "from the first day of next month", "immediately after notification"],
      ["separate bins and collection routes", "resident or user communication", "segregated collection vehicles", "staff training and collection capacity"],
    ],
    statement: "Should the municipality require {a} to separate {b} {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "Yes. The rule for {a} can start {c} without any {d}; separation of {b} will work automatically.", explanation: "The argument assumes away the transition resources needed to implement the rule." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. Starting {c} without {d} can cause separated {b} to be mixed again, undermining compliance and trust among {a}.", explanation: "The argument identifies a concrete implementation dependency." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T07", qlId: "ARG-QL-003", archetype: "BIOMETRIC_FALLBACK_CAPACITY", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["fingerprint verification", "facial verification", "iris verification", "multi-factor biometric verification"],
      ["high-stakes recruitment tests", "professional licensing tests", "large entrance examinations", "departmental examinations"],
      ["impersonation", "identity substitution", "proxy attendance", "candidate identity fraud"],
      ["device failure", "poor connectivity", "failed biometric matching", "entry-time congestion"],
    ],
    statement: "Should centres use {a} for attendance in {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Where the system is reliable, {a} adds an identity-verification layer against {c} in {b}.", explanation: "The argument identifies a direct anti-impersonation mechanism." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. {d} can delay genuine candidates, so {a} in {b} requires fallback verification and adequate entry capacity.", explanation: "The argument raises a realistic operational risk and a necessary implementation safeguard." },
    ],
  },
  {
    id: "ARG-CP003-QL003-T08", qlId: "ARG-QL-003", archetype: "AUTOMATION_REPLACEMENT_FEASIBILITY", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["self-service kiosks", "automated service terminals", "AI chat terminals", "touch-screen banking kiosks"],
      ["cash-service guidance", "account-service queries", "document correction requests", "exception handling"],
      ["in one day", "with immediate effect", "within one week", "without a transition period"],
      ["maintenance", "staff assistance", "fallback handling", "support for exceptional cases"],
    ],
    statement: "Should every branch replace all human help for {b} with {a} {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "IMPRACTICAL_PREMISE", text: "Yes. {a} can handle every form of {b} without {d}, so full replacement {c} has no implementation risk.", explanation: "The argument assumes away predictable maintenance, exception and support needs." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "ABSOLUTE_CLAIM", text: "No. A branch using {a} for {b} can never provide any useful service, even when {d} is available.", explanation: "The absolute claim is unsupported; automation can provide some useful services even if full replacement is impractical." },
    ],
  },
];
