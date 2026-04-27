import { pgTable, text, integer, real, doublePrecision, timestamp, date, jsonb, serial, uuid, primaryKey, unique, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export type MockSection = "quant" | "reasoning" | "english" | "general";
export type MockDifficulty = "easy" | "medium" | "hard";

// ── Question taxonomy ─────────────────────────────────────────────────────────
/** Master list of question sections (e.g. Quant, Reasoning, English). */
export const sections = pgTable("sections", {
  id: text("id").primaryKey(),        // uuid, set by application
  name: text("name").notNull().unique(),
});

/** Global topics (e.g. Arithmetic, Coding-Decoding). Independent of section. */
export const topics = pgTable("topics", {
  id: text("id").primaryKey(),      // uuid, set by application
  name: text("name").notNull().unique(),
});

/**
 * topics_global — canonical global topics table (independent of section).
 * Coexists with `topics` during migration; eventually replaces it.
 */
export const topicsGlobal = pgTable("topics_global", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const patterns = pgTable(
  "patterns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    section: text("section").$type<MockSection>().notNull(),
    topic: text("topic").notNull(),
    subtopic: text("subtopic").notNull().default(""),
    difficulty: text("difficulty").$type<MockDifficulty>().notNull().default("medium"),
    template: text("template").notNull(),
    variables: jsonb("variables").notNull(),
    answerExpression: text("answer_expression").notNull(),
    distractorStrategy: jsonb("distractor_strategy"),
    tags: jsonb("tags"),
    usageCount: integer("usage_count").notNull().default(0),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sectionIdx: index("patterns_section_idx").on(t.section),
    topicIdx: index("patterns_topic_idx").on(t.topic),
    subtopicIdx: index("patterns_subtopic_idx").on(t.subtopic),
  }),
);

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

export const bundlePackages = pgTable(
  "bundle_packages",
  {
    id: text("id").primaryKey(),
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    packageId: text("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "cascade" }),
  },
  (t) => ({
    uniqueBundlePackage: unique({ columns: [t.bundleId, t.packageId] }),
  }),
);

export const subcategories = pgTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  /** Languages available for exams in this subcategory, e.g. ["en"], ["en","hi"], ["en","pa"] */
  languages: jsonb("languages"),
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
  /** Languages available for this test, e.g. ["en"], ["en","hi"], ["en","pa"] */
  languages: jsonb("languages"),
  /** Amount in smallest currency unit (paise for INR, cents for USD, etc.) */
  priceCents: integer("price_cents"),
  /** Whether this test is freely accessible without purchase */
  isFree: integer("is_free").notNull().default(0),
  /** For topic-wise tests: FK to the master topics table */
  topicId: text("topic_id"),
  /** For topic-wise tests: resolved topic name (denormalized for quick reads) */
  topicName: text("topic_name"),
  /** Marks awarded for each correct answer (test-level default; question-level override takes precedence) */
  marksPerQuestion: doublePrecision("marks_per_question").default(1),
  /** Marks deducted for each wrong answer (non-negative value, e.g. 0.25 means minus 0.25) */
  negativeMarks: doublePrecision("negative_marks").default(0),
  /** Marks for unattempted questions (usually 0) */
  unattemptedMarks: doublePrecision("unattempted_marks").default(0),
});

/** DI Sets — shared context (image + description) for Data Interpretation question groups */
export const diSets = pgTable("di_sets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
    source: text("source").$type<"razorpay" | "mock" | "admin">().notNull().default("razorpay"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
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
  patternId: uuid("pattern_id").references(() => patterns.id, { onDelete: "set null" }),
  /** Primary question text (English). Nullable — multilingual questions may only have textPa or textHi. */
  text: text("text"),
  options: jsonb("options").notNull(),
  correct: integer("correct").notNull(),
  section: text("section").notNull(),
  topic: text("topic").notNull().default("General"),
  subtopic: text("subtopic").notNull().default(""),
  /** FK to sections master table — nullable so existing rows are unaffected */
  sectionId: text("section_id").references(() => sections.id, { onDelete: "set null" }),
  /** FK to topics master table — nullable so existing rows are unaffected */
  topicId: text("topic_id").references(() => topics.id, { onDelete: "set null" }),
  /** FK to topics_global — preferred over topicId for new data; nullable for backward compat */
  globalTopicId: text("global_topic_id").references(() => topicsGlobal.id, { onDelete: "set null" }),
  /** English explanation. Nullable when question is non-English only. */
  explanation: text("explanation"),
  /** Difficulty level for smart question selection */
  difficulty: text("difficulty").$type<"Easy" | "Medium" | "Hard">(),
  aiRefined: integer("ai_refined").notNull().default(0),
  qualityScore: integer("quality_score").notNull().default(0),
  // Translation columns — nullable; null means no translation available for that language
  textHi: text("text_hi"),
  optionsHi: jsonb("options_hi"),
  explanationHi: text("explanation_hi"),
  textPa: text("text_pa"),
  optionsPa: jsonb("options_pa"),
  explanationPa: text("explanation_pa"),
  /** Optional image URL (Firebase Storage) to display above question text */
  imageUrl: text("image_url"),
  /** Question type: 'text' | 'image' | 'di' */
  questionType: text("question_type").$type<"text" | "image" | "di">().notNull().default("text"),
  /** FK to di_sets — populated for DI/Data-Interpretation questions */
  diSetId: integer("di_set_id").references(() => diSets.id, { onDelete: "set null" }),
  /** Optional per-question marks override (null = use test-level default) */
  marks: doublePrecision("marks"),
  /** Optional per-question negative marks override (null = use test-level default) */
  negativeMarks: doublePrecision("negative_marks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mockTests = pgTable("mock_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mockTestTemplates = pgTable("mock_test_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sections: jsonb("sections").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mockTestSections = pgTable("mock_test_sections", {
    id: uuid("id").primaryKey().defaultRandom(),
    mockTestId: uuid("mock_test_id")
      .notNull()
      .references(() => mockTests.id, { onDelete: "cascade" }),
    section: text("section").$type<MockSection>().notNull(),
    topic: text("topic").notNull(),
    subtopic: text("subtopic").notNull().default(""),
    difficulty: text("difficulty").$type<MockDifficulty>().notNull(),
    questionCount: integer("question_count").notNull(),
    patternIds: jsonb("pattern_ids").notNull().default(sql`'[]'::jsonb`),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mockTestQuestions = pgTable("mock_test_questions", {
    id: uuid("id").primaryKey().defaultRandom(),
    mockTestId: uuid("mock_test_id")
      .notNull()
      .references(() => mockTests.id, { onDelete: "cascade" }),
    mockTestSectionId: uuid("mock_test_section_id")
      .references(() => mockTestSections.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    section: text("section").$type<MockSection>().notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attempts = pgTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testId: text("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    testName: text("test_name").notNull(),
    category: text("category").notNull(),
    score: real("score").notNull(),
    correct: integer("correct").notNull(),
    wrong: integer("wrong").notNull(),
    unanswered: integer("unanswered").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    timeSpent: integer("time_spent").notNull(),
    /** Legacy date column (date-only). Kept for backward-compat with older DB rows. */
    date: date("date"),
    /** "REAL" | "PRACTICE" — null means legacy row, treated as REAL */
    attemptType: text("attempt_type").$type<"REAL" | "PRACTICE">(),
    sectionStats: jsonb("section_stats"),
    sectionTimeSpent: jsonb("section_time_spent"),
    questionReview: jsonb("question_review"),
    /** Marks-based score: sum of +marksPerQuestion for correct and -negativeMarks for wrong */
    actualScore: doublePrecision("actual_score"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdIdx: index("attempts_user_id_idx").on(t.userId),
    testIdIdx: index("attempts_test_id_idx").on(t.testId),
    // Composite index for leaderboard queries: filter by test, order by score
    testIdScoreIdx: index("attempts_test_id_score_idx").on(t.testId, t.score),
  }),
);

// Package system tables
export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  originalPriceCents: integer("original_price_cents").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  finalPriceCents: integer("final_price_cents").notNull(),
  testCount: integer("test_count").notNull().default(0),
  features: jsonb("features"),
  isPopular: integer("is_popular").notNull().default(0),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const packageTests = pgTable(
  "package_tests",
  {
    id: text("id").primaryKey(),
    packageId: text("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "cascade" }),
    testId: text("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    isFree: integer("is_free").notNull().default(0),
  },
  (t) => ({
    uniquePackageTest: unique({ columns: [t.packageId, t.testId] }),
  }),
);

export const userPackages = pgTable(
  "user_packages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    packageId: text("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueUserPackage: unique({ columns: [t.userId, t.packageId] }),
  }),
);

export const userBundles = pgTable(
  "user_bundles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueUserBundle: unique({ columns: [t.userId, t.bundleId] }),
  }),
);

export const responses = pgTable(
  "responses",
  {
    id: serial("id").primaryKey(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    selectedOption: integer("selected_option"),
    timeTaken: integer("time_taken").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueAttemptQuestion: unique().on(t.attemptId, t.questionId),
    attemptIdIdx: index("responses_attempt_id_idx").on(t.attemptId),
    questionIdIdx: index("responses_question_id_idx").on(t.questionId),
  }),
);

/**
 * test_questions — maps questions from the bank to tests.
 * Allows the same question to appear in multiple tests (controlled reuse).
 */
export const testQuestions = pgTable(
  "test_questions",
  {
    id: serial("id").primaryKey(),
    testId: text("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueTestQuestion: unique().on(t.testId, t.questionId),
    questionIdIdx: index("test_questions_question_id_idx").on(t.questionId),
    testIdIdx: index("test_questions_test_id_idx").on(t.testId),
  }),
);

export const leaderboard = pgTable(
  "leaderboard",
  {
    testId: text("test_id")
      .notNull()
      .references(() => tests.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userName: text("user_name").notNull(),
    score: real("score").notNull(),
    rank: integer("rank").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.testId, t.userId] }),
    testIdRankIdx: index("leaderboard_test_id_rank_idx").on(t.testId, t.rank),
  }),
);

export type Section = typeof sections.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type TopicGlobal = typeof topicsGlobal.$inferSelect;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type MockTest = typeof mockTests.$inferSelect;
export type MockTestTemplate = typeof mockTestTemplates.$inferSelect;
export type Pattern = typeof patterns.$inferSelect;
export type PatternInsert = typeof patterns.$inferInsert;
export type MockTestSection = typeof mockTestSections.$inferSelect;
export type MockTestQuestion = typeof mockTestQuestions.$inferSelect;
