export type TenseDomainV1 =
  | "education"
  | "transport"
  | "commerce"
  | "science"
  | "sports"
  | "public-service"
  | "technology"
  | "environment"
  | "hospitality"
  | "healthcare"
  | "agriculture"
  | "media"
  | "household"
  | "infrastructure"
  | "banking"
  | "manufacturing"
  | "energy"
  | "postal"
  | "culture"
  | "emergency-service";

export interface DynamicTenseSceneV1 {
  id: string;
  domain: TenseDomainV1;
  subject: string;
  base: string;
  present3sg: string;
  past: string;
  participle: string;
  ing: string;
  object: string;
  context: string;
}

export interface OngoingTenseSceneV1 {
  id: string;
  domain: TenseDomainV1;
  subject: string;
  participle: string;
  ing: string;
  object: string;
  continuingMarker: string;
  laterPastClause: string;
  interruptionClause: string;
  modifier: string;
}

export interface StativeTenseSceneV1 {
  id: string;
  domain: TenseDomainV1;
  subject: string;
  base: string;
  present3sg: string;
  participle: string;
  ing: string;
  object: string;
  durationMarker: string;
  modifier: string;
}

export const DYNAMIC_TENSE_SCENES_V1: readonly DynamicTenseSceneV1[] = [
  { id: "EDU-01", domain: "education", subject: "the teacher", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the attendance list", context: "before class" },
  { id: "TRN-01", domain: "transport", subject: "the driver", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the bus brakes", context: "before the trip" },
  { id: "COM-01", domain: "commerce", subject: "the clerk", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the payments", context: "at the counter" },
  { id: "SCI-01", domain: "science", subject: "the assistant", base: "test", present3sg: "tests", past: "tested", participle: "tested", ing: "testing", object: "the sample", context: "in the lab" },
  { id: "SPT-01", domain: "sports", subject: "the coach", base: "review", present3sg: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the practice notes", context: "after the session" },
  { id: "PUB-01", domain: "public-service", subject: "the officer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the application forms", context: "at the desk" },
  { id: "TEC-01", domain: "technology", subject: "the technician", base: "update", present3sg: "updates", past: "updated", participle: "updated", ing: "updating", object: "the office software", context: "after closing time" },
  { id: "ENV-01", domain: "environment", subject: "the worker", base: "measure", present3sg: "measures", past: "measured", participle: "measured", ing: "measuring", object: "the water level", context: "at the tank" },
  { id: "HOS-01", domain: "hospitality", subject: "the receptionist", base: "confirm", present3sg: "confirms", past: "confirmed", participle: "confirmed", ing: "confirming", object: "the room bookings", context: "at the front desk" },
  { id: "HEA-01", domain: "healthcare", subject: "the nurse", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the patient's temperature", context: "during the round" },
  { id: "AGR-01", domain: "agriculture", subject: "the farmer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the water pump", context: "in the field" },
  { id: "MED-01", domain: "media", subject: "the editor", base: "review", present3sg: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the headlines", context: "before printing" },
  { id: "HOM-01", domain: "household", subject: "the caretaker", base: "lock", present3sg: "locks", past: "locked", participle: "locked", ing: "locking", object: "the main gate", context: "at night" },
  { id: "INF-01", domain: "infrastructure", subject: "the engineer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the road surface", context: "before repairs" },
  { id: "BNK-01", domain: "banking", subject: "the bank clerk", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the signatures", context: "before payment" },
  { id: "MFG-01", domain: "manufacturing", subject: "the worker", base: "pack", present3sg: "packs", past: "packed", participle: "packed", ing: "packing", object: "the finished boxes", context: "before loading" },
  { id: "ENE-01", domain: "energy", subject: "the operator", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the meter readings", context: "during each shift" },
  { id: "PST-01", domain: "postal", subject: "the postal worker", base: "sort", present3sg: "sorts", past: "sorted", participle: "sorted", ing: "sorting", object: "the parcels", context: "before delivery" },
  { id: "CUL-01", domain: "culture", subject: "the guide", base: "open", present3sg: "opens", past: "opened", participle: "opened", ing: "opening", object: "the display room", context: "for visitors" },
  { id: "EMS-01", domain: "emergency-service", subject: "the control-room assistant", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the emergency calls", context: "during the shift" },
] as const;

export const ONGOING_TENSE_SCENES_V1: readonly OngoingTenseSceneV1[] = [
  { id: "ONGO-EDU", domain: "education", subject: "the teacher", participle: "reviewed", ing: "reviewing", object: "the answer sheets", continuingMarker: "since 9 a.m.", laterPastClause: "the principal arrived", interruptionClause: "the bell rang", modifier: "in the staff room" },
  { id: "ONGO-TRN", domain: "transport", subject: "the mechanic", participle: "repaired", ing: "repairing", object: "the bus engine", continuingMarker: "since early morning", laterPastClause: "the driver returned", interruptionClause: "the power went out", modifier: "in the workshop" },
  { id: "ONGO-SCI", domain: "science", subject: "the assistant", participle: "tested", ing: "testing", object: "the water samples", continuingMarker: "for the last two hours", laterPastClause: "the supervisor arrived", interruptionClause: "the alarm sounded", modifier: "in the lab" },
  { id: "ONGO-TEC", domain: "technology", subject: "the technician", participle: "updated", ing: "updating", object: "the office computers", continuingMarker: "since noon", laterPastClause: "the manager returned", interruptionClause: "the network failed", modifier: "on the second floor" },
  { id: "ONGO-HEA", domain: "healthcare", subject: "the nurse", participle: "monitored", ing: "monitoring", object: "the patient's condition", continuingMarker: "for the last three hours", laterPastClause: "the doctor arrived", interruptionClause: "the patient called for help", modifier: "in the ward" },
  { id: "ONGO-AGR", domain: "agriculture", subject: "the farmer", participle: "repaired", ing: "repairing", object: "the water pump", continuingMarker: "since sunrise", laterPastClause: "the helper arrived", interruptionClause: "the rain started", modifier: "near the field" },
  { id: "ONGO-MED", domain: "media", subject: "the editor", participle: "reviewed", ing: "reviewing", object: "the final pages", continuingMarker: "since 10 a.m.", laterPastClause: "the printer called", interruptionClause: "the phone rang", modifier: "at the desk" },
  { id: "ONGO-INF", domain: "infrastructure", subject: "the engineer", participle: "checked", ing: "checking", object: "the damaged section", continuingMarker: "for the last two hours", laterPastClause: "the repair team arrived", interruptionClause: "the rain began", modifier: "near the bridge" },
  { id: "ONGO-BNK", domain: "banking", subject: "the clerk", participle: "checked", ing: "checking", object: "the account records", continuingMarker: "since the office opened", laterPastClause: "the customer returned", interruptionClause: "the system stopped", modifier: "at the service desk" },
  { id: "ONGO-MFG", domain: "manufacturing", subject: "the worker", participle: "packed", ing: "packing", object: "the finished boxes", continuingMarker: "since 8 a.m.", laterPastClause: "the truck arrived", interruptionClause: "the machine stopped", modifier: "near the loading area" },
  { id: "ONGO-ENE", domain: "energy", subject: "the operator", participle: "monitored", ing: "monitoring", object: "the power readings", continuingMarker: "for the last four hours", laterPastClause: "the next operator arrived", interruptionClause: "the warning light came on", modifier: "in the control room" },
  { id: "ONGO-PST", domain: "postal", subject: "the postal worker", participle: "sorted", ing: "sorting", object: "the morning parcels", continuingMarker: "since 7 a.m.", laterPastClause: "the delivery van arrived", interruptionClause: "the supervisor called", modifier: "inside the sorting room" },
] as const;

export const STATIVE_TENSE_SCENES_V1: readonly StativeTenseSceneV1[] = [
  { id: "STATE-EDU", domain: "education", subject: "the student", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the answer", durationMarker: "for several years", modifier: "from regular practice" },
  { id: "STATE-COM", domain: "commerce", subject: "the shopkeeper", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the small shop", durationMarker: "since 2018", modifier: "near the market" },
  { id: "STATE-PUB", domain: "public-service", subject: "the officer", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the procedure", durationMarker: "for many years", modifier: "from daily work" },
  { id: "STATE-TEC", domain: "technology", subject: "the technician", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the system settings", durationMarker: "since the first setup", modifier: "from earlier training" },
  { id: "STATE-HOS", domain: "hospitality", subject: "the manager", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the guest house", durationMarker: "for ten years", modifier: "with the family" },
  { id: "STATE-HEA", domain: "healthcare", subject: "the nurse", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the ward routine", durationMarker: "since joining the hospital", modifier: "from long experience" },
  { id: "STATE-AGR", domain: "agriculture", subject: "the farmer", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the tractor", durationMarker: "since 2020", modifier: "for farm work" },
  { id: "STATE-MED", domain: "media", subject: "the reporter", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the local area", durationMarker: "for many years", modifier: "through field work" },
  { id: "STATE-BNK", domain: "banking", subject: "the clerk", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the payment process", durationMarker: "since joining the branch", modifier: "from regular work" },
  { id: "STATE-PST", domain: "postal", subject: "the postal worker", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the delivery route", durationMarker: "for six years", modifier: "from daily rounds" },
  { id: "STATE-CUL", domain: "culture", subject: "the guide", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the display history", durationMarker: "for a long time", modifier: "from regular tours" },
  { id: "STATE-EMS", domain: "emergency-service", subject: "the control-room assistant", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the call procedure", durationMarker: "since joining the service", modifier: "from daily practice" },
] as const;

export const CP002_TENSE_DOMAINS_V1 = [...new Set(DYNAMIC_TENSE_SCENES_V1.map((scene) => scene.domain))] as readonly TenseDomainV1[];
