import { lazy, type ComponentType } from "react";
import { loadRouteModule } from "@/lib/route-recovery";

export function lazyWithRecovery<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() => loadRouteModule(load));
}
