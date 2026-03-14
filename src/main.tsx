import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ToastProvider } from "./contexts/ToastContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
 <ToastProvider>
  <App />
</ToastProvider>
);