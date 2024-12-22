import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Grid2 as Grid, Typography } from "@mui/material";
import Item from "./Item";
import ForumSingle from "./ForumSingle";

import CommentList from "./CommentList";

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
  time: string;
}

export default function Forum() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { forumID } = useParams<{ forumID: string }>();
  const id = parseInt(forumID || "", 10);
  if (isNaN(id)) {
    return <div>Invalid forum ID</div>;
  }

  const [forum, setForum] = useState<Forum>({
    id: 0,
    title: "",
    description: "",
    author: "",
    time: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await axios.get<Forum>(`${apiUrl}/forums/${forumID}`);
        setForum(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchForum();
  }, [forumID]);

  if (loading)
    return (
      <Item>
        <Typography variant="h6">Loading forum...</Typography>
      </Item>
    );
  if (error)
    return (
      <Item>
        <Typography variant="h6">Error: {error}</Typography>
      </Item>
    );

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "2rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 8 }} offset={{ xs: 0, sm: 2 }}>
          <Item>
            <ForumSingle forumData={forum} />
          </Item>
          <CommentList forumId={id} />
        </Grid>
      </Grid>
    </Box>
  );
}
