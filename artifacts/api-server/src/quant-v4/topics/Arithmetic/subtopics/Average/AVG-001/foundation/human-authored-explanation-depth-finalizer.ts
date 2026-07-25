import type { Avg001QuestionPackage } from "./types";

type Language = "en" | "hi" | "pa";

function languageOf(pkg: Avg001QuestionPackage): Language {
  return pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
}

const CP001_SUPPORT_EN: Record<string, string> = {
  marksTotal: "Multiply the average marks by the number of students to obtain the class total.",
  dailyOutputTotal: "Repeating the average daily output for every working day gives the full production.",
  weeklySalesTotal: "Use the average daily sale once for each of the stated days.",
  salaryGroupTotal: "One average salary for each employee gives the combined monthly payroll.",
  passengerTotal: "The number of trips multiplied by the average passengers per trip gives the overall passenger count.",
  expenseTotal: "Repeat the average daily expenditure across all the stated days.",
  marksAverage: "Share the total marks equally across the number of tests.",
  outputAverage: "Divide the production by the hours to obtain the output per hour.",
  salesAverage: "Spread the total sales equally over the stated days.",
  expenseAverage: "Divide the complete expenditure by the number of days.",
  distanceAverage: "Share the total distance across the travel days.",
  observationAverage: "Divide the sum of the numbers by how many numbers there are.",
  dayCount: "The total production contains one average-day share for each working day.",
  studentCount: "Each student accounts for one average-mark share of the class total.",
  transactionCount: "Split the total transaction value into groups of the average transaction value.",
  employeeCount: "The salary total contains one average-salary share for each employee.",
  tripCount: "Divide all passengers by the average passengers carried on each trip.",
  dayCountFromExpense: "Split the total amount into portions equal to the average daily spending.",
  missingMark: "Find the marks required for all tests, then subtract the marks already scored.",
  missingOutput: "The last shift supplies the gap between required production and known production.",
  missingSale: "The final day's sale is the gap between the required total and the known days' sales.",
  missingExpense: "Subtract the known days' spending from the amount required for all days.",
  missingDistance: "Subtract the known days' distance from the required total; the remainder is the last day's distance.",
  missingObservation: "The missing number is the difference between the required sum and the known sum.",
  "findAverageAfterUniformTransformation:1": "Adding the same amount to every test mark increases the average by that amount.",
  "findAverageAfterUniformTransformation:2": "Multiplying every observation by one factor multiplies the average by the same factor.",
  "findAverageAfterUniformTransformation:3": "Apply the multiplication and addition to the average in the same order used for every reading.",
  "findAverageAfterUniformTransformation:4": "Adding an equal amount to every selected value adds that amount to their average.",
  "findAverageAfterUniformTransformation:5": "A common multiplier applied to all observations also multiplies their average.",
  "findAverageAfterUniformTransformation:6": "Multiply the average mark first, then add the common increase applied to every mark.",
  "findAverageAfterUniformTransformation:7": "Increasing every recorded value equally increases the average by the same amount.",
  "findAverageAfterUniformTransformation:8": "Multiplying each measurement by the same factor scales the average by that factor.",
};

const CP001_SUPPORT_HI: Record<string, string> = {
  marksTotal: "औसत अंक को विद्यार्थियों की संख्या से गुणा करने पर कक्षा के कुल अंक मिलते हैं।",
  dailyOutputTotal: "औसत दैनिक उत्पादन को सभी कार्य-दिवसों के लिए लेने पर कुल उत्पादन मिलता है।",
  weeklySalesTotal: "औसत दैनिक बिक्री को दिए गए प्रत्येक दिन के लिए जोड़ें।",
  salaryGroupTotal: "प्रत्येक कर्मचारी के लिए एक औसत वेतन लेने पर कुल मासिक वेतन मिलता है।",
  passengerTotal: "फेरों की संख्या को प्रति फेरा औसत यात्रियों से गुणा करें।",
  expenseTotal: "औसत दैनिक खर्च को सभी दिए गए दिनों के लिए जोड़ें।",
  marksAverage: "कुल अंकों को परीक्षाओं की संख्या में बराबर बाँटें।",
  outputAverage: "कुल उत्पादन को घंटों की संख्या से भाग देकर प्रति घंटा उत्पादन निकालें।",
  salesAverage: "कुल बिक्री को दिए गए दिनों में बराबर बाँटें।",
  expenseAverage: "पूरे खर्च को दिनों की संख्या से भाग दें।",
  distanceAverage: "कुल दूरी को यात्रा के दिनों में बराबर बाँटें।",
  observationAverage: "संख्याओं के योग को उनकी संख्या से भाग दें।",
  dayCount: "कुल उत्पादन में प्रत्येक कार्य-दिन के लिए एक औसत-दैनिक हिस्सा होता है।",
  studentCount: "कक्षा के कुल अंकों में प्रत्येक विद्यार्थी का एक औसत-अंक हिस्सा है।",
  transactionCount: "कुल लेन-देन मूल्य को औसत लेन-देन मूल्य के बराबर हिस्सों में बाँटें।",
  employeeCount: "कुल वेतन में प्रत्येक कर्मचारी के लिए एक औसत-वेतन हिस्सा होता है।",
  tripCount: "कुल यात्रियों को प्रति फेरा औसत यात्रियों से भाग दें।",
  dayCountFromExpense: "कुल राशि को औसत दैनिक खर्च के बराबर हिस्सों में बाँटें।",
  missingMark: "सभी परीक्षाओं के आवश्यक कुल अंक निकालकर पहले से मिले अंक घटाएँ।",
  missingOutput: "अंतिम पाली का उत्पादन आवश्यक कुल और ज्ञात उत्पादन के अंतर के बराबर है।",
  missingSale: "अंतिम दिन की बिक्री आवश्यक कुल बिक्री और ज्ञात दिनों की बिक्री का अंतर है।",
  missingExpense: "सभी दिनों के आवश्यक खर्च में से ज्ञात दिनों का खर्च घटाएँ।",
  missingDistance: "आवश्यक कुल दूरी में से ज्ञात दिनों की दूरी घटाएँ; शेष दूरी अंतिम दिन तय की गई है।",
  missingObservation: "लापता संख्या आवश्यक योग और ज्ञात योग के अंतर के बराबर है।",
  "findAverageAfterUniformTransformation:1": "हर परीक्षा-अंक में समान राशि जोड़ने पर औसत में भी उतनी ही वृद्धि होती है।",
  "findAverageAfterUniformTransformation:2": "हर प्रेक्षण को एक ही गुणक से गुणा करने पर औसत भी उसी गुणक से गुणा होता है।",
  "findAverageAfterUniformTransformation:3": "हर माप पर किए गए गुणा और जोड़ को उसी क्रम में औसत पर लागू करें।",
  "findAverageAfterUniformTransformation:4": "हर चुने हुए मान में समान राशि जोड़ने पर औसत में भी वही राशि जुड़ती है।",
  "findAverageAfterUniformTransformation:5": "सभी प्रेक्षणों पर समान गुणक लगाने से औसत भी उसी अनुपात में बदलता है।",
  "findAverageAfterUniformTransformation:6": "पहले औसत अंक को दिए गुणक से गुणा करें, फिर समान वृद्धि जोड़ें।",
  "findAverageAfterUniformTransformation:7": "हर दर्ज मान में बराबर वृद्धि करने पर औसत भी उतना ही बढ़ता है।",
  "findAverageAfterUniformTransformation:8": "हर माप को समान गुणक से गुणा करने पर औसत भी उसी गुणक से बढ़ता है।",
};

const CP001_SUPPORT_PA: Record<string, string> = {
  marksTotal: "ਔਸਤ ਅੰਕਾਂ ਨੂੰ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕ ਮਿਲਦੇ ਹਨ।",
  dailyOutputTotal: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਨੂੰ ਸਾਰੇ ਕੰਮ ਦੇ ਦਿਨਾਂ ਲਈ ਲੈਣ ਉੱਤੇ ਕੁੱਲ ਉਤਪਾਦਨ ਮਿਲਦਾ ਹੈ।",
  weeklySalesTotal: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ਨੂੰ ਦਿੱਤੇ ਹਰ ਦਿਨ ਲਈ ਜੋੜੋ।",
  salaryGroupTotal: "ਹਰ ਕਰਮਚਾਰੀ ਲਈ ਇੱਕ ਔਸਤ ਤਨਖਾਹ ਲੈਣ ਉੱਤੇ ਕੁੱਲ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ਮਿਲਦੀ ਹੈ।",
  passengerTotal: "ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ ਯਾਤਰੀਆਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
  expenseTotal: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ਨੂੰ ਸਾਰੇ ਦਿੱਤੇ ਦਿਨਾਂ ਲਈ ਜੋੜੋ।",
  marksAverage: "ਕੁੱਲ ਅੰਕਾਂ ਨੂੰ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।",
  outputAverage: "ਕੁੱਲ ਉਤਪਾਦਨ ਨੂੰ ਘੰਟਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਨ ਕੱਢੋ।",
  salesAverage: "ਕੁੱਲ ਵਿਕਰੀ ਨੂੰ ਦਿੱਤੇ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।",
  expenseAverage: "ਪੂਰੇ ਖਰਚ ਨੂੰ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
  distanceAverage: "ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਯਾਤਰਾ ਦੇ ਦਿਨਾਂ ਵਿੱਚ ਬਰਾਬਰ ਵੰਡੋ।",
  observationAverage: "ਸੰਖਿਆਵਾਂ ਦੇ ਜੋੜ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
  dayCount: "ਕੁੱਲ ਉਤਪਾਦਨ ਵਿੱਚ ਹਰ ਕੰਮ ਦੇ ਦਿਨ ਲਈ ਇੱਕ ਔਸਤ-ਰੋਜ਼ਾਨਾ ਹਿੱਸਾ ਹੁੰਦਾ ਹੈ।",
  studentCount: "ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕਾਂ ਵਿੱਚ ਹਰ ਵਿਦਿਆਰਥੀ ਦਾ ਇੱਕ ਔਸਤ-ਅੰਕ ਹਿੱਸਾ ਹੈ।",
  transactionCount: "ਕੁੱਲ ਲੈਣ-ਦੇਣ ਮੁੱਲ ਨੂੰ ਔਸਤ ਲੈਣ-ਦੇਣ ਮੁੱਲ ਦੇ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ।",
  employeeCount: "ਕੁੱਲ ਤਨਖਾਹ ਵਿੱਚ ਹਰ ਕਰਮਚਾਰੀ ਲਈ ਇੱਕ ਔਸਤ-ਤਨਖਾਹ ਹਿੱਸਾ ਹੁੰਦਾ ਹੈ।",
  tripCount: "ਕੁੱਲ ਯਾਤਰੀਆਂ ਨੂੰ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ ਯਾਤਰੀਆਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
  dayCountFromExpense: "ਕੁੱਲ ਰਕਮ ਨੂੰ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ਦੇ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ।",
  missingMark: "ਸਾਰੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ ਲਈ ਲੋੜੀਂਦੇ ਕੁੱਲ ਅੰਕ ਕੱਢ ਕੇ ਪਹਿਲਾਂ ਮਿਲੇ ਅੰਕ ਘਟਾਓ।",
  missingOutput: "ਆਖਰੀ ਸ਼ਿਫਟ ਦਾ ਉਤਪਾਦਨ ਲੋੜੀਂਦੇ ਕੁੱਲ ਅਤੇ ਜਾਣੇ ਉਤਪਾਦਨ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹੈ।",
  missingSale: "ਆਖਰੀ ਦਿਨ ਦੀ ਵਿਕਰੀ ਲੋੜੀਂਦੀ ਕੁੱਲ ਵਿਕਰੀ ਅਤੇ ਜਾਣੇ ਦਿਨਾਂ ਦੀ ਵਿਕਰੀ ਦਾ ਫਰਕ ਹੈ।",
  missingExpense: "ਸਾਰੇ ਦਿਨਾਂ ਦੇ ਲੋੜੀਂਦੇ ਖਰਚ ਵਿੱਚੋਂ ਜਾਣੇ ਦਿਨਾਂ ਦਾ ਖਰਚ ਘਟਾਓ।",
  missingDistance: "ਲੋੜੀਂਦੀ ਕੁੱਲ ਦੂਰੀ ਵਿੱਚੋਂ ਜਾਣੇ ਦਿਨਾਂ ਦੀ ਦੂਰੀ ਘਟਾਓ; ਬਾਕੀ ਦੂਰੀ ਆਖਰੀ ਦਿਨ ਤੈਅ ਕੀਤੀ ਗਈ ਹੈ।",
  missingObservation: "ਗੁੰਮ ਸੰਖਿਆ ਲੋੜੀਂਦੇ ਜੋੜ ਅਤੇ ਜਾਣੇ ਜੋੜ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹੈ।",
  "findAverageAfterUniformTransformation:1": "ਹਰ ਪ੍ਰੀਖਿਆ-ਅੰਕ ਵਿੱਚ ਇੱਕੋ ਰਕਮ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ਵਿੱਚ ਵੀ ਉਤਨਾ ਹੀ ਵਾਧਾ ਹੁੰਦਾ ਹੈ।",
  "findAverageAfterUniformTransformation:2": "ਹਰ ਮੁੱਲ ਨੂੰ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਔਸਤ ਵੀ ਉਸੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਹੁੰਦੀ ਹੈ।",
  "findAverageAfterUniformTransformation:3": "ਹਰ ਮਾਪ ਉੱਤੇ ਕੀਤੇ ਗੁਣਾ ਅਤੇ ਜੋੜ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਔਸਤ ਉੱਤੇ ਲਗਾਓ।",
  "findAverageAfterUniformTransformation:4": "ਹਰ ਚੁਣੇ ਮੁੱਲ ਵਿੱਚ ਇੱਕੋ ਰਕਮ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ਵਿੱਚ ਵੀ ਉਹੀ ਰਕਮ ਜੁੜਦੀ ਹੈ।",
  "findAverageAfterUniformTransformation:5": "ਸਾਰੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇੱਕੋ ਗੁਣਕ ਲਗਾਉਣ ਨਾਲ ਔਸਤ ਵੀ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।",
  "findAverageAfterUniformTransformation:6": "ਪਹਿਲਾਂ ਔਸਤ ਅੰਕਾਂ ਨੂੰ ਦਿੱਤੇ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਇੱਕੋ ਵਾਧਾ ਜੋੜੋ।",
  "findAverageAfterUniformTransformation:7": "ਹਰ ਦਰਜ ਮੁੱਲ ਵਿੱਚ ਬਰਾਬਰ ਵਾਧਾ ਕਰਨ ਉੱਤੇ ਔਸਤ ਵੀ ਉਤਨੀ ਹੀ ਵਧਦੀ ਹੈ।",
  "findAverageAfterUniformTransformation:8": "ਹਰ ਮਾਪ ਨੂੰ ਇੱਕੋ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਔਸਤ ਵੀ ਉਸੇ ਗੁਣਕ ਨਾਲ ਵਧਦੀ ਹੈ।",
};

function supportEnglish(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    const contextual = CP001_SUPPORT_EN[pkg.parameters.scenarioVariant];
    if (contextual) return contextual;
    return "Apply the same increase or decrease directly to the old average.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "Because the count is odd, the central term sits exactly at the average.";
    if (mode === "findExtremeFromAverageAndCount") return "Use half the number of gaps to move from the average to the requested end.";
    if (mode === "findTermCountFromAverageAndExtreme") return "Count the equal gaps from the average to the given extreme, then include both sides.";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "Divide the half-span by the number of gaps on one side.";
    return "Pairing opposite terms leaves the same midpoint in every pair.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "The reduced group uses one fewer observation after the outgoing value is removed.";
    if (/Replacement/i.test(mode)) return "Only the total changes because replacement leaves the group size unchanged.";
    if (/OriginalCount/i.test(mode)) return "Compare the member's surplus or deficit with the change carried by each group place.";
    if (/Innings/i.test(mode)) return "Use the updated run total with the updated innings count.";
    return "The enlarged group uses one additional observation after the incoming value is added.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "Weight each speed by the distance or time attached to that stage.";
    if (/Ratio/i.test(mode)) return "The group-size ratio is inverse to the two distances from the combined average.";
    return "Add the separate group totals before dividing by the combined count.";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") {
    return "The correction changes the total by the correct entry minus the recorded entry.";
  }
  return "Subtract the known subgroup contribution from the full combined total when needed.";
}

function supportHindi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    const contextual = CP001_SUPPORT_HI[pkg.parameters.scenarioVariant];
    if (contextual) return contextual;
    return "समान वृद्धि या कमी सीधे पुराने औसत पर लागू करें।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "पदों की संख्या विषम होने से केंद्रीय पद ठीक औसत पर होता है।";
    if (mode === "findExtremeFromAverageAndCount") return "औसत से माँगे गए छोर तक आधे अंतरालों के अनुसार बढ़ें।";
    if (mode === "findTermCountFromAverageAndExtreme") return "औसत से दिए छोर तक समान अंतराल गिनें और दोनों पक्ष शामिल करें।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "आधे फैलाव को एक ओर के अंतरालों की संख्या से भाग दें।";
    return "विपरीत छोरों के प्रत्येक जोड़े का मध्यबिंदु समान रहता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "मान हटने के बाद छोटे समूह में एक प्रेक्षण कम रहता है।";
    if (/Replacement/i.test(mode)) return "बदलाव में केवल कुल बदलता है; समूह की संख्या वही रहती है।";
    if (/OriginalCount/i.test(mode)) return "सदस्य की अधिकता या कमी की तुलना प्रति स्थान औसत-परिवर्तन से करें।";
    if (/Innings/i.test(mode)) return "बदले कुल रन को बदली पारी-संख्या के साथ उपयोग करें।";
    return "नया मान जुड़ने के बाद बड़े समूह में एक प्रेक्षण अधिक होता है।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "हर चाल को उससे जुड़ी दूरी या समय के अनुसार भार दें।";
    if (/Ratio/i.test(mode)) return "समूह-संख्या अनुपात संयुक्त औसत से दोनों दूरियों के व्युत्क्रमानुपाती होता है।";
    return "अलग समूहों के कुल जोड़कर संयुक्त संख्या से भाग दें।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") return "कुल में सुधार, सही प्रविष्टि और दर्ज प्रविष्टि के अंतर के बराबर है।";
  return "आवश्यक होने पर पूरे कुल में से ज्ञात उपसमूह का योगदान घटाएँ।";
}

function supportPunjabi(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (pkg.canonicalProblemId === "AVG-CP-001") {
    const contextual = CP001_SUPPORT_PA[pkg.parameters.scenarioVariant];
    if (contextual) return contextual;
    return "ਇੱਕੋ ਵਾਧਾ ਜਾਂ ਘਾਟ ਸਿੱਧਾ ਪੁਰਾਣੀ ਔਸਤ ਉੱਤੇ ਲਗਾਓ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    if (mode === "findMiddleTermFromAverage") return "ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਵਿਸ਼ਮ ਹੋਣ ਕਰਕੇ ਕੇਂਦਰੀ ਪਦ ਠੀਕ ਔਸਤ ਉੱਤੇ ਹੁੰਦਾ ਹੈ।";
    if (mode === "findExtremeFromAverageAndCount") return "ਔਸਤ ਤੋਂ ਮੰਗੇ ਸਿਰੇ ਤੱਕ ਅੱਧੇ ਅੰਤਰਾਲਾਂ ਅਨੁਸਾਰ ਵਧੋ।";
    if (mode === "findTermCountFromAverageAndExtreme") return "ਔਸਤ ਤੋਂ ਦਿੱਤੇ ਸਿਰੇ ਤੱਕ ਬਰਾਬਰ ਅੰਤਰਾਲ ਗਿਣੋ ਅਤੇ ਦੋਵੇਂ ਪਾਸੇ ਸ਼ਾਮਲ ਕਰੋ।";
    if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return "ਅੱਧੇ ਫੈਲਾਅ ਨੂੰ ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰਾਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
    return "ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਦੇ ਹਰ ਜੋੜੇ ਦਾ ਮੱਧ-ਬਿੰਦੂ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-003") {
    if (/Removal|Leaving/i.test(mode)) return "ਮੁੱਲ ਹਟਣ ਤੋਂ ਬਾਅਦ ਛੋਟੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਘੱਟ ਰਹਿੰਦਾ ਹੈ।";
    if (/Replacement/i.test(mode)) return "ਬਦਲੀ ਵਿੱਚ ਸਿਰਫ਼ ਕੁੱਲ ਬਦਲਦਾ ਹੈ; ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।";
    if (/OriginalCount/i.test(mode)) return "ਮੈਂਬਰ ਦੀ ਵਾਧੂ ਜਾਂ ਘੱਟ ਰਕਮ ਦੀ ਤੁਲਨਾ ਪ੍ਰਤੀ ਸਥਾਨ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਕਰੋ।";
    if (/Innings/i.test(mode)) return "ਬਦਲੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਨੂੰ ਬਦਲੀ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਵਰਤੋ।";
    return "ਨਵਾਂ ਮੁੱਲ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਵੱਡੇ ਸਮੂਹ ਵਿੱਚ ਇੱਕ ਪ੍ਰੇਖਣ ਵੱਧ ਹੁੰਦਾ ਹੈ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004") {
    if (/Speed/i.test(mode)) return "ਹਰ ਚਾਲ ਨੂੰ ਉਸ ਨਾਲ ਜੁੜੀ ਦੂਰੀ ਜਾਂ ਸਮੇਂ ਅਨੁਸਾਰ ਭਾਰ ਦਿਓ।";
    if (/Ratio/i.test(mode)) return "ਸਮੂਹ-ਗਿਣਤੀ ਅਨੁਪਾਤ ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।";
    return "ਵੱਖਰੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਜੋੜ ਕੇ ਸਾਂਝੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-005") return "ਕੁੱਲ ਦੀ ਸੋਧ ਸਹੀ ਅਤੇ ਦਰਜ ਮੁੱਲ ਦੇ ਫਰਕ ਦੇ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ।";
  return "ਲੋੜ ਪੈਣ ਉੱਤੇ ਪੂਰੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣੇ ਉਪ-ਸਮੂਹ ਦਾ ਯੋਗਦਾਨ ਘਟਾਓ।";
}

function support(pkg: Avg001QuestionPackage, language: Language) {
  if (language === "hi") return supportHindi(pkg);
  if (language === "pa") return supportPunjabi(pkg);
  return supportEnglish(pkg);
}

export function finalizeAvg001ExplanationDepth(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.explanation.lines.length >= 5) return pkg;
  const language = languageOf(pkg);
  const lines = [...pkg.explanation.lines];
  lines.splice(Math.min(2, lines.length - 1), 0, support(pkg, language));
  return {
    ...pkg,
    explanation: { lines: lines.slice(0, 6) },
    traceability: {
      ...pkg.traceability,
      explanationDepthFinalizer: "AVG-001 five-to-six-line explanation finalizer v1",
    },
  };
}
