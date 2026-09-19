import type { BlrRoleId } from "../../foundation/types";
import type { BlrCp002AnswerId } from "../cp002-types";

export type BlrCp002TranslatedLocale = "hi-IN" | "pa-IN";

export const BLR_CP002_LOCALIZATION_VERSION =
  "blr-cp002-hi-pa-localization-v1" as const;
export const BLR_CP002_MULTILINGUAL_RUNTIME_VERSION =
  "blr-cp002-role-chain-multilingual-review-v1" as const;

type Pair = readonly [hi: string, pa: string];

const ROLE_LABELS: Readonly<Record<BlrRoleId, Pair>> = {
  FATHER: ["पिता", "ਪਿਤਾ"],
  MOTHER: ["माता", "ਮਾਤਾ"],
  SON: ["पुत्र", "ਪੁੱਤਰ"],
  DAUGHTER: ["पुत्री", "ਧੀ"],
  BROTHER: ["भाई", "ਭਰਾ"],
  SISTER: ["बहन", "ਭੈਣ"],
  HUSBAND: ["पति", "ਪਤੀ"],
  WIFE: ["पत्नी", "ਪਤਨੀ"],
  GRANDFATHER: ["दादा/नाना", "ਦਾਦਾ/ਨਾਨਾ"],
  GRANDMOTHER: ["दादी/नानी", "ਦਾਦੀ/ਨਾਨੀ"],
  GRANDSON: ["पोता/नाती", "ਪੋਤਾ/ਦੋਹਤਾ"],
  GRANDDAUGHTER: ["पोती/नातिन", "ਪੋਤੀ/ਦੋਹਤੀ"],
  GREAT_GRANDFATHER: ["परदादा/परनाना", "ਪਰਦਾਦਾ/ਪਰਨਾਨਾ"],
  GREAT_GRANDMOTHER: ["परदादी/परनानी", "ਪਰਦਾਦੀ/ਪਰਨਾਨੀ"],
  GREAT_GRANDSON: ["परपोता/परनाती", "ਪਰਪੋਤਾ/ਪਰਦੋਹਤਾ"],
  GREAT_GRANDDAUGHTER: ["परपोती/परनातिन", "ਪਰਪੋਤੀ/ਪਰਦੋਹਤੀ"],
  UNCLE: ["चाचा/मामा", "ਚਾਚਾ/ਮਾਮਾ"],
  AUNT: ["बुआ/मौसी", "ਭੂਆ/ਮਾਸੀ"],
  NEPHEW: ["भतीजा/भांजा", "ਭਤੀਜਾ/ਭਾਣਜਾ"],
  NIECE: ["भतीजी/भांजी", "ਭਤੀਜੀ/ਭਾਣਜੀ"],
  COUSIN: ["कज़िन", "ਕਜ਼ਨ"],
  FATHER_IN_LAW: ["ससुर", "ਸਹੁਰਾ"],
  MOTHER_IN_LAW: ["सास", "ਸੱਸ"],
  SON_IN_LAW: ["दामाद", "ਜਵਾਈ"],
  DAUGHTER_IN_LAW: ["बहू", "ਨੂੰਹ"],
  BROTHER_IN_LAW: ["बहनोई/साला", "ਭੈਣੋਈ/ਸਾਲਾ"],
  SISTER_IN_LAW: ["भाभी/साली", "ਭਾਬੀ/ਸਾਲੀ"],
  PARENT: ["माता या पिता", "ਮਾਤਾ ਜਾਂ ਪਿਤਾ"],
  CHILD: ["संतान", "ਸੰਤਾਨ"],
  SIBLING: ["भाई या बहन", "ਭਰਾ ਜਾਂ ਭੈਣ"],
  SPOUSE: ["जीवनसाथी", "ਜੀਵਨਸਾਥੀ"],
};

const FEMININE = new Set<BlrRoleId>([
  "MOTHER", "DAUGHTER", "SISTER", "WIFE", "GRANDMOTHER", "GRANDDAUGHTER",
  "GREAT_GRANDMOTHER", "GREAT_GRANDDAUGHTER", "AUNT", "NIECE",
  "MOTHER_IN_LAW", "DAUGHTER_IN_LAW", "SISTER_IN_LAW", "CHILD",
]);

const PLURAL_OR_NEUTRAL = new Set<BlrRoleId>(["PARENT", "SIBLING"]);

export function localeText(
  locale: BlrCp002TranslatedLocale,
  hi: string,
  pa: string,
): string {
  return locale === "hi-IN" ? hi : pa;
}

export function cp002RoleLabel(
  roleId: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  const pair = ROLE_LABELS[roleId];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function cp002RolePossessiveParticle(
  roleId: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    if (FEMININE.has(roleId)) return "की";
    if (PLURAL_OR_NEUTRAL.has(roleId)) return "के";
    return "का";
  }
  if (FEMININE.has(roleId)) return "ਦੀ";
  if (PLURAL_OR_NEUTRAL.has(roleId)) return "ਦੇ";
  return "ਦਾ";
}

export function cp002AnchorPossessive(
  anchor: "SPEAKER" | "LISTENER" | "POINTED_PERSON",
  roleId: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  const feminine = FEMININE.has(roleId);
  const plural = PLURAL_OR_NEUTRAL.has(roleId);
  if (locale === "hi-IN") {
    if (anchor === "SPEAKER") return feminine ? "मेरी" : plural ? "मेरे" : "मेरा";
    if (anchor === "LISTENER") return feminine ? "आपकी" : plural ? "आपके" : "आपका";
    return feminine ? "उसकी" : plural ? "उसके" : "उसका";
  }
  if (anchor === "SPEAKER") return feminine ? "ਮੇਰੀ" : plural ? "ਮੇਰੇ" : "ਮੇਰਾ";
  if (anchor === "LISTENER") return feminine ? "ਤੁਹਾਡੀ" : plural ? "ਤੁਹਾਡੇ" : "ਤੁਹਾਡਾ";
  return feminine ? "ਉਸ ਦੀ" : plural ? "ਉਸ ਦੇ" : "ਉਸ ਦਾ";
}

export function cp002OnlyRoleLabel(
  roleId: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  return localeText(
    locale,
    `एकमात्र ${cp002RoleLabel(roleId, locale)}`,
    `ਇੱਕੋ ${cp002RoleLabel(roleId, locale)}`,
  );
}

export function cp002AnswerLabel(
  answerId: BlrCp002AnswerId,
  locale: BlrCp002TranslatedLocale,
): string {
  if (answerId === "SELF") return localeText(locale, "स्वयं", "ਆਪ");
  return cp002RoleLabel(answerId, locale);
}

export function cp002OwnershipOption(
  answerId: BlrCp002AnswerId,
  locale: BlrCp002TranslatedLocale,
): string {
  if (answerId === "SELF") {
    return localeText(locale, "उनकी अपनी", "ਉਨ੍ਹਾਂ ਦੀ ਆਪਣੀ");
  }
  const feminine = FEMININE.has(answerId);
  return localeText(
    locale,
    `${feminine ? "उनकी" : "उनके"} ${cp002RoleLabel(answerId, locale)} की`,
    `${feminine ? "ਉਨ੍ਹਾਂ ਦੀ" : "ਉਨ੍ਹਾਂ ਦੇ"} ${cp002RoleLabel(answerId, locale)} ਦੀ`,
  );
}
