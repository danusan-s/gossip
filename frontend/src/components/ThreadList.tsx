import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import CategorySelect from "./CategorySelect";
import ThreadSingle from "./ThreadSingle";
import Hoverable from "./Hoverable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  console.log(threads);

  const list = threads
    ? threads.map((value) => {
        if (category && value.category !== category) return null;
        return (
          <Hoverable
            onClick={() => navigate(`/thread/${value.id}`)}
            key={value.id}
          >
            <ThreadSingle threadData={value} focused={false} />
          </Hoverable>
        );
      })
    : null;

  const emptyList = !list || list.every((value) => value === null);

  return (
    <>
      <Box display="flex" justifyContent="center" marginBottom="1rem">
        <CategorySelect category={category} setCategory={setCategory} />
      </Box>
      <Stack spacing={2} alignItems="center">
        {searchQuery && (
          <Typography variant="h5" gutterBottom>
            Search Results for "{searchQuery}":
          </Typography>
        )}
        {emptyList ? (
          <Typography variant="h6" gutterBottom>
            No threads found
          </Typography>
        ) : (
          list
        )}
      </Stack>
    </>
  );
}
