import type { SvgEmphasis, SvgThemeName } from "../contracts/svg-visualization-types";

export interface SvgTheme {
  name: SvgThemeName;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  cardStroke: string;
  equation: string;
  accent: string;
  shortcut: string;
  hiddenBase: string;
  answer: string;
  fontFamily: string;
}

const THEMES: Record<SvgThemeName, SvgTheme> = {
  coaching_board: {
    name: "coaching_board",
    background: "#f7fbf8",
    foreground: "#1f2a24",
    muted: "#607067",
    card: "#ffffff",
    cardStroke: "#9fb7aa",
    equation: "#10251b",
    accent: "#1f7a4f",
    shortcut: "#fff8df",
    hiddenBase: "#eef4ff",
    answer: "#eaf7ef",
    fontFamily: "Arial, Noto Sans Devanagari, Noto Sans Gurmukhi, sans-serif",
  },
  exam_sheet: {
    name: "exam_sheet",
    background: "#ffffff",
    foreground: "#202020",
    muted: "#666666",
    card: "#ffffff",
    cardStroke: "#cfcfcf",
    equation: "#111111",
    accent: "#2f5d8c",
    shortcut: "#f8f8f8",
    hiddenBase: "#f3f6fa",
    answer: "#f1f8f3",
    fontFamily: "Arial, Noto Sans Devanagari, Noto Sans Gurmukhi, sans-serif",
  },
  classroom_whiteboard: {
    name: "classroom_whiteboard",
    background: "#fbfcfa",
    foreground: "#263126",
    muted: "#5c665d",
    card: "#ffffff",
    cardStroke: "#b8c5b9",
    equation: "#1f2b20",
    accent: "#466a4d",
    shortcut: "#fffceb",
    hiddenBase: "#f0f5ff",
    answer: "#edf8ed",
    fontFamily: "Arial, Noto Sans Devanagari, Noto Sans Gurmukhi, sans-serif",
  },
};

export function getSvgTheme(name: SvgThemeName = "coaching_board") {
  return THEMES[name];
}

export function nodeFill(theme: SvgTheme, emphasis: SvgEmphasis) {
  if (emphasis === "shortcut") {
    return theme.shortcut;
  }
  if (emphasis === "hidden_base") {
    return theme.hiddenBase;
  }
  if (emphasis === "answer") {
    return theme.answer;
  }
  return theme.card;
}

