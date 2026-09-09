export type SemanticDomain =
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
  | "infrastructure";

export interface SemanticBundle {
  id: string;
  domain: SemanticDomain;
  singular: string;
  plural: string;
  singularVerb: string;
  pluralVerb: string;
  segment3: string;
  segment4: string;
  modifiers: readonly string[];
}

export const BASE_BUNDLES: readonly SemanticBundle[] = [
  { id: "education-student-library", domain: "education", singular: "student", plural: "students", singularVerb: "has borrowed", pluralVerb: "have borrowed", segment3: "a reference book", segment4: "from the library.", modifiers: ["from the senior class", "preparing for the final test"] },
  { id: "transport-passenger-gate", domain: "transport", singular: "passenger", plural: "passengers", singularVerb: "is waiting", pluralVerb: "are waiting", segment3: "near the departure gate", segment4: "for the morning train.", modifiers: ["holding a reserved ticket", "travelling with young children"] },
  { id: "commerce-customer-return", domain: "commerce", singular: "customer", plural: "customers", singularVerb: "has returned", pluralVerb: "have returned", segment3: "the damaged product", segment4: "with the original receipt.", modifiers: ["waiting at the service desk", "who bought the item during the weekend sale"] },
  { id: "science-researcher-readings", domain: "science", singular: "researcher", plural: "researchers", singularVerb: "has recorded", pluralVerb: "have recorded", segment3: "the temperature readings", segment4: "at regular intervals.", modifiers: ["working at the field station", "assigned to the observation team"] },
  { id: "sports-player-warmup", domain: "sports", singular: "player", plural: "players", singularVerb: "has completed", pluralVerb: "have completed", segment3: "the warm-up drills", segment4: "before the match.", modifiers: ["selected for the opening match", "returning after a short break"] },
  { id: "public-resident-helpline", domain: "public-service", singular: "resident", plural: "residents", singularVerb: "has reported", pluralVerb: "have reported", segment3: "the broken streetlight", segment4: "through the public helpline.", modifiers: ["living in the housing complex", "using the online complaint service"] },
  { id: "technology-device-update", domain: "technology", singular: "device", plural: "devices", singularVerb: "requires", pluralVerb: "require", segment3: "a software update", segment4: "before normal use.", modifiers: ["connected to the test network", "kept in the equipment room"] },
  { id: "environment-tree-dryspell", domain: "environment", singular: "tree", plural: "trees", singularVerb: "has survived", pluralVerb: "have survived", segment3: "the long dry spell", segment4: "without additional watering.", modifiers: ["planted beside the canal", "growing on the open slope"] },
  { id: "hospitality-guest-reception", domain: "hospitality", singular: "guest", plural: "guests", singularVerb: "is waiting", pluralVerb: "are waiting", segment3: "in the reception area", segment4: "for the host to arrive.", modifiers: ["invited to the evening programme", "arriving before the scheduled time"] },
  { id: "healthcare-patient-followup", domain: "healthcare", singular: "patient", plural: "patients", singularVerb: "needs", pluralVerb: "need", segment3: "a follow-up examination", segment4: "after the treatment.", modifiers: ["recovering from the procedure", "referred by the duty doctor"] },
  { id: "agriculture-farmer-irrigation", domain: "agriculture", singular: "farmer", plural: "farmers", singularVerb: "has adopted", pluralVerb: "have adopted", segment3: "the new irrigation method", segment4: "for the summer crop.", modifiers: ["working on a small holding", "facing a shortage of water"] },
  { id: "media-reader-magazine", domain: "media", singular: "reader", plural: "readers", singularVerb: "has requested", pluralVerb: "have requested", segment3: "a copy of the latest issue", segment4: "from the reading desk.", modifiers: ["waiting in the reading room", "interested in the science section"] },
  { id: "education-teacher-practice", domain: "education", singular: "teacher", plural: "teachers", singularVerb: "has prepared", pluralVerb: "have prepared", segment3: "a set of practice questions", segment4: "for tomorrow's class.", modifiers: ["teaching the senior section", "handling the revision class"] },
  { id: "education-pupil-assignment", domain: "education", singular: "pupil", plural: "pupils", singularVerb: "has submitted", pluralVerb: "have submitted", segment3: "the science assignment", segment4: "before the deadline.", modifiers: ["working on the group project", "absent during the first week"] },
  { id: "transport-driver-brakes", domain: "transport", singular: "driver", plural: "drivers", singularVerb: "has checked", pluralVerb: "have checked", segment3: "the vehicle's brakes", segment4: "before starting the trip.", modifiers: ["assigned to the early service", "driving the longer route"] },
  { id: "transport-cyclist-jacket", domain: "transport", singular: "cyclist", plural: "cyclists", singularVerb: "is wearing", pluralVerb: "are wearing", segment3: "a reflective jacket", segment4: "for the evening ride.", modifiers: ["using the riverside track", "riding after sunset"] },
  { id: "commerce-shopper-payment", domain: "commerce", singular: "shopper", plural: "shoppers", singularVerb: "has paid", pluralVerb: "have paid", segment3: "for the selected items", segment4: "at the self-service counter.", modifiers: ["using a digital payment card", "waiting in the shorter queue"] },
  { id: "commerce-vendor-pricelist", domain: "commerce", singular: "vendor", plural: "vendors", singularVerb: "has displayed", pluralVerb: "have displayed", segment3: "the price list", segment4: "near the sales counter.", modifiers: ["selling seasonal goods", "working in the covered market"] },
  { id: "science-technician-samples", domain: "science", singular: "technician", plural: "technicians", singularVerb: "has labelled", pluralVerb: "have labelled", segment3: "the sample containers", segment4: "before the experiment.", modifiers: ["working in the chemistry lab", "assigned to the morning experiment"] },
  { id: "science-observer-notes", domain: "science", singular: "observer", plural: "observers", singularVerb: "has entered", pluralVerb: "have entered", segment3: "the field notes", segment4: "in the survey register.", modifiers: ["working near the observation point", "recording the morning session"] },
  { id: "sports-runner-lap", domain: "sports", singular: "runner", plural: "runners", singularVerb: "has completed", pluralVerb: "have completed", segment3: "the final practice lap", segment4: "within the target time.", modifiers: ["training for the relay event", "returning after a short injury break"] },
  { id: "sports-swimmer-laps", domain: "sports", singular: "swimmer", plural: "swimmers", singularVerb: "has completed", pluralVerb: "have completed", segment3: "ten practice laps", segment4: "before the session ended.", modifiers: ["training in the main pool", "preparing for the qualifying event"] },
  { id: "public-visitor-form", domain: "public-service", singular: "visitor", plural: "visitors", singularVerb: "has collected", pluralVerb: "have collected", segment3: "an application form", segment4: "from the help desk.", modifiers: ["waiting near the enquiry counter", "seeking information about the service"] },
  { id: "public-citizen-payment", domain: "public-service", singular: "citizen", plural: "citizens", singularVerb: "has used", pluralVerb: "have used", segment3: "the online payment service", segment4: "to pay the utility bill.", modifiers: ["registered on the service portal", "paying the bill before the due date"] },
  { id: "technology-computer-backup", domain: "technology", singular: "computer", plural: "computers", singularVerb: "has completed", pluralVerb: "have completed", segment3: "the automatic backup", segment4: "without any warning.", modifiers: ["connected to the office network", "running the updated software"] },
  { id: "technology-user-password", domain: "technology", singular: "user", plural: "users", singularVerb: "has changed", pluralVerb: "have changed", segment3: "the account password", segment4: "after the security alert.", modifiers: ["using the mobile application", "receiving the security message"] },
  { id: "environment-bird-nesting", domain: "environment", singular: "bird", plural: "birds", singularVerb: "has returned", pluralVerb: "have returned", segment3: "to the nesting area", segment4: "after the winter season.", modifiers: ["tagged during the earlier survey", "seen near the wetland last year"] },
  { id: "environment-gardener-seedlings", domain: "environment", singular: "gardener", plural: "gardeners", singularVerb: "has moved", pluralVerb: "have moved", segment3: "the young seedlings", segment4: "into the shaded area.", modifiers: ["working in the nursery", "preparing the beds for summer"] },
  { id: "hospitality-tourist-map", domain: "hospitality", singular: "tourist", plural: "tourists", singularVerb: "has picked up", pluralVerb: "have picked up", segment3: "a route map", segment4: "from the information counter.", modifiers: ["joining the morning tour", "waiting near the main entrance"] },
  { id: "hospitality-cook-meal", domain: "hospitality", singular: "cook", plural: "cooks", singularVerb: "has prepared", pluralVerb: "have prepared", segment3: "the evening meal", segment4: "before the guests arrived.", modifiers: ["working in the main kitchen", "handling the evening service"] },
  { id: "healthcare-nurse-chart", domain: "healthcare", singular: "nurse", plural: "nurses", singularVerb: "has updated", pluralVerb: "have updated", segment3: "the patient chart", segment4: "before the next round.", modifiers: ["working in the recovery ward", "assigned to the morning shift"] },
  { id: "healthcare-doctor-report", domain: "healthcare", singular: "doctor", plural: "doctors", singularVerb: "has reviewed", pluralVerb: "have reviewed", segment3: "the test report", segment4: "before prescribing treatment.", modifiers: ["working in the outpatient clinic", "handling the follow-up cases"] },
  { id: "agriculture-labourer-grain", domain: "agriculture", singular: "labourer", plural: "labourers", singularVerb: "has loaded", pluralVerb: "have loaded", segment3: "the harvested grain", segment4: "onto the waiting trailer.", modifiers: ["working in the storage yard", "helping with the wheat harvest"] },
  { id: "agriculture-grower-seeds", domain: "agriculture", singular: "grower", plural: "growers", singularVerb: "has stored", pluralVerb: "have stored", segment3: "the seed bags", segment4: "in a dry room.", modifiers: ["preparing for the next sowing season", "using the shared storage shed"] },
  { id: "media-journalist-report", domain: "media", singular: "journalist", plural: "journalists", singularVerb: "has filed", pluralVerb: "have filed", segment3: "the match report", segment4: "before the evening deadline.", modifiers: ["covering the sports event", "working for the evening edition"] },
  { id: "media-viewer-documentary", domain: "media", singular: "viewer", plural: "viewers", singularVerb: "has watched", pluralVerb: "have watched", segment3: "the documentary", segment4: "on the education channel.", modifiers: ["following the science series", "watching the weekend programme"] },
  { id: "household-tenant-repair", domain: "household", singular: "tenant", plural: "tenants", singularVerb: "has reported", pluralVerb: "have reported", segment3: "the leaking tap", segment4: "to the maintenance desk.", modifiers: ["living on the upper floor", "using the shared complaint register"] },
  { id: "infrastructure-engineer-bridge", domain: "infrastructure", singular: "engineer", plural: "engineers", singularVerb: "has inspected", pluralVerb: "have inspected", segment3: "the bridge supports", segment4: "before reopening the lane.", modifiers: ["working on the repair project", "assigned to the safety inspection"] },
] as const;
