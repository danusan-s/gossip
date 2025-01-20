import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { toggleDarkTheme } from "../slices/theme";
import ThemeSwitch from "../components/ThemeSwitch";

/**
 * The LandingPage component is the landing page for the application.
 * It displays a welcome message and a button to navigate to the threads page.
 *
 * @returns {JSX.Element} The LandingPage component
 */
export default function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkTheme = useAppSelector((state) => state.theme.value);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Landing Page
          </Typography>
          <ThemeSwitch
            checked={darkTheme}
            onChange={() => {
              localStorage.setItem(
                "preferDarkMode",
                JSON.stringify(!darkTheme),
              );
              dispatch(toggleDarkTheme());
            }}
          />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          marginTop: "4rem",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            Welcome to Gossip
          </Typography>
          <Typography variant="h5">
            The best place to share your thoughts with the world.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: "2rem" }}
            onClick={() => navigate("/thread")}
            size="large"
          >
            Go to threads page
          </Button>
        </Container>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ marginTop: "4rem" }}
      >
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h5">Frontend built with React + TS</Typography>
        </Box>
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h5">Backend built using Go</Typography>
        </Box>
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h5">Redux for state management</Typography>
        </Box>
      </Box>
    </>
  );
}
