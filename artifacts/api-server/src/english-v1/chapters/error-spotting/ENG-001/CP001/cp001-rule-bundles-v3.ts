import type { SemanticDomain } from "./cp001-base-bundles-v3";

export interface NumberTotalBundle {
  id: string;
  domain: SemanticDomain;
  subject: string;
  modifier: string;
  singularVerb: string;
  pluralVerb: string;
  tail: string;
  distractorCue: string;
}

export interface AdditiveBundle {
  id: string;
  domain: SemanticDomain;
  difficulty: "medium" | "hard";
  subject: string;
  additive: string;
  correctVerb: string;
  wrongVerb: string;
  tail: string;
  subjectHead: string;
  distractorCue: string;
  mainNumber: "singular" | "plural";
}

export interface ProximityBundle {
  id: string;
  domain: SemanticDomain;
  difficulty: "medium" | "hard";
  subject: string;
  modifier?: string;
  correctVerb: string;
  wrongVerb: string;
  tail: string;
  nearerSubject: string;
  nearerNumber: "singular" | "plural";
  distractorCue: string;
}

export interface CollectiveBundle {
  id: string;
  domain: SemanticDomain;
  subject: string;
  correctVerb: string;
  wrongVerb: string;
  segment3: string;
  segment4: string;
  subjectHead: string;
  mode: "unit" | "members";
}

export interface InterveningBundle {
  id: string;
  domain: SemanticDomain;
  subject: string;
  modifier: string;
  correctVerb: string;
  wrongVerb: string;
  tail: string;
  subjectHead: string;
  distractorCue: string;
}

export const NUMBER_TOTAL_BUNDLES: readonly NumberTotalBundle[] = [
  { id: "museum-visitors", domain: "hospitality", subject: "The number of visitors", modifier: "entering the museum each day", singularVerb: "has increased", pluralVerb: "have increased", tail: "since the holiday season began.", distractorCue: "visitors" },
  { id: "library-books", domain: "education", subject: "The number of books", modifier: "issued by the library this month", singularVerb: "has fallen", pluralVerb: "have fallen", tail: "compared with the previous month.", distractorCue: "books" },
  { id: "route-buses", domain: "transport", subject: "The number of buses", modifier: "operating on the route during peak hours", singularVerb: "has increased", pluralVerb: "have increased", tail: "after the timetable was revised.", distractorCue: "buses" },
  { id: "online-orders", domain: "commerce", subject: "The number of orders", modifier: "placed through the online store this week", singularVerb: "has risen", pluralVerb: "have risen", tail: "after the discount was announced.", distractorCue: "orders" },
  { id: "sample-errors", domain: "science", subject: "The number of errors", modifier: "detected in the latest sample", singularVerb: "has decreased", pluralVerb: "have decreased", tail: "after the method was improved.", distractorCue: "errors" },
  { id: "road-trees", domain: "environment", subject: "The number of trees", modifier: "planted along the main road this year", singularVerb: "has increased", pluralVerb: "have increased", tail: "under the new plantation drive.", distractorCue: "trees" },
  { id: "clinic-patients", domain: "healthcare", subject: "The number of patients", modifier: "waiting at the clinic in the morning", singularVerb: "has fallen", pluralVerb: "have fallen", tail: "since the new appointment system began.", distractorCue: "patients" },
  { id: "factory-machines", domain: "technology", subject: "The number of machines", modifier: "requiring repair in the workshop", singularVerb: "has decreased", pluralVerb: "have decreased", tail: "after regular servicing was introduced.", distractorCue: "machines" },
] as const;

export const ADDITIVE_BUNDLES: readonly AdditiveBundle[] = [
  { id: "principal-teachers", domain: "education", difficulty: "medium", subject: "The principal", additive: "along with several teachers", correctVerb: "is attending", wrongVerb: "are attending", tail: "the annual education conference today.", subjectHead: "principal", distractorCue: "teachers", mainNumber: "singular" },
  { id: "shop-owner-assistants", domain: "commerce", difficulty: "medium", subject: "The shop owner", additive: "together with two assistants", correctVerb: "is checking", wrongVerb: "are checking", tail: "the stock before the store opens.", subjectHead: "shop owner", distractorCue: "assistants", mainNumber: "singular" },
  { id: "players-coach", domain: "sports", difficulty: "medium", subject: "The players", additive: "as well as the coach", correctVerb: "are practising", wrongVerb: "is practising", tail: "on the main field this morning.", subjectHead: "players", distractorCue: "coach", mainNumber: "plural" },
  { id: "lab-supervisor-technicians", domain: "science", difficulty: "medium", subject: "The laboratory supervisor", additive: "along with two technicians", correctVerb: "is reviewing", wrongVerb: "are reviewing", tail: "the test results this afternoon.", subjectHead: "laboratory supervisor", distractorCue: "technicians", mainNumber: "singular" },
  { id: "drivers-conductor", domain: "transport", difficulty: "medium", subject: "The drivers", additive: "together with the conductor", correctVerb: "are reporting", wrongVerb: "is reporting", tail: "for duty before sunrise.", subjectHead: "drivers", distractorCue: "conductor", mainNumber: "plural" },
  { id: "farmer-workers", domain: "agriculture", difficulty: "medium", subject: "The farmer", additive: "as well as his workers", correctVerb: "is preparing", wrongVerb: "are preparing", tail: "the field for sowing.", subjectHead: "farmer", distractorCue: "workers", mainNumber: "singular" },
  { id: "timetable-instructions", domain: "education", difficulty: "hard", subject: "The final timetable", additive: "as well as the examination instructions", correctVerb: "has been displayed", wrongVerb: "have been displayed", tail: "on the notice board near the entrance.", subjectHead: "timetable", distractorCue: "instructions", mainNumber: "singular" },
  { id: "road-service-lanes", domain: "infrastructure", difficulty: "hard", subject: "The main road", additive: "along with the adjoining service lanes", correctVerb: "is being repaired", wrongVerb: "are being repaired", tail: "in several stages this month.", subjectHead: "road", distractorCue: "service lanes", mainNumber: "singular" },
  { id: "research-paper-tables", domain: "science", difficulty: "hard", subject: "The research paper", additive: "together with its supplementary tables", correctVerb: "has been submitted", wrongVerb: "have been submitted", tail: "for independent review.", subjectHead: "research paper", distractorCue: "tables", mainNumber: "singular" },
  { id: "train-engine-coaches", domain: "transport", difficulty: "hard", subject: "The train engine", additive: "as well as the attached coaches", correctVerb: "was inspected", wrongVerb: "were inspected", tail: "before the overnight journey.", subjectHead: "train engine", distractorCue: "coaches", mainNumber: "singular" },
  { id: "product-price-charges", domain: "commerce", difficulty: "hard", subject: "The price of the new model", additive: "along with the delivery charges", correctVerb: "has increased", wrongVerb: "have increased", tail: "since the beginning of the month.", subjectHead: "price", distractorCue: "charges", mainNumber: "singular" },
] as const;

export const PROXIMITY_BUNDLES: readonly ProximityBundle[] = [
  { id: "teacher-students", domain: "education", difficulty: "medium", subject: "Either the teacher or the students", correctVerb: "are presenting", wrongVerb: "is presenting", tail: "the project during the morning session.", nearerSubject: "students", nearerNumber: "plural", distractorCue: "teacher" },
  { id: "drivers-conductor", domain: "transport", difficulty: "medium", subject: "Neither the drivers nor the conductor", correctVerb: "was available", wrongVerb: "were available", tail: "to answer questions before departure.", nearerSubject: "conductor", nearerNumber: "singular", distractorCue: "drivers" },
  { id: "cashier-assistants", domain: "commerce", difficulty: "medium", subject: "Either the cashier or the sales assistants", correctVerb: "are responsible", wrongVerb: "is responsible", tail: "for arranging the display today.", nearerSubject: "sales assistants", nearerNumber: "plural", distractorCue: "cashier" },
  { id: "players-coach", domain: "sports", difficulty: "medium", subject: "Neither the players nor the coach", correctVerb: "is attending", wrongVerb: "are attending", tail: "the press meeting after the match.", nearerSubject: "coach", nearerNumber: "singular", distractorCue: "players" },
  { id: "technicians-researcher-hard", domain: "science", difficulty: "hard", subject: "Neither the technicians nor the researcher", modifier: "assigned to the night observation team", correctVerb: "is scheduled", wrongVerb: "are scheduled", tail: "to operate the instrument after midnight.", nearerSubject: "researcher", nearerNumber: "singular", distractorCue: "technicians" },
  { id: "doctor-nurses-hard", domain: "healthcare", difficulty: "hard", subject: "Either the doctor or the nurses", modifier: "working in the emergency unit tonight", correctVerb: "are expected", wrongVerb: "is expected", tail: "to remain on duty until morning.", nearerSubject: "nurses", nearerNumber: "plural", distractorCue: "doctor" },
  { id: "manager-drivers-hard", domain: "transport", difficulty: "hard", subject: "Neither the transport manager nor the drivers", modifier: "assigned to the late service", correctVerb: "are available", wrongVerb: "is available", tail: "for the additional trip tonight.", nearerSubject: "drivers", nearerNumber: "plural", distractorCue: "transport manager" },
  { id: "farmers-officer-hard", domain: "agriculture", difficulty: "hard", subject: "Neither the farmers nor the field officer", modifier: "responsible for the demonstration plot", correctVerb: "is attending", wrongVerb: "are attending", tail: "the training programme this afternoon.", nearerSubject: "field officer", nearerNumber: "singular", distractorCue: "farmers" },
] as const;

export const COLLECTIVE_UNIT: readonly CollectiveBundle[] = [
  { id: "team-match", domain: "sports", subject: "The team", correctVerb: "has won", wrongVerb: "have won", segment3: "the final match", segment4: "by a narrow margin.", subjectHead: "team", mode: "unit" },
  { id: "jury-decision", domain: "public-service", subject: "The jury", correctVerb: "has reached", wrongVerb: "have reached", segment3: "a unanimous decision", segment4: "after several hours of discussion.", subjectHead: "jury", mode: "unit" },
  { id: "board-policy", domain: "commerce", subject: "The board", correctVerb: "has approved", wrongVerb: "have approved", segment3: "the new pricing policy", segment4: "at its monthly meeting.", subjectHead: "board", mode: "unit" },
  { id: "panel-winner", domain: "media", subject: "The panel", correctVerb: "has chosen", wrongVerb: "have chosen", segment3: "the winning entry", segment4: "for the final award.", subjectHead: "panel", mode: "unit" },
  { id: "crew-drill", domain: "transport", subject: "The crew", correctVerb: "has completed", wrongVerb: "have completed", segment3: "the safety drill", segment4: "before departure.", subjectHead: "crew", mode: "unit" },
] as const;

export const COLLECTIVE_MEMBER: readonly CollectiveBundle[] = [
  { id: "committee-views", domain: "public-service", subject: "The committee", correctVerb: "were divided", wrongVerb: "was divided", segment3: "in their views", segment4: "on the revised proposal.", subjectHead: "committee", mode: "members" },
  { id: "audience-seats", domain: "media", subject: "The audience", correctVerb: "were taking", wrongVerb: "was taking", segment3: "their seats", segment4: "one by one before the programme began.", subjectHead: "audience", mode: "members" },
  { id: "team-jerseys", domain: "sports", subject: "The team", correctVerb: "were changing", wrongVerb: "was changing", segment3: "their jerseys", segment4: "in separate rooms after practice.", subjectHead: "team", mode: "members" },
  { id: "crew-cabins", domain: "transport", subject: "The crew", correctVerb: "were returning", wrongVerb: "was returning", segment3: "to their cabins", segment4: "one at a time after the drill.", subjectHead: "crew", mode: "members" },
] as const;

export const INTERVENING_MEDIUM: readonly InterveningBundle[] = [
  { id: "price-vegetables", domain: "commerce", subject: "The price of fresh vegetables", modifier: "at the local market", correctVerb: "has risen", wrongVerb: "have risen", tail: "during the past week.", subjectHead: "price", distractorCue: "vegetables" },
  { id: "condition-roads", domain: "infrastructure", subject: "The condition of the roads", modifier: "after the heavy rain", correctVerb: "remains", wrongVerb: "remain", tail: "a matter of concern.", subjectHead: "condition", distractorCue: "roads" },
  { id: "quality-water", domain: "environment", subject: "The quality of the water samples", modifier: "collected from the reservoir", correctVerb: "has improved", wrongVerb: "have improved", tail: "since the treatment plant was upgraded.", subjectHead: "quality", distractorCue: "water samples" },
  { id: "accuracy-readings", domain: "science", subject: "The accuracy of the readings", modifier: "recorded by these instruments", correctVerb: "has improved", wrongVerb: "have improved", tail: "after recalibration.", subjectHead: "accuracy", distractorCue: "readings / instruments" },
  { id: "colour-curtains", domain: "household", subject: "The colour of these curtains", modifier: "in the front room", correctVerb: "matches", wrongVerb: "match", tail: "the lighter shade on the walls.", subjectHead: "colour", distractorCue: "curtains" },
  { id: "availability-seats", domain: "transport", subject: "The availability of seats", modifier: "on the morning buses", correctVerb: "remains", wrongVerb: "remain", tail: "limited during the holiday period.", subjectHead: "availability", distractorCue: "seats / buses" },
] as const;

export const INTERVENING_HARD: readonly InterveningBundle[] = [
  { id: "cost-tickets-shows", domain: "hospitality", subject: "The cost of tickets", modifier: "for the evening shows at the cultural centre", correctVerb: "has increased", wrongVerb: "have increased", tail: "since the new season began.", subjectHead: "cost", distractorCue: "tickets / shows" },
  { id: "performance-panels-rooftops", domain: "technology", subject: "The performance of the solar panels", modifier: "installed on the roofs of the new buildings", correctVerb: "has improved", wrongVerb: "have improved", tail: "after regular cleaning was introduced.", subjectHead: "performance", distractorCue: "panels / roofs / buildings" },
  { id: "condition-books-cupboards", domain: "education", subject: "The condition of the books", modifier: "stored in the old cupboards near the reading room", correctVerb: "has worsened", wrongVerb: "have worsened", tail: "because of persistent dampness.", subjectHead: "condition", distractorCue: "books / cupboards" },
  { id: "reliability-reports-teams", domain: "science", subject: "The reliability of the reports", modifier: "prepared by the field teams during the survey", correctVerb: "remains", wrongVerb: "remain", tail: "under close review.", subjectHead: "reliability", distractorCue: "reports / teams" },
  { id: "supply-medicines-clinics", domain: "healthcare", subject: "The supply of essential medicines", modifier: "to the smaller clinics in the district", correctVerb: "has improved", wrongVerb: "have improved", tail: "during the past two months.", subjectHead: "supply", distractorCue: "medicines / clinics" },
  { id: "growth-crops-fields", domain: "agriculture", subject: "The growth of the crops", modifier: "planted in the two experimental fields", correctVerb: "has slowed", wrongVerb: "have slowed", tail: "after several weeks of dry weather.", subjectHead: "growth", distractorCue: "crops / fields" },
] as const;
