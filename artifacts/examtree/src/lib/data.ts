export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  testsCount: number;
  exams: Exam[];
}

export interface Exam {
  id: string;
  name: string;
  year: number;
  testsCount: number;
  avgScore: number;
  categoryId: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  section: string;
  explanation: string;
}

export interface TestSection {
  id: string;
  name: string;
  questions: Question[];
}

export interface Test {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  duration: number;
  totalQuestions: number;
  attempts: number;
  avgScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  sectionTimingMode?: "none" | "fixed";
  sectionTimings?: { name: string; minutes: number }[];
  sectionSettings?: { name: string; locked: boolean }[];
  sections: TestSection[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  score: number;
  accuracy: number;
  testsCount: number;
  avatarSeed: string;
  isYou?: boolean;
}

const createQuestion = (
  id: number,
  section: string,
  text: string,
  options: string[],
  correct: number,
  explanation: string,
): Question => ({
  id,
  section,
  text,
  options,
  correct,
  explanation,
});

const createSection = (id: string, name: string, questions: Question[]): TestSection => ({
  id,
  name,
  questions,
});

export const categories: Category[] = [
  {
    id: "1",
    name: "JEE Main",
    description: "Joint Entrance Examination for top engineering colleges",
    icon: "Cpu",
    color: "blue",
    testsCount: 50,
    exams: [
      { id: "jee-2024", name: "JEE Main 2024", year: 2024, testsCount: 50, avgScore: 72.5, categoryId: "1" },
      { id: "jee-2023", name: "JEE Main 2023", year: 2023, testsCount: 45, avgScore: 70.2, categoryId: "1" },
      { id: "jee-2022", name: "JEE Main 2022", year: 2022, testsCount: 40, avgScore: 68.8, categoryId: "1" },
    ],
  },
  {
    id: "2",
    name: "NEET",
    description: "National Eligibility cum Entrance Test for medical aspirants",
    icon: "Heart",
    color: "emerald",
    testsCount: 45,
    exams: [
      { id: "neet-2024", name: "NEET 2024", year: 2024, testsCount: 60, avgScore: 75.3, categoryId: "2" },
      { id: "neet-2023", name: "NEET 2023", year: 2023, testsCount: 55, avgScore: 73.1, categoryId: "2" },
    ],
  },
  {
    id: "3",
    name: "CAT",
    description: "Common Admission Test for top management institutes",
    icon: "BarChart3",
    color: "violet",
    testsCount: 40,
    exams: [
      { id: "cat-2024", name: "CAT 2024", year: 2024, testsCount: 40, avgScore: 65.2, categoryId: "3" },
      { id: "cat-2023", name: "CAT 2023", year: 2023, testsCount: 35, avgScore: 63.8, categoryId: "3" },
    ],
  },
  {
    id: "4",
    name: "UPSC",
    description: "Civil Services Examination for government positions",
    icon: "Building2",
    color: "amber",
    testsCount: 35,
    exams: [
      { id: "upsc-2024", name: "UPSC CSE 2024", year: 2024, testsCount: 35, avgScore: 58.4, categoryId: "4" },
    ],
  },
  {
    id: "5",
    name: "GATE",
    description: "Graduate Aptitude Test in Engineering",
    icon: "Wrench",
    color: "orange",
    testsCount: 30,
    exams: [
      { id: "gate-2024", name: "GATE 2024 CS", year: 2024, testsCount: 30, avgScore: 67.9, categoryId: "5" },
    ],
  },
  {
    id: "6",
    name: "SSC CGL",
    description: "Staff Selection Commission Combined Graduate Level",
    icon: "FileText",
    color: "rose",
    testsCount: 28,
    exams: [
      { id: "ssc-2024", name: "SSC CGL 2024", year: 2024, testsCount: 28, avgScore: 61.5, categoryId: "6" },
    ],
  },
];

const jeeSections = [
  createSection("physics", "Physics", [
    createQuestion(101, "Physics", "A body of mass 2 kg is moving with velocity 3 m/s. What is its kinetic energy?", ["9 J", "6 J", "18 J", "12 J"], 0, "KE = 1/2 x m x v^2 = 9 J"),
    createQuestion(102, "Physics", "Which planet has the most moons in our solar system?", ["Jupiter", "Saturn", "Uranus", "Neptune"], 1, "Saturn currently has the most confirmed moons."),
    createQuestion(103, "Physics", "The speed of light in vacuum is approximately:", ["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^10 m/s", "3 x 10^4 m/s"], 1, "The accepted value is about 3 x 10^8 m/s."),
  ]),
  createSection("chemistry", "Chemistry", [
    createQuestion(104, "Chemistry", "The chemical formula of Baking Soda is:", ["Na2CO3", "NaHCO3", "NaCl", "NaOH"], 1, "Baking soda is sodium bicarbonate, NaHCO3."),
    createQuestion(105, "Chemistry", "Which element has atomic number 79?", ["Silver", "Platinum", "Gold", "Copper"], 2, "Gold has atomic number 79."),
    createQuestion(106, "Chemistry", "Water is chemically represented as:", ["H2O", "CO2", "O2", "NaCl"], 0, "A water molecule contains two hydrogen atoms and one oxygen atom."),
  ]),
  createSection("mathematics", "Mathematics", [
    createQuestion(107, "Mathematics", "If sin theta = 3/5, then cos theta equals:", ["4/5", "3/4", "5/4", "5/3"], 0, "Using the Pythagorean identity, cos theta = 4/5."),
    createQuestion(108, "Mathematics", "What is the derivative of sin(x)?", ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"], 1, "The derivative of sin(x) is cos(x)."),
    createQuestion(109, "Mathematics", "What is the value of log10(1000)?", ["2", "3", "4", "10"], 1, "Since 1000 = 10^3, log10(1000) = 3."),
  ]),
];

const neetSections = [
  createSection("biology", "Biology", [
    createQuestion(201, "Biology", "The process by which plants make food using sunlight is called:", ["Respiration", "Transpiration", "Photosynthesis", "Germination"], 2, "Photosynthesis converts sunlight into chemical energy."),
    createQuestion(202, "Biology", "Which part of the cell contains genetic material?", ["Nucleus", "Ribosome", "Cell wall", "Cytoplasm"], 0, "The nucleus stores most of the cell's genetic material."),
    createQuestion(203, "Biology", "Human blood is red because it contains:", ["Chlorophyll", "Hemoglobin", "Platelets", "Plasma"], 1, "Hemoglobin gives blood its red color."),
  ]),
  createSection("physics", "Physics", [
    createQuestion(204, "Physics", "What is the SI unit of force?", ["Joule", "Pascal", "Newton", "Watt"], 2, "Force is measured in newtons."),
    createQuestion(205, "Physics", "What does an ammeter measure?", ["Voltage", "Current", "Resistance", "Power"], 1, "An ammeter measures electric current."),
    createQuestion(206, "Physics", "Which mirror can form a magnified upright image?", ["Plane mirror", "Convex mirror", "Concave mirror", "No mirror"], 2, "A concave mirror can form a magnified upright image when the object is within focal length."),
  ]),
  createSection("chemistry", "Chemistry", [
    createQuestion(207, "Chemistry", "pH value less than 7 indicates:", ["Neutral", "Basic", "Acidic", "Salty"], 2, "A pH below 7 is acidic."),
    createQuestion(208, "Chemistry", "What is the common name of CaCO3?", ["Gypsum", "Limestone", "Bauxite", "Quartz"], 1, "CaCO3 is commonly called limestone."),
    createQuestion(209, "Chemistry", "Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 2, "Nitrogen makes up most of the atmosphere."),
  ]),
];

const catSections = [
  createSection("varc", "VARC", [
    createQuestion(301, "VARC", "Choose the word closest in meaning to 'abundant':", ["Scarce", "Plentiful", "Harsh", "Timid"], 1, "'Abundant' means plentiful."),
    createQuestion(302, "VARC", "Identify the grammatically correct sentence:", ["She do not like tea.", "She does not likes tea.", "She does not like tea.", "She not like tea."], 2, "The correct auxiliary verb is 'does' with the base verb 'like'."),
    createQuestion(303, "VARC", "A passage's main idea is best described as:", ["A minor detail", "The central message", "A random example", "The final sentence"], 1, "The main idea is the passage's central point."),
  ]),
  createSection("dilr", "DILR", [
    createQuestion(304, "DILR", "If 5 workers finish a task in 12 days, how many days will 10 workers take at the same rate?", ["3", "6", "10", "12"], 1, "Doubling workers halves the time."),
    createQuestion(305, "DILR", "Find the next number in the series: 2, 6, 12, 20, ?", ["24", "28", "30", "32"], 2, "The pattern is n(n+1): 1x2, 2x3, 3x4, 4x5, 5x6."),
    createQuestion(306, "DILR", "A clock shows 3:00. What is the angle between the hour and minute hands?", ["45 degrees", "60 degrees", "90 degrees", "120 degrees"], 2, "At 3:00 the hands are perpendicular."),
  ]),
  createSection("quant", "Quant", [
    createQuestion(307, "Quant", "What is 25% of 240?", ["50", "60", "70", "80"], 1, "25% of 240 is 60."),
    createQuestion(308, "Quant", "If x + 5 = 12, then x equals:", ["5", "6", "7", "8"], 2, "x = 12 - 5."),
    createQuestion(309, "Quant", "The average of 10, 20, and 30 is:", ["15", "20", "25", "30"], 1, "The average is (10 + 20 + 30) / 3 = 20."),
  ]),
];

const upscSections = [
  createSection("history", "History", [
    createQuestion(401, "History", "Who was the first Mughal emperor of India?", ["Akbar", "Babur", "Humayun", "Shah Jahan"], 1, "Babur founded the Mughal Empire in India."),
    createQuestion(402, "History", "The Revolt of 1857 started in:", ["Meerut", "Delhi", "Kanpur", "Lucknow"], 0, "The revolt began in Meerut."),
    createQuestion(403, "History", "Who gave the slogan 'Do or Die'?", ["Subhas Chandra Bose", "Jawaharlal Nehru", "Mahatma Gandhi", "Bhagat Singh"], 2, "Mahatma Gandhi gave the slogan during the Quit India Movement."),
  ]),
  createSection("geography", "Geography", [
    createQuestion(404, "Geography", "Which is the longest river in India?", ["Yamuna", "Godavari", "Ganga", "Narmada"], 2, "The Ganga is the longest river in India."),
    createQuestion(405, "Geography", "Which layer of the atmosphere contains the ozone layer?", ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], 1, "The ozone layer is located in the stratosphere."),
    createQuestion(406, "Geography", "Which is the largest desert in India?", ["Sahara", "Thar", "Gobi", "Kalahari"], 1, "The Thar Desert is India's largest desert."),
  ]),
  createSection("polity", "Polity", [
    createQuestion(407, "Polity", "How many houses are there in the Indian Parliament?", ["1", "2", "3", "4"], 1, "Parliament has Lok Sabha and Rajya Sabha."),
    createQuestion(408, "Polity", "Who is the constitutional head of India?", ["Prime Minister", "Chief Justice", "President", "Speaker"], 2, "The President is the constitutional head of India."),
    createQuestion(409, "Polity", "Fundamental Rights are included in which part of the Indian Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Fundamental Rights are in Part III."),
  ]),
];

export const allTests: Test[] = [
  { id: "1", name: "JEE Main Mock 1", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 5421, avgScore: 72.5, difficulty: "Hard", sections: jeeSections },
  { id: "2", name: "JEE Main Mock 2", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 4230, avgScore: 69.8, difficulty: "Hard", sections: jeeSections },
  { id: "3", name: "NEET Mock 1", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 4100, avgScore: 75.3, difficulty: "Medium", sections: neetSections },
  { id: "4", name: "NEET Mock 2", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 3800, avgScore: 71.2, difficulty: "Hard", sections: neetSections },
  { id: "5", name: "CAT Mock 1", category: "CAT", categoryId: "3", duration: 120, totalQuestions: 9, attempts: 1500, avgScore: 65.2, difficulty: "Medium", sections: catSections },
  { id: "6", name: "UPSC GS Paper 1", category: "UPSC", categoryId: "4", duration: 120, totalQuestions: 9, attempts: 890, avgScore: 58.4, difficulty: "Hard", sections: upscSections },
];

export const sampleQuestions: Question[] = allTests.flatMap((test) =>
  test.sections.flatMap((section) => section.questions),
);

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Raj Kumar", city: "Delhi", score: 98.5, accuracy: 96.2, testsCount: 45, avatarSeed: "raj" },
  { rank: 2, name: "Priya Sharma", city: "Mumbai", score: 96.2, accuracy: 94.1, testsCount: 42, avatarSeed: "priya" },
  { rank: 3, name: "Amit Singh", city: "Bangalore", score: 94.8, accuracy: 92.5, testsCount: 40, avatarSeed: "amit" },
  { rank: 4, name: "Sneha Patel", city: "Ahmedabad", score: 93.1, accuracy: 91.3, testsCount: 38, avatarSeed: "sneha" },
  { rank: 5, name: "Rohan Verma", city: "Chennai", score: 91.7, accuracy: 90.2, testsCount: 36, avatarSeed: "rohan" },
  { rank: 6, name: "Kavya Reddy", city: "Hyderabad", score: 90.4, accuracy: 88.9, testsCount: 35, avatarSeed: "kavya" },
  { rank: 7, name: "Arjun Mehta", city: "Pune", score: 89.2, accuracy: 87.5, testsCount: 33, avatarSeed: "arjun" },
  { rank: 8, name: "Divya Nair", city: "Kochi", score: 88.0, accuracy: 86.1, testsCount: 31, avatarSeed: "divya" },
  { rank: 9, name: "Siddharth Joshi", city: "Jaipur", score: 86.8, accuracy: 84.7, testsCount: 29, avatarSeed: "sid" },
  { rank: 1250, name: "You", city: "Your City", score: 85.5, accuracy: 82.3, testsCount: 12, avatarSeed: "you", isYou: true },
];
