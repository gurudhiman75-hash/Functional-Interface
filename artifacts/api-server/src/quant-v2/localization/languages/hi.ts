import type { LanguageRenderer } from "../contracts/language-contracts";
import type {
  EditorialIntent,
  EditorialIntentKey,
} from "../intents/editorial-intents";

const LABELS: Partial<Record<EditorialIntentKey, string>> = {
  "label.vote_margin": "जीत का अंतर",
  "label.vote_difference": "वोटों का अंतर",
  "label.valid_votes": "कुल वैध वोट",
  "label.total_votes": "कुल वोट",
  "label.registered_voters": "कुल पंजीकृत मतदाता",
  "label.pass_mark_gap": "पास अंक का अंतर",
  "label.total_marks_gap": "अंकों का कुल अंतर",
  "label.percentage_gap": "प्रतिशत अंतर",
  "label.required_percentage_gap": "आवश्यक प्रतिशत अंतर",
  "label.maximum_marks": "अधिकतम अंक",
  "label.marks_secured": "प्राप्त अंक",
  "label.population_after_growth": "वृद्धि के बाद जनसंख्या",
  "label.population_after_reduction": "कमी के बाद जनसंख्या",
  "label.population_added_migration": "प्रवास से जोड़ी गई जनसंख्या",
  "label.final_population": "अंतिम जनसंख्या",
  "label.male_population": "पुरुष जनसंख्या",
  "label.female_population": "महिला जनसंख्या",
  "label.new_price": "नई कीमत",
  "label.new_consumption": "नई खपत",
  "label.reduction_consumption": "खपत में कमी",
  "label.salary_difference": "वेतन में बदलाव",
  "label.percentage_change": "प्रतिशत परिवर्तन",
  "label.profit_amount": "लाभ",
  "label.loss_amount": "हानि",
  "label.profit_percentage": "लाभ प्रतिशत",
  "label.loss_percentage": "हानि प्रतिशत",
  "label.final_value": "अंतिम मान",
  "label.value_after_first_change": "पहले बदलाव के बाद मान",
  "label.remaining_value": "बचा हुआ भाग",
  "label.required_increase": "आवश्यक वृद्धि",
  "label.total_value": "कुल मान",
  "label.unchanged_quantity": "अपरिवर्तित मात्रा",
  "label.final_mixture": "अंतिम मिश्रण",
  "label.quantity_to_add": "जोड़ी जाने वाली मात्रा",
  "label.required_difference": "आवश्यक अंतर",
  "label.required_value": "आवश्यक मान",
};

const TRANSITIONS: Partial<Record<EditorialIntentKey, string>> = {
  "transition.therefore": "इसलिए,",
  "transition.hence": "अतः,",
  "transition.so": "तो,",
  "transition.thus": "इस प्रकार,",
  "transition.accordingly": "अतः,",
};

function label(intent: EditorialIntent) {
  return LABELS[intent.key] ?? intent.fallbackText;
}

function labelLine(intent: EditorialIntent) {
  const suffix = intent.params?.suffix === "=" ? " =" : ":";
  if (intent.key === "label.vote_margin" && suffix === " =") {
    return `मार्जिन प्रतिशत${suffix}`;
  }
  if (intent.key === "label.remaining_value" && suffix === " =") {
    return `बचा हुआ भाग${suffix}`;
  }
  if (intent.key === "label.required_increase" && suffix === " =") {
    return `वृद्धि प्रतिशत${suffix}`;
  }
  if (intent.key === "label.unchanged_quantity" && suffix === " =") {
    return `स्थिर मात्रा${suffix}`;
  }
  if (intent.key === "label.quantity_to_add" && /milk/iu.test(intent.sourceText)) {
    return `जोड़ा जाने वाला दूध${suffix}`;
  }
  return `${label(intent)}${suffix}`;
}

function localizeSemantic(value: string) {
  return value
    .replace(/ more$/u, " अधिक")
    .replace(/ less$/u, " कम")
    .replace(/ increase$/u, " वृद्धि")
    .replace(/ decrease$/u, " कमी")
    .replace(/ reduction$/u, " कमी")
    .replace(/ profit$/u, " लाभ")
    .replace(/ loss$/u, " हानि");
}

function ending(intent: EditorialIntent) {
  const value = localizeSemantic(String(intent.params?.value ?? ""));
  const sourceLabel = String(intent.params?.label ?? intent.sourceText ?? "");
  if (intent.params?.prefix === "=") {
    const semantic =
      intent.params.semantic === "increase"
        ? "वृद्धि"
        : intent.params.semantic === "decrease" ||
            intent.params.semantic === "reduction"
          ? "कमी"
          : intent.params.semantic === "profit"
            ? "लाभ"
            : intent.params.semantic === "loss"
              ? "हानि"
              : "";
    return `= ${value}${semantic ? ` ${semantic}` : ""}`;
  }
  const baseLabel =
    intent.key === "ending.final_answer"
      ? "आवश्यक उत्तर"
      : intent.key === "ending.total_votes"
        ? "कुल वोट"
        : intent.key === "ending.registered_voters"
          ? "पंजीकृत मतदाता"
          : intent.key === "ending.maximum_marks"
            ? "अधिकतम अंक"
            : intent.key === "ending.final_population"
              ? "अंतिम जनसंख्या"
              : intent.key === "ending.required_percentage" &&
                  /required increase|increase needed|required increase %/iu.test(sourceLabel)
                ? "आवश्यक वृद्धि"
                : intent.key === "ending.required_percentage"
                  ? "आवश्यक प्रतिशत"
                  : "आवश्यक मान";
  return `${baseLabel} = ${value}`;
}

function shortcut(intent: EditorialIntent) {
  const noun =
    intent.params?.noun === "votes"
      ? "वोट"
      : intent.params?.noun === "marks"
        ? "अंक"
        : intent.params?.noun === "population"
          ? "जनसंख्या"
          : intent.params?.noun === "quantity"
            ? "मात्रा"
            : "मान";
  const prefix = `${intent.params?.percent}% ${noun}`;
  return intent.params?.suffix === "="
    ? `${prefix} =`
    : `${prefix} = ${intent.params?.value ?? ""}`;
}

export const hindiRenderer: LanguageRenderer = {
  language: "hi",
  renderIntent(intent: EditorialIntent) {
    if (intent.kind === "blank" || intent.kind === "equation") {
      return intent.sourceText;
    }
    if (intent.key === "shortcut.heading") {
      return "शॉर्टकट:";
    }
    if (intent.kind === "shortcut") {
      return shortcut(intent);
    }
    if (intent.key === "narration.after_increase") {
      return `${intent.params?.percent}% वृद्धि के बाद:`;
    }
    if (intent.key === "narration.after_decrease") {
      return `${intent.params?.percent}% कमी के बाद:`;
    }
    if (intent.key === "narration.after_price_increase") {
      return `${intent.params?.percent}% कीमत बढ़ने के बाद:`;
    }
    if (intent.key === "narration.same_expenditure") {
      return "समान खर्च के लिए:";
    }
    if (intent.key === "narration.water_unchanged") {
      return "पानी की मात्रा समान रहेगी।";
    }
    if (intent.key === "narration.fixed_quantity_unchanged") {
      return "पानी की मात्रा समान रहेगी:";
    }
    if (intent.key === "narration.target_mixture") {
      return "लक्ष्य मिश्रण के लिए:";
    }
    if (intent.key === "narration.remaining_value") {
      return "कमी के बाद बचा हुआ भाग:";
    }
    if (intent.key === "narration.full_value") {
      return "100% मान:";
    }
    if (intent.key === "narration.original_value") {
      return "मूल मान:";
    }
    if (intent.key === "narration.shortcut_so") {
      return "तो,";
    }
    if (intent.key === "narration.combined_difference") {
      return "दोनों को मिलाकर:";
    }
    if (intent.key === "narration.direct_relation") {
      return "सीधा संबंध:";
    }
    if (intent.key === "narration.percentage_relation") {
      return "अगला प्रतिशत संबंध लगाएं:";
    }
    if (intent.key === "narration.after_bonus") {
      return "बोनस जोड़ने के बाद:";
    }
    if (intent.key === "narration.growth_period") {
      return `${intent.params?.years} वर्षों तक वृद्धि लागू होती है।`;
    }
    if (intent.kind === "transition") {
      return TRANSITIONS[intent.key] ?? intent.fallbackText;
    }
    if (intent.kind === "ending") {
      return ending(intent);
    }
    if (intent.kind === "label") {
      return labelLine(intent);
    }
    return intent.fallbackText;
  },
};
