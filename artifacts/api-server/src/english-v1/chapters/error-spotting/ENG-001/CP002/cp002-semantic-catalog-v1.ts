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

type DynamicRow = readonly [
  subject: string,
  base: string,
  present3sg: string,
  past: string,
  participle: string,
  ing: string,
  object: string,
  context: string,
  habitMarker: DynamicTenseSceneV1["habitMarker"],
];

type OngoingRow = readonly [
  subject: string,
  participle: string,
  ing: string,
  object: string,
  continuingMarker: string,
  laterPastClause: string,
  interruptionClause: string,
  modifier: string,
];

type StativeRow = readonly [
  subject: string,
  base: string,
  present3sg: string,
  participle: string,
  ing: string,
  object: string,
  durationMarker: string,
  modifier: string,
];

function dynamicScenes(domain: TenseDomainV1, prefix: string, rows: readonly DynamicRow[]): DynamicTenseSceneV1[] {
  return rows.map((row, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    domain,
    subject: row[0],
    base: row[1],
    present3sg: row[2],
    past: row[3],
    participle: row[4],
    ing: row[5],
    object: row[6],
    context: row[7],
    habitMarker: row[8],
  }));
}

function ongoingScenes(domain: TenseDomainV1, prefix: string, rows: readonly OngoingRow[]): OngoingTenseSceneV1[] {
  return rows.map((row, index) => ({
    id: `ONGO-${prefix}-${String(index + 1).padStart(2, "0")}`,
    domain,
    subject: row[0],
    participle: row[1],
    ing: row[2],
    object: row[3],
    continuingMarker: row[4],
    laterPastClause: row[5],
    interruptionClause: row[6],
    modifier: row[7],
  }));
}

function stativeScenes(domain: TenseDomainV1, prefix: string, rows: readonly StativeRow[]): StativeTenseSceneV1[] {
  return rows.map((row, index) => ({
    id: `STATE-${prefix}-${String(index + 1).padStart(2, "0")}`,
    domain,
    subject: row[0],
    base: row[1],
    present3sg: row[2],
    participle: row[3],
    ing: row[4],
    object: row[5],
    durationMarker: row[6],
    modifier: row[7],
  }));
}

export const DYNAMIC_TENSE_SCENES_V1: readonly DynamicTenseSceneV1[] = [
  ...dynamicScenes("education", "EDU", [
    ["the teacher", "check", "checks", "checked", "checked", "checking", "the attendance list", "in the classroom", "every morning"],
    ["the librarian", "sort", "sorts", "sorted", "sorted", "sorting", "the returned books", "in the library", "every day"],
    ["the examiner", "count", "counts", "counted", "counted", "counting", "the answer books", "in the exam room", "every day"],
    ["the principal", "review", "reviews", "reviewed", "reviewed", "reviewing", "the timetable", "in the school office", "each week"],
  ]),
  ...dynamicScenes("transport", "TRN", [
    ["the driver", "check", "checks", "checked", "checked", "checking", "the bus brakes", "at the depot", "every morning"],
    ["the conductor", "count", "counts", "counted", "counted", "counting", "the ticket slips", "on the bus", "every day"],
    ["the dispatcher", "record", "records", "recorded", "recorded", "recording", "the departures", "at the control desk", "every day"],
    ["the station assistant", "check", "checks", "checked", "checked", "checking", "the platform signs", "at the station", "regularly"],
  ]),
  ...dynamicScenes("commerce", "COM", [
    ["the clerk", "record", "records", "recorded", "recorded", "recording", "the payments", "at the counter", "every day"],
    ["the cashier", "check", "checks", "checked", "checked", "checking", "the receipts", "at the shop", "regularly"],
    ["the stock clerk", "count", "counts", "counted", "counted", "counting", "the cartons", "in the store room", "each week"],
    ["the shop assistant", "label", "labels", "labelled", "labelled", "labelling", "the shelves", "inside the shop", "regularly"],
  ]),
  ...dynamicScenes("science", "SCI", [
    ["the assistant", "test", "tests", "tested", "tested", "testing", "the sample", "in the lab", "every day"],
    ["the researcher", "record", "records", "recorded", "recorded", "recording", "the readings", "at the workbench", "regularly"],
    ["the lab worker", "record", "records", "recorded", "recorded", "recording", "the temperatures", "in the lab", "every day"],
    ["the field assistant", "collect", "collects", "collected", "collected", "collecting", "the soil samples", "at the field site", "each week"],
  ]),
  ...dynamicScenes("sports", "SPT", [
    ["the coach", "review", "reviews", "reviewed", "reviewed", "reviewing", "the practice notes", "at the ground", "every day"],
    ["the trainer", "check", "checks", "checked", "checked", "checking", "the sports equipment", "in the training room", "each week"],
    ["the referee", "check", "checks", "checked", "checked", "checking", "the player list", "near the field", "every day"],
    ["the groundskeeper", "mark", "marks", "marked", "marked", "marking", "the field lines", "at the ground", "regularly"],
  ]),
  ...dynamicScenes("public-service", "PUB", [
    ["the officer", "check", "checks", "checked", "checked", "checking", "the application forms", "at the service desk", "every day"],
    ["the assistant", "record", "records", "recorded", "recorded", "recording", "the public requests", "in the office", "regularly"],
    ["the desk clerk", "sort", "sorts", "sorted", "sorted", "sorting", "the certificates", "at the public counter", "every day"],
    ["the field officer", "record", "records", "recorded", "recorded", "recording", "the complaints", "at the field office", "each week"],
  ]),
  ...dynamicScenes("technology", "TEC", [
    ["the technician", "update", "updates", "updated", "updated", "updating", "the office software", "in the computer room", "each week"],
    ["the support worker", "check", "checks", "checked", "checked", "checking", "the office devices", "at the support desk", "every day"],
    ["the operator", "check", "checks", "checked", "checked", "checking", "the backup files", "in the server room", "regularly"],
    ["the technician", "test", "tests", "tested", "tested", "testing", "the network cable", "at the support desk", "every day"],
  ]),
  ...dynamicScenes("environment", "ENV", [
    ["the worker", "measure", "measures", "measured", "measured", "measuring", "the water level", "at the tank", "every morning"],
    ["the ranger", "check", "checks", "checked", "checked", "checking", "the trail signs", "in the park", "each week"],
    ["the volunteer", "collect", "collects", "collected", "collected", "collecting", "the litter bags", "near the park gate", "regularly"],
    ["the park worker", "check", "checks", "checked", "checked", "checking", "the waste bins", "inside the park", "every day"],
  ]),
  ...dynamicScenes("hospitality", "HOS", [
    ["the receptionist", "confirm", "confirms", "confirmed", "confirmed", "confirming", "the room bookings", "at the front desk", "every morning"],
    ["the manager", "check", "checks", "checked", "checked", "checking", "the room list", "in the hotel office", "every day"],
    ["the kitchen manager", "check", "checks", "checked", "checked", "checking", "the supply list", "in the kitchen office", "every day"],
    ["the attendant", "prepare", "prepares", "prepared", "prepared", "preparing", "the guest rooms", "inside the hotel", "regularly"],
  ]),
  ...dynamicScenes("healthcare", "HEA", [
    ["the nurse", "record", "records", "recorded", "recorded", "recording", "the patient's temperature", "in the ward", "regularly"],
    ["the assistant", "check", "checks", "checked", "checked", "checking", "the medicine stock", "in the clinic", "every day"],
    ["the clinic clerk", "record", "records", "recorded", "recorded", "recording", "the appointments", "at the clinic desk", "every day"],
    ["the pharmacist", "check", "checks", "checked", "checked", "checking", "the medicine labels", "at the pharmacy counter", "regularly"],
  ]),
  ...dynamicScenes("agriculture", "AGR", [
    ["the farmer", "check", "checks", "checked", "checked", "checking", "the water pump", "in the field", "every morning"],
    ["the field worker", "measure", "measures", "measured", "measured", "measuring", "the seed bags", "at the store shed", "regularly"],
    ["the farm worker", "count", "counts", "counted", "counted", "counting", "the seed packets", "inside the store shed", "every day"],
    ["the supervisor", "record", "records", "recorded", "recorded", "recording", "the crop weights", "at the collection point", "each week"],
  ]),
  ...dynamicScenes("media", "MED", [
    ["the editor", "review", "reviews", "reviewed", "reviewed", "reviewing", "the headlines", "at the news desk", "every day"],
    ["the reporter", "check", "checks", "checked", "checked", "checking", "the interview notes", "in the newsroom", "regularly"],
    ["the copy editor", "check", "checks", "checked", "checked", "checking", "the photo captions", "at the editing desk", "every day"],
    ["the camera operator", "record", "records", "recorded", "recorded", "recording", "the interviews", "in the studio", "regularly"],
  ]),
  ...dynamicScenes("household", "HOM", [
    ["the caretaker", "lock", "locks", "locked", "locked", "locking", "the main gate", "at the house", "every day"],
    ["the helper", "check", "checks", "checked", "checked", "checking", "the water tank", "on the roof", "every morning"],
    ["the resident", "check", "checks", "checked", "checked", "checking", "the door locks", "inside the house", "every day"],
    ["the gardener", "water", "waters", "watered", "watered", "watering", "the plants", "in the garden", "every morning"],
  ]),
  ...dynamicScenes("infrastructure", "INF", [
    ["the engineer", "check", "checks", "checked", "checked", "checking", "the road surface", "at the work site", "regularly"],
    ["the inspector", "record", "records", "recorded", "recorded", "recording", "the bridge readings", "near the bridge", "each week"],
    ["the surveyor", "measure", "measures", "measured", "measured", "measuring", "the road width", "at the survey site", "regularly"],
    ["the site worker", "check", "checks", "checked", "checked", "checking", "the safety signs", "at the work site", "every day"],
  ]),
  ...dynamicScenes("banking", "BNK", [
    ["the bank clerk", "check", "checks", "checked", "checked", "checking", "the signatures", "at the bank counter", "every day"],
    ["the cashier", "record", "records", "recorded", "recorded", "recording", "the deposits", "at the branch", "regularly"],
    ["the bank officer", "review", "reviews", "reviewed", "reviewed", "reviewing", "the loan forms", "in the branch office", "every day"],
    ["the counter clerk", "count", "counts", "counted", "counted", "counting", "the cash notes", "at the counter", "regularly"],
  ]),
  ...dynamicScenes("manufacturing", "MFG", [
    ["the worker", "pack", "packs", "packed", "packed", "packing", "the finished boxes", "in the packing area", "every day"],
    ["the supervisor", "check", "checks", "checked", "checked", "checking", "the machine log", "on the factory floor", "regularly"],
    ["the inspector", "check", "checks", "checked", "checked", "checking", "the packed boxes", "near the loading area", "every day"],
    ["the operator", "record", "records", "recorded", "recorded", "recording", "the machine output", "at the control desk", "regularly"],
  ]),
  ...dynamicScenes("energy", "ENE", [
    ["the operator", "record", "records", "recorded", "recorded", "recording", "the meter readings", "in the control room", "every day"],
    ["the technician", "check", "checks", "checked", "checked", "checking", "the control panel", "at the power station", "regularly"],
    ["the line worker", "check", "checks", "checked", "checked", "checking", "the cable joints", "at the service yard", "each week"],
    ["the engineer", "record", "records", "recorded", "recorded", "recording", "the power use", "in the station office", "every day"],
  ]),
  ...dynamicScenes("postal", "PST", [
    ["the postal worker", "sort", "sorts", "sorted", "sorted", "sorting", "the parcels", "in the sorting room", "every morning"],
    ["the clerk", "record", "records", "recorded", "recorded", "recording", "the dispatch bags", "at the post office", "every day"],
    ["the mail clerk", "sort", "sorts", "sorted", "sorted", "sorting", "the letters", "at the sorting table", "every morning"],
    ["the delivery worker", "check", "checks", "checked", "checked", "checking", "the address labels", "at the post office", "every day"],
  ]),
  ...dynamicScenes("culture", "CUL", [
    ["the guide", "open", "opens", "opened", "opened", "opening", "the display room", "at the museum", "every morning"],
    ["the assistant", "check", "checks", "checked", "checked", "checking", "the visitor register", "at the gallery", "every day"],
    ["the museum worker", "check", "checks", "checked", "checked", "checking", "the entry passes", "at the museum gate", "every day"],
    ["the stage manager", "review", "reviews", "reviewed", "reviewed", "reviewing", "the programme list", "at the hall", "regularly"],
  ]),
  ...dynamicScenes("emergency-service", "EMS", [
    ["the control-room assistant", "record", "records", "recorded", "recorded", "recording", "the emergency calls", "in the control room", "regularly"],
    ["the responder", "check", "checks", "checked", "checked", "checking", "the safety equipment", "at the station", "every morning"],
    ["the dispatcher", "record", "records", "recorded", "recorded", "recording", "the vehicle movements", "at the control desk", "every day"],
    ["the station officer", "check", "checks", "checked", "checked", "checking", "the first-aid boxes", "at the station", "each week"],
  ]),
] as const;

export const ONGOING_TENSE_SCENES_V1: readonly OngoingTenseSceneV1[] = [
  ...ongoingScenes("education", "EDU", [
    ["the teacher", "reviewed", "reviewing", "the answer sheets", "since 9 a.m.", "the principal arrived", "the bell rang", "in the staff room"],
    ["the librarian", "sorted", "sorting", "the returned books", "for the last two hours", "the head teacher arrived", "a student called for help", "inside the library"],
  ]),
  ...ongoingScenes("transport", "TRN", [
    ["the mechanic", "repaired", "repairing", "the bus engine", "since early morning", "the driver returned", "the power went out", "in the workshop"],
    ["the dispatcher", "recorded", "recording", "the departures", "since 8 a.m.", "the supervisor arrived", "the radio stopped working", "at the control desk"],
  ]),
  ...ongoingScenes("commerce", "COM", [
    ["the clerk", "checked", "checking", "the sales records", "since the shop opened", "the manager arrived", "a customer called", "at the counter"],
    ["the stock clerk", "counted", "counting", "the cartons", "for the last three hours", "the delivery van arrived", "the manager called", "in the store room"],
  ]),
  ...ongoingScenes("science", "SCI", [
    ["the assistant", "tested", "testing", "the water samples", "for the last two hours", "the supervisor arrived", "the alarm sounded", "in the lab"],
    ["the researcher", "recorded", "recording", "the readings", "since 10 a.m.", "the lab head arrived", "the power failed", "at the workbench"],
  ]),
  ...ongoingScenes("sports", "SPT", [
    ["the coach", "reviewed", "reviewing", "the training notes", "since 8 a.m.", "the players arrived", "the whistle sounded", "beside the ground"],
    ["the trainer", "checked", "checking", "the sports equipment", "for the last two hours", "the coach returned", "a player called", "in the training room"],
  ]),
  ...ongoingScenes("public-service", "PUB", [
    ["the officer", "checked", "checking", "the application forms", "since the office opened", "the supervisor arrived", "the phone rang", "at the service desk"],
    ["the desk clerk", "sorted", "sorting", "the certificates", "since 9 a.m.", "the officer returned", "a visitor called", "at the public counter"],
  ]),
  ...ongoingScenes("technology", "TEC", [
    ["the technician", "updated", "updating", "the office computers", "since noon", "the manager returned", "the network failed", "on the second floor"],
    ["the support worker", "checked", "checking", "the office devices", "for the last three hours", "the technician arrived", "the system stopped", "at the support desk"],
  ]),
  ...ongoingScenes("environment", "ENV", [
    ["the ranger", "checked", "checking", "the trail signs", "since sunrise", "the survey team arrived", "the rain started", "inside the park"],
    ["the park worker", "checked", "checking", "the waste bins", "for the last two hours", "the supervisor arrived", "the rain began", "near the park gate"],
  ]),
  ...ongoingScenes("hospitality", "HOS", [
    ["the receptionist", "confirmed", "confirming", "the room bookings", "since 7 a.m.", "the manager arrived", "the phone rang", "at the front desk"],
    ["the attendant", "prepared", "preparing", "the guest rooms", "for the last three hours", "the guests arrived", "the manager called", "inside the hotel"],
  ]),
  ...ongoingScenes("healthcare", "HEA", [
    ["the nurse", "monitored", "monitoring", "the patient's condition", "for the last three hours", "the doctor arrived", "the patient called for help", "in the ward"],
    ["the clinic clerk", "recorded", "recording", "the appointments", "since 8 a.m.", "the doctor arrived", "the phone rang", "at the clinic desk"],
  ]),
  ...ongoingScenes("agriculture", "AGR", [
    ["the farmer", "repaired", "repairing", "the water pump", "since sunrise", "the helper arrived", "the rain started", "near the field"],
    ["the farm worker", "counted", "counting", "the seed packets", "for the last two hours", "the supervisor arrived", "the truck arrived", "inside the store shed"],
  ]),
  ...ongoingScenes("media", "MED", [
    ["the editor", "reviewed", "reviewing", "the final pages", "since 10 a.m.", "the printer called", "the phone rang", "at the news desk"],
    ["the reporter", "checked", "checking", "the interview notes", "for the last two hours", "the editor arrived", "a source called", "in the newsroom"],
  ]),
  ...ongoingScenes("household", "HOM", [
    ["the caretaker", "repaired", "repairing", "the garden gate", "since early morning", "the owner returned", "the rain began", "outside the house"],
    ["the gardener", "watered", "watering", "the plants", "since sunrise", "the resident returned", "the rain started", "in the garden"],
  ]),
  ...ongoingScenes("infrastructure", "INF", [
    ["the engineer", "checked", "checking", "the damaged section", "for the last two hours", "the repair team arrived", "the rain began", "near the bridge"],
    ["the surveyor", "measured", "measuring", "the road width", "since 9 a.m.", "the site manager arrived", "the traffic stopped", "at the survey site"],
  ]),
  ...ongoingScenes("banking", "BNK", [
    ["the clerk", "checked", "checking", "the account records", "since the office opened", "the customer returned", "the system stopped", "at the service desk"],
    ["the bank officer", "reviewed", "reviewing", "the loan forms", "for the last three hours", "the manager arrived", "the customer called", "in the branch office"],
  ]),
  ...ongoingScenes("manufacturing", "MFG", [
    ["the worker", "packed", "packing", "the finished boxes", "since 8 a.m.", "the truck arrived", "the machine stopped", "near the loading area"],
    ["the operator", "recorded", "recording", "the machine output", "for the last two hours", "the supervisor arrived", "the warning light came on", "at the control desk"],
  ]),
  ...ongoingScenes("energy", "ENE", [
    ["the operator", "monitored", "monitoring", "the power readings", "for the last four hours", "the next operator arrived", "the warning light came on", "in the control room"],
    ["the technician", "checked", "checking", "the control panel", "since 9 a.m.", "the engineer arrived", "the alarm sounded", "at the power station"],
  ]),
  ...ongoingScenes("postal", "PST", [
    ["the postal worker", "sorted", "sorting", "the morning parcels", "since 7 a.m.", "the delivery van arrived", "the supervisor called", "inside the sorting room"],
    ["the mail clerk", "sorted", "sorting", "the letters", "for the last two hours", "the delivery worker arrived", "the phone rang", "at the sorting table"],
  ]),
  ...ongoingScenes("culture", "CUL", [
    ["the guide", "prepared", "preparing", "the display room", "since 9 a.m.", "the visitors arrived", "the museum manager called", "inside the museum"],
    ["the stage manager", "reviewed", "reviewing", "the programme list", "for the last two hours", "the performers arrived", "the hall manager called", "at the hall"],
  ]),
  ...ongoingScenes("emergency-service", "EMS", [
    ["the responder", "checked", "checking", "the safety equipment", "since the shift began", "the team leader arrived", "an emergency call came in", "at the station"],
    ["the dispatcher", "recorded", "recording", "the vehicle movements", "for the last three hours", "the station officer arrived", "the radio stopped working", "at the control desk"],
  ]),
] as const;

export const STATIVE_TENSE_SCENES_V1: readonly StativeTenseSceneV1[] = [
  ...stativeScenes("education", "EDU", [
    ["the student", "know", "knows", "known", "knowing", "the answer", "for several years", "from regular practice"],
    ["the teacher", "understand", "understands", "understood", "understanding", "the marking rule", "since joining the school", "from daily work"],
  ]),
  ...stativeScenes("transport", "TRN", [
    ["the driver", "know", "knows", "known", "knowing", "the city routes", "for six years", "from daily trips"],
    ["the dispatcher", "understand", "understands", "understood", "understanding", "the bus schedule", "since joining the depot", "from regular work"],
  ]),
  ...stativeScenes("commerce", "COM", [
    ["the shopkeeper", "own", "owns", "owned", "owning", "the small shop", "since 2018", "near the market"],
    ["the clerk", "know", "knows", "known", "knowing", "the price list", "for four years", "from counter work"],
  ]),
  ...stativeScenes("science", "SCI", [
    ["the researcher", "understand", "understands", "understood", "understanding", "the testing method", "for several years", "from regular lab work"],
    ["the assistant", "know", "knows", "known", "knowing", "the safety rules", "since joining the lab", "from daily practice"],
  ]),
  ...stativeScenes("sports", "SPT", [
    ["the coach", "know", "knows", "known", "knowing", "the training plan", "since last season", "from daily practice"],
    ["the trainer", "understand", "understands", "understood", "understanding", "the exercise routine", "for five years", "from regular sessions"],
  ]),
  ...stativeScenes("public-service", "PUB", [
    ["the officer", "understand", "understands", "understood", "understanding", "the procedure", "for many years", "from daily work"],
    ["the desk clerk", "know", "knows", "known", "knowing", "the form requirements", "since joining the office", "from counter work"],
  ]),
  ...stativeScenes("technology", "TEC", [
    ["the technician", "know", "knows", "known", "knowing", "the system settings", "since the first setup", "from earlier training"],
    ["the support worker", "understand", "understands", "understood", "understanding", "the backup process", "for three years", "from regular support work"],
  ]),
  ...stativeScenes("environment", "ENV", [
    ["the ranger", "know", "knows", "known", "knowing", "the park trails", "for eight years", "from regular patrols"],
    ["the park worker", "understand", "understands", "understood", "understanding", "the waste rules", "since joining the park staff", "from daily work"],
  ]),
  ...stativeScenes("hospitality", "HOS", [
    ["the manager", "own", "owns", "owned", "owning", "the guest house", "for ten years", "with the family"],
    ["the receptionist", "know", "knows", "known", "knowing", "the booking process", "since joining the hotel", "from front-desk work"],
  ]),
  ...stativeScenes("healthcare", "HEA", [
    ["the nurse", "understand", "understands", "understood", "understanding", "the ward routine", "since joining the hospital", "from long experience"],
    ["the assistant", "know", "knows", "known", "knowing", "the medicine storage rules", "for four years", "from clinic work"],
  ]),
  ...stativeScenes("agriculture", "AGR", [
    ["the farmer", "own", "owns", "owned", "owning", "the tractor", "since 2020", "for farm work"],
    ["the farm worker", "know", "knows", "known", "knowing", "the planting schedule", "for five years", "from field work"],
  ]),
  ...stativeScenes("media", "MED", [
    ["the reporter", "know", "knows", "known", "knowing", "the local area", "for many years", "through field work"],
    ["the editor", "understand", "understands", "understood", "understanding", "the printing process", "since joining the paper", "from daily work"],
  ]),
  ...stativeScenes("household", "HOM", [
    ["the caretaker", "know", "knows", "known", "knowing", "the house routine", "for five years", "from daily work"],
    ["the resident", "own", "owns", "owned", "owning", "the house", "for twelve years", "near the main road"],
  ]),
  ...stativeScenes("infrastructure", "INF", [
    ["the engineer", "understand", "understands", "understood", "understanding", "the bridge design", "for several years", "from project work"],
    ["the surveyor", "know", "knows", "known", "knowing", "the site layout", "since joining the project", "from field work"],
  ]),
  ...stativeScenes("banking", "BNK", [
    ["the clerk", "understand", "understands", "understood", "understanding", "the payment process", "since joining the branch", "from regular work"],
    ["the bank officer", "know", "knows", "known", "knowing", "the loan rules", "for six years", "from branch work"],
  ]),
  ...stativeScenes("manufacturing", "MFG", [
    ["the supervisor", "know", "knows", "known", "knowing", "the machine settings", "for four years", "from factory work"],
    ["the inspector", "understand", "understands", "understood", "understanding", "the packing rules", "since joining the factory", "from daily checks"],
  ]),
  ...stativeScenes("energy", "ENE", [
    ["the operator", "understand", "understands", "understood", "understanding", "the control system", "since joining the station", "from shift work"],
    ["the technician", "know", "knows", "known", "knowing", "the safety procedure", "for seven years", "from station work"],
  ]),
  ...stativeScenes("postal", "PST", [
    ["the postal worker", "know", "knows", "known", "knowing", "the delivery route", "for six years", "from daily rounds"],
    ["the clerk", "understand", "understands", "understood", "understanding", "the dispatch process", "since joining the post office", "from regular work"],
  ]),
  ...stativeScenes("culture", "CUL", [
    ["the guide", "know", "knows", "known", "knowing", "the display history", "for a long time", "from regular tours"],
    ["the museum worker", "understand", "understands", "understood", "understanding", "the visitor rules", "since joining the museum", "from daily work"],
  ]),
  ...stativeScenes("emergency-service", "EMS", [
    ["the control-room assistant", "understand", "understands", "understood", "understanding", "the call procedure", "since joining the service", "from daily practice"],
    ["the responder", "know", "knows", "known", "knowing", "the station routine", "for five years", "from regular duty"],
  ]),
] as const;

export const CP002_TENSE_DOMAINS_V1 = [...new Set(DYNAMIC_TENSE_SCENES_V1.map((scene) => scene.domain))] as readonly TenseDomainV1[];
