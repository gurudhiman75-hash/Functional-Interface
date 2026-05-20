import type { LanguageRenderer } from "../contracts/language-contracts";
import type {
  EditorialIntent,
  EditorialIntentKey,
} from "../intents/editorial-intents";

const LABELS: Partial<Record<EditorialIntentKey, string>> = {
  "label.vote_margin": "ਜਿੱਤ ਦਾ ਅੰਤਰ",
  "label.vote_difference": "ਵੋਟਾਂ ਦਾ ਅੰਤਰ",
  "label.valid_votes": "ਕੁੱਲ ਯੋਗ ਵੋਟ",
  "label.total_votes": "ਕੁੱਲ ਵੋਟ",
  "label.registered_voters": "ਕੁੱਲ ਰਜਿਸਟਰਡ ਵੋਟਰ",
  "label.pass_mark_gap": "ਪਾਸ ਅੰਕਾਂ ਦਾ ਅੰਤਰ",
  "label.maximum_marks": "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ",
  "label.marks_secured": "ਪ੍ਰਾਪਤ ਅੰਕ",
  "label.population_after_growth": "ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ",
  "label.population_after_reduction": "ਕਮੀ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ",
  "label.final_population": "ਅੰਤਿਮ ਆਬਾਦੀ",
  "label.male_population": "ਮਰਦ ਆਬਾਦੀ",
  "label.female_population": "ਔਰਤ ਆਬਾਦੀ",
  "label.new_price": "ਨਵੀਂ ਕੀਮਤ",
  "label.new_consumption": "ਨਵੀਂ ਖਪਤ",
  "label.reduction_consumption": "ਖਪਤ ਵਿੱਚ ਕਮੀ",
  "label.salary_difference": "ਤਨਖਾਹ ਵਿੱਚ ਬਦਲਾਅ",
  "label.percentage_change": "ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ",
  "label.profit_amount": "ਲਾਭ",
  "label.loss_amount": "ਨੁਕਸਾਨ",
  "label.profit_percentage": "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ",
  "label.loss_percentage": "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ",
  "label.final_value": "ਅੰਤਿਮ ਮੁੱਲ",
  "label.value_after_first_change": "ਪਹਿਲੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਮੁੱਲ",
  "label.remaining_value": "ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ",
  "label.required_increase": "ਲੋੜੀਂਦਾ ਵਾਧਾ",
  "label.total_value": "ਕੁੱਲ ਮੁੱਲ",
  "label.unchanged_quantity": "ਅਣਬਦਲੀ ਮਾਤਰਾ",
  "label.final_mixture": "ਅੰਤਿਮ ਮਿਸ਼ਰਣ",
  "label.quantity_to_add": "ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਮਾਤਰਾ",
  "label.required_difference": "ਲੋੜੀਂਦਾ ਅੰਤਰ",
  "label.required_value": "ਲੋੜੀਂਦਾ ਮੁੱਲ",
};

const TRANSITIONS: Partial<Record<EditorialIntentKey, string>> = {
  "transition.therefore": "ਇਸ ਲਈ,",
  "transition.hence": "ਅਤੇ ਇਸ ਲਈ,",
  "transition.so": "ਸੋ,",
  "transition.thus": "ਇਸ ਤਰ੍ਹਾਂ,",
  "transition.accordingly": "ਇਸ ਅਨੁਸਾਰ,",
};

function label(intent: EditorialIntent) {
  return LABELS[intent.key] ?? intent.fallbackText;
}

function labelLine(intent: EditorialIntent) {
  const suffix = intent.params?.suffix === "=" ? " =" : ":";
  if (intent.key === "label.vote_margin" && suffix === " =") {
    return `ਮਾਰਜਿਨ ਪ੍ਰਤੀਸ਼ਤ${suffix}`;
  }
  if (intent.key === "label.remaining_value" && suffix === " =") {
    return `ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ${suffix}`;
  }
  if (intent.key === "label.required_increase" && suffix === " =") {
    return `ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ${suffix}`;
  }
  if (intent.key === "label.unchanged_quantity" && suffix === " =") {
    return `ਸਥਿਰ ਮਾਤਰਾ${suffix}`;
  }
  if (intent.key === "label.quantity_to_add" && /milk/iu.test(intent.sourceText)) {
    return `ਜੋੜਿਆ ਜਾਣ ਵਾਲਾ ਦੁੱਧ${suffix}`;
  }
  return `${label(intent)}${suffix}`;
}

function localizeSemantic(value: string) {
  return value
    .replace(/ more$/u, " ਵੱਧ")
    .replace(/ less$/u, " ਘੱਟ")
    .replace(/ increase$/u, " ਵਾਧਾ")
    .replace(/ decrease$/u, " ਕਮੀ")
    .replace(/ reduction$/u, " ਕਮੀ")
    .replace(/ profit$/u, " ਲਾਭ")
    .replace(/ loss$/u, " ਨੁਕਸਾਨ");
}

function ending(intent: EditorialIntent) {
  const value = localizeSemantic(String(intent.params?.value ?? ""));
  if (intent.params?.prefix === "=") {
    const semantic =
      intent.params.semantic === "increase"
        ? "ਵਾਧਾ"
        : intent.params.semantic === "decrease" ||
            intent.params.semantic === "reduction"
          ? "ਕਮੀ"
          : intent.params.semantic === "profit"
            ? "ਲਾਭ"
            : intent.params.semantic === "loss"
              ? "ਨੁਕਸਾਨ"
              : "";
    return `= ${value}${semantic ? ` ${semantic}` : ""}`;
  }
  const baseLabel =
    intent.key === "ending.final_answer"
      ? "ਲੋੜੀਂਦਾ ਉੱਤਰ"
      : intent.key === "ending.total_votes"
        ? "ਕੁੱਲ ਵੋਟ"
        : intent.key === "ending.maximum_marks"
          ? "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ"
          : intent.key === "ending.final_population"
            ? "ਅੰਤਿਮ ਆਬਾਦੀ"
            : intent.key === "ending.required_percentage"
              ? "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ"
              : "ਲੋੜੀਂਦਾ ਮੁੱਲ";
  return `${baseLabel} = ${value}`;
}

function shortcut(intent: EditorialIntent) {
  const noun =
    intent.params?.noun === "votes"
      ? "ਵੋਟ"
      : intent.params?.noun === "marks"
        ? "ਅੰਕ"
        : intent.params?.noun === "population"
          ? "ਆਬਾਦੀ"
          : intent.params?.noun === "quantity"
            ? "ਮਾਤਰਾ"
            : "ਮੁੱਲ";
  const prefix = `${intent.params?.percent}% ${noun}`;
  return intent.params?.suffix === "="
    ? `${prefix} =`
    : `${prefix} = ${intent.params?.value ?? ""}`;
}

export const punjabiRenderer: LanguageRenderer = {
  language: "pa",
  renderIntent(intent: EditorialIntent) {
    if (intent.kind === "blank" || intent.kind === "equation") {
      return intent.sourceText;
    }
    if (intent.key === "shortcut.heading") {
      return "ਸ਼ਾਰਟਕੱਟ:";
    }
    if (intent.kind === "shortcut") {
      return shortcut(intent);
    }
    if (intent.key === "narration.after_increase") {
      return `${intent.params?.percent}% ਵਾਧੇ ਤੋਂ ਬਾਅਦ:`;
    }
    if (intent.key === "narration.after_decrease") {
      return `${intent.params?.percent}% ਕਮੀ ਤੋਂ ਬਾਅਦ:`;
    }
    if (intent.key === "narration.after_price_increase") {
      return `${intent.params?.percent}% ਕੀਮਤ ਵਧਣ ਤੋਂ ਬਾਅਦ:`;
    }
    if (intent.key === "narration.same_expenditure") {
      return "ਉਸੇ ਖਰਚ ਲਈ:";
    }
    if (intent.key === "narration.water_unchanged") {
      return "ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਇਕੋ ਰਹਿੰਦੀ ਹੈ।";
    }
    if (intent.key === "narration.fixed_quantity_unchanged") {
      return "ਸਥਿਰ ਮਾਤਰਾ ਇਕੋ ਰਹਿੰਦੀ ਹੈ:";
    }
    if (intent.key === "narration.target_mixture") {
      return "ਲਕਸ਼ ਮਿਸ਼ਰਣ ਲਈ:";
    }
    if (intent.key === "narration.remaining_value") {
      return "ਕਮੀ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ:";
    }
    if (intent.key === "narration.full_value") {
      return "100% ਮੁੱਲ:";
    }
    if (intent.key === "narration.original_value") {
      return "ਮੂਲ ਮੁੱਲ:";
    }
    if (intent.key === "narration.shortcut_so") {
      return "ਸੋ,";
    }
    if (intent.key === "narration.combined_difference") {
      return "ਦੋਵੇਂ ਮਿਲਾ ਕੇ:";
    }
    if (intent.key === "narration.direct_relation") {
      return "ਸਿੱਧਾ ਸੰਬੰਧ:";
    }
    if (intent.key === "narration.percentage_relation") {
      return "ਅਗਲਾ ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਲਗਾਓ:";
    }
    if (intent.key === "narration.after_bonus") {
      return "ਬੋਨਸ ਜੋੜਨ ਤੋਂ ਬਾਅਦ:";
    }
    if (intent.key === "narration.growth_period") {
      return `${intent.params?.years} ਸਾਲਾਂ ਲਈ ਵਾਧਾ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।`;
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
