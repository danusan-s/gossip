import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid2 as Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { toggleDarkTheme } from "../slices/theme";
import ThemeSwitch from "../components/ThemeSwitch";

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Landing Page
          </Typography>
          <ThemeSwitch
            checked={useAppSelector((state) => state.theme.value)}
            onChange={() => dispatch(toggleDarkTheme())}
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

      <Grid container spacing={4} marginTop="4rem">
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Typography variant="h5">Test</Typography>
          </Box>
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Typography variant="h5">Test</Typography>
          </Box>
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Typography variant="h5">Test</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
