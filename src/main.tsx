import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("L'élément #root est introuvable dans index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);