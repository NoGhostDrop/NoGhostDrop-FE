import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrivyProvider } from "@privy-io/react-auth";
import { Toaster } from "@/components/ui/sonner";

const privy_id = import.meta.env.VITE_PRIVY_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={privy_id || ""}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      <App />
      <Toaster />
    </PrivyProvider>
  </StrictMode>,
);
