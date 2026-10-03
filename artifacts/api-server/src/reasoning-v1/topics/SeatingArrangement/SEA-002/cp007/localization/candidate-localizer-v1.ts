import type {
  Sea002Cp007ProductionCaselet,
  Sea002Cp007ProductionClue,
} from "../production-caselet-v1.ts";
import {
  cp007CanonicalParityFingerprint,
  type Sea002Cp007TranslatedLocale,
} from "./readiness.ts";

type Facing = "N" | "S";
type Row = "TOP" | "BOTTOM";

export type Sea002Cp007LocalizedCandidate = Readonly<{
  locale: Sea002Cp007TranslatedLocale;
  caseletId: string;
  authorityKey: Sea002Cp007ProductionCaselet["authorityKey"];
  stem: string;
  question: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  canonicalParityFingerprint: string;
}>;

function arrow(facing: Facing) {
  return facing === "N" ? "↑" : "↓";
}

function facingWord(locale: Sea002Cp007TranslatedLocale, facing: Facing) {
  if (locale === "hi-IN") return facing === "N" ? "उत्तर" : "दक्षिण";
  return facing === "N" ? "ਉੱਤਰ" : "ਦੱਖਣ";
}

function rowWord(locale: Sea002Cp007TranslatedLocale, row: Row) {
  if (locale === "hi-IN") return row === "TOP" ? "ऊपरी पंक्ति" : "निचली पंक्ति";
  return row === "TOP" ? "ਉੱਪਰਲੀ ਕਤਾਰ" : "ਹੇਠਲੀ ਕਤਾਰ";
}

function directionWord(locale: Sea002Cp007TranslatedLocale, direction: "LEFT" | "RIGHT") {
  if (locale === "hi-IN") return direction === "LEFT" ? "बाईं ओर" : "दाईं ओर";
  return direction === "LEFT" ? "ਖੱਬੇ ਪਾਸੇ" : "ਸੱਜੇ ਪਾਸੇ";
}

function participant(caselet: Sea002Cp007ProductionCaselet, id: string) {
  const found = caselet.participants.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown CP007 participant ${id}.`);
  return found;
}

function oppositeFacing(value: Facing): Facing {
  return value === "N" ? "S" : "N";
}

function oppositeRow(value: Row): Row {
  return value === "TOP" ? "BOTTOM" : "TOP";
}

function facingPath(caselet: Sea002Cp007ProductionCaselet, target: string): Sea002Cp007ProductionClue[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("CP007 facing anchor missing.");
  if (anchor.person === target) return [];
  const relations = caselet.clues.filter((clue) => clue.kind === "FACING_RELATION");
  const queue = [anchor.person];
  const seen = new Set(queue);
  const parent = new Map<string, { previous: string; clue: Sea002Cp007ProductionClue }>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const clue of relations) {
      if (clue.kind !== "FACING_RELATION") continue;
      const next = clue.left === current ? clue.right : clue.right === current ? clue.left : null;
      if (!next || seen.has(next)) continue;
      seen.add(next);
      parent.set(next, { previous: current, clue });
      if (next === target) {
        const path: Sea002Cp007ProductionClue[] = [];
        let node = target;
        while (node !== anchor.person) {
          const link = parent.get(node);
          if (!link) throw new Error(`Broken CP007 facing path to ${target}.`);
          path.push(link.clue);
          node = link.previous;
        }
        return path.reverse();
      }
      queue.push(next);
    }
  }
  throw new Error(`No CP007 facing path to ${target}.`);
}

function facingProofLines(
  caselet: Sea002Cp007ProductionCaselet,
  target: string,
  locale: Sea002Cp007TranslatedLocale,
): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!anchor || anchor.kind !== "FACING_ANCHOR") throw new Error("CP007 facing anchor missing.");
  const lines = locale === "hi-IN"
    ? [`- दिया है: ${anchor.person} ${facingWord(locale, anchor.facing)} की ओर मुख करके बैठा/बैठी है ${arrow(anchor.facing)}।`]
    : [`- ਦਿੱਤਾ ਹੈ: ${anchor.person} ${facingWord(locale, anchor.facing)} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ ${arrow(anchor.facing)}।`];
  if (anchor.person === target) return lines;
  let knownPerson = anchor.person;
  let knownFacing = anchor.facing;
  for (const clue of facingPath(caselet, target)) {
    if (clue.kind !== "FACING_RELATION") continue;
    const nextPerson = clue.left === knownPerson ? clue.right : clue.left;
    const nextFacing = clue.relation === "SAME" ? knownFacing : oppositeFacing(knownFacing);
    if (locale === "hi-IN") {
      lines.push(`- ${clue.left} और ${clue.right} ${clue.relation === "SAME" ? "एक ही दिशा" : "विपरीत दिशाओं"} में मुख किए हैं; इसलिए ${nextPerson} ${facingWord(locale, nextFacing)} की ओर मुख करता/करती है ${arrow(nextFacing)}।`);
    } else {
      lines.push(`- ${clue.left} ਅਤੇ ${clue.right} ${clue.relation === "SAME" ? "ਇੱਕੋ ਦਿਸ਼ਾ" : "ਉਲਟ ਦਿਸ਼ਾਵਾਂ"} ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ; ਇਸ ਲਈ ${nextPerson} ${facingWord(locale, nextFacing)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ ${arrow(nextFacing)}।`);
    }
    knownPerson = nextPerson;
    knownFacing = nextFacing;
  }
  return lines;
}

function rowRelation(clue: Sea002Cp007ProductionClue) {
  if (clue.kind === "SAME_ROW_OFFSET") return { left: clue.subject, right: clue.reference, relation: "SAME" as const };
  if (clue.kind === "OPPOSITE") return { left: clue.left, right: clue.right, relation: "DIFFERENT" as const };
  if (clue.kind === "DIAGONAL") return { left: clue.subject, right: clue.reference, relation: "DIFFERENT" as const };
  return null;
}

function rowProofLines(
  caselet: Sea002Cp007ProductionCaselet,
  target: string,
  locale: Sea002Cp007TranslatedLocale,
): string[] {
  const anchor = caselet.clues.find((clue) => clue.kind === "ROW_ANCHOR");
  if (!anchor || anchor.kind !== "ROW_ANCHOR") {
    return locale === "hi-IN"
      ? [`- पंक्ति-सदस्य सूची से ${target} की पंक्ति सीधे ज्ञात है।`]
      : [`- ਕਤਾਰ-ਮੈਂਬਰਾਂ ਦੀ ਸੂਚੀ ਤੋਂ ${target} ਦੀ ਕਤਾਰ ਸਿੱਧੀ ਪਤਾ ਲੱਗਦੀ ਹੈ।`];
  }
  const lines = locale === "hi-IN"
    ? [`- दिया है: ${anchor.person} ${rowWord(locale, anchor.row)} में बैठता/बैठती है।`]
    : [`- ਦਿੱਤਾ ਹੈ: ${anchor.person} ${rowWord(locale, anchor.row)} ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`];
  if (anchor.person === target) return lines;
  const relations = caselet.clues.map(rowRelation).filter((item): item is NonNullable<ReturnType<typeof rowRelation>> => item !== null);
  const queue = [anchor.person];
  const rows = new Map<string, Row>([[anchor.person, anchor.row]]);
  const parent = new Map<string, { previous: string; relation: (typeof relations)[number] }>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentRow = rows.get(current)!;
    for (const relation of relations) {
      const next = relation.left === current ? relation.right : relation.right === current ? relation.left : null;
      if (!next || rows.has(next)) continue;
      const nextRow = relation.relation === "SAME" ? currentRow : oppositeRow(currentRow);
      rows.set(next, nextRow);
      parent.set(next, { previous: current, relation });
      if (next === target) {
        const chain: string[] = [];
        let node = target;
        while (node !== anchor.person) {
          const link = parent.get(node);
          if (!link) throw new Error(`Broken CP007 row path to ${target}.`);
          const resolved = rows.get(node)!;
          if (locale === "hi-IN") {
            chain.push(`- ${node}, ${link.previous} के ${link.relation.relation === "SAME" ? "समान" : "दूसरी"} पंक्ति में है; इसलिए ${node} ${rowWord(locale, resolved)} में है।`);
          } else {
            chain.push(`- ${node}, ${link.previous} ਦੀ ${link.relation.relation === "SAME" ? "ਉਹੀ" : "ਦੂਜੀ"} ਕਤਾਰ ਵਿੱਚ ਹੈ; ਇਸ ਲਈ ${node} ${rowWord(locale, resolved)} ਵਿੱਚ ਹੈ।`);
          }
          node = link.previous;
        }
        return [...lines, ...chain.reverse()];
      }
      queue.push(next);
    }
  }
  throw new Error(`No CP007 row path to ${target}.`);
}

function renderDiagram(caselet: Sea002Cp007ProductionCaselet, locale: Sea002Cp007TranslatedLocale) {
  const positions = Array.from({ length: caselet.width }, (_, index) => String(index + 1)).join(" | ");
  const row = (which: Row) => caselet.participants
    .filter((item) => item.seat.row === which)
    .sort((left, right) => left.seat.position - right.seat.position)
    .map((item) => `${item.id}${arrow(item.facing)}`)
    .join(" | ");
  if (locale === "hi-IN") {
    return [
      "अंतिम व्यवस्था (हमारी बाईं ओर से दाईं ओर):",
      `स्थान : ${positions}`,
      `ऊपरी पंक्ति: ${row("TOP")}`,
      `निचली पंक्ति: ${row("BOTTOM")}`,
      "↑ = उत्तर, ↓ = दक्षिण",
    ].join("\n");
  }
  return [
    "ਅੰਤਿਮ ਬੈਠਕ (ਸਾਡੇ ਖੱਬੇ ਤੋਂ ਸੱਜੇ):",
    `ਸਥਾਨ : ${positions}`,
    `ਉੱਪਰਲੀ ਕਤਾਰ: ${row("TOP")}`,
    `ਹੇਠਲੀ ਕਤਾਰ: ${row("BOTTOM")}`,
    "↑ = ਉੱਤਰ, ↓ = ਦੱਖਣ",
  ].join("\n");
}

function renderClue(clue: Sea002Cp007ProductionClue, locale: Sea002Cp007TranslatedLocale): string {
  if (locale === "hi-IN") {
    switch (clue.kind) {
      case "FACING_ANCHOR": return `${clue.person} ${facingWord(locale, clue.facing)} की ओर मुख करके बैठा/बैठी है।`;
      case "FACING_RELATION": return `${clue.left} और ${clue.right} ${clue.relation === "SAME" ? "एक ही दिशा" : "विपरीत दिशाओं"} में मुख किए हैं।`;
      case "ROW_ANCHOR": return `${clue.person} ${rowWord(locale, clue.row)} में बैठता/बैठती है।`;
      case "SAME_ROW_OFFSET": return `${clue.subject}, ${clue.reference} के ${directionWord(locale, clue.direction)} ${clue.distance === 1 ? "तुरंत" : `${clue.distance} स्थान`} बैठता/बैठती है।`;
      case "OPPOSITE": return `${clue.left}, ${clue.right} के ठीक सामने बैठता/बैठती है।`;
      case "DIAGONAL": return `${clue.subject}, ${clue.reference} से तिरछे ${clue.reference} की ${directionWord(locale, clue.direction)} बैठता/बैठती है।`;
    }
  }
  switch (clue.kind) {
    case "FACING_ANCHOR": return `${clue.person} ${facingWord(locale, clue.facing)} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`;
    case "FACING_RELATION": return `${clue.left} ਅਤੇ ${clue.right} ${clue.relation === "SAME" ? "ਇੱਕੋ ਦਿਸ਼ਾ" : "ਉਲਟ ਦਿਸ਼ਾਵਾਂ"} ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।`;
    case "ROW_ANCHOR": return `${clue.person} ${rowWord(locale, clue.row)} ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`;
    case "SAME_ROW_OFFSET": return `${clue.subject}, ${clue.reference} ਦੇ ${directionWord(locale, clue.direction)} ${clue.distance === 1 ? "ਤੁਰੰਤ" : `${clue.distance} ਸਥਾਨ`} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`;
    case "OPPOSITE": return `${clue.left}, ${clue.right} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`;
    case "DIAGONAL": return `${clue.subject}, ${clue.reference} ਤੋਂ ਤਿਰਛੇ ${clue.reference} ਦੇ ${directionWord(locale, clue.direction)} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`;
  }
}

function renderStem(caselet: Sea002Cp007ProductionCaselet, locale: Sea002Cp007TranslatedLocale) {
  const top = [...caselet.rowGroups.top].sort().join(", ");
  const bottom = [...caselet.rowGroups.bottom].sort().join(", ");
  const roster = caselet.rowMembershipMode === "GIVEN"
    ? locale === "hi-IN"
      ? `ऊपरी पंक्ति के सदस्य हैं ${top}; निचली पंक्ति के सदस्य हैं ${bottom}। `
      : `ਉੱਪਰਲੀ ਕਤਾਰ ਦੇ ਮੈਂਬਰ ਹਨ ${top}; ਹੇਠਲੀ ਕਤਾਰ ਦੇ ਮੈਂਬਰ ਹਨ ${bottom}। `
    : "";
  const intro = locale === "hi-IN"
    ? `दो समानांतर पंक्तियों में प्रत्येक में ${caselet.width} व्यक्ति बैठे हैं। ${roster}कुछ व्यक्ति उत्तर और कुछ दक्षिण की ओर मुख करके बैठे हैं।`
    : `ਦੋ ਸਮਾਂਤਰ ਕਤਾਰਾਂ ਵਿੱਚ ਹਰ ਕਤਾਰ ਵਿੱਚ ${caselet.width} ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ। ${roster}ਕੁਝ ਵਿਅਕਤੀ ਉੱਤਰ ਅਤੇ ਕੁਝ ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`;
  return `${intro} ${caselet.clues.map((clue) => renderClue(clue, locale)).join(" ")}`;
}

function parseReference(question: string): string {
  const sameRow = question.match(/\bof ([A-Za-z]+)\?$/u);
  if (sameRow) return sameRow[1]!;
  const diagonal = question.match(/\bfrom ([A-Za-z]+) in \1's (?:left|right)-hand direction\?$/u);
  if (diagonal) return diagonal[1]!;
  throw new Error(`Could not parse CP007 reference from ${question}`);
}

function parseDirection(question: string): "LEFT" | "RIGHT" {
  return /\bleft\b/iu.test(question) ? "LEFT" : "RIGHT";
}

function localizedQuestion(caselet: Sea002Cp007ProductionCaselet, locale: Sea002Cp007TranslatedLocale): string {
  if (caselet.authorityKey === "CP007-AUTH-01") {
    const reference = parseReference(caselet.question);
    const direction = parseDirection(caselet.question);
    return locale === "hi-IN"
      ? `${reference} के ${directionWord(locale, direction)} तुरंत कौन बैठता/बैठती है?`
      : `${reference} ਦੇ ${directionWord(locale, direction)} ਤੁਰੰਤ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`;
  }
  if (caselet.authorityKey === "CP007-AUTH-02") {
    const target = caselet.question.match(/does ([A-Za-z]+) face\?/u)?.[1];
    if (!target) throw new Error("CP007 AUTH02 target parse failed.");
    return locale === "hi-IN" ? `${target} किस दिशा की ओर मुख करता/करती है?` : `${target} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ?`;
  }
  if (caselet.authorityKey === "CP007-AUTH-03") {
    const target = caselet.question.match(/gives ([A-Za-z]+)'s row/u)?.[1];
    if (!target) throw new Error("CP007 AUTH03 target parse failed.");
    return locale === "hi-IN"
      ? `कौन-सा विकल्प ${target} की पंक्ति और मुख की दिशा दोनों सही बताता है?`
      : `ਕਿਹੜਾ ਵਿਕਲਪ ${target} ਦੀ ਕਤਾਰ ਅਤੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਦੋਵੇਂ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
  }
  const reference = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  return locale === "hi-IN"
    ? `${reference} की ${directionWord(locale, direction)} तिरछे कौन बैठता/बैठती है?`
    : `${reference} ਦੇ ${directionWord(locale, direction)} ਤਿਰਛੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`;
}

function localizeOption(value: string, locale: Sea002Cp007TranslatedLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/^North$/u, "उत्तर")
      .replace(/^South$/u, "दक्षिण")
      .replace(/^Cannot be determined$/u, "निर्धारित नहीं किया जा सकता")
      .replace(/^Either north or south$/u, "उत्तर या दक्षिण, कोई भी")
      .replace(/^Upper row — North$/u, "ऊपरी पंक्ति — उत्तर")
      .replace(/^Upper row — South$/u, "ऊपरी पंक्ति — दक्षिण")
      .replace(/^Lower row — North$/u, "निचली पंक्ति — उत्तर")
      .replace(/^Lower row — South$/u, "निचली पंक्ति — दक्षिण");
  }
  return value
    .replace(/^North$/u, "ਉੱਤਰ")
    .replace(/^South$/u, "ਦੱਖਣ")
    .replace(/^Cannot be determined$/u, "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ")
    .replace(/^Either north or south$/u, "ਉੱਤਰ ਜਾਂ ਦੱਖਣ, ਕੋਈ ਵੀ")
    .replace(/^Upper row — North$/u, "ਉੱਪਰਲੀ ਕਤਾਰ — ਉੱਤਰ")
    .replace(/^Upper row — South$/u, "ਉੱਪਰਲੀ ਕਤਾਰ — ਦੱਖਣ")
    .replace(/^Lower row — North$/u, "ਹੇਠਲੀ ਕਤਾਰ — ਉੱਤਰ")
    .replace(/^Lower row — South$/u, "ਹੇਠਲੀ ਕਤਾਰ — ਦੱਖਣ");
}

function pointOfView(locale: Sea002Cp007TranslatedLocale, personId: string, facing: Facing) {
  if (locale === "hi-IN") {
    return facing === "N"
      ? `${personId} उत्तर की ओर मुख करता/करती है, इसलिए उसकी बाईं/दाईं दिशा हमारी बाईं/दाईं दिशा जैसी ही है।`
      : `${personId} दक्षिण की ओर मुख करता/करती है, इसलिए उसकी बाईं/दाईं दिशा हमारी दृष्टि से उलट होगी।`;
  }
  return facing === "N"
    ? `${personId} ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਉਸਦਾ ਖੱਬਾ/ਸੱਜਾ ਸਾਡੇ ਖੱਬੇ/ਸੱਜੇ ਵਰਗਾ ਹੀ ਹੈ।`
    : `${personId} ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਉਸਦਾ ਖੱਬਾ/ਸੱਜਾ ਸਾਡੇ ਨਜ਼ਰੀਏ ਤੋਂ ਉਲਟ ਹੋਵੇਗਾ।`;
}

function explanation(caselet: Sea002Cp007ProductionCaselet, locale: Sea002Cp007TranslatedLocale): string {
  if (caselet.authorityKey === "CP007-AUTH-01") {
    const referenceId = parseReference(caselet.question);
    const direction = parseDirection(caselet.question);
    const reference = participant(caselet, referenceId);
    const target = participant(caselet, caselet.answer);
    return locale === "hi-IN"
      ? [
          `पूछा है: ${referenceId} के ${directionWord(locale, direction)} तुरंत कौन बैठता/बैठती है?`,
          "1) पहले संदर्भ व्यक्ति की मुख-दिशा निर्धारित करें:",
          ...facingProofLines(caselet, referenceId, locale),
          "2) बैठने की स्थिति को पंक्तियों में लगाएँ:",
          renderDiagram(caselet, locale),
          `3) अब ${referenceId} की दृष्टि से बायाँ/दायाँ पढ़ें। ${pointOfView(locale, referenceId, reference.facing)}`,
          `${referenceId} स्थान ${reference.seat.position + 1} पर है; उसकी ${directionWord(locale, direction)} अगला स्थान ${target.seat.position + 1} है, जहाँ ${caselet.answer} बैठता/बैठती है।`,
          `उत्तर: ${caselet.answer}।`,
        ].join("\n")
      : [
          `ਪੁੱਛਿਆ ਹੈ: ${referenceId} ਦੇ ${directionWord(locale, direction)} ਤੁਰੰਤ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`,
          "1) ਪਹਿਲਾਂ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਿਰਧਾਰਤ ਕਰੋ:",
          ...facingProofLines(caselet, referenceId, locale),
          "2) ਬੈਠਕ ਨੂੰ ਕਤਾਰਾਂ ਵਿੱਚ ਲਗਾਓ:",
          renderDiagram(caselet, locale),
          `3) ਹੁਣ ${referenceId} ਦੇ ਨਜ਼ਰੀਏ ਤੋਂ ਖੱਬਾ/ਸੱਜਾ ਪੜ੍ਹੋ। ${pointOfView(locale, referenceId, reference.facing)}`,
          `${referenceId} ਸਥਾਨ ${reference.seat.position + 1} 'ਤੇ ਹੈ; ਉਸਦੇ ${directionWord(locale, direction)} ਅਗਲਾ ਸਥਾਨ ${target.seat.position + 1} ਹੈ, ਜਿੱਥੇ ${caselet.answer} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`,
          `ਉੱਤਰ: ${caselet.answer}।`,
        ].join("\n");
  }
  if (caselet.authorityKey === "CP007-AUTH-02") {
    const target = caselet.question.match(/does ([A-Za-z]+) face\?/u)?.[1];
    if (!target) throw new Error("CP007 AUTH02 target parse failed.");
    const resolved = participant(caselet, target);
    return locale === "hi-IN"
      ? [`पूछा है: ${target} किस दिशा की ओर मुख करता/करती है? इस प्रश्न के लिए पूरी बैठने की व्यवस्था बनाना आवश्यक नहीं है।`, "केवल मुख-दिशा की कड़ी का अनुसरण करें:", ...facingProofLines(caselet, target, locale), `अतः ${target} ${facingWord(locale, resolved.facing)} की ओर मुख करता/करती है ${arrow(resolved.facing)}।`, `उत्तर: ${localizeOption(caselet.answer, locale)}।`].join("\n")
      : [`ਪੁੱਛਿਆ ਹੈ: ${target} ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ? ਇਸ ਸਵਾਲ ਲਈ ਪੂਰੀ ਬੈਠਕ ਬਣਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ।`, "ਕੇਵਲ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵਾਲੀ ਲੜੀ ਦੀ ਪਾਲਣਾ ਕਰੋ:", ...facingProofLines(caselet, target, locale), `ਇਸ ਲਈ ${target} ${facingWord(locale, resolved.facing)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ ${arrow(resolved.facing)}।`, `ਉੱਤਰ: ${localizeOption(caselet.answer, locale)}।`].join("\n");
  }
  if (caselet.authorityKey === "CP007-AUTH-03") {
    const target = caselet.question.match(/gives ([A-Za-z]+)'s row/u)?.[1];
    if (!target) throw new Error("CP007 AUTH03 target parse failed.");
    const resolved = participant(caselet, target);
    return locale === "hi-IN"
      ? [`पूछा है: ${target} की पंक्ति और मुख-दिशा दोनों निर्धारित करें। दोनों भाग अलग-अलग हल करें।`, "1) पंक्ति:", ...rowProofLines(caselet, target, locale), `अतः ${target} ${rowWord(locale, resolved.seat.row)} में है।`, "2) मुख-दिशा:", ...facingProofLines(caselet, target, locale), `अतः ${target} ${facingWord(locale, resolved.facing)} की ओर मुख करता/करती है ${arrow(resolved.facing)}।`, "व्यवस्था से जाँच:", renderDiagram(caselet, locale), `उत्तर: ${localizeOption(caselet.answer, locale)}।`].join("\n")
      : [`ਪੁੱਛਿਆ ਹੈ: ${target} ਦੀ ਕਤਾਰ ਅਤੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਦੋਵੇਂ ਨਿਰਧਾਰਤ ਕਰੋ। ਦੋਵੇਂ ਹਿੱਸੇ ਵੱਖ-ਵੱਖ ਹੱਲ ਕਰੋ।`, "1) ਕਤਾਰ:", ...rowProofLines(caselet, target, locale), `ਇਸ ਲਈ ${target} ${rowWord(locale, resolved.seat.row)} ਵਿੱਚ ਹੈ।`, "2) ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ:", ...facingProofLines(caselet, target, locale), `ਇਸ ਲਈ ${target} ${facingWord(locale, resolved.facing)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ ${arrow(resolved.facing)}।`, "ਬੈਠਕ ਨਾਲ ਜਾਂਚ:", renderDiagram(caselet, locale), `ਉੱਤਰ: ${localizeOption(caselet.answer, locale)}।`].join("\n");
  }
  const referenceId = parseReference(caselet.question);
  const direction = parseDirection(caselet.question);
  const reference = participant(caselet, referenceId);
  const target = participant(caselet, caselet.answer);
  return locale === "hi-IN"
    ? [`पूछा है: ${referenceId} की ${directionWord(locale, direction)} तिरछे कौन बैठता/बैठती है?`, "1) पहले संदर्भ व्यक्ति की मुख-दिशा निर्धारित करें:", ...facingProofLines(caselet, referenceId, locale), `2) ${referenceId} की बाईं/दाईं दिशा सही पढ़ें। ${pointOfView(locale, referenceId, reference.facing)}`, "3) दोनों पंक्तियाँ बनाकर सामने वाले स्थानों को मिलाएँ:", renderDiagram(caselet, locale), `4) ${referenceId} स्थान ${reference.seat.position + 1} पर है। उसकी ${directionWord(locale, direction)} एक स्थान चलकर दूसरी पंक्ति में उसी तिरछे स्थान पर जाएँ; वहाँ स्थान ${target.seat.position + 1} पर ${caselet.answer} बैठता/बैठती है।`, `उत्तर: ${caselet.answer}।`].join("\n")
    : [`ਪੁੱਛਿਆ ਹੈ: ${referenceId} ਦੇ ${directionWord(locale, direction)} ਤਿਰਛੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`, "1) ਪਹਿਲਾਂ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਿਰਧਾਰਤ ਕਰੋ:", ...facingProofLines(caselet, referenceId, locale), `2) ${referenceId} ਦਾ ਖੱਬਾ/ਸੱਜਾ ਸਹੀ ਪੜ੍ਹੋ। ${pointOfView(locale, referenceId, reference.facing)}`, "3) ਦੋਵੇਂ ਕਤਾਰਾਂ ਬਣਾਕੇ ਸਾਹਮਣੇ ਵਾਲੇ ਸਥਾਨ ਮਿਲਾਓ:", renderDiagram(caselet, locale), `4) ${referenceId} ਸਥਾਨ ${reference.seat.position + 1} 'ਤੇ ਹੈ। ਉਸਦੇ ${directionWord(locale, direction)} ਇੱਕ ਸਥਾਨ ਜਾ ਕੇ ਦੂਜੀ ਕਤਾਰ ਦੇ ਉਸ ਤਿਰਛੇ ਸਥਾਨ 'ਤੇ ਜਾਓ; ਉੱਥੇ ਸਥਾਨ ${target.seat.position + 1} 'ਤੇ ${caselet.answer} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`, `ਉੱਤਰ: ${caselet.answer}।`].join("\n");
}

export function localizeSea002Cp007Candidate(
  caselet: Sea002Cp007ProductionCaselet,
  locale: Sea002Cp007TranslatedLocale,
): Sea002Cp007LocalizedCandidate {
  const options = Object.freeze(caselet.options.map((option) => localizeOption(option, locale)));
  return Object.freeze({
    locale,
    caseletId: caselet.caseletId,
    authorityKey: caselet.authorityKey,
    stem: renderStem(caselet, locale),
    question: localizedQuestion(caselet, locale),
    options,
    correctIndex: caselet.correctIndex,
    answer: localizeOption(caselet.answer, locale),
    explanation: explanation(caselet, locale),
    canonicalParityFingerprint: cp007CanonicalParityFingerprint(caselet),
  });
}
