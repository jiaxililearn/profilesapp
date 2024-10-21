import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import theme from "./themes.ts"
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticator>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Authenticator>
  </React.StrictMode>
);