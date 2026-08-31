import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL004_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL004-T01", qlId: "ARG-QL-004", archetype: "TARGETED_REMEDIAL_SUPPORT", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["mathematics", "language skills", "basic accounting", "computer fundamentals"],
      ["optional remedial classes", "small-group support sessions", "extra guided practice", "targeted tutorial sessions"],
      ["students with identified learning gaps", "students falling behind in assessment", "learners needing additional practice", "students referred after diagnostic testing"],
      ["twice a week", "after regular classes", "during a six-week support cycle", "at scheduled support periods"],
    ],
    statement: "Should schools provide {b} in {a} {d} for {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} in {a} {d} can give {c} focused practice without changing the regular class pace for everyone.", explanation: "The argument is proportionate and targeted to students with an identified need." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "No. Every student in {c} who attends {b} {d} will become permanently dependent on extra help in {a}.", explanation: "The argument turns a possible concern into an unsupported universal outcome." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T02", qlId: "ARG-QL-004", archetype: "PARTIAL_INTERVENTION_OVERCLAIM", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      ["large public events", "sports venues", "festival grounds", "large institutional campuses"],
      ["waste-segregation bins", "clearly labelled recycling stations", "separate wet-and-dry bins", "material-specific waste points"],
      ["mixed waste at source", "initial sorting of waste", "separation before collection", "visitor disposal behaviour"],
      ["organised collection", "separate downstream handling", "trained sanitation staff", "matching collection routes"],
    ],
    statement: "Should {a} be required to provide {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "Yes. {b} alone will solve the entire city's waste-management problem by fixing {c} even without {d}.", explanation: "One intervention cannot reasonably be treated as a complete solution to the whole system." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. At {a}, {b} can improve {c} when it is supported by {d}.", explanation: "The argument makes a limited, conditional claim and identifies the supporting implementation condition." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T03", qlId: "ARG-QL-004", archetype: "BOUNDED_FLEXIBILITY_POLICY", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["flexible starting times", "compressed arrival windows", "staggered reporting times", "limited flexible departure times"],
      ["desk-based teams", "hybrid administrative teams", "project-based office teams", "back-office processing teams"],
      ["a ninety-minute window", "a one-hour window", "two defined start bands", "a limited daily range"],
      ["real-time handovers", "common service hours", "shared equipment use", "scheduled client coverage"],
    ],
    statement: "Should {b} be allowed {a} within {c} where the role permits it?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {a} within {c} can reduce commuting constraints for {b} while preserving required working hours.", explanation: "The argument supports a bounded policy rather than unrestricted flexibility." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. Teams depending on {d} may need tighter overlap rules, so {a} within {c} cannot be applied identically across all {b}.", explanation: "The argument raises a material coordination limitation without claiming the policy is always unworkable." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T04", qlId: "ARG-QL-004", archetype: "ONE_INTERVENTION_TOTAL_SOLUTION", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["basic digital-literacy workshops", "one cyber-safety session", "a short financial-literacy workshop", "a one-day career-guidance session"],
      ["public libraries", "community centres", "colleges", "district training centres"],
      ["digital problems", "online fraud risks", "financial mistakes", "career-planning difficulties"],
      ["a single session", "one workshop", "one short course", "one introductory event"],
    ],
    statement: "Should {b} offer {a} as {d}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "ABSOLUTE_CLAIM", text: "Yes. Anyone attending {d} on {a} will never face {c} again.", explanation: "A single educational intervention cannot guarantee elimination of every future problem." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "SPECULATIVE_SLIPPERY_SLOPE", text: "No. If {b} offer {a}, existing services will eventually become completely unnecessary because {c} will vanish.", explanation: "The argument predicts an extreme chain of consequences without a credible mechanism." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T05", qlId: "ARG-QL-004", archetype: "TIME_LIMITED_RESTRICTION", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["heavy goods vehicles", "large delivery trucks", "tour buses", "construction vehicles"],
      ["a narrow market street", "a school-zone road", "a station-front corridor", "a dense shopping lane"],
      ["the busiest two evening hours", "school closing time", "the morning pedestrian peak", "weekend market peak hours"],
      ["pedestrian conflict", "roadside crowding", "turning congestion", "blocked crossing movements"],
    ],
    statement: "Should {a} be restricted from {b} during {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. A time-limited restriction on {a} during {c} can reduce {d} on {b} without imposing an all-day ban.", explanation: "The argument is proportionate in time and directly tied to the peak-period problem." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "No. Restricting {a} on {b} during {c} will permanently destroy all activity in the area because of {d}.", explanation: "The argument converts a limited restriction into an unsupported claim of permanent total harm." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T06", qlId: "ARG-QL-004", archetype: "INFORMED_CHOICE_REMINDER", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      ["a free streaming trial", "a software trial", "a premium news trial", "a fitness-app trial"],
      ["a paid monthly subscription", "a paid annual plan", "an automatically renewed plan", "a recurring membership"],
      ["a reminder twenty-four hours before conversion", "a reminder three days before conversion", "a clear pre-renewal alert", "a notice before the first charge"],
      ["an informed continuation choice", "awareness of the upcoming charge", "a chance to cancel before billing", "clear knowledge of the recurring payment"],
    ],
    statement: "Should an online service send {c} before {a} becomes {b}?",
    arguments: [
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "ABSOLUTE_CLAIM", text: "No. If users receive {c}, nobody will ever choose {b}, so {d} cannot be a legitimate objective.", explanation: "The argument assumes a universal reaction and treats informed choice as incompatible with paid continuation." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {c} gives users {d} before {a} changes into {b}.", explanation: "The argument is narrow, directly relevant and supports informed consent to the charge." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T07", qlId: "ARG-QL-004", archetype: "ROLE_BASED_REMOTE_WORK", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["remote work on selected days", "one remote day each week", "hybrid work for part of the week", "limited work-from-home days"],
      ["roles that can be performed securely off-site", "desk-based roles", "document-processing roles", "software and analytical roles"],
      ["commuting burden", "workspace demand", "travel time", "location flexibility"],
      ["physical equipment", "face-to-face service", "secure on-site records", "real-time in-person coordination"],
    ],
    statement: "Should employees in {b} be allowed {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. For {b}, {a} can reduce {c} without assuming that every role can be done remotely.", explanation: "The argument is explicitly limited to suitable roles and identifies a material benefit." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. Roles depending on {d} need narrower eligibility, so {a} cannot be extended beyond the {b} for which it is workable.", explanation: "The argument is a proportionate limitation based on job requirements, not an absolute rejection." },
    ],
  },
  {
    id: "ARG-CP003-QL004-T08", qlId: "ARG-QL-004", archetype: "BLANKET_BAN_FALSE_EXTREMES", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      ["mobile phones", "personal tablets", "smart watches", "personal recording devices"],
      ["school premises", "training centres", "examination campuses", "college classrooms"],
      ["emergency contact", "approved learning activity", "accessibility support", "authorised administrative use"],
      ["distraction during teaching", "unauthorised recording", "cheating risk", "off-task use"],
    ],
    statement: "Should {a} be banned from {b} under all circumstances?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "Yes. Every use of {a} in {b} necessarily causes {d}, so no exception such as {c} can ever be justified.", explanation: "The argument treats every use as harmful and ignores materially different authorised uses." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "FALSE_DILEMMA", text: "No. Because {a} can be useful for {c}, {b} should never regulate it even to address {d}.", explanation: "A useful exception does not imply that no regulation is justified; the argument creates a false all-or-nothing choice." },
    ],
  },
];
