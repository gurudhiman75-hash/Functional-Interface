import { useEffect, useState } from "react";

export function ExamFullscreenExit() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== "undefined" && Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    syncFullscreen();
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  if (!isFullscreen || typeof window === "undefined" || !window.location.pathname.startsWith("/test/")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        void document.exitFullscreen?.().catch(() => undefined);
      }}
      className="fixed bottom-20 right-3 z-[400] min-h-11 rounded-md border border-white/40 bg-slate-950/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:bottom-4"
      aria-label="Exit fullscreen"
    >
      Exit fullscreen
    </button>
  );
}
