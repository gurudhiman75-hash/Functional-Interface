import { pgTable, text, integer, real, timestamp, jsonb, serial, primaryKey, unique, index } from "drizzle-orm/pg-core";

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
  text: text("text").notNull(),
  options: jsonb("options").notNull(),
  correct: integer("correct").notNull(),
  section: text("section").notNull(),
  explanation: text("explanation").notNull(),
  // Translation columns — nullable; null means no translation available for that language
  textHi: text("text_hi"),
  optionsHi: jsonb("options_hi"),
  explanationHi: text("explanation_hi"),
  textPa: text("text_pa"),
  optionsPa: jsonb("options_pa"),
  explanationPa: text("explanation_pa"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attempts = pgTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  testId: text("test_id").notNull(),
  testName: text("test_name").notNull(),
  category: text("category").notNull(),
  score: real("score").notNull(),
  correct: integer("correct").notNull(),
  wrong: integer("wrong").notNull(),
  unanswered: integer("unanswered").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(),
  date: text("date").notNull(),
  /** "REAL" | "PRACTICE" — null means legacy row, treated as REAL */
  attemptType: text("attempt_type").$type<"REAL" | "PRACTICE">(),
  sectionStats: jsonb("section_stats"),
  sectionTimeSpent: jsonb("section_time_spent"),
  questionReview: jsonb("question_review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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

export const attemptRecords = pgTable("attempt_records", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  testId: text("test_id")
    .notNull()
    .references(() => tests.id, { onDelete: "cascade" }),
  mode: text("mode").$type<"REAL" | "PRACTICE">().notNull(),
  attemptNumber: integer("attempt_number").notNull().default(1),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const responses = pgTable(
  "responses",
  {
    id: serial("id").primaryKey(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => attemptRecords.id, { onDelete: "cascade" }),
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
  }),
);
