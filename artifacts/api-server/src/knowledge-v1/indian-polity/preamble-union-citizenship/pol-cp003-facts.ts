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
  integrityChange: "The Forty-second Amendment replaced 'unity of the Nation' with 'unity and integrity of the Nation'.",
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
    rule: "India, that is Bharat, shall be a Union of States; the territory of India comprises the territories of the States, the Union territories specified in the First Schedule, and such other territories as may be acquired.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-1-union-territory"],
  },
  {
    id: "article-2",
    article: 2,
    subject: "Admission or establishment of new States",
    rule: "Parliament may by law admit into the Union, or establish, new States on such terms and conditions as it thinks fit.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-2-new-states"],
  },
  {
    id: "article-3",
    article: 3,
    subject: "Formation of new States and alteration of areas, boundaries or names of existing States",
    rule: "Parliament may form a new State and alter the area, boundaries or name of an existing State. A Bill for this purpose requires the President's recommendation, and where a State is affected the President refers the proposal to its Legislature for expressing its views within the specified period.",
    domain: "union",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-3-state-reorganisation"],
  },
  {
    id: "article-4",
    article: 4,
    subject: "Consequential provisions for laws made under Articles 2 and 3",
    rule: "A law under Articles 2 or 3 may amend the First and Fourth Schedules and include supplemental, incidental and consequential provisions; such a law is not deemed a constitutional amendment for the purposes of Article 368.",
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
    rule: "At commencement, a person with domicile in India qualified if born in India, or either parent was born in India, or the person had been ordinarily resident in India for at least five years immediately before commencement.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-5-citizenship-commencement"],
  },
  {
    id: "article-6",
    article: 6,
    subject: "Citizenship of certain persons who migrated to India from Pakistan",
    rule: "Article 6 deals with certain migrants from Pakistan to India. It distinguishes migration before 19 July 1948 from migration on or after that date; the latter category required registration, subject to the constitutional conditions.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-6-migration-from-pakistan"],
  },
  {
    id: "article-7",
    article: 7,
    subject: "Citizenship of certain migrants to Pakistan",
    rule: "A person who migrated from India to Pakistan after 1 March 1947 was generally not deemed an Indian citizen, subject to the exception for return to India under a permit for resettlement or permanent return.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-7-migration-to-pakistan"],
  },
  {
    id: "article-8",
    article: 8,
    subject: "Citizenship of certain persons of Indian origin residing outside India",
    rule: "Article 8 provides for certain persons of Indian origin residing outside India to be deemed citizens if registered by an Indian diplomatic or consular representative under the constitutional conditions.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-8-indian-origin-abroad"],
  },
  {
    id: "article-9",
    article: 9,
    subject: "Effect of voluntarily acquiring citizenship of a foreign State",
    rule: "A person who voluntarily acquired citizenship of a foreign State could not claim citizenship under Articles 5, 6 or 8.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-9-foreign-citizenship"],
  },
  {
    id: "article-10",
    article: 10,
    subject: "Continuance of the rights of citizenship",
    rule: "A person who is or is deemed to be a citizen under the foregoing provisions of Part II continues as a citizen, subject to any law made by Parliament.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-10-continuance"],
  },
  {
    id: "article-11",
    article: 11,
    subject: "Parliament's power to regulate citizenship by law",
    rule: "Parliament may make provisions regarding acquisition and termination of citizenship and all other matters relating to citizenship.",
    domain: "citizenship",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-article-11-parliament-power"],
  },
]);

export const POL_CP003_ARTICLE5_CONDITIONS_V1 = Object.freeze([
  "Domicile in the territory of India was required.",
  "Birth in the territory of India was one qualifying route.",
  "Birth of either parent in the territory of India was one qualifying route.",
  "Ordinary residence in India for at least five years immediately preceding commencement was one qualifying route.",
]);

export const POL_CP003_ARTICLE6_RULES_V1 = Object.freeze([
  "For a qualifying migrant before 19 July 1948, ordinary residence in India since migration was relevant.",
  "For a qualifying migrant on or after 19 July 1948, registration as a citizen was required under Article 6.",
  "For the post-19 July 1948 registration route, at least six months' residence immediately before the application was required.",
]);

export const POL_CP003_SCENARIO_ROWS_V1 = Object.freeze([
  {
    id: "a5-domicile-birth",
    article: 5,
    scenario: "At the commencement of the Constitution, a person had domicile in India and had been born in India.",
    explanation: "Article 5 covered citizenship at commencement and treated domicile plus one of its listed connections, including birth in India, as sufficient.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a5-domicile-birth"],
  },
  {
    id: "a6-after-july-registration",
    article: 6,
    scenario: "A qualifying migrant from Pakistan came to India on or after 19 July 1948 and sought citizenship under the commencement provisions through registration.",
    explanation: "Article 6 contains the special migration-from-Pakistan rules and the registration route for migration on or after 19 July 1948.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a6-registration"],
  },
  {
    id: "a7-return-permit",
    article: 7,
    scenario: "A person had migrated from India to Pakistan after 1 March 1947 but later returned to India under a permit for resettlement or permanent return.",
    explanation: "Article 7 contains the migrant-to-Pakistan rule and its permit-for-return exception.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a7-return-permit"],
  },
  {
    id: "a8-origin-abroad",
    article: 8,
    scenario: "A person of Indian origin was ordinarily residing outside India and applied for registration through an Indian diplomatic or consular representative.",
    explanation: "Article 8 deals with certain persons of Indian origin residing outside India and registration through Indian diplomatic or consular representatives.",
    sourceIds: [CONSTITUTION],
    sourceFactIds: ["pol-cp003-scenario-a8-origin-abroad"],
  },
]);
