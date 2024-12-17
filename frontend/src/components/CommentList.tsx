import { useEffect, useState } from "react";
import axios from "axios";
import { Chip, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

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
  author: string;
  content: string;
}

export default function CommentList({
  forumId,
  renderTrigger,
}: {
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

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Stack spacing={2}>
      {comments === null ? (
        <div>No Comments</div>
      ) : (
        comments.map((comment) => (
          <Item key={comment.id}>
            <Chip label={comment.author} />
            <Typography variant="body1" paddingLeft="1rem">
              {comment.content}
            </Typography>
          </Item>
        ))
      )}
    </Stack>
  );
}
