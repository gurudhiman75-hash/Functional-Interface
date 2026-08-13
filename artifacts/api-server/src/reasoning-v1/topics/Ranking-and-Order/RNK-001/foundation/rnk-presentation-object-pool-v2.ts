import {
  RNK_DOMAIN_LEXICON_V2,
  rnkDomainLexicon,
  selectCompatibleRnkGroup,
  selectRnkPeople,
  selectRnkSetting,
  type RnkGroupObject,
  type RnkObjectLocale,
  type RnkPersonObject,
  type RnkRankingDomain,
  type RnkSettingObject,
} from "./rnk-object-pool-v2";

export interface RnkRelationTemplates {
  readonly domain: RnkRankingDomain;
  readonly higher: Readonly<Record<RnkObjectLocale, string>>;
  readonly lower: Readonly<Record<RnkObjectLocale, string>>;
  readonly equal: Readonly<Record<RnkObjectLocale, string>>;
}

function localized(en: string, hi: string, pa: string): Readonly<Record<RnkObjectLocale, string>> {
  return { en: en.normalize("NFC"), hi: hi.normalize("NFC"), pa: pa.normalize("NFC") };
}

export const RNK_RELATION_TEMPLATES_V2: readonly RnkRelationTemplates[] = [
  {
    domain: "GENERIC_RANK",
    higher: localized("{A} ranks above {B}.", "{A} की रैंक {B} से ऊपर है।", "{A} ਦਾ ਰੈਂਕ {B} ਤੋਂ ਉੱਪਰ ਹੈ।"),
    lower: localized("{A} ranks below {B}.", "{A} की रैंक {B} से नीचे है।", "{A} ਦਾ ਰੈਂਕ {B} ਤੋਂ ਹੇਠਾਂ ਹੈ।"),
    equal: localized("{A} and {B} have the same rank.", "{A} और {B} की रैंक समान है।", "{A} ਅਤੇ {B} ਦਾ ਰੈਂਕ ਇੱਕੋ ਹੈ।"),
  },
  {
    domain: "SCORES",
    higher: localized("{A} scored more marks than {B}.", "{A} ने {B} से अधिक अंक प्राप्त किए।", "{A} ਨੇ {B} ਤੋਂ ਵੱਧ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।"),
    lower: localized("{A} scored fewer marks than {B}.", "{A} ने {B} से कम अंक प्राप्त किए।", "{A} ਨੇ {B} ਤੋਂ ਘੱਟ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।"),
    equal: localized("{A} and {B} scored equal marks.", "{A} और {B} ने समान अंक प्राप्त किए।", "{A} ਅਤੇ {B} ਨੇ ਬਰਾਬਰ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।"),
  },
  {
    domain: "HEIGHT",
    higher: localized("{A} is taller than {B}.", "{A} की ऊँचाई {B} से अधिक है।", "{A} ਦਾ ਕੱਦ {B} ਤੋਂ ਵੱਧ ਹੈ।"),
    lower: localized("{A} is shorter than {B}.", "{A} की ऊँचाई {B} से कम है।", "{A} ਦਾ ਕੱਦ {B} ਤੋਂ ਘੱਟ ਹੈ।"),
    equal: localized("{A} and {B} are equally tall.", "{A} और {B} की ऊँचाई समान है।", "{A} ਅਤੇ {B} ਦਾ ਕੱਦ ਇੱਕੋ ਜਿਹਾ ਹੈ।"),
  },
  {
    domain: "SPEED",
    higher: localized("{A} completed the race faster than {B}.", "{A} ने दौड़ पूरी करने में {B} से कम समय लिया।", "{A} ਨੇ ਦੌੜ ਪੂਰੀ ਕਰਨ ਲਈ {B} ਤੋਂ ਘੱਟ ਸਮਾਂ ਲਿਆ।"),
    lower: localized("{A} completed the race slower than {B}.", "{A} ने दौड़ पूरी करने में {B} से अधिक समय लिया।", "{A} ਨੇ ਦੌੜ ਪੂਰੀ ਕਰਨ ਲਈ {B} ਤੋਂ ਵੱਧ ਸਮਾਂ ਲਿਆ।"),
    equal: localized("{A} and {B} completed the race in the same time.", "{A} और {B} ने दौड़ समान समय में पूरी की।", "{A} ਅਤੇ {B} ਨੇ ਦੌੜ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਪੂਰੀ ਕੀਤੀ।"),
  },
  {
    domain: "SENIORITY",
    higher: localized("{A} is senior to {B}.", "{A}, {B} से वरिष्ठ है।", "{A}, {B} ਤੋਂ ਸੀਨੀਅਰ ਹੈ।"),
    lower: localized("{A} is junior to {B}.", "{A}, {B} से कनिष्ठ है।", "{A}, {B} ਤੋਂ ਜੂਨੀਅਰ ਹੈ।"),
    equal: localized("{A} and {B} are at the same seniority level.", "{A} और {B} समान वरिष्ठता स्तर पर हैं।", "{A} ਅਤੇ {B} ਇੱਕੋ ਸੀਨੀਅਰਟੀ ਪੱਧਰ 'ਤੇ ਹਨ।"),
  },
  {
    domain: "PERFORMANCE",
    higher: localized("{A} performed better than {B}.", "{A} का प्रदर्शन {B} से बेहतर रहा।", "{A} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ {B} ਨਾਲੋਂ ਵਧੀਆ ਰਹੀ।"),
    lower: localized("{A} performed worse than {B}.", "{A} का प्रदर्शन {B} से कमजोर रहा।", "{A} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ {B} ਨਾਲੋਂ ਕਮਜ਼ੋਰ ਰਹੀ।"),
    equal: localized("{A} and {B} were placed at the same performance level.", "{A} और {B} को समान प्रदर्शन स्तर पर रखा गया।", "{A} ਅਤੇ {B} ਨੂੰ ਇੱਕੋ ਕਾਰਗੁਜ਼ਾਰੀ ਪੱਧਰ 'ਤੇ ਰੱਖਿਆ ਗਿਆ।"),
  },
] as const;

export function rnkRelationTemplates(domain: RnkRankingDomain): RnkRelationTemplates {
  const found = RNK_RELATION_TEMPLATES_V2.find((entry) => entry.domain === domain);
  if (!found) throw new Error(`Missing RNK relation templates for ${domain}.`);
  return found;
}

export function renderRnkRelation(
  domain: RnkRankingDomain,
  relation: "higher" | "lower" | "equal",
  locale: RnkObjectLocale,
  first: string,
  second: string,
): string {
  const template = rnkRelationTemplates(domain)[relation][locale];
  return template.replaceAll("{A}", first).replaceAll("{B}", second).normalize("NFC");
}

export interface RnkPresentationBundle {
  readonly seed: number;
  readonly locale: RnkObjectLocale;
  readonly domain: RnkRankingDomain;
  readonly people: readonly RnkPersonObject[];
  readonly setting: RnkSettingObject;
  readonly group: RnkGroupObject;
  readonly relationTemplates: RnkRelationTemplates;
  readonly lexicon: ReturnType<typeof rnkDomainLexicon>;
}

export function buildRnkPresentationBundle(
  seed: number,
  count: number,
  options: Readonly<{
    locale?: RnkObjectLocale;
    domain?: RnkRankingDomain;
  }> = {},
): RnkPresentationBundle {
  const locale = options.locale ?? "en";
  const setting = selectRnkSetting(seed, options.domain);
  const domain = setting.domain;
  const people = selectRnkPeople(seed ^ 0x50454f50, count, {
    genderMode: "BALANCED",
    regionTag: "PUNJAB_COMPATIBLE",
  });
  const group = selectCompatibleRnkGroup(seed ^ 0x47524f55, setting);
  return {
    seed,
    locale,
    domain,
    people,
    setting,
    group,
    relationTemplates: rnkRelationTemplates(domain),
    lexicon: rnkDomainLexicon(domain),
  };
}

// Compile-time/reference guard: every semantic lexicon domain must also have a
// complete rendering-template object.
if (RNK_DOMAIN_LEXICON_V2.some((entry) => !RNK_RELATION_TEMPLATES_V2.some((template) => template.domain === entry.domain))) {
  throw new Error("RNK relation-template coverage is incomplete.");
}
