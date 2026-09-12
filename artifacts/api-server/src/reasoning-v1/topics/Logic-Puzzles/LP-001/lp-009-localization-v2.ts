import type { Lp009Child, ScheduleClue, SchedulePerson, ScheduleValue } from "./lp-009.ts";
import {
  generateLp009LocalizedBatch,
  LP_009_HI_PA_LOCALIZATION_REVIEW_V1,
  type Lp009LocalizedCaselet,
  type Lp009LocalizedChild,
  type Lp009LocalizedLanguage,
} from "./lp-009-localization-v1.ts";

export const LP_009_HI_PA_LOCALIZATION_REVIEW_V2 = Object.freeze({
  ...LP_009_HI_PA_LOCALIZATION_REVIEW_V1,
  authorityId: "LP_009_HI_PA_LOCALIZATION_REVIEW_V2" as const,
  supersedes: LP_009_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V2" as const,
  editorialFocus: "NATIVE_EXAM_WORDING_AND_GRAMMATICAL_CASE_POLISH" as const,
});

const PEOPLE: readonly SchedulePerson[] = ["A", "B", "C", "D", "E", "F"];
const VALUES: readonly ScheduleValue[] = [0, 1, 2, 3, 4, 5];

function questionTail(stem: string): string { return stem.split("\n\n").at(-1) ?? stem; }

function targetPeople(caselet: Lp009LocalizedCaselet, child: Lp009Child): SchedulePerson[] {
  const tail = questionTail(child.stem);
  return PEOPLE.filter((person) => tail.includes(caselet.englishCaselet.labels.people[person]))
    .sort((a, b) => tail.indexOf(caselet.englishCaselet.labels.people[a]) - tail.indexOf(caselet.englishCaselet.labels.people[b]));
}

function targetValue(caselet: Lp009LocalizedCaselet, child: Lp009Child): ScheduleValue | undefined {
  const tail = questionTail(child.stem);
  return VALUES.find((value) => tail.includes(caselet.englishCaselet.labels.values[value]));
}

function monthQuestion(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet, child: Lp009Child): string {
  const profile = caselet.labels;
  const people = targetPeople(caselet, caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!);
  const value = targetValue(caselet, caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!);
  const first = people[0];
  const second = people[1];
  const p = (person: SchedulePerson) => profile.people[person];
  const v = value === undefined ? "" : profile.values[value];
  const id = caselet.scenarioProfileId;

  if (language === "hi") {
    if (child.qlId === "LP-QL-033") {
      if (id === "BIRTH_MONTH_REGISTER") return `${v} में किसका जन्म हुआ था?`;
      if (id === "INTERVIEW_MONTH_REGISTER") return `${v} में किस उम्मीदवार का इंटरव्यू हुआ था?`;
      if (id === "COURSE_START_MONTHS") return `${v} में कौन-सा कोर्स शुरू हुआ था?`;
      return `${v} में किस अधिकारी ने समीक्षा बैठक में भाग लिया था?`;
    }
    if (child.qlId === "LP-QL-034") {
      if (id === "BIRTH_MONTH_REGISTER") return `${p(first!)} का जन्म किस महीने में हुआ था?`;
      if (id === "INTERVIEW_MONTH_REGISTER") return `${p(first!)} का इंटरव्यू किस महीने में हुआ था?`;
      if (id === "COURSE_START_MONTHS") return `${p(first!)} किस महीने में शुरू हुआ था?`;
      return `${p(first!)} ने समीक्षा बैठक में किस महीने भाग लिया था?`;
    }
    if (child.qlId === "LP-QL-035") {
      if (id === "BIRTH_MONTH_REGISTER") return `निम्न में से कौन-सा विकल्प क्रमशः ${p(first!)} और ${p(second!)} के जन्म-महीने सही बताता है?`;
      if (id === "INTERVIEW_MONTH_REGISTER") return `निम्न में से कौन-सा विकल्प क्रमशः ${p(first!)} और ${p(second!)} के इंटरव्यू के महीने सही बताता है?`;
      if (id === "COURSE_START_MONTHS") return `निम्न में से कौन-सा विकल्प क्रमशः ${p(first!)} और ${p(second!)} के शुरू होने के महीने सही बताता है?`;
      return `निम्न में से कौन-सा विकल्प क्रमशः ${p(first!)} और ${p(second!)} की समीक्षा-बैठक के महीने सही बताता है?`;
    }
    if (id === "BIRTH_MONTH_REGISTER") return `दिए गए क्रम में ${p(first!)} के जन्म-महीने के ठीक बाद वाले महीने में किसका जन्म हुआ था?`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `दिए गए क्रम में ${p(first!)} के इंटरव्यू-महीने के ठीक बाद वाले महीने में किसका इंटरव्यू हुआ था?`;
    if (id === "COURSE_START_MONTHS") return `दिए गए क्रम में ${p(first!)} के शुरू होने वाले महीने के ठीक बाद वाले महीने में कौन-सा कोर्स शुरू हुआ था?`;
    return `दिए गए क्रम में ${p(first!)} की समीक्षा-बैठक वाले महीने के ठीक बाद वाले महीने में किस अधिकारी ने बैठक में भाग लिया था?`;
  }

  if (child.qlId === "LP-QL-033") {
    if (id === "BIRTH_MONTH_REGISTER") return `${v} ਵਿੱਚ ਕਿਸ ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ?`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `${v} ਵਿੱਚ ਕਿਸ ਉਮੀਦਵਾਰ ਦਾ ਇੰਟਰਵਿਊ ਹੋਇਆ ਸੀ?`;
    if (id === "COURSE_START_MONTHS") return `${v} ਵਿੱਚ ਕਿਹੜਾ ਕੋਰਸ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ?`;
    return `${v} ਵਿੱਚ ਕਿਸ ਅਧਿਕਾਰੀ ਨੇ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ?`;
  }
  if (child.qlId === "LP-QL-034") {
    if (id === "BIRTH_MONTH_REGISTER") return `${p(first!)} ਦਾ ਜਨਮ ਕਿਸ ਮਹੀਨੇ ਵਿੱਚ ਹੋਇਆ ਸੀ?`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `${p(first!)} ਦਾ ਇੰਟਰਵਿਊ ਕਿਸ ਮਹੀਨੇ ਵਿੱਚ ਹੋਇਆ ਸੀ?`;
    if (id === "COURSE_START_MONTHS") return `${p(first!)} ਕਿਸ ਮਹੀਨੇ ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ?`;
    return `${p(first!)} ਨੇ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਕਿਸ ਮਹੀਨੇ ਹਿੱਸਾ ਲਿਆ ਸੀ?`;
  }
  if (child.qlId === "LP-QL-035") {
    if (id === "BIRTH_MONTH_REGISTER") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(first!)} ਅਤੇ ${p(second!)} ਦੇ ਜਨਮ ਮਹੀਨੇ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(first!)} ਅਤੇ ${p(second!)} ਦੇ ਇੰਟਰਵਿਊ ਦੇ ਮਹੀਨੇ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
    if (id === "COURSE_START_MONTHS") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(first!)} ਅਤੇ ${p(second!)} ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਦੇ ਮਹੀਨੇ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
    return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(first!)} ਅਤੇ ${p(second!)} ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਦੇ ਮਹੀਨੇ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
  }
  if (id === "BIRTH_MONTH_REGISTER") return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(first!)} ਦੇ ਜਨਮ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ਕਿਸ ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ?`;
  if (id === "INTERVIEW_MONTH_REGISTER") return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(first!)} ਦੇ ਇੰਟਰਵਿਊ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ਕਿਸ ਦਾ ਇੰਟਰਵਿਊ ਹੋਇਆ ਸੀ?`;
  if (id === "COURSE_START_MONTHS") return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(first!)} ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ਕਿਹੜਾ ਕੋਰਸ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ?`;
  return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(first!)} ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਾਲੇ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ਕਿਸ ਅਧਿਕਾਰੀ ਨੇ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ?`;
}

function yearQuestion(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet, child: Lp009LocalizedChild): string {
  const englishChild = caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!;
  const people = targetPeople(caselet, englishChild);
  const value = targetValue(caselet, englishChild);
  const p = (person: SchedulePerson) => caselet.labels.people[person];
  if (language === "hi") {
    if (child.qlId === "LP-QL-033") return `${caselet.labels.values[value!]} में किसका जन्म हुआ था?`;
    if (child.qlId === "LP-QL-034") return `${p(people[0]!)} का जन्म किस वर्ष हुआ था?`;
    if (child.qlId === "LP-QL-035") return `निम्न में से कौन-सा विकल्प क्रमशः ${p(people[0]!)} और ${p(people[1]!)} के जन्म-वर्ष सही बताता है?`;
    return `दूसरा सबसे अधिक आयु वाला ${caselet.labels.personNoun} कौन है?`;
  }
  if (child.qlId === "LP-QL-033") return `${caselet.labels.values[value!]} ਵਿੱਚ ਕਿਸ ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ?`;
  if (child.qlId === "LP-QL-034") return `${p(people[0]!)} ਦਾ ਜਨਮ ਕਿਸ ਸਾਲ ਹੋਇਆ ਸੀ?`;
  if (child.qlId === "LP-QL-035") return `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ${p(people[0]!)} ਅਤੇ ${p(people[1]!)} ਦੇ ਜਨਮ ਸਾਲ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
  return `ਦੂਜਾ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲਾ ${caselet.labels.personNoun} ਕੌਣ ਹੈ?`;
}

function monthClue(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet, clue: ScheduleClue): ScheduleClue {
  const profile = caselet.labels;
  const id = caselet.scenarioProfileId;
  const p = (person: SchedulePerson) => profile.people[person];
  const v = (value: ScheduleValue) => profile.values[value];
  let text: string;

  if (language === "hi") {
    if (clue.kind === "PERSON_VALUE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.person)} का जन्म ${v(clue.value)} में हुआ था।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.person)} का इंटरव्यू ${v(clue.value)} में हुआ था।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.person)} ${v(clue.value)} में शुरू हुआ था।`;
      else text = `${p(clue.person)} ने ${v(clue.value)} में समीक्षा बैठक में भाग लिया था।`;
    } else if (clue.kind === "BEFORE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.left)} का जन्म-महीना ${p(clue.right)} के जन्म-महीने से पहले है।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.left)} का इंटरव्यू-महीना ${p(clue.right)} के इंटरव्यू-महीने से पहले है।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.left)}, ${p(clue.right)} से पहले शुरू हुआ था।`;
      else text = `${p(clue.left)} की समीक्षा-बैठक का महीना ${p(clue.right)} की बैठक के महीने से पहले है।`;
    } else if (clue.kind === "BETWEEN") text = `दिए गए क्रम में ${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${clue.count === 1 ? "एक स्थान है" : `${clue.count} स्थान हैं`}।`;
    else if (clue.kind === "ADJACENT") text = `दिए गए क्रम में ${p(clue.left)} और ${p(clue.right)} लगातार स्थानों पर हैं; दोनों में से कोई भी पहले हो सकता है।`;
    else if (clue.kind === "NOT_VALUE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.person)} का जन्म ${v(clue.value)} में नहीं हुआ था।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.person)} का इंटरव्यू ${v(clue.value)} में नहीं हुआ था।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.person)} ${v(clue.value)} में शुरू नहीं हुआ था।`;
      else text = `${p(clue.person)} ने ${v(clue.value)} में समीक्षा बैठक में भाग नहीं लिया था।`;
    } else text = `${p(clue.person)} दूसरे स्थान पर है।`;
  } else {
    if (clue.kind === "PERSON_VALUE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.person)} ਦਾ ਜਨਮ ${v(clue.value)} ਵਿੱਚ ਹੋਇਆ ਸੀ।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.person)} ਦਾ ਇੰਟਰਵਿਊ ${v(clue.value)} ਵਿੱਚ ਹੋਇਆ ਸੀ।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.person)} ${v(clue.value)} ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ।`;
      else text = `${p(clue.person)} ਨੇ ${v(clue.value)} ਵਿੱਚ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ।`;
    } else if (clue.kind === "BEFORE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.left)} ਦਾ ਜਨਮ ਮਹੀਨਾ ${p(clue.right)} ਦੇ ਜਨਮ ਮਹੀਨੇ ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.left)} ਦਾ ਇੰਟਰਵਿਊ ਮਹੀਨਾ ${p(clue.right)} ਦੇ ਇੰਟਰਵਿਊ ਮਹੀਨੇ ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.left)}, ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ।`;
      else text = `${p(clue.left)} ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਦਾ ਮਹੀਨਾ ${p(clue.right)} ਦੀ ਮੀਟਿੰਗ ਦੇ ਮਹੀਨੇ ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
    } else if (clue.kind === "BETWEEN") text = `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count === 1 ? "ਇੱਕ ਥਾਂ ਹੈ" : `${clue.count} ਥਾਵਾਂ ਹਨ`}।`;
    else if (clue.kind === "ADJACENT") text = `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਅਤੇ ${p(clue.right)} ਲਗਾਤਾਰ ਥਾਵਾਂ 'ਤੇ ਹਨ; ਦੋਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਪਹਿਲਾਂ ਹੋ ਸਕਦਾ ਹੈ।`;
    else if (clue.kind === "NOT_VALUE") {
      if (id === "BIRTH_MONTH_REGISTER") text = `${p(clue.person)} ਦਾ ਜਨਮ ${v(clue.value)} ਵਿੱਚ ਨਹੀਂ ਹੋਇਆ ਸੀ।`;
      else if (id === "INTERVIEW_MONTH_REGISTER") text = `${p(clue.person)} ਦਾ ਇੰਟਰਵਿਊ ${v(clue.value)} ਵਿੱਚ ਨਹੀਂ ਹੋਇਆ ਸੀ।`;
      else if (id === "COURSE_START_MONTHS") text = `${p(clue.person)} ${v(clue.value)} ਵਿੱਚ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਇਆ ਸੀ।`;
      else text = `${p(clue.person)} ਨੇ ${v(clue.value)} ਵਿੱਚ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਨਹੀਂ ਲਿਆ ਸੀ।`;
    } else text = `${p(clue.person)} ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਹੈ।`;
  }
  return { ...clue, text } as ScheduleClue;
}

function summary(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet): string {
  const id = caselet.scenarioProfileId;
  if (language === "hi") {
    if (id === "BIRTH_MONTH_REGISTER") return "शर्तों से सभी विद्यार्थियों के जन्म-महीने तय हो जाते हैं।";
    if (id === "INTERVIEW_MONTH_REGISTER") return "शर्तों से सभी उम्मीदवारों के इंटरव्यू-महीने तय हो जाते हैं।";
    if (id === "COURSE_START_MONTHS") return "शर्तों से सभी कोर्स के शुरू होने वाले महीने तय हो जाते हैं।";
    if (id === "REVIEW_MEETING_MONTHS") return "शर्तों से सभी अधिकारियों की समीक्षा-बैठक के महीने तय हो जाते हैं।";
    return `शर्तों से सभी ${caselet.labels.personPlural} के जन्म-वर्ष तय हो जाते हैं।`;
  }
  if (id === "BIRTH_MONTH_REGISTER") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਜਨਮ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
  if (id === "INTERVIEW_MONTH_REGISTER") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਉਮੀਦਵਾਰਾਂ ਦੇ ਇੰਟਰਵਿਊ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
  if (id === "COURSE_START_MONTHS") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਕੋਰਸਾਂ ਦੇ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੇ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
  if (id === "REVIEW_MEETING_MONTHS") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਅਧਿਕਾਰੀਆਂ ਦੀਆਂ ਸਮੀਖਿਆ ਮੀਟਿੰਗਾਂ ਦੇ ਮਹੀਨੇ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
  return `ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ${caselet.labels.personPlural} ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।`;
}

function finalDetail(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet, child: Lp009LocalizedChild): string {
  const englishChild = caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!;
  const people = targetPeople(caselet, englishChild);
  const value = targetValue(caselet, englishChild);
  const id = caselet.scenarioProfileId;
  const answer = child.answer;
  const p = people[0] ? caselet.labels.people[people[0]] : "";
  const v = value === undefined ? "" : caselet.labels.values[value];

  if (language === "hi") {
    if (child.qlId === "LP-QL-033") {
      if (caselet.mode === "YEAR" || id === "BIRTH_MONTH_REGISTER") return `${v} में ${answer} का जन्म हुआ था। इसलिए सही उत्तर ${answer} है।`;
      if (id === "INTERVIEW_MONTH_REGISTER") return `${v} में ${answer} का इंटरव्यू हुआ था। इसलिए सही उत्तर ${answer} है।`;
      if (id === "COURSE_START_MONTHS") return `${answer} ${v} में शुरू हुआ था। इसलिए सही उत्तर ${answer} है।`;
      return `${answer} ने ${v} में समीक्षा बैठक में भाग लिया था। इसलिए सही उत्तर ${answer} है।`;
    }
    if (child.qlId === "LP-QL-034") {
      if (caselet.mode === "YEAR" || id === "BIRTH_MONTH_REGISTER") return `${p} का जन्म ${answer} में हुआ था। इसलिए सही उत्तर ${answer} है।`;
      if (id === "INTERVIEW_MONTH_REGISTER") return `${p} का इंटरव्यू ${answer} में हुआ था। इसलिए सही उत्तर ${answer} है।`;
      if (id === "COURSE_START_MONTHS") return `${p} ${answer} में शुरू हुआ था। इसलिए सही उत्तर ${answer} है।`;
      return `${p} ने ${answer} में समीक्षा बैठक में भाग लिया था। इसलिए सही उत्तर ${answer} है।`;
    }
    if (child.qlId === "LP-QL-035") return `पूर्ण तालिका में दोनों पूछी गई प्रविष्टियाँ ${answer} से मेल खाती हैं। इसलिए यही सही उत्तर है।`;
    if (caselet.mode === "YEAR") return `${answer} दूसरे सबसे अधिक आयु वाले स्थान पर है। इसलिए सही उत्तर ${answer} है।`;
    if (id === "BIRTH_MONTH_REGISTER") return `पूरे क्रम में ${p} के जन्म-महीने के ठीक बाद वाले महीने में ${answer} का जन्म हुआ था। इसलिए सही उत्तर ${answer} है।`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `पूरे क्रम में ${p} के इंटरव्यू-महीने के ठीक बाद वाले महीने में ${answer} का इंटरव्यू हुआ था। इसलिए सही उत्तर ${answer} है।`;
    if (id === "COURSE_START_MONTHS") return `पूरे क्रम में ${p} के बाद वाले महीने में ${answer} शुरू हुआ था। इसलिए सही उत्तर ${answer} है।`;
    return `पूरे क्रम में ${p} की बैठक वाले महीने के ठीक बाद वाले महीने में ${answer} ने समीक्षा बैठक में भाग लिया था। इसलिए सही उत्तर ${answer} है।`;
  }

  if (child.qlId === "LP-QL-033") {
    if (caselet.mode === "YEAR" || id === "BIRTH_MONTH_REGISTER") return `${v} ਵਿੱਚ ${answer} ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `${v} ਵਿੱਚ ${answer} ਦਾ ਇੰਟਰਵਿਊ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    if (id === "COURSE_START_MONTHS") return `${answer} ${v} ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    return `${answer} ਨੇ ${v} ਵਿੱਚ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  }
  if (child.qlId === "LP-QL-034") {
    if (caselet.mode === "YEAR" || id === "BIRTH_MONTH_REGISTER") return `${p} ਦਾ ਜਨਮ ${answer} ਵਿੱਚ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    if (id === "INTERVIEW_MONTH_REGISTER") return `${p} ਦਾ ਇੰਟਰਵਿਊ ${answer} ਵਿੱਚ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    if (id === "COURSE_START_MONTHS") return `${p} ${answer} ਵਿੱਚ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
    return `${p} ਨੇ ${answer} ਵਿੱਚ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  }
  if (child.qlId === "LP-QL-035") return `ਪੂਰੀ ਸਾਰਣੀ ਵਿੱਚ ਦੋਵੇਂ ਪੁੱਛੀਆਂ ਐਂਟਰੀਆਂ ${answer} ਨਾਲ ਮੇਲ ਖਾਂਦੀਆਂ ਹਨ। ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।`;
  if (caselet.mode === "YEAR") return `${answer} ਦੂਜੇ ਸਭ ਤੋਂ ਵੱਧ ਉਮਰ ਵਾਲੇ ਸਥਾਨ 'ਤੇ ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  if (id === "BIRTH_MONTH_REGISTER") return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${p} ਦੇ ਜਨਮ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ${answer} ਦਾ ਜਨਮ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  if (id === "INTERVIEW_MONTH_REGISTER") return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${p} ਦੇ ਇੰਟਰਵਿਊ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ${answer} ਦਾ ਇੰਟਰਵਿਊ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  if (id === "COURSE_START_MONTHS") return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${p} ਤੋਂ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ${answer} ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${p} ਦੀ ਮੀਟਿੰਗ ਵਾਲੇ ਮਹੀਨੇ ਤੋਂ ਠੀਕ ਅਗਲੇ ਮਹੀਨੇ ਵਿੱਚ ${answer} ਨੇ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਵਿੱਚ ਹਿੱਸਾ ਲਿਆ ਸੀ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
}

function replaceFinalDetail(line: string, detail: string): string {
  const parts = line.split("\n\n");
  if (parts.length < 3) return line;
  return [parts[0], detail, ...parts.slice(2)].join("\n\n");
}

function polishCaselet(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet): Lp009LocalizedCaselet {
  const clues = caselet.mode === "MONTH" ? caselet.englishCaselet.clues.map((clue) => monthClue(language, caselet, clue)) : caselet.clues;
  const children = caselet.children.map((child) => {
    const question = caselet.mode === "MONTH" ? monthQuestion(language, caselet, child) : yearQuestion(language, caselet, child);
    const stem = `${caselet.questionSetup}\n\n${language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:"}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
    const lines = [...child.explanation.lines];
    lines[lines.length - 1] = replaceFinalDetail(lines[lines.length - 1]!, language === "hi" ? `सभी शर्तों को लागू करने पर केवल एक व्यवस्था बचती है। एक-से-एक नियम से बाकी स्थान भरें। ${finalDetail(language, caselet, child)}` : `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕੇਵਲ ਇੱਕ ਵਿਵਸਥਾ ਬਚਦੀ ਹੈ। ਇੱਕ-ਤੋਂ-ਇੱਕ ਨਿਯਮ ਨਾਲ ਬਾਕੀ ਥਾਵਾਂ ਭਰੋ। ${finalDetail(language, caselet, child)}`);
    return { ...child, stem, explanation: { summary: summary(language, caselet), lines } };
  });
  return { ...caselet, clues, children };
}

export function generateLp009LocalizedBatchV2(language: Lp009LocalizedLanguage, seed = "lp-009-localization-review-v2", count = 8): Lp009LocalizedCaselet[] {
  return generateLp009LocalizedBatch(language, seed, count).map((caselet) => polishCaselet(language, caselet));
}
