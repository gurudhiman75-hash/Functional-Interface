export type PolCp003Sourced = {
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp003PreambleObjectiveRow = PolCp003Sourced & {
  id: string;
  concept: string;
  wording: string;
};

export type PolCp003ArticleRow = PolCp003Sourced & {
  id: string;
  article: number;
  subject: string;
  rule: string;
  domain: "union" | "citizenship";
};

const CONSTITUTION = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const AMENDMENT_42 = "CONSTITUTION-42ND-AMENDMENT-1976";

export const POL_CP003_PREAMBLE_OBJECTIVES_V1: readonly PolCp003PreambleObjectiveRow[] = Object.freeze([
  {
    id: "justice",
    concept: "Justice",
    wording: "social, economic and political",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-preamble-justice"],
  },
  {
    id: "liberty",
    concept: "Liberty",
    wording: "thought, expression, belief, faith and worship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-preamble-liberty"],
  },
  {
    id: "equality",
    concept: "Equality",
    wording: "status and opportunity",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-preamble-equality"],
  },
  {
    id: "fraternity",
    concept: "Fraternity",
    wording: "the dignity of the individual and the unity and integrity of the Nation",
    sourceIds: [CONSTITUTION, AMENDMENT_42],
    sourceFactIds: ["pol-cp003-preamble-fraternity"],
  },
]);

export const POL_CP003_PREAMBLE_STATUS_TERMS_V1 = Object.freeze({
  current: ["Sovereign", "Socialist", "Secular", "Democratic", "Republic"],
  original: ["Sovereign", "Democratic", "Republic"],
  addedBy42nd: ["Socialist", "Secular"],
  integrityChange: "The Forty-second Amendment changed ‘unity of the Nation’ to ‘unity and integrity of the Nation’.",
  adoptionDate: "26 November 1949",
  sourceIds: [CONSTITUTION, AMENDMENT_42] as const,
  sourceFactIds: [
    "pol-cp003-preamble-current-status-terms",
    "pol-cp003-preamble-original-status-terms",
    "pol-cp003-preamble-42nd-socialist-secular-integrity",
    "pol-cp003-preamble-adoption-date",
  ] as const,
});

export const POL_CP003_UNION_ARTICLES_V1: readonly PolCp003ArticleRow[] = Object.freeze([
  {
    id: "article-1",
    article: 1,
    subject: "Name and territory of the Union",
    rule: "Article 1 says, ‘India, that is Bharat, shall be a Union of States.’ India's territory includes the States, the Union territories in the First Schedule, and any territory India may acquire.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-1-union-territory"],
  },
  {
    id: "article-2",
    article: 2,
    subject: "Admission or establishment of new States",
    rule: "Article 2 allows Parliament to admit a new State into the Union or establish a new State by law.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-2-new-states"],
  },
  {
    id: "article-3",
    article: 3,
    subject: "Formation of new States and alteration of areas, boundaries or names of existing States",
    rule: "Article 3 allows Parliament to create a new State or change the area, boundary or name of a State. The Bill needs the President's recommendation. If a State is affected, the President sends the proposal to its Legislature for its views; the Constitution does not make those views binding on Parliament.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-3-state-reorganisation"],
  },
  {
    id: "article-4",
    article: 4,
    subject: "Consequential provisions for laws made under Articles 2 and 3",
    rule: "A law under Articles 2 or 3 may make related changes to the First and Fourth Schedules. Article 4 says such a law is not treated as a constitutional amendment under Article 368.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-4-articles-2-3-consequences"],
  },
]);

export const POL_CP003_CITIZENSHIP_ARTICLES_V1: readonly PolCp003ArticleRow[] = Object.freeze([
  {
    id: "article-5",
    article: 5,
    subject: "Citizenship at the commencement of the Constitution",
    rule: "Article 5 required domicile in India at the start of the Constitution. A person also had to meet at least one condition: birth in India, birth of either parent in India, or ordinary residence in India for at least five years before commencement.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-5-citizenship-commencement"],
  },
  {
    id: "article-6",
    article: 6,
    subject: "Citizenship of certain persons who migrated to India from Pakistan",
    rule: "Article 6 covers certain people who migrated from Pakistan to India. It uses 19 July 1948 as an important dividing date. Certain migrants who came on or after that date needed registration, along with the other constitutional conditions.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-6-migration-from-pakistan"],
  },
  {
    id: "article-7",
    article: 7,
    subject: "Citizenship of certain migrants to Pakistan",
    rule: "Article 7 generally excluded a person who migrated from India to Pakistan after 1 March 1947. It made an exception for a person who later returned to India with a permit for resettlement or permanent return.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-7-migration-to-pakistan"],
  },
  {
    id: "article-8",
    article: 8,
    subject: "Citizenship of certain persons of Indian origin residing outside India",
    rule: "Article 8 covers certain persons of Indian origin living outside India. They could qualify through registration by an Indian diplomatic or consular representative, subject to the constitutional conditions.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-8-indian-origin-abroad"],
  },
  {
    id: "article-9",
    article: 9,
    subject: "Effect of voluntarily acquiring citizenship of a foreign State",
    rule: "Under Article 9, a person who voluntarily acquired citizenship of a foreign State could not claim Indian citizenship under Articles 5, 6 or 8.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-9-foreign-citizenship"],
  },
  {
    id: "article-10",
    article: 10,
    subject: "Continuance of the rights of citizenship",
    rule: "Article 10 says that a person recognised as a citizen under the earlier provisions of Part II continues as a citizen, subject to any law made by Parliament.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-10-continuance"],
  },
  {
    id: "article-11",
    article: 11,
    subject: "Parliament's power to regulate citizenship by law",
    rule: "Article 11 gives Parliament power to make laws on acquisition and termination of citizenship and other citizenship matters.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-11-parliament-power"],
  },
]);

export const POL_CP003_ARTICLE5_CONDITIONS_V1 = Object.freeze([
  "Domicile in India was required.",
  "Being born in India was one qualifying condition.",
  "Having either parent born in India was one qualifying condition.",
  "Ordinary residence in India for at least five years before commencement was one qualifying condition.",
]);

export const POL_CP003_ARTICLE6_RULES_V1 = Object.freeze([
  "For a qualifying migrant who came before 19 July 1948, residence in India since migration was relevant.",
  "For a qualifying migrant who came on or after 19 July 1948, registration was required under Article 6.",
  "For this registration route, the person had to live in India for at least six months immediately before applying.",
]);

export const POL_CP003_SCENARIO_ROWS_V1 = Object.freeze([
  {
    id: "a5-domicile-birth",
    article: 5,
    scenario: "At the start of the Constitution, a person had domicile in India and was born in India.",
    explanation: "Article 5 applies. It required domicile in India plus at least one listed condition, such as birth in India.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a5-domicile-birth"],
  },
  {
    id: "a6-after-july-registration",
    article: 6,
    scenario: "A qualifying migrant came from Pakistan to India on or after 19 July 1948 and applied for registration as a citizen.",
    explanation: "Article 6 applies. It contains the registration route for certain migrants who came from Pakistan on or after 19 July 1948.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a6-registration"],
  },
  {
    id: "a7-return-permit",
    article: 7,
    scenario: "A person migrated from India to Pakistan after 1 March 1947, then returned to India with a permit for resettlement or permanent return.",
    explanation: "Article 7 applies. It contains the rule for migration to Pakistan and the exception for return with this type of permit.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a7-return-permit"],
  },
  {
    id: "a8-origin-abroad",
    article: 8,
    scenario: "A person of Indian origin lived outside India and applied for registration through an Indian diplomatic or consular representative.",
    explanation: "Article 8 applies. It covers certain persons of Indian origin living outside India and registration through an Indian diplomatic or consular representative.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a8-origin-abroad"],
  },
]);