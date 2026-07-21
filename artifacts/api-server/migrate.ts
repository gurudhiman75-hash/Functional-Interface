export const LEGACY_PUBLIC_SCHEMA_MIGRATION_RETIRED = true;

console.error(
  "The former public-schema migration is retired. Apply reviewed, additive SQL from docs/database-migrations to the canonical ExamTree Neon project instead.",
);
process.exitCode = 1;
