import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import MoreIcon from "@mui/icons-material/MoreVert";
import LocalTimeChip from "./LocalTimeChip";
import Item from "./Item";
import ReactionBox from "./Reactions";

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
  time: string;
}

export default function ForumSingle({
  forumData,
  focused = true,
}: {
  forumData: Forum;
  focused?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (account !== forumData.author) {
      alert("You do not have permission to delete this forum.");
      return;
    }

    try {
      // Assuming the JWT is stored in localStorage
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/forums/${forumData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/forum");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to delete forum.");
    }
  };

  const handleCopyLink = () => {
    const link = window.location.href; // Get the current page URL
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
    handleMenuClose();
  };

  const menuId = "forum-options-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <>
        {account === forumData.author && (
          <MenuItem onClick={handleDelete}>Delete Forum</MenuItem>
        )}
        <MenuItem disabled={copied} onClick={handleCopyLink}>
          {copied ? "Link Copied!" : "Copy Link"}
        </MenuItem>
      </>
    </Menu>
  );

  return (
    <Item>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{forumData.title}</Typography>
        <Box>
          <LocalTimeChip time={forumData.time} />
          <Chip label={forumData.author} />
          {focused && (
            <IconButton
              size="large"
              edge="end"
              aria-label="post options"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {focused && (
        <>
          <Typography variant="body1">{forumData.description}</Typography>
          <ReactionBox id={forumData.id} type={"forums"} />
        </>
      )}
      {renderMenu}
    </Item>
  );
}
