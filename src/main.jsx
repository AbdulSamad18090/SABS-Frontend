import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import { CallProvider } from "../context/CallContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <CallProvider>
            <App />
          </CallProvider>
        </ThemeProvider>
        <Toaster position="top-center" />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
