import { localizeFreeText, type R } from "./hindi-foundation";
import { applyHindiEditorialOverrides } from "./hindi-editorial-overrides";
import { renderHindiStem001To010 } from "./hindi-stems-cp001-cp003";
import { renderHindiStem011To022 } from "./hindi-stems-cp004-cp005";
import { renderHindiStem023To035 } from "./hindi-stems-cp006-cp007";
import { renderHindiStem036To044 } from "./hindi-stems-cp008";

export function renderHindiStem(english: R): string {
  const rendered = renderHindiStem001To010(english)
    ?? renderHindiStem011To022(english)
    ?? renderHindiStem023To035(english)
    ?? renderHindiStem036To044(english)
    ?? localizeFreeText(String(english.stem));
  return applyHindiEditorialOverrides(rendered);
}
