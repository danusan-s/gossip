import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function SignIn({
  handleAccountLogin,
}: {
  handleAccountLogin: CallableFunction;
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        formData,
      );
      localStorage.setItem("token", response.data.token);
      handleAccountLogin(formData.username);
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
