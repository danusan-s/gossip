import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { setAccount } from "../slices/account";

import { TextField, Button, Box, Typography } from "@mui/material";

/**
 * The SignIn component allows the user to sign in to their account.
 * It displays a form with fields for username and password.
 * The user can submit the form to sign in.
 *
 * @returns {JSX.Element} The SignIn component
 */
export default function SignIn(): JSX.Element {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
    } catch (err) {
      alert("Incorrect login details");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "0 auto",
          padding: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 2,
          transform: "translateY(-10%)",
        }}
      >
        <Typography variant="h5" textAlign="center">
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

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
}
