export type PolCp001ActRow = {
  id: string;
  title: string;
  year: number;
  sequenceRank: number;
  era: "COMPANY" | "CROWN" | "INDEPENDENCE";
  reformName?: string;
  definingFeature: string;
  compactFeature: string;
  secondaryFeatures: readonly string[];
  milestone?: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const actSource = (slug: string) => `STATUTE-${slug.toUpperCase()}`;

export const POL_CP001_ACT_ROWS_V1: readonly PolCp001ActRow[] = Object.freeze([
  {
    id: "regulating-act-1773",
    title: "Regulating Act, 1773",
    year: 1773,
    sequenceRank: 1,
    era: "COMPANY",
    definingFeature: "created the office of Governor-General of Bengal and began parliamentary regulation of the East India Company's administration in India",
    compactFeature: "Governor-General of Bengal and parliamentary control",
    secondaryFeatures: [
      "provided for an Executive Council of four members to assist the Governor-General of Bengal",
      "provided for a Supreme Court at Calcutta",
      "made the Presidencies of Bombay and Madras subordinate to Bengal in important matters",
    ],
    milestone: "was the first major step by the British Parliament to regulate the East India Company's political administration in India",
    sourceIds: [actSource("regulating-act-1773")],
    sourceFactIds: [
      "pol-cp001-regulating-gg-bengal",
      "pol-cp001-regulating-supreme-court",
      "pol-cp001-regulating-parliamentary-control",
    ],
  },
  {
    id: "pitts-india-act-1784",
    title: "Pitt's India Act, 1784",
    year: 1784,
    sequenceRank: 2,
    era: "COMPANY",
    definingFeature: "created a Board of Control for political affairs while the Court of Directors continued to handle the Company's commercial affairs",
    compactFeature: "Board of Control and dual control",
    secondaryFeatures: [
      "strengthened British governmental control over the Company's political functions",
      "distinguished the Company's political functions from its commercial functions",
      "reduced the Governor-General's council from four members to three",
    ],
    milestone: "established the system commonly described as dual control of the Company's Indian administration",
    sourceIds: [actSource("pitts-india-act-1784")],
    sourceFactIds: [
      "pol-cp001-pitt-board-control",
      "pol-cp001-pitt-dual-control",
    ],
  },
  {
    id: "charter-act-1793",
    title: "Charter Act, 1793",
    year: 1793,
    sequenceRank: 3,
    era: "COMPANY",
    definingFeature: "renewed the East India Company's charter for twenty years while largely continuing the existing system of Company rule",
    compactFeature: "Company charter renewed for twenty years",
    secondaryFeatures: [
      "continued the Company's trade monopoly for another twenty years",
      "continued the system of control established under earlier legislation",
    ],
    sourceIds: [actSource("charter-act-1793")],
    sourceFactIds: [
      "pol-cp001-charter1793-renewal",
      "pol-cp001-charter1793-monopoly",
    ],
  },
  {
    id: "charter-act-1813",
    title: "Charter Act, 1813",
    year: 1813,
    sequenceRank: 4,
    era: "COMPANY",
    definingFeature: "ended the East India Company's trade monopoly in India except for trade in tea and trade with China",
    compactFeature: "Company trade monopoly ended with tea and China exceptions",
    secondaryFeatures: [
      "renewed the Company's charter for another twenty years",
      "opened Indian trade to other British merchants subject to the retained exceptions",
      "set aside an annual sum of one lakh rupees for the promotion of education",
    ],
    milestone: "made the first major statutory breach in the Company's general trade monopoly in India",
    sourceIds: [actSource("charter-act-1813")],
    sourceFactIds: [
      "pol-cp001-charter1813-monopoly",
      "pol-cp001-charter1813-education",
    ],
  },
  {
    id: "charter-act-1833",
    title: "Charter Act, 1833",
    year: 1833,
    sequenceRank: 5,
    era: "COMPANY",
    definingFeature: "made the Governor-General of Bengal the Governor-General of India and ended the East India Company's remaining commercial activities",
    compactFeature: "Governor-General of India and end of Company commerce",
    secondaryFeatures: [
      "centralised legislative power in the Governor-General in Council",
      "ended the Company's commercial role and left it as an administrative agency",
      "provided for a Law Commission",
    ],
    milestone: "created the office of Governor-General of India",
    sourceIds: [actSource("charter-act-1833")],
    sourceFactIds: [
      "pol-cp001-charter1833-gg-india",
      "pol-cp001-charter1833-company-commerce",
      "pol-cp001-charter1833-law-commission",
    ],
  },
  {
    id: "charter-act-1853",
    title: "Charter Act, 1853",
    year: 1853,
    sequenceRank: 6,
    era: "COMPANY",
    definingFeature: "separated the legislative and executive functions of the Governor-General's Council and opened the way for competitive recruitment to the civil services",
    compactFeature: "legislative-executive separation in the Governor-General's Council",
    secondaryFeatures: [
      "added legislative members to the Governor-General's Council for legislative work",
      "did not renew the Company's rule for a fixed twenty-year period",
      "opened the way for recruitment to the civil services by open competition",
    ],
    milestone: "was the last Charter Act passed for the East India Company",
    sourceIds: [actSource("charter-act-1853")],
    sourceFactIds: [
      "pol-cp001-charter1853-legislative-separation",
      "pol-cp001-charter1853-competition",
    ],
  },
  {
    id: "government-of-india-act-1858",
    title: "Government of India Act, 1858",
    year: 1858,
    sequenceRank: 7,
    era: "CROWN",
    definingFeature: "transferred the government of India from the East India Company to the British Crown and created the office of Secretary of State for India",
    compactFeature: "Crown rule and Secretary of State for India",
    secondaryFeatures: [
      "abolished the Company's governing authority in India",
      "created a Council of India to assist the Secretary of State for India",
      "made the Governor-General the Crown's principal representative in India, commonly styled the Viceroy",
    ],
    milestone: "ended East India Company rule and began direct Crown rule in India",
    sourceIds: [actSource("government-of-india-act-1858")],
    sourceFactIds: [
      "pol-cp001-goi1858-crown-rule",
      "pol-cp001-goi1858-secretary-state",
    ],
  },
  {
    id: "indian-councils-act-1861",
    title: "Indian Councils Act, 1861",
    year: 1861,
    sequenceRank: 8,
    era: "CROWN",
    definingFeature: "enlarged the Viceroy's legislative council and enabled the nomination of Indians as non-official members",
    compactFeature: "Indian nomination to legislative councils",
    secondaryFeatures: [
      "restored legislative powers to the Presidencies of Bombay and Madras",
      "gave statutory recognition to the portfolio system in executive work",
      "allowed the Viceroy to nominate non-official members to the legislative council",
    ],
    milestone: "began the practice of including Indians in central legislative work through nomination",
    sourceIds: [actSource("indian-councils-act-1861")],
    sourceFactIds: [
      "pol-cp001-councils1861-nomination",
      "pol-cp001-councils1861-decentralisation",
    ],
  },
  {
    id: "indian-councils-act-1892",
    title: "Indian Councils Act, 1892",
    year: 1892,
    sequenceRank: 9,
    era: "CROWN",
    definingFeature: "enlarged legislative councils and allowed members to discuss the budget and ask questions subject to restrictions",
    compactFeature: "budget discussion and questions in legislative councils",
    secondaryFeatures: [
      "increased the number of additional members in central and provincial legislative councils",
      "introduced an indirect representative element through recommendations by designated bodies",
      "did not confer full control over the budget",
    ],
    milestone: "expanded the deliberative role of legislative councils through budget discussion and questions",
    sourceIds: [actSource("indian-councils-act-1892")],
    sourceFactIds: [
      "pol-cp001-councils1892-budget",
      "pol-cp001-councils1892-questions",
    ],
  },
  {
    id: "indian-councils-act-1909",
    title: "Indian Councils Act, 1909",
    year: 1909,
    sequenceRank: 10,
    era: "CROWN",
    reformName: "Morley-Minto Reforms",
    definingFeature: "introduced separate electorates for Muslims and enlarged the legislative councils",
    compactFeature: "separate electorates for Muslims",
    secondaryFeatures: [
      "substantially increased the size of central and provincial legislative councils",
      "introduced communal representation for Muslims through separate electorates",
      "allowed an Indian to join the Viceroy's Executive Council",
    ],
    milestone: "introduced separate electorates for Muslims",
    sourceIds: [actSource("indian-councils-act-1909")],
    sourceFactIds: [
      "pol-cp001-councils1909-separate-electorates",
      "pol-cp001-councils1909-executive-council",
    ],
  },
  {
    id: "government-of-india-act-1919",
    title: "Government of India Act, 1919",
    year: 1919,
    sequenceRank: 11,
    era: "CROWN",
    reformName: "Montagu-Chelmsford Reforms",
    definingFeature: "introduced dyarchy in the provinces by dividing provincial subjects into reserved and transferred subjects",
    compactFeature: "dyarchy in the provinces",
    secondaryFeatures: [
      "separated central and provincial subjects",
      "introduced bicameralism at the Centre",
      "expanded direct elections and the representative element",
    ],
    milestone: "introduced dyarchy in the provinces",
    sourceIds: [actSource("government-of-india-act-1919")],
    sourceFactIds: [
      "pol-cp001-goi1919-dyarchy",
      "pol-cp001-goi1919-bicameralism",
    ],
  },
  {
    id: "government-of-india-act-1935",
    title: "Government of India Act, 1935",
    year: 1935,
    sequenceRank: 12,
    era: "CROWN",
    definingFeature: "introduced provincial autonomy, abolished provincial dyarchy and proposed an All-India Federation that did not come into operation",
    compactFeature: "provincial autonomy and proposed federation",
    secondaryFeatures: [
      "divided legislative subjects into Federal, Provincial and Concurrent Lists",
      "provided for dyarchy at the Centre as part of the federal scheme, but that scheme did not come into operation",
      "provided for the establishment of a Federal Court",
    ],
    milestone: "introduced provincial autonomy and abolished dyarchy in the provinces",
    sourceIds: [actSource("government-of-india-act-1935")],
    sourceFactIds: [
      "pol-cp001-goi1935-provincial-autonomy",
      "pol-cp001-goi1935-three-lists",
      "pol-cp001-goi1935-federation",
    ],
  },
  {
    id: "indian-independence-act-1947",
    title: "Indian Independence Act, 1947",
    year: 1947,
    sequenceRank: 13,
    era: "INDEPENDENCE",
    definingFeature: "provided for the creation of the two independent Dominions of India and Pakistan from 15 August 1947",
    compactFeature: "two independent Dominions from 15 August 1947",
    secondaryFeatures: [
      "ended the responsibility of the British Government for the governance of British India",
      "ended British suzerainty over the princely states",
      "made the new Dominions legislatively sovereign from the appointed day",
    ],
    milestone: "ended British rule and created the independent Dominions of India and Pakistan",
    sourceIds: [actSource("indian-independence-act-1947")],
    sourceFactIds: [
      "pol-cp001-independence-two-dominions",
      "pol-cp001-independence-suzerainty",
      "pol-cp001-independence-sovereignty",
    ],
  },
]);

export const POL_CP001_ACT_TITLES_V1 = Object.freeze(POL_CP001_ACT_ROWS_V1.map((row) => row.title));

export const POL_CP001_REFORM_ROWS_V1 = Object.freeze(
  POL_CP001_ACT_ROWS_V1.filter((row) => row.reformName),
);

export function getPolCp001ActById(id: string) {
  const row = POL_CP001_ACT_ROWS_V1.find((candidate) => candidate.id === id);
  if (!row) throw new Error(`Unknown POL-CP-001 act row: ${id}`);
  return row;
}
