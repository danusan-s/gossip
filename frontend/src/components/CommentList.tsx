import { Typography, Stack, Grow } from "@mui/material";
import CommentSingle from "./CommentSingle";

interface Comment {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  time: string;
}

export default function CommentList({
  comments,
  handleDeleteComment,
}: {
  comments: Comment[];
  handleDeleteComment: (id: number) => void;
}) {
  const finalList = comments
    ? comments.map((comment: Comment, index) => {
        return (
          <Grow
            in={true}
            timeout={(index + 1) * 300}
            style={{ transformOrigin: "top" }}
          >
            <div>
              <CommentSingle
                key={comment.id}
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
