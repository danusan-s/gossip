import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid2 as Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import Item from "./Item";
import ThreadSingle from "./ThreadSingle";
import CommentThread from "./CommentThread";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

/**
 * The ThreadFocus component displays a single thread and its corresponding comments.
 *
 * @returns {JSX.Element | null} The ThreadFocus component
 */
export default function ThreadFocus(): JSX.Element | null {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { threadID } = useParams<{ threadID: string }>();
  const id = parseInt(threadID || "", 10);
  if (isNaN(id)) {
    return <div>Invalid Thread ID</div>;
  }

  const [thread, setThread] = useState<Thread>({
    id: 0,
    title: "",
    description: "",
    author: "",
    category: "",
    time: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get<Thread>(
          `${apiUrl}/threads/${threadID}`,
        );
        setThread(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadID]);

  if (loading) {
    console.log("Loading Thread Page");
    return <CircularProgress color="inherit" />;
  }
  if (error)
    return (
      <Item>
        <Typography variant="h6">Error: {error}</Typography>
      </Item>
    );

  if (loading) {
    console.log("Loading Thread");
    return <CircularProgress color="inherit" />;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "2rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
          <Item>
            <ThreadSingle threadData={thread} />
          </Item>
          <CommentThread threadId={id} />
        </Grid>
      </Grid>
    </Box>
  );
}
