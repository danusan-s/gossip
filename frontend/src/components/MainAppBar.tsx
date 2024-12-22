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
  InputBase,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";

import {
  Add as AddIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  AccountCircle,
  MoreVert as MoreIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Create as CreateIcon,
} from "@mui/icons-material";

import { styled, alpha } from "@mui/material/styles";
import ThemeSwitch from "./ThemeSwitch";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function ForumAppBar() {
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
    navigate("/forum");
  };

  const handleAccountProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const account = useAppSelector((state) => state.account.value);

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
          navigate("/forum/create");
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
          checked={useAppSelector((state) => state.theme.value)}
          sx={{ transform: "translateX(-6px)" }}
          onClick={() => {
            dispatch(toggleDarkTheme());
          }}
        />
        <Typography
          variant="button"
          onClick={() => dispatch(toggleDarkTheme())}
        >
          {useAppSelector((state) => state.theme.value) ? "Light" : "Dark"}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              sx={{ display: { xs: "flex", sm: "none" }, marginRight: "1rem" }}
              color="inherit"
              onClick={() => navigate("/forum")}
            >
              <HomeIcon />
            </IconButton>
            <Button
              variant="text"
              color="inherit"
              sx={{ display: { xs: "none", sm: "block" } }}
              onClick={() => navigate("/forum")}
            >
              <Typography variant="h6" noWrap component="div">
                Forums
              </Typography>
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <ThemeSwitch
                checked={useAppSelector((state) => state.theme.value)}
                onChange={() => dispatch(toggleDarkTheme())}
              ></ThemeSwitch>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {account !== null && (
                <IconButton
                  size="large"
                  aria-label="create new post"
                  color="inherit"
                  onClick={() => navigate("/forum/create")}
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
    </>
  );
}
