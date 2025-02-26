import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
} from "@mui/material";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

/**
 * The SignUp component allows the user to sign up for an account.
 * It displays a form with fields for username, email, and password.
 * The user can submit the form to create a new account.
 *
 * @returns {JSX.Element} The SignUp component
 */
export default function SignUp(): JSX.Element {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/register`, formData);
      navigate("/signin");
      setError(null);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "90vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            padding: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Sign Up
          </Typography>

          <TextField
            label="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            placeholder="Enter your username"
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Enter your email"
            required
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Enter your password"
            required
            fullWidth
          />

          <Box>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
