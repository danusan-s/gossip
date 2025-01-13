import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import CategorySelect from "./CategorySelect";

interface FormData {
  title: string;
  description: string;
  author: string;
  category: string;
}

export default function ThreadEdit() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    author: "",
    category: "",
  });

  const [error, setError] = useState<string | null>(null);

  const { threadID } = useParams<{ threadID: string }>();
  const id = parseInt(threadID || "", 10);
  if (isNaN(id)) {
    return <div>Invalid Thread ID</div>;
  }

  const navigate = useNavigate();
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get(`${apiUrl}/threads/${threadID}`);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          author: response.data.author,
          category: response.data.category,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchThread();
  }, [threadID]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 100) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategory = (newCategory: string | null) => {
    if (newCategory !== null) {
      setFormData((prev) => ({
        ...prev,
        category: newCategory,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setError("Must be logged in to create post.");
      return;
    }

    if (!formData.title) {
      setError("Title is required.");
      return;
    }
    if (!formData.description) {
      setError("Description is required.");
      return;
    }
    if (!formData.category) {
      setError("Category is required.");
      return;
    }

    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiUrl}/threads/${id}`,
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
      setFormData({ title: "", description: "", author: "", category: "" });
      navigate("/thread");
    } catch (err) {
      console.error("Error sending data:", err);
      setError("Failed to submit data.");
    }
  };

  return (
    <Box margin="2rem">
      <Grid container>
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
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
              label="Title (max 100 characters)"
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

            <Typography variant="body1">Choose Thread category:</Typography>
            <CategorySelect
              category={formData.category}
              setCategory={handleCategory}
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
