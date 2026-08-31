import { ARG_CP004_QL001_LOCALIZED } from "./cp004-ql001-localized.ts";
import { ARG_CP004_QL002_LOCALIZED } from "./cp004-ql002-localized.ts";
import { ARG_CP004_QL003_LOCALIZED } from "./cp004-ql003-localized.ts";
import { ARG_CP004_QL004_LOCALIZED } from "./cp004-ql004-localized.ts";
import { ARG_CP004_QL005_LOCALIZED } from "./cp004-ql005-localized.ts";
import { ARG_CP004_QL006_LOCALIZED } from "./cp004-ql006-localized.ts";
import type { ArgQlId } from "./types.ts";
import type { ArgCp004LocalizedLocale, ArgCp004LocalizedTemplate } from "./cp004-localization-types.ts";

const ALL_LOCALIZED = Object.freeze([
  ...ARG_CP004_QL001_LOCALIZED,
  ...ARG_CP004_QL002_LOCALIZED,
  ...ARG_CP004_QL003_LOCALIZED,
  ...ARG_CP004_QL004_LOCALIZED,
  ...ARG_CP004_QL005_LOCALIZED,
  ...ARG_CP004_QL006_LOCALIZED,
]);

export const ARG_CP004_LOCALIZED_TEMPLATE_COUNT_PER_LOCALE = 48 as const;

function buildLocaleMap(locale: ArgCp004LocalizedLocale): Readonly<Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>> {
  const grouped = {
    "ARG-QL-001": [] as ArgCp004LocalizedTemplate[],
    "ARG-QL-002": [] as ArgCp004LocalizedTemplate[],
    "ARG-QL-003": [] as ArgCp004LocalizedTemplate[],
    "ARG-QL-004": [] as ArgCp004LocalizedTemplate[],
    "ARG-QL-005": [] as ArgCp004LocalizedTemplate[],
    "ARG-QL-006": [] as ArgCp004LocalizedTemplate[],
  } satisfies Record<ArgQlId, ArgCp004LocalizedTemplate[]>;

  for (const template of ALL_LOCALIZED) {
    if (template.locale === locale) grouped[template.qlId].push(template);
  }
  return Object.freeze({
    "ARG-QL-001": Object.freeze(grouped["ARG-QL-001"]),
    "ARG-QL-002": Object.freeze(grouped["ARG-QL-002"]),
    "ARG-QL-003": Object.freeze(grouped["ARG-QL-003"]),
    "ARG-QL-004": Object.freeze(grouped["ARG-QL-004"]),
    "ARG-QL-005": Object.freeze(grouped["ARG-QL-005"]),
    "ARG-QL-006": Object.freeze(grouped["ARG-QL-006"]),
  });
}

export const ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE = Object.freeze({
  "hi-IN": buildLocaleMap("hi-IN"),
  "pa-IN": buildLocaleMap("pa-IN"),
});

export function getArgCp004LocalizedTemplate(input: {
  readonly locale: ArgCp004LocalizedLocale;
  readonly qlId: ArgQlId;
  readonly templateId: string;
}): ArgCp004LocalizedTemplate {
  const found = ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[input.locale][input.qlId]
    .find((entry) => entry.id === input.templateId);
  if (!found) throw new Error(`${input.locale}/${input.qlId}: missing localized template ${input.templateId}`);
  return found;
}
