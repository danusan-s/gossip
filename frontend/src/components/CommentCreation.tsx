import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";
import { useAppSelector } from "../hooks";

export default function Comments({
  threadId,
  handleNewComment,
}: {
  threadId: number;
  handleNewComment: CallableFunction;
}) {
  const [formData, setFormData] = useState<string>("");
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Must be logged in to create comment.");
      return;
    }
    if (!formData) {
      alert("Comment field is required.");
      return;
    }

    try {
      // Assuming the JWT is stored in localStorage
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${apiUrl}/threads/${threadId}/comments`,
        {
          content: formData,
          author: account,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Response:", response.data);
      handleNewComment();
      setFormData("");
    } catch (err) {
      console.error("Error sending data:", err);
      alert("Failed to submit data.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCommentSubmit}
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
      <Button type="submit" variant="contained" color="primary">
        Reply
      </Button>
    </Box>
  );
}
