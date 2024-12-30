import ForumPage from "./pages/ForumPage";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { setDarkTheme, setLightTheme } from "./slices/theme";

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
  const dispatch = useAppDispatch();

  const setThemePreference = async () => {
    const theme = localStorage.getItem("preferDarkMode");
    if (theme == "true") {
      dispatch(setDarkTheme());
    } else if (theme == "false") {
      dispatch(setLightTheme());
    }
  };

  useEffect(() => {
    setThemePreference();
  });

  const preferredTheme = useAppSelector((state) => state.theme.value);

  return (
    <ThemeProvider theme={preferredTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<ForumPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
