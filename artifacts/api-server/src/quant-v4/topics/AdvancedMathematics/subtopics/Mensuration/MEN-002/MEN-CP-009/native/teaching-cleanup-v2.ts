import type { MenCp009NativeV2Language } from "./editorial-v2";

function hindi(line: string) {
  const percent = line.match(/^A ([\d.]+)% increase makes the new radius ([\d.]+) times the old radius\.$/);
  if (percent) {
    return `${percent[1]}% बढ़ने पर नई त्रिज्या, पुरानी त्रिज्या की ${percent[2]} गुना हो जाती है।`;
  }

  const radii = line.match(/^The radii are (\d+) and (\d+), so start with (\d+):(\d+)\.$/);
  if (radii) {
    return `त्रिज्याएँ ${radii[1]} और ${radii[2]} हैं, इसलिए पहले अनुपात ${radii[3]}:${radii[4]} लिखें।`;
  }

  const root = line.match(/^So r = (.+?)(?: Then d = (.+))?$/);
  if (root) {
    return root[2]
      ? `पहले r = ${root[1]} फिर d = ${root[2]}`
      : `इसलिए r = ${root[1]}`;
  }

  return line
    .replace(/^For a sphere, surface area = (.+?) and volume = (.+)\.$/, "गोले के लिए सतह का क्षेत्रफल = $1 और आयतन = $2।")
    .replace(/^For a hemisphere, curved surface area = (.+?) and volume = (.+)\.$/, "अर्धगोले के लिए वक्र सतह का क्षेत्रफल = $1 और आयतन = $2।")
    .replace(/^For the same radius, sphere volume is (.+?) and hemisphere volume is (.+)\.$/, "समान त्रिज्या के लिए गोले का आयतन $1 और अर्धगोले का आयतन $2 होता है।")
    .replace(/^For the same radius, sphere surface area is (.+?) and hemisphere total area is (.+)\.$/, "समान त्रिज्या के लिए गोले की सतह का क्षेत्रफल $1 और अर्धगोले की कुल सतह का क्षेत्रफल $2 होता है।")
    .replace(/^For these matching area and volume formulas, area : volume simplifies to (.+)\.$/, "इन क्षेत्रफल और आयतन के सूत्रों को भाग देने पर क्षेत्रफल : आयतन सरल होकर $1 मिलता है।")
    .replace(/^For a solid hemisphere, TSA = (.+?) and volume = (.+)\.$/, "ठोस अर्धगोले के लिए कुल सतह का क्षेत्रफल = $1 और आयतन = $2।")
    .replace(/^For a solid hemisphere, TSA : volume simplifies to (.+)\.$/, "ठोस अर्धगोले के लिए कुल सतह का क्षेत्रफल : आयतन सरल होकर $1 मिलता है।")
    .replace(/^Write area : volume and cancel the common (.+)\.$/, "क्षेत्रफल : आयतन लिखें और दोनों में समान $1 को काट दें।")
    .replace(/^The ratio becomes (.+)\.$/, "इससे अनुपात $1 बनता है।")
    .replace(/^Dividing TSA by volume cancels (.+?), leaving (.+)\.$/, "कुल सतह के क्षेत्रफल को आयतन से भाग देने पर $1 कट जाता है और $2 बचता है।")
    .replace(/^Match the given ratio (.+?) with (.+)\.$/, "दिए हुए अनुपात $1 को $2 के बराबर रखें।")
    .replace(/^Solving the ratio gives (.+)\.$/, "अनुपात हल करने पर $1 मिलता है।")
    .replace(/^Write them in the required order: (.+)\.$/, "प्रश्न में दिए क्रम में लिखें: $1।")
    .replace(/^Cancel (.+?), leaving (.+)\.$/, "$1 को काटने पर $2 बचता है।")
    .replace(/^Reduce this ratio to get (.+)\.$/, "इस अनुपात को सरल करने पर $1 मिलता है।")
    .replace(/^After reducing, the required ratio is (.+)\.$/, "अनुपात को सरल करने पर उत्तर $1 है।")
    .replace(/^So the required ratio is (.+)\.$/, "इसलिए आवश्यक अनुपात $1 है।")
    .replace(/^Therefore, the ratio of the radii is (.+)\.$/, "अतः त्रिज्याओं का अनुपात $1 है।")
    .replace(/^So the surface area increases by (.+)\.$/, "इसलिए सतह के क्षेत्रफल में वृद्धि $1 है।")
    .replace(/^So the volume increases by (.+)\.$/, "इसलिए आयतन में वृद्धि $1 है।")
    .replace(/^Now substitute the actual values: /, "अब दिए हुए मान सीधे सूत्र में रखें: ")
    .replace(/^Now include the painting rate: /, "अब रंगाई की दर भी शामिल करें: ")
    .replace(/^Now include the polishing rate: /, "अब पॉलिश की दर भी शामिल करें: ")
    .replace(/^For a sphere, surface area = /, "गोले के लिए सतह का क्षेत्रफल = ")
    .replace(/^For a hemisphere, curved surface area = /, "अर्धगोले के लिए वक्र सतह का क्षेत्रफल = ")
    .replace(/^For a solid hemisphere, TSA : volume simplifies to /, "ठोस अर्धगोले के लिए कुल सतह का क्षेत्रफल : आयतन सरल होकर ")
    .replace(/^So /, "इसलिए ")
    .replace(/^Then /, "फिर ")
    .replace(/, curved area = /g, ", वक्र सतह का क्षेत्रफल = ")
    .replace(/, area = /g, ", क्षेत्रफल = ")
    .replace(/area × rate/g, "क्षेत्रफल × दर")
    .replace(/\blitres\b/gi, "लीटर")
    .replace(/\btimes\b/gi, "गुना")
    .replace(/\bper\b/gi, "प्रति")
    .replace(/\band\b/gi, "और")
    .replace(/\bwith\b/gi, "के साथ")
    .replace(/\s+/g, " ")
    .trim();
}

function punjabi(line: string) {
  const percent = line.match(/^A ([\d.]+)% increase makes the new radius ([\d.]+) times the old radius\.$/);
  if (percent) {
    return `${percent[1]}% ਵਾਧੇ ਨਾਲ ਨਵਾਂ ਅਰਧ-ਵਿਆਸ, ਪੁਰਾਣੇ ਅਰਧ-ਵਿਆਸ ਦਾ ${percent[2]} ਗੁਣਾ ਹੋ ਜਾਂਦਾ ਹੈ।`;
  }

  const radii = line.match(/^The radii are (\d+) and (\d+), so start with (\d+):(\d+)\.$/);
  if (radii) {
    return `ਅਰਧ-ਵਿਆਸ ${radii[1]} ਅਤੇ ${radii[2]} ਹਨ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਅਨੁਪਾਤ ${radii[3]}:${radii[4]} ਲਿਖੋ।`;
  }

  const root = line.match(/^So r = (.+?)(?: Then d = (.+))?$/);
  if (root) {
    return root[2]
      ? `ਪਹਿਲਾਂ r = ${root[1]} ਫਿਰ d = ${root[2]}`
      : `ਇਸ ਲਈ r = ${root[1]}`;
  }

  return line
    .replace(/^For a sphere, surface area = (.+?) and volume = (.+)\.$/, "ਗੋਲੇ ਲਈ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = $1 ਅਤੇ ਆਇਤਨ = $2।")
    .replace(/^For a hemisphere, curved surface area = (.+?) and volume = (.+)\.$/, "ਅਰਧ-ਗੋਲੇ ਲਈ ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = $1 ਅਤੇ ਆਇਤਨ = $2।")
    .replace(/^For the same radius, sphere volume is (.+?) and hemisphere volume is (.+)\.$/, "ਇੱਕੋ ਅਰਧ-ਵਿਆਸ ਲਈ ਗੋਲੇ ਦਾ ਆਇਤਨ $1 ਅਤੇ ਅਰਧ-ਗੋਲੇ ਦਾ ਆਇਤਨ $2 ਹੁੰਦਾ ਹੈ।")
    .replace(/^For the same radius, sphere surface area is (.+?) and hemisphere total area is (.+)\.$/, "ਇੱਕੋ ਅਰਧ-ਵਿਆਸ ਲਈ ਗੋਲੇ ਦੀ ਸਤਹ ਦਾ ਖੇਤਰਫਲ $1 ਅਤੇ ਅਰਧ-ਗੋਲੇ ਦੀ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ $2 ਹੁੰਦਾ ਹੈ।")
    .replace(/^For these matching area and volume formulas, area : volume simplifies to (.+)\.$/, "ਇਨ੍ਹਾਂ ਖੇਤਰਫਲ ਅਤੇ ਆਇਤਨ ਦੇ ਸੂਤਰਾਂ ਨੂੰ ਭਾਗ ਦੇਣ ਤੇ ਖੇਤਰਫਲ : ਆਇਤਨ ਸਧਾਰਨ ਹੋ ਕੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^For a solid hemisphere, TSA = (.+?) and volume = (.+)\.$/, "ਠੋਸ ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = $1 ਅਤੇ ਆਇਤਨ = $2।")
    .replace(/^For a solid hemisphere, TSA : volume simplifies to (.+)\.$/, "ਠੋਸ ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ : ਆਇਤਨ ਸਧਾਰਨ ਹੋ ਕੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^Write area : volume and cancel the common (.+)\.$/, "ਖੇਤਰਫਲ : ਆਇਤਨ ਲਿਖੋ ਅਤੇ ਦੋਵਾਂ ਵਿੱਚ ਸਾਂਝੇ $1 ਨੂੰ ਕੱਟ ਦਿਓ।")
    .replace(/^The ratio becomes (.+)\.$/, "ਇਸ ਨਾਲ ਅਨੁਪਾਤ $1 ਬਣਦਾ ਹੈ।")
    .replace(/^Dividing TSA by volume cancels (.+?), leaving (.+)\.$/, "ਕੁੱਲ ਸਤਹ ਦੇ ਖੇਤਰਫਲ ਨੂੰ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ $1 ਕੱਟ ਜਾਂਦਾ ਹੈ ਅਤੇ $2 ਬਚਦਾ ਹੈ।")
    .replace(/^Match the given ratio (.+?) with (.+)\.$/, "ਦਿੱਤੇ ਅਨੁਪਾਤ $1 ਨੂੰ $2 ਦੇ ਬਰਾਬਰ ਰੱਖੋ।")
    .replace(/^Solving the ratio gives (.+)\.$/, "ਅਨੁਪਾਤ ਹੱਲ ਕਰਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^Write them in the required order: (.+)\.$/, "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ: $1।")
    .replace(/^Cancel (.+?), leaving (.+)\.$/, "$1 ਨੂੰ ਕੱਟਣ ਤੇ $2 ਬਚਦਾ ਹੈ।")
    .replace(/^Reduce this ratio to get (.+)\.$/, "ਇਸ ਅਨੁਪਾਤ ਨੂੰ ਸਧਾਰਨ ਕਰਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^After reducing, the required ratio is (.+)\.$/, "ਅਨੁਪਾਤ ਸਧਾਰਨ ਕਰਨ ਤੇ ਉੱਤਰ $1 ਹੈ।")
    .replace(/^So the required ratio is (.+)\.$/, "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ $1 ਹੈ।")
    .replace(/^Therefore, the ratio of the radii is (.+)\.$/, "ਇਸ ਲਈ ਅਰਧ-ਵਿਆਸਾਂ ਦਾ ਅਨੁਪਾਤ $1 ਹੈ।")
    .replace(/^So the surface area increases by (.+)\.$/, "ਇਸ ਲਈ ਸਤਹ ਦੇ ਖੇਤਰਫਲ ਵਿੱਚ ਵਾਧਾ $1 ਹੈ।")
    .replace(/^So the volume increases by (.+)\.$/, "ਇਸ ਲਈ ਆਇਤਨ ਵਿੱਚ ਵਾਧਾ $1 ਹੈ।")
    .replace(/^Now substitute the actual values: /, "ਹੁਣ ਦਿੱਤੇ ਮੁੱਲ ਸਿੱਧੇ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ: ")
    .replace(/^Now include the painting rate: /, "ਹੁਣ ਰੰਗਾਈ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/^Now include the polishing rate: /, "ਹੁਣ ਪਾਲਿਸ਼ ਦੀ ਦਰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ: ")
    .replace(/^For a sphere, surface area = /, "ਗੋਲੇ ਲਈ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/^For a hemisphere, curved surface area = /, "ਅਰਧ-ਗੋਲੇ ਲਈ ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/^For a solid hemisphere, TSA : volume simplifies to /, "ਠੋਸ ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਸਤਹ ਦਾ ਖੇਤਰਫਲ : ਆਇਤਨ ਸਧਾਰਨ ਹੋ ਕੇ ")
    .replace(/^So /, "ਇਸ ਲਈ ")
    .replace(/^Then /, "ਫਿਰ ")
    .replace(/, curved area = /g, ", ਵਕਰ ਸਤਹ ਦਾ ਖੇਤਰਫਲ = ")
    .replace(/, area = /g, ", ਖੇਤਰਫਲ = ")
    .replace(/area × rate/g, "ਖੇਤਰਫਲ × ਦਰ")
    .replace(/\blitres\b/gi, "ਲੀਟਰ")
    .replace(/\btimes\b/gi, "ਗੁਣਾ")
    .replace(/\bper\b/gi, "ਪ੍ਰਤੀ")
    .replace(/\band\b/gi, "ਅਤੇ")
    .replace(/\bwith\b/gi, "ਦੇ ਨਾਲ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanMenCp009NativeTeachingLineV2(
  line: string,
  language: MenCp009NativeV2Language,
) {
  return language === "hi" ? hindi(line) : punjabi(line);
}
