import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./../public/assets/css/output.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
