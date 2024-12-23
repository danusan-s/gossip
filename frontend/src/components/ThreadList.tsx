import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ThreadSingle from "./ThreadSingle";
import Hoverable from "./Hoverable";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  time: string;
}

export default function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { searchQuery } = useParams<{ searchQuery: string }>();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get<Thread[]>(
            `${apiUrl}/threads/search/${searchQuery}`,
          );
          setThreads(response.data);
        } else {
          const response = await axios.get<Thread[]>(`${apiUrl}/threads`);
          setThreads(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [searchQuery]);

  if (loading) return <div>Loading Threads...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = threads ? (
    threads.map((value) => {
      return (
        <Hoverable
          onClick={() => navigate(`/thread/${value.id}`)}
          key={value.id}
        >
          <ThreadSingle threadData={value} focused={false} />
        </Hoverable>
      );
    })
  ) : (
    <div>No Threads found</div>
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
