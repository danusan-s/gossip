import axios from "axios";
import { useEffect, useState } from "react";

import { ToggleButton, CircularProgress } from "@mui/material";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/system";

interface Category {
  id: number;
  category: string;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "nowrap",
  overflowX: "auto",
  paddingBottom: theme.spacing(2),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: "50px 50px 50px 50px",
    padding: theme.spacing(1, 2),
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: "1px solid transparent",
    },
}));

/**
 * A mutually exclusive toggle button group for selecting category
 *
 * @prop {string | null} category The currently selected category
 * @prop {function} setCategory The function to call when a category is selected
 * @returns {JSX.Element | null} The CategorySelect component
 */
export default function CategorySelect({
  category,
  setCategory,
}: {
  category: string | null;
  setCategory: (newCategory: string | null) => void;
}): JSX.Element | null {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleCategory = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null,
  ) => {
    event.preventDefault();
    setCategory(newCategory);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    console.log("Loading Categories");
    return <CircularProgress color="inherit" />;
  }
  if (error) return <div>Error: {error}</div>;

  const list = categories
    ? categories.map((value) => {
        return (
          <ToggleButton
            key={value.id}
            value={value.category}
            aria-label={value.category}
          >
            {value.category}
          </ToggleButton>
        );
      })
    : null;

  return (
    <StyledToggleButtonGroup
      value={category}
      exclusive
      onChange={handleCategory}
      aria-label="category select"
    >
      {list}
    </StyledToggleButtonGroup>
  );
}
