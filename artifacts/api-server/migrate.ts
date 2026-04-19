import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";

async function migrate() {
  console.log("Running database migration...");

  // ── users ─────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT        PRIMARY KEY,
      email       TEXT        NOT NULL,
      name        TEXT        NOT NULL,
      role        TEXT        NOT NULL DEFAULT 'student',
      created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
    );
  `);
  console.log("✓ users");

  // ── categories ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT        PRIMARY KEY,
      name        TEXT        NOT NULL,
      description TEXT        NOT NULL,
      icon        TEXT        NOT NULL,
      color       TEXT        NOT NULL,
      tests_count INTEGER     NOT NULL DEFAULT 0
    );
  `);
  console.log("✓ categories");

  // ── subcategories ─────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS subcategories (
      id             TEXT  PRIMARY KEY,
      category_id    TEXT  NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      category_name  TEXT  NOT NULL,
      name           TEXT  NOT NULL,
      description    TEXT  NOT NULL,
      languages      JSONB
    );
  `);
  console.log("✓ subcategories");

  // ── bundles ───────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bundles (
      id              TEXT      PRIMARY KEY,
      name            TEXT      NOT NULL,
      description     TEXT      NOT NULL,
      category_id     TEXT      NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      price           INTEGER   NOT NULL DEFAULT 0,
      original_price  INTEGER,
      tests_count     INTEGER   NOT NULL DEFAULT 0,
      features        JSONB     NOT NULL,
      is_popular      INTEGER   NOT NULL DEFAULT 0,
      "order"         INTEGER   NOT NULL DEFAULT 0,
      created_at      TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log("✓ bundles");

  // ── tests ─────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tests (
      id                   TEXT      PRIMARY KEY,
      name                 TEXT      NOT NULL,
      category             TEXT      NOT NULL,
      category_id          TEXT      NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      subcategory_id       TEXT      NOT NULL DEFAULT '',
      subcategory_name     TEXT      NOT NULL DEFAULT '',
      access               TEXT      NOT NULL DEFAULT 'free',
      kind                 TEXT      NOT NULL DEFAULT 'full-length',
      duration             INTEGER   NOT NULL,
      total_questions      INTEGER   NOT NULL,
      attempts             INTEGER   NOT NULL DEFAULT 0,
      avg_score            INTEGER   NOT NULL DEFAULT 0,
      difficulty           TEXT      NOT NULL,
      section_timing_mode  TEXT,
      section_timings      JSONB,
      section_settings     JSONB,
      sections             JSONB     NOT NULL,
      languages            JSONB,
      price_cents          INTEGER,
      is_free              INTEGER   NOT NULL DEFAULT 0
    );
  `);
  console.log("✓ tests");

  // ── questions ─────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS questions (
      id              SERIAL    PRIMARY KEY,
      client_id       TEXT      NOT NULL DEFAULT '',
      test_id         TEXT      NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      text            TEXT,
      options         JSONB     NOT NULL,
      correct         INTEGER   NOT NULL,
      section         TEXT      NOT NULL,
      topic           TEXT      NOT NULL DEFAULT 'General',
      explanation     TEXT,
      text_hi         TEXT,
      options_hi      JSONB,
      explanation_hi  TEXT,
      text_pa         TEXT,
      options_pa      JSONB,
      explanation_pa  TEXT,
      created_at      TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  // Add topic column to existing questions tables (idempotent)
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic TEXT NOT NULL DEFAULT 'General';
  `);
  // Allow text and explanation to be NULL (multilingual questions may omit English)
  await db.execute(sql`ALTER TABLE questions ALTER COLUMN text DROP NOT NULL;`);
  await db.execute(sql`ALTER TABLE questions ALTER COLUMN explanation DROP NOT NULL;`);
  console.log("✓ questions");

  // ── attempts ──────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS attempts (
      id                TEXT      PRIMARY KEY,
      user_id           TEXT      NOT NULL,
      test_id           TEXT      NOT NULL,
      test_name         TEXT      NOT NULL,
      category          TEXT      NOT NULL,
      score             REAL      NOT NULL,
      correct           INTEGER   NOT NULL,
      wrong             INTEGER   NOT NULL,
      unanswered        INTEGER   NOT NULL,
      total_questions   INTEGER   NOT NULL,
      time_spent        INTEGER   NOT NULL,
      date              DATE      NOT NULL DEFAULT CURRENT_DATE,
      attempt_type      TEXT,
      section_stats     JSONB,
      section_time_spent JSONB,
      question_review   JSONB,
      created_at        TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  // Idempotent column add for existing DBs that were created before date column
  await db.execute(sql`ALTER TABLE attempts ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE;`);
  // Idempotent FK constraints for existing DBs that were created without them
  // First clean up orphan rows that would violate the FK constraints
  await db.execute(sql`
    DELETE FROM responses WHERE attempt_id IN (
      SELECT id FROM attempts WHERE test_id NOT IN (SELECT id FROM tests)
    );
  `);
  await db.execute(sql`
    DELETE FROM attempts WHERE test_id NOT IN (SELECT id FROM tests);
  `);
  await db.execute(sql`
    DELETE FROM responses WHERE attempt_id IN (
      SELECT id FROM attempts WHERE user_id NOT IN (SELECT id FROM users)
    );
  `);
  await db.execute(sql`
    DELETE FROM attempts WHERE user_id NOT IN (SELECT id FROM users);
  `);
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attempts_user_id_fk' AND conrelid = 'attempts'::regclass
      ) THEN
        ALTER TABLE attempts ADD CONSTRAINT attempts_user_id_fk
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'attempts_test_id_fk' AND conrelid = 'attempts'::regclass
      ) THEN
        ALTER TABLE attempts ADD CONSTRAINT attempts_test_id_fk
          FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);
  console.log("✓ attempts");

  // ── responses ─────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS responses (
      id               SERIAL    PRIMARY KEY,
      attempt_id       TEXT      NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
      question_id      INTEGER   NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      selected_option  INTEGER,
      time_taken       INTEGER   NOT NULL DEFAULT 0,
      created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (attempt_id, question_id)
    );
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS responses_attempt_id_idx ON responses(attempt_id);
  `);
  console.log("✓ responses");

  // ── packages ──────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS packages (
      id                    TEXT      PRIMARY KEY,
      name                  TEXT      NOT NULL,
      description           TEXT      NOT NULL,
      original_price_cents  INTEGER   NOT NULL,
      discount_percent      INTEGER   NOT NULL DEFAULT 0,
      final_price_cents     INTEGER   NOT NULL,
      test_count            INTEGER   NOT NULL DEFAULT 0,
      features              JSONB,
      is_popular            INTEGER   NOT NULL DEFAULT 0,
      "order"               INTEGER   NOT NULL DEFAULT 0,
      created_at            TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log("✓ packages");

  // ── package_tests ─────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS package_tests (
      id          TEXT     PRIMARY KEY,
      package_id  TEXT     NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
      test_id     TEXT     NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      is_free     INTEGER  NOT NULL DEFAULT 0,
      UNIQUE (package_id, test_id)
    );
  `);
  console.log("✓ package_tests");

  // ── bundle_packages ───────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS bundle_packages (
      id          TEXT  PRIMARY KEY,
      bundle_id   TEXT  NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
      package_id  TEXT  NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
      UNIQUE (bundle_id, package_id)
    );
  `);
  console.log("✓ bundle_packages");

  // ── user_packages ─────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_packages (
      id                   TEXT      PRIMARY KEY,
      user_id              TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id           TEXT      NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
      razorpay_order_id    TEXT,
      razorpay_payment_id  TEXT,
      purchased_at         TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, package_id)
    );
  `);
  console.log("✓ user_packages");

  // ── user_bundles ──────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_bundles (
      id                   TEXT      PRIMARY KEY,
      user_id              TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bundle_id            TEXT      NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
      razorpay_order_id    TEXT,
      razorpay_payment_id  TEXT,
      purchased_at         TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, bundle_id)
    );
  `);
  console.log("✓ user_bundles");

  // ── user_test_entitlements ────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_test_entitlements (
      user_id              TEXT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      test_id              TEXT      NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      source               TEXT      NOT NULL DEFAULT 'razorpay',
      razorpay_order_id    TEXT,
      razorpay_payment_id  TEXT,
      created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, test_id)
    );
  `);
  console.log("✓ user_test_entitlements");

  // ── leaderboard ───────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leaderboard (
      test_id     TEXT    NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name   TEXT    NOT NULL,
      score       REAL    NOT NULL,
      rank        INTEGER NOT NULL,
      created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (test_id, user_id)
    );
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS leaderboard_test_id_rank_idx ON leaderboard(test_id, rank);
  `);
  console.log("✓ leaderboard");

  // ── sections (question taxonomy) ──────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sections (
      id    TEXT  PRIMARY KEY,
      name  TEXT  NOT NULL UNIQUE
    );
  `);
  console.log("✓ sections");

  // ── topics (question taxonomy) ────────────────────────────────────────
  // Original schema had section_id; now topics are global (name UNIQUE).
  // We first create with the old shape (idempotent for fresh DBs), then
  // run safe ALTER TABLE steps to drop section_id on existing DBs.
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS topics (
      id    TEXT  PRIMARY KEY,
      name  TEXT  NOT NULL UNIQUE
    );
  `);
  console.log("✓ topics");

  // ── Migrate existing topics table (section_id → global) ───────────────
  // Step 1: add UNIQUE on name if not present (handles fresh table)
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'topics_name_unique' AND conrelid = 'topics'::regclass
      ) THEN
        ALTER TABLE topics ADD CONSTRAINT topics_name_unique UNIQUE (name);
      END IF;
    END $$;
  `);
  // Step 2: drop compound unique(section_id, name) constraint if it exists
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_section_topic' AND conrelid = 'topics'::regclass
      ) THEN
        ALTER TABLE topics DROP CONSTRAINT unique_section_topic;
      END IF;
    END $$;
  `);
  // Step 3: drop FK constraint on section_id if it exists
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        WHERE t.relname = 'topics' AND c.contype = 'f'
          AND c.conname LIKE '%section%'
      ) THEN
        EXECUTE (
          SELECT 'ALTER TABLE topics DROP CONSTRAINT ' || c.conname
          FROM pg_constraint c
          JOIN pg_class t ON t.oid = c.conrelid
          WHERE t.relname = 'topics' AND c.contype = 'f'
            AND c.conname LIKE '%section%'
          LIMIT 1
        );
      END IF;
    END $$;
  `);
  // Step 4: drop section_id column if it exists
  await db.execute(sql`
    ALTER TABLE topics DROP COLUMN IF EXISTS section_id;
  `);
  console.log("✓ topics migrated to global (section_id removed)");

  // ── Seed sections & topics (idempotent upsert) ────────────────────────
  const sectionSeeds: { id: string; name: string }[] = [
    { id: "sec-quant",     name: "Quant" },
    { id: "sec-reasoning", name: "Reasoning" },
    { id: "sec-english",   name: "English" },
  ];
  for (const s of sectionSeeds) {
    await db.execute(
      sql`INSERT INTO sections (id, name) VALUES (${s.id}, ${s.name}) ON CONFLICT (name) DO NOTHING`,
    );
  }
  console.log("✓ sections seeded (upsert)");

  const topicSeeds: { id: string; name: string }[] = [
    { id: "topic-arithmetic",     name: "Arithmetic" },
    { id: "topic-algebra",        name: "Algebra" },
    { id: "topic-percentage",     name: "Percentage" },
    { id: "topic-ratio",          name: "Ratio" },
    { id: "topic-coding",         name: "Coding-Decoding" },
    { id: "topic-series",         name: "Series" },
    { id: "topic-analogy",        name: "Analogy" },
    { id: "topic-error",          name: "Error Detection" },
    { id: "topic-fillinblanks",   name: "Fill in the Blanks" },
  ];
  for (const t of topicSeeds) {
    await db.execute(
      sql`INSERT INTO topics (id, name) VALUES (${t.id}, ${t.name}) ON CONFLICT (name) DO NOTHING`,
    );
  }
  console.log("✓ topics seeded (upsert)");

  // ── topics_global (new global topics table, safe to create alongside existing topics) ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS topics_global (
      id    TEXT  PRIMARY KEY,
      name  TEXT  NOT NULL UNIQUE
    );
  `);
  // Case-insensitive unique index — prevents "Idiom" and "idioms" being inserted as separate topics
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS topics_global_name_lower_idx ON topics_global (lower(name));
  `);
  console.log("✓ topics_global");

  // ── Migrate topics → topics_global (case-insensitive dedup) ──────────
  // Only runs if the old topics table still exists (safe on fresh DBs too).
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'topics'
      ) THEN
        -- Insert each unique name (case-insensitive) exactly once.
        -- DISTINCT ON lower(name) picks one row per canonical name.
        -- ON CONFLICT (name) DO NOTHING skips any already-present rows.
        INSERT INTO topics_global (id, name)
        SELECT DISTINCT ON (lower(name)) id, name
        FROM topics
        ORDER BY lower(name), id
        ON CONFLICT (name) DO NOTHING;
      END IF;
    END $$;
  `);
  console.log("✓ topics migrated into topics_global (deduped)");

  // ── Add FK columns from questions → sections/topics (after those tables exist) ──
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS section_id TEXT REFERENCES sections(id) ON DELETE SET NULL;
  `);
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL;
  `);
  // Indexes on the FK columns (idempotent)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS questions_section_id_idx ON questions(section_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS questions_topic_id_idx ON questions(topic_id);`);
  console.log("✓ questions.section_id / topic_id FKs + indexes");

  // ── Add global_topic_id to questions (FK → topics_global) ────────────
  await db.execute(sql`
    ALTER TABLE questions
      ADD COLUMN IF NOT EXISTS global_topic_id TEXT REFERENCES topics_global(id) ON DELETE SET NULL;
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS questions_global_topic_id_idx ON questions(global_topic_id);`);
  console.log("✓ questions.global_topic_id FK + index");

  // ── Populate questions.global_topic_id from old topic relation ────────
  // Idempotent: only updates rows where global_topic_id is still NULL.
  // Matches by case-insensitive name: questions.topic_id → topics.name → topics_global.name
  await db.execute(sql`
    UPDATE questions q
    SET global_topic_id = tg.id
    FROM topics t
    JOIN topics_global tg ON lower(tg.name) = lower(t.name)
    WHERE q.topic_id = t.id
      AND q.global_topic_id IS NULL;
  `);

  // Log any questions whose topic_id has no match in topics_global (data gap warning)
  const unmatched = await db.execute(sql`
    SELECT count(*)::int AS cnt
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    WHERE q.topic_id IS NOT NULL
      AND q.global_topic_id IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM topics_global tg WHERE lower(tg.name) = lower(t.name)
      );
  `);
  const unmatchedCount = (unmatched.rows?.[0] as any)?.cnt ?? 0;
  if (unmatchedCount > 0) {
    console.warn(`⚠  ${unmatchedCount} question(s) have a topic_id with no matching topics_global entry — global_topic_id left NULL for those rows`);
  } else {
    console.log("✓ questions.global_topic_id populated");
  }

  // ── Add topic_id / topic_name to tests (for topic-wise tests) ──────────
  await db.execute(sql`
    ALTER TABLE tests ADD COLUMN IF NOT EXISTS topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL;
  `);
  await db.execute(sql`
    ALTER TABLE tests ADD COLUMN IF NOT EXISTS topic_name TEXT;
  `);
  console.log("✓ tests.topic_id / topic_name columns");

  // ── indexes ───────────────────────────────────────────────────────────
  // attempts
  await db.execute(sql`CREATE INDEX IF NOT EXISTS attempts_user_id_idx ON attempts(user_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS attempts_test_id_idx ON attempts(test_id);`);
  // Composite index for leaderboard queries (filter by test_id, sort by score)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS attempts_test_id_score_idx ON attempts(test_id, score DESC);`);

  // responses (attempt_id index already created in responses table block above)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS responses_question_id_idx ON responses(question_id);`);

  console.log("✓ indexes");

  // ── Add difficulty column to questions ────────────────────────────────
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));
  `);
  console.log("✓ questions.difficulty column");

  // ── Create test_questions mapping table ───────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS test_questions (
      id          SERIAL    PRIMARY KEY,
      test_id     TEXT      NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      question_id INTEGER   NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      added_at    TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (test_id, question_id)
    );
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS test_questions_question_id_idx ON test_questions(question_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS test_questions_test_id_idx ON test_questions(test_id);`);
  console.log("✓ test_questions table + indexes");

  // ── Ensure questions.global_topic_id NOT NULL (previously allowed NULL) ─
  // Backfill with a fallback topic before applying constraint, only if needed.
  // This step is optional — schema defines NOT NULL but older rows may be NULL.
  // We log a warning rather than failing.
  const nullTopicCount = await db.execute(sql`
    SELECT count(*)::int AS cnt FROM questions WHERE global_topic_id IS NULL;
  `);
  const nullTopicCnt = (nullTopicCount.rows?.[0] as any)?.cnt ?? 0;
  if (nullTopicCnt > 0) {
    console.warn(`⚠  ${nullTopicCnt} question(s) still have global_topic_id = NULL — assign topics before enforcing NOT NULL`);
  }

  // ── di_sets (Data Interpretation / diagram sets) ─────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS di_sets (
      id           SERIAL     PRIMARY KEY,
      title        TEXT       NOT NULL,
      image_url    TEXT,
      description  TEXT,
      created_at   TIMESTAMP  NOT NULL DEFAULT NOW()
    );
  `);
  console.log("✓ di_sets");

  // ── Add image / DI columns to questions ───────────────────────────────
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;
  `);
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_type TEXT NOT NULL DEFAULT 'text';
  `);
  await db.execute(sql`
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS di_set_id INTEGER REFERENCES di_sets(id) ON DELETE SET NULL;
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS questions_di_set_id_idx ON questions(di_set_id);`);
  console.log("✓ questions.image_url / question_type / di_set_id columns");

  // ── Fix responses FK pointing to old 'attempt_records' table ────────
  // The production DB was originally created with 'attempt_records' as the table
  // name. The FK constraint on 'responses.attempt_id' still points there.
  // Drop the stale constraint and re-add it pointing to 'attempts'.
  await db.execute(sql`
    ALTER TABLE responses
      DROP CONSTRAINT IF EXISTS responses_attempt_id_attempt_records_id_fk;
  `);
  await db.execute(sql`
    ALTER TABLE responses
      DROP CONSTRAINT IF EXISTS responses_attempt_id_fk;
  `);
  await db.execute(sql`
    ALTER TABLE responses
      ADD CONSTRAINT responses_attempt_id_fk
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE;
  `);
  console.log("✓ responses.attempt_id FK repaired → attempts(id)");

  // ── Flexible marking system ───────────────────────────────────────────
  // marks_per_question / negative_marks / unattempted_marks on tests
  await db.execute(sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS marks_per_question FLOAT DEFAULT 1;`);
  await db.execute(sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS negative_marks FLOAT DEFAULT 0;`);
  await db.execute(sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS unattempted_marks FLOAT DEFAULT 0;`);
  // Per-question overrides (nullable — null means use test-level default)
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS marks FLOAT;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS negative_marks FLOAT;`);
  // Store the marks-based (raw) score alongside the existing percentage score
  await db.execute(sql`ALTER TABLE attempts ADD COLUMN IF NOT EXISTS actual_score FLOAT;`);
  console.log("✓ flexible marking system columns");

  console.log("\n✅ Migration complete.");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});