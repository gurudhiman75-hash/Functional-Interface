import { db } from "./lib/db";
import { categories, tests, questions } from "@workspace/db";

async function seedDatabase() {
  try {
    console.log("Seeding database...\n");

    // Clear all existing data
    console.log("Clearing existing data...");
    await db.execute(`DELETE FROM "questions"`);
    await db.execute(`DELETE FROM "tests"`);
    await db.execute(`DELETE FROM "categories"`);
    console.log("✓ Cleared existing data");

    // Add categories
    const categoryData = [
      { id: "1", name: "JEE Main", description: "Joint Entrance Examination for top engineering colleges", icon: "Cpu", color: "blue", testsCount: 3 },
      { id: "2", name: "NEET", description: "National Eligibility cum Entrance Test for medical aspirants", icon: "Heart", color: "emerald", testsCount: 2 },
      { id: "3", name: "CAT", description: "Common Admission Test for top management institutes", icon: "BarChart3", color: "violet", testsCount: 2 },
      { id: "4", name: "UPSC", description: "Civil Services Examination for government positions", icon: "Building2", color: "amber", testsCount: 1 },
      { id: "5", name: "GATE", description: "Graduate Aptitude Test in Engineering", icon: "Wrench", color: "orange", testsCount: 1 },
      { id: "6", name: "SSC CGL", description: "Staff Selection Commission Combined Graduate Level", icon: "FileText", color: "rose", testsCount: 1 },
      { id: "7", name: "Banking", description: "Banking and financial sector recruitment exams", icon: "Banknote", color: "indigo", testsCount: 2 },
      { id: "8", name: "Punjab", description: "Punjab state government exams and competitive tests", icon: "MapPin", color: "red", testsCount: 2 },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values(cat);
    }
    console.log("✓ Added 8 categories");

    // Add sample tests
    const testData = [
      { id: "1", name: "JEE Main Mock 1", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 5421, avgScore: 72, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "2", name: "JEE Main Mock 2", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 4230, avgScore: 69, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "3", name: "NEET Mock 1", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 4100, avgScore: 75, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "4", name: "NEET Mock 2", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 3800, avgScore: 71, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "5", name: "CAT Mock 1", category: "CAT", categoryId: "3", duration: 120, totalQuestions: 9, attempts: 1500, avgScore: 65, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "6", name: "UPSC GS Paper 1", category: "UPSC", categoryId: "4", duration: 120, totalQuestions: 9, attempts: 890, avgScore: 58, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "7", name: "IBPS PO Prelims", category: "Banking", categoryId: "7", duration: 60, totalQuestions: 9, attempts: 3200, avgScore: 62, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "8", name: "IBPS Clerk Mock", category: "Banking", categoryId: "7", duration: 45, totalQuestions: 9, attempts: 2800, avgScore: 68, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "9", name: "Punjab PSC Mock", category: "Punjab", categoryId: "8", duration: 120, totalQuestions: 9, attempts: 1200, avgScore: 60, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "10", name: "PSSSB Exam Mock", category: "Punjab", categoryId: "8", duration: 90, totalQuestions: 9, attempts: 980, avgScore: 64, difficulty: "Medium" as const, sections: JSON.stringify([]) },
    ];

    for (const test of testData) {
      await db.insert(tests).values(test as any).onConflictDoNothing();
    }
    console.log("✓ Added 10 sample tests");

    // Add sample questions
    const questionData = [
      { testId: "1", text: "A body of mass 2 kg is moving with velocity 3 m/s. What is its kinetic energy?", options: JSON.stringify(["9 J", "6 J", "18 J", "12 J"]), correct: 0, section: "Physics", explanation: "KE = 1/2 x m x v^2 = 9 J" },
      { testId: "1", text: "Which planet has the most moons in our solar system?", options: JSON.stringify(["Jupiter", "Saturn", "Uranus", "Neptune"]), correct: 1, section: "Physics", explanation: "Saturn currently has the most confirmed moons." },
      { testId: "1", text: "The speed of light in vacuum is approximately:", options: JSON.stringify(["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^10 m/s", "3 x 10^4 m/s"]), correct: 1, section: "Physics", explanation: "The accepted value is about 3 x 10^8 m/s." },
      
      { testId: "1", text: "The chemical formula of Baking Soda is:", options: JSON.stringify(["Na2CO3", "NaHCO3", "NaCl", "NaOH"]), correct: 1, section: "Chemistry", explanation: "Baking soda is sodium bicarbonate, NaHCO3." },
      { testId: "1", text: "Which element has atomic number 79?", options: JSON.stringify(["Silver", "Platinum", "Gold", "Copper"]), correct: 2, section: "Chemistry", explanation: "Gold has atomic number 79." },
      { testId: "1", text: "Water is chemically represented as:", options: JSON.stringify(["H2O", "CO2", "O2", "NaCl"]), correct: 0, section: "Chemistry", explanation: "A water molecule contains two hydrogen atoms and one oxygen atom." },
      
      { testId: "1", text: "If sin theta = 3/5, then cos theta equals:", options: JSON.stringify(["4/5", "3/4", "5/4", "5/3"]), correct: 0, section: "Mathematics", explanation: "Using the Pythagorean identity, cos theta = 4/5." },
      { testId: "1", text: "What is the derivative of sin(x)?", options: JSON.stringify(["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"]), correct: 1, section: "Mathematics", explanation: "The derivative of sin(x) is cos(x)." },
      { testId: "1", text: "What is the value of log10(1000)?", options: JSON.stringify(["2", "3", "4", "10"]), correct: 1, section: "Mathematics", explanation: "Since 1000 = 10^3, log10(1000) = 3." },

      { testId: "3", text: "The process by which plants make food using sunlight is called:", options: JSON.stringify(["Respiration", "Transpiration", "Photosynthesis", "Germination"]), correct: 2, section: "Biology", explanation: "Photosynthesis converts sunlight into chemical energy." },
      { testId: "3", text: "Which part of the cell contains genetic material?", options: JSON.stringify(["Nucleus", "Ribosome", "Cell wall", "Cytoplasm"]), correct: 0, section: "Biology", explanation: "The nucleus stores most of the cell's genetic material." },
      { testId: "3", text: "Human blood is red because it contains:", options: JSON.stringify(["Chlorophyll", "Hemoglobin", "Platelets", "Plasma"]), correct: 1, section: "Biology", explanation: "Hemoglobin gives blood its red color." },
    ];

    for (const q of questionData) {
      await db.insert(questions).values(q as any).onConflictDoNothing();
    }
    console.log("✓ Added 12 sample questions");

    console.log("\n✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
