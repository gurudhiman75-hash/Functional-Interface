import { applyMal001QuestionStudioLocalizationV6 } from "./chapter-multilingual-question-studio-v6";
import type { Mal001LocalizedLanguage as Lang } from "./chapter-multilingual-question-studio-v1";

// Protect syntax, while allowing prose inside \text{...} to be localized.
function mapStrings(value: any, fn: (s: string) => string): any {
  if (typeof value === "string") return fn(value);
  if (Array.isArray(value)) return value.map((x) => mapStrings(x, fn));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)]),
    );
  return value;
}
function learnerFields(q: any, fn: (s: string) => string) {
  return {
    ...q,
    stem: fn(q.stem),
    answer: fn(q.answer),
    options: q.options.map(fn),
    explanation: mapStrings(q.explanation, fn),
    reasoningGraph: q.reasoningGraph
      ? {
          ...q.reasoningGraph,
          nodes: q.reasoningGraph.nodes?.map((n: any) => ({
            ...n,
            text: typeof n.text === "string" ? fn(n.text) : n.text,
          })),
        }
      : q.reasoningGraph,
  };
}
type Rule = { ql: number; pattern: RegExp; hi: string; pa: string };
// Captured quantities/materials are copied, never inferred from the answer.
const rules: Rule[] = [
  {
    ql: 14,
    pattern:
      /^A (?:mixture|vessel) contains (.+?) of (.+?) and (.+?) of (.+?)\. If (.+?) of (.+?) is added to it, what is the new ratio of (.+?) to (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। इसमें $5 $6 जोड़ने पर $7 : $8 का नया अनुपात क्या होगा?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। ਇਸ ਵਿੱਚ $5 $6 ਜੋੜਨ ਉੱਤੇ $7 : $8 ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 15,
    pattern:
      /^A (?:mixture|vessel) contains (.+?) of (.+?) and (.+?) of (.+?)\. If (.+?) of (.+?) is removed from it, what is the new ratio of (.+?) to (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। इसमें से $5 $6 निकालने पर $7 : $8 का नया अनुपात क्या होगा?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। ਇਸ ਵਿੱਚੋਂ $5 $6 ਕੱਢਣ ਉੱਤੇ $7 : $8 ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 16,
    pattern:
      /^After adding (.+?) of (.+?), a mixture contains (.+?) of (.+?) and (.+?) of (.+?)\. What was the original ratio of (.+?) to (.+?)\?$/,
    hi: "$1 $2 जोड़ने के बाद मिश्रण में $3 $4 और $5 $6 है। $7 : $8 का मूल अनुपात क्या था?",
    pa: "$1 $2 ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਮਿਸ਼ਰਣ ਵਿੱਚ $3 $4 ਅਤੇ $5 $6 ਹੈ। $7 : $8 ਦਾ ਮੂਲ ਅਨੁਪਾਤ ਕੀ ਸੀ?",
  },
  {
    ql: 18,
    pattern:
      /^A mixture has a total quantity of (.+?)\. It contains (.+?) and (.+?) in the ratio (.+?)\. What are their quantities in the same order\?$/,
    hi: "$1 मिश्रण में $2 और $3 का अनुपात $4 है। इसी क्रम में दोनों की मात्राएँ कितनी हैं?",
    pa: "$1 ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਅਤੇ $3 ਦਾ ਅਨੁਪਾਤ $4 ਹੈ। ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕਿੰਨੀਆਂ ਹਨ?",
  },
  {
    ql: 22,
    pattern:
      /^In a mixture, the ratio of (.+?) to (.+?) is (.+?)\. The mixture contains (.+?) of (.+?)\. How much (.+?) does it contain\?$/,
    hi: "एक मिश्रण में $1 : $2 = $3 है। यदि इसमें $4 $5 है, तो $6 की मात्रा कितनी है?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 : $2 = $3 ਹੈ। ਜੇ ਇਸ ਵਿੱਚ $4 $5 ਹੈ, ਤਾਂ $6 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?",
  },
  {
    ql: 23,
    pattern:
      /^A mixture had (.+?) and (.+?) in the ratio (.+?)\. When (.+?) of (.+?) was added, the ratio became (.+?)\. What was the mixture's original quantity\?$/,
    hi: "एक मिश्रण में $1 और $2 का अनुपात $3 था। $4 $5 जोड़ने पर अनुपात $6 हो गया। मिश्रण की मूल कुल मात्रा कितनी थी?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 ਅਤੇ $2 ਦਾ ਅਨੁਪਾਤ $3 ਸੀ। $4 $5 ਜੋੜਨ ਉੱਤੇ ਅਨੁਪਾਤ $6 ਹੋ ਗਿਆ। ਮਿਸ਼ਰਣ ਦੀ ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 29,
    pattern:
      /^A (?:container|tank|vessel) initially contains (.+?) of (.+?)\. In each operation, (.+?) are removed from the well-mixed contents and replaced with (.+?)\. After (.+?) operations, how much (.+?) is present\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार अच्छी तरह मिले मिश्रण में से $3 निकालकर उतना ही $4 भरा जाता है। $5 क्रियाओं के बाद $6 की मात्रा कितनी होगी?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ $3 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $5 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ $6 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੋਵੇਗੀ?",
  },
  {
    ql: 30,
    pattern:
      /^A (?:container|vessel|tank) has a fixed volume of (.+?)\. Each time, (.+?) of the well-mixed liquid are removed and replaced with (.+?)\. After (.+?) operations, (.+?) of the original (.+?) remains\. How much (.+?) was present initially\?$/,
    hi: "एक पात्र का निश्चित आयतन $1 है। हर बार अच्छी तरह मिले द्रव में से $2 निकालकर उतना ही $3 भरा जाता है। $4 क्रियाओं के बाद मूल $6 की $5 मात्रा बचती है। शुरू में $7 की मात्रा कितनी थी?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਦਾ ਨਿਰਧਾਰਤ ਆਇਤਨ $1 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $2 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $3 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $4 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ $6 ਦੀ $5 ਮਾਤਰਾ ਬਚਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ $7 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 31,
    pattern:
      /^A (?:container|vessel|tank) initially contains (.+?) of (.+?)\. The same quantity is drawn out and replaced with (.+?) in each of (.+?) operations\. After the last operation, (.+?) of the original (.+?) remains\. How many litres are drawn out in each operation\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार समान मात्रा निकालकर उतना ही $3 भरा जाता है। $4 क्रियाओं के बाद मूल $6 की $5 मात्रा बचती है। हर बार कितने लीटर निकाले गए?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਇੱਕੋ ਮਾਤਰਾ ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $3 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $4 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ $6 ਦੀ $5 ਮਾਤਰਾ ਬਚਦੀ ਹੈ। ਹਰ ਵਾਰ ਕਿੰਨੇ ਲੀਟਰ ਕੱਢੇ ਗਏ?",
  },
  {
    ql: 32,
    pattern:
      /^A (?:container|vessel|tank) contains (.+?) of (.+?) in a total volume of (.+?)\. In each operation, (.+?) of the well-mixed liquid are replaced with (.+?)\. How many operations are needed for the original (.+?) to become (.+?)\?$/,
    hi: "$3 कुल आयतन वाले पात्र में $1 $2 है। हर बार अच्छी तरह मिले द्रव में से $4 निकालकर उतना ही $5 भरा जाता है। मूल $6 की मात्रा $7 होने तक कितनी क्रियाएँ करनी होंगी?",
    pa: "$3 ਕੁੱਲ ਆਇਤਨ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ $4 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $5 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਮੂਲ $6 ਦੀ ਮਾਤਰਾ $7 ਹੋਣ ਤੱਕ ਕਿੰਨੀਆਂ ਕਿਰਿਆਵਾਂ ਕਰਨੀਆਂ ਪੈਣਗੀਆਂ?",
  },
  {
    ql: 35,
    pattern:
      /^During an equal-replacement process, a (?:tank|vessel|container) initially contains (.+?) of (.+?)\. Each time, (.+?) are drawn out and replaced with (.+?)\. After (.+?) replacements, what is the final ratio of (.+?)\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार $3 मिश्रण निकालकर उतना ही $4 भरा जाता है। $5 प्रतिस्थापनों के बाद $6 का अंतिम अनुपात क्या होगा?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ $3 ਮਿਸ਼ਰਣ ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $5 ਬਦਲੀਆਂ ਤੋਂ ਬਾਅਦ $6 ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 36,
    pattern:
      /^(?:A .+? records this repeated operation: )?a (?:drum|vessel|container|tank) is initially full of (.+?)\. Each time, (.+?) are drawn out and replaced with (.+?)\. After (.+?) such operations, the ratio of (.+?) to (.+?) is (.+?)\. What is the capacity of the (?:drum|vessel|container|tank)\?$/i,
    hi: "एक पात्र शुरू में $1 से पूरा भरा है। हर बार $2 निकालकर उतना ही $3 भरा जाता है। $4 क्रियाओं के बाद $5 : $6 = $7 है। पात्र की क्षमता कितनी है?",
    pa: "ਇੱਕ ਭਾਂਡਾ ਸ਼ੁਰੂ ਵਿੱਚ $1 ਨਾਲ ਪੂਰਾ ਭਰਿਆ ਹੈ। ਹਰ ਵਾਰ $2 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $3 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $4 ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ $5 : $6 = $7 ਹੈ। ਭਾਂਡੇ ਦੀ ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੈ?",
  },
  {
    ql: 37,
    pattern:
      /^A (?:tank|vessel|container) initially contains (.+?) of (.+?)\. In each operation, (.+?) are drawn out and replaced with (.+?)\. What is the minimum number of operations after which less than half of the mixture is the original (.+?)\?$/,
    hi: "एक पात्र में शुरू में $1 $2 है। हर बार $3 निकालकर उतना ही $4 भरा जाता है। कम-से-कम कितनी क्रियाओं के बाद मूल $5 कुल मिश्रण के आधे से कम रह जाएगा?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ $1 $2 ਹੈ। ਹਰ ਵਾਰ $3 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $4 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀਆਂ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ $5 ਕੁੱਲ ਮਿਸ਼ਰਣ ਦੇ ਅੱਧੇ ਤੋਂ ਘੱਟ ਰਹਿ ਜਾਵੇਗਾ?",
  },
  {
    ql: 38,
    pattern:
      /^In (.+?) of (.+?), (.+?) forms (.+?) of the total and the rest is (.+?)\. What is the quantity of (.+?)\?$/,
    hi: "$1 $2 में $3 का हिस्सा $4 है और शेष $5 है। $6 की मात्रा कितनी है?",
    pa: "$1 $2 ਵਿੱਚ $3 ਦਾ ਹਿੱਸਾ $4 ਹੈ ਅਤੇ ਬਾਕੀ $5 ਹੈ। $6 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?",
  },
  {
    ql: 39,
    pattern:
      /^In a (.+?)-litre mixture, (.+?) are (.+?) and the rest is (.+?)\. What is the (.+?) concentration\?$/,
    hi: "$1 लीटर मिश्रण में $2 $3 और शेष $4 है। $5 का प्रतिशत कितना है?",
    pa: "$1 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $2 $3 ਅਤੇ ਬਾਕੀ $4 ਹੈ। $5 ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?",
  },
  {
    ql: 40,
    pattern:
      /^A container contains a (.+?) (.+?) solution\. If it contains (.+?) of (.+?), what is the total quantity of the solution\?$/,
    hi: "एक पात्र में $1 $2 का घोल है। यदि इसमें $3 $4 है, तो घोल की कुल मात्रा कितनी है?",
    pa: "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ $1 $2 ਦਾ ਘੋਲ ਹੈ। ਜੇ ਇਸ ਵਿੱਚ $3 $4 ਹੈ, ਤਾਂ ਘੋਲ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?",
  },
  {
    ql: 41,
    pattern:
      /^(.+?) of solution contain (.+?) (.+?) and the rest is (.+?)\. How much (.+?) should be added so that (.+?) becomes (.+?) of the solution\?$/,
    hi: "$1 घोल में $2 $3 और शेष $4 है। $6 का हिस्सा $7 करने के लिए कितना $5 मिलाना चाहिए?",
    pa: "$1 ਘੋਲ ਵਿੱਚ $2 $3 ਅਤੇ ਬਾਕੀ $4 ਹੈ। $6 ਦਾ ਹਿੱਸਾ $7 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 42,
    pattern:
      /^A vessel holds a (.+?)-litre mixture of (.+?) and (.+?), with (.+?) at (.+?)\. How much pure (.+?) should be added to obtain a (.+?) solution\?$/,
    hi: "$1 लीटर मिश्रण में $2 और $3 हैं तथा $4 का हिस्सा $5 है। $7 सांद्रता प्राप्त करने के लिए कितना शुद्ध $6 मिलाना चाहिए?",
    pa: "$1 ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਅਤੇ $3 ਹਨ ਅਤੇ $4 ਦਾ ਹਿੱਸਾ $5 ਹੈ। $7 ਸੰਘਣਾਪਣ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕਿੰਨਾ ਸ਼ੁੱਧ $6 ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 43,
    pattern:
      /^The (.+?) concentration in a container rises from (.+?) to (.+?) because only (.+?) evaporates\. The initial volume is (.+?)\. What will be the final volume of the solution\?$/,
    hi: "केवल $4 के वाष्पीकरण से $1 की सांद्रता $2 से $3 हो जाती है। प्रारंभिक आयतन $5 है। घोल का अंतिम आयतन कितना होगा?",
    pa: "ਕੇਵਲ $4 ਦੇ ਬਾਫ਼ ਬਣਨ ਨਾਲ $1 ਦਾ ਸੰਘਣਾਪਣ $2 ਤੋਂ $3 ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ $5 ਹੈ। ਘੋਲ ਦਾ ਅੰਤਿਮ ਆਇਤਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
  },
  {
    ql: 44,
    pattern:
      /^A (.+?)-litre solution is (.+?) (.+?)\. (.+?) of (.+?) evaporate\. What percent (.+?) remains in the final solution\?$/,
    hi: "$1 लीटर घोल में $3 का हिस्सा $2 है। इसमें से $4 $5 वाष्पित हो जाता है। अंतिम घोल में $6 कितने प्रतिशत है?",
    pa: "$1 ਲੀਟਰ ਘੋਲ ਵਿੱਚ $3 ਦਾ ਹਿੱਸਾ $2 ਹੈ। ਇਸ ਵਿੱਚੋਂ $4 $5 ਬਾਫ਼ ਬਣ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਘੋਲ ਵਿੱਚ $6 ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?",
  },
  {
    ql: 45,
    pattern:
      /^During a .+? concentration (?:test|check), the amount of (.+?) stays unchanged while (.+?) of (.+?) evaporate\. If the concentration changes from (.+?) to (.+?), how much solution was present initially\?$/,
    hi: "$3 के $2 वाष्पित होने पर $1 की मात्रा समान रहती है और सांद्रता $4 से $5 हो जाती है। शुरू में घोल की मात्रा कितनी थी?",
    pa: "$3 ਦੇ $2 ਬਾਫ਼ ਬਣਨ ਉੱਤੇ $1 ਦੀ ਮਾਤਰਾ ਉਹੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਸੰਘਣਾਪਣ $4 ਤੋਂ $5 ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ਘੋਲ ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 46,
    pattern:
      /^An? (.+?) batch of (.+?) contains (.+?) moisture\. After drying, the moisture content is (.+?)\. What is the final mass of the (.+?)\?$/,
    hi: "$1 $2 में $3 नमी है। सुखाने पर नमी $4 रह जाती है। $5 का अंतिम भार कितना होगा?",
    pa: "$1 $2 ਵਿੱਚ $3 ਨਮੀ ਹੈ। ਸੁਕਾਉਣ ਉੱਤੇ ਨਮੀ $4 ਰਹਿ ਜਾਂਦੀ ਹੈ। $5 ਦਾ ਅੰਤਿਮ ਭਾਰ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
  },
  {
    ql: 47,
    pattern:
      /^After drying, a (.+?) batch of (.+?) contains (.+?) moisture\. The original (.+?) contained (.+?) moisture\. What was its initial mass\?$/,
    hi: "सुखाने के बाद $1 $2 में $3 नमी है। मूल $4 में $5 नमी थी। प्रारंभिक भार कितना था?",
    pa: "ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ $1 $2 ਵਿੱਚ $3 ਨਮੀ ਹੈ। ਮੂਲ $4 ਵਿੱਚ $5 ਨਮੀ ਸੀ। ਸ਼ੁਰੂਆਤੀ ਭਾਰ ਕਿੰਨਾ ਸੀ?",
  },
  {
    ql: 57,
    pattern:
      /^An? (.+?) mixes (.+?) of (.+?) costing (.+?) with (.+?) of (.+?) costing (.+?)\. The mixture is sold at (.+?)\. What is the profit percentage\?$/,
    hi: "$2 $3 को $4 और $5 $6 को $7 की दर से खरीदकर मिलाया जाता है। मिश्रण को $8 की दर से बेचने पर लाभ प्रतिशत कितना है?",
    pa: "$2 $3 ਨੂੰ $4 ਅਤੇ $5 $6 ਨੂੰ $7 ਦੀ ਦਰ ਨਾਲ ਖਰੀਦ ਕੇ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਮਿਸ਼ਰਣ ਨੂੰ $8 ਦੀ ਦਰ ਨਾਲ ਵੇਚਣ ਉੱਤੇ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?",
  },
  {
    ql: 60,
    pattern:
      /^A (.+?) purchases (.+?) of (.+?) at (.+?), mixes in free (.+?) equal to (.+?) of that quantity, and sells the mixture at a rate (.+?) above the cost price per unit\. What is the total profit\?$/,
    hi: "$2 $3 को $4 की दर से खरीदा जाता है। इसमें मूल मात्रा का $6 निःशुल्क $5 मिलाकर मिश्रण को प्रति इकाई क्रय मूल्य से $7 अधिक दर पर बेचा जाता है। कुल लाभ कितना होगा?",
    pa: "$2 $3 ਨੂੰ $4 ਦੀ ਦਰ ਨਾਲ ਖਰੀਦਿਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਵਿੱਚ ਮੂਲ ਮਾਤਰਾ ਦਾ $6 ਮੁਫ਼ਤ $5 ਮਿਲਾ ਕੇ ਮਿਸ਼ਰਣ ਨੂੰ ਪ੍ਰਤੀ ਇਕਾਈ ਖਰੀਦ ਮੁੱਲ ਤੋਂ $7 ਵੱਧ ਦਰ ਉੱਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੋਵੇਗਾ?",
  },
  {
    ql: 61,
    pattern:
      /^A and B each hold (.+?) of an? (.+?) solution, with (.+?) and (.+?) (.+?), respectively\. First, (.+?) of the mixture are transferred from B to A; then, after mixing, (.+?) of the mixture are transferred from A to B\. What is the final (.+?)-to-(.+?) ratio in B\?$/,
    hi: "A और B में प्रत्येक $1 $2 घोल है, जिनमें $5 क्रमशः $3 और $4 है। पहले B से A में $6 मिश्रण भेजा जाता है। A को मिलाने के बाद $7 मिश्रण वापस B में भेजा जाता है। अंत में B में $8 : $9 का अनुपात क्या है?",
    pa: "A ਅਤੇ B ਵਿੱਚ ਹਰੇਕ ਵਿੱਚ $1 $2 ਘੋਲ ਹੈ, ਜਿਨ੍ਹਾਂ ਵਿੱਚ $5 ਕ੍ਰਮਵਾਰ $3 ਅਤੇ $4 ਹੈ। ਪਹਿਲਾਂ B ਤੋਂ A ਵਿੱਚ $6 ਮਿਸ਼ਰਣ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। A ਨੂੰ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ $7 ਮਿਸ਼ਰਣ ਵਾਪਸ B ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ B ਵਿੱਚ $8 : $9 ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?",
  },
  {
    ql: 66,
    pattern:
      /^A contains only (.+?) and B contains only (.+?), (.+?) in each vessel\. A first moves (.+?) into B\. Once B is mixed uniformly, a different quantity is moved back\. The final ratio in A is (.+?)\. How many litres came back from B\?$/,
    hi: "A में केवल $1 और B में केवल $2 है; प्रत्येक में $3 है। A से B में $4 भेजा जाता है। B को मिलाने के बाद कुछ मिश्रण वापस A में भेजा जाता है, जिससे A में अंतिम अनुपात $5 होता है। वापस भेजी गई मात्रा कितने लीटर है?",
    pa: "A ਵਿੱਚ ਕੇਵਲ $1 ਅਤੇ B ਵਿੱਚ ਕੇਵਲ $2 ਹੈ; ਹਰੇਕ ਵਿੱਚ $3 ਹੈ। A ਤੋਂ B ਵਿੱਚ $4 ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। B ਨੂੰ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ਕੁਝ ਮਿਸ਼ਰਣ ਵਾਪਸ A ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ A ਵਿੱਚ ਅੰਤਿਮ ਅਨੁਪਾਤ $5 ਹੁੰਦਾ ਹੈ। ਵਾਪਸ ਭੇਜੀ ਮਾਤਰਾ ਕਿੰਨੇ ਲੀਟਰ ਹੈ?",
  },
  {
    ql: 67,
    pattern:
      /^Container C receives (.+?) from B and ends with (.+?) and (.+?) in the ratio (.+?)\. Before that transfer, B had been formed by adding (.+?) of (.+?) from A to (.+?) of (.+?)\. After the transfer to C, how many litres of (.+?) are left in B\?$/,
    hi: "B से C में $1 मिश्रण भेजा जाता है। C में $2 और $3 का अनुपात $4 है। इससे पहले B में $7 $8 के साथ A से $5 $6 मिलाया गया था। C में मिश्रण भेजने के बाद B में $9 कितने लीटर बचता है?",
    pa: "B ਤੋਂ C ਵਿੱਚ $1 ਮਿਸ਼ਰਣ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। C ਵਿੱਚ $2 ਅਤੇ $3 ਦਾ ਅਨੁਪਾਤ $4 ਹੈ। ਇਸ ਤੋਂ ਪਹਿਲਾਂ B ਵਿੱਚ $7 $8 ਨਾਲ A ਤੋਂ $5 $6 ਮਿਲਾਇਆ ਗਿਆ ਸੀ। C ਵਿੱਚ ਮਿਸ਼ਰਣ ਭੇਜਣ ਤੋਂ ਬਾਅਦ B ਵਿੱਚ $9 ਕਿੰਨੇ ਲੀਟਰ ਬਚਦਾ ਹੈ?",
  },
];

export function applyMal001NativeQualityV7<T extends Record<string, any>>(
  source: T,
  language: Lang,
): T {
  const commands: string[] = [];
  const protect = (s: string) =>
    s.replace(
      /\\[A-Za-z]+/g,
      (command) => `\uE000${commands.push(command) - 1}\uE001`,
    );
  const restore = (s: string) =>
    s.replace(/\uE000(\d+)\uE001/g, (_, index) => commands[Number(index)]!);
  const emptyC = String(source.stem).startsWith(
    "Vessel C is initially empty. ",
  );
  const renderingSource = emptyC
    ? {
        ...source,
        stem: source.stem.slice("Vessel C is initially empty. ".length),
      }
    : source;
  const protectedSource = learnerFields(renderingSource, protect);
  const localized = learnerFields(
    applyMal001QuestionStudioLocalizationV6(protectedSource, language),
    restore,
  );
  const translate = (s: string) => {
    const masked = protect(
      s
        .replace(/^[A-Z][a-z]+/, (word) => word.toLowerCase())
        .replace(/\bfodder\b/g, language === "hi" ? "चारा" : "ਚਾਰਾ"),
    );
    return restore(
      applyMal001QuestionStudioLocalizationV6(
        {
          stem: masked,
          options: [],
          answer: "",
          questionLanguageId: "FRAGMENT",
        },
        language,
      ).stem,
    );
  };
  const ql = Number(String(source.questionLanguageId).slice(-3));
  let authored =
    localized.traceability?.nativeStemTemplateMatched === true || ql <= 11;
  for (const rule of rules.filter((r) => r.ql === ql)) {
    const match = rule.pattern.exec(renderingSource.stem);
    if (!match) continue;
    localized.stem = (language === "hi" ? rule.hi : rule.pa).replace(
      /\$(\d+)/g,
      (_, i) => translate(match[Number(i)]!),
    );
    authored = true;
    break;
  }
  if (emptyC)
    localized.stem =
      (language === "hi"
        ? "पात्र C शुरू में खाली है। "
        : "ਭਾਂਡਾ C ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ") + localized.stem;
  return {
    ...localized,
    traceability: {
      ...localized.traceability,
      nativeQualityRevision: "MAL-NATIVE-QUALITY-V7",
      nativeStemAuthored: authored,
      mathematicalAuthorityLanguage: "en",
    },
  } as T;
}

rules.push(
  {
    ql: 12,
    pattern:
      /^A (?:vessel|mixture) contains (.+?) of (.+?) and (.+?) of (.+?)\. How many (?:kg|litres) of (.+?) should be added so that the ratio of (.+?) to (.+?) becomes (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। $6 : $7 का अनुपात $8 करने के लिए कितना $5 जोड़ना चाहिए?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। $6 : $7 ਦਾ ਅਨੁਪਾਤ $8 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 13,
    pattern:
      /^A (?:vessel|mixture) contains (.+?) of (.+?) and (.+?) of (.+?)\. How many (?:kg|litres) of (.+?) should be removed so that the ratio of (.+?) to (.+?) becomes (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। $6 : $7 का अनुपात $8 करने के लिए कितना $5 निकालना चाहिए?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। $6 : $7 ਦਾ ਅਨੁਪਾਤ $8 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਕੱਢਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 17,
    pattern:
      /^After removing (.+?) of (.+?), a (?:vessel|mixture) contains (.+?) of (.+?) and (.+?) of (.+?)\. What was the original ratio of (.+?) to (.+?)\?$/,
    hi: "$1 $2 निकालने के बाद मिश्रण में $3 $4 और $5 $6 बचता है। $7 : $8 का मूल अनुपात क्या था?",
    pa: "$1 $2 ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਮਿਸ਼ਰਣ ਵਿੱਚ $3 $4 ਅਤੇ $5 $6 ਬਚਦਾ ਹੈ। $7 : $8 ਦਾ ਮੂਲ ਅਨੁਪਾਤ ਕੀ ਸੀ?",
  },
  {
    ql: 19,
    pattern:
      /^A (?:vessel|mixture) contains (.+?) of (.+?) and (.+?) of (.+?)\. A quantity of the well-mixed contents is removed once and replaced with the same quantity of (.+?)\. How many (?:kg|litres) should be replaced so that the final ratio of (.+?) to (.+?) is (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। अच्छी तरह मिले मिश्रण की कुछ मात्रा निकालकर उतनी ही $5 भरी जाती है। $6 : $7 का अंतिम अनुपात $8 करने के लिए कितनी मात्रा बदलनी होगी?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਦੀ ਕੁਝ ਮਾਤਰਾ ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ $5 ਭਰੀ ਜਾਂਦੀ ਹੈ। $6 : $7 ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ $8 ਕਰਨ ਲਈ ਕਿੰਨੀ ਮਾਤਰਾ ਬਦਲਣੀ ਪਵੇਗੀ?",
  },
  {
    ql: 20,
    pattern:
      /^In a (.+?) mixture, the ratio of (.+?) to (.+?) is (.+?)\. What quantity of (.+?) should be added to obtain the ratio (.+?)\?$/,
    hi: "$1 मिश्रण में $2 : $3 = $4 है। अनुपात $6 करने के लिए कितना $5 जोड़ना चाहिए?",
    pa: "$1 ਮਿਸ਼ਰਣ ਵਿੱਚ $2 : $3 = $4 ਹੈ। ਅਨੁਪਾਤ $6 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 20,
    pattern:
      /^A mixture has a total quantity of (.+?)\. (.+?) and (.+?) are in the ratio (.+?)\. How many (?:kg|litres) of (.+?) should be added so that their ratio becomes (.+?)\?$/,
    hi: "$1 मिश्रण में $2 और $3 का अनुपात $4 है। अनुपात $6 करने के लिए कितना $5 जोड़ना चाहिए?",
    pa: "$1 ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਅਤੇ $3 ਦਾ ਅਨੁਪਾਤ $4 ਹੈ। ਅਨੁਪਾਤ $6 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 21,
    pattern:
      /^In a (.+?) mixture, the ratio of (.+?) to (.+?) is (.+?)\. What quantity of (.+?) should be removed to obtain the ratio (.+?)\?$/,
    hi: "$1 मिश्रण में $2 : $3 = $4 है। अनुपात $6 करने के लिए कितना $5 निकालना चाहिए?",
    pa: "$1 ਮਿਸ਼ਰਣ ਵਿੱਚ $2 : $3 = $4 ਹੈ। ਅਨੁਪਾਤ $6 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਕੱਢਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 21,
    pattern:
      /^A mixture has a total quantity of (.+?)\. (.+?) and (.+?) are in the ratio (.+?)\. How many (?:kg|litres) of (.+?) should be removed so that their ratio becomes (.+?)\?$/,
    hi: "$1 मिश्रण में $2 और $3 का अनुपात $4 है। अनुपात $6 करने के लिए कितना $5 निकालना चाहिए?",
    pa: "$1 ਮਿਸ਼ਰਣ ਵਿੱਚ $2 ਅਤੇ $3 ਦਾ ਅਨੁਪਾਤ $4 ਹੈ। ਅਨੁਪਾਤ $6 ਕਰਨ ਲਈ ਕਿੰਨਾ $5 ਕੱਢਣਾ ਚਾਹੀਦਾ ਹੈ?",
  },
  {
    ql: 22,
    pattern:
      /^(.+?) and (.+?) are present in the ratio (.+?)\. If the quantity of (.+?) is (.+?), what is the quantity of (.+?)\?$/,
    hi: "$1 और $2 का अनुपात $3 है। $4 की मात्रा $5 है। $6 की मात्रा कितनी है?",
    pa: "$1 ਅਤੇ $2 ਦਾ ਅਨੁਪਾਤ $3 ਹੈ। $4 ਦੀ ਮਾਤਰਾ $5 ਹੈ। $6 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?",
  },
  {
    ql: 23,
    pattern:
      /^The initial ratio of (.+?) to (.+?) was (.+?)\. (.+?) of (.+?) was then added, changing the ratio to (.+?)\. What was the original total\?$/,
    hi: "शुरू में $1 : $2 = $3 था। $4 $5 जोड़ने पर अनुपात $6 हो गया। मूल कुल मात्रा कितनी थी?",
    pa: "ਸ਼ੁਰੂ ਵਿੱਚ $1 : $2 = $3 ਸੀ। $4 $5 ਜੋੜਨ ਉੱਤੇ ਅਨੁਪਾਤ $6 ਹੋ ਗਿਆ। ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 24,
    pattern:
      /^A mixture had (.+?) and (.+?) in the ratio (.+?)\. When (.+?) of (.+?) was removed, the ratio became (.+?)\. What was the mixture's original quantity\?$/,
    hi: "शुरू में $1 और $2 का अनुपात $3 था। $4 $5 निकालने पर अनुपात $6 हो गया। मिश्रण की मूल कुल मात्रा कितनी थी?",
    pa: "ਸ਼ੁਰੂ ਵਿੱਚ $1 ਅਤੇ $2 ਦਾ ਅਨੁਪਾਤ $3 ਸੀ। $4 $5 ਕੱਢਣ ਉੱਤੇ ਅਨੁਪਾਤ $6 ਹੋ ਗਿਆ। ਮਿਸ਼ਰਣ ਦੀ ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 24,
    pattern:
      /^The initial ratio of (.+?) to (.+?) was (.+?)\. (.+?) of (.+?) was then removed, changing the ratio to (.+?)\. What was the original total\?$/,
    hi: "शुरू में $1 : $2 = $3 था। $4 $5 निकालने पर अनुपात $6 हो गया। मूल कुल मात्रा कितनी थी?",
    pa: "ਸ਼ੁਰੂ ਵਿੱਚ $1 : $2 = $3 ਸੀ। $4 $5 ਕੱਢਣ ਉੱਤੇ ਅਨੁਪਾਤ $6 ਹੋ ਗਿਆ। ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?",
  },
  {
    ql: 25,
    pattern:
      /^A (?:vessel|mixture) contains (.+?) of (.+?) and (.+?) of (.+?)\. A well-mixed sample of (.+?) is removed and replaced with the same quantity of (.+?)\. What is the final ratio of (.+?) to (.+?)\?$/,
    hi: "एक मिश्रण में $1 $2 और $3 $4 है। अच्छी तरह मिले मिश्रण में से $5 निकालकर उतना ही $6 भरा जाता है। $7 : $8 का अंतिम अनुपात क्या होगा?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 $2 ਅਤੇ $3 $4 ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ $5 ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ $6 ਭਰਿਆ ਜਾਂਦਾ ਹੈ। $7 : $8 ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 26,
    pattern:
      /^(.+?) and (.+?) are in the ratio (.+?)\. A well-mixed sample of (.+?) is removed and nothing is added\. What is the ratio of (.+?) to (.+?) in the remaining mixture\?$/,
    hi: "$1 और $2 का अनुपात $3 है। अच्छी तरह मिले मिश्रण में से $4 निकाल दिया जाता है और कुछ नहीं मिलाया जाता। शेष मिश्रण में $5 : $6 का अनुपात क्या होगा?",
    pa: "$1 ਅਤੇ $2 ਦਾ ਅਨੁਪਾਤ $3 ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ $4 ਕੱਢ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕੁਝ ਨਹੀਂ ਮਿਲਾਇਆ ਜਾਂਦਾ। ਬਾਕੀ ਮਿਸ਼ਰਣ ਵਿੱਚ $5 : $6 ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?",
  },
  {
    ql: 27,
    pattern:
      /^A mixture contains (.+?) and (.+?)\. Which single addition or removal will change the ratio of (.+?) to (.+?) to (.+?)\?$/,
    hi: "एक मिश्रण में $1 और $2 हैं। केवल एक घटक की मात्रा जोड़कर या निकालकर $3 : $4 का अनुपात $5 करने के लिए कौन-सी क्रिया करनी होगी?",
    pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 ਅਤੇ $2 ਹਨ। ਕੇਵਲ ਇੱਕ ਘਟਕ ਦੀ ਮਾਤਰਾ ਜੋੜ ਕੇ ਜਾਂ ਕੱਢ ਕੇ $3 : $4 ਦਾ ਅਨੁਪਾਤ $5 ਕਰਨ ਲਈ ਕਿਹੜੀ ਕਿਰਿਆ ਕਰਨੀ ਪਵੇਗੀ?",
  },
  {
    ql: 28,
    pattern:
      /^A three-item mixture has (.+?), (.+?) and (.+?) in the ratio (.+?)\. (.+?) of (.+?) and (.+?) of (.+?) are added, producing the ratio (.+?)\. How much (.+?) is present at the end\?$/,
    hi: "तीन घटकों $1, $2 और $3 का अनुपात $4 है। $5 $6 और $7 $8 जोड़ने पर अनुपात $9 हो जाता है। अंत में $10 की मात्रा कितनी होगी?",
    pa: "ਤਿੰਨ ਘਟਕਾਂ $1, $2 ਅਤੇ $3 ਦਾ ਅਨੁਪਾਤ $4 ਹੈ। $5 $6 ਅਤੇ $7 $8 ਜੋੜਨ ਉੱਤੇ ਅਨੁਪਾਤ $9 ਹੋ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ $10 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੋਵੇਗੀ?",
  },
);
rules.push({
  ql: 22,
  pattern:
    /^A mixture contains (.+?) and (.+?) in the ratio (.+?)\. Given that (.+?) measures (.+?), how much (.+?) is present\?$/,
  hi: "एक मिश्रण में $1 और $2 का अनुपात $3 है। $4 की मात्रा $5 है। $6 की मात्रा कितनी है?",
  pa: "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ $1 ਅਤੇ $2 ਦਾ ਅਨੁਪਾਤ $3 ਹੈ। $4 ਦੀ ਮਾਤਰਾ $5 ਹੈ। $6 ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?",
});
