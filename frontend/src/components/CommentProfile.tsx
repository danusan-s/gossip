import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import CommentList from "./CommentList";

interface Comment {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  time: string;
}

/**
 * The CommentProfile component displays a list of comments made by a specific user.
 *
 * @returns {JSX.Element} The CommentProfile component
 */
export default function CommentProfile(): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const { userName } = useParams<{ userName: string }>();

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `${apiUrl}/user/${userName}/comments`,
      );
      setComments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "2rem 0" }}>
      <Typography variant="h5" gutterBottom>
        Comments made by user:
      </Typography>
      <CommentList
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />
    </Box>
  );
}
