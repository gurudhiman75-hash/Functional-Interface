export type CurrentAffairsEditorialPriorityTier = "routine" | "standard" | "high" | "critical";

export type CurrentAffairsEditorialPriorityInput = {
  title: string;
  summary?: string;
  category?: string;
  facts?: Array<{ key?: string; value?: string }>;
};

export type CurrentAffairsEditorialPriority = {
  tier: CurrentAffairsEditorialPriorityTier;
  scoreAdjustment: number;
  reasons: string[];
};

const CRITICAL_PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:gdp|gross domestic product|national accounts|quarterly estimates?)\b/i, "major macroeconomic output/statistics"],
  [/\b(?:census\s*2027|population census|house listing|houselisting)\b/i, "Census milestone"],
  [/\b(?:upi|unified payments interface)\b.*\b(?:international|uzbekistan|merchant|acceptance|expansion|launch|agreement)\b/i, "international digital-payments expansion"],
  [/\b(?:commissioned|commissioning)\b.*\b(?:ins\s+|indian navy|naval|vessel|ship)\b/i, "major defence commissioning"],
  [/\b(?:repo rate|monetary policy|policy rate|inflation|cpi|wpi|iip|unemployment|employment rate)\b/i, "major economy or monetary-policy indicator"],
  [/\b(?:sco|shanghai cooperation organi[sz]ation)\b.*\b(?:summit|council of heads of state)\b|\b(?:summit|council of heads of state)\b.*\b(?:sco|shanghai cooperation organi[sz]ation)\b/i, "major multilateral SCO summit"],
  [/\b(?:scripts? history|makes? history|historic(?:al)? first|first[- ]ever|first woman|first female)\b/i, "historic first or record milestone"],
];

const HIGH_PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:mou|memorandum of understanding|agreement|pact)\b/i, "formal agreement or MoU"],
  [/\b(?:appointed|appointment|elected|assumes? charge|takes? charge|takes? over|assumed the appointment|assumes? the appointment)\b/i, "important appointment or assumption of office"],
  [/\b(?:wins?|won|award|honour|honor)\b/i, "award or result"],
  [/\b(?:launches|launched|unveils|unveiled|inaugurates|inaugurated)\b.*\b(?:schemes?|missions?|portals?|platforms?|products?|programme|program|initiatives?|complex|sound box)\b/i, "substantive launch or initiative"],
  [/\b(?:semicon|semiconductor|quantum|satellite|space mission|missile|defence exercise|defense exercise)\b/i, "high-yield science/technology/defence signal"],
  [/\b(?:bilateral|summit|state visit|trade talks?|free trade|fta|joint working group)\b/i, "major international or trade development"],
  [/\b(?:participates?|participated)\b.*\b(?:summit|council of heads of state|ministerial meeting)\b/i, "participation in major multilateral meeting"],
];

const ROUTINE_PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:variable rate reverse repo|vrrr)\b.*\b(?:auction|laf)\b/i, "recurring RBI liquidity-operation notice"],
  [/\b(?:overnight|\d+[- ]day)\b.*\b(?:reverse repo|repo)\b.*\bauction\b/i, "recurring liquidity auction"],
  [/\b(?:monthly report)\b.*\b(?:cpgrams|grievance)\b/i, "recurring administrative monthly report"],
  [/\b(?:annual|monthly)\b.*\b(?:lecture|webinar|workshop)\b/i, "routine lecture/workshop notice"],
  [/\b(?:lecture|webinar|workshop)\b.*\b(?:inaugurate|inaugurates|inauguration|scheduled)\b/i, "routine ceremonial/lecture notice"],
  [/\bpreparatory meeting\b/i, "preparatory meeting rather than substantive outcome"],
  [/\b(?:online\s+)?(?:national\s+)?quiz\b.*\b(?:mygov|foundation day|celebrate|awareness)\b|\bmygov\b.*\bquiz\b/i, "routine public-engagement quiz"],
  [/\b(?:foundation day|awareness theme|awareness campaign)\b(?!.*\b(?:first|record|national award|major reform)\b)/i, "routine awareness/foundation-day communication"],
  [/\bindian railways?\b.*\b(?:approves?|sanctions?)\b.*\b(?:yard remodel(?:ing|ling)|bypass line)\b/i, "routine standalone railway infrastructure approval"],
];

const BANKING_SIGNALS = /\b(?:rbi|reserve bank|banking?|payments?|upi|npci|nipl|monetary|repo rate|policy rate|liquidity|inflation|gdp|gross domestic product|economy|economic|finance|financial|fiscal|sebi|market|insurance|gst|tax|credit|deposit|forex|foreign exchange)\b/i;
const PUNJAB_SIGNALS = /\b(?:punjab|mohali|sas nagar|chandigarh|amritsar|ludhiana|jalandhar|patiala|bathinda|mansa|pathankot|hoshiarpur|firozpur|ferozepur|kapurthala|gurdaspur|barnala|sangrur|faridkot|fatehgarh sahib|rupnagar|ropar|fazilka|moga|malerkotla|shaheed bhagat singh nagar|nawanshahr|tarn taran)\b/i;

function combinedText(input: CurrentAffairsEditorialPriorityInput) {
  const factText = (input.facts ?? []).map((fact) => `${fact.key ?? ""} ${fact.value ?? ""}`).join(" ");
  return `${input.title} ${input.summary ?? ""} ${factText}`.replace(/\s+/g, " ").trim();
}

export function evaluateCurrentAffairsEditorialPriority(
  input: CurrentAffairsEditorialPriorityInput,
): CurrentAffairsEditorialPriority {
  const text = combinedText(input);
  const reasons: string[] = [];

  for (const [pattern, reason] of CRITICAL_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(reason);
      return { tier: "critical", scoreAdjustment: 16, reasons };
    }
  }
  for (const [pattern, reason] of HIGH_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(reason);
      return { tier: "high", scoreAdjustment: 10, reasons };
    }
  }
  for (const [pattern, reason] of ROUTINE_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(reason);
      return { tier: "routine", scoreAdjustment: -30, reasons };
    }
  }
  return { tier: "standard", scoreAdjustment: 0, reasons: ["standard editorial priority"] };
}

export function examFamilySignalAdjustment(
  examFamily: string,
  input: CurrentAffairsEditorialPriorityInput,
): { adjustment: number; reasons: string[] } {
  const text = combinedText(input);
  const reasons: string[] = [];
  let adjustment = 0;

  if (examFamily === "banking" && BANKING_SIGNALS.test(text)) {
    adjustment += /\b(?:upi|payments?|rbi|reserve bank|monetary|repo rate|policy rate|inflation|gdp|gross domestic product|sebi|banking?)\b/i.test(text) ? 16 : 10;
    reasons.push("explicit Banking/economy signal");
  }
  if (examFamily === "punjab" && (input.category === "punjab" || PUNJAB_SIGNALS.test(text))) {
    adjustment += 20;
    reasons.push("explicit Punjab location/institution signal");
  }

  return { adjustment, reasons };
}

export function isHighYieldDiscoveryCandidate(input: CurrentAffairsEditorialPriorityInput): boolean {
  const priority = evaluateCurrentAffairsEditorialPriority(input);
  return priority.tier === "high" || priority.tier === "critical";
}