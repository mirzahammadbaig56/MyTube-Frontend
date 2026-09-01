import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: { background: "#16a34a", color: "#fff" },
          },
          error: {
            style: { background: "#dc2626", color: "#fff" },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
