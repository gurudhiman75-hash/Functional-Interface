import type { StcDifficulty, StcLocale, StcQlId } from "./types.ts";
import type { StcV2AnswerClass, StcV2SurfaceArchetype } from "./editorial-v2-types.ts";

export type StcV22TriText = Readonly<Record<StcLocale, string>>;

export type StcV22Template = Readonly<{
  id: string;
  qlId: StcQlId;
  surfaceArchetype: StcV2SurfaceArchetype;
  difficulty: StcDifficulty;
  answerClass: StcV2AnswerClass;
  dimensions: readonly [
    readonly StcV22TriText[],
    readonly StcV22TriText[],
    readonly StcV22TriText[],
    readonly StcV22TriText[],
  ];
  statement: StcV22TriText;
  conclusions: readonly [StcV22TriText, StcV22TriText];
  explanation: readonly [StcV22TriText, StcV22TriText];
}>;

export type RenderedStcV22Template = Readonly<{
  templateId: string;
  qlId: StcQlId;
  surfaceArchetype: StcV2SurfaceArchetype;
  difficulty: StcDifficulty;
  answerClass: StcV2AnswerClass;
  variantIndex: number;
  variantKey: string;
  statement: string;
  conclusions: readonly [string, string];
  explanation: readonly [string, string];
}>;
