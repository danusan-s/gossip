import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
