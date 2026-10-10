import type { Package, UserPackage } from "@/lib/data";

export interface UserBundleWithPackages {
  id: string;
  /** Packages that belong to this bundle, each carrying their test list */
  packages?: Array<{
    id: string;
    tests?: Array<{ testId: string }>;
  }>;
}

/**
 * Returns true if the user has access to the given test based on:
 *  1. The test is free (`isFree === 1` or `isFree === true`)
 *  2. The test belongs to one of the user's purchased packages
 *  3. The test belongs to a package inside one of the user's purchased bundles
 */
export function hasTestAccess(
  test: { id: string; isFree?: number | boolean },
  userPackages: Array<Pick<UserPackage, "id" | "tests">>,
  userBundles: UserBundleWithPackages[],
): boolean {
  // 1. Free test
  if (test.isFree === 1 || test.isFree === true) return true;

  // 2. Test is in a purchased package
  for (const pkg of userPackages) {
    if (pkg.tests?.some((t) => t.testId === test.id)) return true;
  }

  // 3. Test is in a package inside a purchased bundle
  for (const bundle of userBundles) {
    for (const pkg of bundle.packages ?? []) {
      if (pkg.tests?.some((t) => t.testId === test.id)) return true;
    }
  }

  return false;
}
