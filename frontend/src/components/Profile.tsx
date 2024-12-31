import { Box, Grid2 as Grid } from "@mui/material";
import ThreadProfile from "../components/ThreadProfile";
import CommentProfile from "./CommentProfile";

export default function Profile() {
  return (
    <>
      <Box sx={{ margin: "1rem" }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
            <CommentProfile />
            <ThreadProfile />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
