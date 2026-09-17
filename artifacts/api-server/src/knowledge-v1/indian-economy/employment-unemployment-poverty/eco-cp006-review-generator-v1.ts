import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP006_COMMITTEE_ROWS_V1,
  ECO_CP006_CONCEPT_ROWS_V1,
  ECO_CP006_EMPLOYMENT_SCENARIOS_V1,
} from "./eco-cp006-facts";
import type { EcoCp006ReviewQuestion } from "./eco-cp006-review-types";

const concepts = ECO_CP006_CONCEPT_ROWS_V1;
const committees = ECO_CP006_COMMITTEE_ROWS_V1;
const employmentScenarios = ECO_CP006_EMPLOYMENT_SCENARIOS_V1;

const qlNames: Record<number, string> = {
  1: "Identify labour-force and employment concepts",
  2: "Apply LFPR, WPR and unemployment-rate relationships",
  3: "Classify employment status",
  4: "Identify seasonal unemployment",
  5: "Identify disguised unemployment",
  6: "Distinguish frictional, structural and cyclical unemployment",
  7: "Distinguish poverty concepts",
  8: "Apply poverty-line and headcount-ratio concepts",
  9: "Identify major poverty-estimation expert groups",
  10: "Apply MGNREGA and anti-poverty strategy concepts",
  11: "Evaluate statements about employment and poverty",
  12: "Distinguish close employment and poverty concepts",
};

function difficultyForVariant(ql: number, rowIndex: number): KnowledgeV1Difficulty {
  if (ql === 1) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 2) return rowIndex === 0 ? "Easy" : "Medium";
  if (ql === 3) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 4) return rowIndex === 0 ? "Easy" : "Medium";
  if (ql === 5) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 6) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 7) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 8) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 9) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 10) return rowIndex === 0 ? "Easy" : "Medium";
  if (ql === 11) return rowIndex === 0 ? "Medium" : "Hard";
  return rowIndex === 0 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(
  ...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]
) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

function concept(id: string) {
  const row = concepts.find((item) => item.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-006 concept ${id}`);
  return row;
}

const seasonalCases = [
  {
    stem: "A farm worker gets work during sowing and harvesting but remains without work in the off-season. This is:",
    explanation: "The job exists only in particular parts of the year. Unemployment caused by this seasonal pattern is seasonal unemployment.",
  },
  {
    stem: "A worker in a seasonal sugar mill loses work when the crushing season ends. This is:",
    explanation: "The loss of work follows the production season rather than a permanent lack of skills. This is seasonal unemployment.",
  },
  {
    stem: "A tourism worker regularly finds no work during the local off-season. Which type of unemployment best fits?",
    explanation: "Work disappears predictably in the off-season and returns with the season. That pattern is seasonal unemployment.",
  },
] as const;

const disguisedCases = [
  {
    stem: "Six family members work on a small farm, but output would stay the same if two stopped working. This shows:",
    explanation: "Some workers add no extra output because more people are working than needed. This is disguised unemployment.",
  },
  {
    stem: "A shop uses five family workers even though three can handle the same work without reducing output. This is:",
    explanation: "The extra workers can leave without lowering output. That is the key sign of disguised unemployment.",
  },
  {
    stem: "Workers appear employed, but the marginal contribution of some of them is effectively zero. Which unemployment type is indicated?",
    explanation: "People may appear employed even though some are not adding to total output. This hidden surplus labour is disguised unemployment.",
  },
] as const;

const unemploymentCases = [
  {
    stem: "A worker leaves one job and spends a short period searching for a better one. This is:",
    correct: "Frictional unemployment",
    explanation: "The unemployment is temporary and occurs while moving between jobs. That is frictional unemployment.",
    source: "frictional-unemployment",
  },
  {
    stem: "Factories adopt new technology, but some workers do not have the skills required for the new jobs. This is:",
    correct: "Structural unemployment",
    explanation: "Available jobs and worker skills no longer match. A persistent skills mismatch is structural unemployment.",
    source: "structural-unemployment",
  },
  {
    stem: "A recession reduces overall demand and firms lay off workers across many industries. This is:",
    correct: "Cyclical unemployment",
    explanation: "The job losses are caused by a broad fall in demand during an economic downturn. This is cyclical unemployment.",
    source: "cyclical-unemployment",
  },
  {
    stem: "Jobs exist, but unemployed workers are trained for occupations that employers no longer need. Which type best fits?",
    correct: "Structural unemployment",
    explanation: "The main problem is a mismatch between the skills workers have and the skills jobs require. That makes it structural rather than frictional unemployment.",
    source: "structural-unemployment",
  },
] as const;

const povertyCases = [
  { id: "absolute-poverty", stem: "Poverty judged against a minimum level needed for basic needs is:", options: ["Absolute poverty", "Relative poverty", "Multidimensional poverty", "Disguised unemployment"] },
  { id: "relative-poverty", stem: "Poverty judged by comparing a person's resources with others in the same society is:", options: ["Relative poverty", "Absolute poverty", "Multidimensional poverty", "Seasonal poverty"] },
  { id: "multidimensional-poverty", stem: "A poverty measure combines deprivations in health, education and living standards. This is:", options: ["Multidimensional poverty", "Absolute poverty only", "Relative poverty only", "Cyclical poverty"] },
  { id: "poverty-line", stem: "A threshold used to identify people or households considered poor under a chosen method is called:", options: ["Poverty line", "Labour force", "Worker population ratio", "Price index"] },
] as const;

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp006ReviewQuestion {
  const qlId = `ECO-006-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForVariant(ql, rowIndex);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sourceBundle(concept("labour-force"));

  if (ql === 1) {
    const rows = [concept("labour-force"), concept("worker"), concept("unemployed"), concept("labour-force")];
    const row = rows[rowIndex % rows.length];
    const stems = [
      "Employed persons plus unemployed persons available for work make up the:",
      "A person engaged in an economic activity for production of goods or services is a:",
      "A person has no work but is available for work under the survey definition. The person is:",
      "Which group includes both employed and unemployed persons available for work?",
    ];
    stem = stems[rowIndex % stems.length];
    correct = row.term;
    options = moveCorrect(["Labour force", "Worker", "Unemployed", "Total population"], correct, correctTarget);
    explanation = `${row.term} means ${row.compactMeaning}. The wording in the question matches this definition.`;
    metadata = sourceBundle(row);
  } else if (ql === 2) {
    const lfpr = concept("lfpr");
    const wpr = concept("wpr");
    const ur = concept("ur");
    if (rowIndex === 0) {
      stem = "The unemployment rate is calculated as unemployed persons divided by:";
      correct = "Labour force";
      options = moveCorrect(["Labour force", "Total population", "Employed persons only", "Working-age employers only"], correct, correctTarget);
      explanation = "UR measures unemployed persons as a percentage of the labour force. Its denominator is therefore the labour force, not the total population.";
    } else if (rowIndex === 1) {
      stem = "A population has 60 persons in the labour force out of 100 persons. LFPR is:";
      correct = "60%";
      options = moveCorrect(["60%", "40%", "100%", "6%"], correct, correctTarget);
      explanation = "LFPR = labour force / population × 100. Here, 60 / 100 × 100 = 60%.";
    } else if (rowIndex === 2) {
      stem = "Out of 100 persons, 55 are employed. WPR is:";
      correct = "55%";
      options = moveCorrect(["55%", "45%", "100%", "5.5%"], correct, correctTarget);
      explanation = "WPR = employed persons / population × 100. Here, 55 / 100 × 100 = 55%.";
    } else {
      stem = "A labour force has 72 employed and 8 unemployed persons. The unemployment rate is:";
      correct = "10%";
      options = moveCorrect(["10%", "8%", "11.1%", "20%"], correct, correctTarget);
      explanation = "The labour force is 72 + 8 = 80. UR = 8 / 80 × 100 = 10%.";
    }
    metadata = sourceBundle(lfpr, wpr, ur);
  } else if (ql === 3) {
    const row = employmentScenarios[rowIndex % employmentScenarios.length];
    stem = `${row.stem} This person is best classified as:`;
    correct = row.answer;
    options = moveCorrect(["Self-employed", "Regular wage/salaried", "Casual labour", "Unemployed"], correct, correctTarget);
    explanation = `${row.explanation} The deciding point is the person's employment relationship, not the industry in which the person works.`;
    metadata = sourceBundle(row);
  } else if (ql === 4) {
    const row = seasonalCases[rowIndex % seasonalCases.length];
    stem = row.stem;
    correct = "Seasonal unemployment";
    options = moveCorrect(["Seasonal unemployment", "Disguised unemployment", "Structural unemployment", "Frictional unemployment"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("seasonal-unemployment"));
  } else if (ql === 5) {
    const row = disguisedCases[rowIndex % disguisedCases.length];
    stem = row.stem;
    correct = "Disguised unemployment";
    options = moveCorrect(["Disguised unemployment", "Seasonal unemployment", "Cyclical unemployment", "Frictional unemployment"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("disguised-unemployment"));
  } else if (ql === 6) {
    const row = unemploymentCases[rowIndex % unemploymentCases.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect(["Frictional unemployment", "Structural unemployment", "Cyclical unemployment", "Seasonal unemployment"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept(row.source));
  } else if (ql === 7) {
    const row = povertyCases[rowIndex % povertyCases.length];
    const fact = concept(row.id);
    stem = row.stem;
    correct = fact.term;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = `${fact.term} means ${fact.compactMeaning}. That is the feature described in the question.`;
    metadata = sourceBundle(fact);
  } else if (ql === 8) {
    const povertyLine = concept("poverty-line");
    const headcount = concept("headcount-ratio");
    if (rowIndex === 0) {
      stem = "What is the main purpose of a poverty line?";
      correct = "To set a threshold for identifying the poor under a chosen method";
      options = moveCorrect([correct, "To measure only unemployment", "To fix market prices", "To calculate GDP growth"], correct, correctTarget);
      explanation = "A poverty line is a threshold used to classify people or households as poor under a chosen method. It is not itself an unemployment or price measure.";
    } else if (rowIndex === 1) {
      stem = "If 25 out of 100 people are identified as poor, the poverty headcount ratio is:";
      correct = "25%";
      options = moveCorrect(["25%", "75%", "4%", "100%"], correct, correctTarget);
      explanation = "Headcount ratio = number identified as poor / total population × 100. Here, 25 / 100 × 100 = 25%.";
    } else if (rowIndex === 2) {
      stem = "A poverty measure counts how many people fall below a chosen threshold but does not show how far below it they are. This describes the main limitation of the:";
      correct = "Headcount ratio";
      options = moveCorrect(["Headcount ratio", "Unemployment rate", "Worker population ratio", "Labour force participation rate"], correct, correctTarget);
      explanation = "The headcount ratio tells the share of people classified as poor. By itself, it does not measure the depth of each poor person's shortfall.";
    } else {
      stem = "Two households have the same income, but one also lacks schooling, sanitation and adequate nutrition. Which approach captures this broader deprivation better?";
      correct = "Multidimensional poverty approach";
      options = moveCorrect(["Multidimensional poverty approach", "Unemployment rate", "Poverty headcount based only on one income threshold", "Worker population ratio"], correct, correctTarget);
      explanation = "Multidimensional poverty looks beyond a single monetary threshold to several deprivations. It can therefore capture disadvantages in health, education and living standards together.";
    }
    metadata = sourceBundle(povertyLine, headcount, concept("multidimensional-poverty"));
  } else if (ql === 9) {
    const row = committees[rowIndex % committees.length];
    if (rowIndex < 2) {
      stem = `Which group is linked with poverty-estimation work in ${row.year}?`;
      correct = row.committee;
      options = moveCorrect(committees.map((item) => item.committee), correct, correctTarget);
      explanation = `${row.committee} is linked with the ${row.year} exercise on ${row.purpose}. The year and purpose identify the committee.`;
    } else {
      stem = `${row.committee} is mainly associated with:`;
      correct = row.purpose;
      options = moveCorrect(committees.map((item) => item.purpose), correct, correctTarget);
      explanation = `${row.committee} was constituted for ${row.purpose}. This is part of India's history of monetary poverty estimation.`;
    }
    metadata = sourceBundle(row);
  } else if (ql === 10) {
    const mgnrega = concept("mgnrega");
    const rows = [
      {
        stem: "MGNREGA was enacted in:",
        correct: "2005",
        options: ["2005", "1991", "2014", "1979"],
        explanation: "MGNREGA is a 2005 law. Its static exam relevance comes from the legal rural employment guarantee, not current wage or spending figures.",
      },
      {
        stem: "MGNREGA provides a statutory guarantee of up to how many days of wage employment to an eligible rural household?",
        correct: "100 days",
        options: ["100 days", "50 days", "150 days", "365 days"],
        explanation: "The Act provides for up to 100 days of wage employment to an eligible rural household. Current wage rates are separate and can change.",
      },
      {
        stem: "Which combination best describes a broad anti-poverty strategy discussed in NCERT?",
        correct: "Economic growth plus targeted anti-poverty programmes",
        options: ["Economic growth plus targeted anti-poverty programmes", "Only higher taxes", "Only price controls", "Only foreign borrowing"],
        explanation: "Poverty reduction can be supported by broader economic growth and by programmes targeted at vulnerable groups. The two approaches work through different channels.",
      },
    ];
    const row = rows[rowIndex % rows.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(mgnrega, concept("absolute-poverty"));
  } else if (ql === 11) {
    const rows = [
      {
        s1: "LFPR uses population as the denominator.",
        s2: "The unemployment rate uses the labour force as the denominator.",
        correct: "Both I and II",
        explanation: "Statement I is correct because LFPR is labour force divided by population. Statement II is also correct because UR is unemployed persons divided by the labour force.",
      },
      {
        s1: "In disguised unemployment, some workers can leave without reducing output.",
        s2: "Seasonal unemployment occurs because work is available only during parts of the year.",
        correct: "Both I and II",
        explanation: "Statement I describes surplus workers whose removal does not reduce output. Statement II describes work that disappears in the off-season, so both are correct.",
      },
      {
        s1: "Relative poverty compares resources with others in the same society.",
        s2: "Multidimensional poverty is measured only by unemployment status.",
        correct: "I only",
        explanation: "Statement I is correct because relative poverty is comparative. Statement II is false because multidimensional poverty combines several deprivations such as health, education and living standards.",
      },
      {
        s1: "Structural unemployment can result from a mismatch between worker skills and available jobs.",
        s2: "Frictional unemployment always means workers' skills have become obsolete.",
        correct: "I only",
        explanation: "Statement I is correct because structural unemployment involves a persistent mismatch. Statement II is false because frictional unemployment is usually temporary job search or movement between jobs.",
      },
    ];
    const row = rows[rowIndex % rows.length];
    stem = `Consider the statements:\nI. ${row.s1}\nII. ${row.s2}\nWhich is correct?`;
    correct = row.correct;
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(...concepts.slice(0, 16));
  } else {
    const rows = [
      {
        stem: "Which statement best distinguishes seasonal from disguised unemployment?",
        correct: "Seasonal unemployment follows the time of year; disguised unemployment has more workers than needed",
        options: [
          "Seasonal unemployment follows the time of year; disguised unemployment has more workers than needed",
          "Seasonal unemployment is always urban; disguised unemployment is always rural",
          "Seasonal unemployment means job search; disguised unemployment means recession",
          "They are the same concept",
        ],
        explanation: "Seasonal unemployment is caused by work being available only in certain periods. Disguised unemployment exists when surplus workers can leave without reducing output.",
      },
      {
        stem: "Which statement best distinguishes LFPR from WPR?",
        correct: "LFPR counts the labour force; WPR counts employed persons, both relative to population",
        options: [
          "LFPR counts the labour force; WPR counts employed persons, both relative to population",
          "LFPR counts only the unemployed; WPR counts the labour force",
          "LFPR and WPR always have the same numerator",
          "WPR uses only unemployed persons as its numerator",
        ],
        explanation: "LFPR uses employed plus unemployed persons in the labour force as its numerator. WPR uses only employed persons, while both are expressed relative to population.",
      },
      {
        stem: "Which statement best distinguishes absolute poverty from multidimensional poverty?",
        correct: "Absolute poverty uses a minimum-needs threshold; multidimensional poverty combines several kinds of deprivation",
        options: [
          "Absolute poverty uses a minimum-needs threshold; multidimensional poverty combines several kinds of deprivation",
          "Absolute poverty measures only unemployment; multidimensional poverty measures only income",
          "Both concepts always use one identical monetary line",
          "Multidimensional poverty ignores health and education",
        ],
        explanation: "Absolute poverty compares resources with a basic minimum threshold. Multidimensional poverty broadens the assessment to several deprivations such as health, education and living standards.",
      },
    ];
    const row = rows[rowIndex % rows.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.explanation;
    metadata = sourceBundle(concept("seasonal-unemployment"), concept("disguised-unemployment"), concept("lfpr"), concept("wpr"), concept("absolute-poverty"), concept("multidimensional-poverty"));
  }

  return {
    questionId: `ECO-CP006-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-006",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...metadata,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateEcoCp006ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 3,
    5: 3,
    6: 4,
    7: 4,
    8: 4,
    9: 4,
    10: 3,
    11: 4,
    12: 3,
  };

  const questions: EcoCp006ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 12; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}

export const ECO_CP006_REVIEW_V1 = generateEcoCp006ReviewBatchV1();
