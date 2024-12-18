import { useState } from "react";
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

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function App() {
  const [dark, setDark] = useState<boolean>(false);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<ForumPage handleTheme={setDark} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
