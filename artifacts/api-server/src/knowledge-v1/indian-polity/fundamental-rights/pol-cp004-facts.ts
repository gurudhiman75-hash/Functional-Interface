export type PolCp004Sourced = {
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp004ArticleRow = PolCp004Sourced & {
  article: string;
  subject: string;
  simpleRule: string;
  holder: "all persons" | "citizens" | "minorities" | "religious denominations" | "institutional/procedural";
  group: "general" | "equality" | "freedom" | "exploitation" | "religion" | "cultural" | "remedies" | "special";
};

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const src = (id: string) => ({ sourceIds: [C] as const, sourceFactIds: [id] as const });

export const POL_CP004_ARTICLES_V1: readonly PolCp004ArticleRow[] = Object.freeze([
  { article: "12", subject: "Definition of State for Part III", simpleRule: "Article 12 defines 'State' for Fundamental Rights. It includes the Union and State governments and legislatures, local authorities and other authorities within the constitutional scope.", holder: "institutional/procedural", group: "general", ...src("pol-cp004-a12-state-definition") },
  { article: "13", subject: "Laws inconsistent with Fundamental Rights", simpleRule: "Article 13 makes laws void to the extent that they violate Fundamental Rights, subject to the constitutional text.", holder: "institutional/procedural", group: "general", ...src("pol-cp004-a13-inconsistent-laws") },
  { article: "14", subject: "Equality before law and equal protection of laws", simpleRule: "Article 14 protects every person through equality before law and equal protection of the laws.", holder: "all persons", group: "equality", ...src("pol-cp004-a14-equality") },
  { article: "15", subject: "Prohibition of discrimination", simpleRule: "Article 15 protects citizens against discrimination by the State on the listed grounds and also permits specified special provisions under the Constitution.", holder: "citizens", group: "equality", ...src("pol-cp004-a15-discrimination") },
  { article: "16", subject: "Equality of opportunity in public employment", simpleRule: "Article 16 gives citizens equality of opportunity in matters of public employment, subject to the constitutional exceptions and reservation provisions.", holder: "citizens", group: "equality", ...src("pol-cp004-a16-public-employment") },
  { article: "17", subject: "Abolition of untouchability", simpleRule: "Article 17 abolishes untouchability and forbids its practice in any form.", holder: "all persons", group: "equality", ...src("pol-cp004-a17-untouchability") },
  { article: "18", subject: "Abolition of titles", simpleRule: "Article 18 bars the State from conferring titles other than military or academic distinctions and restricts citizens from accepting titles from foreign States.", holder: "citizens", group: "equality", ...src("pol-cp004-a18-titles") },
  { article: "19", subject: "Six freedoms of citizens", simpleRule: "Article 19 gives citizens six freedoms: speech and expression; peaceful assembly without arms; associations or unions or co-operative societies; movement; residence and settlement; and profession, occupation, trade or business, subject to constitutional restrictions.", holder: "citizens", group: "freedom", ...src("pol-cp004-a19-six-freedoms") },
  { article: "20", subject: "Protection in respect of conviction for offences", simpleRule: "Article 20 protects against ex post facto criminal punishment, double jeopardy and compelled self-incrimination.", holder: "all persons", group: "freedom", ...src("pol-cp004-a20-criminal-protections") },
  { article: "21", subject: "Protection of life and personal liberty", simpleRule: "Article 21 says no person shall be deprived of life or personal liberty except according to procedure established by law.", holder: "all persons", group: "freedom", ...src("pol-cp004-a21-life-liberty") },
  { article: "21A", subject: "Right to education", simpleRule: "Article 21A requires the State to provide free and compulsory education to children from six to fourteen years of age in the manner provided by law.", holder: "citizens", group: "freedom", ...src("pol-cp004-a21a-education") },
  { article: "22", subject: "Protection against arrest and detention in certain cases", simpleRule: "Article 22 gives safeguards such as being informed of grounds of arrest, consulting a lawyer and production before a magistrate within twenty-four hours, subject to the constitutional exceptions including preventive detention provisions.", holder: "all persons", group: "freedom", ...src("pol-cp004-a22-arrest-detention") },
  { article: "23", subject: "Prohibition of trafficking and forced labour", simpleRule: "Article 23 prohibits traffic in human beings, begar and other similar forms of forced labour.", holder: "all persons", group: "exploitation", ...src("pol-cp004-a23-trafficking-forced-labour") },
  { article: "24", subject: "Prohibition of child labour in hazardous employment", simpleRule: "Article 24 prohibits employment of children below fourteen years in factories, mines or other hazardous employment covered by the Article.", holder: "all persons", group: "exploitation", ...src("pol-cp004-a24-child-labour") },
  { article: "25", subject: "Freedom of conscience and religion", simpleRule: "Article 25 gives all persons freedom of conscience and the right freely to profess, practise and propagate religion, subject to public order, morality, health and the other provisions of Part III.", holder: "all persons", group: "religion", ...src("pol-cp004-a25-religion") },
  { article: "26", subject: "Freedom to manage religious affairs", simpleRule: "Article 26 gives every religious denomination or section of it rights to manage religious affairs, subject to public order, morality and health.", holder: "religious denominations", group: "religion", ...src("pol-cp004-a26-religious-affairs") },
  { article: "27", subject: "Freedom from tax for promotion of a particular religion", simpleRule: "Article 27 says a person cannot be compelled to pay a tax whose proceeds are specifically used to promote or maintain a particular religion or religious denomination.", holder: "all persons", group: "religion", ...src("pol-cp004-a27-religious-tax") },
  { article: "28", subject: "Religious instruction in educational institutions", simpleRule: "Article 28 regulates religious instruction and worship in educational institutions, including a bar on religious instruction in institutions wholly maintained from State funds, subject to its stated exception.", holder: "all persons", group: "religion", ...src("pol-cp004-a28-religious-instruction") },
  { article: "29", subject: "Protection of interests of minorities and cultural groups", simpleRule: "Article 29 protects the right of any section of citizens with a distinct language, script or culture to conserve it and protects citizens from specified admission discrimination in State-maintained or State-aided educational institutions.", holder: "citizens", group: "cultural", ...src("pol-cp004-a29-culture-admission") },
  { article: "30", subject: "Right of minorities to establish and administer educational institutions", simpleRule: "Article 30 gives religious and linguistic minorities the right to establish and administer educational institutions of their choice.", holder: "minorities", group: "cultural", ...src("pol-cp004-a30-minority-education") },
  { article: "32", subject: "Constitutional remedies for enforcement of Fundamental Rights", simpleRule: "Article 32 guarantees the right to move the Supreme Court for enforcement of Fundamental Rights and empowers it to issue constitutional writs.", holder: "all persons", group: "remedies", ...src("pol-cp004-a32-remedies") },
  { article: "33", subject: "Parliament's power to modify rights for specified forces and services", simpleRule: "Article 33 allows Parliament to restrict or modify Fundamental Rights for specified armed forces, public-order forces, intelligence organisations and related services to ensure proper discharge of duties and discipline.", holder: "institutional/procedural", group: "special", ...src("pol-cp004-a33-forces") },
  { article: "34", subject: "Restriction of rights while martial law is in force", simpleRule: "Article 34 allows Parliament to indemnify acts and make related provisions where martial law was in force in an area.", holder: "institutional/procedural", group: "special", ...src("pol-cp004-a34-martial-law") },
  { article: "35", subject: "Parliament's exclusive legislative power on specified Part III matters", simpleRule: "Article 35 reserves specified Fundamental Rights-related law-making matters to Parliament.", holder: "institutional/procedural", group: "special", ...src("pol-cp004-a35-parliament-power") },
]);

export const POL_CP004_ARTICLE19_FREEDOMS_V1 = Object.freeze([
  "Freedom of speech and expression",
  "Freedom to assemble peaceably and without arms",
  "Freedom to form associations or unions or co-operative societies",
  "Freedom to move freely throughout the territory of India",
  "Freedom to reside and settle in any part of India",
  "Freedom to practise any profession or carry on any occupation, trade or business",
]);

export const POL_CP004_ARTICLE19_SPEECH_RESTRICTIONS_V1 = Object.freeze([
  "Sovereignty and integrity of India",
  "Security of the State",
  "Friendly relations with foreign States",
  "Public order",
  "Decency or morality",
  "Contempt of court",
  "Defamation",
  "Incitement to an offence",
]);

export const POL_CP004_ARTICLE20_PROTECTIONS_V1 = Object.freeze([
  { label: "Ex post facto criminal law", meaning: "A person cannot be convicted for an act that was not an offence when it was done, or receive a greater penalty than the law then allowed." },
  { label: "Double jeopardy", meaning: "A person cannot be prosecuted and punished for the same offence more than once." },
  { label: "Self-incrimination", meaning: "An accused person cannot be compelled to be a witness against himself or herself." },
]);

export const POL_CP004_ARTICLE22_SAFEGUARDS_V1 = Object.freeze([
  "The arrested person must be informed of the grounds of arrest as soon as possible.",
  "The arrested person must not be denied the right to consult and be defended by a legal practitioner of choice.",
  "The arrested person must be produced before the nearest magistrate within twenty-four hours, excluding journey time.",
  "Detention beyond that period requires the authority of a magistrate, subject to the constitutional scheme.",
]);

export const POL_CP004_WRITS_V1 = Object.freeze([
  { writ: "Habeas Corpus", purpose: "To secure release from unlawful detention", cue: "unlawful detention" },
  { writ: "Mandamus", purpose: "To command a public authority to perform a public duty", cue: "public duty not performed" },
  { writ: "Prohibition", purpose: "To stop a lower court or tribunal from continuing proceedings beyond its jurisdiction", cue: "stop proceedings before decision" },
  { writ: "Certiorari", purpose: "To quash an order or proceeding of a lower court or tribunal on recognised grounds", cue: "quash an order already made" },
  { writ: "Quo Warranto", purpose: "To question a person's legal authority to hold a public office", cue: "authority to hold public office" },
].map((row) => ({ ...row, ...src(`pol-cp004-writ-${row.writ.toLowerCase().replace(/\s+/g, "-")}`) })));

export const POL_CP004_RIGHT_HOLDERS_V1 = Object.freeze([
  { right: "Article 14 equality before law", holder: "All persons" },
  { right: "Article 15 protection against listed discrimination", holder: "Citizens" },
  { right: "Article 16 equality of opportunity in public employment", holder: "Citizens" },
  { right: "Article 19 freedoms", holder: "Citizens" },
  { right: "Article 20 protections in criminal cases", holder: "All persons" },
  { right: "Article 21 life and personal liberty", holder: "All persons" },
  { right: "Article 25 freedom of conscience and religion", holder: "All persons" },
  { right: "Article 30 minority educational rights", holder: "Religious and linguistic minorities" },
]);

export const POL_CP004_BOUNDARY_FACTS_V1 = Object.freeze([
  { key: "property", statement: "The right to property is not a Fundamental Right. It is protected separately by Article 300A as a constitutional right." },
  { key: "part", statement: "Fundamental Rights are mainly contained in Part III of the Constitution." },
  { key: "range", statement: "Part III runs from Articles 12 to 35, though some article numbers within the sequence have been omitted or inserted over time." },
  { key: "article32", statement: "The right to move the Supreme Court under Article 32 for enforcement of Fundamental Rights is itself guaranteed in Part III." },
].map((row) => ({ ...row, ...src(`pol-cp004-boundary-${row.key}`) })));
