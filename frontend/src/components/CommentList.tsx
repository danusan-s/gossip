import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Stack, Box } from "@mui/material";
import CommentSingle from "./CommentSingle";
import CommentCreation from "./CommentCreation";

interface Comment {
  id: number;
  forum_id: number;
  author: string;
  content: string;
  time: string;
}

export default function CommentList({ forumId }: { forumId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `${apiUrl}/forums/${forumId}/comments`,
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
      <CommentCreation forumId={forumId} handleNewComment={handleNewComment} />
      <Typography variant="h6" sx={{ margin: "2rem 0" }}>
        Comments:
      </Typography>
      <Stack spacing={2}>
        {comments === null ? (
          <Typography key="0" variant="body1" paddingLeft="2rem">
            No comments
          </Typography>
        ) : (
          comments.map((comment) => (
            <CommentSingle
              key={comment.id}
              commentData={comment}
              handleDeleteComment={handleDeleteComment}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
