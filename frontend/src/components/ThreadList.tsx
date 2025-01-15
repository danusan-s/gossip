import { Box, Stack, Typography, Grow, Pagination } from "@mui/material";
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
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [reloading, setReloading] = useState<boolean>(true);
  const threadPerPage = 5;
  const navigate = useNavigate();

  const filterThreads = (threads: Thread[], category: string | null) => {
    return threads
      ? threads.filter((value) => {
          return !category || value.category === category;
        })
      : [];
  };

  const reloadThreads = (newCategory: string | null) => {
    setFilteredThreads([]);
    setReloading(true);
    setTimeout(() => {
      setFilteredThreads(filterThreads(threads, newCategory));
      setReloading(false);
    }, 1);
  };

  useEffect(() => {
    reloadThreads(category);
  }, [threads]);

  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
    reloadThreads(newCategory);
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(value);
  };

  const finalList =
    filteredThreads.length > 0
      ? filteredThreads.map((value, index) => {
          if (
            index < (page - 1) * threadPerPage ||
            index >= page * threadPerPage
          ) {
            return null;
          }
          return (
            <Grow
              in={true}
              timeout={(index + 1 - (page - 1) * threadPerPage) * 300}
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

        {finalList ||
          (reloading ? null : (
            <Typography variant="h6" gutterBottom>
              No threads found
            </Typography>
          ))}
      </Stack>
      {finalList ? (
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Pagination
            count={Math.ceil(filteredThreads.length / threadPerPage)}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      ) : null}
    </>
  );
}
