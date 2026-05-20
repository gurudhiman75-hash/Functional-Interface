import { hashText } from "./phrase-rotation";

export type CommercialObject = {
  id: string;
  en: string;
  hi: string;
  pa: string;
};

export const COMMERCIAL_OBJECT_POOL: readonly CommercialObject[] = [
  {
    id: "bicycle",
    en: "bicycle",
    hi: "साइकिल",
    pa: "ਸਾਈਕਲ",
  },
  {
    id: "refrigerator",
    en: "refrigerator",
    hi: "फ्रिज",
    pa: "ਫ੍ਰਿਜ",
  },
  {
    id: "mobile_phone",
    en: "mobile phone",
    hi: "मोबाइल फोन",
    pa: "ਮੋਬਾਈਲ ਫੋਨ",
  },
  {
    id: "wheat_bag",
    en: "wheat bag",
    hi: "गेहूं का बोरा",
    pa: "ਕਣਕ ਦੀ ਬੋਰੀ",
  },
  {
    id: "sugar_packet",
    en: "sugar packet",
    hi: "चीनी का पैकेट",
    pa: "ਚੀਨੀ ਦਾ ਪੈਕੇਟ",
  },
  {
    id: "cooking_oil_tin",
    en: "cooking oil tin",
    hi: "तेल का डिब्बा",
    pa: "ਖਾਣੇ ਦੇ ਤੇਲ ਦਾ ਡੱਬਾ",
  },
  {
    id: "television",
    en: "television",
    hi: "टेलीविजन",
    pa: "ਟੈਲੀਵਿਜ਼ਨ",
  },
  {
    id: "laptop",
    en: "laptop",
    hi: "लैपटॉप",
    pa: "ਲੈਪਟਾਪ",
  },
  {
    id: "school_bag",
    en: "school bag",
    hi: "स्कूल बैग",
    pa: "ਸਕੂਲ ਬੈਗ",
  },
  {
    id: "shirt",
    en: "shirt",
    hi: "कमीज",
    pa: "ਕਮੀਜ਼",
  },
  {
    id: "rice_bag",
    en: "rice bag",
    hi: "चावल का बोरा",
    pa: "ਚਾਵਲ ਦੀ ਬੋਰੀ",
  },
];

export function selectCommercialObject(input: {
  seed?: number | string;
  namespace?: string;
}) {
  const index =
    hashText(`${input.namespace ?? "commercial"}|${input.seed ?? ""}`) %
    COMMERCIAL_OBJECT_POOL.length;
  return COMMERCIAL_OBJECT_POOL[index]!;
}

