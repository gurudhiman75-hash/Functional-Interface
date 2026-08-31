import type { ArgAnswerClass, ArgDifficulty, ArgQlId, ArgStance, ArgStrength, ArgWeaknessDefect } from "./types.ts";

export type ArgCp003TemplateArgument = Readonly<{
  stance: ArgStance;
  strength: ArgStrength;
  weaknessDefect?: ArgWeaknessDefect;
  text: string;
  explanation: string;
}>;

export type ArgCp003Template = Readonly<{
  id: string;
  qlId: ArgQlId;
  archetype: string;
  difficulty: ArgDifficulty;
  answerClass: ArgAnswerClass;
  dimensions: readonly [
    readonly string[],
    readonly string[],
    readonly string[],
    readonly string[],
  ];
  statement: string;
  arguments: readonly [ArgCp003TemplateArgument, ArgCp003TemplateArgument];
}>;

export type RenderedArgCp003Template = Readonly<{
  templateId: string;
  qlId: ArgQlId;
  archetype: string;
  difficulty: ArgDifficulty;
  answerClass: ArgAnswerClass;
  variantIndex: number;
  variantKey: string;
  statement: string;
  arguments: readonly [
    Readonly<{ stance: ArgStance; strength: ArgStrength; weaknessDefect?: ArgWeaknessDefect; text: string; explanation: string }>,
    Readonly<{ stance: ArgStance; strength: ArgStrength; weaknessDefect?: ArgWeaknessDefect; text: string; explanation: string }>,
  ];
}>;
