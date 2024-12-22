import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ForumSingle from "./ForumSingle";
import Hoverable from "./Hoverable";

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
  const { searchQuery } = useParams<{ searchQuery: string }>();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchForums = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get<Forum[]>(
            `${apiUrl}/forums/search/${searchQuery}`,
          );
          setForums(response.data);
        } else {
          const response = await axios.get<Forum[]>(`${apiUrl}/forums`);
          setForums(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [searchQuery]);

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = forums ? (
    forums.map((value) => {
      return (
        <Hoverable
          onClick={() => navigate(`/forum/${value.id}`)}
          key={value.id}
        >
          <ForumSingle forumData={value} focused={false} />
        </Hoverable>
      );
    })
  ) : (
    <div>No forums found</div>
  );

  return (
    <Box sx={{ margin: "1rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
          <Stack spacing={2} alignItems="center">
            {list}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
