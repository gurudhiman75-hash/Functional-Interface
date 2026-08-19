import { createRoot } from "react-dom/client";
import App from "./App";
import "./lib/install-safe-storage";
import "./index.css";
import "./test-runner-mobile.css";

createRoot(document.getElementById("root")!).render(<App />);
