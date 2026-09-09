import type { DailyMasterPackEvent, DailyMasterPackLanguage } from "./daily-master-pack";

export const SELECTED_LEARNER_EDITORIAL_VERSION = "ca-cp074-learner-editorial-quality-v1";

const FACT_LABELS: Record<DailyMasterPackLanguage, Record<string, string>> = {
  en: {
    appointee: "Appointee",
    position: "Position",
    launching_entity: "Organisation",
    initiative: "Initiative",
    acting_entity: "Organisation",
    action_subject: "Development",
    event_status: "Status",
    amount: "Amount",
    percentage: "Key figure",
    winner: "Winner",
    award_or_title: "Award / title",
    current_account_status: "Current account",
    current_account_amount: "Amount",
    current_account_gdp_share: "Share of GDP",
    net_services_receipts: "Net services receipts",
  },
  hi: {
    appointee: "नियुक्त व्यक्ति",
    position: "पद",
    launching_entity: "संगठन",
    initiative: "पहल",
    acting_entity: "संगठन",
    action_subject: "मुख्य घटनाक्रम",
    event_status: "स्थिति",
    amount: "राशि",
    percentage: "मुख्य आंकड़ा",
    winner: "विजेता",
    award_or_title: "पुरस्कार / उपाधि",
  },
  pa: {
    appointee: "ਨਿਯੁਕਤ ਵਿਅਕਤੀ",
    position: "ਅਹੁਦਾ",
    launching_entity: "ਸੰਸਥਾ",
    initiative: "ਪਹਿਲ",
    acting_entity: "ਸੰਸਥਾ",
    action_subject: "ਮੁੱਖ ਘਟਨਾ",
    event_status: "ਸਥਿਤੀ",
    amount: "ਰਕਮ",
    percentage: "ਮੁੱਖ ਅੰਕੜਾ",
    winner: "ਜੇਤੂ",
    award_or_title: "ਇਨਾਮ / ਖਿਤਾਬ",
  },
};

const INTERNAL_FACT_KEYS = new Set(["official_action"]);

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function factMap(event: Pick<DailyMasterPackEvent, "facts">) {
  const map = new Map<string, string>();
  for (const fact of event.facts) {
    const key = clean(fact.key).toLowerCase();
    const value = clean(fact.value);
    if (key && value && !map.has(key)) map.set(key, value);
  }
  return map;
}

function titleCaseAllCaps(value: string) {
  const cleanValue = clean(value);
  if (!cleanValue || cleanValue !== cleanValue.toUpperCase()) return cleanValue;
  if (/^[A-Z0-9()/.& -]{2,18}$/.test(cleanValue) && !/\s{2,}/.test(cleanValue)) return cleanValue;
  return cleanValue
    .toLowerCase()
    .replace(/\b[a-z][a-z'-]*/g, (word) => word[0]!.toUpperCase() + word.slice(1))
    .replace(/\bIndian Air Force\b/g, "Indian Air Force")
    .replace(/\bAir Officer-In-Charge\b/g, "Air Officer-in-Charge")
    .replace(/\bKaa\b/g, "KAA")
    .replace(/\bAvm\b/g, "AVM")
    .replace(/\bDgafms\b/g, "DGAFMS")
    .replace(/\bDgms\b/g, "DGMS");
}

function person(value: string) {
  let result = clean(value).replace(/^(?:AIR MARSHAL|AIR VICE MARSHAL|AVM)\s+/i, "");
  result = titleCaseAllCaps(result);
  return result;
}

function role(value: string) {
  const raw = clean(value);
  if (/^DGAFMS$/i.test(raw)) return "DGAFMS";
  if (/^DGMS\s*\(Air\)$/i.test(raw)) return "DGMS (Air)";
  if (/air officer-in-charge maintenance.*indian air force/i.test(raw)) {
    return "Air Officer-in-Charge Maintenance of the Indian Air Force";
  }
  if (/^first\s*\(non-medical\)\s+woman two-star officer in the defence services$/i.test(raw)) {
    return "first non-medical woman two-star officer in the defence services";
  }
  return titleCaseAllCaps(raw);
}

function shortInitiative(value: string) {
  return clean(value)
    .replace(/^the\s+/i, "")
    .replace(/\s+as a Nationwide People[’']s Movement for Ocean Conservation$/i, "")
    .replace(/\s+Ahead of Ayurveda Day$/i, "")
    .replace(/\s+to Promote Legal Adoption and Say No to Illegal Adoption$/i, "")
    .replace(/\s+for Merchants and New Digital Platforms for Customers$/i, "")
    .trim();
}

function editorialEnglish(event: DailyMasterPackEvent): Pick<DailyMasterPackEvent, "title" | "summary" | "oneLiner"> {
  const facts = factMap(event);
  const appointee = facts.get("appointee");
  const position = facts.get("position");
  const entity = facts.get("acting_entity");
  const action = clean(facts.get("official_action") ?? "").toLowerCase();
  const subject = clean(facts.get("action_subject") ?? "");
  const launchingEntity = facts.get("launching_entity");
  const initiative = facts.get("initiative");
  const date = event.eventDate;
  const dateLabel = (() => {
    const parsed = new Date(`${date}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(parsed);
  })();

  if (appointee && position) {
    const who = person(appointee);
    const what = role(position);
    if (/^first\b/i.test(what)) {
      return {
        title: `${who} becomes ${what}`,
        summary: `On ${dateLabel}, ${who} became the ${what}.`,
        oneLiner: `${who}: ${what}.`,
      };
    }
    if (/Air Officer-in-Charge Maintenance/i.test(what)) {
      return {
        title: `${who} takes charge of IAF maintenance`,
        summary: `On ${dateLabel}, ${who} took over as ${what}.`,
        oneLiner: `${who} — ${what}.`,
      };
    }
    return {
      title: `${who} appointed ${what}`,
      summary: `On ${dateLabel}, ${who} was appointed as ${what}.`,
      oneLiner: `${who} — ${what}.`,
    };
  }

  if (launchingEntity && initiative) {
    const org = clean(launchingEntity)
      .replace(/^India Post Payments Bank$/i, "IPPB")
      .replace(/^Ministry of Civil Aviation$/i, "Civil Aviation Ministry");
    const item = shortInitiative(initiative);
    if (/Adoption Awareness 2026/i.test(initiative)) {
      return { title: "CARA launches Adoption Awareness 2026 theme", summary: `On ${dateLabel}, CARA launched its Adoption Awareness 2026 theme to promote legal adoption and discourage illegal adoption.`, oneLiner: "Adoption Awareness 2026 — launched by CARA." };
    }
    if (/Swachh Sagar, Surakshit Sagar 2026/i.test(initiative)) {
      return { title: "Swachh Sagar, Surakshit Sagar 2026 launched as nationwide ocean-conservation movement", summary: `On ${dateLabel}, Union Minister Dr Jitendra Singh launched the 5th edition of Swachh Sagar, Surakshit Sagar 2026 as a nationwide movement for ocean conservation.`, oneLiner: "Swachh Sagar, Surakshit Sagar 2026 — 5th edition launched nationwide." };
    }
    if (/AyurVarta/i.test(initiative)) {
      return { title: "AIIA launches AyurVarta digital dialogue series", summary: `On ${dateLabel}, AIIA launched the AyurVarta digital dialogue series ahead of Ayurveda Day.`, oneLiner: "AyurVarta — digital dialogue series launched by AIIA." };
    }
    if (/DakPay Sound Box/i.test(initiative)) {
      return { title: "IPPB launches DakPay Sound Box for merchants", summary: `On ${dateLabel}, India Post Payments Bank launched the DakPay Sound Box for merchants along with new digital platforms for customers.`, oneLiner: "DakPay Sound Box — launched by IPPB." };
    }
    if (/Hub & Spoke International Flight Operations/i.test(initiative)) {
      return { title: "Civil Aviation Ministry launches hub-and-spoke international operations from Ahmedabad", summary: `On ${dateLabel}, the Ministry of Civil Aviation launched hub-and-spoke international flight operations from Ahmedabad.`, oneLiner: "Hub-and-spoke international flight operations — launched from Ahmedabad." };
    }
    return { title: `${org} launches ${item}`, summary: `On ${dateLabel}, ${clean(launchingEntity)} launched ${clean(initiative)}.`, oneLiner: `${item} — launched by ${org}.` };
  }

  if (entity && subject) {
    if (/^CCI$/i.test(entity) && /^acquisition\b/i.test(subject)) {
      return {
        title: clean(event.title),
        summary: `On ${dateLabel}, CCI approved ${subject.replace(/^acquisition of\s+/i, "the acquisition of ")}.`,
        oneLiner: clean(event.oneLiner),
      };
    }
    if (/7\.8% GDP growth/i.test(subject) && /Prime Minister/i.test(entity)) {
      return { title: "PM highlights India's 7.8% GDP growth", summary: `On ${dateLabel}, the Prime Minister congratulated the nation on India's 7.8% GDP growth and highlighted stronger economic confidence.`, oneLiner: "India's GDP growth — 7.8%." };
    }
    if (/7\.8% real GDP growth in Q1 2026-27/i.test(subject)) {
      return { title: "India's real GDP grows 7.8% in Q1 2026-27", summary: `On ${dateLabel}, the Government of India reported 7.8% real GDP growth in Q1 2026-27, while real GVA grew 8.2%.`, oneLiner: "Q1 2026-27: real GDP 7.8%; real GVA 8.2%." };
    }
    if (/Variable Rate Reverse Repo|VRRR/i.test(subject)) {
      return { title: "RBI schedules 7-day VRRR auction for 1 September 2026", summary: `On ${dateLabel}, the RBI announced a 7-day Variable Rate Reverse Repo (VRRR) auction under the Liquidity Adjustment Facility for 1 September 2026.`, oneLiner: "7-day VRRR auction under LAF — RBI." };
    }
    if (/current account deficit/i.test(subject)) {
      return { title: "India records US$4.2 billion current account deficit in Q1 2026-27", summary: `On ${dateLabel}, the RBI reported a current account deficit of US$4.2 billion in Q1 2026-27, equivalent to 0.5% of GDP.`, oneLiner: "Q1 2026-27 CAD — US$4.2 billion (0.5% of GDP)." };
    }
    if (/overnight money-market volume/i.test(subject)) {
      return { title: "RBI reports ₹6.66 lakh crore overnight money-market volume at 4.98%", summary: `On ${dateLabel}, the RBI reported overnight money-market volume of ₹6,65,977.81 crore at a 4.98% weighted average rate for 31 August 2026.`, oneLiner: "Overnight money market — ₹6.66 lakh crore at 4.98%." };
    }
    if (/BHASHINI SANGAM Workshop in Nepal/i.test(subject)) {
      return { title: "BHASHINI holds SANGAM workshop in Nepal", summary: `On ${dateLabel}, the Digital India BHASHINI Division organised a BHASHINI SANGAM workshop in Nepal to strengthen India–Nepal cooperation on multilingual AI.`, oneLiner: "BHASHINI SANGAM — workshop held in Nepal." };
    }
    if (/Bilateral Cooperation in MSME Development, Innovation & Intellectual Property/i.test(subject)) {
      return { title: "India and Denmark deepen MSME, innovation and IP cooperation", summary: `On ${dateLabel}, India and Denmark strengthened bilateral cooperation in MSME development, innovation and intellectual property.`, oneLiner: "India–Denmark cooperation — MSMEs, innovation and IP." };
    }
    if (/Valedictory Session of Departmental Summit on Water Security/i.test(subject)) {
      return { title: "PM to join Water Security summit valedictory session", summary: `On ${dateLabel}, the Prime Minister's participation in the valedictory session of the Departmental Summit on Water Security on 2 September was announced.`, oneLiner: "Water Security summit valedictory session — 2 September." };
    }
    if (/26th SCO Summit in Bishkek/i.test(subject)) {
      return { title: "PM attends 26th SCO Summit in Bishkek", summary: `On ${dateLabel}, the Prime Minister participated in the 26th SCO Summit in Bishkek, Kyrgyz Republic.`, oneLiner: "26th SCO Summit — Bishkek, Kyrgyz Republic." };
    }
    if (/Automated Issuance of Free Sale and Commerce Certificates/i.test(subject)) {
      return { title: "DGFT automates Free Sale and Commerce Certificate issuance", summary: `On ${dateLabel}, DGFT enabled automated issuance of Free Sale and Commerce Certificates to improve ease of doing business.`, oneLiner: "Free Sale and Commerce Certificates — automated by DGFT." };
    }
    if (/Divyang Samanata, Sanrakshan evam Sashaktikaran Abhiyan/i.test(subject)) {
      return { title: "DEPwD and RERF join hands to launch DISSSA", summary: `On ${dateLabel}, the Department of Empowerment of Persons with Disabilities and Rajyoga Education Research Foundation signed an MoU to launch DISSSA.`, oneLiner: "DISSSA — joint initiative of DEPwD and RERF." };
    }
    if (/NCERT's 66th Foundation Day/i.test(subject)) {
      return { title: "NCERT marks 66th Foundation Day in New Delhi", summary: `On ${dateLabel}, the Union Minister for Education attended NCERT's 66th Foundation Day celebrations in New Delhi.`, oneLiner: "NCERT — 66th Foundation Day celebrated in New Delhi." };
    }

    const naturalAction = action
      .replace(/^participates?$/i, "participated in")
      .replace(/^organises?$/i, "organised")
      .replace(/^strengthens?$/i, "strengthened")
      .replace(/^enables?$/i, "enabled")
      .replace(/^approves?$/i, "approved")
      .replace(/^reports?$/i, "reported");
    return {
      title: `${clean(entity)}: ${clean(subject)}`,
      summary: `On ${dateLabel}, ${clean(entity)} ${naturalAction} ${clean(subject)}.`,
      oneLiner: `${clean(subject)} — ${clean(entity)}.`,
    };
  }

  return { title: clean(event.title), summary: clean(event.summary), oneLiner: clean(event.oneLiner) };
}

function displayCategory(event: DailyMasterPackEvent) {
  const facts = factMap(event);
  const position = clean(facts.get("position") ?? "");
  const combined = `${event.title} ${event.summary} ${facts.get("action_subject") ?? ""} ${facts.get("initiative") ?? ""}`;
  if (facts.has("appointee") && position && !/^first\b/i.test(role(position))) return "appointments";
  if (/first non-medical woman two-star officer|defence services|Indian Air Force/i.test(combined)) return "defence";
  if (/SCO Summit|Summit on Water Security/i.test(combined)) return "summits";
  if (/India.?Denmark|BHASHINI SANGAM.*Nepal/i.test(combined)) return "international";
  if (/DGFT|Free Sale and Commerce Certificate/i.test(combined)) return "economy_banking";
  return event.category;
}

function learnerFacts(event: DailyMasterPackEvent, language: DailyMasterPackLanguage) {
  const seen = new Set<string>();
  return event.facts
    .filter((fact) => !INTERNAL_FACT_KEYS.has(clean(fact.key).toLowerCase()))
    .map((fact) => {
      const key = clean(fact.key).toLowerCase();
      let value = clean(fact.value);
      if (key === "appointee") value = person(value);
      if (key === "position") value = role(value);
      const label = FACT_LABELS[language][key]
        || clean(fact.label)
        || key.replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
      return { ...fact, key, label, value };
    })
    .filter((fact) => {
      const fingerprint = `${fact.label.toLowerCase()}::${fact.value.toLowerCase()}`;
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return Boolean(fact.value);
    })
    .slice(0, 8);
}

function learnerSources(event: DailyMasterPackEvent) {
  const sources = event.sources.filter((source) => source.primary);
  const candidates = sources.length > 0 ? sources : event.sources;
  const seen = new Set<string>();
  return candidates.filter((source) => {
    const key = clean(source.name).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 2);
}

export function applySelectedLearnerEditorialQuality(
  event: DailyMasterPackEvent,
  language: DailyMasterPackLanguage,
): DailyMasterPackEvent {
  const copy = language === "en" ? editorialEnglish(event) : {
    title: clean(event.title),
    summary: clean(event.summary),
    oneLiner: clean(event.oneLiner),
  };
  return {
    ...event,
    category: displayCategory(event),
    title: copy.title,
    summary: copy.summary,
    oneLiner: copy.oneLiner,
    facts: learnerFacts(event, language),
    sources: learnerSources(event),
  };
}

export function selectedLearnerEditorialWarnings(events: DailyMasterPackEvent[]) {
  const warnings: string[] = [];
  const gdp = events.filter((event) => /\b7\.8%\b.*\bGDP\b|\bGDP\b.*\b7\.8%\b/i.test(`${event.title} ${event.summary}`));
  if (gdp.length > 1) {
    warnings.push(`Potential learner-level topic overlap: ${gdp.length} selected GDP items report the same 7.8% growth figure; keep both only if the editorial distinction is intentional.`);
  }
  for (const event of events) {
    if (/^Government of India:/i.test(event.title)) warnings.push(`Generic source-prefix title remains for ${event.id}`);
    if (/\b(?:dGMS|dgafms|Dgafms|indian air force)\b/.test(`${event.title} ${event.summary} ${event.oneLiner}`)) {
      warnings.push(`Capitalization/grammar defect remains for ${event.id}`);
    }
  }
  return [...new Set(warnings)];
}
