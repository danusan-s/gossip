import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import CommentCreation from "./CommentCreation";
import CommentList from "./CommentList";

interface Comment {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  time: string;
}

export default function CommentThread({ threadId }: { threadId: number }) {
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
  }, []);

  // Fetch again when new comment is added
  const handleNewComment = () => {
    fetchComments();
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ margin: "2rem 0" }}>
      <CommentCreation
        threadId={threadId}
        handleNewComment={handleNewComment}
      />
      <CommentList
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />
    </Box>
  );
}
