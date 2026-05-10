import type { RealizerLanguage } from "../types";

export type CityEntity = {
  id: string;
  display: Record<RealizerLanguage, string>;
};

export const CITIES: CityEntity[] = [
  {
    id: "amritsar",
    display: { en: "Amritsar", hi: "अमृतसर", pa: "ਅੰਮ੍ਰਿਤਸਰ" },
  },
  {
    id: "ludhiana",
    display: { en: "Ludhiana", hi: "लुधियाना", pa: "ਲੁਧਿਆਣਾ" },
  },
  {
    id: "delhi",
    display: { en: "Delhi", hi: "दिल्ली", pa: "ਦਿੱਲੀ" },
  },
  {
    id: "jaipur",
    display: { en: "Jaipur", hi: "जयपुर", pa: "ਜੈਪੁਰ" },
  },
];
