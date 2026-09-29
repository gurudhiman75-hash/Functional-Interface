import { pick, seededRandom, shuffle } from "../shared/exact";
import { getStat004PermanentQlForContract } from "./permanent-ql-registry";
import type { Stat004ContractId, Stat004ExamProfile, Stat004Question } from "./types";

type Draft = Readonly<{ stems: readonly string[]; options: readonly [string, string, string, string]; correct: string; explanation: string }>;

function draft(stems: readonly string[], options: readonly [string, string, string, string], correct: string, explanation: string): Draft {
  if (new Set(options).size !== 4 || !options.includes(correct)) throw new Error("STAT-004 draft must have four distinct options and one correct answer.");
  return { stems, options, correct, explanation };
}

function makeQuestion(contractId: Stat004ContractId, seed: string, profile: Stat004ExamProfile, value: Draft): Stat004Question {
  const owner = getStat004PermanentQlForContract(contractId);
  const random = seededRandom(`${seed}:${contractId}:${profile}`);
  const stem = pick(random, value.stems);
  const options = shuffle(random, value.options) as [string, string, string, string];
  const correctIndex = options.indexOf(value.correct);
  if (correctIndex < 0 || options.length !== 4 || new Set(options).size !== 4) throw new Error(`${owner.qlId} produced invalid options.`);
  return Object.freeze({
    packageId: "STAT-004", questionId: `${owner.qlId}:${seed}`, contractId, qlId: owner.qlId,
    seed, examProfile: profile, difficulty: owner.difficulty, stem, options, correctIndex,
    answer: options[correctIndex]!, explanation: value.explanation, language: "en",
    questionBankWritable: false, testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false,
  });
}

function makeDraft(contractId: Stat004ContractId, seed: string, profile: Stat004ExamProfile): Draft {
  const random = seededRandom(`${seed}:${contractId}:stimulus`);
  switch (contractId) {
    case "PRIMARY_VS_SECONDARY_SOURCE": {
      const situation = pick(random, [
        "A factory asks its workers to complete a new survey about their daily travel time.",
        "A researcher interviews shop owners directly to record this month's stock shortages.",
        "A crop officer measures the yield from fields selected for a study this season.",
        "A college asks its students to report their own daily study hours for a new investigation.",
      ]);
      return draft([`${situation} The information collected is:`, `For a new study, an investigator collects responses directly from the people concerned. These responses are:`],
        ["primary data", "secondary data", "published records", "a sampling error"], "primary data",
        "The information is collected first-hand for the current investigation. That makes it primary data for this study; an existing report or earlier survey would be secondary data.");
    }
    case "CENSUS_VS_SAMPLE_ENUMERATION": {
      const population = pick(random, ["all 640 students enrolled at a college", "every household in a village", "all 275 machines in a plant", "each shop registered in a market"]);
      return draft([`A survey records information from ${population}. The method is:`, `An investigator obtains information from every unit in the stated population, ${population}. This is:`],
        ["complete enumeration", "a sample survey", "indirect oral investigation", "secondary-data collection"], "complete enumeration",
        "Every unit in the defined population is covered, so the investigation is a census or complete enumeration. A sample survey would cover only a selected part.");
    }
    case "DIRECT_PERSONAL_INVESTIGATION": {
      const topic = pick(random, ["household water use", "farmers' seed choices", "workers' shift preferences", "retailers' weekly sales"]);
      return draft([`An investigator visits the units concerned and personally asks them about ${topic}. Which collection method is used?`, `To collect information on ${topic}, the investigator meets the respondents and records their answers directly. This is:`],
        ["direct personal investigation", "indirect oral investigation", "a mailed questionnaire", "published-source collection"], "direct personal investigation",
        "The investigator obtains information directly from the units concerned. Indirect oral investigation would rely on informed third parties instead.");
    }
    case "INDIRECT_ORAL_INVESTIGATION": {
      const group = pick(random, ["seasonal workers who are difficult to contact individually", "traders who have left the market", "households in a region affected by a temporary road closure"]);
      return draft([`Investigators studying ${group} gather information from several people who know the group well rather than contacting each member. This is closest to:`, `When direct responses from ${group} cannot readily be obtained, information is collected from informed witnesses. The method is:`],
        ["indirect oral investigation", "complete enumeration", "direct personal investigation", "respondent-completed questionnaire"], "indirect oral investigation",
        "The information comes from informed third parties, not directly from every unit being studied. That is indirect oral investigation; the reliability of witnesses must be considered.");
    }
    case "SCHEDULE_VS_QUESTIONNAIRE": {
      const mode = pick(random, ["Enumerators visit households, ask the questions and write down each answer.", "A research office mails forms and respondents fill them in and return them.", "Field investigators read each question aloud and enter responses on the form themselves."]);
      const answer = mode.includes("respondents fill") ? "respondent-completed questionnaire" : "schedule";
      return draft([`${mode} The form is being used as a:`, `In the collection process, ${mode.toLowerCase()} Is the form a schedule or a questionnaire?`],
        ["schedule", "respondent-completed questionnaire", "observation sheet", "published statistical table"], answer,
        answer === "schedule" ? "An enumerator asks the questions and records the answers, so the form is a schedule. A questionnaire is ordinarily completed by the respondent." : "The respondents complete and return the form themselves, so this is the questionnaire method. In a schedule method, an enumerator records their answers.");
    }
    case "OBSERVATION_METHOD": {
      const activity = pick(random, ["vehicles entering a toll plaza", "customers joining a service queue", "birds visiting a marked feeding area", "machines stopping during a production shift"]);
      return draft([`An investigator records each instance of ${activity} as it occurs, without asking anyone to report it. Which method is used?`, `To measure ${activity}, the investigator watches the events and records them directly. This is:`],
        ["observation", "mailed questionnaire", "indirect oral investigation", "secondary-data analysis"], "observation",
        "The investigator records behaviour or events as they occur without relying on respondents' accounts. This is the observation method.");
    }
    case "SECONDARY_DATA_FITNESS": {
      const subject = pick(random, ["household electricity use", "crop output per hectare", "monthly school attendance", "average hospital waiting time"]);
      return draft([`A researcher compares two existing reports on ${subject}. They cover different reference periods and use different units. What should be checked before comparing their figures?`, `Before combining figures on ${subject} from two published sources, which check is essential?`],
        ["Whether definitions, units, population coverage and reference periods are comparable", "Which report has the larger numbers", "Whether both reports use the same page layout", "Whether the reports were printed in the same year"],
        "Whether definitions, units, population coverage and reference periods are comparable",
        "Figures can be compared only when their meaning and coverage align. Check definitions, measurement units, population covered and reference period; publication format or larger values do not establish comparability.");
    }
    case "QUALITATIVE_CLASSIFICATION": {
      const categories = pick(random, ["main cooking fuel", "type of crop grown", "marital status", "mode of transport to work"]);
      return draft([`A survey groups households by ${categories}. The characteristic used for grouping is:`, `Observations are classified by ${categories}, with each unit placed in a named category. This is classification by:`],
        ["a qualitative attribute", "a continuous variable", "a numerical magnitude", "a class mark"], "a qualitative attribute",
        "The groups describe kinds or categories rather than measured numerical amounts. This is qualitative classification.");
    }
    case "DISCRETE_VS_CONTINUOUS_VARIABLE": {
      const measured = pick(random, ["weight of parcels handled in a day", "time taken to complete a task", "length of metal rods produced", "volume of water used by a household"]);
      const counted = pick(random, ["number of customer complaints in a week", "number of machines operating in a plant", "number of seeds in a packet", "number of absent students in a class"]);
      const askMeasured = random() < 0.5;
      return draft([`Which of the following is a ${askMeasured ? "continuous measurement" : "discrete count"}?`, `Select the ${askMeasured ? "continuous variable" : "discrete variable"}.`],
        askMeasured ? [measured, counted, "number of buses in a depot", "number of calls received"] : [counted, measured, "weight of a package", "temperature of a sample"], askMeasured ? measured : counted,
        askMeasured ? `The quantity is measured and may take fractional values within a range, so ${measured.toLowerCase()} is continuous. Counts take separate whole-number values.` : `The quantity counts separate units, so ${counted.toLowerCase()} is discrete. Measurements such as weight or temperature may vary continuously across an interval.`);
    }
    case "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION": {
      const chronological = random() < 0.5;
      const stem = chronological
        ? "A statistical abstract lists a district's rainfall separately for each year from 2019 to 2024. The data are arranged by:"
        : "A statistical abstract lists annual rainfall separately for each district in a region. The data are arranged by: ";
      const correct = chronological ? "chronological classification" : "geographical classification";
      return draft([stem], ["chronological classification", "geographical classification", "qualitative classification", "individual classification"], correct,
        chronological ? "The observations are organized by year, so this is chronological classification. A place-wise arrangement would be geographical." : "The observations are organized by district, so this is geographical classification. A year-wise arrangement would be chronological.");
    }
    case "ONE_WAY_VS_TWO_WAY_CLASSIFICATION": {
      const characteristics = pick(random, [["year of study", "mode of residence"], ["occupation", "gender"], ["age group", "employment status"]] as const);
      return draft([`A table classifies people jointly by ${characteristics[0]} and ${characteristics[1]}. This is:`, `The rows and columns of a table classify each unit by both ${characteristics[0]} and ${characteristics[1]}. The table uses:`],
        ["one-way classification", "two-way classification", "chronological classification only", "a raw-data array"], "two-way classification",
        `Each observation is grouped using two characteristics: ${characteristics[0]} and ${characteristics[1]}. A one-way classification uses one characteristic.`);
    }
    case "TABLE_COMPONENTS": {
      const part = pick(random, ["The left-hand column lists the group names for each row. What is this part called?", "The headings printed above the data columns show what each column represents. These headings are called:"]);
      const correct = part.startsWith("The left") ? "stub" : "captions (boxhead)";
      return draft([part], ["stub", "captions (boxhead)", "table body", "source note"], correct,
        correct === "stub" ? "The stub contains the row headings. Captions or the boxhead contain the column headings; the body contains the data cells." : "Captions or the boxhead identify the columns. The stub contains row headings, while the body contains the data cells.");
    }
    case "FREQUENCY_TABLE_CHECK": {
      const cases = pick(random, [
        { frequencies: [7, 6, 9], stated: 22 },
        { frequencies: [8, 5, 6], stated: 20 },
        { frequencies: [12, 4, 7], stated: 23 },
      ] as const);
      const total = cases.frequencies.reduce((a, b) => a + b, 0);
      const correct = String(total);
      return draft([`A frequency table shows class frequencies ${cases.frequencies.join(", ")}. The raw list contains ${cases.stated} observations. What is the sum of the class frequencies, Σf?`, `The class frequencies in a table are ${cases.frequencies.join(", ")}. What is their sum, Σf?`],
        [correct, String(total - 1), String(total + 1), String(total + 2)], correct,
        `Add the class frequencies: ${cases.frequencies.join(" + ")} = ${total}. This total should equal the number of observations represented. Here it ${total === cases.stated ? "does" : "does not"} match ${cases.stated}.`);
    }
    case "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS": {
      const boundary = pick(random, [10, 20, 30]);
      const lower = boundary;
      const upper = boundary + 10;
      const previous = boundary - 10;
      return draft([`Classes are ${previous}–${boundary}, ${lower}–${upper} and ${upper}–${upper + 10}. Each class includes its lower limit but excludes its upper limit, except the final class. Where is an observation of exactly ${boundary} placed?`, `Using lower-inclusive, upper-exclusive intervals ${previous}–${boundary}, ${lower}–${upper} and ${upper}–${upper + 10}, where does the value ${boundary} belong?`],
        [`${previous}–${boundary} only`, `${lower}–${upper} only`, `Both adjacent classes`, `Neither adjacent class`], `${lower}–${upper} only`,
        `The first interval ends before ${boundary} because its upper limit is excluded. The next interval includes its lower limit, so ${boundary} belongs in ${lower}–${upper} only.`);
    }
    case "BUILD_A_BASIC_FREQUENCY_TABLE": {
      const data = pick(random, [
        [3, 7, 5, 8, 4, 6, 9, 5],
        [2, 4, 6, 7, 9, 10, 5, 8, 3, 6],
        [1, 5, 5, 7, 8, 9, 4, 6, 10, 3, 7, 2],
      ] as const);
      const frequencies: [number, number, number] = [0, 0, 0];
      for (const value of data) {
        const index = value < 4 ? 0 : value < 8 ? 1 : 2;
        frequencies[index] = (frequencies[index] ?? 0) + 1;
      }
      const answer = frequencies.join(", ");
      const shuffledWrong = [
        [frequencies[0] + 1, frequencies[1] - 1, frequencies[2]],
        [frequencies[0], frequencies[1] + 1, frequencies[2] - 1],
        [frequencies[0] + 1, frequencies[1], frequencies[2] - 1],
      ].map((xs) => xs.join(", ")).filter((x) => x !== answer);
      const uniqueWrong = [...new Set(shuffledWrong)].slice(0, 3);
      while (uniqueWrong.length < 3) uniqueWrong.push(`${uniqueWrong.length + 1}, ${uniqueWrong.length + 4}, ${uniqueWrong.length + 3}`);
      const values = [answer, ...uniqueWrong] as [string, string, string, string];
      return draft([`The observations are ${data.join(", ")}. Using classes 0–4, 4–8 and 8–12, with lower limits included and upper limits excluded, what are the frequencies in that order?`, `A set of ${data.length} observations is ${data.join(", ")}. Tally them into 0–4, 4–8 and 8–12, including each lower limit but not each upper limit. What frequencies result?`],
        values, answer,
        `Count values in each stated interval. In 0–4 there ${frequencies[0] === 1 ? "is" : "are"} ${frequencies[0]}; in 4–8 there ${frequencies[1] === 1 ? "is" : "are"} ${frequencies[1]}; in 8–12 there ${frequencies[2] === 1 ? "is" : "are"} ${frequencies[2]}. The frequencies add to ${data.length}, the number of observations.`);
    }
  }
}

export function generateStat004Question(input: { seed: string; contractId: Stat004ContractId; examProfile: Stat004ExamProfile }): Stat004Question {
  const { seed, contractId, examProfile } = input;
  const q = makeQuestion(contractId, seed, examProfile, makeDraft(contractId, seed, examProfile));
  assertStat004Question(q);
  return q;
}

export function assertStat004Question(question: Stat004Question): void {
  if (question.packageId !== "STAT-004" || !question.stem.trim() || question.options.length !== 4 || new Set(question.options).size !== 4) {
    throw new Error(`STAT-004 generated malformed question ${question.questionId}.`);
  }
  if (question.correctIndex < 0 || question.correctIndex > 3 || question.options[question.correctIndex] !== question.answer) {
    throw new Error(`STAT-004 answer index drifted for ${question.questionId}.`);
  }
  if (question.questionBankWritable || question.testEligible || question.mockTestEligible || question.publiclyPublishable || question.automaticStudentPublication || question.productionReleaseAuthorized) {
    throw new Error(`STAT-004 lifecycle lock weakened for ${question.questionId}.`);
  }
  if (question.contractId === "FREQUENCY_TABLE_CHECK") {
    const match = question.stem.match(/frequencies ([0-9, ]+).*contains ([0-9]+) observations/u);
    if (match) {
      const total = match[1]!.split(/,\s*/u).map(Number).reduce((a, b) => a + b, 0);
      if (Number(question.answer) !== total) throw new Error(`STAT-004 frequency-table key is incorrect for ${question.questionId}.`);
    }
  }
  if (question.contractId === "BUILD_A_BASIC_FREQUENCY_TABLE") {
    const m = question.stem.match(/observations are ([0-9, ]+)|observations is ([0-9, ]+)/u);
    if (m) {
      const n = (m[1] ?? m[2]!).split(/,\s*/u).map(Number).length;
      const frequencies = question.answer.split(/,\s*/u).map(Number);
      if (frequencies.length !== 3 || frequencies.reduce((a, b) => a + b, 0) !== n) throw new Error(`STAT-004 frequency-table total is incorrect for ${question.questionId}.`);
    }
  }
}

export function stat004ContractIds(): readonly Stat004ContractId[] {
  return ["PRIMARY_VS_SECONDARY_SOURCE", "CENSUS_VS_SAMPLE_ENUMERATION", "DIRECT_PERSONAL_INVESTIGATION", "INDIRECT_ORAL_INVESTIGATION", "SCHEDULE_VS_QUESTIONNAIRE", "OBSERVATION_METHOD", "SECONDARY_DATA_FITNESS", "QUALITATIVE_CLASSIFICATION", "DISCRETE_VS_CONTINUOUS_VARIABLE", "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION", "ONE_WAY_VS_TWO_WAY_CLASSIFICATION", "TABLE_COMPONENTS", "FREQUENCY_TABLE_CHECK", "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS", "BUILD_A_BASIC_FREQUENCY_TABLE"];
}
