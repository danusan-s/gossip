import { useEffect, useState } from "react";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface Category {
  id: number;
  category: string;
}

export default function CategorySelect({
  category,
  setCategory,
}: {
  category: string;
  setCategory: CallableFunction;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleCategory = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null,
  ) => {
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

  if (loading) return <div>Loading Categories...</div>;
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
    <ToggleButtonGroup
      value={category === "" ? null : category}
      exclusive
      onChange={handleCategory}
      aria-label="text alignment"
    >
      {list}
    </ToggleButtonGroup>
  );
}
