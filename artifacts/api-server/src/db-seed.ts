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
      { id: "1", name: "SSC CGL", description: "Staff Selection Commission Combined Graduate Level", icon: "FileText", color: "rose", testsCount: 0 },
      { id: "2", name: "Banking", description: "Banking and financial sector recruitment exams", icon: "Banknote", color: "indigo", testsCount: 0 },
      { id: "3", name: "Punjab", description: "Punjab state government exams and competitive tests", icon: "https://www.kindpng.com/picc/m/120-1201989_govt-of-punjab-india-logo-hd-png-download.png", color: "red", testsCount: 0 },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values(cat);
    }
    console.log("✓ Added 3 categories");

    // Add sample tests
    const testData = [
      { id: "1", name: "SSC CGL Mock 1", category: "SSC CGL", categoryId: "1", duration: 120, totalQuestions: 9, attempts: 0, avgScore: 0, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "2", name: "IBPS PO Prelims", category: "Banking", categoryId: "2", duration: 60, totalQuestions: 9, attempts: 0, avgScore: 0, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "3", name: "IBPS Clerk Mock", category: "Banking", categoryId: "2", duration: 45, totalQuestions: 9, attempts: 0, avgScore: 0, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "4", name: "Punjab PSC Mock", category: "Punjab", categoryId: "3", duration: 120, totalQuestions: 9, attempts: 0, avgScore: 0, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "5", name: "PSSSB Exam Mock", category: "Punjab", categoryId: "3", duration: 90, totalQuestions: 9, attempts: 0, avgScore: 0, difficulty: "Medium" as const, sections: JSON.stringify([]) },
    ];

    for (const test of testData) {
      await db.insert(tests).values(test as any).onConflictDoNothing();
    }
    console.log("✓ Added 5 sample tests");

    // Add sample questions
    const questionData = [
      { testId: "1", text: "What does SSC stand for?", options: JSON.stringify(["Staff Selection Commission", "State Service Company", "Socio-Service Center", "Social Security Committee"]), correct: 0, section: "GK", explanation: "SSC stands for Staff Selection Commission, a government body in India." },
      { testId: "1", text: "What is the full form of CGL?", options: JSON.stringify(["Combined Graduate Level", "Central General List", "Combined General Ledger", "Competitive General Literacy"]), correct: 0, section: "GK", explanation: "CGL stands for Combined Graduate Level examination." },
      
      { testId: "2", text: "What is the main function of a bank?", options: JSON.stringify(["Lend money", "Provide financial services", "Collect deposits", "All of the above"]), correct: 3, section: "Banking", explanation: "Banks provide comprehensive financial services including lending and deposit collection." },
      { testId: "2", text: "What does IBPS stand for?", options: JSON.stringify(["Institute of Banking and Personnel Selection", "Indian Banking Personnel System", "Inter-Bank Payment Services", "Indian Board of Personnel and Selection"]), correct: 0, section: "Banking", explanation: "IBPS stands for Institute of Banking and Personnel Selection." },
      
      { testId: "3", text: "Punjab is located in which region of India?", options: JSON.stringify(["North", "South", "East", "West"]), correct: 0, section: "Geography", explanation: "Punjab is located in the northern region of India." },
      { testId: "3", text: "What is the capital of Punjab?", options: JSON.stringify(["Amritsar", "Chandigarh", "Ludhiana", "Jalandhar"]), correct: 1, section: "Geography", explanation: "Chandigarh is the capital of Punjab." },
    ];

    for (const q of questionData) {
      await db.insert(questions).values(q as any).onConflictDoNothing();
    }
    console.log("✓ Added 6 sample questions");

    console.log("\n✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
