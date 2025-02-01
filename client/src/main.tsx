import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./lib/i18n";

const queryClient = new QueryClient();

// Initialize i18n before rendering
i18n.init().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </StrictMode>,
  );
});