import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL005_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL005-T01", qlId: "ARG-QL-005", archetype: "DISABILITY_ACCESS_RIGHTS", difficulty: "EASY", answerClass: "ONLY_I",
    dimensions: [
      ["government service portals", "public university portals", "municipal payment portals", "public recruitment portals"],
      ["screen-reader compatibility", "keyboard-only navigation", "high-contrast display support", "accessible form labels"],
      ["users with visual disabilities", "users unable to operate a mouse", "users needing high-contrast interfaces", "users relying on assistive technology"],
      ["submit applications", "pay public fees", "track service requests", "access official information"],
    ],
    statement: "Should {a} be required to provide {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} can reduce avoidable barriers that prevent {c} from using {a} to {d}.", explanation: "The argument raises a legitimate and material accessibility interest in a public service." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. Because {c} are fewer than other users, their ability to {d} through {a} need not be considered when deciding on {b}.", explanation: "The argument dismisses a legitimate affected group merely because it is smaller." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T02", qlId: "ARG-QL-005", archetype: "WORKPLACE_PRIVACY_NOTICE", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      ["continuous screen recording", "keystroke logging", "continuous location tracking", "webcam-based activity monitoring"],
      ["office employees", "remote employees", "field staff", "contract workers"],
      ["what data is collected", "how long data is retained", "who can access the records", "the purpose of collection"],
      ["performance monitoring", "security monitoring", "attendance verification", "work-process analysis"],
    ],
    statement: "Should an employer inform {b} before introducing {a} for {d}?",
    arguments: [
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. Any {b} who ask about {c} before {a} is used for {d} must have something to hide.", explanation: "The argument attacks employees' motives instead of addressing the privacy and governance issue." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {a} affects employee privacy, so {b} should know {c} and how the system will be used for {d}.", explanation: "The argument identifies a direct privacy and informed-notice consideration." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T03", qlId: "ARG-QL-005", archetype: "CONGESTION_VS_DISTRIBUTIONAL_BURDEN", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["parking charges", "road-entry charges", "peak-hour parking fees", "long-stay parking fees"],
      ["a congested commercial centre", "a busy station district", "a crowded market zone", "a high-demand business district"],
      ["long-duration car use", "unnecessary peak-hour car trips", "scarce central parking use", "private-car demand"],
      ["workers with no practical transit alternative", "people with limited mobility", "late-shift workers", "visitors from poorly connected areas"],
    ],
    statement: "Should the city increase {a} in {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Higher {a} can discourage some {c} in {b} where road or parking space is scarce.", explanation: "The argument identifies a plausible congestion-management incentive." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If alternatives are inadequate, higher {a} in {b} can disproportionately burden {d}, so distributional impact matters.", explanation: "The argument raises a legitimate fairness cost to a materially affected group." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T04", qlId: "ARG-QL-005", archetype: "PUBLIC_NAMING_PRIVACY_EXTREMES", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["students submitting assignments late", "employees arriving late", "trainees missing deadlines", "applicants making late corrections"],
      ["a public notice board", "an open website list", "a common display screen", "a publicly searchable page"],
      ["future punctuality", "future rule compliance", "future deadline discipline", "future attendance behaviour"],
      ["names only", "names and dates", "names and departments", "names and delay counts"],
    ],
    statement: "Should an institution publish {d} identifying {a} on {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "Yes. Publishing {d} for {a} on {b} will guarantee perfect {c} from everyone in the future.", explanation: "Public naming does not establish a guaranteed behavioural outcome." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "ABSOLUTE_CLAIM", text: "No. Publishing {d} about {a} on {b} is always unacceptable in every context, regardless of consent, purpose or safeguards.", explanation: "The argument uses an unjustified universal claim instead of evaluating the actual privacy and fairness conditions." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T05", qlId: "ARG-QL-005", archetype: "CANDIDATE_TRANSPARENCY_PRIVACY", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      ["individual marks", "section-wise scores", "normalised scores", "qualifying-stage marks"],
      ["recruitment candidates", "entrance-test candidates", "promotion-test candidates", "scholarship-test candidates"],
      ["after the final result", "after the selection list", "after evaluation is closed", "after the objection process"],
      ["other candidates' private data", "answer-sheet identifiers of others", "personal contact details", "confidential evaluator information"],
    ],
    statement: "Should an examination authority give {b} their own {a} {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Giving {b} their own {a} {c} improves transparency without requiring disclosure of {d}.", explanation: "The argument supports individual transparency while respecting unrelated private information." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. {b} who request {a} {c} are usually unable to accept results, so concern about {d} is irrelevant.", explanation: "The argument attacks candidates' motives rather than assessing transparency or privacy." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T06", qlId: "ARG-QL-005", archetype: "MOBILITY_ACCOMMODATION", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      ["a priority queue", "seated priority waiting", "an assisted-service lane", "scheduled priority slots"],
      ["citizens with severe mobility limitations", "visitors using mobility aids", "people unable to stand for long periods", "users with significant movement impairment"],
      ["public-service offices", "public hospitals", "citizen facilitation centres", "municipal service centres"],
      ["prolonged standing", "long movement between counters", "dense queueing", "repeated movement through the service area"],
    ],
    statement: "Should {c} provide {a} for {b}?",
    arguments: [
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. {b} who ask for {a} at {c} are simply trying to avoid {d} like everyone else.", explanation: "The argument dismisses a documented accessibility burden through a stereotype." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {a} can reduce the disproportionate burden of {d} on {b} while they use {c}.", explanation: "The argument identifies a legitimate accommodation for a materially affected group." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T07", qlId: "ARG-QL-005", archetype: "BIOMETRIC_EFFICIENCY_VS_PRIVACY", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["facial recognition", "fingerprint matching", "iris matching", "biometric identity matching"],
      ["student attendance", "staff attendance", "candidate entry", "visitor access"],
      ["proxy attendance", "identity substitution", "manual attendance errors", "duplicate entry records"],
      ["retention periods", "security controls", "necessity and proportionality", "less intrusive alternatives"],
    ],
    statement: "Should an institution use {a} to record {b} automatically?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. If accurate and well governed, {a} can reduce {c} in the recording of {b}.", explanation: "The argument identifies a plausible operational benefit without claiming the technology is automatically justified." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. {a} collects biometric data for {b}, so {d} must be considered before adoption.", explanation: "The argument raises a material privacy and proportionality consideration." },
    ],
  },
  {
    id: "ARG-CP003-QL005-T08", qlId: "ARG-QL-005", archetype: "HOME_ADDRESS_PRIVACY_STEREOTYPE", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      ["home addresses", "personal mobile numbers", "private email addresses", "family contact details"],
      ["all employees", "all trainees", "all contract staff", "all volunteers"],
      ["an internal directory accessible to everyone", "a common staff portal", "an unrestricted office directory", "a shared organisation-wide list"],
      ["trust among colleagues", "team cooperation", "workplace openness", "informal communication"],
    ],
    statement: "Should an organisation publish the {a} of {b} in {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "Yes. Publishing {a} of {b} in {c} will automatically create {d}.", explanation: "The claimed workplace benefit does not follow from disclosing private contact information." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "PREJUDICIAL_STEREOTYPE", text: "No. Any one of {b} who wants {a} kept out of {c} must be hiding something and therefore cannot contribute to {d}.", explanation: "The argument stereotypes people seeking privacy rather than giving a legitimate reason about the policy." },
    ],
  },
];
