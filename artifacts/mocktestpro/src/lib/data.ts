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
  sections: string[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  section: string;
  explanation: string;
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

export const allTests: Test[] = [
  { id: "1", name: "JEE Main Mock 1", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 90, attempts: 5421, avgScore: 72.5, difficulty: "Hard", sections: ["Physics", "Chemistry", "Mathematics"] },
  { id: "2", name: "JEE Main Mock 2", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 90, attempts: 4230, avgScore: 69.8, difficulty: "Hard", sections: ["Physics", "Chemistry", "Mathematics"] },
  { id: "3", name: "NEET Mock 1", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 180, attempts: 4100, avgScore: 75.3, difficulty: "Medium", sections: ["Biology", "Physics", "Chemistry"] },
  { id: "4", name: "NEET Mock 2", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 180, attempts: 3800, avgScore: 71.2, difficulty: "Hard", sections: ["Biology", "Physics", "Chemistry"] },
  { id: "5", name: "CAT Mock 1", category: "CAT", categoryId: "3", duration: 120, totalQuestions: 100, attempts: 1500, avgScore: 65.2, difficulty: "Medium", sections: ["VARC", "DILR", "Quant"] },
  { id: "6", name: "UPSC GS Paper 1", category: "UPSC", categoryId: "4", duration: 120, totalQuestions: 100, attempts: 890, avgScore: 58.4, difficulty: "Hard", sections: ["History", "Geography", "Polity"] },
];

export const sampleQuestions: Question[] = [
  { id: 1, text: "A body of mass 2 kg is moving with velocity 3 m/s. What is its kinetic energy?", options: ["9 J", "6 J", "18 J", "12 J"], correct: 0, section: "Physics", explanation: "KE = ½mv² = ½ × 2 × 9 = 9 J" },
  { id: 2, text: "The chemical formula of Baking Soda is:", options: ["Na₂CO₃", "NaHCO₃", "NaCl", "NaOH"], correct: 1, section: "Chemistry", explanation: "Baking Soda is Sodium Bicarbonate with formula NaHCO₃" },
  { id: 3, text: "If sin θ = 3/5, then cos θ equals:", options: ["4/5", "3/4", "5/4", "5/3"], correct: 0, section: "Mathematics", explanation: "Using Pythagorean identity: cos θ = √(1 - sin²θ) = √(1 - 9/25) = 4/5" },
  { id: 4, text: "Which planet has the most moons in our solar system?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correct: 1, section: "Physics", explanation: "Saturn currently has the most known moons with 146 confirmed natural satellites." },
  { id: 5, text: "The process by which plants make food using sunlight is called:", options: ["Respiration", "Transpiration", "Photosynthesis", "Germination"], correct: 2, section: "Biology", explanation: "Photosynthesis is the process by which plants convert sunlight into food." },
  { id: 6, text: "What is the derivative of sin(x)?", options: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"], correct: 1, section: "Mathematics", explanation: "d/dx(sin x) = cos x" },
  { id: 7, text: "The speed of light in vacuum is approximately:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1, section: "Physics", explanation: "The speed of light in vacuum is approximately 3×10⁸ m/s (299,792,458 m/s)." },
  { id: 8, text: "Which element has atomic number 79?", options: ["Silver", "Platinum", "Gold", "Copper"], correct: 2, section: "Chemistry", explanation: "Gold (Au) has atomic number 79." },
  { id: 9, text: "What is the value of log₁₀(1000)?", options: ["2", "3", "4", "10"], correct: 1, section: "Mathematics", explanation: "log₁₀(1000) = log₁₀(10³) = 3" },
  { id: 10, text: "Who discovered the law of universal gravitation?", options: ["Einstein", "Galileo", "Newton", "Kepler"], correct: 2, section: "Physics", explanation: "Sir Isaac Newton formulated the law of universal gravitation in 1687." },
];

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
