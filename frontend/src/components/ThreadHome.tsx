import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Grid2 as Grid, Typography } from "@mui/material";
import ThreadList from "./ThreadList";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

/**
 * The ThreadHome component displays a list of threads.
 * It allows filtering by search query.
 *
 * @returns {JSX.Element} The ThreadHome component
 */
export default function ThreadHome(): JSX.Element {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    console.log("Loading Threads");
    return null;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "1rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
          {searchQuery && (
            <Typography variant="h5" gutterBottom>
              Search Results for "{searchQuery}":
            </Typography>
          )}
          <ThreadList threads={threads} />
        </Grid>
      </Grid>
    </Box>
  );
}
