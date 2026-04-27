import { eq } from "drizzle-orm";
import { db } from "./lib/db";
import { categories, sections, topics, topicsGlobal } from "@workspace/db";
import { resolveCategoryIcon } from "./lib/category-icons";

/**
 * Seeds initial category data.
 * Run `migrate.ts` first to ensure all tables exist.
 */
async function initializeDatabase() {
  try {
    console.log("Seeding initial data...");

    const retiredCategoryNames = ["JEE Main", "NEET", "UPSC", "GATE"];
    await db.delete(categories).where(
      eq(categories.name, retiredCategoryNames[0]),
    );
    for (const name of retiredCategoryNames.slice(1)) {
      await db.delete(categories).where(eq(categories.name, name));
    }

    const bundledIcons = [
      { name: "SSC CGL", icon: "/category-icons/ssc-cgl.png" },
      { name: "Punjab", icon: "/category-icons/punjab.png" },
    ];
    for (const item of bundledIcons) {
      await db
        .update(categories)
        .set({ icon: resolveCategoryIcon(item.name, item.icon) })
        .where(eq(categories.name, item.name));
    }

    const existingCategories = await db.select().from(categories);

    if (existingCategories.length !== 4) {
      console.log(`Replacing ${existingCategories.length} categories with 4 active ones`);

      await db.execute(`DELETE FROM "categories"`);

      const categoryData = [
        { id: "3", name: "CAT", description: "Common Admission Test for top management institutes", icon: "BarChart3", color: "violet", testsCount: 2 },
        { id: "6", name: "SSC CGL", description: "Staff Selection Commission Combined Graduate Level", icon: resolveCategoryIcon("SSC CGL", "/category-icons/ssc-cgl.png"), color: "rose", testsCount: 1 },
        { id: "7", name: "Banking", description: "Banking and financial sector recruitment exams", icon: "Banknote", color: "indigo", testsCount: 2 },
        { id: "8", name: "Punjab", description: "Punjab state government exams and competitive tests", icon: resolveCategoryIcon("Punjab", "/category-icons/punjab.png"), color: "green", testsCount: 2 },
      ];

      for (const cat of categoryData) {
        await db.insert(categories).values(cat);
      }
      console.log("Added 4 categories");
    } else {
      console.log("Database already has 4 categories");
    }

    console.log("Seed complete!");

    // Sections and topics taxonomy (upsert, idempotent)
    const sectionSeeds = [
      { id: "sec-quant", name: "Quant" },
      { id: "sec-reasoning", name: "Reasoning" },
      { id: "sec-english", name: "English" },
    ];
    let sectionsInserted = 0;
    for (const s of sectionSeeds) {
      const result = await db
        .insert(sections)
        .values(s)
        .onConflictDoNothing()
        .returning({ id: sections.id });
      if (result.length > 0) sectionsInserted++;
    }
    if (sectionsInserted > 0) {
      console.log(`Sections: inserted ${sectionsInserted} new row(s) (mapped to sections table)`);
    } else {
      console.log("Sections: all rows already present - skipped");
    }

    const topicSeeds = [
      { id: "topic-arithmetic", name: "Arithmetic" },
      { id: "topic-algebra", name: "Algebra" },
      { id: "topic-percentage", name: "Percentage" },
      { id: "topic-ratio", name: "Ratio" },
      { id: "topic-coding", name: "Coding-Decoding" },
      { id: "topic-series", name: "Series" },
      { id: "topic-analogy", name: "Analogy" },
      { id: "topic-error", name: "Error Detection" },
      { id: "topic-fillinblanks", name: "Fill in the Blanks" },
    ];
    let topicsInserted = 0;
    for (const t of topicSeeds) {
      const legacyResult = await db
        .insert(topics)
        .values(t)
        .onConflictDoNothing()
        .returning({ id: topics.id });
      const globalResult = await db
        .insert(topicsGlobal)
        .values(t)
        .onConflictDoNothing()
        .returning({ id: topicsGlobal.id });
      if (legacyResult.length > 0 || globalResult.length > 0) topicsInserted++;
    }
    if (topicsInserted > 0) {
      console.log(`Topics: inserted ${topicsInserted} new row(s) (mapped to topics/topics_global tables)`);
    } else {
      console.log("Topics: all rows already present - skipped");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

initializeDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
