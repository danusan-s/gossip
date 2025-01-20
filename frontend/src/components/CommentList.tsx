import { Typography, Stack, Grow } from "@mui/material";
import CommentSingle from "./CommentSingle";

interface Comment {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  time: string;
}

/**
 * The CommentList component displays a list of comments.
 *
 * @prop {Comment[]} comments The list of comments to display
 * @prop {function} handleDeleteComment The function to call when a comment is deleted
 * @returns {JSX.Element} The CommentList component
 */
export default function CommentList({
  comments,
  handleDeleteComment,
}: {
  comments: Comment[];
  handleDeleteComment: (id: number) => void;
}): JSX.Element {
  const finalList = comments
    ? comments.map((comment: Comment, index) => {
        return (
          <Grow
            in={true}
            timeout={(index + 1) * 300}
            style={{ transformOrigin: "top" }}
            key={comment.id}
          >
            <div>
              <CommentSingle
                commentData={comment}
                handleDeleteComment={handleDeleteComment}
              />
            </div>
          </Grow>
        );
      })
    : null;

  return (
    <Stack spacing={2}>
      {finalList || (
        <Typography variant="body1" paddingLeft="2rem">
          No comments
        </Typography>
      )}
    </Stack>
  );
}
