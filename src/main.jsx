import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import OverviewState from "./store/overview/OverviewState";
import AuthState from "./store/auth/AuthState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AuthState>
        <OverviewState>
          <App />
        </OverviewState>
      </AuthState>
    </HashRouter>
  </StrictMode>
);
