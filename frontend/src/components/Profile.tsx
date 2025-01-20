import { Box, Grid2 as Grid } from "@mui/material";
import ThreadProfile from "../components/ThreadProfile";
import CommentProfile from "./CommentProfile";

/**
 * The Profile component displays the user's profile.
 * It shows the user's comments and threads.
 *
 * @returns {JSX.Element} The Profile component
 */
export default function Profile(): JSX.Element {
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
