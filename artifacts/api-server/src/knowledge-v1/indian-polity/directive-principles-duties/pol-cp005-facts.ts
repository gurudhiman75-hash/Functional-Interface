export type PolCp005Sourced = {
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp005DpspRow = PolCp005Sourced & {
  article: string;
  subject: string;
  simpleRule: string;
};

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const A42 = "CONSTITUTION-42ND-AMENDMENT-1976";
const A86 = "CONSTITUTION-86TH-AMENDMENT-2002";
const A97 = "CONSTITUTION-97TH-AMENDMENT-2011";
const src = (id: string, sourceIds: readonly string[] = [C]) => ({ sourceIds, sourceFactIds: [id] as const });

export const POL_CP005_DPSP_ARTICLES_V1: readonly PolCp005DpspRow[] = Object.freeze([
  { article: "36", subject: "Definition of State for Part IV", simpleRule: "Article 36 gives 'State' the same meaning as in Part III unless the context otherwise requires.", ...src("pol-cp005-a36-state") },
  { article: "37", subject: "Application of Directive Principles", simpleRule: "Article 37 says Directive Principles are not enforceable by any court, but they are fundamental in the governance of the country and the State must apply them in making laws.", ...src("pol-cp005-a37-application") },
  { article: "38", subject: "Social order for welfare and reduction of inequalities", simpleRule: "Article 38 directs the State to promote welfare through a social order informed by justice and to minimise inequalities in income, status, facilities and opportunities.", ...src("pol-cp005-a38-welfare") },
  { article: "39", subject: "Certain principles of policy", simpleRule: "Article 39 includes adequate livelihood, distribution of material resources for the common good, prevention of concentration of wealth, equal pay for equal work, protection of workers and opportunities for children.", ...src("pol-cp005-a39-policy") },
  { article: "39A", subject: "Equal justice and free legal aid", simpleRule: "Article 39A directs the State to secure equal justice and provide free legal aid so that justice is not denied because of economic or other disabilities.", ...src("pol-cp005-a39a-legal-aid", [C, A42]) },
  { article: "40", subject: "Organisation of village panchayats", simpleRule: "Article 40 directs the State to organise village panchayats and give them powers needed to function as units of self-government.", ...src("pol-cp005-a40-panchayats") },
  { article: "41", subject: "Right to work, education and public assistance in certain cases", simpleRule: "Article 41 asks the State, within its economic capacity and development, to make effective provision for work, education and public assistance in specified cases.", ...src("pol-cp005-a41-work-education-assistance") },
  { article: "42", subject: "Just and humane conditions of work and maternity relief", simpleRule: "Article 42 directs the State to secure just and humane conditions of work and maternity relief.", ...src("pol-cp005-a42-work-maternity") },
  { article: "43", subject: "Living wage and decent conditions of life for workers", simpleRule: "Article 43 directs the State to secure a living wage and decent standard of life for workers and to promote cottage industries in rural areas.", ...src("pol-cp005-a43-living-wage") },
  { article: "43A", subject: "Workers' participation in management of industries", simpleRule: "Article 43A directs the State to secure workers' participation in the management of undertakings, establishments or other organisations engaged in industry.", ...src("pol-cp005-a43a-workers-management", [C, A42]) },
  { article: "43B", subject: "Promotion of co-operative societies", simpleRule: "Article 43B directs the State to promote voluntary formation, autonomous functioning, democratic control and professional management of co-operative societies.", ...src("pol-cp005-a43b-cooperatives", [C, A97]) },
  { article: "44", subject: "Uniform civil code", simpleRule: "Article 44 directs the State to endeavour to secure a uniform civil code for citizens throughout India.", ...src("pol-cp005-a44-ucc") },
  { article: "45", subject: "Early childhood care and education below six years", simpleRule: "Article 45 directs the State to endeavour to provide early childhood care and education for all children until they complete six years of age.", ...src("pol-cp005-a45-early-childhood", [C, A86]) },
  { article: "46", subject: "Educational and economic interests of weaker sections", simpleRule: "Article 46 directs the State to promote the educational and economic interests of weaker sections, especially Scheduled Castes and Scheduled Tribes, and protect them from social injustice and exploitation.", ...src("pol-cp005-a46-weaker-sections") },
  { article: "47", subject: "Nutrition, standard of living and public health", simpleRule: "Article 47 makes raising nutrition, standard of living and public health primary duties of the State and also addresses intoxicating drinks and harmful drugs except for medicinal purposes.", ...src("pol-cp005-a47-public-health") },
  { article: "48", subject: "Agriculture and animal husbandry", simpleRule: "Article 48 directs the State to organise agriculture and animal husbandry on modern and scientific lines and to take specified steps regarding cattle breeds and slaughter of cows, calves and other milch and draught cattle.", ...src("pol-cp005-a48-agriculture") },
  { article: "48A", subject: "Environment, forests and wildlife", simpleRule: "Article 48A directs the State to protect and improve the environment and safeguard forests and wildlife.", ...src("pol-cp005-a48a-environment", [C, A42]) },
  { article: "49", subject: "Protection of monuments of national importance", simpleRule: "Article 49 requires the State to protect monuments, places and objects of artistic or historic interest declared to be of national importance.", ...src("pol-cp005-a49-monuments") },
  { article: "50", subject: "Separation of judiciary from executive", simpleRule: "Article 50 directs the State to separate the judiciary from the executive in the public services of the State.", ...src("pol-cp005-a50-separation") },
  { article: "51", subject: "International peace and security", simpleRule: "Article 51 directs the State to promote international peace and security, just and honourable relations, respect for international law and settlement of disputes by arbitration.", ...src("pol-cp005-a51-international-peace") },
]);

export const POL_CP005_ARTICLE39_CLAUSES_V1 = Object.freeze([
  { clause: "39(a)", subject: "Adequate means of livelihood for men and women equally", ...src("pol-cp005-a39a-livelihood") },
  { clause: "39(b)", subject: "Distribution of material resources to serve the common good", ...src("pol-cp005-a39b-resources") },
  { clause: "39(c)", subject: "Prevent concentration of wealth and means of production to the common detriment", ...src("pol-cp005-a39c-concentration") },
  { clause: "39(d)", subject: "Equal pay for equal work for men and women", ...src("pol-cp005-a39d-equal-pay") },
  { clause: "39(e)", subject: "Protect health and strength of workers and prevent abuse of tender age", ...src("pol-cp005-a39e-workers") },
  { clause: "39(f)", subject: "Healthy development of children with freedom and dignity and protection from exploitation", ...src("pol-cp005-a39f-children") },
]);

export const POL_CP005_DUTIES_V1 = Object.freeze([
  { clause: "51A(a)", duty: "Abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem", ...src("pol-cp005-duty-a", [C, A42]) },
  { clause: "51A(b)", duty: "Cherish and follow the noble ideals that inspired the national struggle for freedom", ...src("pol-cp005-duty-b", [C, A42]) },
  { clause: "51A(c)", duty: "Uphold and protect the sovereignty, unity and integrity of India", ...src("pol-cp005-duty-c", [C, A42]) },
  { clause: "51A(d)", duty: "Defend the country and render national service when called upon", ...src("pol-cp005-duty-d", [C, A42]) },
  { clause: "51A(e)", duty: "Promote harmony and common brotherhood and renounce practices derogatory to the dignity of women", ...src("pol-cp005-duty-e", [C, A42]) },
  { clause: "51A(f)", duty: "Value and preserve the rich heritage of India's composite culture", ...src("pol-cp005-duty-f", [C, A42]) },
  { clause: "51A(g)", duty: "Protect and improve the natural environment and have compassion for living creatures", ...src("pol-cp005-duty-g", [C, A42]) },
  { clause: "51A(h)", duty: "Develop scientific temper, humanism and the spirit of inquiry and reform", ...src("pol-cp005-duty-h", [C, A42]) },
  { clause: "51A(i)", duty: "Safeguard public property and abjure violence", ...src("pol-cp005-duty-i", [C, A42]) },
  { clause: "51A(j)", duty: "Strive towards excellence in all spheres of individual and collective activity", ...src("pol-cp005-duty-j", [C, A42]) },
  { clause: "51A(k)", duty: "As parent or guardian, provide opportunities for education to a child or ward aged six to fourteen years", ...src("pol-cp005-duty-k", [C, A86]) },
]);

export const POL_CP005_BOUNDARY_FACTS_V1 = Object.freeze([
  { key: "part-iv", statement: "Directive Principles of State Policy are contained in Part IV, Articles 36 to 51.", ...src("pol-cp005-boundary-partiv") },
  { key: "nonjusticiable", statement: "Article 37 makes Directive Principles non-justiciable, but fundamental in the governance of the country.", ...src("pol-cp005-boundary-nonjusticiable") },
  { key: "part-iva", statement: "Fundamental Duties are contained in Part IVA under Article 51A.", ...src("pol-cp005-boundary-partiva", [C, A42]) },
  { key: "duties-count", statement: "Article 51A currently contains eleven Fundamental Duties, clauses (a) to (k).", ...src("pol-cp005-boundary-dutycount", [C, A42, A86]) },
  { key: "original-duties", statement: "The Forty-second Amendment inserted Part IVA and ten Fundamental Duties; the Eighty-sixth Amendment later added clause 51A(k).", ...src("pol-cp005-boundary-duty-amendments", [C, A42, A86]) },
]);

export const POL_CP005_AMENDMENT_LINKS_V1 = Object.freeze([
  { amendment: "Forty-second Amendment", additions: "Articles 39A, 43A and 48A, and Part IVA containing the original ten Fundamental Duties", ...src("pol-cp005-amendment-42", [C, A42]) },
  { amendment: "Eighty-sixth Amendment", additions: "Present Article 45 on early childhood care and Fundamental Duty 51A(k)", ...src("pol-cp005-amendment-86", [C, A86]) },
  { amendment: "Ninety-seventh Amendment", additions: "Article 43B on co-operative societies", ...src("pol-cp005-amendment-97", [C, A97]) },
]);
