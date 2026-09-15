const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const src = (id: string) => ({ sourceIds: [C] as const, sourceFactIds: [id] as const });

export const POL_CP010_ARTICLES_V1 = Object.freeze([
  { article: "79", subject: "Constitution of Parliament", ...src("pol-cp010-art79") },
  { article: "80", subject: "Composition of Rajya Sabha", ...src("pol-cp010-art80") },
  { article: "81", subject: "Composition of Lok Sabha", ...src("pol-cp010-art81") },
  { article: "82", subject: "Readjustment after each census", ...src("pol-cp010-art82") },
  { article: "83", subject: "Duration of Houses of Parliament", ...src("pol-cp010-art83") },
  { article: "84", subject: "Qualifications for membership of Parliament", ...src("pol-cp010-art84") },
  { article: "85", subject: "Sessions, prorogation and dissolution", ...src("pol-cp010-art85") },
  { article: "86", subject: "President's right to address and send messages", ...src("pol-cp010-art86") },
  { article: "87", subject: "Special address by the President", ...src("pol-cp010-art87") },
  { article: "88", subject: "Rights of Ministers and Attorney-General in Parliament", ...src("pol-cp010-art88") },
  { article: "89", subject: "Chairman and Deputy Chairman of Rajya Sabha", ...src("pol-cp010-art89") },
  { article: "90", subject: "Vacation, resignation and removal of Deputy Chairman", ...src("pol-cp010-art90") },
  { article: "91", subject: "Acting Chairman arrangements", ...src("pol-cp010-art91") },
  { article: "92", subject: "Chairman or Deputy Chairman during removal resolution", ...src("pol-cp010-art92") },
  { article: "93", subject: "Speaker and Deputy Speaker of Lok Sabha", ...src("pol-cp010-art93") },
  { article: "94", subject: "Vacation, resignation and removal of Speaker and Deputy Speaker", ...src("pol-cp010-art94") },
  { article: "95", subject: "Acting Speaker arrangements", ...src("pol-cp010-art95") },
  { article: "96", subject: "Speaker or Deputy Speaker during removal resolution", ...src("pol-cp010-art96") },
  { article: "97", subject: "Salaries and allowances of presiding officers", ...src("pol-cp010-art97") },
  { article: "98", subject: "Secretariat of Parliament", ...src("pol-cp010-art98") },
]);

export const POL_CP010_PARLIAMENT_V1 = Object.freeze({
  components: ["President", "Rajya Sabha", "Lok Sabha"],
  rajyaSabhaMax: 250,
  rajyaSabhaNominated: 12,
  rajyaSabhaRepresentativesMax: 238,
  rajyaSabhaNominationFields: ["Literature", "Science", "Art", "Social service"],
  rajyaSabhaStateElection: "Elected members of the State Legislative Assembly elect State representatives by proportional representation through the single transferable vote.",
  rajyaSabhaSeatSchedule: "Fourth Schedule",
  lokSabhaStatesMax: 530,
  lokSabhaUTMax: 20,
  lokSabhaStateMethod: "Direct election from territorial constituencies in the States",
  rajyaSabhaDissolution: false,
  rajyaSabhaRetirement: "As nearly as possible one-third retire every second year",
  lokSabhaNormalTermYears: 5,
  emergencyExtension: "During a Proclamation of Emergency, Parliament may extend Lok Sabha by law for not more than one year at a time and not beyond six months after the Emergency ends.",
  ...src("pol-cp010-parliament-structure"),
});

export const POL_CP010_MEMBERSHIP_V1 = Object.freeze({
  citizenRequired: true,
  electionOathAuthority: "A person authorised by the Election Commission",
  electionOathSchedule: "Third Schedule",
  rajyaSabhaMinAge: 30,
  lokSabhaMinAge: 25,
  otherQualifications: "As prescribed by or under a law made by Parliament",
  ...src("pol-cp010-membership-qualifications"),
});

export const POL_CP010_SESSIONS_V1 = Object.freeze({
  summons: "President",
  maxGap: "Six months shall not intervene between the last sitting of one session and the first sitting of the next session",
  prorogation: "President may prorogue either House",
  dissolution: "President may dissolve Lok Sabha",
  ordinaryAddress: "President may address either House or both Houses assembled together and may send messages to either House",
  specialAddress: "At the first session after each general election to Lok Sabha and the first session of each year, the President addresses both Houses assembled together",
  article88: "Ministers and the Attorney-General may speak and participate in either House, a joint sitting and named committees, but Article 88 itself gives no right to vote",
  ...src("pol-cp010-sessions-address-rights"),
});

export const POL_CP010_RAJSABHA_OFFICERS_V1 = Object.freeze({
  chairman: "Vice-President of India",
  chairmanStatus: "Ex officio Chairman of Rajya Sabha",
  deputyChairmanChoice: "Rajya Sabha chooses one of its members as Deputy Chairman",
  deputyResignationTo: "Chairman",
  deputyRemovalMajority: "Majority of all the then members of Rajya Sabha",
  deputyRemovalNoticeDays: 14,
  chairmanVacancyFirst: "Deputy Chairman",
  bothVacantAppointment: "A member of Rajya Sabha appointed by the President",
  removalPresidingRule: "The officer whose removal resolution is under consideration does not preside",
  chairmanRemovalVote: "While the Vice-President's removal resolution is under consideration, the Chairman may speak and take part but cannot vote at all",
  ...src("pol-cp010-rajya-sabha-officers"),
});

export const POL_CP010_LOKSABHA_OFFICERS_V1 = Object.freeze({
  choice: "Lok Sabha chooses two of its members as Speaker and Deputy Speaker",
  speakerResignationTo: "Deputy Speaker",
  deputySpeakerResignationTo: "Speaker",
  removalMajority: "Majority of all the then members of Lok Sabha",
  removalNoticeDays: 14,
  speakerAfterDissolution: "Speaker continues until immediately before the first meeting of the new Lok Sabha",
  speakerVacancyFirst: "Deputy Speaker",
  bothVacantAppointment: "A member of Lok Sabha appointed by the President",
  removalPresidingRule: "The officer whose removal resolution is under consideration does not preside",
  speakerRemovalVote: "During a resolution for the Speaker's removal, the Speaker may vote in the first instance but not in case of equality of votes",
  ...src("pol-cp010-lok-sabha-officers"),
});

export const POL_CP010_SUPPORT_V1 = Object.freeze({
  presidingOfficerSalaries: "Fixed by Parliament by law; until then, the Second Schedule applies",
  secretariat: "Each House has separate secretarial staff, though common posts are allowed",
  secretariatLaw: "Parliament may regulate recruitment and service conditions by law",
  interimSecretariatRules: "Until Parliament makes such law, the President may make rules after consultation with the Speaker or Chairman, as applicable",
  ...src("pol-cp010-support-structure"),
});
