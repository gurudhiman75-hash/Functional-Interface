import { localizeFreeTextPa, type R } from "./punjabi-foundation";
import { applyPunjabiEditorialOverrides } from "./punjabi-editorial-overrides";
import { renderPunjabiStem001To010 } from "./punjabi-stems-cp001-cp003";
import { renderPunjabiStem011To022 } from "./punjabi-stems-cp004-cp005";
import { renderPunjabiStem023To035 } from "./punjabi-stems-cp006-cp007";
import { renderPunjabiStem036To044 } from "./punjabi-stems-cp008";

export function renderPunjabiStem(english: R): string {
  const rendered = renderPunjabiStem001To010(english)
    ?? renderPunjabiStem011To022(english)
    ?? renderPunjabiStem023To035(english)
    ?? renderPunjabiStem036To044(english)
    ?? localizeFreeTextPa(String(english.stem));
  return applyPunjabiEditorialOverrides(rendered);
}
