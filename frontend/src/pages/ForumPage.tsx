import * as React from "react";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import ForumAppBar from "../components/ForumAppBar";
import ForumSideBar from "../components/ForumSideBar";

export default function Blog(props: { disableCustomTheme?: boolean }) {
  return (
    <>
      <ForumAppBar />
      <ForumSideBar />
    </>
  );
}
