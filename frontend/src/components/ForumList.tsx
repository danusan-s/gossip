import axios from "axios";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid2 as Grid,
  Stack,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  width: "100%",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  textTransform: "none",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function ForumList() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get<Forum[]>(
          "http://localhost:8080/api/forums",
        );
        setForums(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = forums.map((value) => {
    return (
      <Button
        style={{ width: "100%" }}
        onClick={() => navigate(`/forums/${value.id}`)}
        key={value.id}
      >
        <Item>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{value.title}</Typography>
            <Chip label={value.author} />
          </Box>
          <Typography variant="body1">{value.description}</Typography>
        </Item>
      </Button>
    );
  });

  return (
    <Box sx={{ margin: "1rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 6 }} offset={{ xs: 0, sm: 3 }}>
          <Stack spacing={2} alignItems="center">
            {list}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
