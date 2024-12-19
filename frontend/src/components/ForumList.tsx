import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ForumSingle from "./ForumSingle";

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
  time: string;
}

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

  const list = forums ? (
    forums.map((value) => {
      return (
        <Button
          style={{ width: "100%" }}
          onClick={() => navigate(`/forum/${value.id}`)}
          key={value.id}
        >
          <ForumSingle forumData={value} />
        </Button>
      );
    })
  ) : (
    <div>No forums found</div>
  );

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
