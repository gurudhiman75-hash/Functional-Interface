import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp015Fact } from "./eco-cp015-facts";
import type { EcoCp015ReviewQuestion } from "./eco-cp015-review-types";

const qlNames: Record<number, string> = {
  1: "Early planning and Planning Commission",
  2: "Planning Commission and National Development Council",
  3: "First Five-Year Plan",
  4: "Second Five-Year Plan",
  5: "Third Plan and Plan Holiday",
  6: "Fourth, Fifth and Rolling Plan",
  7: "Sixth, Seventh and 1990-92 Annual Plans",
  8: "Eighth and Ninth Plans",
  9: "Tenth, Eleventh and Twelfth Plans",
  10: "NITI Aayog transition and role",
  11: "Indicative planning and institutional change",
  12: "Chronology and mixed distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if ([1, 3, 4].includes(ql)) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if ([2, 9, 11, 12].includes(ql)) return row === 0 ? "Medium" : "Hard";
  if ([5, 6, 7, 8, 10].includes(ql)) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  return "Medium";
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
      stem: "Which body was set up by the Indian National Congress in 1938 to prepare a national plan?",
      correct: "National Planning Committee",
      options: ["National Planning Committee", "National Development Council", "Planning Commission", "NITI Aayog"],
      explanation: "The National Planning Committee was set up in 1938. It was an early effort to plan India's economic development.",
      factIds: ["npc-1938"],
    },
    {
      stem: "In which year was the Planning Commission established?",
      correct: "1950",
      options: ["1947", "1950", "1951", "1952"],
      explanation: "The Planning Commission was established in 1950 by a Government of India Resolution.",
      factIds: ["planning-commission-1950"],
    },
    {
      stem: "How was the Planning Commission established?",
      correct: "By a Government of India Resolution",
      options: ["By a Government of India Resolution", "By a constitutional amendment", "By an Act of Parliament", "By an RBI notification"],
      explanation: "It was created by an executive resolution of the Government of India. It was neither a constitutional nor a statutory body.",
      factIds: ["planning-commission-1950"],
    },
    {
      stem: "Which sequence of early planning proposals is correct?",
      correct: "National Planning Committee → Bombay/Gandhian Plans → People's Plan → Sarvodaya Plan",
      options: ["National Planning Committee → Bombay/Gandhian Plans → People's Plan → Sarvodaya Plan", "Bombay/Gandhian Plans → National Planning Committee → People's Plan → Sarvodaya Plan", "People's Plan → Bombay/Gandhian Plans → National Planning Committee → Sarvodaya Plan", "Sarvodaya Plan → People's Plan → Bombay/Gandhian Plans → National Planning Committee"],
      explanation: "The sequence is 1938, 1944, 1945 and 1950. These proposals came before the official Five-Year Plans.",
      factIds: ["npc-1938", "planning-ideas-1944-50"],
    },
  ],
  2: [
    {
      stem: "What was a major function of the Planning Commission?",
      correct: "Assessing resources and setting development priorities",
      options: ["Assessing resources and setting development priorities", "Conducting monetary policy", "Regulating stock exchanges", "Collecting customs duty"],
      explanation: "The Planning Commission assessed resources, set priorities and prepared development plans.",
      factIds: ["planning-commission-role"],
    },
    {
      stem: "What was the main role of the National Development Council?",
      correct: "Providing a Centre-State forum for development planning",
      options: ["Providing a Centre-State forum for development planning", "Issuing currency notes", "Regulating commercial banks", "Managing foreign exchange reserves"],
      explanation: "The NDC brought the Centre and States together to discuss national plans and development policy.",
      factIds: ["ndc-1952"],
    },
    {
      stem: "Which statement correctly distinguishes the Planning Commission from the National Development Council?",
      correct: "The Planning Commission prepared plans, while the NDC provided a wider Centre-State forum",
      options: ["The Planning Commission prepared plans, while the NDC provided a wider Centre-State forum", "The NDC prepared monetary policy, while the Planning Commission regulated banks", "The Planning Commission was a court, while the NDC was a tax authority", "Both bodies had exactly the same role"],
      explanation: "The Planning Commission was the main planning body. The NDC provided broader Centre-State participation in development planning.",
      factIds: ["planning-commission-role", "ndc-1952"],
    },
  ],
  3: [
    {
      stem: "What was the period of the First Five-Year Plan?",
      correct: "1951-56",
      options: ["1951-56", "1956-61", "1961-66", "1969-74"],
      explanation: "The First Five-Year Plan covered 1951 to 1956.",
      factIds: ["first-plan"],
    },
    {
      stem: "Which sector received the highest priority in the First Five-Year Plan?",
      correct: "Agriculture",
      options: ["Agriculture", "Heavy industry", "Telecommunications", "Capital markets"],
      explanation: "The First Plan gave high priority to agriculture because India faced food shortages and price pressures.",
      factIds: ["first-plan"],
    },
    {
      stem: "Which growth model is linked with the First Five-Year Plan?",
      correct: "Harrod-Domar model",
      options: ["Harrod-Domar model", "Mahalanobis model", "Rolling Plan model", "Indicative planning model"],
      explanation: "The First Plan used the Harrod-Domar framework. The Mahalanobis strategy is linked with the Second Plan.",
      factIds: ["first-plan", "second-plan"],
    },
    {
      stem: "Which pair correctly shows the main emphasis of the First and Second Five-Year Plans?",
      correct: "First Plan—agriculture; Second Plan—heavy industry",
      options: ["First Plan—agriculture; Second Plan—heavy industry", "First Plan—heavy industry; Second Plan—agriculture", "First Plan—liberalisation; Second Plan—poverty removal", "First Plan—services; Second Plan—capital markets"],
      explanation: "The First Plan focused mainly on agriculture. The Second Plan shifted strongly towards heavy and basic industries.",
      factIds: ["first-plan", "second-plan"],
    },
  ],
  4: [
    {
      stem: "Which economist is most closely linked with the Second Five-Year Plan?",
      correct: "P. C. Mahalanobis",
      options: ["P. C. Mahalanobis", "M. Visvesvaraya", "Dadabhai Naoroji", "V. K. R. V. Rao"],
      explanation: "P. C. Mahalanobis is closely linked with the Second Plan and its heavy-industry strategy.",
      factIds: ["second-plan"],
    },
    {
      stem: "What was the main focus of the Second Five-Year Plan?",
      correct: "Rapid industrialisation through heavy and basic industries",
      options: ["Rapid industrialisation through heavy and basic industries", "Agriculture alone", "Privatisation of all public enterprises", "Replacing Five-Year Plans with annual budgets"],
      explanation: "The Second Plan gave priority to rapid industrialisation, especially heavy and basic industries.",
      factIds: ["second-plan"],
    },
    {
      stem: "What was the period of the Second Five-Year Plan?",
      correct: "1956-61",
      options: ["1951-56", "1956-61", "1961-66", "1969-74"],
      explanation: "The Second Five-Year Plan covered 1956 to 1961.",
      factIds: ["second-plan"],
    },
    {
      stem: "Which statement correctly compares the First and Second Five-Year Plans?",
      correct: "The First stressed agriculture, while the Second stressed heavy industry",
      options: ["The First stressed agriculture, while the Second stressed heavy industry", "Both focused mainly on heavy industry", "Both were Annual Plans", "The First followed the 1991 reforms, while the Second preceded independence"],
      explanation: "The major shift was from agriculture in the First Plan to heavy-industry-led development in the Second Plan.",
      factIds: ["first-plan", "second-plan"],
    },
  ],
  5: [
    {
      stem: "What was a major objective of the Third Five-Year Plan?",
      correct: "Building a self-reliant economy",
      options: ["Building a self-reliant economy", "Ending public-sector investment", "Replacing planning with NITI Aayog", "Introducing GST"],
      explanation: "The Third Plan aimed to make the economy more self-reliant and self-generating.",
      factIds: ["third-plan"],
    },
    {
      stem: "Why was agriculture again given high priority in the Third Five-Year Plan?",
      correct: "Weak agricultural output was limiting wider economic growth",
      options: ["Weak agricultural output was limiting wider economic growth", "Heavy industry had been completely abolished", "India had stopped importing food permanently", "The Planning Commission had been replaced"],
      explanation: "Low agricultural output was seen as a constraint on industry and exports. So agriculture again received high priority.",
      factIds: ["third-plan"],
    },
    {
      stem: "What is meant by the Plan Holiday in India?",
      correct: "The three Annual Plans from 1966 to 1969",
      options: ["The three Annual Plans from 1966 to 1969", "The gap between the First and Second Plans", "The Rolling Plan of 1978-80", "The Annual Plans of 1990-92"],
      explanation: "The period 1966-69 had three Annual Plans instead of a Five-Year Plan. It is known as the Plan Holiday.",
      factIds: ["annual-plans-1966-69"],
    },
    {
      stem: "Which sequence after the Third Five-Year Plan is correct?",
      correct: "Third Plan → Annual Plans 1966-69 → Fourth Plan",
      options: ["Third Plan → Annual Plans 1966-69 → Fourth Plan", "Third Plan → Rolling Plan → Fourth Plan", "Third Plan → Eighth Plan → Fourth Plan", "Third Plan → NITI Aayog → Fourth Plan"],
      explanation: "After the Third Plan ended in 1966, three Annual Plans were used. The Fourth Plan began in 1969.",
      factIds: ["third-plan", "annual-plans-1966-69", "fourth-plan"],
    },
  ],
  6: [
    {
      stem: "What were the main objectives of the Fourth Five-Year Plan?",
      correct: "Growth with stability and progressive self-reliance",
      options: ["Growth with stability and progressive self-reliance", "Food, work and productivity", "Faster and more inclusive growth", "Faster, inclusive and sustainable growth"],
      explanation: "The Fourth Plan stressed growth with stability and gradual achievement of self-reliance.",
      factIds: ["fourth-plan"],
    },
    {
      stem: "What were the main objectives of the Fifth Five-Year Plan?",
      correct: "Removal of poverty and self-reliance",
      options: ["Removal of poverty and self-reliance", "Heavy industry and export promotion", "Food, work and productivity", "Faster and more inclusive growth"],
      explanation: "The Fifth Plan focused on poverty removal and self-reliance.",
      factIds: ["fifth-plan"],
    },
    {
      stem: "What happened to the Fifth Five-Year Plan in 1978?",
      correct: "It was terminated before its scheduled end",
      options: ["It was terminated before its scheduled end", "It was extended to 1985", "It was converted into the Sixth Plan", "It was replaced by NITI Aayog"],
      explanation: "The Fifth Plan was ended early in 1978. A Rolling Plan followed it.",
      factIds: ["fifth-plan", "rolling-plan"],
    },
    {
      stem: "Which sequence correctly places the Rolling Plan?",
      correct: "Fifth Plan → Rolling Plan 1978-80 → Sixth Plan",
      options: ["Fifth Plan → Rolling Plan 1978-80 → Sixth Plan", "Fourth Plan → Rolling Plan → Fifth Plan", "Sixth Plan → Rolling Plan → Fifth Plan", "Plan Holiday → Rolling Plan → Fourth Plan"],
      explanation: "The Rolling Plan operated from 1978 to 1980, between the Fifth and Sixth Plans.",
      factIds: ["fifth-plan", "rolling-plan", "sixth-plan"],
    },
  ],
  7: [
    {
      stem: "Which issue received major attention in the Sixth Five-Year Plan?",
      correct: "Poverty, unemployment and modernisation",
      options: ["Poverty, unemployment and modernisation", "Only heavy-industry expansion", "Only agricultural price control", "Ending all public investment"],
      explanation: "The Sixth Plan stressed modernisation along with reducing poverty and unemployment.",
      factIds: ["sixth-plan"],
    },
    {
      stem: "Which phrase is associated with the Seventh Five-Year Plan?",
      correct: "Food, work and productivity",
      options: ["Food, work and productivity", "Growth with stability", "Faster and more inclusive growth", "Removal of poverty and self-reliance"],
      explanation: "The Seventh Plan is known for the emphasis on food, work and productivity.",
      factIds: ["seventh-plan"],
    },
    {
      stem: "Why did the Eighth Five-Year Plan begin in 1992 instead of 1990?",
      correct: "Political instability led to two Annual Plans",
      options: ["Political instability led to two Annual Plans", "The Seventh Plan was extended to 1992", "A Rolling Plan continued until 1992", "The Planning Commission was dissolved in 1990"],
      explanation: "Political uncertainty delayed the Eighth Plan. The years 1990-91 and 1991-92 were treated as Annual Plans.",
      factIds: ["annual-plans-1990-92", "eighth-plan"],
    },
    {
      stem: "Which statement correctly compares the breaks in Five-Year planning after 1966 and 1990?",
      correct: "Both periods used Annual Plans before the next Five-Year Plan began",
      options: ["Both periods used Annual Plans before the next Five-Year Plan began", "Both periods used Rolling Plans", "Both periods ended the Planning Commission", "Both periods followed the Twelfth Plan"],
      explanation: "Annual Plans were used in 1966-69 and again in 1990-92 before normal Five-Year planning resumed.",
      factIds: ["annual-plans-1966-69", "annual-plans-1990-92"],
    },
  ],
  8: [
    {
      stem: "What was the period of the Eighth Five-Year Plan?",
      correct: "1992-97",
      options: ["1985-90", "1990-95", "1992-97", "1997-2002"],
      explanation: "The Eighth Five-Year Plan covered 1992 to 1997.",
      factIds: ["eighth-plan"],
    },
    {
      stem: "In which economic setting did the Eighth Five-Year Plan begin?",
      correct: "After the start of liberalisation and structural reforms",
      options: ["After the start of liberalisation and structural reforms", "Before independence", "During the Plan Holiday", "Before the Second Five-Year Plan"],
      explanation: "The Eighth Plan began after the 1991 economic reforms and operated in a more liberalised economy.",
      factIds: ["eighth-plan"],
    },
    {
      stem: "What was a major theme of the Ninth Five-Year Plan?",
      correct: "Growth with social justice and equality",
      options: ["Growth with social justice and equality", "Growth with stability only", "Food, work and productivity", "Heavy-industry-led growth"],
      explanation: "The Ninth Plan stressed growth with social justice and equality.",
      factIds: ["ninth-plan"],
    },
    {
      stem: "How did the role of the State change by the Ninth Five-Year Plan?",
      correct: "The State increasingly acted as a facilitator alongside the private sector",
      options: ["The State increasingly acted as a facilitator alongside the private sector", "The private sector was completely removed", "The State stopped all social-sector spending", "Planning became a monetary-policy function"],
      explanation: "By the Ninth Plan, the State was increasingly seen as a facilitator rather than the only major investor.",
      factIds: ["ninth-plan", "indicative-planning"],
    },
  ],
  9: [
    {
      stem: "Which Five-Year Plan introduced monitorable development targets beyond economic growth?",
      correct: "Tenth Five-Year Plan",
      options: ["Eighth Five-Year Plan", "Ninth Five-Year Plan", "Tenth Five-Year Plan", "Eleventh Five-Year Plan"],
      explanation: "The Tenth Plan used monitorable targets for social and human-development outcomes as well as growth.",
      factIds: ["tenth-plan"],
    },
    {
      stem: "Which phrase is most closely linked with the Eleventh Five-Year Plan?",
      correct: "Faster and more inclusive growth",
      options: ["Faster and more inclusive growth", "Growth with stability", "Food, work and productivity", "Removal of poverty and self-reliance"],
      explanation: "The Eleventh Plan was built around faster and more inclusive growth.",
      factIds: ["eleventh-plan"],
    },
    {
      stem: "What additional idea was added in the Twelfth Plan to the Eleventh Plan's inclusive-growth approach?",
      correct: "Sustainability",
      options: ["Sustainability", "Rolling planning", "Heavy-industry dominance", "Plan Holiday"],
      explanation: "The Twelfth Plan added sustainability to the goal of faster and inclusive growth.",
      factIds: ["eleventh-plan", "twelfth-plan"],
    },
  ],
  10: [
    {
      stem: "In which year was NITI Aayog constituted?",
      correct: "2015",
      options: ["2012", "2014", "2015", "2017"],
      explanation: "NITI Aayog was constituted on 1 January 2015.",
      factIds: ["niti-transition"],
    },
    {
      stem: "Which institution did NITI Aayog replace?",
      correct: "Planning Commission",
      options: ["Planning Commission", "Finance Commission", "National Development Council", "Reserve Bank of India"],
      explanation: "NITI Aayog replaced the Planning Commission in 2015.",
      factIds: ["niti-transition"],
    },
    {
      stem: "Which description best fits NITI Aayog?",
      correct: "A policy think tank that promotes cooperative federalism",
      options: ["A policy think tank that promotes cooperative federalism", "A constitutional tax authority", "A central bank", "A statutory market regulator"],
      explanation: "NITI Aayog provides policy and strategic inputs and works with States through cooperative federalism.",
      factIds: ["niti-role"],
    },
    {
      stem: "Which statement correctly compares the Planning Commission and NITI Aayog?",
      correct: "The Planning Commission prepared Five-Year Plans, while NITI Aayog works mainly as a strategic policy think tank",
      options: ["The Planning Commission prepared Five-Year Plans, while NITI Aayog works mainly as a strategic policy think tank", "NITI Aayog conducts monetary policy, while the Planning Commission regulated banks", "Both were constitutional bodies with identical powers", "The Planning Commission replaced NITI Aayog in 2015"],
      explanation: "The Planning Commission was closely tied to Five-Year planning. NITI Aayog mainly provides strategic policy advice and Centre-State coordination.",
      factIds: ["planning-commission-role", "niti-transition", "niti-role"],
    },
  ],
  11: [
    {
      stem: "What is meant by indicative planning?",
      correct: "Government guides priorities without controlling every investment decision",
      options: ["Government guides priorities without controlling every investment decision", "Government fixes every production decision", "Only private firms prepare national plans", "Planning is replaced by monetary policy"],
      explanation: "In indicative planning, Government sets broad priorities while private-sector decisions also influence investment.",
      factIds: ["indicative-planning"],
    },
    {
      stem: "Why did Indian planning become more indicative over time?",
      correct: "The private sector gained a larger role in investment decisions",
      options: ["The private sector gained a larger role in investment decisions", "The public sector was abolished", "Five-Year Plans became monetary-policy tools", "Agriculture was removed from planning"],
      explanation: "As the private sector grew, planning increasingly guided priorities instead of directing all investment itself.",
      factIds: ["indicative-planning", "ninth-plan"],
    },
    {
      stem: "Which change best reflects the shift from the Planning Commission to NITI Aayog?",
      correct: "Greater emphasis on policy advice and cooperative federalism",
      options: ["Greater emphasis on policy advice and cooperative federalism", "Transfer of monetary policy from RBI", "Creation of a constitutional tax body", "Return to centralised production targets"],
      explanation: "NITI Aayog places greater emphasis on policy advice, strategy and participation of States.",
      factIds: ["niti-transition", "niti-role", "indicative-planning"],
    },
  ],
  12: [
    {
      stem: "Which sequence of planning events is correct?",
      correct: "First Plan → Plan Holiday → Rolling Plan → Eighth Plan → NITI Aayog",
      options: ["First Plan → Plan Holiday → Rolling Plan → Eighth Plan → NITI Aayog", "First Plan → Rolling Plan → Plan Holiday → NITI Aayog → Eighth Plan", "Plan Holiday → First Plan → Eighth Plan → Rolling Plan → NITI Aayog", "NITI Aayog → First Plan → Rolling Plan → Plan Holiday → Eighth Plan"],
      explanation: "The correct order is First Plan, Plan Holiday, Rolling Plan, Eighth Plan and then NITI Aayog.",
      factIds: ["first-plan", "annual-plans-1966-69", "rolling-plan", "eighth-plan", "niti-transition"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "Second Plan—heavy industry; Eleventh Plan—inclusive growth",
      options: ["Second Plan—heavy industry; Eleventh Plan—inclusive growth", "First Plan—heavy industry; Seventh Plan—Plan Holiday", "Fifth Plan—food, work and productivity; Twelfth Plan—Rolling Plan", "Third Plan—NITI Aayog; Ninth Plan—Mahalanobis model"],
      explanation: "The Second Plan stressed heavy industry, while the Eleventh Plan focused on faster and more inclusive growth.",
      factIds: ["second-plan", "eleventh-plan"],
    },
    {
      stem: "Which statement correctly identifies both breaks in the normal Five-Year Plan sequence?",
      correct: "Annual Plans were used in 1966-69 and again in 1990-92",
      options: ["Annual Plans were used in 1966-69 and again in 1990-92", "Rolling Plans were used in both periods", "Five-Year planning ended permanently in 1966", "NITI Aayog managed both breaks"],
      explanation: "India used Annual Plans in 1966-69 and again in 1990-92 before the next Five-Year Plans began.",
      factIds: ["annual-plans-1966-69", "annual-plans-1990-92"],
    },
  ],
};

export const ECO_CP015_REVIEW_V2: EcoCp015ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-015-V2-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
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
