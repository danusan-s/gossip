import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

import {
  Box,
  Chip,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import LocalTimeChip from "./LocalTimeChip";
import ReactionBox from "./Reactions";
import ReportPopup from "./ReportPopup";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

/**
 * The ThreadSingle component displays a single thread with its title, description, author, reactions and category.
 * It also displays the time of the thread creation.
 *
 * If the thread is focused, it displays the full title and description along with more options:
 * - Copy Link
 * - Delete Thread if it belongs to the current user
 * - Edit Thread if it belongs to the current user
 *
 * @prop {Thread} threadData The thread data to display
 * @prop {boolean} focused Whether the thread is main focus and not part of a list. focused is optional and defaults to true
 * @returns {JSX.Element} The ThreadSingle component
 */
export default function ThreadSingle({
  threadData,
  focused = true,
}: {
  threadData: Thread;
  focused?: boolean;
}): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [reporting, setReporting] = useState<boolean>(false);
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
    if (account !== threadData.author) {
      alert("You do not have permission to delete this thread.");
      return;
    }

    const confirmed = confirm("Are you sure you want to delete this thread ?");

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/threads/${threadData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/thread");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to delete thread.");
    }
  };

  const handleEdit = async () => {
    if (account !== threadData.author) {
      alert("You do not have permission to delete this thread.");
      return;
    }
    navigate(`/thread/edit/${threadData.id}`);
  };

  const handleCopyLink = () => {
    const link = window.location.href; // Get the current page URL
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
    handleMenuClose();
  };

  const menuId = "thread-options-menu";
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
        {account === threadData.author && (
          <>
            <MenuItem onClick={handleDelete}>Delete Thread</MenuItem>
            <MenuItem onClick={handleEdit}>Edit Thread</MenuItem>
          </>
        )}
        <>
          <MenuItem disabled={copied} onClick={handleCopyLink}>
            {copied ? "Link Copied!" : "Copy Link"}
          </MenuItem>
          <MenuItem onClick={() => setReporting(true)}>Report Thread</MenuItem>
        </>
      </>
    </Menu>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Chip
            label={threadData.author}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${threadData.author}`);
            }}
          />
          <Chip label={threadData.category} />
        </Box>
        <LocalTimeChip time={threadData.time} />
      </Box>
      <Typography
        variant="h6"
        {...(!focused && {
          sx: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        })}
      >
        {threadData.title}
      </Typography>
      <Typography
        variant="body1"
        {...(!focused && {
          sx: {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 5,
            lineHeight: "1.5em",
          },
        })}
      >
        {threadData.description}
      </Typography>
      <Box sx={{ display: "flex", marginTop: "1rem" }}>
        <ReactionBox id={threadData.id} type={"threads"} />
        <Box sx={{ flexGrow: 1 }} />
        <Box>
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
      <ReportPopup
        open={reporting}
        setOpen={setReporting}
        type={"thread"}
        id={threadData.id}
        author={threadData.author}
      />
      {renderMenu}
    </>
  );
}
