const RELOAD_PREFIX = "examtree.route-recovery.";
const RELOAD_COOLDOWN_MS = 60_000;

export function isRouteChunkError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { name, message } = error as { name?: unknown; message?: unknown };
  return name === "ChunkLoadError" || (typeof message === "string" && /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|loading (?:css )?chunk .+ failed|unable to preload css|failed to load module script/i.test(message));
}

export type RouteRecoveryBrowser = {
  pathname: string;
  online: boolean;
  storage: Pick<Storage, "getItem" | "setItem">;
  reload: () => void;
};

function currentBrowser(): RouteRecoveryBrowser | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return { pathname: window.location.pathname, online: navigator.onLine !== false, storage: window.sessionStorage, reload: () => window.location.reload() };
  } catch {
    return undefined;
  }
}

/** A deployment can remove a chunk referenced by an already-open student tab. */
export function recoverStaleRoute(error: unknown, browser = currentBrowser(), now = Date.now()): boolean {
  if (!isRouteChunkError(error) || !browser?.online) return false;
  // Never interrupt an active attempt, submission/result, or payment flow.
  if (/^\/(?:test|checkout|orders)(?:\/|$)/.test(browser.pathname) || /^\/result\/?$/.test(browser.pathname)) return false;
  try {
    const key = RELOAD_PREFIX + browser.pathname;
    const lastReload = Number(browser.storage.getItem(key));
    if (lastReload > 0 && now - lastReload < RELOAD_COOLDOWN_MS) return false;
    // Persist before reloading. If storage is blocked, leave recovery to the user.
    browser.storage.setItem(key, String(now));
    browser.reload();
    return true;
  } catch {
    return false;
  }
}

export async function loadRouteModule<T>(load: () => Promise<T>, options: {
  wait?: () => Promise<void>;
  recover?: (error: unknown) => boolean;
} = {}): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (!isRouteChunkError(error)) throw error;
  }
  // One short retry handles transient downloads without sending the student home.
  await (options.wait?.() ?? new Promise<void>((resolve) => setTimeout(resolve, 250)));
  try {
    return await load();
  } catch (error) {
    if (isRouteChunkError(error)) (options.recover ?? recoverStaleRoute)(error);
    throw error;
  }
}
