import { Typography, Stack } from "@mui/material";
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
  handleDeleteComment: CallableFunction;
}) {
  return (
    <Stack spacing={2}>
      {comments ? (
        comments.map((comment: Comment) => (
          <CommentSingle
            key={comment.id}
            commentData={comment}
            handleDeleteComment={handleDeleteComment}
          />
        ))
      ) : (
        <Typography key="0" variant="body1" paddingLeft="2rem">
          No comments
        </Typography>
      )}
    </Stack>
  );
}
