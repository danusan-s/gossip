import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ForumPage from "./pages/ForumPage.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ForumPage />
    </ThemeProvider>
  </StrictMode>,
);
