import { useEffect, useState } from "react";
import axios from "axios";
import { Chip, Typography, Stack, Box, IconButton } from "@mui/material";
import LocalTimeChip from "./LocalTimeChip";
import DeleteIcon from "@mui/icons-material/Delete";
import Item from "./Item";

interface Comment {
  id: number;
  forumId: number;
  author: string;
  content: string;
  time: string;
}

export default function CommentList({
  account,
  forumId,
  renderTrigger,
}: {
  account: string | null;
  forumId: number;
  renderTrigger: boolean;
}) {
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

  useEffect(() => {
    fetchComments();
  }, [forumId, renderTrigger]);

  const handleDelete = async (id: number) => {
    try {
      // Assuming the JWT is stored in localStorage
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Stack spacing={2}>
      {comments === null ? (
        <Typography variant="body1" paddingLeft="2rem">
          No comments
        </Typography>
      ) : (
        comments.map((comment) => (
          <Item key={comment.id}>
            <Box display="flex" justifyContent="space-between">
              <Chip label={comment.author} />
              <Box>
                <LocalTimeChip time={comment.time} />
                {account === comment.author && (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="delete comment"
                    onClick={() => handleDelete(comment.id)}
                    color="inherit"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Typography variant="body1" paddingLeft="1rem">
              {comment.content}
            </Typography>
          </Item>
        ))
      )}
    </Stack>
  );
}
