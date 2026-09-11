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
  habitMarker: "every morning" | "every day" | "each week" | "regularly";
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
  { id: "EDU-01", domain: "education", subject: "the teacher", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the attendance list", context: "in the classroom", habitMarker: "every morning" },
  { id: "EDU-02", domain: "education", subject: "the librarian", base: "sort", present3sg: "sorts", past: "sorted", participle: "sorted", ing: "sorting", object: "the returned books", context: "in the library", habitMarker: "every day" },
  { id: "TRN-01", domain: "transport", subject: "the driver", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the bus brakes", context: "at the depot", habitMarker: "every morning" },
  { id: "TRN-02", domain: "transport", subject: "the conductor", base: "count", present3sg: "counts", past: "counted", participle: "counted", ing: "counting", object: "the ticket slips", context: "on the bus", habitMarker: "every day" },
  { id: "COM-01", domain: "commerce", subject: "the clerk", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the payments", context: "at the counter", habitMarker: "every day" },
  { id: "COM-02", domain: "commerce", subject: "the cashier", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the receipts", context: "at the shop", habitMarker: "regularly" },
  { id: "SCI-01", domain: "science", subject: "the assistant", base: "test", present3sg: "tests", past: "tested", participle: "tested", ing: "testing", object: "the sample", context: "in the lab", habitMarker: "every day" },
  { id: "SCI-02", domain: "science", subject: "the researcher", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the readings", context: "at the workbench", habitMarker: "regularly" },
  { id: "SPT-01", domain: "sports", subject: "the coach", base: "review", present3sg: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the practice notes", context: "at the ground", habitMarker: "every day" },
  { id: "SPT-02", domain: "sports", subject: "the trainer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the sports equipment", context: "in the training room", habitMarker: "each week" },
  { id: "PUB-01", domain: "public-service", subject: "the officer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the application forms", context: "at the service desk", habitMarker: "every day" },
  { id: "PUB-02", domain: "public-service", subject: "the assistant", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the public requests", context: "in the office", habitMarker: "regularly" },
  { id: "TEC-01", domain: "technology", subject: "the technician", base: "update", present3sg: "updates", past: "updated", participle: "updated", ing: "updating", object: "the office software", context: "in the computer room", habitMarker: "each week" },
  { id: "TEC-02", domain: "technology", subject: "the support worker", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the office devices", context: "at the support desk", habitMarker: "every day" },
  { id: "ENV-01", domain: "environment", subject: "the worker", base: "measure", present3sg: "measures", past: "measured", participle: "measured", ing: "measuring", object: "the water level", context: "at the tank", habitMarker: "every morning" },
  { id: "ENV-02", domain: "environment", subject: "the ranger", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the trail signs", context: "in the park", habitMarker: "each week" },
  { id: "HOS-01", domain: "hospitality", subject: "the receptionist", base: "confirm", present3sg: "confirms", past: "confirmed", participle: "confirmed", ing: "confirming", object: "the room bookings", context: "at the front desk", habitMarker: "every morning" },
  { id: "HOS-02", domain: "hospitality", subject: "the manager", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the room list", context: "in the hotel office", habitMarker: "every day" },
  { id: "HEA-01", domain: "healthcare", subject: "the nurse", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the patient's temperature", context: "in the ward", habitMarker: "regularly" },
  { id: "HEA-02", domain: "healthcare", subject: "the assistant", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the medicine stock", context: "in the clinic", habitMarker: "every day" },
  { id: "AGR-01", domain: "agriculture", subject: "the farmer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the water pump", context: "in the field", habitMarker: "every morning" },
  { id: "AGR-02", domain: "agriculture", subject: "the field worker", base: "measure", present3sg: "measures", past: "measured", participle: "measured", ing: "measuring", object: "the seed bags", context: "at the store shed", habitMarker: "regularly" },
  { id: "MED-01", domain: "media", subject: "the editor", base: "review", present3sg: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the headlines", context: "at the news desk", habitMarker: "every day" },
  { id: "MED-02", domain: "media", subject: "the reporter", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the interview notes", context: "in the newsroom", habitMarker: "regularly" },
  { id: "HOM-01", domain: "household", subject: "the caretaker", base: "lock", present3sg: "locks", past: "locked", participle: "locked", ing: "locking", object: "the main gate", context: "at the house", habitMarker: "every day" },
  { id: "HOM-02", domain: "household", subject: "the helper", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the water tank", context: "on the roof", habitMarker: "every morning" },
  { id: "INF-01", domain: "infrastructure", subject: "the engineer", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the road surface", context: "at the work site", habitMarker: "regularly" },
  { id: "INF-02", domain: "infrastructure", subject: "the inspector", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the bridge readings", context: "near the bridge", habitMarker: "each week" },
  { id: "BNK-01", domain: "banking", subject: "the bank clerk", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the signatures", context: "at the bank counter", habitMarker: "every day" },
  { id: "BNK-02", domain: "banking", subject: "the cashier", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the deposits", context: "at the branch", habitMarker: "regularly" },
  { id: "MFG-01", domain: "manufacturing", subject: "the worker", base: "pack", present3sg: "packs", past: "packed", participle: "packed", ing: "packing", object: "the finished boxes", context: "in the packing area", habitMarker: "every day" },
  { id: "MFG-02", domain: "manufacturing", subject: "the supervisor", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the machine log", context: "on the factory floor", habitMarker: "regularly" },
  { id: "ENE-01", domain: "energy", subject: "the operator", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the meter readings", context: "in the control room", habitMarker: "every day" },
  { id: "ENE-02", domain: "energy", subject: "the technician", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the control panel", context: "at the power station", habitMarker: "regularly" },
  { id: "PST-01", domain: "postal", subject: "the postal worker", base: "sort", present3sg: "sorts", past: "sorted", participle: "sorted", ing: "sorting", object: "the parcels", context: "in the sorting room", habitMarker: "every morning" },
  { id: "PST-02", domain: "postal", subject: "the clerk", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the dispatch bags", context: "at the post office", habitMarker: "every day" },
  { id: "CUL-01", domain: "culture", subject: "the guide", base: "open", present3sg: "opens", past: "opened", participle: "opened", ing: "opening", object: "the display room", context: "at the museum", habitMarker: "every morning" },
  { id: "CUL-02", domain: "culture", subject: "the assistant", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the visitor register", context: "at the gallery", habitMarker: "every day" },
  { id: "EMS-01", domain: "emergency-service", subject: "the control-room assistant", base: "record", present3sg: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the emergency calls", context: "in the control room", habitMarker: "regularly" },
  { id: "EMS-02", domain: "emergency-service", subject: "the responder", base: "check", present3sg: "checks", past: "checked", participle: "checked", ing: "checking", object: "the safety equipment", context: "at the station", habitMarker: "every morning" },
] as const;

export const ONGOING_TENSE_SCENES_V1: readonly OngoingTenseSceneV1[] = [
  { id: "ONGO-EDU", domain: "education", subject: "the teacher", participle: "reviewed", ing: "reviewing", object: "the answer sheets", continuingMarker: "since 9 a.m.", laterPastClause: "the principal arrived", interruptionClause: "the bell rang", modifier: "in the staff room" },
  { id: "ONGO-TRN", domain: "transport", subject: "the mechanic", participle: "repaired", ing: "repairing", object: "the bus engine", continuingMarker: "since early morning", laterPastClause: "the driver returned", interruptionClause: "the power went out", modifier: "in the workshop" },
  { id: "ONGO-COM", domain: "commerce", subject: "the clerk", participle: "checked", ing: "checking", object: "the sales records", continuingMarker: "since the shop opened", laterPastClause: "the manager arrived", interruptionClause: "a customer called", modifier: "at the counter" },
  { id: "ONGO-SCI", domain: "science", subject: "the assistant", participle: "tested", ing: "testing", object: "the water samples", continuingMarker: "for the last two hours", laterPastClause: "the supervisor arrived", interruptionClause: "the alarm sounded", modifier: "in the lab" },
  { id: "ONGO-SPT", domain: "sports", subject: "the coach", participle: "reviewed", ing: "reviewing", object: "the training notes", continuingMarker: "since 8 a.m.", laterPastClause: "the players arrived", interruptionClause: "the whistle sounded", modifier: "beside the ground" },
  { id: "ONGO-PUB", domain: "public-service", subject: "the officer", participle: "checked", ing: "checking", object: "the application forms", continuingMarker: "since the office opened", laterPastClause: "the supervisor arrived", interruptionClause: "the phone rang", modifier: "at the service desk" },
  { id: "ONGO-TEC", domain: "technology", subject: "the technician", participle: "updated", ing: "updating", object: "the office computers", continuingMarker: "since noon", laterPastClause: "the manager returned", interruptionClause: "the network failed", modifier: "on the second floor" },
  { id: "ONGO-ENV", domain: "environment", subject: "the ranger", participle: "checked", ing: "checking", object: "the trail signs", continuingMarker: "since sunrise", laterPastClause: "the survey team arrived", interruptionClause: "the rain started", modifier: "inside the park" },
  { id: "ONGO-HOS", domain: "hospitality", subject: "the receptionist", participle: "confirmed", ing: "confirming", object: "the room bookings", continuingMarker: "since 7 a.m.", laterPastClause: "the manager arrived", interruptionClause: "the phone rang", modifier: "at the front desk" },
  { id: "ONGO-HEA", domain: "healthcare", subject: "the nurse", participle: "monitored", ing: "monitoring", object: "the patient's condition", continuingMarker: "for the last three hours", laterPastClause: "the doctor arrived", interruptionClause: "the patient called for help", modifier: "in the ward" },
  { id: "ONGO-AGR", domain: "agriculture", subject: "the farmer", participle: "repaired", ing: "repairing", object: "the water pump", continuingMarker: "since sunrise", laterPastClause: "the helper arrived", interruptionClause: "the rain started", modifier: "near the field" },
  { id: "ONGO-MED", domain: "media", subject: "the editor", participle: "reviewed", ing: "reviewing", object: "the final pages", continuingMarker: "since 10 a.m.", laterPastClause: "the printer called", interruptionClause: "the phone rang", modifier: "at the news desk" },
  { id: "ONGO-HOM", domain: "household", subject: "the caretaker", participle: "repaired", ing: "repairing", object: "the garden gate", continuingMarker: "since early morning", laterPastClause: "the owner returned", interruptionClause: "the rain began", modifier: "outside the house" },
  { id: "ONGO-INF", domain: "infrastructure", subject: "the engineer", participle: "checked", ing: "checking", object: "the damaged section", continuingMarker: "for the last two hours", laterPastClause: "the repair team arrived", interruptionClause: "the rain began", modifier: "near the bridge" },
  { id: "ONGO-BNK", domain: "banking", subject: "the clerk", participle: "checked", ing: "checking", object: "the account records", continuingMarker: "since the office opened", laterPastClause: "the customer returned", interruptionClause: "the system stopped", modifier: "at the service desk" },
  { id: "ONGO-MFG", domain: "manufacturing", subject: "the worker", participle: "packed", ing: "packing", object: "the finished boxes", continuingMarker: "since 8 a.m.", laterPastClause: "the truck arrived", interruptionClause: "the machine stopped", modifier: "near the loading area" },
  { id: "ONGO-ENE", domain: "energy", subject: "the operator", participle: "monitored", ing: "monitoring", object: "the power readings", continuingMarker: "for the last four hours", laterPastClause: "the next operator arrived", interruptionClause: "the warning light came on", modifier: "in the control room" },
  { id: "ONGO-PST", domain: "postal", subject: "the postal worker", participle: "sorted", ing: "sorting", object: "the morning parcels", continuingMarker: "since 7 a.m.", laterPastClause: "the delivery van arrived", interruptionClause: "the supervisor called", modifier: "inside the sorting room" },
  { id: "ONGO-CUL", domain: "culture", subject: "the guide", participle: "prepared", ing: "preparing", object: "the display room", continuingMarker: "since 9 a.m.", laterPastClause: "the visitors arrived", interruptionClause: "the curator called", modifier: "inside the museum" },
  { id: "ONGO-EMS", domain: "emergency-service", subject: "the responder", participle: "checked", ing: "checking", object: "the safety equipment", continuingMarker: "since the shift began", laterPastClause: "the team leader arrived", interruptionClause: "an emergency call came in", modifier: "at the station" },
] as const;

export const STATIVE_TENSE_SCENES_V1: readonly StativeTenseSceneV1[] = [
  { id: "STATE-EDU", domain: "education", subject: "the student", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the answer", durationMarker: "for several years", modifier: "from regular practice" },
  { id: "STATE-TRN", domain: "transport", subject: "the driver", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the city routes", durationMarker: "for six years", modifier: "from daily trips" },
  { id: "STATE-COM", domain: "commerce", subject: "the shopkeeper", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the small shop", durationMarker: "since 2018", modifier: "near the market" },
  { id: "STATE-SCI", domain: "science", subject: "the researcher", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the testing method", durationMarker: "for several years", modifier: "from regular lab work" },
  { id: "STATE-SPT", domain: "sports", subject: "the coach", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the training plan", durationMarker: "since last season", modifier: "from daily practice" },
  { id: "STATE-PUB", domain: "public-service", subject: "the officer", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the procedure", durationMarker: "for many years", modifier: "from daily work" },
  { id: "STATE-TEC", domain: "technology", subject: "the technician", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the system settings", durationMarker: "since the first setup", modifier: "from earlier training" },
  { id: "STATE-ENV", domain: "environment", subject: "the ranger", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the park trails", durationMarker: "for eight years", modifier: "from regular patrols" },
  { id: "STATE-HOS", domain: "hospitality", subject: "the manager", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the guest house", durationMarker: "for ten years", modifier: "with the family" },
  { id: "STATE-HEA", domain: "healthcare", subject: "the nurse", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the ward routine", durationMarker: "since joining the hospital", modifier: "from long experience" },
  { id: "STATE-AGR", domain: "agriculture", subject: "the farmer", base: "own", present3sg: "owns", participle: "owned", ing: "owning", object: "the tractor", durationMarker: "since 2020", modifier: "for farm work" },
  { id: "STATE-MED", domain: "media", subject: "the reporter", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the local area", durationMarker: "for many years", modifier: "through field work" },
  { id: "STATE-HOM", domain: "household", subject: "the caretaker", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the house routine", durationMarker: "for five years", modifier: "from daily work" },
  { id: "STATE-INF", domain: "infrastructure", subject: "the engineer", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the bridge design", durationMarker: "for several years", modifier: "from project work" },
  { id: "STATE-BNK", domain: "banking", subject: "the clerk", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the payment process", durationMarker: "since joining the branch", modifier: "from regular work" },
  { id: "STATE-MFG", domain: "manufacturing", subject: "the supervisor", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the machine settings", durationMarker: "for four years", modifier: "from factory work" },
  { id: "STATE-ENE", domain: "energy", subject: "the operator", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the control system", durationMarker: "since joining the station", modifier: "from shift work" },
  { id: "STATE-PST", domain: "postal", subject: "the postal worker", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the delivery route", durationMarker: "for six years", modifier: "from daily rounds" },
  { id: "STATE-CUL", domain: "culture", subject: "the guide", base: "know", present3sg: "knows", participle: "known", ing: "knowing", object: "the display history", durationMarker: "for a long time", modifier: "from regular tours" },
  { id: "STATE-EMS", domain: "emergency-service", subject: "the control-room assistant", base: "understand", present3sg: "understands", participle: "understood", ing: "understanding", object: "the call procedure", durationMarker: "since joining the service", modifier: "from daily practice" },
] as const;

export const CP002_TENSE_DOMAINS_V1 = [...new Set(DYNAMIC_TENSE_SCENES_V1.map((scene) => scene.domain))] as readonly TenseDomainV1[];
