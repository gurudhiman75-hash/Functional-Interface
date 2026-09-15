export type EcoCp015Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP015_FACTS_V1: EcoCp015Fact[] = [
  {
    id: "npc-1938",
    label: "National Planning Committee, 1938",
    explanation: "One important pre-independence planning milestone was the National Planning Committee set up by the Indian National Congress in 1938.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["pre-independence-national-planning-committee-1938"],
  },
  {
    id: "planning-ideas-1944-50",
    label: "Pre-independence planning proposals",
    explanation: "Important planning proposals before the Five-Year Plan era included the Bombay Plan and Gandhian Plan in 1944, the People's Plan in 1945 and the Sarvodaya Plan in 1950.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["bombay-gandhian-1944", "peoples-plan-1945", "sarvodaya-plan-1950"],
  },
  {
    id: "planning-commission-1950",
    label: "Planning Commission establishment",
    explanation: "The Planning Commission was established by a Government of India Resolution on 15 March 1950 rather than by a constitutional provision or Act of Parliament.",
    sourceIds: ["NITI-PC-TRANSITION-2014-15", "NITI-PC-DESCRIPTIVE-MEMOIR"],
    sourceFactIds: ["planning-commission-resolution-15-march-1950"],
  },
  {
    id: "planning-commission-role",
    label: "Planning Commission role",
    explanation: "The Planning Commission assessed resources, formulated plans for balanced and effective resource use, set priorities and reviewed implementation as an advisory planning body.",
    sourceIds: ["NITI-PC-DESCRIPTIVE-MEMOIR", "MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["resource-assessment", "plan-formulation", "priority-setting", "review-implementation"],
  },
  {
    id: "ndc-1952",
    label: "National Development Council",
    explanation: "The National Development Council began in 1952 as a Centre-State forum to support national plans, promote common economic policies and encourage balanced development across the country.",
    sourceIds: ["NITI-NDC-1952", "NITI-PC-DESCRIPTIVE-MEMOIR"],
    sourceFactIds: ["ndc-first-meeting-1952", "centre-state-development-forum"],
  },
  {
    id: "first-plan",
    label: "First Five-Year Plan, 1951-56",
    explanation: "The First Five-Year Plan ran from 1951 to 1956, used the Harrod-Domar framework and placed strong emphasis on agriculture, price stability, power and transport in a food-shortage setting.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE", "NITI-PLANNING-COMMISSION-ARCHIVE"],
    sourceFactIds: ["first-plan-1951-56", "first-plan-harrod-domar", "first-plan-agriculture"],
  },
  {
    id: "second-plan",
    label: "Second Five-Year Plan, 1956-61",
    explanation: "The Second Five-Year Plan ran from 1956 to 1961 and used P. C. Mahalanobis's sectoral strategy to emphasise rapid industrialisation and basic and heavy industries.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE", "NITI-PLANNING-COMMISSION-ARCHIVE"],
    sourceFactIds: ["second-plan-1956-61", "mahalanobis-strategy", "heavy-basic-industry"],
  },
  {
    id: "third-plan",
    label: "Third Five-Year Plan, 1961-66",
    explanation: "The Third Five-Year Plan ran from 1961 to 1966 and aimed at a self-reliant, self-generating economy, while restoring high priority to agriculture as a support for industry and exports.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["third-plan-1961-66", "third-plan-self-reliance", "third-plan-agriculture-priority"],
  },
  {
    id: "annual-plans-1966-69",
    label: "Annual Plans / Plan Holiday, 1966-69",
    explanation: "After the Third Plan, three Annual Plans covered 1966-69 before the Fourth Plan began in 1969; this interval is commonly described as the Plan Holiday.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE", "NITI-ANNUAL-PLAN-1968-69"],
    sourceFactIds: ["annual-plans-1966-69", "plan-holiday"],
  },
  {
    id: "fourth-plan",
    label: "Fourth Five-Year Plan, 1969-74",
    explanation: "The Fourth Plan ran from 1969 to 1974 and stressed growth with stability together with progressive achievement of self-reliance.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["fourth-plan-1969-74", "growth-with-stability", "progressive-self-reliance"],
  },
  {
    id: "fifth-plan",
    label: "Fifth Five-Year Plan, 1974-79",
    explanation: "The Fifth Plan was framed for 1974-79 with removal of poverty and attainment of self-reliance as central objectives; it was terminated early in 1978.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["fifth-plan-1974-79", "garibi-hatao-self-reliance", "terminated-1978"],
  },
  {
    id: "rolling-plan",
    label: "Rolling Plan, 1978-80",
    explanation: "A Rolling Plan approach operated during 1978-80 after the Fifth Plan was terminated; it was replaced when a new Sixth Plan began in 1980.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["rolling-plan-1978-80"],
  },
  {
    id: "sixth-plan",
    label: "Sixth Five-Year Plan, 1980-85",
    explanation: "The Sixth Plan ran from 1980 to 1985 and emphasised rising national income, technology modernisation and reduction of poverty and unemployment in an expanding economy.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["sixth-plan-1980-85", "poverty-unemployment-modernisation"],
  },
  {
    id: "seventh-plan",
    label: "Seventh Five-Year Plan, 1985-90",
    explanation: "The Seventh Plan ran from 1985 to 1990 and is strongly associated with the planning emphasis on food, work and productivity.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["seventh-plan-1985-90", "food-work-productivity"],
  },
  {
    id: "annual-plans-1990-92",
    label: "Annual Plans, 1990-92",
    explanation: "Political uncertainty delayed the Eighth Plan, so 1990-91 and 1991-92 were treated as Annual Plans before the Eighth Plan began in 1992.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["annual-plans-1990-91-1991-92", "eighth-plan-delay"],
  },
  {
    id: "eighth-plan",
    label: "Eighth Five-Year Plan, 1992-97",
    explanation: "The Eighth Plan ran from 1992 to 1997 after the start of structural-adjustment and liberalisation policies and marked a planning environment with a declining public-sector share in total investment.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["eighth-plan-1992-97", "post-reform-context"],
  },
  {
    id: "ninth-plan",
    label: "Ninth Five-Year Plan, 1997-2002",
    explanation: "The Ninth Plan ran from 1997 to 2002 and emphasised growth with social justice and equality, with the State increasingly seen as a facilitator alongside a larger private-sector role.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["ninth-plan-1997-2002", "growth-social-justice-equality", "state-facilitator"],
  },
  {
    id: "tenth-plan",
    label: "Tenth Five-Year Plan, 2002-07",
    explanation: "The Tenth Plan ran from 2002 to 2007 and moved beyond growth alone by using monitorable development targets covering social and human-development outcomes.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE", "NITI-PLANNING-COMMISSION-ARCHIVE"],
    sourceFactIds: ["tenth-plan-2002-07", "monitorable-development-targets"],
  },
  {
    id: "eleventh-plan",
    label: "Eleventh Five-Year Plan, 2007-12",
    explanation: "The Eleventh Plan ran from 2007 to 2012 and was framed around faster and more inclusive growth.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE", "NITI-PLANNING-COMMISSION-ARCHIVE"],
    sourceFactIds: ["eleventh-plan-2007-12", "faster-more-inclusive-growth"],
  },
  {
    id: "twelfth-plan",
    label: "Twelfth Five-Year Plan, 2012-17",
    explanation: "The Twelfth Plan covered 2012-17 and emphasised faster, more inclusive and sustainable growth; it was the final Five-Year Plan of the Planning Commission era.",
    sourceIds: ["NITI-PLANNING-COMMISSION-ARCHIVE", "MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["twelfth-plan-2012-17", "faster-inclusive-sustainable-growth"],
  },
  {
    id: "indicative-planning",
    label: "Shift toward indicative planning",
    explanation: "Official planning summaries note that after the early public-sector-heavy plans, Indian planning increasingly moved toward an indicative approach in which Government guides priorities while private-sector decisions also shape investment.",
    sourceIds: ["MOSPI-FIVE-YEAR-PLAN-OUTLINE"],
    sourceFactIds: ["planning-increasingly-indicative"],
  },
  {
    id: "niti-transition",
    label: "NITI Aayog transition, 2015",
    explanation: "NITI Aayog was constituted by Union Cabinet Resolution on 1 January 2015 and replaced the Planning Commission.",
    sourceIds: ["NITI-PC-TRANSITION-2014-15", "NITI-OBJECTIVES-FEATURES"],
    sourceFactIds: ["niti-1-january-2015", "replaced-planning-commission"],
  },
  {
    id: "niti-role",
    label: "NITI Aayog role",
    explanation: "NITI Aayog is the Government of India's apex policy think tank, providing strategic and policy inputs and fostering cooperative federalism through active participation of States.",
    sourceIds: ["NITI-OBJECTIVES-FEATURES", "NITI-PC-TRANSITION-2014-15"],
    sourceFactIds: ["apex-policy-think-tank", "cooperative-federalism", "states-active-participation"],
  },
];

export function ecoCp015Fact(id: string): EcoCp015Fact {
  const fact = ECO_CP015_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-015 fact: ${id}`);
  return fact;
}
