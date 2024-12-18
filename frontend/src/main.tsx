import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ForumPage from "./pages/ForumPage";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<ForumPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
