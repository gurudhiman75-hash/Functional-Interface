import { sql } from "drizzle-orm";
import { db } from "./db";

export type QuestionColumnState = {
  hasClientId: boolean;
  hasTestId: boolean;
  hasCreatedAt: boolean;
  hasSectionId: boolean;
  hasTopicId: boolean;
  hasGlobalTopicId: boolean;
  hasDifficulty: boolean;
  hasTextHi: boolean;
  hasOptionsHi: boolean;
  hasExplanationHi: boolean;
  hasTextPa: boolean;
  hasOptionsPa: boolean;
  hasExplanationPa: boolean;
  hasImageUrl: boolean;
  hasQuestionType: boolean;
  hasDiSetId: boolean;
};

let questionColumnStatePromise: Promise<QuestionColumnState> | null = null;

export async function getQuestionColumnState(): Promise<QuestionColumnState> {
  if (!questionColumnStatePromise) {
    questionColumnStatePromise = (async () => {
      const rows = (await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'questions'
      `)) as any[];
      const names = new Set(
        rows.map((row) => String(row.column_name ?? row.COLUMN_NAME ?? "").toLowerCase()),
      );
      return {
        hasClientId: names.has("client_id"),
        hasTestId: names.has("test_id"),
        hasCreatedAt: names.has("created_at"),
        hasSectionId: names.has("section_id"),
        hasTopicId: names.has("topic_id"),
        hasGlobalTopicId: names.has("global_topic_id"),
        hasDifficulty: names.has("difficulty"),
        hasTextHi: names.has("text_hi"),
        hasOptionsHi: names.has("options_hi"),
        hasExplanationHi: names.has("explanation_hi"),
        hasTextPa: names.has("text_pa"),
        hasOptionsPa: names.has("options_pa"),
        hasExplanationPa: names.has("explanation_pa"),
        hasImageUrl: names.has("image_url"),
        hasQuestionType: names.has("question_type"),
        hasDiSetId: names.has("di_set_id"),
      };
    })();
  }
  return questionColumnStatePromise;
}

export function buildQuestionSelectSql(columns: QuestionColumnState) {
  return sql.join(
    [
      sql`id`,
      columns.hasClientId ? sql`client_id` : sql`''::text AS client_id`,
      columns.hasTestId ? sql`test_id` : sql`''::text AS test_id`,
      sql`text`,
      sql`options`,
      sql`correct`,
      sql`section`,
      columns.hasSectionId ? sql`section_id` : sql`NULL::text AS section_id`,
      sql`COALESCE(topic, 'General') AS topic`,
      columns.hasTopicId ? sql`topic_id` : sql`NULL::text AS topic_id`,
      columns.hasGlobalTopicId ? sql`global_topic_id` : sql`NULL::text AS global_topic_id`,
      columns.hasDifficulty ? sql`difficulty` : sql`NULL::text AS difficulty`,
      sql`explanation`,
      columns.hasTextHi ? sql`text_hi` : sql`NULL::text AS text_hi`,
      columns.hasOptionsHi ? sql`options_hi` : sql`NULL::jsonb AS options_hi`,
      columns.hasExplanationHi ? sql`explanation_hi` : sql`NULL::text AS explanation_hi`,
      columns.hasTextPa ? sql`text_pa` : sql`NULL::text AS text_pa`,
      columns.hasOptionsPa ? sql`options_pa` : sql`NULL::jsonb AS options_pa`,
      columns.hasExplanationPa ? sql`explanation_pa` : sql`NULL::text AS explanation_pa`,
      columns.hasImageUrl ? sql`image_url` : sql`NULL::text AS image_url`,
      columns.hasQuestionType ? sql`question_type` : sql`'text'::text AS question_type`,
      columns.hasDiSetId ? sql`di_set_id` : sql`NULL::integer AS di_set_id`,
      columns.hasCreatedAt ? sql`created_at` : sql`NOW() AS created_at`,
    ],
    sql`, `,
  );
}
