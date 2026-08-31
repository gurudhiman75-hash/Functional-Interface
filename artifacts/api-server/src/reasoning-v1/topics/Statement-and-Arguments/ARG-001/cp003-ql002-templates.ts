import type { ArgCp003Template } from "./cp003-saturation-types.ts";

export const ARG_CP003_QL002_TEMPLATES: readonly ArgCp003Template[] = [
  {
    id: "ARG-CP003-QL002-T01", qlId: "ARG-QL-002", archetype: "SECURITY_CONTROL_MECHANISM", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      ["salary-credit bank account", "registered recovery email", "primary mobile number", "high-value beneficiary"],
      ["an independent OTP", "a call-back to the existing number", "an in-app approval from the old device", "a second-factor confirmation"],
      ["a compromised email account", "stolen login credentials", "a hijacked browser session", "a fraudulent profile-change request"],
      ["redirect funds", "take over recovery access", "change security contacts", "prepare an unauthorised transfer"],
    ],
    statement: "Should an employee or customer complete {b} before changing the {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {b} can prevent {c} alone from being enough to change the {a} and then {d}.", explanation: "The argument gives a plausible security mechanism: an independent check breaks a single-compromise path." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "ANECDOTE_AS_UNIVERSAL_PROOF", text: "No. One user once failed {b}, so requiring it for a {a} will always make every legitimate change impossible even when the risk is {c} and the attacker may {d}.", explanation: "One failure does not prove that the control makes all legitimate changes impossible." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T02", qlId: "ARG-QL-002", archetype: "EDUCATION_CAUSAL_OVERCLAIM", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      ["academic-integrity rules", "citation rules", "collaboration rules", "examination-conduct rules"],
      ["first-year students", "new postgraduate students", "newly admitted trainees", "students entering a professional course"],
      ["a short orientation", "an induction workshop", "a guided rules session", "a practical briefing"],
      ["unintentional violations", "incorrect citation practices", "unauthorised collaboration", "misunderstanding of misconduct rules"],
    ],
    statement: "Should {b} receive {c} on {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "Yes. Once {b} attend {c} on {a}, {d} will disappear completely.", explanation: "Orientation may help, but it cannot by itself guarantee that every form of {d} disappears." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Explaining {a} through {c} can reduce {d} caused by {b} not understanding the standards.", explanation: "The argument supplies a direct and plausible mechanism: clearer rules can reduce mistakes caused by ignorance." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T03", qlId: "ARG-QL-002", archetype: "PRICE_DISCLOSURE_MECHANISM", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["delivery fees", "platform charges", "mandatory service fees", "non-optional handling charges"],
      ["the product page", "the cart summary", "the comparison screen", "the pre-checkout screen"],
      ["delivery location", "payment method", "order value", "service category"],
      ["compare competing offers", "judge the real payable amount", "avoid late price surprises", "make an informed purchase choice"],
    ],
    statement: "Should an online marketplace show unavoidable {a} on {b} before the final payment screen?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. Showing known {a} on {b} helps buyers {d} using the amount they are actually expected to pay.", explanation: "The argument identifies a clear comparison and price-transparency mechanism." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. Some {a} depend on {c}; showing a single total on {b} before {c} is known can itself mislead buyers.", explanation: "The argument raises a genuine accuracy constraint on early price disclosure." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T04", qlId: "ARG-QL-002", archetype: "DIGITAL_SUPERIORITY_ASSERTION", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      ["safety training", "customer-service training", "software onboarding", "compliance training"],
      ["recorded video modules", "self-paced slide modules", "automated tutorials", "pre-recorded webinars"],
      ["in-person sessions", "live instructor sessions", "guided workshops", "interactive classroom sessions"],
      ["learning outcomes", "retention of procedures", "ability to handle exceptions", "understanding of complex cases"],
    ],
    statement: "Should every {a} programme replace all {c} with {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "BARE_ASSERTION", text: "Yes. {b} are digital, so they necessarily produce better {d} than {c} in every {a} programme.", explanation: "Calling a format digital does not establish superior learning outcomes." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "No. If {b} replace {c}, employees will certainly lose all ability to achieve {d} in {a}.", explanation: "The argument predicts total failure without a supporting mechanism or evidence." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T05", qlId: "ARG-QL-002", archetype: "FRAUD_ALERT_EARLY_WARNING", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      ["registered mobile number", "recovery email address", "mailing address", "transaction-limit setting"],
      ["an existing verified channel", "the old registered number", "the authenticated app", "a previously verified email"],
      ["account takeover", "unauthorised profile modification", "social-engineering fraud", "credential compromise"],
      ["further unauthorised changes", "fraudulent payment attempts", "loss of recovery access", "additional security changes"],
    ],
    statement: "Should a bank send an immediate alert through {b} when the {a} is changed?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. After {c}, an alert through {b} can help the customer detect an unauthorised change to the {a} before it enables {d}.", explanation: "The argument gives a plausible early-warning mechanism tied directly to fraud control." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "CORRELATION_AS_CAUSATION", text: "No. {c} has occurred even when alerts were sent through {b}, so alerts about the {a} can never reduce the risk of {d}.", explanation: "The existence of fraud despite alerts does not show that alerts have no preventive or detection value." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T06", qlId: "ARG-QL-002", archetype: "ACCESSIBILITY_MECHANISM", difficulty: "EASY", answerClass: "ONLY_II",
    dimensions: [
      ["city buses", "intercity buses", "metro feeder buses", "airport shuttle buses"],
      ["the next major stop", "the upcoming interchange", "the terminal stop", "the next route landmark"],
      ["audible announcements", "automated voice announcements", "spoken stop alerts", "on-board audio prompts"],
      ["passengers with limited vision", "visitors unfamiliar with the route", "passengers unable to see the display", "older passengers who miss small visual signs"],
    ],
    statement: "Should {a} provide {c} for {b}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "OVERGENERALIZATION", text: "Yes. Once {a} provide {c} for {b}, no passenger will ever miss a stop for any reason.", explanation: "The feature can help, but it does not eliminate every possible reason for missing a stop." },
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {c} for {b} can help {d} identify where to get off without depending only on a visual display.", explanation: "The argument gives a direct accessibility mechanism for a materially affected passenger group." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T07", qlId: "ARG-QL-002", archetype: "PRACTICE_EFFECT_WITH_TRADEOFF", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      ["low-stakes quizzes", "short mock tests", "retrieval-practice exercises", "timed practice papers"],
      ["weekly", "fortnightly", "at the end of each unit", "at planned revision points"],
      ["a final examination", "a competitive entrance test", "a semester examination", "a certification test"],
      ["teaching time", "student stress", "breadth of learning", "time for discussion-based learning"],
    ],
    statement: "Should students receive {a} {b} before {c}?",
    arguments: [
      { stance: "SUPPORTS", strength: "STRONG", text: "Yes. {a} {b} can reveal weak areas and provide repeated retrieval practice before {c}.", explanation: "The argument supplies a plausible learning mechanism rather than merely asserting improvement." },
      { stance: "OPPOSES", strength: "STRONG", text: "No. If {a} {b} become too frequent or high-pressure, they can reduce {d}; the frequency and purpose therefore matter.", explanation: "The argument identifies a credible implementation trade-off relevant to the proposed practice." },
    ],
  },
  {
    id: "ARG-CP003-QL002-T08", qlId: "ARG-QL-002", archetype: "PASSWORD_POLICY_CAUSAL_OVERCLAIM", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      ["seven days", "ten days", "fourteen days", "twenty-one days"],
      ["email passwords", "network passwords", "portal passwords", "application passwords"],
      ["credential theft", "password reuse", "phishing", "account compromise"],
      ["write passwords on paper", "reuse predictable patterns", "forget credentials", "store credentials insecurely"],
    ],
    statement: "Should every employee be required to change all {b} every {a}?",
    arguments: [
      { stance: "SUPPORTS", strength: "WEAK", weaknessDefect: "BARE_ASSERTION", text: "Yes. Changing {b} every {a} guarantees that {c} can never lead to misuse.", explanation: "Frequent changes do not guarantee that stolen or phished credentials cannot be misused." },
      { stance: "OPPOSES", strength: "WEAK", weaknessDefect: "UNSUPPORTED_CAUSAL_LEAP", text: "No. A change every {a} necessarily makes every employee {d}, so all {b} become less secure.", explanation: "The argument assumes a universal behavioural consequence without support." },
    ],
  },
];
