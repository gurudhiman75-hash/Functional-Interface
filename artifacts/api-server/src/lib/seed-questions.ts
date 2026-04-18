import { db } from "./db";
import { questions } from "@workspace/db";
import { logger } from "./logger";

const SAMPLE_FOR_TEST_1 = [
  {
    testId: "1",
    text: "A body of mass 2 kg is moving with velocity 3 m/s. What is its kinetic energy?",
    options: ["9 J", "6 J", "18 J", "12 J"],
    correct: 0,
    section: "Physics",
    topic: "Mechanics",
    explanation: "KE = 1/2 x m x v^2 = 9 J",
  },
  {
    testId: "1",
    text: "Which planet has the most moons in our solar system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1,
    section: "Physics",
    topic: "Astronomy",
    explanation: "Saturn currently has the most confirmed moons.",
  },
  {
    testId: "1",
    text: "The speed of light in vacuum is approximately:",
    options: ["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^10 m/s", "3 x 10^4 m/s"],
    correct: 1,
    section: "Physics",
    topic: "Optics",
    explanation: "The accepted value is about 3 x 10^8 m/s.",
  },
  {
    testId: "1",
    text: "The chemical formula of Baking Soda is:",
    options: ["Na2CO3", "NaHCO3", "NaCl", "NaOH"],
    correct: 1,
    section: "Chemistry",
    topic: "Inorganic Chemistry",
    explanation: "Baking soda is sodium bicarbonate, NaHCO3.",
  },
  {
    testId: "1",
    text: "Which element has atomic number 79?",
    options: ["Silver", "Platinum", "Gold", "Copper"],
    correct: 2,
    section: "Chemistry",
    topic: "Periodic Table",
    explanation: "Gold has atomic number 79.",
  },
  {
    testId: "1",
    text: "Water is chemically represented as:",
    options: ["H2O", "CO2", "O2", "NaCl"],
    correct: 0,
    section: "Chemistry",
    topic: "Inorganic Chemistry",
    explanation: "A water molecule contains two hydrogen atoms and one oxygen atom.",
  },
  {
    testId: "1",
    text: "If sin theta = 3/5, then cos theta equals:",
    options: ["4/5", "3/4", "5/4", "5/3"],
    correct: 0,
    section: "Mathematics",
    topic: "Trigonometry",
    explanation: "Using the Pythagorean identity, cos theta = 4/5.",
  },
  {
    testId: "1",
    text: "What is the derivative of sin(x)?",
    options: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"],
    correct: 1,
    section: "Mathematics",
    topic: "Calculus",
    explanation: "The derivative of sin(x) is cos(x).",
  },
  {
    testId: "1",
    text: "What is the value of log10(1000)?",
    options: ["2", "3", "4", "10"],
    correct: 1,
    section: "Mathematics",
    topic: "Arithmetic",
    explanation: "Since 1000 = 10^3, log10(1000) = 3.",
  },
];

const SAMPLE_FOR_TEST_3 = [
  {
    testId: "3",
    text: "The process by which plants make food using sunlight is called:",
    options: ["Respiration", "Transpiration", "Photosynthesis", "Germination"],
    correct: 2,
    section: "Biology",
    topic: "Plant Biology",
    explanation: "Photosynthesis converts sunlight into chemical energy.",
  },
  {
    testId: "3",
    text: "Which part of the cell contains genetic material?",
    options: ["Nucleus", "Ribosome", "Cell wall", "Cytoplasm"],
    correct: 0,
    section: "Biology",
    topic: "Cell Biology",
    explanation: "The nucleus stores most of the cell's genetic material.",
  },
  {
    testId: "3",
    text: "Human blood is red because it contains:",
    options: ["Chlorophyll", "Hemoglobin", "Platelets", "Plasma"],
    correct: 1,
    section: "Biology",
    topic: "Human Physiology",
    explanation: "Hemoglobin gives blood its red color.",
  },
];

function genericBlock(testId: string, count: number, section: string, topic = "General") {
  return Array.from({ length: count }, (_, i) => ({
    testId,
    text: `Practice question ${i + 1}: What is ${2 + i} + ${3 + i}?`,
    options: [`${4 + i}`, `${5 + 2 * i}`, `${6 + i}`, `${7 + i}`],
    correct: 1,
    section,
    topic,
    explanation: `The sum is ${5 + 2 * i}.`,
  }));
}

/** Seed sample questions only once when database is empty */
export async function ensureSampleQuestions(): Promise<void> {
  const existing = await db.select().from(questions);
  
  // Only seed if no questions exist (database is empty)
  if (existing.length > 0) {
    logger.info(
      { existing: existing.length },
      "Question bank already populated. Skipping seed.",
    );
    return;
  }

  logger.info("Question bank is empty. Seeding sample questions...");

  const bulk: {
    testId: string;
    text: string;
    options: string[];
    correct: number;
    section: string;
    topic: string;
    explanation: string;
  }[] = [
    ...SAMPLE_FOR_TEST_1,
    ...SAMPLE_FOR_TEST_3,
    ...genericBlock("3", 6, "Biology", "Cell Biology"),
    ...genericBlock("2", 9, "General", "General"),
    ...genericBlock("4", 9, "General", "General"),
    ...genericBlock("5", 9, "General", "General"),
    ...genericBlock("6", 9, "General", "General"),
    ...genericBlock("7", 9, "General", "General"),
    ...genericBlock("8", 9, "General", "General"),
    ...genericBlock("9", 9, "General", "General"),
    ...genericBlock("10", 9, "General", "General"),
  ];

  await db.insert(questions).values(bulk);
  logger.info({ count: bulk.length }, "✓ Sample questions seeded");
}
