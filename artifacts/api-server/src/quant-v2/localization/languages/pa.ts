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
  "label.total_marks_gap": "ਅੰਕਾਂ ਦਾ ਕੁੱਲ ਅੰਤਰ",
  "label.percentage_gap": "ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ",
  "label.required_percentage_gap": "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ ਅੰਤਰ",
  "label.maximum_marks": "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ",
  "label.marks_secured": "ਪ੍ਰਾਪਤ ਅੰਕ",
  "label.population_after_growth": "ਵਾਧੇ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ",
  "label.population_after_reduction": "ਕਮੀ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ",
  "label.population_added_migration": "ਪਰਵਾਸ ਨਾਲ ਜੋੜੀ ਗਈ ਆਬਾਦੀ",
  "label.final_population": "ਅੰਤਿਮ ਆਬਾਦੀ",
  "label.male_population": "ਮਰਦ ਆਬਾਦੀ",
  "label.female_population": "ਔਰਤ ਆਬਾਦੀ",
  "label.new_price": "ਨਵੀਂ ਕੀਮਤ",
  "label.new_consumption": "ਨਵੀਂ ਖਪਤ",
  "label.reduction_consumption": "ਖਪਤ ਵਿੱਚ ਕਮੀ",
  "label.increase_consumption": "ਖਪਤ ਵਿੱਚ ਵਾਧਾ",
  "label.consumption_change": "ਖਪਤ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ",
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
  "label.price_increase_multiplier": "ਕੀਮਤ ਵਾਧਾ ਗੁਣਕ",
  "label.expenditure_difference": "ਪ੍ਰਤੀ ਯੂਨਿਟ ਖਰਚੇ ਦਾ ਅੰਤਰ",
  "label.new_price_level": "ਨਵਾਂ ਕੀਮਤ ਪੱਧਰ",
  "label.new_expenditure_level": "ਨਵਾਂ ਖਰਚਾ ਪੱਧਰ",
  "label.permissible_consumption_ratio": "ਪ੍ਰਵਾਨਯੋਗ ਖਪਤ ਅਨੁਪਾਤ",
  "label.net_consumption_reduction": "ਸ਼ੁੱਧ ਖਪਤ ਵਿੱਚ ਕਮੀ",
  "label.new_price_index": "ਨਵਾਂ ਕੀਮਤ ਸੂਚਕਾਂਕ",
  "label.new_expenditure_index": "ਨਵਾਂ ਖਰਚਾ ਸੂਚਕਾਂਕ",
  "label.consumption_gap": "ਖਪਤ ਦਾ ਅੰਤਰ",
  "label.permissible_consumption": "ਪ੍ਰਵਾਨਯੋਗ ਖਪਤ",
  "label.percentage_at_least_one": "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿਸ਼ੇ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ",
  "label.percentage_neither": "ਦੋਵਾਂ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਪਾਸ / ਕਿਸੇ ਵਿੱਚ ਫੇਲ੍ਹ ਨਹੀਂ ਪ੍ਰਤੀਸ਼ਤ",
  "label.total_students": "ਕੁੱਲ ਵਿਦਿਆਰਥੀ",
  "label.tax_rate_difference": "ਟੈਕਸ ਦਰ ਦਾ ਅੰਤਰ",
  "label.total_tax_difference": "ਕੁੱਲ ਟੈਕਸ ਦਾ ਅੰਤਰ",
  "label.tax_decrease": "ਟੈਕਸ ਵਿੱਚ ਕਮੀ",
  "label.taxable_income": "ਕੁੱਲ ਕਰਯੋਗ ਆਮਦਨ",
  "label.commission_on_base": "ਆਧਾਰ ਵਿਕਰੀ 'ਤੇ ਕਮਿਸ਼ਨ",
  "label.excess_commission": "ਆਧਾਰ ਤੋਂ ਉੱਪਰ ਕਮਿਸ਼ਨ",
  "label.excess_sales": "ਆਧਾਰ ਤੋਂ ਉੱਪਰ ਵਾਧੂ ਵਿਕਰੀ",
  "label.commission_on_excess": "ਵਾਧੂ ਵਿਕਰੀ 'ਤੇ ਕਮਿਸ਼ਨ",
  "label.effective_commission_rate": "ਵਾਧੂ ਵਿਕਰੀ ਉੱਤੇ ਪ੍ਰਭਾਵੀ ਕਮਿਸ਼ਨ ਦਰ",
  "label.base_commission": "ਆਧਾਰ ਕਮਿਸ਼ਨ",
  "label.bonus_commission": "ਬੋਨਸ ਕਮਿਸ਼ਨ",
  "label.total_commission": "ਕੁੱਲ ਕਮਿਸ਼ਨ",
  "label.total_sales": "ਕੁੱਲ ਵਿਕਰੀ",
  "label.combined_total": "ਸੰਯੁਕਤ ਕੁੱਲ",
};

const TRANSITIONS: Partial<Record<EditorialIntentKey, string>> = {
  "transition.therefore": "ਇਸ ਲਈ,",
  "transition.hence": "ਇਸ ਲਈ,",
  "transition.so": "ਤਾਂ,",
  "transition.thus": "ਇਸ ਤਰ੍ਹਾਂ,",
  "transition.accordingly": "ਇਸ ਅਨੁਸਾਰ,",
  "transition.now": "ਹੁਣ,",
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
  const sourceLabel = String(intent.params?.label ?? intent.sourceText ?? "");
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
        : intent.key === "ending.registered_voters"
          ? "ਰਜਿਸਟਰਡ ਵੋਟਰ"
          : intent.key === "ending.maximum_marks"
            ? "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ"
            : intent.key === "ending.final_population"
              ? "ਅੰਤਿਮ ਆਬਾਦੀ"
              : intent.key === "ending.required_percentage" &&
                  /required increase|increase needed|required increase %/iu.test(sourceLabel)
                ? "ਲੋੜੀਂਦਾ ਵਾਧਾ"
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
      return "ਸੰਖੇਪ ਵਿਧੀ:";
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
      return "ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਇੱਕੋ ਰਹੇਗੀ।";
    }
    if (intent.key === "narration.fixed_quantity_unchanged") {
      return "ਪਾਣੀ ਦੀ ਮਾਤਰਾ ਇੱਕੋ ਰਹੇਗੀ:";
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
      return `ਵਾਧਾ ${intent.params?.years} ਸਾਲਾਂ ਲਈ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।`;
    }
    if (intent.key === "narration.add_parts") {
      return "ਹਿੱਸਿਆਂ ਨੂੰ ਜੋੜੋ।";
    }
    if (intent.key === "narration.combined_value") {
      return "ਸੰਯੁਕਤ ਮੁੱਲ ਹੈ:";
    }
    if (intent.key === "narration.total_parts") {
      return "ਇਹਨਾਂ ਹਿੱਸਿਆਂ ਦਾ ਕੁੱਲ ਜੋੜ ਹੈ:";
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
