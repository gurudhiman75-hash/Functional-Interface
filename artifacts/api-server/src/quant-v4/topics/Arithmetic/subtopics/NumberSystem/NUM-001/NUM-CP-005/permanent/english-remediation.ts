import { ql046, ql048, ql049, ql050, ql051 } from "./english-remediation-046-051";
import { ql047ZeroSafe } from "./english-remediation-047-zero-safe";
import { ql052, ql053, ql054, ql055, ql056, ql057 } from "./english-remediation-052-057";
import { ql058, ql059, ql060, ql061, ql062, ql063 } from "./english-remediation-058-063";
import { ql064, ql065, ql066, ql067, ql068, ql069 } from "./english-remediation-064-069";
export function remediateNumCp005English(source) {
    switch (source.qlId) {
        case "NUM-QL-046": return ql046(source);
        case "NUM-QL-047": return ql047ZeroSafe(source);
        case "NUM-QL-048": return ql048(source);
        case "NUM-QL-049": return ql049(source);
        case "NUM-QL-050": return ql050(source);
        case "NUM-QL-051": return ql051(source);
        case "NUM-QL-052": return ql052(source);
        case "NUM-QL-053": return ql053(source);
        case "NUM-QL-054": return ql054(source);
        case "NUM-QL-055": return ql055(source);
        case "NUM-QL-056": return ql056(source);
        case "NUM-QL-057": return ql057(source);
        case "NUM-QL-058": return ql058(source);
        case "NUM-QL-059": return ql059(source);
        case "NUM-QL-060": return ql060(source);
        case "NUM-QL-061": return ql061(source);
        case "NUM-QL-062": return ql062(source);
        case "NUM-QL-063": return ql063(source);
        case "NUM-QL-064": return ql064(source);
        case "NUM-QL-065": return ql065(source);
        case "NUM-QL-066": return ql066(source);
        case "NUM-QL-067": return ql067(source);
        case "NUM-QL-068": return ql068(source);
        case "NUM-QL-069": return ql069(source);
        default: throw new Error(`Unsupported NUM-CP-005 QL: ${source.qlId}`);
    }
}
export { normalizeNumCp005OptionSemantic } from "./english-remediation-common";
