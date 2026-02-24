import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import OverviewState from "./store/overview/OverviewState";
import AuthState from "./store/auth/AuthState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthState>
        <OverviewState>
          <App />
        </OverviewState>
      </AuthState>
    </BrowserRouter>
  </StrictMode>
);
