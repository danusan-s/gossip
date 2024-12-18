import { useEffect, useState } from "react";
import axios from "axios";
import { Chip, Typography, Stack, Paper, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import LocalTimeChip from "./LocalTimeChip";
import DeleteIcon from "@mui/icons-material/Delete";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  width: "100%",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  textTransform: "none",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

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

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `http://localhost:8080/api/forums/${forumId}/comments`,
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

      await axios.delete(`http://localhost:8080/api/comments/${id}`, {
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
