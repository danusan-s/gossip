import ForumPage from "./pages/ForumPage";
import LandingPage from "./pages/LandingPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks";
import { useEffect, useState } from "react";
import { setAccount, unsetAccount } from "./slices/account";
import { toggleDarkTheme } from "./slices/theme";

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
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${apiUrl}/login/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(setAccount(userData.user));
      } else {
        console.error("Token verification failed");
        dispatch(unsetAccount());
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
      dispatch(unsetAccount());
    } finally {
      setLoading(false);
    }
  };

  const darkMode = useAppSelector((state) => state.theme.value);

  const setThemePreference = () => {
    const theme = localStorage.getItem("preferDarkMode");
    if (theme == "true" && !darkMode) {
      dispatch(toggleDarkTheme());
    } else if (theme == "false" && darkMode) {
      dispatch(toggleDarkTheme());
    }
  };

  useEffect(() => {
    setThemePreference();
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading User...</div>;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
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
