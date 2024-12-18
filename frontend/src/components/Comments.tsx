import { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button } from "@mui/material";
import CommentList from "./CommentList";

export default function Comments({
  forumId,
  account,
}: {
  forumId: number;
  account: string | null;
}) {
  const [formData, setFormData] = useState<string>("");
  const [renderTrigger, setRenderTrigger] = useState<boolean>(false);

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
        `http://localhost:8080/api/forums/${forumId}/comments`,
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
      setRenderTrigger(!renderTrigger);
      setFormData("");
    } catch (err) {
      console.error("Error sending data:", err);
      alert("Failed to submit data.");
    }
  };

  return (
    <Box sx={{ margin: "2rem 0" }}>
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
      <Typography variant="h6" margin="1rem">
        Comments:
      </Typography>
      <CommentList
        account={account}
        forumId={forumId}
        renderTrigger={renderTrigger}
      />
    </Box>
  );
}
