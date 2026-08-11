import type { BlrCp003FinalApprovedRecord } from "../cp003-final-approved-bank";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizedBlrCp003SharedPromptFinal } from "./cp003-passage-grammar-v2";

const residualAsciiWord = /\b[A-Za-z]{2,}\b/;

function protectNames(
  record: BlrCp003FinalApprovedRecord,
  text: string,
): { protectedText: string; restore: (value: string) => string } {
  const entries = [...record.proceduralLogic.nodes]
    .filter((node) => node.label)
    .sort((a, b) => b.label.length - a.label.length)
    .map((node) => ({ token: `⟦${node.id}⟧`, label: node.label }));
  let protectedText = text;
  for (const { token, label } of entries) protectedText = protectedText.split(label).join(token);
  return {
    protectedText,
    restore(value: string): string {
      let restored = value;
      for (const { token, label } of entries) restored = restored.split(token).join(label);
      return restored;
    },
  };
}

function lastHindi(text: string): string {
  return text
    .replace(/^(.+), another son of (.+) and (.+), is unmarried\.$/, "$1, $2 और $3 का एक अन्य पुत्र है और अविवाहित है।")
    .replace(/^(.+) is the only son of (.+), who is (.+)'s daughter-in-law\.$/, "$1, $2 का इकलौता पुत्र है; $2, $3 की बहू है।")
    .replace(/^(.+) and (.+) are married and have one daughter, (.+)\.$/, "$1 और $2 विवाहित हैं और उनकी एक पुत्री $3 है।")
    .replace(/^(.+) and (.+) are married and have three children\.$/, "$1 और $2 विवाहित हैं और उनकी तीन संतानें हैं।")
    .replace(/^(.+) is married to (.+), and (.+) is married to (.+)\.$/, "$1 का विवाह $2 से हुआ है और $3 का विवाह $4 से हुआ है।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+)\.$/, "$1 का विवाह $2 से हुआ है, जबकि $3 का विवाह $4 से हुआ है।")
    .replace(/^(.+) is married to (.+), (.+) to (.+), and (.+) to (.+)\.$/, "$1 का विवाह $2 से, $3 का $4 से और $5 का $6 से हुआ है।")
    .replace(/^(.+) is married to (.+) and has (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी संतान $3 है।")
    .replace(/^(.+) is married to (.+) and has daughter (.+); (.+) is married to (.+) and has son (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी पुत्री $3 है; $4 का विवाह $5 से हुआ है और उनका पुत्र $6 है।")
    .replace(/^(.+) is married to (.+), and their daughter is (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी पुत्री $3 है।")
    .replace(/^(.+) is married to (.+) and their daughter is (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी पुत्री $3 है।")
    .replace(/^(.+) is married to (.+) and their son is (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनका पुत्र $3 है।")
    .replace(/^(.+) is married to (.+); their daughter is (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी पुत्री $3 है।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+), (.+) and (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी संतानें $3, $4, $5 और $6 हैं।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+) and (.+)\.$/, "$1 का विवाह $2 से हुआ है; उनकी संतानें $3, $4 और $5 हैं।")
    .replace(/^(.+) is not (.+)'s son; he is the son of (.+) and (.+)\.$/, "$1, $2 का पुत्र नहीं है; वह $3 और $4 का पुत्र है।")
    .replace(/^(.+) is not the child of (.+) or (.+); he is the son of (.+) and (.+)\.$/, "$1, $2 या $3 की संतान नहीं है; वह $4 और $5 का पुत्र है।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 न $2 का भाई-बहन है और न $3 की संतान; वह $4 और $5 का पुत्र है।")
    .replace(/^(.+) is not the child of (.+), and (.+) is not the child of (.+)\.$/, "$1, $2 की संतान नहीं है और $3, $4 की संतान नहीं है।")
    .replace(/^(.+)'s mother (.+) is not a child of (.+) and (.+); she is (.+)'s sister\.$/, "$2, $1 की माता है और $3 तथा $4 की संतान नहीं है; वह $5 की बहन है।")
    .replace(/^Their son (.+) is married to (.+), and (.+) is their daughter\.$/, "उनका पुत्र $1, $2 से विवाहित है और $3 उनकी पुत्री है।")
    .replace(/^Their daughter (.+) is married to (.+) and has (.+) and (.+)\.$/, "उनकी पुत्री $1 का विवाह $2 से हुआ है और उनकी संतानें $3 और $4 हैं।")
    .replace(/^(.+) and (.+) are their parents and are married\.$/, "$1 और $2 उनके माता-पिता हैं और विवाहित हैं।")
    .replace(/^(.+) is married to (.+) and they have (.+); (.+) is married to (.+) and has (.+), while (.+) is married to (.+) and has (.+)\.$/, "$1 का विवाह $2 से हुआ है और उनकी संतान $3 है; $4 का विवाह $5 से हुआ है और उनकी संतान $6 है, जबकि $7 का विवाह $8 से हुआ है और उनकी संतान $9 है।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+) and (.+) to (.+)\.$/, "$1 का विवाह $2 से हुआ है, जबकि $3 का विवाह $4 से और $5 का विवाह $6 से हुआ है।")
    .replace(/^(.+) is the son of (.+) and (.+), and (.+) is his sister; their cousin (.+) has no sibling\.$/, "$1, $2 और $3 का पुत्र है और $4 उसकी बहन है; उनकी कज़िन $5 का कोई भाई-बहन नहीं है।")
    .replace(/^(.+) is the son of (.+) and (.+); (.+) is the daughter of (.+) and (.+)\.$/, "$1, $2 और $3 का पुत्र है; $4, $5 और $6 की पुत्री है।")
    .replace(/^(.+), mother of (.+), is the only child of (.+) and (.+)\.$/, "$1, $2 की माता है और $3 तथा $4 की इकलौती संतान है।")
    .replace(/^(.+), the only brother of (.+)'s mother, is unmarried\.$/, "$1, $2 की माता का इकलौता भाई है और अविवाहित है।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 और $3 की बहन है और अविवाहित है।")
    .replace(/^(.+), the other sister of (.+), is unmarried\.$/, "$1, $2 की दूसरी बहन है और अविवाहित है।")
    .replace(/^(.+)'s brother (.+) is unmarried, while (.+) is married to (.+)\.$/, "$2, $1 का भाई है और अविवाहित है, जबकि $3 का विवाह $4 से हुआ है।")
    .replace(/^(.+)'s mother (.+) is (.+)'s daughter-in-law, and (.+)'s only brother (.+) is unmarried\.$/, "$2, $1 की माता और $3 की बहू है; $5, $4 का इकलौता भाई है और अविवाहित है।")
    .replace(/^(.+)'s mother (.+) is the only daughter of (.+) and (.+)\.$/, "$2, $1 की माता है और $3 तथा $4 की इकलौती पुत्री है।")
    .replace(/^(.+)'s mother (.+) is the daughter of (.+) and (.+)\.$/, "$2, $1 की माता है और $3 तथा $4 की पुत्री है।")
    .replace(/^Their parents (.+) and (.+) are married\.$/, "उनके माता-पिता $1 और $2 विवाहित हैं।")
    .replace(/^Their son (.+) is married to (.+) and has only (.+)\.$/, "उनका पुत्र $1, $2 से विवाहित है और उनकी केवल एक संतान $3 है।")
    .replace(/^(.+) is (.+)'s daughter, and (.+) is unmarried\.$/, "$1, $2 की पुत्री है और $3 अविवाहित है।")
    .replace(/^(.+) is (.+)'s father, whereas (.+) is unmarried\.$/, "$1, $2 के पिता हैं, जबकि $3 अविवाहित है।")
    .replace(/^(.+) is (.+)'s husband\.$/, "$1, $2 का पति है।")
    .replace(/^(.+) and (.+) are parents of (.+) and (.+); (.+) and (.+) are parents of (.+) and (.+)\.$/, "$1 और $2, $3 और $4 के माता-पिता हैं; $5 और $6, $7 और $8 के माता-पिता हैं।")
    .replace(/^(.+), (.+) and (.+) belong respectively to the three branches of (.+), (.+) and (.+)\.$/, "$1, $2 और $3 क्रमशः $4, $5 और $6 की तीन शाखाओं से संबंधित हैं।");
}

function lastPunjabi(text: string): string {
  return text
    .replace(/^(.+), another son of (.+) and (.+), is unmarried\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਇੱਕ ਹੋਰ ਪੁੱਤਰ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is the only son of (.+), who is (.+)'s daughter-in-law\.$/, "$1, $2 ਦਾ ਇਕੱਲਾ ਪੁੱਤਰ ਹੈ; $2, $3 ਦੀ ਨੂੰਹ ਹੈ।")
    .replace(/^(.+) and (.+) are married and have one daughter, (.+)\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਇੱਕ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) and (.+) are married and have three children\.$/, "$1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਤਿੰਨ ਸੰਤਾਨਾਂ ਹਨ।")
    .replace(/^(.+) is married to (.+), and (.+) is married to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ, ਜਦਕਿ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is married to (.+), (.+) to (.+), and (.+) to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ, $3 ਦਾ $4 ਨਾਲ ਅਤੇ $5 ਦਾ $6 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is married to (.+) and has (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+) and has daughter (.+); (.+) is married to (.+) and has son (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਧੀ $3 ਹੈ; $4 ਦਾ ਵਿਆਹ $5 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਪੁੱਤਰ $6 ਹੈ।")
    .replace(/^(.+) is married to (.+), and their daughter is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+) and their daughter is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+) and their son is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਪੁੱਤਰ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+); their daughter is (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀ ਧੀ $3 ਹੈ।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+), (.+) and (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3, $4, $5 ਅਤੇ $6 ਹਨ।")
    .replace(/^(.+) is married to (.+); their children are (.+), (.+) and (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3, $4 ਅਤੇ $5 ਹਨ।")
    .replace(/^(.+) is not (.+)'s son; he is the son of (.+) and (.+)\.$/, "$1, $2 ਦਾ ਪੁੱਤਰ ਨਹੀਂ ਹੈ; ਉਹ $3 ਅਤੇ $4 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is not the child of (.+) or (.+); he is the son of (.+) and (.+)\.$/, "$1, $2 ਜਾਂ $3 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ; ਉਹ $4 ਅਤੇ $5 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is neither (.+)'s sibling nor (.+)'s child; he is the son of (.+) and (.+)\.$/, "$1 ਨਾ $2 ਦਾ ਭਰਾ-ਭੈਣ ਹੈ ਅਤੇ ਨਾ $3 ਦੀ ਸੰਤਾਨ; ਉਹ $4 ਅਤੇ $5 ਦਾ ਪੁੱਤਰ ਹੈ।")
    .replace(/^(.+) is not the child of (.+), and (.+) is not the child of (.+)\.$/, "$1, $2 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ ਅਤੇ $3, $4 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is not a child of (.+) and (.+); she is (.+)'s sister\.$/, "$2, $1 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ $3 ਅਤੇ $4 ਦੀ ਸੰਤਾਨ ਨਹੀਂ ਹੈ; ਉਹ $5 ਦੀ ਭੈਣ ਹੈ।")
    .replace(/^Their son (.+) is married to (.+), and (.+) is their daughter\.$/, "ਉਨ੍ਹਾਂ ਦਾ ਪੁੱਤਰ $1, $2 ਨਾਲ ਵਿਆਹਿਆ ਹੋਇਆ ਹੈ ਅਤੇ $3 ਉਨ੍ਹਾਂ ਦੀ ਧੀ ਹੈ।")
    .replace(/^Their daughter (.+) is married to (.+) and has (.+) and (.+)\.$/, "ਉਨ੍ਹਾਂ ਦੀ ਧੀ $1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਤਾਨਾਂ $3 ਅਤੇ $4 ਹਨ।")
    .replace(/^(.+) and (.+) are their parents and are married\.$/, "$1 ਅਤੇ $2 ਉਨ੍ਹਾਂ ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ ਅਤੇ ਵਿਆਹੇ ਹੋਏ ਹਨ।")
    .replace(/^(.+) is married to (.+) and they have (.+); (.+) is married to (.+) and has (.+), while (.+) is married to (.+) and has (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $3 ਹੈ; $4 ਦਾ ਵਿਆਹ $5 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $6 ਹੈ, ਜਦਕਿ $7 ਦਾ ਵਿਆਹ $8 ਨਾਲ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਤਾਨ $9 ਹੈ।")
    .replace(/^(.+) is married to (.+), while (.+) is married to (.+) and (.+) to (.+)\.$/, "$1 ਦਾ ਵਿਆਹ $2 ਨਾਲ ਹੋਇਆ ਹੈ, ਜਦਕਿ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਅਤੇ $5 ਦਾ ਵਿਆਹ $6 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+) is the son of (.+) and (.+), and (.+) is his sister; their cousin (.+) has no sibling\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਪੁੱਤਰ ਹੈ ਅਤੇ $4 ਉਸ ਦੀ ਭੈਣ ਹੈ; ਉਨ੍ਹਾਂ ਦੀ ਕਜ਼ਨ $5 ਦਾ ਕੋਈ ਭਰਾ-ਭੈਣ ਨਹੀਂ ਹੈ।")
    .replace(/^(.+) is the son of (.+) and (.+); (.+) is the daughter of (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਦਾ ਪੁੱਤਰ ਹੈ; $4, $5 ਅਤੇ $6 ਦੀ ਧੀ ਹੈ।")
    .replace(/^(.+), mother of (.+), is the only child of (.+) and (.+)\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ $3 ਅਤੇ $4 ਦੀ ਇਕੱਲੀ ਸੰਤਾਨ ਹੈ।")
    .replace(/^(.+), the only brother of (.+)'s mother, is unmarried\.$/, "$1, $2 ਦੀ ਮਾਤਾ ਦਾ ਇਕੱਲਾ ਭਰਾ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), sister of (.+) and (.+), is unmarried\.$/, "$1, $2 ਅਤੇ $3 ਦੀ ਭੈਣ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+), the other sister of (.+), is unmarried\.$/, "$1, $2 ਦੀ ਦੂਜੀ ਭੈਣ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+)'s brother (.+) is unmarried, while (.+) is married to (.+)\.$/, "$2, $1 ਦਾ ਭਰਾ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ, ਜਦਕਿ $3 ਦਾ ਵਿਆਹ $4 ਨਾਲ ਹੋਇਆ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is (.+)'s daughter-in-law, and (.+)'s only brother (.+) is unmarried\.$/, "$2, $1 ਦੀ ਮਾਤਾ ਅਤੇ $3 ਦੀ ਨੂੰਹ ਹੈ; $5, $4 ਦਾ ਇਕੱਲਾ ਭਰਾ ਹੈ ਅਤੇ ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is the only daughter of (.+) and (.+)\.$/, "$2, $1 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ $3 ਅਤੇ $4 ਦੀ ਇਕੱਲੀ ਧੀ ਹੈ।")
    .replace(/^(.+)'s mother (.+) is the daughter of (.+) and (.+)\.$/, "$2, $1 ਦੀ ਮਾਤਾ ਹੈ ਅਤੇ $3 ਅਤੇ $4 ਦੀ ਧੀ ਹੈ।")
    .replace(/^Their parents (.+) and (.+) are married\.$/, "ਉਨ੍ਹਾਂ ਦੇ ਮਾਤਾ-ਪਿਤਾ $1 ਅਤੇ $2 ਵਿਆਹੇ ਹੋਏ ਹਨ।")
    .replace(/^Their son (.+) is married to (.+) and has only (.+)\.$/, "ਉਨ੍ਹਾਂ ਦਾ ਪੁੱਤਰ $1, $2 ਨਾਲ ਵਿਆਹਿਆ ਹੋਇਆ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕੇਵਲ ਇੱਕ ਸੰਤਾਨ $3 ਹੈ।")
    .replace(/^(.+) is (.+)'s daughter, and (.+) is unmarried\.$/, "$1, $2 ਦੀ ਧੀ ਹੈ ਅਤੇ $3 ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is (.+)'s father, whereas (.+) is unmarried\.$/, "$1, $2 ਦੇ ਪਿਤਾ ਹਨ, ਜਦਕਿ $3 ਅਵਿਵਾਹਿਤ ਹੈ।")
    .replace(/^(.+) is (.+)'s husband\.$/, "$1, $2 ਦਾ ਪਤੀ ਹੈ।")
    .replace(/^(.+) and (.+) are parents of (.+) and (.+); (.+) and (.+) are parents of (.+) and (.+)\.$/, "$1 ਅਤੇ $2, $3 ਅਤੇ $4 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ; $5 ਅਤੇ $6, $7 ਅਤੇ $8 ਦੇ ਮਾਤਾ-ਪਿਤਾ ਹਨ।")
    .replace(/^(.+), (.+) and (.+) belong respectively to the three branches of (.+), (.+) and (.+)\.$/, "$1, $2 ਅਤੇ $3 ਕ੍ਰਮਵਾਰ $4, $5 ਅਤੇ $6 ਦੀਆਂ ਤਿੰਨ ਸ਼ਾਖਾਵਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।");
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function localizeLastSentence(
  record: BlrCp003FinalApprovedRecord,
  sentence: string,
  locale: BlrCp003TranslatedLocale,
): string {
  try {
    const translated = localizedBlrCp003SharedPromptFinal({ ...record, sharedPrompt: sentence }, locale);
    const protectedTranslated = protectNames(record, translated).protectedText;
    if (!residualAsciiWord.test(protectedTranslated)) return translated;
  } catch {
    // Exact V3 fallback below handles sentences not covered by earlier grammar waves.
  }

  const { protectedText, restore } = protectNames(record, sentence);
  const translated = locale === "hi-IN" ? lastHindi(protectedText) : lastPunjabi(protectedText);
  if (translated === protectedText || residualAsciiWord.test(translated)) {
    throw new Error(`Untranslated CP-003 ${locale} passage sentence: ${sentence}`);
  }
  return restore(translated);
}

export function localizedBlrCp003SharedPromptCompleteV3(
  record: BlrCp003FinalApprovedRecord,
  locale: BlrCp003TranslatedLocale,
): string {
  return splitSentences(record.sharedPrompt)
    .map((sentence) => localizeLastSentence(record, sentence, locale))
    .join(" ");
}
