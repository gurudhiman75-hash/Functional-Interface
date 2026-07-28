import { asR, directionPa, namePa, pathsBlockPa, relationSentencePa, startsDescriptionPa, type R } from "./punjabi-foundation";

export function renderPunjabiStem011To022(english: R): string | null {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  switch (qlId) {
    case "DIR-QL-011":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ${namePa(s.query.subject)}, ${namePa(s.query.reference)} ਦੇ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-012":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ${namePa(s.query.subject)}, ${namePa(s.query.reference)} ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    case "DIR-QL-013":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ${namePa(s.query.reference)} ਦੇ ${directionPa(s.query.direction)} ਵੱਲ ਕੌਣ ਹੈ?`;
    case "DIR-QL-014":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਕਿਹੜੇ ਤਿੰਨ ਵਿਅਕਤੀ ਇੱਕੋ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹਨ?`;
    case "DIR-QL-015":
      return `${(s.relations ?? []).map((r: R) => relationSentencePa(r)).join(" ")} ਕਿਹੜੀ ਜੋੜੀ ਇੱਕੋ ਥਾਂ ਖੜ੍ਹੀ ਹੈ?`;
    case "DIR-QL-016":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ${namePa(s.query.subject)} ਦੀ ਅੰਤਿਮ ਥਾਂ, ${namePa(s.query.reference)} ਦੀ ਅੰਤਿਮ ਥਾਂ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
    case "DIR-QL-017":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ${namePa(s.query.left)} ਅਤੇ ${namePa(s.query.right)} ਦੀਆਂ ਅੰਤਿਮ ਥਾਵਾਂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`;
    case "DIR-QL-018":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ${namePa(s.query.subject)} ਦੀ ਅੰਤਿਮ ਥਾਂ, ${namePa(s.query.reference)} ਦੀ ਅੰਤਿਮ ਥਾਂ ਤੋਂ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਅਤੇ ਕਿੰਨੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਉੱਤੇ ਹੈ?`;
    case "DIR-QL-019":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ${namePa(s.query.reference)} ਦੀ ਅੰਤਿਮ ਥਾਂ ਦੇ ${directionPa(s.query.direction)} ਵੱਲ ਕਿਸ ਦੀ ਅੰਤਿਮ ਥਾਂ ਹੈ?`;
    case "DIR-QL-020":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ${directionPa(s.query.extremumDirection)} ਵੱਲ ਸਭ ਤੋਂ ਦੂਰ ਕਿਸ ਦੀ ਅੰਤਿਮ ਥਾਂ ਹੈ?`;
    case "DIR-QL-021":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ਬਿੰਦੂ ${s.query.referencePoint} ਤੋਂ ${s.query.comparison === "NEAREST" ? "ਸਭ ਤੋਂ ਨੇੜੇ" : "ਸਭ ਤੋਂ ਦੂਰ"} ਕਿਸ ਦੀ ਅੰਤਿਮ ਥਾਂ ਹੈ?`;
    case "DIR-QL-022":
      return `${startsDescriptionPa(s.paths ?? [])} ${pathsBlockPa(s.paths ?? [])} ਕਿਹੜੀ ਜੋੜੀ ਇੱਕੋ ਅੰਤਿਮ ਥਾਂ ਉੱਤੇ ਪਹੁੰਚਦੀ ਹੈ?`;
    default: return null;
  }
}
