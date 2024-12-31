import { Box, Stack, Typography } from "@mui/material";
import CategorySelect from "./CategorySelect";
import ThreadSingle from "./ThreadSingle";
import Hoverable from "./Hoverable";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grow } from "@mui/material";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

export default function ThreadList({
  threads,
  searchQuery = undefined,
}: {
  threads: Thread[];
  searchQuery?: string | undefined;
}) {
  const [category, setCategory] = useState<string>("");
  const navigate = useNavigate();

  const filterThreads = (threads: Thread[], category: string) => {
    const filteredThreads = threads
      ? threads.filter((value) => {
          return !category || value.category === category;
        })
      : [];
    return filteredThreads;
  };

  const [visibleThreads, setVisibleThreads] = useState(threads);

  // Unmount threads and remount to render all transitions again
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setVisibleThreads([]);
    setTimeout(() => {
      setVisibleThreads(filterThreads(threads, newCategory));
    }, 50);
  };

  const finalList =
    visibleThreads.length > 0
      ? visibleThreads.map((value, index) => {
          return (
            <Grow
              in={true}
              timeout={(index + 1) * 300}
              key={value.id}
              style={{ transformOrigin: "top" }}
            >
              <Hoverable onClick={() => navigate(`/thread/${value.id}`)}>
                <ThreadSingle threadData={value} focused={false} />
              </Hoverable>
            </Grow>
          );
        })
      : null;

  return (
    <>
      <Box display="flex" justifyContent="center" marginBottom="1rem">
        <CategorySelect
          category={category}
          setCategory={handleCategoryChange}
        />
      </Box>
      <Stack spacing={2} alignItems="center">
        {searchQuery && (
          <Typography variant="h5" gutterBottom>
            Search Results for "{searchQuery}":
          </Typography>
        )}
        {finalList || (
          <Typography variant="h6" gutterBottom>
            No threads found
          </Typography>
        )}
      </Stack>
    </>
  );
}
