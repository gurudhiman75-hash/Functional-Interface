import type { SemanticDomainV4 } from "./cp001-semantic-catalog-v4";

export interface PairSceneV4 {
  id: string;
  domain: SemanticDomainV4;
  singularSubject: string;
  pluralSubject: string;
  singularModifier: string;
  pluralModifier: string;
  singularVerb: string;
  pluralVerb: string;
  tail: string;
}

export interface InterveningSceneV4 {
  id: string;
  domain: SemanticDomainV4;
  subject: string;
  modifier: string;
  singularVerb: string;
  pluralVerb: string;
  tail: string;
  subjectHead: string;
  distractorCue: string;
}

export interface CollectiveSceneV4 {
  id: string;
  domain: SemanticDomainV4;
  subject: string;
  singularVerb: string;
  pluralVerb: string;
  segment3: string;
  segment4: string;
  subjectHead: string;
  mode: "unit" | "members";
}

const pair = (id: string, domain: SemanticDomainV4, singularSubject: string, pluralSubject: string, singularModifier: string, pluralModifier: string, singularVerb: string, pluralVerb: string, tail: string): PairSceneV4 => ({ id, domain, singularSubject, pluralSubject, singularModifier, pluralModifier, singularVerb, pluralVerb, tail });
const iv = (id: string, domain: SemanticDomainV4, subject: string, modifier: string, singularVerb: string, pluralVerb: string, tail: string, subjectHead: string, distractorCue: string): InterveningSceneV4 => ({ id, domain, subject, modifier, singularVerb, pluralVerb, tail, subjectHead, distractorCue });
const col = (id: string, domain: SemanticDomainV4, subject: string, singularVerb: string, pluralVerb: string, segment3: string, segment4: string, subjectHead: string, mode: "unit" | "members"): CollectiveSceneV4 => ({ id, domain, subject, singularVerb, pluralVerb, segment3, segment4, subjectHead, mode });

export const PAIR_SCENES_V4: readonly PairSceneV4[] = [
  pair("edu-principal-teachers", "education", "principal", "teachers", "leading the morning assembly", "teaching the senior classes", "is attending", "are attending", "the curriculum meeting this afternoon."),
  pair("edu-tutor-students", "education", "tutor", "students", "handling the revision group", "preparing for the final test", "has reviewed", "have reviewed", "the study plan before the next class."),
  pair("edu-librarian-readers", "education", "librarian", "readers", "working at the issue desk", "waiting in the reference section", "is using", "are using", "the revised library procedure this week."),
  pair("edu-lecturer-assistants", "education", "lecturer", "teaching assistants", "leading the seminar", "assigned to the seminar group", "has prepared", "have prepared", "the discussion material for tomorrow."),

  pair("tr-driver-passengers", "transport", "driver", "passengers", "assigned to the morning route", "travelling on the same service", "is waiting", "are waiting", "for the route to reopen."),
  pair("tr-inspector-mechanics", "transport", "inspector", "mechanics", "conducting the safety review", "working in the repair bay", "has checked", "have checked", "the vehicle report before departure."),
  pair("tr-conductor-travellers", "transport", "conductor", "travellers", "working on the express service", "holding reserved tickets", "is standing", "are standing", "near the departure gate."),
  pair("tr-dispatcher-drivers", "transport", "dispatcher", "drivers", "working in the control room", "assigned to the late route", "has received", "have received", "the revised route instructions."),

  pair("com-manager-assistants", "commerce", "store manager", "sales assistants", "opening the main outlet", "working on the sales floor", "is checking", "are checking", "the stock before the store opens."),
  pair("com-vendor-buyers", "commerce", "vendor", "buyers", "working at the wholesale stall", "visiting the morning market", "has checked", "have checked", "the revised price list carefully."),
  pair("com-retailer-suppliers", "commerce", "retailer", "suppliers", "running the central outlet", "delivering the seasonal stock", "is attending", "are attending", "the trade meeting this afternoon."),
  pair("com-cashier-shoppers", "commerce", "cashier", "shoppers", "working at the payment desk", "using the self-service area", "has received", "have received", "the updated payment instructions."),

  pair("sci-lead-technicians", "science", "lead researcher", "technicians", "directing the current experiment", "working in the laboratory", "is reviewing", "are reviewing", "the latest test data."),
  pair("sci-scientist-assistants", "science", "scientist", "research assistants", "leading the field study", "assigned to the observation team", "has recorded", "have recorded", "the final set of readings."),
  pair("sci-analyst-observers", "science", "analyst", "observers", "working with the survey data", "recording the morning session", "is examining", "are examining", "the unusual pattern in the chart."),
  pair("sci-chemist-technicians", "science", "chemist", "laboratory technicians", "handling the test solution", "working on the same experiment", "has completed", "have completed", "the required safety check."),

  pair("sp-coach-players", "sports", "coach", "players", "leading the senior squad", "selected for the opening match", "is attending", "are attending", "the pre-match briefing."),
  pair("sp-referee-players", "sports", "referee", "players", "officiating the afternoon fixture", "waiting near the main field", "is waiting", "are waiting", "for the ground inspection to finish."),
  pair("sp-captain-athletes", "sports", "captain", "athletes", "leading the training group", "preparing for the qualifying round", "has completed", "have completed", "the scheduled warm-up routine."),
  pair("sp-trainer-runners", "sports", "trainer", "runners", "supervising the conditioning session", "training for the relay event", "is following", "are following", "the revised training schedule."),

  pair("pub-officer-residents", "public-service", "service officer", "residents", "handling the community desk", "using the public service centre", "is attending", "are attending", "the information meeting this morning."),
  pair("pub-clerk-applicants", "public-service", "clerk", "applicants", "working at the verification counter", "waiting for document checking", "is waiting", "are waiting", "near the service desk."),
  pair("pub-inspector-volunteers", "public-service", "inspector", "volunteers", "conducting the field review", "helping with the public campaign", "has checked", "have checked", "the displayed safety notice."),
  pair("pub-coordinator-visitors", "public-service", "coordinator", "visitors", "managing the public event", "entering through the main gate", "is following", "are following", "the marked route through the facility."),

  pair("tech-programmer-users", "technology", "programmer", "users", "working on the test build", "using the beta version", "has installed", "have installed", "the latest software update."),
  pair("tech-technician-computers", "technology", "technician", "computers", "working in the equipment room", "connected to the test network", "has completed", "have completed", "the diagnostic test successfully."),
  pair("tech-operator-technicians", "technology", "operator", "technicians", "monitoring the control screen", "assigned to the network check", "is monitoring", "are monitoring", "the system load during peak use."),
  pair("tech-router-devices", "technology", "router", "devices", "installed near the control room", "connected to the same network", "requires", "require", "a firmware update before normal use."),

  pair("env-ranger-volunteers", "environment", "ranger", "volunteers", "patrolling the protected area", "joining the cleanup drive", "has inspected", "have inspected", "the marked trail after the storm."),
  pair("env-observer-volunteers", "environment", "observer", "volunteers", "recording the morning survey", "working near the wetland", "has recorded", "have recorded", "the wildlife sightings in the field sheet."),
  pair("env-tree-saplings", "environment", "tree", "saplings", "growing near the old boundary", "planted during the rainy season", "has survived", "have survived", "the recent dry spell."),
  pair("env-bird-animals", "environment", "bird", "wild animals", "tagged during the earlier survey", "seen near the protected wetland", "has returned", "have returned", "to the protected area after winter."),

  pair("hos-manager-guests", "hospitality", "hotel manager", "guests", "supervising the morning arrivals", "waiting in the reception area", "is waiting", "are waiting", "for the service desk to open."),
  pair("hos-chef-cooks", "hospitality", "chef", "cooks", "leading the evening kitchen team", "working on the dinner shift", "is preparing", "are preparing", "the evening meal for the event."),
  pair("hos-receptionist-attendants", "hospitality", "receptionist", "attendants", "working at the front desk", "assigned to the guest floors", "is checking", "are checking", "the room status before arrival."),
  pair("hos-host-visitors", "hospitality", "host", "visitors", "organising the evening reception", "arriving before the programme", "has received", "have received", "the final programme schedule."),

  pair("hc-doctor-nurses", "healthcare", "doctor", "nurses", "leading the morning round", "working in the recovery ward", "is attending", "are attending", "the clinical briefing before rounds."),
  pair("hc-surgeon-technicians", "healthcare", "surgeon", "technicians", "preparing for the scheduled procedure", "working in the diagnostic unit", "has reviewed", "have reviewed", "the latest scan before treatment."),
  pair("hc-therapist-caregivers", "healthcare", "therapist", "caregivers", "handling the rehabilitation session", "assisting the same patient group", "is following", "are following", "the revised treatment plan."),
  pair("hc-pharmacist-patients", "healthcare", "pharmacist", "patients", "working at the medicine counter", "waiting with valid prescriptions", "has received", "have received", "the updated dosage instructions."),

  pair("ag-officer-farmers", "agriculture", "field officer", "farmers", "leading the crop demonstration", "working on nearby holdings", "is attending", "are attending", "the irrigation demonstration this afternoon."),
  pair("ag-farmer-labourers", "agriculture", "farmer", "labourers", "preparing the main field", "helping with the seasonal work", "is preparing", "are preparing", "the field for sowing."),
  pair("ag-tractor-pumps", "agriculture", "tractor", "irrigation pumps", "used throughout the sowing season", "installed beside the main channel", "requires", "require", "scheduled servicing before heavy use."),
  pair("ag-grower-workers", "agriculture", "grower", "farm workers", "managing the vegetable crop", "working near the irrigation channel", "has checked", "have checked", "the water supply before irrigation."),

  pair("med-editor-reporters", "media", "editor", "reporters", "working on the evening edition", "covering the public event", "is reviewing", "are reviewing", "the final copy before publication."),
  pair("med-presenter-journalists", "media", "presenter", "journalists", "hosting the evening programme", "working on the same broadcast", "is attending", "are attending", "the production briefing before broadcast."),
  pair("med-photographer-reporters", "media", "photographer", "reporters", "covering the outdoor event", "working near the main stage", "has sent", "have sent", "the latest material to the news desk."),
  pair("med-subscriber-readers", "media", "subscriber", "readers", "using the digital edition", "following the weekly magazine", "has downloaded", "have downloaded", "the latest issue for offline reading."),

  pair("home-owner-tenants", "household", "homeowner", "tenants", "checking the monthly repairs", "living in the same building", "has reported", "have reported", "the leaking pipe to maintenance."),
  pair("home-cleaner-residents", "household", "cleaner", "residents", "working in the common area", "using the shared entrance", "is checking", "are checking", "the condition of the hallway."),
  pair("home-heater-appliances", "household", "heater", "appliances", "used during cold mornings", "connected to the main power line", "requires", "require", "regular servicing for safe use."),
  pair("home-lamp-fans", "household", "lamp", "fans", "fitted with an energy-saving bulb", "installed in the same room", "is using", "are using", "less electricity after the upgrade."),

  pair("inf-engineer-workers", "infrastructure", "engineer", "workers", "leading the repair project", "working on the damaged section", "is inspecting", "are inspecting", "the road before reopening."),
  pair("inf-inspector-engineers", "infrastructure", "inspector", "engineers", "conducting the safety review", "assigned to the bridge project", "has reviewed", "have reviewed", "the repair plan carefully."),
  pair("inf-bridge-roads", "infrastructure", "bridge", "roads", "carrying heavy daily traffic", "linking the service areas", "requires", "require", "regular maintenance during the dry season."),
  pair("inf-lift-lights", "infrastructure", "lift", "streetlights", "installed in the public building", "connected to the new power line", "has completed", "have completed", "the scheduled safety test."),

  pair("bank-manager-clerks", "banking", "bank manager", "clerks", "handling the branch review", "working at the account desks", "is reviewing", "are reviewing", "the new account forms."),
  pair("bank-auditor-managers", "banking", "auditor", "branch managers", "reviewing the quarterly accounts", "responsible for the monthly records", "has checked", "have checked", "the supporting financial records."),
  pair("bank-depositor-borrowers", "banking", "depositor", "borrowers", "visiting the branch for renewal", "submitting updated documents", "has submitted", "have submitted", "the required account documents."),
  pair("bank-teller-customers", "banking", "teller", "customers", "working at the cash counter", "waiting in the service queue", "has received", "have received", "the revised transaction instructions."),

  pair("mfg-supervisor-workers", "manufacturing", "supervisor", "workers", "overseeing the packaging line", "working on the assembly line", "is checking", "are checking", "the production output against the target."),
  pair("mfg-technician-operators", "manufacturing", "technician", "operators", "working in the maintenance section", "running the production machines", "has tested", "have tested", "the repaired machine before restart."),
  pair("mfg-inspector-assemblers", "manufacturing", "inspector", "assemblers", "working at the quality station", "handling the final assembly stage", "is reviewing", "are reviewing", "the defect report before packing."),
  pair("mfg-machine-units", "manufacturing", "machine", "production units", "installed on the main line", "operating during both shifts", "requires", "require", "a scheduled safety check."),

  pair("en-engineer-technicians", "energy", "engineer", "technicians", "reviewing the power system", "working near the control panel", "is checking", "are checking", "the unit output against the target."),
  pair("en-meter-transformers", "energy", "meter", "transformers", "installed outside the building", "serving the new distribution line", "requires", "require", "a routine technical inspection."),
  pair("en-consumer-operators", "energy", "consumer", "system operators", "using the outage reporting service", "working in the control room", "has reported", "have reported", "the interruption through the control system."),
  pair("en-turbine-panels", "energy", "turbine", "solar panels", "operating after scheduled maintenance", "installed on the building roof", "has completed", "have completed", "the output test successfully."),

  pair("post-clerk-senders", "postal", "clerk", "senders", "working at the booking counter", "waiting with prepared parcels", "is waiting", "are waiting", "near the booking desk."),
  pair("post-courier-agents", "postal", "courier", "delivery agents", "handling the morning route", "working on nearby delivery areas", "has checked", "have checked", "the route before leaving the depot."),
  pair("post-parcel-letters", "postal", "parcel", "letters", "booked through the tracked service", "placed in the same dispatch bag", "has reached", "have reached", "the sorting centre before dispatch."),
  pair("post-recipient-senders", "postal", "recipient", "senders", "waiting for a tracked item", "using the online tracking service", "has checked", "have checked", "the tracking number on the receipt."),

  pair("cul-curator-artists", "culture", "curator", "artists", "preparing the new exhibition", "submitting work for display", "is preparing", "are preparing", "the exhibition material for opening day."),
  pair("cul-musician-performers", "culture", "musician", "performers", "rehearsing the opening piece", "taking part in the evening programme", "is rehearsing", "are rehearsing", "the opening sequence on the main stage."),
  pair("cul-actor-dancers", "culture", "actor", "dancers", "rehearsing the final scene", "learning the closing sequence", "has completed", "have completed", "the full stage rehearsal."),
  pair("cul-visitor-artists", "culture", "visitor", "artists", "attending the public exhibition", "presenting work in the gallery", "has received", "have received", "the printed programme at the entrance."),

  pair("em-dispatcher-responders", "emergency-service", "dispatcher", "responders", "working in the control room", "deployed with the first response team", "is monitoring", "are monitoring", "the active emergency call."),
  pair("em-firefighter-volunteers", "emergency-service", "firefighter", "volunteers", "assigned to the night crew", "taking part in the safety drill", "has checked", "have checked", "the emergency equipment before the drill."),
  pair("em-paramedic-rescuers", "emergency-service", "paramedic", "rescuers", "working on the response vehicle", "training with the rescue team", "is attending", "are attending", "the joint safety exercise."),
  pair("em-driver-technicians", "emergency-service", "driver", "technicians", "assigned to the response vehicle", "maintaining the same vehicle", "has inspected", "have inspected", "the vehicle before the next call."),
] as const;

export const INTERVENING_SCENES_V4: readonly InterveningSceneV4[] = [
  iv("edu-quality-lessons", "education", "The quality of the lessons", "delivered during the revision week", "has improved", "have improved", "after the new plan was introduced.", "quality", "lessons"),
  iv("edu-condition-books", "education", "The condition of the books", "kept on the open shelves", "has worsened", "have worsened", "during the humid season.", "condition", "books"),
  iv("edu-performance-students", "education", "The performance of the students", "attending the extra classes", "has improved", "have improved", "since the practice tests began.", "performance", "students"),
  iv("edu-availability-rooms", "education", "The availability of classrooms", "needed for the afternoon sessions", "remains", "remain", "limited this week.", "availability", "classrooms"),

  iv("tr-availability-seats", "transport", "The availability of seats", "on the morning services", "remains", "remain", "limited during the holiday period.", "availability", "seats / services"),
  iv("tr-condition-vehicles", "transport", "The condition of the vehicles", "used on the longer routes", "has improved", "have improved", "after regular servicing began.", "condition", "vehicles / routes"),
  iv("tr-punctuality-buses", "transport", "The punctuality of the buses", "operating during peak hours", "has improved", "have improved", "since the timetable was revised.", "punctuality", "buses"),
  iv("tr-maintenance-coaches", "transport", "The maintenance of the coaches", "used on overnight services", "remains", "remain", "under close review.", "maintenance", "coaches / services"),

  iv("com-price-goods", "commerce", "The price of the goods", "sold through the main outlet", "has risen", "have risen", "during the past month.", "price", "goods"),
  iv("com-quality-products", "commerce", "The quality of the products", "supplied by the new vendor", "remains", "remain", "consistent across recent deliveries.", "quality", "products"),
  iv("com-supply-items", "commerce", "The supply of essential items", "requested by the smaller shops", "has fallen", "have fallen", "since the last delivery cycle.", "supply", "items / shops"),
  iv("com-demand-models", "commerce", "The demand for the new models", "displayed in the front section", "has increased", "have increased", "after the price reduction.", "demand", "models"),

  iv("sci-accuracy-readings", "science", "The accuracy of the readings", "recorded by the new instruments", "has improved", "have improved", "after recalibration.", "accuracy", "readings / instruments"),
  iv("sci-reliability-devices", "science", "The reliability of the measuring devices", "used in the field trials", "remains", "remain", "high under normal conditions.", "reliability", "devices / trials"),
  iv("sci-quality-samples", "science", "The quality of the samples", "collected from the test plots", "has improved", "have improved", "after the collection method changed.", "quality", "samples / plots"),
  iv("sci-result-tests", "science", "The result of the repeated tests", "conducted under identical conditions", "has remained", "have remained", "within the expected range.", "result", "tests / conditions"),

  iv("sp-performance-players", "sports", "The performance of the players", "selected for the final squad", "has improved", "have improved", "since regular training resumed.", "performance", "players"),
  iv("sp-fitness-athletes", "sports", "The fitness of the athletes", "preparing for the qualifying round", "remains", "remain", "a key concern for the coach.", "fitness", "athletes"),
  iv("sp-condition-fields", "sports", "The condition of the playing fields", "used for the weekend fixtures", "has improved", "have improved", "after the drainage work.", "condition", "fields / fixtures"),
  iv("sp-schedule-matches", "sports", "The schedule of the matches", "planned for the closing week", "has changed", "have changed", "because of the weather.", "schedule", "matches"),

  iv("pub-quality-services", "public-service", "The quality of the services", "offered through the public centre", "has improved", "have improved", "since the new system began.", "quality", "services"),
  iv("pub-availability-counters", "public-service", "The availability of service counters", "needed during the morning rush", "remains", "remain", "limited at present.", "availability", "counters"),
  iv("pub-condition-facilities", "public-service", "The condition of the public facilities", "inspected during the monthly review", "has improved", "have improved", "after the repair work.", "condition", "facilities"),
  iv("pub-response-complaints", "public-service", "The response to public complaints", "received through the online portal", "has improved", "have improved", "during the current quarter.", "response", "complaints"),

  iv("tech-performance-computers", "technology", "The performance of the computers", "connected to the updated network", "has improved", "have improved", "after the software upgrade.", "performance", "computers"),
  iv("tech-reliability-devices", "technology", "The reliability of the devices", "used for remote access", "remains", "remain", "high after repeated testing.", "reliability", "devices"),
  iv("tech-speed-servers", "technology", "The speed of the servers", "handling the larger data loads", "has increased", "have increased", "after the hardware change.", "speed", "servers / loads"),
  iv("tech-security-accounts", "technology", "The security of the user accounts", "protected by two-step verification", "has improved", "have improved", "since the new policy began.", "security", "accounts"),

  iv("env-quality-water", "environment", "The quality of the water samples", "collected from the reservoir", "has improved", "have improved", "since the treatment plant was upgraded.", "quality", "samples"),
  iv("env-condition-trees", "environment", "The condition of the trees", "growing along the exposed slope", "has worsened", "have worsened", "during the long dry spell.", "condition", "trees"),
  iv("env-rate-saplings", "environment", "The survival rate of the saplings", "planted during the rainy season", "has increased", "have increased", "after regular watering began.", "rate", "saplings"),
  iv("env-level-pollutants", "environment", "The level of pollutants", "measured at the monitoring points", "has fallen", "have fallen", "during the past year.", "level", "pollutants / points"),

  iv("hos-quality-meals", "hospitality", "The quality of the meals", "served during the evening programme", "has improved", "have improved", "after the menu was revised.", "quality", "meals"),
  iv("hos-availability-rooms", "hospitality", "The availability of rooms", "requested for the holiday weekend", "remains", "remain", "limited at present.", "availability", "rooms"),
  iv("hos-cleanliness-rooms", "hospitality", "The cleanliness of the guest rooms", "prepared by the morning staff", "has improved", "have improved", "after the new checklist was introduced.", "cleanliness", "rooms / staff"),
  iv("hos-cost-services", "hospitality", "The cost of additional services", "offered to overnight guests", "has risen", "have risen", "since the start of the season.", "cost", "services / guests"),

  iv("hc-availability-beds", "healthcare", "The availability of beds", "needed in the recovery ward", "remains", "remain", "limited during busy periods.", "availability", "beds"),
  iv("hc-quality-services", "healthcare", "The quality of the clinical services", "offered in the outpatient unit", "has improved", "have improved", "since the new system began.", "quality", "services"),
  iv("hc-accuracy-tests", "healthcare", "The accuracy of the diagnostic tests", "performed with the updated equipment", "has increased", "have increased", "after recalibration.", "accuracy", "tests / equipment"),
  iv("hc-condition-patients", "healthcare", "The condition of the patients", "receiving the revised treatment", "has improved", "have improved", "during the past week.", "condition", "patients"),

  iv("ag-yield-crops", "agriculture", "The yield of the crops", "grown with the new irrigation method", "has increased", "have increased", "during the current season.", "yield", "crops"),
  iv("ag-condition-fields", "agriculture", "The condition of the fields", "affected by the recent rain", "has improved", "have improved", "after the drainage channels were cleared.", "condition", "fields"),
  iv("ag-quality-seeds", "agriculture", "The quality of the seeds", "stored in the dry room", "remains", "remain", "suitable for the next sowing cycle.", "quality", "seeds"),
  iv("ag-availability-workers", "agriculture", "The availability of farm workers", "needed during the harvest period", "remains", "remain", "limited in several areas.", "availability", "workers"),

  iv("med-quality-reports", "media", "The quality of the reports", "prepared for the evening bulletin", "has improved", "have improved", "after the new review process began.", "quality", "reports"),
  iv("med-accuracy-articles", "media", "The accuracy of the articles", "published in the weekly edition", "remains", "remain", "a major editorial priority.", "accuracy", "articles"),
  iv("med-reach-programmes", "media", "The reach of the programmes", "broadcast through the digital platform", "has increased", "have increased", "during the past year.", "reach", "programmes"),
  iv("med-popularity-series", "media", "The popularity of the documentary series", "shown during the weekend slot", "has grown", "have grown", "since the first episode aired.", "popularity", "series"),

  iv("home-condition-windows", "household", "The condition of the windows", "facing the main street", "has worsened", "have worsened", "after several rainy seasons.", "condition", "windows"),
  iv("home-cost-repairs", "household", "The cost of household repairs", "required in the older rooms", "has risen", "have risen", "during the past year.", "cost", "repairs / rooms"),
  iv("home-efficiency-appliances", "household", "The efficiency of the appliances", "used throughout the day", "has improved", "have improved", "after regular servicing.", "efficiency", "appliances"),
  iv("home-colour-curtains", "household", "The colour of the curtains", "hanging in the front room", "matches", "match", "the lighter shade on the walls.", "colour", "curtains"),

  iv("inf-condition-roads", "infrastructure", "The condition of the roads", "carrying heavy daily traffic", "remains", "remain", "a matter of concern.", "condition", "roads"),
  iv("inf-strength-bridges", "infrastructure", "The strength of the bridge supports", "tested during the safety review", "has improved", "have improved", "after reinforcement work.", "strength", "supports"),
  iv("inf-reliability-lifts", "infrastructure", "The reliability of the lifts", "installed in the public buildings", "has improved", "have improved", "after scheduled servicing.", "reliability", "lifts / buildings"),
  iv("inf-cost-materials", "infrastructure", "The cost of construction materials", "used in the repair programme", "has risen", "have risen", "during the current phase.", "cost", "materials"),

  iv("bank-accuracy-records", "banking", "The accuracy of the account records", "checked during the quarterly audit", "has improved", "have improved", "since the digital process began.", "accuracy", "records"),
  iv("bank-volume-transactions", "banking", "The volume of online transactions", "processed during peak hours", "has increased", "have increased", "during the current quarter.", "volume", "transactions"),
  iv("bank-quality-services", "banking", "The quality of branch services", "offered at the customer counters", "remains", "remain", "under regular review.", "quality", "services / counters"),
  iv("bank-security-accounts", "banking", "The security of customer accounts", "protected by additional verification", "has improved", "have improved", "after the new safeguards were introduced.", "security", "accounts"),

  iv("mfg-quality-products", "manufacturing", "The quality of the products", "made on the updated line", "has improved", "have improved", "since the equipment was serviced.", "quality", "products"),
  iv("mfg-output-machines", "manufacturing", "The output of the machines", "operating during both shifts", "has increased", "have increased", "during the current production cycle.", "output", "machines"),
  iv("mfg-condition-tools", "manufacturing", "The condition of the tools", "used on the assembly line", "has improved", "have improved", "after the maintenance round.", "condition", "tools"),
  iv("mfg-rate-defects", "manufacturing", "The rate of defects", "found during final inspection", "has fallen", "have fallen", "since the quality checks were tightened.", "rate", "defects"),

  iv("en-output-turbines", "energy", "The output of the turbines", "operating after scheduled maintenance", "has increased", "have increased", "during the current month.", "output", "turbines"),
  iv("en-performance-panels", "energy", "The performance of the solar panels", "installed on the building roofs", "has improved", "have improved", "after regular cleaning began.", "performance", "panels / roofs"),
  iv("en-reliability-meters", "energy", "The reliability of the meters", "connected to the new billing system", "has improved", "have improved", "after the software update.", "reliability", "meters"),
  iv("en-condition-batteries", "energy", "The condition of the backup batteries", "stored in the equipment room", "has worsened", "have worsened", "after extended use.", "condition", "batteries"),

  iv("post-volume-parcels", "postal", "The volume of parcels", "processed at the sorting centre", "has increased", "have increased", "during the holiday dispatch period.", "volume", "parcels"),
  iv("post-condition-packages", "postal", "The condition of the packages", "received from the morning route", "remains", "remain", "satisfactory after handling.", "condition", "packages"),
  iv("post-speed-deliveries", "postal", "The speed of tracked deliveries", "handled through the new route system", "has improved", "have improved", "during the current month.", "speed", "deliveries"),
  iv("post-accuracy-addresses", "postal", "The accuracy of the addresses", "printed on the tracked parcels", "remains", "remain", "important for timely delivery.", "accuracy", "addresses / parcels"),

  iv("cul-quality-performances", "culture", "The quality of the performances", "presented during the evening programme", "has improved", "have improved", "during the current season.", "quality", "performances"),
  iv("cul-attendance-events", "culture", "The attendance at cultural events", "held in the main hall", "has increased", "have increased", "since the new programme began.", "attendance", "events"),
  iv("cul-condition-paintings", "culture", "The condition of the paintings", "displayed in the older gallery", "has improved", "have improved", "after conservation work.", "condition", "paintings"),
  iv("cul-popularity-exhibitions", "culture", "The popularity of the exhibitions", "opened during the current season", "has increased", "have increased", "among weekend visitors.", "popularity", "exhibitions"),

  iv("em-readiness-responders", "emergency-service", "The readiness of the responders", "assigned to the night shift", "has improved", "have improved", "after repeated drills.", "readiness", "responders"),
  iv("em-condition-vehicles", "emergency-service", "The condition of the response vehicles", "used during recent calls", "remains", "remain", "under close technical review.", "condition", "vehicles"),
  iv("em-availability-supplies", "emergency-service", "The availability of emergency supplies", "needed by the response teams", "remains", "remain", "limited during peak demand.", "availability", "supplies / teams"),
  iv("em-time-units", "emergency-service", "The response time of the units", "deployed from the central station", "has improved", "have improved", "since the route plan changed.", "time", "units"),
] as const;

export const COLLECTIVE_UNIT_V4: readonly CollectiveSceneV4[] = [
  col("team-final", "sports", "The team", "has won", "have won", "the final match", "as one unit by a narrow margin.", "team", "unit"),
  col("jury-unanimous", "public-service", "The jury", "has reached", "have reached", "a unanimous decision", "after several hours of discussion.", "jury", "unit"),
  col("board-policy", "commerce", "The board", "has approved", "have approved", "the new pricing policy", "at its monthly meeting.", "board", "unit"),
  col("panel-entry", "culture", "The panel", "has selected", "have selected", "the winning entry", "by unanimous agreement.", "panel", "unit"),
  col("crew-drill", "transport", "The crew", "has completed", "have completed", "the safety drill", "as a coordinated unit before departure.", "crew", "unit"),
  col("committee-plan", "public-service", "The committee", "has adopted", "have adopted", "a common action plan", "without dissent.", "committee", "unit"),
  col("class-project", "education", "The class", "has completed", "have completed", "the joint project", "as a single group.", "class", "unit"),
  col("orchestra-piece", "culture", "The orchestra", "has performed", "have performed", "the final piece", "as one ensemble.", "orchestra", "unit"),
  col("fleet-check", "transport", "The fleet", "has passed", "have passed", "the scheduled safety inspection", "as a complete operating group.", "fleet", "unit"),
  col("company-plan", "commerce", "The company", "has adopted", "have adopted", "a single pricing plan", "for all its outlets.", "company", "unit"),
  col("department-policy", "public-service", "The department", "has issued", "have issued", "one common instruction", "for all service counters.", "department", "unit"),
  col("research-team-result", "science", "The research team", "has published", "have published", "a joint result", "under one project report.", "research team", "unit"),
] as const;

export const COLLECTIVE_MEMBER_V4: readonly CollectiveSceneV4[] = [
  col("committee-views", "public-service", "The committee", "was divided", "were divided", "in their views", "on the revised proposal.", "committee", "members"),
  col("audience-seats", "culture", "The audience", "was taking", "were taking", "their seats", "one by one before the programme began.", "audience", "members"),
  col("team-jerseys", "sports", "The team", "was changing", "were changing", "their jerseys", "in separate rooms after practice.", "team", "members"),
  col("crew-cabins", "transport", "The crew", "was returning", "were returning", "to their cabins", "one at a time after the drill.", "crew", "members"),
  col("jury-opinions", "public-service", "The jury", "was arguing", "were arguing", "among themselves", "over the final verdict.", "jury", "members"),
  col("class-desks", "education", "The class", "was taking", "were taking", "their separate desks", "as the test papers were distributed.", "class", "members"),
  col("family-rooms", "household", "The family", "was moving", "were moving", "to their separate rooms", "after the meeting ended.", "family", "members"),
  col("staff-lockers", "hospitality", "The staff", "was collecting", "were collecting", "their personal belongings", "from separate lockers after duty.", "staff", "members"),
  col("panel-opinions", "culture", "The panel", "was expressing", "were expressing", "their different opinions", "before the final vote.", "panel", "members"),
  col("board-positions", "commerce", "The board", "was taking", "were taking", "different positions", "on the proposed change.", "board", "members"),
  col("research-team-notes", "science", "The research team", "was comparing", "were comparing", "their individual notes", "after separate field visits.", "research team", "members"),
  col("medical-team-rooms", "healthcare", "The medical team", "was returning", "were returning", "to their assigned rooms", "one by one after the briefing.", "medical team", "members"),
] as const;

export const COUNT_TAILS_BY_DOMAIN_V4: Record<SemanticDomainV4, readonly [string, string]> = {
  education: ["since the new term began.", "during the current examination session."],
  transport: ["after the timetable was revised.", "during the holiday travel period."],
  commerce: ["during the latest sales period.", "after the new offer was introduced."],
  science: ["during the current study.", "since the latest survey began."],
  sports: ["during the current season.", "since regular training resumed."],
  "public-service": ["since the new service window opened.", "during the current month."],
  technology: ["after the latest upgrade.", "during the current rollout."],
  environment: ["since the last field survey.", "during the current season."],
  hospitality: ["since the holiday period began.", "during the current booking cycle."],
  healthcare: ["since the new appointment system began.", "during the current month."],
  agriculture: ["since the sowing season began.", "during the current crop cycle."],
  media: ["since the new edition was launched.", "during the current week."],
  household: ["since the latest maintenance round.", "during the current year."],
  infrastructure: ["since the repair programme began.", "during the current project phase."],
  banking: ["since the new service was introduced.", "during the current quarter."],
  manufacturing: ["since the new shift plan began.", "during the current production cycle."],
  energy: ["since the new system came online.", "during the current billing period."],
  postal: ["since the holiday dispatch period began.", "during the current week."],
  culture: ["since the new programme opened.", "during the current season."],
  "emergency-service": ["since the response plan was updated.", "during the current drill cycle."],
};
