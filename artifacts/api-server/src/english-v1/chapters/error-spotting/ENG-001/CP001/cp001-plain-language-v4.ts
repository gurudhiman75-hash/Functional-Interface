import { deterministicPick } from "../../../../core/deterministic";
import type { SemanticDomainV4 } from "./cp001-semantic-catalog-v4";
import { CONTEXT_EXPANSIONS_BY_DOMAIN_V4, type ContextExpansionV4 } from "./cp001-context-expansions-v4";

/**
 * Surface-only replacements. None may change the SVA subject number, target
 * verb, error index or correction. Longer phrases must appear before their
 * component words.
 */
const PLAIN_REPLACEMENTS: readonly [string, string][] = [
  ["waiting for document checking", "scheduled for a document check"],
  ["scheduled for document checking", "scheduled for a document check"],
  ["waiting near the main field", "waiting near the field"],
  ["assembled near the main field", "waiting near the field"],
  ["waiting in the reception area", "waiting near the front desk"],
  ["gathered in the reception area", "waiting near the front desk"],
  ["waiting with prepared parcels", "holding ready parcels"],
  ["preparing the main field", "getting the field ready"],
  ["managing the main field", "working in the field"],
  ["monitoring the control screen", "watching the control screen"],
  ["working at the control screen", "watching the control screen"],
  ["submitting updated documents", "giving the required papers"],
  ["seeking account renewal", "renewing the account"],
  ["preparing the new exhibition", "setting up the new display"],
  ["organising the new exhibition", "setting up the new display"],
  ["rehearsing the opening piece", "practising the opening piece"],
  ["leading the opening rehearsal", "leading the first practice"],
  ["recording the morning survey", "doing the morning survey"],
  ["conducting the morning survey", "doing the morning survey"],
  ["attending the morning batch", "in the morning class"],
  ["using the marked cycle lane", "riding in the cycle lane"],
  ["riding in the marked cycle lane", "riding in the cycle lane"],
  ["running after scheduled maintenance", "running normally"],
  ["running the cutting machine", "working near the cutting machine"],
  ["under one project report", "in one project report"],
  ["in a single project report", "in one project report"],
  ["a joint result", "the final result"],
  ["in one project report", "in a single report"],
  ["regular maintenance", "regular checks"],
  ["the photo caption", "a photo caption"],
  ["the medical note", "a medical note"],
  ["under close technical review", "under review"],
  ["monthly instalment", "monthly payment"],
  ["irrigation demonstration", "lesson on watering crops"],
  ["for the following team", "for the next team"],
  ["fresh produce", "fresh vegetables"],
  ["the power cut through the control system", "the power cut online"],
  ["the power cut through the system", "the power cut online"],
  ["through the control system", "online"],
  ["power complaint service", "complaint service"],
  ["system operators", "operators"],
  ["best photograph for publication", "best photograph for the newspaper"],
  ["best photograph for release", "best photograph for the newspaper"],
  ["during the current drill cycle", "this month"],
  ["during the holiday travel period", "during the holiday period"],
  ["during the holiday travel time", "during the holiday period"],
  ["handling the branch review", "working at the branch"],
  ["latest survey", "latest study"],
  ["repair bay", "workshop"],
  ["extended use", "long use"],

  // Keep the technology pair human-led. “Computers/programs completed the
  // test” was grammatically usable but unnecessarily mechanical.
  ["The computers,", "The assistants,"],
  ["along with the computers", "along with the assistants"],
  ["together with the computers", "together with the assistants"],
  ["as well as the computers", "as well as the assistants"],
  ["Either the computers or", "Either the assistants or"],
  ["Neither the computers nor", "Neither the assistants nor"],
  ["or the computers", "or the assistants"],
  ["nor the computers", "nor the assistants"],

  ["outage reporting service", "complaint service"],
  ["power outage", "power cut"],
  ["the interruption", "the power cut"],
  ["without interruption", "without stopping"],
  ["diagnostic programs", "test programs"],
  ["diagnostic program", "test program"],
  ["diagnostic unit", "test room"],
  ["diagnostic test", "test"],
  ["clinical briefing", "medical meeting"],
  ["clinical note", "medical note"],
  ["outpatient clinic", "clinic"],
  ["rehabilitation session", "recovery session"],
  ["dosage instructions", "medicine instructions"],
  ["valid prescriptions", "valid doctor's notes"],
  ["follow-up examination", "follow-up check"],
  ["after consultation", "after the check-up"],
  ["laboratory technicians", "lab workers"],
  ["laboratory technician", "lab worker"],
  ["laboratory procedure", "lab rules"],
  ["laboratory study", "lab study"],
  ["laboratory log", "lab notes"],
  ["preliminary data", "early results"],
  ["research log", "study notes"],
  ["research plan", "study plan"],
  ["observation team", "study team"],
  ["observation plan", "study plan"],
  ["field station", "field site"],
  ["curriculum meeting", "school meeting"],
  ["examination guidelines", "test instructions"],
  ["examination portal", "test website"],
  ["examination schedule", "test schedule"],
  ["reporting instructions", "test instructions"],
  ["valid identity card", "valid ID card"],
  ["practical demonstration", "practical lesson"],
  ["under supervision", "with guidance"],
  ["reserved ticket", "booked ticket"],
  ["departure board", "travel board"],
  ["maintenance bay", "repair area"],
  ["braking system", "brakes"],
  ["inspection report", "check report"],
  ["inspection note", "check note"],
  ["safety inspection", "safety check"],
  ["routine inspection", "routine check"],
  ["ground inspection", "ground check"],
  ["in the handheld system", "on the mobile device"],
  ["handheld system", "mobile device"],
  ["wholesale market", "large market"],
  ["packaged goods", "packed goods"],
  ["bulk order", "large order"],
  ["purchase invoice", "bill"],
  ["supplier invoice", "supplier bill"],
  ["warehouse stock", "stored goods"],
  ["reusable shopping bag", "shopping bag"],
  ["qualifying round", "next round"],
  ["conditioning session", "fitness session"],
  ["public service centre", "service centre"],
  ["verification counter", "checking desk"],
  ["field review", "field check"],
  ["beta version", "test version"],
  ["firmware update", "software update"],
  ["protected wetland", "protected lake area"],
  ["reservoir", "lake"],
  ["irrigation channel", "water channel"],
  ["irrigation pumps", "water pumps"],
  ["irrigation pump", "water pump"],
  ["irrigation plan", "water plan"],
  ["sowing season", "planting season"],
  ["scheduled servicing", "regular service"],
  ["production output", "work output"],
  ["assembly line", "work line"],
  ["structural defect", "serious fault"],
  ["technical review", "repair check"],
  ["technical inspection", "safety check"],
  ["resurfacing", "road repair"],
  ["before commissioning", "before use"],
  ["distribution line", "power line"],
  ["transaction instructions", "payment instructions"],
  ["transaction rules", "payment rules"],
  ["settlement rules", "payment rules"],
  ["registered letter", "special letter"],
  ["calculating postage", "checking the mail charge"],
  ["residential route", "home-delivery route"],
  ["holiday travel period", "holiday travel time"],
  ["public exhibition", "public display"],
  ["main exhibition", "main display"],
  ["exhibition catalogue", "display list"],
  ["chamber group", "music group"],
  ["curators", "museum workers"],
  ["curator", "museum worker"],
  ["commuters", "travellers"],
  ["commuter", "traveller"],
  ["tellers", "bank clerks"],
  ["teller", "bank clerk"],
  ["recipients", "customers"],
  ["recipient", "customer"],
  ["during the latest review period", "during the recent review"],
  ["latest review period", "recent review"],
  ["across the two scheduled sessions", "across two planned sessions"],
  ["current operating arrangement", "current work plan"],
  ["most recent assessment cycle", "recent check"],

  // Final single-word safety net for avoidable domain jargon.
  ["publication", "printing"],
  ["broadcast", "show"],
  ["editorial", "news"],
  ["clinical", "medical"],
  ["diagnostic", "test"],
  ["protocol", "rules"],
  ["assessment", "check"],
  ["conservation", "care"],
  ["consultation", "check-up"],
  ["deployment", "setup"],
  ["settlement", "payment"],
  ["transaction", "payment"],
  ["occupancy", "room use"],
  ["preliminary", "early"],
  ["firmware", "software"],
  ["wholesale", "large"],
  ["laboratory", "lab"],
  ["verification", "checking"],
  ["maintenance", "repair"],
  ["inspection", "check"],
  ["commissioning", "use"],
  ["curriculum", "study"],
  ["irrigation", "water"],
  ["outage", "power cut"],
  ["outpatient", "clinic"],
  ["rehabilitation", "recovery"],
  ["exhibition", "display"],
  ["instalment", "payment"],
  ["qualifying", "next"],
  ["sowing", "planting"],
  ["structural", "serious"],
] as const;

export function simplifyCp001Text(text: string): string {
  let out = text;
  for (const [from, to] of PLAIN_REPLACEMENTS) out = out.replaceAll(from, to);
  return out.replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
}

export function simplifyCp001Segments(segments: readonly string[]): string[] {
  const out = segments.map(simplifyCp001Text);
  for (let index = 0; index < out.length - 1; index += 1) {
    if (/^(?:is|are) showing$/i.test(out[index] ?? "") && /^a small crack\b/i.test(out[index + 1] ?? "")) {
      out[index + 1] = (out[index + 1] ?? "").replace(/^a small crack\b/i, "signs of damage");
    }
  }
  return out;
}

const LOCATION_LEADS = ["at", "in", "on", "near"] as const;
const CONNECTOR_LEADS = ["at", "during", "in", "on", "under", "near"] as const;

function leadOf(text: string): string {
  return text.trim().toLowerCase().split(/\s+/)[0] ?? "";
}

function contextConflicts(source: string, context: string): boolean {
  const lowerSource = source.toLowerCase();
  const lowerContext = context.toLowerCase();
  if (lowerSource.includes(lowerContext)) return true;

  const lead = leadOf(lowerContext);
  if (CONNECTOR_LEADS.includes(lead as (typeof CONNECTOR_LEADS)[number])) {
    const count = lowerSource.match(new RegExp(`\\b${lead}\\b`, "g"))?.length ?? 0;
    if (count > 0) return true;
  }

  const sourceHasSpecificTime = /\b(?:today|tomorrow|tonight|this morning|this afternoon|this evening|this week|this term|this season)\b/.test(lowerSource);
  const contextHasSpecificTime = /\b(?:today|tomorrow|tonight|this morning|this afternoon|this evening|this week|this term|this season)\b/.test(lowerContext);
  if (sourceHasSpecificTime && contextHasSpecificTime) return true;

  if (/\broof\b/.test(lowerSource) && lowerContext === "in the room") return true;
  if (/\bbridge\b/.test(lowerSource) && lowerContext === "on the road") return true;

  return false;
}

function locationContext(entry: ContextExpansionV4): boolean {
  return LOCATION_LEADS.includes(leadOf(entry.text) as (typeof LOCATION_LEADS)[number]);
}

/**
 * Legacy helper retained for compatibility with earlier V4 diagnostics. The
 * production question generator no longer appends these generic contexts.
 */
export function chooseCp001PlainContext(
  sourceSegments: readonly string[],
  domain: SemanticDomainV4,
  seed: string,
): ContextExpansionV4 {
  const source = sourceSegments.join(" ").replace(/\s+/g, " ").trim();
  const pool = CONTEXT_EXPANSIONS_BY_DOMAIN_V4[domain];
  const eligible = pool.filter((entry) => !contextConflicts(source, entry.text));
  const base = eligible.length > 0 ? eligible : pool;

  if (/\b(?:before|after|since|during)\b/i.test(source)) {
    const places = base.filter(locationContext);
    if (places.length > 0) return deterministicPick(`${seed}:place`, places);
  }

  return deterministicPick(seed, base);
}
