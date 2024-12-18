import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
}

export default function ForumCreation({ account }: { account: string | null }) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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

    if (!account) {
      setError("Must be logged in to create post.");
      return;
    }
    if (!formData.title || !formData.description) {
      setError("Both fields are required.");
      return;
    }

    setError(null);

    try {
      // Assuming the JWT is stored in localStorage
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/forums",
        {
          ...formData,
          author: account,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Response:", response.data);
      setFormData({ title: "", description: "" });
      navigate("/forum");
    } catch (err) {
      console.error("Error sending data:", err);
      setError("Failed to submit data.");
    }
  };

  return (
    <Box marginY="2rem">
      <Grid container>
        <Grid size={{ xs: 12, sm: 8 }} offset={{ xs: 0, sm: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              padding: 2,
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 2,
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "100%" }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
