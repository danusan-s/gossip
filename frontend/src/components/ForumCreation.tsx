import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

interface FormData {
  title: string;
  description: string;
}

export default function ForumCreation() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Both fields are required.");
      return;
    }

    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/forums",
        formData,
      );
      console.log("Response:", response.data);
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.error("Error sending data:", err);
      setError("Failed to submit data.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Fill out details for new post
      </Typography>

      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        multiline
        rows={4}
        fullWidth
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
