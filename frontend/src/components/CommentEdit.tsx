import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../hooks";

import { Box, TextField, Button } from "@mui/material";

interface Comment {
  id: number;
  thread_id: number;
  content: string;
  author: string;
  time: string;
}

/**
 * The CommentEdit component allows the user to edit a comment.
 * It displays a form with a field for the comment content.
 * The user can submit the form to update the comment.
 *
 * @prop {Comment} commentData The comment data to edit
 * @prop {(editMode:boolean)=>void} setEditMode The function to call to modify the edit mode
 * @returns {JSX.Element} The CommentEdit component
 */
export default function CommentEdit({
  commentData,
  setEditMode,
}: {
  commentData: Comment;
  setEditMode: (editMode: boolean) => void;
}): JSX.Element {
  const [formData, setFormData] = useState<string>(commentData.content);
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.value);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (account !== commentData.author) {
      alert("You do not have permission to edit this comment.");
      return;
    }
    if (!formData) {
      alert("Comment field is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiUrl}/comments/${commentData.id}`,
        {
          content: formData,
          author: commentData.author,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEditMode(false);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleEdit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <TextField
        label="Comment"
        name="content"
        onChange={handleChange}
        value={formData}
        placeholder="Leave a comment"
        required
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          sx={{ width: "100%" }}
          onClick={handleCancel}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          sx={{ width: "100%" }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
}
