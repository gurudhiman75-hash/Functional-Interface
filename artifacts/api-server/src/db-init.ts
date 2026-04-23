import { sql } from "drizzle-orm";
import { db } from "./lib/db";
import { categories } from "@workspace/db";

/**
 * Seeds initial category data.
 * Run `migrate.ts` first to ensure all tables exist.
 */
async function initializeDatabase() {
  try {
    console.log("Seeding initial data...");

    const existingCategories = await db.select().from(categories);

    if (existingCategories.length !== 3) {
      console.log(`Replacing ${existingCategories.length} categories with 3 complete ones`);

      await db.execute(`DELETE FROM "categories"`);

      const categoryData = [
        { id: "1", name: "JEE Main", description: "Joint Entrance Examination for top engineering colleges", icon: "Cpu", color: "blue", testsCount: 3 },
        { id: "2", name: "NEET", description: "National Eligibility cum Entrance Test for medical aspirants", icon: "Heart", color: "emerald", testsCount: 2 },
        { id: "3", name: "CAT", description: "Common Admission Test for top management institutes", icon: "BarChart3", color: "violet", testsCount: 2 },
        { id: "4", name: "UPSC", description: "Civil Services Examination for government positions", icon: "Building2", color: "amber", testsCount: 1 },
        { id: "5", name: "GATE", description: "Graduate Aptitude Test in Engineering", icon: "Wrench", color: "orange", testsCount: 1 },
        { id: "6", name: "SSC CGL", description: "Staff Selection Commission Combined Graduate Level", icon: "FileText", color: "rose", testsCount: 1 },
        { id: "7", name: "Banking", description: "Banking and financial sector recruitment exams", icon: "Banknote", color: "indigo", testsCount: 2 },
        { id: "8", name: "Punjab", description: "Punjab state government exams and competitive tests", icon: "https://www.kindpng.com/picc/m/120-1201989_govt-of-punjab-india-logo-hd-png-download.png" ng.com">", testsCount: 2 },
      ];

      for (const cat of categoryData) {
        await db.insert(categories).values(cat);
      }
      console.log("Added 3 categories");
    } else {
      console.log("Database already has 3 categories");
    }

    console.log("Seed complete!");

    // ── Sections & Topics taxonomy (upsert, idempotent) ───────────────────
    const sectionSeeds = [
      { id: "sec-quant",     name: "Quant" },
      { id: "sec-reasoning", name: "Reasoning" },
      { id: "sec-english",   name: "English" },
    ];
    let sectionsInserted = 0;
    for (const s of sectionSeeds) {
      const result = await db.execute(
        sql`INSERT INTO sections (id, name) VALUES (${s.id}, ${s.name}) ON CONFLICT (name) DO NOTHING`,
      );
      if ((result as any).rowCount > 0) sectionsInserted++;
    }
    if (sectionsInserted > 0) {
      console.log(`Sections: inserted ${sectionsInserted} new row(s) (mapped to sections table)`);
    } else {
      console.log("Sections: all rows already present — skipped");
    }

    const topicSeeds = [
      { id: "topic-arithmetic",   name: "Arithmetic",         sectionId: "sec-quant" },
      { id: "topic-algebra",      name: "Algebra",            sectionId: "sec-quant" },
      { id: "topic-percentage",   name: "Percentage",         sectionId: "sec-quant" },
      { id: "topic-ratio",        name: "Ratio",              sectionId: "sec-quant" },
      { id: "topic-coding",       name: "Coding-Decoding",    sectionId: "sec-reasoning" },
      { id: "topic-series",       name: "Series",             sectionId: "sec-reasoning" },
      { id: "topic-analogy",      name: "Analogy",            sectionId: "sec-reasoning" },
      { id: "topic-error",        name: "Error Detection",    sectionId: "sec-english" },
      { id: "topic-fillinblanks", name: "Fill in the Blanks", sectionId: "sec-english" },
    ];
    let topicsInserted = 0;
    for (const t of topicSeeds) {
      const result = await db.execute(
        sql`INSERT INTO topics (id, name, section_id) VALUES (${t.id}, ${t.name}, ${t.sectionId}) ON CONFLICT (section_id, name) DO NOTHING`,
      );
      if ((result as any).rowCount > 0) topicsInserted++;
    }
    if (topicsInserted > 0) {
      console.log(`Topics: inserted ${topicsInserted} new row(s) (mapped to topics table)`);
    } else {
      console.log("Topics: all rows already present — skipped");
    }

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

initializeDatabase();
