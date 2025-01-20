import axios from "axios";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Chip, Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Item from "./Item";
import LocalTimeChip from "./LocalTimeChip";
import ReactionBox from "./Reactions";
import CommentEdit from "./CommentEdit";

interface Comment {
  id: number;
  thread_id: number;
  content: string;
  author: string;
  time: string;
}

/**
 * The CommentSingle component displays a single comment with its content, author, reactions and time.
 * It also displays the edit and delete options if the comment belongs to the current user.
 *
 * @prop {Comment} commentData The comment data to display
 * @prop {function} handleDeleteComment The function to call when the comment is deleted
 * @returns {JSX.Element} The CommentSingle component
 */
export default function CommentSingle({
  commentData,
  handleDeleteComment,
}: {
  commentData: Comment;
  handleDeleteComment: (id: number) => void;
}): JSX.Element {
  const [editMode, setEditMode] = useState<boolean>(false);
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

  return editMode ? (
    <CommentEdit commentData={commentData} setEditMode={setEditMode} />
  ) : (
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
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="edit comment"
              onClick={() => setEditMode(true)}
              color="inherit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="delete comment"
              onClick={() => handleDelete(commentData.id)}
              color="inherit"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Item>
  );
}
