import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { Box } from "@mui/material";

// Similar style to mui documentation but modified to work with smaller screens and be cover more of the app bar.

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
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(8),
    width: "50%",
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
    padding: theme.spacing(1, 0, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

/**
 * The SearchBar component allows the user to search for threads.
 * It displays a search bar where the user can enter a search query.
 * The user can submit the form to search for threads.
 *
 * @returns {JSX.Element} The SearchBar component
 */
export default function SearchBar(): JSX.Element {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = search.trim();
    setSearch("");
    if (!searchQuery) {
      navigate("/thread");
    } else {
      navigate(`/thread/search/${searchQuery}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Enter to search…"
          inputProps={{ "aria-label": "search" }}
          onChange={handleChange}
          value={search}
          fullWidth
        />
      </Search>
    </Box>
  );
}
