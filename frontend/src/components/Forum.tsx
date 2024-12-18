import {
  Paper,
  Box,
  Typography,
  Chip,
  Grid2 as Grid,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "./Comments";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import LocalTimeChip from "./LocalTimeChip";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  width: "100%",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  textTransform: "none",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface Forum {
  id: number;
  title: string;
  description: string;
  author: string;
  time: string;
}

export default function Forum({ account }: { account: string | null }) {
  const [forum, setForum] = useState<Forum>({
    id: 0,
    title: "",
    description: "",
    author: "",
    time: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { forumID } = useParams<{ forumID: string }>();
  const id = parseInt(forumID || "", 10);

  if (isNaN(id)) {
    return <div>Invalid forum ID</div>;
  }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await axios.get<Forum>(
          `http://localhost:8080/api/forums/${id}`,
        );
        setForum(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchForum();
  }, [id]);

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (account !== forum.author) {
      alert("You do not have permission to delete this forum.");
      return;
    }

    try {
      // Assuming the JWT is stored in localStorage
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/forums/${id}`, {
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
        {account === forum.author && (
          <MenuItem onClick={handleDelete}>Delete Forum</MenuItem>
        )}
        <MenuItem disabled={copied} onClick={handleCopyLink}>
          {copied ? "Link Copied!" : "Copy Link"}
        </MenuItem>
      </>
    </Menu>
  );

  return (
    <Box sx={{ margin: "2rem" }}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 8 }} offset={{ xs: 0, sm: 2 }}>
          <Item>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{forum.title}</Typography>
              <Box>
                <LocalTimeChip time={forum.time} />
                <Chip label={forum.author} />
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
              </Box>
            </Box>
            <Typography variant="body1">{forum.description}</Typography>
          </Item>
          <Comments forumId={id} account={account} />
        </Grid>
      </Grid>
      {renderMenu}
    </Box>
  );
}
