import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography } from "@mui/material";
import CommentCreation from "./CommentCreation";
import CommentList from "./CommentList";

interface Comment {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  time: string;
}

/**
 * The CommentThread component displays a list of comments for a specific thread.
 *
 * @prop {number} threadId The ID of the thread
 * @returns {JSX.Element | null} The CommentThread component
 */
export default function CommentThread({
  threadId,
}: {
  threadId: number;
}): JSX.Element | null {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `${apiUrl}/threads/${threadId}/comments`,
      );
      setComments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch comments once, otherwise it will cause a lot of unnecessary requests
  useEffect(() => {
    fetchComments();
  });

  // Fetch again when new comment is added
  const handleNewComment = () => {
    fetchComments();
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  if (loading) {
    console.log("Loading Comments");
    return null;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "2rem 0" }}>
      <CommentCreation
        threadId={threadId}
        handleNewComment={handleNewComment}
      />
      <Typography variant="h6" sx={{ margin: "2rem 0" }}>
        Comments:
      </Typography>

      <CommentList
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />
    </Box>
  );
}
