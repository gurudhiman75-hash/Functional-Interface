import fs from "node:fs";
import path from "node:path";

const baseDir = path.join(
  process.cwd(),
  "artifacts",
  "api-server",
  "src",
  "quant-v4",
  "topics",
  "Arithmetic",
  "subtopics",
  "Percentage",
  "PCT-001",
);

const localizedTaskSets = {
  hi: {
    "PCT-CP-002": {
      increaseNewValue: {
        steps: [
          "मूल मान {baseValue} है।",
          "वृद्धि = {baseValue} का {percentageRate}% = {changeAmount}।",
          "नया मान = {baseValue} + {changeAmount} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "मूल मान {baseValue} है।",
            "वृद्धि = {baseValue} का {percentageRate}% = {changeAmount}।",
            "नया मान = {baseValue} + {changeAmount} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "दिया गया मूल मान {baseValue} है।",
            "इस पर {percentageRate}% की वृद्धि करने से वृद्धि राशि {changeAmount} मिलती है।",
            "अतः नया मान = {baseValue} + {changeAmount} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      decreaseNewValue: {
        steps: [
          "मूल मान {baseValue} है।",
          "कमी = {baseValue} का {percentageRate}% = {changeAmount}।",
          "नया मान = {baseValue} - {changeAmount} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "मूल मान {baseValue} है।",
            "कमी = {baseValue} का {percentageRate}% = {changeAmount}।",
            "नया मान = {baseValue} - {changeAmount} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "दिया गया मूल मान {baseValue} है।",
            "इसमें {percentageRate}% की कमी करने पर कमी राशि {changeAmount} मिलती है।",
            "अतः नया मान = {baseValue} - {changeAmount} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      reverseIncrease: {
        steps: [
          "{percentageRate}% वृद्धि के बाद मान {finalValue} हो जाता है।",
          "अतः यह मूल मान का {changedBase}% है।",
          "मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "{percentageRate}% वृद्धि के बाद मान {finalValue} हो जाता है।",
            "अतः यह मूल मान का {changedBase}% है।",
            "मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "वृद्धि के बाद प्राप्त मान {finalValue} दिया है।",
            "यह मान पुराने मान के {changedBase}% के बराबर है।",
            "इसलिए मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      reverseDecrease: {
        steps: [
          "{percentageRate}% कमी के बाद मान {finalValue} रह जाता है।",
          "अतः यह मूल मान का {changedBase}% है।",
          "मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "{percentageRate}% कमी के बाद मान {finalValue} रह जाता है।",
            "अतः यह मूल मान का {changedBase}% है।",
            "मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "कमी के बाद प्राप्त मान {finalValue} दिया है।",
            "यह मान पुराने मान के {changedBase}% के बराबर है।",
            "इसलिए मूल मान = {finalValue} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      increaseByAmount: {
        steps: [
          "वृद्धि की राशि {value} है।",
          "यह राशि मूल मान के {percentageRate}% के बराबर है।",
          "मूल मान = {value} x 100 / {percentageRate} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "वृद्धि की राशि {value} है।",
            "यह राशि मूल मान के {percentageRate}% के बराबर है।",
            "मूल मान = {value} x 100 / {percentageRate} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "दिया गया {value} वही वृद्धि है जो {percentageRate}% के बराबर है।",
            "इसलिए {percentageRate}% = {value} माना जाएगा।",
            "अतः मूल मान = {value} x 100 / {percentageRate} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      percentOfKnownNumber: {
        steps: [
          "संख्या का {rate1}% = {value1} दिया है।",
          "उसी संख्या का {rate2}% ज्ञात करना है।",
          "आवश्यक मान = {value1} x {rate2} / {rate1} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "संख्या का {rate1}% = {value1} दिया है।",
            "उसी संख्या का {rate2}% ज्ञात करना है।",
            "आवश्यक मान = {value1} x {rate2} / {rate1} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "{rate1}% के लिए मान {value1} दिया है।",
            "अब उसी आधार पर {rate2}% निकालें।",
            "इसलिए आवश्यक मान = {value1} x {rate2} / {rate1} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      differenceOfPercents: {
        steps: [
          "{rate1}% और {rate2}% का अंतर {percentDifference}% है।",
          "यही अंतर {value} के बराबर है।",
          "मूल संख्या = {value} x 100 / {percentDifference} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "{rate1}% और {rate2}% का अंतर {percentDifference}% है।",
            "यही अंतर {value} के बराबर है।",
            "मूल संख्या = {value} x 100 / {percentDifference} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "दोनों प्रतिशतों का शुद्ध अंतर {percentDifference}% है।",
            "यह अंतर संख्या के लिए {value} दिया है।",
            "इसलिए मूल संख्या = {value} x 100 / {percentDifference} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      restoreAfterDecrease: {
        steps: [
          "{percentageRate}% कमी के बाद {remainingBase}% मान शेष रहता है।",
          "पुराना मान वापस पाने के लिए आवश्यक वृद्धि प्रतिशत निकालें।",
          "आवश्यक वृद्धि = {percentageRate} x 100 / {remainingBase} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "{percentageRate}% कमी के बाद {remainingBase}% मान शेष रहता है।",
            "पुराना मान वापस पाने के लिए आवश्यक वृद्धि प्रतिशत निकालें।",
            "आवश्यक वृद्धि = {percentageRate} x 100 / {remainingBase} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "कमी के बाद केवल {remainingBase}% मान बचता है।",
            "अब पुराने मान तक पहुँचने के लिए उलटी वृद्धि चाहिए।",
            "इसलिए आवश्यक वृद्धि = {percentageRate} x 100 / {remainingBase} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
    },
    "PCT-CP-003": {
      successiveChange: {
        steps: [
          "पहला परिवर्तन गुणक {firstFactor} है।",
          "दूसरा परिवर्तन गुणक {secondFactor} है।",
          "शुद्ध गुणक = {netFactor}। अतः कुल प्रतिशत परिवर्तन = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "पहला परिवर्तन गुणक {firstFactor} है।",
            "दूसरा परिवर्तन गुणक {secondFactor} है।",
            "शुद्ध गुणक = {netFactor}। अतः कुल प्रतिशत परिवर्तन = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "पहले चरण का गुणक {firstFactor} है।",
            "दूसरे चरण का गुणक {secondFactor} है।",
            "दोनों को मिलाने पर शुद्ध गुणक {netFactor} मिलता है, इसलिए कुल परिवर्तन {answer} है।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      compoundGrowth: {
        steps: [
          "प्रारंभिक मान {initialValue} है।",
          "एक चरण का वृद्धि गुणक {singleFactor} है।",
          "दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "प्रारंभिक मान {initialValue} है।",
            "एक चरण का वृद्धि गुणक {singleFactor} है।",
            "दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "शुरुआती मान {initialValue} दिया है।",
            "हर चरण में वही वृद्धि गुणक {singleFactor} लगेगा।",
            "अतः दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      compoundDecay: {
        steps: [
          "प्रारंभिक मान {initialValue} है।",
          "एक चरण का कमी गुणक {singleFactor} है।",
          "दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "प्रारंभिक मान {initialValue} है।",
            "एक चरण का कमी गुणक {singleFactor} है।",
            "दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "शुरुआती मान {initialValue} दिया है।",
            "हर चरण में वही कमी गुणक {singleFactor} लगेगा।",
            "अतः दो चरणों बाद मान = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      squareAreaChange: {
        steps: [
          "भुजा में {percentageRate}% परिवर्तन हुआ है।",
          "क्षेत्रफल भुजा के वर्ग पर निर्भर करता है, इसलिए गुणक = {singleFactor} x {singleFactor}।",
          "अतः क्षेत्रफल का शुद्ध प्रतिशत परिवर्तन = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "भुजा में {percentageRate}% परिवर्तन हुआ है।",
            "क्षेत्रफल भुजा के वर्ग पर निर्भर करता है, इसलिए गुणक = {singleFactor} x {singleFactor}।",
            "अतः क्षेत्रफल का शुद्ध प्रतिशत परिवर्तन = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "भुजा बदलने पर पहले उसका गुणक {singleFactor} लें।",
            "क्योंकि क्षेत्रफल भुजा के वर्ग के अनुसार बदलता है, इसलिए {singleFactor} x {singleFactor} लिया जाएगा।",
            "इससे क्षेत्रफल का कुल प्रतिशत परिवर्तन {answer} मिलता है।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
    },
    "PCT-CP-004": {
      productInvariance: {
        steps: [
          "यहाँ गुणनफल स्थिर रहता है।",
          "यदि एक घटक में {percentageRate}% परिवर्तन होता है, तो दूसरे घटक में विपरीत दिशा में परिवर्तन लेना पड़ता है।",
          "आवश्यक प्रतिशत = {percentageRate} x 100 / {changedBase} = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "यहाँ गुणनफल स्थिर रहता है।",
            "यदि एक घटक में {percentageRate}% परिवर्तन होता है, तो दूसरे घटक में विपरीत दिशा में परिवर्तन लेना पड़ता है।",
            "आवश्यक प्रतिशत = {percentageRate} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "इस प्रकार के प्रश्न में कुल गुणनफल समान रखा जाता है।",
            "एक भाग में {percentageRate}% बदलाव होने पर दूसरे भाग में उलटी दिशा में समायोजन करना पड़ता है।",
            "इसलिए आवश्यक प्रतिशत = {percentageRate} x 100 / {changedBase} = {answer}।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      revenueChange: {
        steps: [
          "कुल आय मूल्य और बिक्री मात्रा पर निर्भर करती है।",
          "मूल्य गुणक = {firstFactor} और मात्रा गुणक = {secondFactor}।",
          "शुद्ध गुणक = {netFactor}। अतः कुल प्रतिशत परिवर्तन = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "कुल आय मूल्य और बिक्री मात्रा पर निर्भर करती है।",
            "मूल्य गुणक = {firstFactor} और मात्रा गुणक = {secondFactor}।",
            "शुद्ध गुणक = {netFactor}। अतः कुल प्रतिशत परिवर्तन = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "राजस्व निकालने के लिए मूल्य और बिक्री दोनों को साथ में देखें।",
            "पहला गुणक {firstFactor} और दूसरा गुणक {secondFactor} है।",
            "दोनों से शुद्ध गुणक {netFactor} मिलता है, इसलिए कुल प्रतिशत परिवर्तन {answer} है।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
      circleAreaDecrease: {
        steps: [
          "वृत्त का क्षेत्रफल त्रिज्या के वर्ग पर निर्भर करता है।",
          "नई त्रिज्या का गुणक {singleFactor} है।",
          "अतः क्षेत्रफल में प्रतिशत कमी = {answer}।",
          "अब गणना को सरल करें।",
          "उत्तर {answer} है।",
        ],
        variants: [
          [
            "वृत्त का क्षेत्रफल त्रिज्या के वर्ग पर निर्भर करता है।",
            "नई त्रिज्या का गुणक {singleFactor} है।",
            "अतः क्षेत्रफल में प्रतिशत कमी = {answer}।",
            "अब गणना को सरल करें।",
            "उत्तर {answer} है।",
          ],
          [
            "त्रिज्या घटने पर पहले उसका नया गुणक {singleFactor} लें।",
            "क्योंकि क्षेत्रफल त्रिज्या के वर्ग से बदलता है, उसी के अनुसार क्षेत्रफल निकलेगा।",
            "इसलिए क्षेत्रफल में कुल प्रतिशत कमी {answer} है।",
            "अब गणना को सरल करें।",
            "अतः उत्तर {answer} है।",
          ],
        ],
      },
    },
  },
  pa: {
    "PCT-CP-002": {
      increaseNewValue: {
        steps: [
          "ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
          "ਵਾਧਾ = {baseValue} ਦਾ {percentageRate}% = {changeAmount}।",
          "ਨਵਾਂ ਮੁੱਲ = {baseValue} + {changeAmount} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
            "ਵਾਧਾ = {baseValue} ਦਾ {percentageRate}% = {changeAmount}।",
            "ਨਵਾਂ ਮੁੱਲ = {baseValue} + {changeAmount} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਦਿੱਤਾ ਗਿਆ ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
            "ਇਸ ਉੱਤੇ {percentageRate}% ਵਾਧਾ ਕਰਨ ਨਾਲ ਵਾਧੇ ਦੀ ਰਕਮ {changeAmount} ਮਿਲਦੀ ਹੈ।",
            "ਅਤੇ ਇਸ ਲਈ ਨਵਾਂ ਮੁੱਲ = {baseValue} + {changeAmount} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      decreaseNewValue: {
        steps: [
          "ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
          "ਕਮੀ = {baseValue} ਦਾ {percentageRate}% = {changeAmount}।",
          "ਨਵਾਂ ਮੁੱਲ = {baseValue} - {changeAmount} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
            "ਕਮੀ = {baseValue} ਦਾ {percentageRate}% = {changeAmount}।",
            "ਨਵਾਂ ਮੁੱਲ = {baseValue} - {changeAmount} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਦਿੱਤਾ ਗਿਆ ਮੂਲ ਮੁੱਲ {baseValue} ਹੈ।",
            "ਇਸ ਵਿੱਚ {percentageRate}% ਕਮੀ ਕਰਨ ਨਾਲ ਕਮੀ ਦੀ ਰਕਮ {changeAmount} ਮਿਲਦੀ ਹੈ।",
            "ਅਤੇ ਇਸ ਲਈ ਨਵਾਂ ਮੁੱਲ = {baseValue} - {changeAmount} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      reverseIncrease: {
        steps: [
          "{percentageRate}% ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਮੁੱਲ {finalValue} ਬਣ ਜਾਂਦਾ ਹੈ।",
          "ਅਤੇ ਇਸ ਲਈ ਇਹ ਮੂਲ ਮੁੱਲ ਦਾ {changedBase}% ਹੈ।",
          "ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "{percentageRate}% ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਮੁੱਲ {finalValue} ਬਣ ਜਾਂਦਾ ਹੈ।",
            "ਅਤੇ ਇਸ ਲਈ ਇਹ ਮੂਲ ਮੁੱਲ ਦਾ {changedBase}% ਹੈ।",
            "ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਮਿਲਿਆ ਮੁੱਲ {finalValue} ਦਿੱਤਾ ਹੈ।",
            "ਇਹ ਪੁਰਾਣੇ ਮੁੱਲ ਦੇ {changedBase}% ਦੇ ਬਰਾਬਰ ਹੈ।",
            "ਇਸ ਲਈ ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      reverseDecrease: {
        steps: [
          "{percentageRate}% ਕਮੀ ਤੋਂ ਬਾਅਦ ਮੁੱਲ {finalValue} ਰਹਿ ਜਾਂਦਾ ਹੈ।",
          "ਅਤੇ ਇਸ ਲਈ ਇਹ ਮੂਲ ਮੁੱਲ ਦਾ {changedBase}% ਹੈ।",
          "ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "{percentageRate}% ਕਮੀ ਤੋਂ ਬਾਅਦ ਮੁੱਲ {finalValue} ਰਹਿ ਜਾਂਦਾ ਹੈ।",
            "ਅਤੇ ਇਸ ਲਈ ਇਹ ਮੂਲ ਮੁੱਲ ਦਾ {changedBase}% ਹੈ।",
            "ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਕਮੀ ਤੋਂ ਬਾਅਦ ਮਿਲਿਆ ਮੁੱਲ {finalValue} ਦਿੱਤਾ ਹੈ।",
            "ਇਹ ਪੁਰਾਣੇ ਮੁੱਲ ਦੇ {changedBase}% ਦੇ ਬਰਾਬਰ ਹੈ।",
            "ਇਸ ਲਈ ਮੂਲ ਮੁੱਲ = {finalValue} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      increaseByAmount: {
        steps: [
          "ਵਾਧੇ ਦੀ ਰਕਮ {value} ਹੈ।",
          "ਇਹ ਰਕਮ ਮੂਲ ਮੁੱਲ ਦੇ {percentageRate}% ਦੇ ਬਰਾਬਰ ਹੈ।",
          "ਮੂਲ ਮੁੱਲ = {value} x 100 / {percentageRate} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਵਾਧੇ ਦੀ ਰਕਮ {value} ਹੈ।",
            "ਇਹ ਰਕਮ ਮੂਲ ਮੁੱਲ ਦੇ {percentageRate}% ਦੇ ਬਰਾਬਰ ਹੈ।",
            "ਮੂਲ ਮੁੱਲ = {value} x 100 / {percentageRate} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "{value} ਉਹ ਵਾਧਾ ਹੈ ਜੋ {percentageRate}% ਦੇ ਬਰਾਬਰ ਹੈ।",
            "ਇਸ ਲਈ {percentageRate}% = {value} ਮੰਨਿਆ ਜਾਵੇਗਾ।",
            "ਅਤੇ ਇਸ ਲਈ ਮੂਲ ਮੁੱਲ = {value} x 100 / {percentageRate} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      percentOfKnownNumber: {
        steps: [
          "ਸੰਖਿਆ ਦਾ {rate1}% = {value1} ਦਿੱਤਾ ਹੈ।",
          "ਉਸੇ ਸੰਖਿਆ ਦਾ {rate2}% ਕੱਢਣਾ ਹੈ।",
          "ਲੋੜੀਂਦਾ ਮੁੱਲ = {value1} x {rate2} / {rate1} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਸੰਖਿਆ ਦਾ {rate1}% = {value1} ਦਿੱਤਾ ਹੈ।",
            "ਉਸੇ ਸੰਖਿਆ ਦਾ {rate2}% ਕੱਢਣਾ ਹੈ।",
            "ਲੋੜੀਂਦਾ ਮੁੱਲ = {value1} x {rate2} / {rate1} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "{rate1}% ਲਈ ਮੁੱਲ {value1} ਦਿੱਤਾ ਹੈ।",
            "ਹੁਣ ਇਸੇ ਆਧਾਰ ਉੱਤੇ {rate2}% ਕੱਢੋ।",
            "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੁੱਲ = {value1} x {rate2} / {rate1} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      differenceOfPercents: {
        steps: [
          "{rate1}% ਅਤੇ {rate2}% ਦਾ ਫਰਕ {percentDifference}% ਹੈ।",
          "ਇਹੀ ਫਰਕ {value} ਦੇ ਬਰਾਬਰ ਹੈ।",
          "ਮੂਲ ਸੰਖਿਆ = {value} x 100 / {percentDifference} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "{rate1}% ਅਤੇ {rate2}% ਦਾ ਫਰਕ {percentDifference}% ਹੈ।",
            "ਇਹੀ ਫਰਕ {value} ਦੇ ਬਰਾਬਰ ਹੈ।",
            "ਮੂਲ ਸੰਖਿਆ = {value} x 100 / {percentDifference} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਦੋਵੇਂ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦਾ ਖਾਲਿਸ ਫਰਕ {percentDifference}% ਹੈ।",
            "ਸੰਖਿਆ ਲਈ ਇਹ ਫਰਕ {value} ਦਿੱਤਾ ਹੈ।",
            "ਇਸ ਲਈ ਮੂਲ ਸੰਖਿਆ = {value} x 100 / {percentDifference} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      restoreAfterDecrease: {
        steps: [
          "{percentageRate}% ਕਮੀ ਤੋਂ ਬਾਅਦ {remainingBase}% ਮੁੱਲ ਬਚਦਾ ਹੈ।",
          "ਪੁਰਾਣੇ ਮੁੱਲ ਤੱਕ ਵਾਪਸ ਜਾਣ ਲਈ ਲੋੜੀਂਦਾ ਵਾਧਾ ਕੱਢੋ।",
          "ਲੋੜੀਂਦਾ ਵਾਧਾ = {percentageRate} x 100 / {remainingBase} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "{percentageRate}% ਕਮੀ ਤੋਂ ਬਾਅਦ {remainingBase}% ਮੁੱਲ ਬਚਦਾ ਹੈ।",
            "ਪੁਰਾਣੇ ਮੁੱਲ ਤੱਕ ਵਾਪਸ ਜਾਣ ਲਈ ਲੋੜੀਂਦਾ ਵਾਧਾ ਕੱਢੋ।",
            "ਲੋੜੀਂਦਾ ਵਾਧਾ = {percentageRate} x 100 / {remainingBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਕਮੀ ਤੋਂ ਬਾਅਦ ਕੇਵਲ {remainingBase}% ਮੁੱਲ ਰਹਿੰਦਾ ਹੈ।",
            "ਹੁਣ ਪੁਰਾਣੇ ਮੁੱਲ ਲਈ ਉਲਟ ਵਾਧਾ ਲੱਗੇਗਾ।",
            "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਵਾਧਾ = {percentageRate} x 100 / {remainingBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
    },
    "PCT-CP-003": {
      successiveChange: {
        steps: [
          "ਪਹਿਲੇ ਬਦਲਾਅ ਦਾ ਗੁਣਕ {firstFactor} ਹੈ।",
          "ਦੂਜੇ ਬਦਲਾਅ ਦਾ ਗੁਣਕ {secondFactor} ਹੈ।",
          "ਖਾਲਿਸ ਗੁਣਕ = {netFactor}। ਅਤੇ ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਪਹਿਲੇ ਬਦਲਾਅ ਦਾ ਗੁਣਕ {firstFactor} ਹੈ।",
            "ਦੂਜੇ ਬਦਲਾਅ ਦਾ ਗੁਣਕ {secondFactor} ਹੈ।",
            "ਖਾਲਿਸ ਗੁਣਕ = {netFactor}। ਅਤੇ ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਗੁਣਕ {firstFactor} ਹੈ।",
            "ਦੂਜੇ ਪੜਾਅ ਦਾ ਗੁਣਕ {secondFactor} ਹੈ।",
            "ਦੋਵੇਂ ਮਿਲਾ ਕੇ ਖਾਲਿਸ ਗੁਣਕ {netFactor} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਬਦਲਾਅ {answer} ਹੈ।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      compoundGrowth: {
        steps: [
          "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ {initialValue} ਹੈ।",
          "ਇੱਕ ਪੜਾਅ ਦਾ ਵਾਧਾ ਗੁਣਕ {singleFactor} ਹੈ।",
          "ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ {initialValue} ਹੈ।",
            "ਇੱਕ ਪੜਾਅ ਦਾ ਵਾਧਾ ਗੁਣਕ {singleFactor} ਹੈ।",
            "ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਮੁੱਢਲਾ ਮੁੱਲ {initialValue} ਦਿੱਤਾ ਹੈ।",
            "ਹਰ ਪੜਾਅ ਵਿੱਚ ਇੱਕੋ ਵਾਧਾ ਗੁਣਕ {singleFactor} ਲੱਗੇਗਾ।",
            "ਅਤੇ ਇਸ ਲਈ ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      compoundDecay: {
        steps: [
          "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ {initialValue} ਹੈ।",
          "ਇੱਕ ਪੜਾਅ ਦਾ ਕਮੀ ਗੁਣਕ {singleFactor} ਹੈ।",
          "ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ {initialValue} ਹੈ।",
            "ਇੱਕ ਪੜਾਅ ਦਾ ਕਮੀ ਗੁਣਕ {singleFactor} ਹੈ।",
            "ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਮੁੱਢਲਾ ਮੁੱਲ {initialValue} ਦਿੱਤਾ ਹੈ।",
            "ਹਰ ਪੜਾਅ ਵਿੱਚ ਇੱਕੋ ਕਮੀ ਗੁਣਕ {singleFactor} ਲੱਗੇਗਾ।",
            "ਅਤੇ ਇਸ ਲਈ ਦੋ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਮੁੱਲ = {initialValue} x {singleFactor} x {singleFactor} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      squareAreaChange: {
        steps: [
          "ਭੁਜਾ ਵਿੱਚ {percentageRate}% ਬਦਲਾਅ ਹੋਇਆ ਹੈ।",
          "ਖੇਤਰਫਲ ਭੁਜਾ ਦੇ ਵਰਗ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਗੁਣਕ = {singleFactor} x {singleFactor}।",
          "ਅਤੇ ਇਸ ਲਈ ਖੇਤਰਫਲ ਦਾ ਖਾਲਿਸ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਭੁਜਾ ਵਿੱਚ {percentageRate}% ਬਦਲਾਅ ਹੋਇਆ ਹੈ।",
            "ਖੇਤਰਫਲ ਭੁਜਾ ਦੇ ਵਰਗ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਗੁਣਕ = {singleFactor} x {singleFactor}।",
            "ਅਤੇ ਇਸ ਲਈ ਖੇਤਰਫਲ ਦਾ ਖਾਲਿਸ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਭੁਜਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਪਹਿਲਾਂ ਉਸਦਾ ਗੁਣਕ {singleFactor} ਲਓ।",
            "ਕਿਉਂਕਿ ਖੇਤਰਫਲ ਭੁਜਾ ਦੇ ਵਰਗ ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ, ਇਸ ਲਈ {singleFactor} x {singleFactor} ਲਿਆ ਜਾਵੇਗਾ।",
            "ਇਸ ਨਾਲ ਖੇਤਰਫਲ ਦਾ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ {answer} ਮਿਲਦਾ ਹੈ।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
    },
    "PCT-CP-004": {
      productInvariance: {
        steps: [
          "ਇੱਥੇ ਗੁਣਨਫਲ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ।",
          "ਜੇ ਇੱਕ ਘਟਕ ਵਿੱਚ {percentageRate}% ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਦੂਜੇ ਘਟਕ ਵਿੱਚ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਦਲਾਅ ਲੈਣਾ ਪੈਂਦਾ ਹੈ।",
          "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ = {percentageRate} x 100 / {changedBase} = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਇੱਥੇ ਗੁਣਨਫਲ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ।",
            "ਜੇ ਇੱਕ ਘਟਕ ਵਿੱਚ {percentageRate}% ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਦੂਜੇ ਘਟਕ ਵਿੱਚ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਬਦਲਾਅ ਲੈਣਾ ਪੈਂਦਾ ਹੈ।",
            "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ = {percentageRate} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਇਸ ਕਿਸਮ ਦੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁੱਲ ਗੁਣਨਫਲ ਇਕੋ ਜਿਹਾ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
            "ਇੱਕ ਭਾਗ ਵਿੱਚ {percentageRate}% ਬਦਲਾਅ ਹੋਣ ਤੇ ਦੂਜੇ ਭਾਗ ਵਿੱਚ ਉਲਟੀ ਦਿਸ਼ਾ ਵਾਲਾ ਸਮਾਂਜਸਿਆ ਲੱਗਦਾ ਹੈ।",
            "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ = {percentageRate} x 100 / {changedBase} = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      revenueChange: {
        steps: [
          "ਕੁੱਲ ਆਮਦਨ ਕੀਮਤ ਅਤੇ ਵਿਕਰੀ ਮਾਤਰਾ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
          "ਕੀਮਤ ਦਾ ਗੁਣਕ = {firstFactor} ਅਤੇ ਮਾਤਰਾ ਦਾ ਗੁਣਕ = {secondFactor}।",
          "ਖਾਲਿਸ ਗੁਣਕ = {netFactor}। ਅਤੇ ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਕੁੱਲ ਆਮਦਨ ਕੀਮਤ ਅਤੇ ਵਿਕਰੀ ਮਾਤਰਾ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
            "ਕੀਮਤ ਦਾ ਗੁਣਕ = {firstFactor} ਅਤੇ ਮਾਤਰਾ ਦਾ ਗੁਣਕ = {secondFactor}।",
            "ਖਾਲਿਸ ਗੁਣਕ = {netFactor}। ਅਤੇ ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਰਿਵੈਨਿਊ ਕੱਢਣ ਲਈ ਕੀਮਤ ਅਤੇ ਵਿਕਰੀ ਦੋਵੇਂ ਨੂੰ ਇਕੱਠੇ ਦੇਖੋ।",
            "ਪਹਿਲਾ ਗੁਣਕ {firstFactor} ਅਤੇ ਦੂਜਾ ਗੁਣਕ {secondFactor} ਹੈ।",
            "ਦੋਵੇਂ ਮਿਲ ਕੇ ਖਾਲਿਸ ਗੁਣਕ {netFactor} ਦਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ {answer} ਹੈ।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
      circleAreaDecrease: {
        steps: [
          "ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ ਅਰਧ-ਵਿਆਸ ਦੇ ਵਰਗ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
          "ਨਵੇਂ ਅਰਧ-ਵਿਆਸ ਦਾ ਗੁਣਕ {singleFactor} ਹੈ।",
          "ਅਤੇ ਇਸ ਲਈ ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ = {answer}।",
          "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
          "ਉੱਤਰ {answer} ਹੈ।",
        ],
        variants: [
          [
            "ਵ੍ਰਿਤ ਦਾ ਖੇਤਰਫਲ ਅਰਧ-ਵਿਆਸ ਦੇ ਵਰਗ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
            "ਨਵੇਂ ਅਰਧ-ਵਿਆਸ ਦਾ ਗੁਣਕ {singleFactor} ਹੈ।",
            "ਅਤੇ ਇਸ ਲਈ ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ = {answer}।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਉੱਤਰ {answer} ਹੈ।",
          ],
          [
            "ਅਰਧ-ਵਿਆਸ ਘਟਣ ਤੋਂ ਬਾਅਦ ਪਹਿਲਾਂ ਉਸਦਾ ਨਵਾਂ ਗੁਣਕ {singleFactor} ਲਓ।",
            "ਕਿਉਂਕਿ ਖੇਤਰਫਲ ਅਰਧ-ਵਿਆਸ ਦੇ ਵਰਗ ਨਾਲ ਬਦਲਦਾ ਹੈ, ਇਸੇ ਅਧਾਰ ਤੇ ਨਵਾਂ ਖੇਤਰਫਲ ਨਿਕਲੇਗਾ।",
            "ਇਸ ਲਈ ਖੇਤਰਫਲ ਵਿੱਚ ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ {answer} ਹੈ।",
            "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
            "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।",
          ],
        ],
      },
    },
  },
};

for (const [language, cpMap] of Object.entries(localizedTaskSets)) {
  const filePath = path.join(baseDir, `explanation.${language}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const [cpId, taskMap] of Object.entries(cpMap)) {
    for (const [taskKind, content] of Object.entries(taskMap)) {
      data[cpId].taskExplanations[taskKind] = content;
    }
  }
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
