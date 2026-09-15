import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp015Fact } from "./eco-cp015-facts";
import type { EcoCp015ReviewQuestion } from "./eco-cp015-review-types";

const qlNames: Record<number, string> = {
  1: "Pre-independence planning and Planning Commission origin",
  2: "Planning Commission functions and National Development Council",
  3: "First Five-Year Plan",
  4: "Second Five-Year Plan",
  5: "Third Plan and Plan Holiday",
  6: "Fourth Plan, Fifth Plan and Rolling Plan",
  7: "Sixth/Seventh Plans and 1990-92 Annual Plans",
  8: "Eighth and Ninth Plans",
  9: "Tenth, Eleventh and Twelfth Plans",
  10: "NITI Aayog transition and role",
  11: "Planning approaches and federal participation",
  12: "Chronology and mixed distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql === 1) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 2) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  if (ql === 3 || ql === 4) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if (ql === 5) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 6) return row < 2 ? "Medium" : "Hard";
  if (ql === 7) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  if (ql === 8) return row < 2 ? "Medium" : "Hard";
  if (ql === 9) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  if (ql === 10) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 11) return row < 2 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp015Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

const qlCases: Record<number, Case[]> = {
  1: [
    {
      stem: "Which body was set up by the Indian National Congress in 1938 as an early planning initiative?",
      correct: "National Planning Committee",
      options: ["National Planning Committee", "National Development Council", "Planning Commission", "NITI Aayog"],
      explanation: "The National Planning Committee was set up in 1938, well before the post-independence Five-Year Plan system began.",
      factIds: ["npc-1938"],
    },
    {
      stem: "Which sequence of pre-Five-Year-Plan proposals is chronologically correct?",
      correct: "National Planning Committee → Bombay/Gandhian Plans → People's Plan → Sarvodaya Plan",
      options: ["National Planning Committee → Bombay/Gandhian Plans → People's Plan → Sarvodaya Plan", "Bombay/Gandhian Plans → National Planning Committee → Sarvodaya Plan → People's Plan", "People's Plan → National Planning Committee → Bombay/Gandhian Plans → Sarvodaya Plan", "Sarvodaya Plan → People's Plan → National Planning Committee → Bombay/Gandhian Plans"],
      explanation: "The sequence is 1938, 1944, 1945 and 1950 respectively. These proposals show that planning debates pre-dated the official Five-Year Plan era.",
      factIds: ["npc-1938", "planning-ideas-1944-50"],
    },
    {
      stem: "How was the Planning Commission established in 1950?",
      correct: "By a Government of India Resolution",
      options: ["By a Government of India Resolution", "By a constitutional amendment", "By an Act of Parliament creating a statutory body", "By a Reserve Bank notification"],
      explanation: "The Planning Commission was created by Government Resolution on 15 March 1950. It was not created by the Constitution or a separate statute.",
      factIds: ["planning-commission-1950"],
    },
    {
      stem: "Which statement correctly describes the institutional status of the former Planning Commission?",
      correct: "It was an advisory planning body created by executive resolution",
      options: ["It was an advisory planning body created by executive resolution", "It was a constitutional court for economic disputes", "It was a statutory regulator created by the RBI Act", "It was a parliamentary committee established under Article 112"],
      explanation: "The Planning Commission was an advisory planning institution created by Government Resolution, not a constitutional or statutory regulator.",
      factIds: ["planning-commission-1950", "planning-commission-role"],
    },
  ],
  2: [
    {
      stem: "Which task formed part of the Planning Commission's core role?",
      correct: "Assessing resources and formulating development priorities",
      options: ["Assessing resources and formulating development priorities", "Issuing currency notes", "Regulating stock exchanges", "Adjudicating tax appeals"],
      explanation: "The Commission assessed resources, formulated plans and priorities, and reviewed implementation as an advisory planning body.",
      factIds: ["planning-commission-role"],
    },
    {
      stem: "What was the main institutional purpose of the National Development Council in the planning era?",
      correct: "To provide a Centre-State forum for national development and Plan coordination",
      options: ["To provide a Centre-State forum for national development and Plan coordination", "To conduct monetary policy", "To regulate commercial banks", "To administer customs duties"],
      explanation: "The NDC brought the Centre and States together to review national plans, discuss common economic policies and support balanced development.",
      factIds: ["ndc-1952"],
    },
    {
      stem: "Which distinction between the Planning Commission and the National Development Council is correct?",
      correct: "The Commission formulated and reviewed plans, while the NDC served as a broader Centre-State development forum",
      options: ["The Commission formulated and reviewed plans, while the NDC served as a broader Centre-State development forum", "The NDC issued currency, while the Commission regulated banks", "The Commission was a court, while the NDC was a tax authority", "Both institutions performed only monetary-policy functions"],
      explanation: "The Planning Commission was the apex advisory planning body, whereas the NDC was designed as a forum for Centre-State cooperation around national development and Plan implementation.",
      factIds: ["planning-commission-role", "ndc-1952"],
    },
  ],
  3: [
    {
      stem: "During which period did India's First Five-Year Plan operate?",
      correct: "1951-56",
      options: ["1951-56", "1956-61", "1961-66", "1969-74"],
      explanation: "India's First Five-Year Plan began in 1951 and covered the period up to 1956.",
      factIds: ["first-plan"],
    },
    {
      stem: "Which sector received the strongest emphasis in the First Five-Year Plan?",
      correct: "Agriculture",
      options: ["Agriculture", "Heavy basic industry", "Information technology", "Capital-market liberalisation"],
      explanation: "Food shortage and inflation made agriculture a central priority of the First Plan, along with price stability, power and transport.",
      factIds: ["first-plan"],
    },
    {
      stem: "Which growth framework was used in the First Five-Year Plan?",
      correct: "Harrod-Domar framework",
      options: ["Harrod-Domar framework", "Mahalanobis sectoral strategy", "Rolling Plan framework", "Indicative planning without a Five-Year horizon"],
      explanation: "The First Plan used the Harrod-Domar framework for its planning approach. The Mahalanobis strategy is identified more closely with the Second Plan.",
      factIds: ["first-plan", "second-plan"],
    },
    {
      stem: "A question contrasts an agriculture-first plan with a later heavy-industry plan. Which pairing is correct?",
      correct: "First Plan—agriculture; Second Plan—heavy and basic industries",
      options: ["First Plan—agriculture; Second Plan—heavy and basic industries", "First Plan—heavy industry; Second Plan—agriculture only", "First Plan—liberalisation; Second Plan—Rolling Plan", "First Plan—NITI Aayog; Second Plan—Plan Holiday"],
      explanation: "The First Plan responded to food and agricultural constraints, while the Second Plan shifted strongly toward rapid industrialisation and basic and heavy industries.",
      factIds: ["first-plan", "second-plan"],
    },
  ],
  4: [
    {
      stem: "Which economist's planning strategy is most closely linked with the Second Five-Year Plan?",
      correct: "P. C. Mahalanobis",
      options: ["P. C. Mahalanobis", "Dadabhai Naoroji", "M. Visvesvaraya", "Amartya Sen"],
      explanation: "The Second Plan's sectoral resource-allocation strategy was based on models prepared by P. C. Mahalanobis.",
      factIds: ["second-plan"],
    },
    {
      stem: "What was the main sectoral thrust of the Second Five-Year Plan?",
      correct: "Rapid industrialisation through heavy and basic industries",
      options: ["Rapid industrialisation through heavy and basic industries", "Agriculture as the sole development sector", "Replacing planning with annual budgets", "Complete withdrawal of the public sector"],
      explanation: "The Second Plan placed strong emphasis on rapid industrialisation, especially heavy and basic industries.",
      factIds: ["second-plan"],
    },
    {
      stem: "Which period corresponds to the Second Five-Year Plan?",
      correct: "1956-61",
      options: ["1956-61", "1951-56", "1961-66", "1974-79"],
      explanation: "The Second Five-Year Plan followed the First Plan and covered 1956 to 1961.",
      factIds: ["second-plan"],
    },
    {
      stem: "Which distinction between the First and Second Plans is most accurate?",
      correct: "The First Plan stressed agriculture, while the Second shifted toward Mahalanobis-led heavy industrialisation",
      options: ["The First Plan stressed agriculture, while the Second shifted toward Mahalanobis-led heavy industrialisation", "Both Plans were Rolling Plans", "The First Plan began after the 1991 reforms, while the Second preceded independence", "The First Plan focused on GST, while the Second focused on monetary policy"],
      explanation: "The major strategic shift was from the First Plan's agriculture-centred response to the Second Plan's heavy-industry and Mahalanobis strategy.",
      factIds: ["first-plan", "second-plan"],
    },
  ],
  5: [
    {
      stem: "What broad objective was central to the Third Five-Year Plan?",
      correct: "Building a self-reliant and self-generating economy",
      options: ["Building a self-reliant and self-generating economy", "Ending all public-sector investment", "Creating NITI Aayog", "Introducing GST"],
      explanation: "The Third Plan aimed to move the economy toward self-reliance and self-generation, while giving renewed importance to agriculture.",
      factIds: ["third-plan"],
    },
    {
      stem: "Why did agriculture receive high priority again in the Third Plan?",
      correct: "Agricultural output was seen as a constraint on industry and exports",
      options: ["Agricultural output was seen as a constraint on industry and exports", "The Plan abolished industrial development", "The Planning Commission had been replaced by NITI Aayog", "The country had already ended all food shortages permanently"],
      explanation: "Experience from the first two Plans showed that weak agricultural production could restrict broader economic development, exports and industry.",
      factIds: ["third-plan"],
    },
    {
      stem: "What does the term Plan Holiday refer to in Indian planning history?",
      correct: "The three Annual Plans from 1966 to 1969",
      options: ["The three Annual Plans from 1966 to 1969", "The entire period from 1951 to 1956", "The Twelfth Plan period", "The NITI Aayog period after 2015"],
      explanation: "After the Third Plan, India used three Annual Plans during 1966-69 before the Fourth Plan began in 1969. This interval is commonly called the Plan Holiday.",
      factIds: ["annual-plans-1966-69"],
    },
    {
      stem: "Which sequence correctly describes the transition after the Third Plan?",
      correct: "Third Plan ended in 1966 → three Annual Plans → Fourth Plan began in 1969",
      options: ["Third Plan ended in 1966 → three Annual Plans → Fourth Plan began in 1969", "Third Plan ended in 1966 → NITI Aayog began → Fourth Plan began in 2015", "Third Plan ended in 1966 → Rolling Plan began immediately → Fifth Plan began in 1969", "Third Plan ended in 1966 → Eighth Plan began → Fourth Plan followed"],
      explanation: "The normal Five-Year cycle paused after the Third Plan. Three Annual Plans covered 1966-69, after which the Fourth Plan started in 1969.",
      factIds: ["third-plan", "annual-plans-1966-69", "fourth-plan"],
    },
  ],
  6: [
    {
      stem: "Which pair of objectives best describes the Fourth Five-Year Plan?",
      correct: "Growth with stability and progressive achievement of self-reliance",
      options: ["Growth with stability and progressive achievement of self-reliance", "Food, work and productivity", "Faster and more inclusive growth", "Faster, more inclusive and sustainable growth"],
      explanation: "The Fourth Plan's twin objectives were growth with stability and progressive achievement of self-reliance.",
      factIds: ["fourth-plan"],
    },
    {
      stem: "Which two objectives were central to the Fifth Five-Year Plan?",
      correct: "Removal of poverty and attainment of self-reliance",
      options: ["Removal of poverty and attainment of self-reliance", "Only heavy-industry expansion and no poverty policy", "Only price stability and transport", "Only monetary-policy reform and bank nationalisation"],
      explanation: "The Fifth Plan placed removal of poverty and self-reliance at the centre of its strategy.",
      factIds: ["fifth-plan"],
    },
    {
      stem: "What happened to the Fifth Five-Year Plan in 1978?",
      correct: "It was terminated before its originally intended end",
      options: ["It was terminated before its originally intended end", "It was extended to 1985", "It became the First Plan", "It was converted into NITI Aayog"],
      explanation: "The Fifth Plan was framed for 1974-79 but was terminated in 1978, after which the Rolling Plan period followed.",
      factIds: ["fifth-plan", "rolling-plan"],
    },
    {
      stem: "Which sequence correctly places the Rolling Plan in India's planning chronology?",
      correct: "Fifth Plan → Rolling Plan 1978-80 → Sixth Plan 1980-85",
      options: ["Fifth Plan → Rolling Plan 1978-80 → Sixth Plan 1980-85", "Fourth Plan → Twelfth Plan → Rolling Plan", "Sixth Plan → Fifth Plan → Rolling Plan", "Plan Holiday 1966-69 → NITI Aayog → Rolling Plan"],
      explanation: "The Rolling Plan followed the early termination of the Fifth Plan and ended when the Sixth Plan began in 1980.",
      factIds: ["fifth-plan", "rolling-plan", "sixth-plan"],
    },
  ],
  7: [
    {
      stem: "Which Five-Year Plan is best identified by the phrase food, work and productivity?",
      correct: "Seventh Five-Year Plan",
      options: ["Seventh Five-Year Plan", "First Five-Year Plan", "Second Five-Year Plan", "Twelfth Five-Year Plan"],
      explanation: "The Seventh Plan, covering 1985-90, emphasised food, work and productivity.",
      factIds: ["seventh-plan"],
    },
    {
      stem: "Which description best fits the Sixth Five-Year Plan?",
      correct: "Modernisation with efforts to reduce poverty and unemployment",
      options: ["Modernisation with efforts to reduce poverty and unemployment", "Exclusive focus on heavy industry under the Mahalanobis model", "A temporary Annual Plan between 1966 and 1969", "A post-2015 policy-think-tank framework"],
      explanation: "The Sixth Plan focused on expanding national income, modernising technology and reducing poverty and unemployment.",
      factIds: ["sixth-plan"],
    },
    {
      stem: "Why did the Eighth Five-Year Plan begin in 1992 rather than 1990?",
      correct: "Political uncertainty led to Annual Plans for 1990-91 and 1991-92",
      options: ["Political uncertainty led to Annual Plans for 1990-91 and 1991-92", "The Second Plan was still continuing", "The Fifth Plan had not yet ended", "NITI Aayog postponed it"],
      explanation: "The Eighth Plan was delayed by political uncertainty at the Centre, so the two intervening years were treated as Annual Plans.",
      factIds: ["annual-plans-1990-92", "eighth-plan"],
    },
  ],
  8: [
    {
      stem: "In which policy setting did the Eighth Five-Year Plan begin?",
      correct: "After the start of structural adjustment and economic liberalisation",
      options: ["After the start of structural adjustment and economic liberalisation", "Before independence", "During the Plan Holiday of 1966-69", "After NITI Aayog had replaced the Planning Commission"],
      explanation: "The Eighth Plan began in 1992 after the 1991 reform and structural-adjustment measures had started changing India's policy environment.",
      factIds: ["eighth-plan"],
    },
    {
      stem: "Which phrase best captures the Ninth Five-Year Plan's broad emphasis?",
      correct: "Growth with social justice and equality",
      options: ["Growth with social justice and equality", "Growth with stability only", "Food, work and productivity", "Heavy industry through the Mahalanobis model"],
      explanation: "The Ninth Plan emphasised growth with social justice and equality, along with priority to agriculture, rural development and productive employment.",
      factIds: ["ninth-plan"],
    },
    {
      stem: "How did the State's planning role change in the Ninth Plan compared with the earlier public-sector-heavy approach?",
      correct: "The State was increasingly viewed as a facilitator alongside a larger private-sector role",
      options: ["The State was increasingly viewed as a facilitator alongside a larger private-sector role", "The private sector was completely abolished", "Planning became exclusively a monetary-policy function", "All social-sector responsibilities were transferred to foreign institutions"],
      explanation: "By the Ninth Plan, the official planning approach placed less emphasis on direct public-sector dominance and more on facilitation, social sectors and infrastructure.",
      factIds: ["ninth-plan", "indicative-planning"],
    },
    {
      stem: "Which distinction between the Eighth and Ninth Plans is most accurate?",
      correct: "The Eighth began in the post-1991 reform setting, while the Ninth explicitly stressed growth with social justice and equality",
      options: ["The Eighth began in the post-1991 reform setting, while the Ninth explicitly stressed growth with social justice and equality", "The Eighth was the Mahalanobis Plan, while the Ninth was the First Plan", "The Eighth was a Rolling Plan, while the Ninth was the Plan Holiday", "The Eighth created NITI Aayog, while the Ninth created the Planning Commission"],
      explanation: "The Eighth Plan reflected the changed reform environment from 1992, while the Ninth Plan's stated emphasis was growth with social justice and equality.",
      factIds: ["eighth-plan", "ninth-plan"],
    },
  ],
  9: [
    {
      stem: "Which Five-Year Plan used monitorable development targets beyond economic growth alone?",
      correct: "Tenth Five-Year Plan",
      options: ["Tenth Five-Year Plan", "First Five-Year Plan", "Rolling Plan", "Plan Holiday"],
      explanation: "The Tenth Plan explicitly used monitorable targets for social and human-development indicators in addition to economic growth.",
      factIds: ["tenth-plan"],
    },
    {
      stem: "Which phrase is most closely linked with the Eleventh Five-Year Plan?",
      correct: "Faster and more inclusive growth",
      options: ["Faster and more inclusive growth", "Growth with stability and progressive self-reliance", "Food, work and productivity", "Removal of poverty and self-reliance only"],
      explanation: "The Eleventh Plan, covering 2007-12, was framed around faster and more inclusive growth.",
      factIds: ["eleventh-plan"],
    },
    {
      stem: "Which additional element distinguishes the Twelfth Plan's headline vision from the Eleventh Plan's?",
      correct: "Sustainability",
      options: ["Sustainability", "A return to the Mahalanobis heavy-industry model", "A Plan Holiday", "Abolition of all social targets"],
      explanation: "The Twelfth Plan extended the inclusive-growth emphasis by explicitly adding sustainability to its vision of faster growth.",
      factIds: ["eleventh-plan", "twelfth-plan"],
    },
    {
      stem: "Which chronology is correct for the last three Five-Year Plans?",
      correct: "Tenth 2002-07 → Eleventh 2007-12 → Twelfth 2012-17",
      options: ["Tenth 2002-07 → Eleventh 2007-12 → Twelfth 2012-17", "Eleventh 2002-07 → Tenth 2007-12 → Twelfth 2012-17", "Twelfth 2002-07 → Tenth 2007-12 → Eleventh 2012-17", "Tenth 1997-2002 → Eleventh 2002-07 → Twelfth 2007-12"],
      explanation: "The Tenth, Eleventh and Twelfth Plans followed consecutively from 2002-07, 2007-12 and 2012-17.",
      factIds: ["tenth-plan", "eleventh-plan", "twelfth-plan"],
    },
  ],
  10: [
    {
      stem: "On which date was NITI Aayog constituted?",
      correct: "1 January 2015",
      options: ["1 January 2015", "15 March 1950", "1 April 1951", "1 July 2017"],
      explanation: "NITI Aayog was constituted by Union Cabinet Resolution on 1 January 2015.",
      factIds: ["niti-transition"],
    },
    {
      stem: "Which institution did NITI Aayog replace?",
      correct: "Planning Commission",
      options: ["Planning Commission", "Finance Commission", "Reserve Bank of India", "National Development Council only"],
      explanation: "NITI Aayog replaced the Planning Commission as the Union Government's central strategic-policy institution in 2015.",
      factIds: ["niti-transition", "planning-commission-1950"],
    },
    {
      stem: "Which description best fits NITI Aayog's institutional role?",
      correct: "Apex policy think tank providing strategic inputs and fostering cooperative federalism",
      options: ["Apex policy think tank providing strategic inputs and fostering cooperative federalism", "Constitutional court for fiscal disputes", "Central bank responsible for monetary policy", "Tax tribunal for GST appeals"],
      explanation: "NITI Aayog provides strategic and policy inputs and is designed to involve States actively in development strategy through cooperative federalism.",
      factIds: ["niti-role"],
    },
    {
      stem: "Which change best captures the institutional shift from the Planning Commission to NITI Aayog?",
      correct: "From Five-Year-Plan-centred resource planning toward strategic policy advice and cooperative federalism",
      options: ["From Five-Year-Plan-centred resource planning toward strategic policy advice and cooperative federalism", "From monetary policy to currency printing", "From taxation to judicial review", "From agriculture planning to customs administration"],
      explanation: "The former Commission was built around national-plan formulation and resource priorities, while NITI Aayog is framed as a strategic policy think tank with stronger cooperative-federalism emphasis.",
      factIds: ["planning-commission-role", "niti-transition", "niti-role"],
    },
  ],
  11: [
    {
      stem: "What does an increasingly indicative planning approach imply?",
      correct: "Government guides priorities while private-sector decisions also shape investment",
      options: ["Government guides priorities while private-sector decisions also shape investment", "Government directly fixes every production decision", "Planning is replaced entirely by monetary policy", "Only foreign governments determine investment"],
      explanation: "Indicative planning guides broad priorities and direction without requiring the State to command every investment and production decision.",
      factIds: ["indicative-planning"],
    },
    {
      stem: "Which planning feature is most consistent with NITI Aayog's cooperative-federalism approach?",
      correct: "Active participation of States in shaping development priorities",
      options: ["Active participation of States in shaping development priorities", "Excluding States from national strategy", "Centralising all decisions in commercial banks", "Replacing development policy with court orders"],
      explanation: "NITI Aayog's mandate explicitly emphasises a shared development vision and structured engagement with States.",
      factIds: ["niti-role"],
    },
    {
      stem: "Which distinction between centralised Five-Year planning and indicative planning is correct?",
      correct: "Centralised planning relies more on integrated national allocation, while indicative planning guides rather than commands all investment decisions",
      options: ["Centralised planning relies more on integrated national allocation, while indicative planning guides rather than commands all investment decisions", "Indicative planning requires Government ownership of every enterprise", "Centralised planning means no national priorities are set", "Both concepts refer only to tax collection"],
      explanation: "The early Five-Year framework placed heavier weight on integrated public planning, whereas the later indicative approach accepts a larger role for decentralised and private decisions within broad policy guidance.",
      factIds: ["indicative-planning", "planning-commission-role"],
    },
  ],
  12: [
    {
      stem: "Which institutional chronology is correct?",
      correct: "Planning Commission 1950 → First Five-Year Plan 1951 → National Development Council 1952 → NITI Aayog 2015",
      options: ["Planning Commission 1950 → First Five-Year Plan 1951 → National Development Council 1952 → NITI Aayog 2015", "First Five-Year Plan 1950 → Planning Commission 1951 → NITI Aayog 1952 → NDC 2015", "NDC 1950 → NITI Aayog 1951 → Planning Commission 1952 → First Plan 2015", "Planning Commission 1938 → First Plan 1944 → NDC 1945 → NITI Aayog 1950"],
      explanation: "The Commission was established in 1950, the First Plan began in 1951, the NDC started in 1952, and NITI Aayog replaced the Commission in 2015.",
      factIds: ["planning-commission-1950", "first-plan", "ndc-1952", "niti-transition"],
    },
    {
      stem: "Which sequence correctly matches major planning themes with their Plans?",
      correct: "First—agriculture; Second—heavy industry; Seventh—food, work and productivity; Twelfth—inclusive and sustainable growth",
      options: ["First—agriculture; Second—heavy industry; Seventh—food, work and productivity; Twelfth—inclusive and sustainable growth", "First—heavy industry; Second—Plan Holiday; Seventh—GST; Twelfth—Rolling Plan", "First—NITI Aayog; Second—agriculture only; Seventh—Mahalanobis; Twelfth—Plan Holiday", "First—liberalisation; Second—cooperative federalism; Seventh—Annual Plans; Twelfth—currency reform"],
      explanation: "These themes track the major strategic shifts across the planning era, from early agriculture and heavy-industry priorities to productivity and then inclusive-sustainable growth.",
      factIds: ["first-plan", "second-plan", "seventh-plan", "twelfth-plan"],
    },
    {
      stem: "Which statement correctly identifies both breaks in the normal Five-Year Plan sequence?",
      correct: "Annual Plans operated in 1966-69 and again in 1990-92",
      options: ["Annual Plans operated in 1966-69 and again in 1990-92", "Rolling Plans operated continuously from 1951 to 2017", "No Annual Plan was ever used between Five-Year Plans", "NITI Aayog ran the Annual Plans of 1966-69"],
      explanation: "The first break followed the Third Plan and produced Annual Plans for 1966-69; political uncertainty produced another two Annual Plans in 1990-91 and 1991-92 before the Eighth Plan.",
      factIds: ["annual-plans-1966-69", "annual-plans-1990-92"],
    },
  ],
};

export const ECO_CP015_REVIEW_V1: EcoCp015ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-015-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-015",
      qlId: `ECO-QL-${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, index),
      stem: row.stem,
      options,
      correctIndex: target,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      ...bundle,
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
});
