import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { unsetAccount } from "../slices/account";
import { toggleDarkTheme } from "../slices/theme";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Link,
} from "@mui/material";

import {
  Add as AddIcon,
  Home as HomeIcon,
  AccountCircle,
  MoreVert as MoreIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Create as CreateIcon,
} from "@mui/icons-material";

import ThemeSwitch from "./ThemeSwitch";
import SearchBar from "./SearchBar";

export default function ThreadAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleAccountSignIn = () => {
    handleMenuClose();
    navigate("/signin");
  };

  const handleAccountSignUp = () => {
    handleMenuClose();
    navigate("/signup");
  };

  const handleLogoutClick = () => {
    dispatch(unsetAccount());
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/thread");
  };

  const account = useAppSelector((state) => state.account.value);

  const handleAccountProfile = () => {
    handleMenuClose();
    navigate(`/user/${account}`);
  };

  const menuId = "primary-search-account-menu";
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
      {account !== null && (
        <>
          <MenuItem onClick={handleAccountProfile}>My account</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </>
      )}
      {account === null && (
        <>
          <MenuItem onClick={handleAccountSignIn}>Sign In</MenuItem>
          <MenuItem onClick={handleAccountSignUp}>Sign Up</MenuItem>
        </>
      )}
    </Menu>
  );

  const darkTheme = useAppSelector((state) => state.theme.value);

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          navigate("/thread/create");
          handleMobileMenuClose();
        }}
      >
        <AddIcon sx={{ marginRight: "1rem" }} />
        <Typography variant="button">Create New Post</Typography>
      </MenuItem>
      {account !== null && (
        <>
          <MenuItem onClick={handleAccountProfile}>
            <AccountCircle sx={{ marginRight: "1rem" }} />
            <Typography variant="button">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <LogoutIcon sx={{ marginRight: "1rem" }} />
            <Typography variant="button">Log out</Typography>
          </MenuItem>
        </>
      )}
      {account === null && (
        <>
          <MenuItem onClick={handleAccountSignIn}>
            <LoginIcon sx={{ marginRight: "1rem" }} />
            <Typography variant="button">Log In</Typography>
          </MenuItem>
          <MenuItem onClick={handleAccountSignUp}>
            <CreateIcon sx={{ marginRight: "1rem" }} />
            <Typography variant="button">Sign up</Typography>
          </MenuItem>
        </>
      )}
      <MenuItem>
        <ThemeSwitch
          checked={darkTheme}
          sx={{ transform: "translateX(-6px)" }}
          onClick={() => {
            localStorage.setItem("preferDarkMode", JSON.stringify(!darkTheme));
            dispatch(toggleDarkTheme());
          }}
        />
        <Typography
          variant="button"
          onClick={() => {
            localStorage.setItem("preferDarkMode", JSON.stringify(!darkTheme));
            dispatch(toggleDarkTheme());
          }}
        >
          {useAppSelector((state) => state.theme.value) ? "Light" : "Dark"}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, marginRight: "1rem" }}
            color="inherit"
            onClick={() => navigate("/thread")}
          >
            <HomeIcon />
          </IconButton>
          <Link
            color="inherit"
            sx={{
              display: { xs: "none", md: "block" },
              textDecoration: "none",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            rel="noopener"
            onClick={() => navigate("/thread")}
          >
            <Typography variant="h6" component="div">
              Gossip
            </Typography>
          </Link>
          <SearchBar />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <ThemeSwitch
              checked={darkTheme}
              onClick={() => {
                localStorage.setItem(
                  "preferDarkMode",
                  JSON.stringify(!darkTheme),
                );
                dispatch(toggleDarkTheme());
              }}
            />
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {account !== null && (
              <IconButton
                size="large"
                aria-label="create new post"
                color="inherit"
                onClick={() => navigate("/thread/create")}
              >
                <AddIcon />
              </IconButton>
            )}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
