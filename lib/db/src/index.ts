import { pgTable, text, integer, timestamp, jsonb, serial, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").$type<"admin" | "student">().notNull().default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  testsCount: integer("tests_count").notNull().default(0),
});

export const bundles = pgTable("bundles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: text("category_id").notNull(),
  price: integer("price").notNull().default(0), // Price in cents
  originalPrice: integer("original_price"),
  testsCount: integer("tests_count").notNull().default(0),
  features: jsonb("features").notNull(), // Array of features like ["Detailed Solutions", "Performance Analytics", etc.]
  isPopular: integer("is_popular").notNull().default(0), // 0 = false, 1 = true
  order: integer("order").notNull().default(0), // Display order
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subcategories = pgTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const tests = pgTable("tests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  categoryId: text("category_id").notNull(),
  subcategoryId: text("subcategory_id").notNull().default(""),
  subcategoryName: text("subcategory_name").notNull().default(""),
  access: text("access").$type<"free" | "paid">().notNull().default("free"),
  kind: text("kind").$type<"full-length" | "sectional" | "topic-wise">().notNull().default("full-length"),
  duration: integer("duration").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  attempts: integer("attempts").notNull().default(0),
  avgScore: integer("avg_score").notNull().default(0),
  difficulty: text("difficulty").$type<"Easy" | "Medium" | "Hard">().notNull(),
  sectionTimingMode: text("section_timing_mode").$type<"none" | "fixed">(),
  sectionTimings: jsonb("section_timings"),
  sectionSettings: jsonb("section_settings"),
  sections: jsonb("sections").notNull(),
  /** Display/checkout amount in cents for paid tests; ignored when access is free */
  priceCents: integer("price_cents"),
});

export const userTestEntitlements = pgTable(
  "user_test_entitlements",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testId: text("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    source: text("source").$type<"stripe" | "mock" | "admin">().notNull().default("stripe"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.testId] }),
  }),
);

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  clientId: text("client_id").notNull().default(""),
  testId: text("test_id").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").notNull(),
  correct: integer("correct").notNull(),
  section: text("section").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attempts = pgTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  testId: text("test_id").notNull(),
  testName: text("test_name").notNull(),
  category: text("category").notNull(),
  score: integer("score").notNull(),
  correct: integer("correct").notNull(),
  wrong: integer("wrong").notNull(),
  unanswered: integer("unanswered").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(),
  date: text("date").notNull(),
  sectionStats: jsonb("section_stats"),
  sectionTimeSpent: jsonb("section_time_spent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
