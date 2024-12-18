import { Paper, Box, Typography, Chip, Grid2 as Grid } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "./Comments";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

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
}

export default function Forum({ account }: { account: string | null }) {
  const [forum, setForum] = useState<Forum>({
    id: 0,
    title: "",
    description: "",
    author: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { forumID } = useParams<{ forumID: string }>();
  const id = parseInt(forumID || "", 10);

  if (isNaN(id)) {
    return <div>Invalid forum ID</div>;
  }

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
              <Chip label={forum.author} />
            </Box>
            <Typography variant="body1">{forum.description}</Typography>
          </Item>
          <Comments forumId={id} account={account} />
        </Grid>
      </Grid>
    </Box>
  );
}
