import { Box, Typography, Chip, Grid2 as Grid } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
}

export default function Forum({ id }: { id: number }) {
  const [forum, setForum] = useState<Forum>({
    id: 0,
    title: "",
    description: "",
    author: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await axios.get<Forum>(
          `http://localhost:8080/api/forums/${id}`,
        );
        setForum(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchForum();
  }, [id]);

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "1rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 6 }} offset={{ xs: 0, sm: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{forum.title}</Typography>
            <Chip label={forum.author} />
          </Box>
          <Typography variant="body1">{forum.description}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
