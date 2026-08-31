import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL006_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL006-T01", qlId: "ARG-QL-006", archetype: "LESS_RESTRICTIVE_ALTERNATIVE", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      ["street vendors", "cycle-rickshaw stands", "temporary market stalls", "food carts"],
      ["a busy railway-station approach", "a crowded bus-terminal frontage", "a dense market entrance", "a pedestrian-heavy hospital approach"],
      ["designated operating zones", "marked vending bays", "clear-walkway rules", "time-and-space restrictions"],
      ["pedestrian obstruction", "blocked access routes", "crowding near entrances", "conflict with through movement"],
    ],
    statement: "Should the city completely prohibit {a} around {b} to reduce {d}?",
    arguments: [
      { stance: "OPPOSES", strength: "STRONG", text: "No. {c} may reduce {d} around {b} without completely removing {a} from the area.", explanation: "The argument offers a credible less-restrictive alternative that directly addresses the stated objective." },
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "SPECULATIVE_SLIPPERY_SLOPE", text: "Yes. If any {a} remain near {b}, {d} will keep growing until the entire transport and service system stops functioning.", explanation: "The argument jumps from a manageable local problem to an extreme outcome without a credible mechanism." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T02", qlId: "ARG-QL-006", archetype: "RISK_BASED_ALTERNATIVE", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      ["card transactions outside the home state", "unusual high-value transfers", "first-time overseas card use", "payments from a newly added device"],
      ["automatic blocking", "mandatory pre-authorisation", "a blanket decline rule", "an automatic account hold"],
      ["risk-based verification", "step-up authentication", "a targeted confirmation prompt", "transaction-specific verification"],
      ["legitimate travel or emergency payments", "genuine unusual purchases", "time-sensitive customer payments", "valid transactions outside normal patterns"],
    ],
    statement: "Should a bank apply {b} to every instance of {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "FALSE_DILEMMA", text: "Yes. Every instance of {a} is either fraudulent or should be treated as fraudulent, so only {b} can protect the account.", explanation: "The argument falsely reduces the issue to blanket blocking versus no protection." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. {c} can address risk in {a} while reducing unnecessary disruption to {d} compared with {b}.", explanation: "The argument offers a directly relevant and practical alternative security control." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T03", qlId: "ARG-QL-006", archetype: "INCENTIVE_VS_EVASION_EFFECT", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["bulky household waste", "construction debris from small renovations", "large garden waste", "discarded furniture"],
      ["a separate collection fee", "a volume-based collection charge", "an extra pickup charge", "a special handling fee"],
      ["unusually large loads", "collections beyond the standard allowance", "special pickups", "high-volume disposal requests"],
      ["illegal dumping", "abandonment beside public bins", "unreported roadside disposal", "avoidance of formal collection"],
    ],
    statement: "Should the municipality charge {b} for {c} of {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} can make the additional collection and handling cost of {c} visible to households generating extra {a}.", explanation: "The argument identifies a material user-pays incentive and cost-allocation rationale." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If {b} is too high and legal alternatives are inconvenient, it may encourage {d} of {a}, increasing cleanup and enforcement costs.", explanation: "The argument identifies a credible second-order behavioural response to the fee." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T04", qlId: "ARG-QL-006", archetype: "PROPORTIONAL_RESPONSE_FALSE_DILEMMA", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      ["a cheating complaint", "an impersonation complaint", "a paper-leak allegation", "a technical-tampering complaint"],
      ["a recruitment examination", "an entrance examination", "a licensing test", "a departmental test"],
      ["cancel the entire examination", "invalidate every candidate's attempt", "cancel every centre's result", "order a complete re-examination"],
      ["investigate the affected centre", "verify evidence and scope", "isolate affected sessions", "use a proportionate remedial process"],
    ],
    statement: "Should the authority automatically {c} whenever it receives {a} about {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "Yes. A single {a} proves that every candidate and centre in {b} was affected, so the authority must {c} without {d}.", explanation: "One complaint does not establish system-wide wrongdoing or eliminate the need to determine scope." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "FALSE_DILEMMA", text: "No. The authority must either ignore every {a} or permanently stop conducting {b}; {d} cannot be considered.", explanation: "The argument invents two extreme choices and excludes proportionate investigation without reason." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T05", qlId: "ARG-QL-006", archetype: "CORRIDOR_RESTRICTION_DISPLACEMENT", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      ["private cars", "through traffic", "non-resident vehicles", "single-occupant cars"],
      ["one congested central corridor", "a station-front road", "a central business street", "a market access corridor"],
      ["weekday peak hours", "the evening rush", "the morning commuter peak", "the busiest market hours"],
      ["frequent public transport and alternate routes", "parallel road capacity", "park-and-ride options", "reliable bus and metro access"],
    ],
    statement: "Should the city restrict {a} on {b} during {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Where {d} exist, restricting {a} on {b} during {c} can reduce demand for scarce road space on that corridor.", explanation: "The argument states a conditional, plausible mechanism and recognises the need for alternatives." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "SPECULATIVE_SLIPPERY_SLOPE", text: "No. Restricting {a} on {b} during {c} will inevitably create permanent gridlock across the entire city even where {d} exist.", explanation: "The argument turns a possible displacement effect into an unsupported city-wide certainty." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T06", qlId: "ARG-QL-006", archetype: "INTERIM_SAFEGUARD_DUE_PROCESS", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      ["an unverified buyer complaint", "one unverified fraud report", "a single misconduct allegation", "one disputed transaction complaint"],
      ["permanently ban the seller", "permanently close the account", "irreversibly suspend the service provider", "permanently remove the participant"],
      ["temporary restrictions and investigation", "evidence review with interim safeguards", "a temporary hold followed by verification", "limited protective action while facts are checked"],
      ["buyers or users", "the complainant", "other platform users", "potentially affected customers"],
    ],
    statement: "Should a platform immediately {b} after {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "FALSE_DILEMMA", text: "Yes. {a} can occur only when guilt is certain, so the platform must {b} to protect {d}.", explanation: "The argument treats an unverified complaint as proof and excludes proportionate intermediate responses." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. {c} can protect {d} while avoiding the irreversible step to {b} before {a} is verified.", explanation: "The argument supplies a credible alternative balancing protection with due process." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T07", qlId: "ARG-QL-006", archetype: "PRICE_INCENTIVE_VS_ACCESS_EFFECT", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["single-use shopping bags", "disposable takeaway containers", "single-use cups", "disposable cutlery sets"],
      ["a small per-item fee", "a visible environmental charge", "a reusable-option surcharge", "a consumption-based fee"],
      ["large retail stores", "large food outlets", "shopping centres", "major event venues"],
      ["affordable reusable alternatives", "easy access to reusable substitutes", "low-cost replacement options", "convenient non-disposable choices"],
    ],
    statement: "Should {c} charge {b} for {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} gives customers at {c} a direct incentive to avoid automatically taking new {a} when reuse is possible.", explanation: "The argument identifies a plausible price incentive linked to reduced single-use consumption." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If {d} are unavailable, {b} on {a} may mainly burden customers without changing behaviour much, so access to substitutes matters.", explanation: "The argument identifies a credible condition that can weaken the policy's effectiveness and fairness." },
    ],
  },
  {
    id: "ARG-CP003-QL006-T08", qlId: "ARG-QL-006", archetype: "AUTOMATED_FLAG_RESPONSE_ALTERNATIVES", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      ["an automated fraud flag", "an automated risk score", "a machine-learning anomaly alert", "a rules-engine warning"],
      ["close the account permanently", "block all services permanently", "terminate the customer relationship", "freeze every linked facility indefinitely"],
      ["manual review", "step-up verification", "temporary risk controls", "evidence-based investigation"],
      ["a false positive", "unusual but legitimate behaviour", "incomplete transaction context", "a model or data error"],
    ],
    statement: "Should a bank automatically {b} whenever a transaction receives {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "BARE_ASSERTION", text: "Yes. {a} is always proof of fraud, so there is no need for {c} even if the alert could reflect {d}.", explanation: "A model flag is a risk signal, not automatic proof of wrongdoing." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "FALSE_DILEMMA", text: "No. Because {a} can reflect {d}, the bank should never use {c} or investigate flagged transactions at all instead of {b}.", explanation: "The possibility of false positives does not imply that flagged activity should be ignored; the argument creates an all-or-nothing choice." },
    ],
  },
];
