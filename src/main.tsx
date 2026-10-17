import { createRoot } from "react-dom/client";
import App from "./App";
import { ExamFullscreenExit } from "./components/ExamFullscreenExit";
import { RunnerDialogAccessibility } from "./components/RunnerDialogAccessibility";
import "./lib/install-safe-storage";
import "./index.css";
import "./frontend-polish.css";
import "./subcategory-light.css";
import "./test-runner-mobile.css";
import "./styles/sites-visual-system.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <ExamFullscreenExit />
    <RunnerDialogAccessibility />
  </>,
);
