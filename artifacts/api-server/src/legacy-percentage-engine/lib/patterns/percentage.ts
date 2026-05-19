export const PERCENTAGE_PATTERNS = [
  {
    id: "percentage_growth",

    section: "quant",

    topic: "Percentage",

    subtopic: "Direct Percentage Increase",

    formula: "((b-a)/a)*100",

    variables: {
      a: {
        min: 100,
        max: 500,
      },

      b: {
        min: 120,
        max: 800,
      },
    },

    distractorStrategy:
      "percentageTrap",

    difficulty: "Easy",
  },

  {
    id: "percentage_decrease",

    section: "quant",

    topic: "Percentage",

    subtopic: "Direct Percentage Decrease",

    formula: "((a-b)/a)*100",

    variables: {
      a: {
        min: 200,
        max: 900,
      },

      b: {
        min: 100,
        max: 700,
      },
    },

    distractorStrategy:
      "wrongDenominator",

    difficulty: "Easy",
  },

  {
    id: "reverse_percentage_growth",

    section: "quant",

    topic: "Percentage",

    subtopic:
      "Reverse Percentage",

    formula: "b/(1+p/100)",

    variables: {
      b: {
        min: 200,
        max: 1200,
      },

      p: {
        min: 5,
        max: 40,
      },
    },

    distractorStrategy:
      "reverseTrap",

    difficulty: "Medium",
  },

  {
    id: "successive_percentage",

    section: "quant",

    topic: "Percentage",

    subtopic:
      "Successive Percentage Change",

    formula:
      "((1+p/100)*(1-q/100)-1)*100",

    variables: {
      p: {
        min: 5,
        max: 35,
      },

      q: {
        min: 5,
        max: 30,
      },
    },

    distractorStrategy:
      "cumulativeMistake",

    difficulty: "Medium",
  },

  {
    id: "net_percentage_change",

    section: "quant",

    topic: "Percentage",

    subtopic:
      "Net Percentage Change",

    formula:
      "((1+p/100)*(1+q/100)-1)*100",

    variables: {
      p: {
        min: 10,
        max: 45,
      },

      q: {
        min: 5,
        max: 35,
      },
    },

    distractorStrategy:
      "compoundTrap",

    difficulty: "Hard",
  },

  {
    id: "hidden_base_percentage",

    section: "quant",

    topic: "Percentage",

    subtopic:
      "Hidden Base Percentage",

    formula:
      "(b*100)/(100+p)",

    variables: {
      b: {
        min: 500,
        max: 3000,
      },

      p: {
        min: 10,
        max: 50,
      },
    },

    distractorStrategy:
      "wrongDenominator",

    difficulty: "Hard",
  },
];