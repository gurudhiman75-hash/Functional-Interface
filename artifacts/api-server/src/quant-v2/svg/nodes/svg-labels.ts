import type { LanguageCode } from "../../localization/contracts/language-contracts";
import type { SvgVisualizationNodeType } from "../contracts/svg-visualization-types";

const EN_LABELS: Record<string, string> = {
  "svg.title.election": "Vote reasoning",
  "svg.title.mixture": "Mixture reasoning",
  "svg.title.pass_fail": "Marks reasoning",
  "svg.title.population": "Population reasoning",
  "svg.title.default": "Percentage reasoning",
  "svg.node.vote_margin": "Winning margin",
  "svg.node.valid_votes": "Effective valid votes",
  "svg.node.total_votes": "Total votes",
  "svg.node.pass_gap": "Pass mark gap",
  "svg.node.maximum_marks": "Maximum marks",
  "svg.node.population_projection": "Population projection",
  "svg.node.mixture_balance": "Mixture balance",
  "svg.node.reverse_percentage": "100% value",
  "svg.node.shortcut": "Shortcut",
  "svg.node.answer": "Answer",
  "svg.node.base_change": "Changed value",
  "svg.node.percentage_mapping": "Percentage relation",
  "svg.node.component": "Component relation",
  "svg.node.hidden_base": "Hidden base",
};

const HI_LABELS: Record<string, string> = {
  "svg.title.election": "वोट का हल",
  "svg.title.mixture": "मिश्रण का हल",
  "svg.title.pass_fail": "अंकों का हल",
  "svg.title.population": "जनसंख्या का हल",
  "svg.title.default": "प्रतिशत का हल",
  "svg.node.vote_margin": "जीत का अंतर",
  "svg.node.valid_votes": "कुल वैध वोट",
  "svg.node.total_votes": "कुल वोट",
  "svg.node.pass_gap": "पास अंक का अंतर",
  "svg.node.maximum_marks": "अधिकतम अंक",
  "svg.node.population_projection": "जनसंख्या प्रक्षेपण",
  "svg.node.mixture_balance": "मिश्रण संतुलन",
  "svg.node.reverse_percentage": "100% मान",
  "svg.node.shortcut": "शॉर्टकट",
  "svg.node.answer": "उत्तर",
  "svg.node.base_change": "बदला हुआ मान",
  "svg.node.percentage_mapping": "प्रतिशत संबंध",
  "svg.node.component": "घटक संबंध",
  "svg.node.hidden_base": "छिपा आधार",
};

const PA_LABELS: Record<string, string> = {
  "svg.title.election": "ਵੋਟਾਂ ਦਾ ਹੱਲ",
  "svg.title.mixture": "ਮਿਸ਼ਰਣ ਦਾ ਹੱਲ",
  "svg.title.pass_fail": "ਅੰਕਾਂ ਦਾ ਹੱਲ",
  "svg.title.population": "ਆਬਾਦੀ ਦਾ ਹੱਲ",
  "svg.title.default": "ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਹੱਲ",
  "svg.node.vote_margin": "ਜਿੱਤ ਦਾ ਅੰਤਰ",
  "svg.node.valid_votes": "ਕੁੱਲ ਯੋਗ ਵੋਟ",
  "svg.node.total_votes": "ਕੁੱਲ ਵੋਟ",
  "svg.node.pass_gap": "ਪਾਸ ਅੰਕਾਂ ਦਾ ਅੰਤਰ",
  "svg.node.maximum_marks": "ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ",
  "svg.node.population_projection": "ਆਬਾਦੀ ਅਨੁਮਾਨ",
  "svg.node.mixture_balance": "ਮਿਸ਼ਰਣ ਸੰਤੁਲਨ",
  "svg.node.reverse_percentage": "100% ਮੁੱਲ",
  "svg.node.shortcut": "ਸ਼ਾਰਟਕੱਟ",
  "svg.node.answer": "ਉੱਤਰ",
  "svg.node.base_change": "ਬਦਲਿਆ ਮੁੱਲ",
  "svg.node.percentage_mapping": "ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ",
  "svg.node.component": "ਘਟਕ ਸੰਬੰਧ",
  "svg.node.hidden_base": "ਲੁਕਿਆ ਆਧਾਰ",
};

function table(language: LanguageCode) {
  if (language === "hi") {
    return HI_LABELS;
  }
  if (language === "pa") {
    return PA_LABELS;
  }
  return EN_LABELS;
}

export function svgLabel(language: LanguageCode, key: string) {
  return table(language)[key] ?? EN_LABELS[key] ?? key;
}

export function titleKeyForCategory(category: string) {
  if (category === "election") {
    return "svg.title.election";
  }
  if (category === "mixture") {
    return "svg.title.mixture";
  }
  if (category === "population") {
    return "svg.title.population";
  }
  if (category === "comparison") {
    return "svg.title.pass_fail";
  }
  return "svg.title.default";
}

export function defaultNodeKey(type: SvgVisualizationNodeType) {
  switch (type) {
    case "shortcut_node":
      return "svg.node.shortcut";
    case "answer_confirmation_node":
      return "svg.node.answer";
    case "vote_filter_node":
      return "svg.node.valid_votes";
    case "hidden_base_node":
      return "svg.node.hidden_base";
    case "mixture_balance_node":
      return "svg.node.mixture_balance";
    case "population_projection_node":
      return "svg.node.population_projection";
    case "pass_fail_gap_node":
      return "svg.node.pass_gap";
    case "reverse_percentage_node":
      return "svg.node.reverse_percentage";
    case "component_aggregation_node":
      return "svg.node.component";
    case "base_change_node":
      return "svg.node.base_change";
    case "percentage_mapping_node":
    default:
      return "svg.node.percentage_mapping";
  }
}
