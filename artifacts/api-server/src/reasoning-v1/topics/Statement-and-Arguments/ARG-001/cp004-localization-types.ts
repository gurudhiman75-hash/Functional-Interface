import type { ArgLocale, ArgQlId } from "./types.ts";

export type ArgCp004LocalizedLocale = Exclude<ArgLocale, "en-IN">;

export type ArgCp004LocalizedArgument = Readonly<{
  text: string;
  explanation: string;
}>;

export type ArgCp004LocalizedTemplate = Readonly<{
  id: string;
  qlId: ArgQlId;
  locale: ArgCp004LocalizedLocale;
  dimensions: readonly [
    readonly [string, string, string, string],
    readonly [string, string, string, string],
    readonly [string, string, string, string],
    readonly [string, string, string, string],
  ];
  statement: string;
  arguments: readonly [ArgCp004LocalizedArgument, ArgCp004LocalizedArgument];
}>;

export type RenderedArgCp004LocalizedTemplate = Readonly<{
  templateId: string;
  qlId: ArgQlId;
  locale: ArgCp004LocalizedLocale;
  variantIndex: number;
  variantKey: string;
  statement: string;
  arguments: readonly [
    Readonly<{ text: string; explanation: string }>,
    Readonly<{ text: string; explanation: string }>,
  ];
}>;
