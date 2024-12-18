import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/forum");
  };

  return (
    <Box
      textAlign="center"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" margin="2rem">
        This is a work in progress
      </Typography>
      <Button variant="contained" onClick={handleClick} sx={{ width: "50%" }}>
        Go to forum
      </Button>
    </Box>
  );
}
