import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { setAccount } from "../slices/account";

import {
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
} from "@mui/material";

interface SignInFormData {
  username: string;
  password: string;
}

/**
 * The SignIn component allows the user to sign in to their account.
 * It displays a form with fields for username and password.
 * The user can submit the form to sign in.
 *
 * @returns {JSX.Element} The SignIn component
 */
export default function SignIn(): JSX.Element {
  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, formData);
      localStorage.setItem("token", response.data.token);
      dispatch(setAccount(formData.username));
      navigate("/thread");
      setFormData({ username: "", password: "" });
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
            margin: "0 auto",
            padding: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Sign In
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
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Enter your password"
            required
            fullWidth
          />
          <Typography variant="body2" color="error">
            {error}
          </Typography>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
