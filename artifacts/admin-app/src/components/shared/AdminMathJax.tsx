import { useEffect, useRef, type ReactNode } from 'react';

const MATHJAX_SCRIPT_ID = 'examtree-admin-mathjax';
const MATHJAX_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js';

type MathJaxRuntime = {
  startup?: { promise?: Promise<unknown> };
  typesetClear?: (elements?: HTMLElement[]) => void;
  typesetPromise?: (elements?: HTMLElement[]) => Promise<unknown>;
};

declare global {
  interface Window {
    MathJax?: MathJaxRuntime | Record<string, unknown>;
  }
}

function configureMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    loader: { load: ['[tex]/ams', '[tex]/boldsymbol'] },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      packages: { '[+]': ['ams', 'boldsymbol'] },
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    },
    startup: { typeset: false },
  };
}

function mathJaxRuntime(): MathJaxRuntime | undefined {
  return window.MathJax as MathJaxRuntime | undefined;
}

export function AdminMathJax({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let observing = false;
    let frame: number | null = null;
    let typesetting = false;
    let pending = false;

    const observer = new MutationObserver(() => {
      if (!typesetting) scheduleTypeset();
      else pending = true;
    });

    const startObserving = () => {
      if (cancelled || observing) return;
      observer.observe(root, { childList: true, subtree: true, characterData: true });
      observing = true;
    };

    const stopObserving = () => {
      if (!observing) return;
      observer.disconnect();
      observing = false;
    };

    const typeset = async () => {
      frame = null;
      const mathJax = mathJaxRuntime();
      if (!mathJax?.typesetPromise || typesetting || cancelled) return;

      typesetting = true;
      stopObserving();
      try {
        mathJax.typesetClear?.([root]);
        await mathJax.typesetPromise([root]);
      } catch {
        // Plain text remains readable if MathJax cannot typeset a malformed expression.
      } finally {
        typesetting = false;
        startObserving();
        if (pending) {
          pending = false;
          scheduleTypeset();
        }
      }
    };

    function scheduleTypeset() {
      if (cancelled || frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        void typeset();
      });
    }

    const onReady = async () => {
      try {
        await mathJaxRuntime()?.startup?.promise;
      } finally {
        scheduleTypeset();
      }
    };

    configureMathJax();
    startObserving();

    let script = document.getElementById(MATHJAX_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = MATHJAX_SCRIPT_ID;
      script.src = MATHJAX_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', onReady);
    if (mathJaxRuntime()?.typesetPromise) void onReady();

    return () => {
      cancelled = true;
      stopObserving();
      script?.removeEventListener('load', onReady);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={rootRef} className="contents">{children}</div>;
}
