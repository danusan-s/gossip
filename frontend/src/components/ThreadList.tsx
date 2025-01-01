import { Box, Stack, Typography, Grow } from "@mui/material";
import CategorySelect from "./CategorySelect";
import ThreadSingle from "./ThreadSingle";
import Hoverable from "./Hoverable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [visibleThreads, setVisibleThreads] = useState<Thread[]>([]);
  const navigate = useNavigate();

  const filterThreads = (threads: Thread[], category: string) => {
    return threads
      ? threads.filter((value) => {
          return !category || value.category === category;
        })
      : [];
  };

  const reloadThreads = (newCategory: string) => {
    setVisibleThreads([]);
    setTimeout(() => {
      setVisibleThreads(filterThreads(threads, newCategory));
    }, 1);
  };

  useEffect(() => {
    reloadThreads(category);
  }, [threads]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    reloadThreads(newCategory);
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
