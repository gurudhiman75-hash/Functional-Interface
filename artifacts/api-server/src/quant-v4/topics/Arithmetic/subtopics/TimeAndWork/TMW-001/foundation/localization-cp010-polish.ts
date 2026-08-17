import type { TmwLocalizedLanguage } from "./localization-types";
import { cp010Label } from "./localization-cp010-language";

const scheduleLabels = [
  "Before the temporary outlet is shut",
  "After the temporary outlet is shut",
  "Before the level sensor switches",
  "After the level sensor switches",
  "Simultaneous inlet and outlet",
  "Initial scheduled interval",
  "Initial pumping interval",
  "Required final interval",
  "Both inlets operate",
  "Only Inlet A operates",
  "Before the leak is repaired",
  "After the leak is repaired",
  "Before the leak begins",
  "After the leak begins",
  "Before Outlet B opens",
  "After Outlet B opens",
  "Before Outlet B closes",
  "After Outlet B closes",
  "Before Inlet A closes",
  "After Inlet A closes",
  "Before Inlet B opens",
  "After Inlet B opens",
  "Initial pumping",
  "Final pumping",
  "Final filling interval",
  "Power-cut interval",
  "Pumping resumes",
  "Known first interval",
  "Morning inlet",
  "Primary pump",
  "Reduced net flow",
  "First interval",
  "Second interval",
  "Final interval",
  "First shift",
  "Second shift",
  "Inlet A hour",
  "Outlet B hour",
  "Inlet B hour",
  "Outlet operates",
  "Inlet-only interval",
  "Mixed-flow interval",
  "Fast inlet shift",
  "Slow inlet shift",
  "Drainage check",
  "Dual-pump interval",
  "Single-pump interval",
  "Inlet A shift",
  "Outlet B shift",
  "Inlet C shift",
  "Inlet interval",
  "Outlet interval",
  "Inlet A interval",
  "Outlet B interval",
  "Inlet C interval",
  "Before the event",
  "After the event",
  "Final Pipe",
] as const;

function localizeScheduleLabels(text: string, language: TmwLocalizedLanguage): string {
  let output = text;
  for (const label of [...scheduleLabels].sort((a, b) => b.length - a.length)) {
    output = output.replaceAll(label, cp010Label(label, language));
  }
  if (language === "hi") {
    return output
      .replace(/Recovery inlet (?:interval|अंतराल)/g, "पुनर्भराव अंतराल")
      .replace(/Drainage (?:interval|अंतराल)/g, "निकासी अंतराल")
      .replace(/Pump-on (?:interval|अंतराल)/g, "पंप-चालू अंतराल")
      .replace(/Drain (?:interval|अंतराल)/g, "निकासी अंतराल")
      .replace(/Inlet ([A-Z])/g, "भरने वाली पाइप $1")
      .replace(/Outlet ([A-Z])/g, "निकासी पाइप $1")
      .replace(/Leak ([A-Z])/g, "रिसाव $1");
  }
  return output
    .replace(/Recovery inlet (?:interval|ਅੰਤਰਾਲ)/g, "ਮੁੜ-ਭਰਾਅ ਅੰਤਰਾਲ")
    .replace(/Drainage (?:interval|ਅੰਤਰਾਲ)/g, "ਨਿਕਾਸੀ ਅੰਤਰਾਲ")
    .replace(/Pump-on (?:interval|ਅੰਤਰਾਲ)/g, "ਪੰਪ-ਚਾਲੂ ਅੰਤਰਾਲ")
    .replace(/Drain (?:interval|ਅੰਤਰਾਲ)/g, "ਨਿਕਾਸੀ ਅੰਤਰਾਲ")
    .replace(/Inlet ([A-Z])/g, "ਭਰਨ ਵਾਲੀ ਪਾਈਪ $1")
    .replace(/Outlet ([A-Z])/g, "ਨਿਕਾਸੀ ਪਾਈਪ $1")
    .replace(/Leak ([A-Z])/g, "ਰਿਸਾਅ $1");
}

function normalizeMixedFractions(text: string): string {
  return text.replace(
    /(^|[^\d])(-?\d+)\s+(\d+)\/(\d+)(?!\d)/g,
    (_match, prefix: string, whole: string, numerator: string, denominator: string) =>
      `${prefix}\\(${whole}\\frac{${numerator}}{${denominator}}\\)`,
  );
}

function polishHindi(text: string): string {
  return text
    .replace(/Complete cycles before the terminal cycle/g, "अंतिम चक्र से पहले पूरे चक्र")
    .replace(/_\{cycle\}/g, "_{चक्र}")
    .replace(/_\{target\}/g, "_{लक्ष्य}")
    .replace(/_\{threshold\}/g, "_{सीमा}")
    .replace(/_\{after\\ switch\}/g, "_{बदलाव के बाद}")
    .replace(/_\{off\}/g, "_{बंद}")
    .replace(/_\{on\}/g, "_{चालू}")
    .replace(/_\{old\}/g, "_{पुराना}")
    .replace(/\\text\{tank\/hour\}/g, "\\text{टंकी/घंटा}")
    .replace(/\\text\{tank\/(?:घंटा|घंटे)\}/g, "\\text{टंकी/घंटा}")
    .replace(/\\text\{(?:hours|घंटे) earlier\}/g, "\\text{घंटे पहले}")
    .replace(/\\text\{(?:hours|घंटे) later\}/g, "\\text{घंटे बाद}")
    .replace(/\\text\{hours\}/g, "\\text{घंटे}")
    .replace(/\\text\{litres\}/g, "\\text{लीटर}")
    .replace(/\\text\{Stage (\d+): \}/g, "\\text{चरण $1: }")
    .replace(/drainage still required at its start/g, "खंड के आरंभ पर शेष निकासी")
    .replace(/level still required at its start/g, "खंड के आरंभ पर शेष स्तर")
    .replace(/completion occurs exactly at the end of /g, "समापन ठीक इसके अंत में होता है: ")
    .replace(/terminal segment is /g, "अंतिम सक्रिय खंड: ")
    .replace(/Process full cycles, then test each terminal segment/g, "पूरे चक्र लें, फिर अंतिम चक्र के प्रत्येक खंड को जाँचें")
    .replace(/((?:[2-9]|\d{2,})) घंटे में/g, "$1 घंटों में")
    .replace(/((?:[2-9]|\d{2,})) घंटे तक/g, "$1 घंटों तक")
    .replace(/पूरी तरह भरी होने तक/g, "पूरी तरह भरने तक")
    .replace(/पाइपें एक साथ चलते हैं/g, "पाइपें एक साथ चलती हैं")
    .replace(/पाइपें चलती है/g, "पाइपें चलती हैं");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/Complete cycles before the terminal cycle/g, "ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਚੱਕਰ")
    .replace(/_\{cycle\}/g, "_{ਚੱਕਰ}")
    .replace(/_\{target\}/g, "_{ਟੀਚਾ}")
    .replace(/_\{threshold\}/g, "_{ਸੀਮਾ}")
    .replace(/_\{after\\ switch\}/g, "_{ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ}")
    .replace(/_\{off\}/g, "_{ਬੰਦ}")
    .replace(/_\{on\}/g, "_{ਚਾਲੂ}")
    .replace(/_\{old\}/g, "_{ਪੁਰਾਣਾ}")
    .replace(/\\text\{tank\/hour\}/g, "\\text{ਟੈਂਕੀ/ਘੰਟਾ}")
    .replace(/\\text\{tank\/(?:ਘੰਟਾ|ਘੰਟੇ)\}/g, "\\text{ਟੈਂਕੀ/ਘੰਟਾ}")
    .replace(/\\text\{(?:hours|ਘੰਟੇ) earlier\}/g, "\\text{ਘੰਟੇ ਪਹਿਲਾਂ}")
    .replace(/\\text\{(?:hours|ਘੰਟੇ) later\}/g, "\\text{ਘੰਟੇ ਬਾਅਦ}")
    .replace(/\\text\{hours\}/g, "\\text{ਘੰਟੇ}")
    .replace(/\\text\{litres\}/g, "\\text{ਲੀਟਰ}")
    .replace(/\\text\{Stage (\d+): \}/g, "\\text{ਪੜਾਅ $1: }")
    .replace(/drainage still required at its start/g, "ਖੰਡ ਦੇ ਸ਼ੁਰੂ ਉੱਤੇ ਬਾਕੀ ਨਿਕਾਸੀ")
    .replace(/level still required at its start/g, "ਖੰਡ ਦੇ ਸ਼ੁਰੂ ਉੱਤੇ ਬਾਕੀ ਪੱਧਰ")
    .replace(/completion occurs exactly at the end of /g, "ਪੂਰਨਤਾ ਠੀਕ ਇਸ ਦੇ ਅੰਤ ਉੱਤੇ ਹੁੰਦੀ ਹੈ: ")
    .replace(/terminal segment is /g, "ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ: ")
    .replace(/Process full cycles, then test each terminal segment/g, "ਪੂਰੇ ਚੱਕਰ ਲਓ, ਫਿਰ ਅੰਤਿਮ ਚੱਕਰ ਦੇ ਹਰ ਖੰਡ ਨੂੰ ਜਾਂਚੋ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਲਈ/g, "$1 ਘੰਟਿਆਂ ਲਈ")
    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ ਹੋਣ ਤੱਕ/g, "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਤੱਕ")
    .replace(/ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ/g, "ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਚੱਲਦੀਆਂ ਹਨ")
    .replace(/ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/g, "ਪਾਈਪਾਂ ਚੱਲਦੀਆਂ ਹਨ");
}

export function polishTmwCp010Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const labeled = localizeScheduleLabels(text, language);
  const normalized = normalizeMixedFractions(labeled);
  return language === "hi" ? polishHindi(normalized) : polishPunjabi(normalized);
}
