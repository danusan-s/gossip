import Item from "./Item";
import LocalTimeChip from "./LocalTimeChip";
import axios from "axios";
import { Chip, Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import ReactionBox from "./Reactions";

interface Comment {
  id: number;
  thread_id: number;
  content: string;
  author: string;
  time: string;
}

export default function CommentSingle({
  commentData,
  handleDeleteComment,
}: {
  commentData: Comment;
  handleDeleteComment: (id: number) => void;
}) {
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    if (account !== commentData.author) {
      alert("You do not have permission to delete this comment.");
      return;
    }

    const confirmed = confirm("Are you sure you want to delete this thread ?");

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleDeleteComment(id);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  return (
    <Item>
      <Box display="flex" justifyContent="space-between">
        <Chip
          onClick={() => navigate(`/user/${commentData.author}`)}
          label={commentData.author}
        />
        <Box>
          <LocalTimeChip time={commentData.time} />
        </Box>
      </Box>
      <Typography variant="body1" paddingLeft="1rem" marginTop="0.5rem">
        {commentData.content}
      </Typography>
      <Box display="flex" justifyContent="space-between" marginTop="0.5rem">
        <ReactionBox id={commentData.id} type={"comments"} />
        {account === commentData.author && (
          <IconButton
            size="large"
            edge="end"
            aria-label="delete comment"
            onClick={() => handleDelete(commentData.id)}
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Item>
  );
}
