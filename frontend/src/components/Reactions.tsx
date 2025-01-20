import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../hooks";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ThumbUpOutlineIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlineIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Typography from "@mui/material/Typography";

/**
 * The ReactionBox component displays the like and dislike reactions for a post.
 * It allows the user to react to a post with a like or dislike.
 *
 * @prop {number} id The ID of the thread/comment to react to
 * @prop {string} type "threads" for thread and "comments" for comment
 * @returns {JSX.Element} The ReactionBox component
 */
export default function ReactionBox({
  id,
  type,
}: {
  id: number;
  type: string;
}): JSX.Element {
  const [reaction, setReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleReaction = (
    event: React.MouseEvent<HTMLElement>,
    newReaction: string | null,
  ) => {
    event.stopPropagation();
    if (account === null) {
      alert("You must be logged in to react to a post.");
      return;
    }
    if (reaction === "like") {
      setLikeCount(likeCount - 1);
    } else if (reaction === "dislike") {
      setDislikeCount(dislikeCount - 1);
    }

    if (newReaction === "like") {
      setLikeCount(likeCount + 1);
    } else if (newReaction === "dislike") {
      setDislikeCount(dislikeCount + 1);
    }

    setReaction(newReaction);
    updateReaction(newReaction);
  };

  // Decided not to fetch everytime the reaction changes
  // This is a lot of unnecessary requests
  // Also this caused a few artifacts due to the async nature of the requests
  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${type}/${id}/reactions`);
        setLikeCount(parseInt(response.data.like));
        setDislikeCount(parseInt(response.data.dislike));
      } catch (err) {
        console.error("Error sending request:", err);
        alert("Failed to fetch reaction.");
      }
    };
    const fetchUserReaction = async () => {
      try {
        if (account === null) {
          return;
        }

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${apiUrl}/${type}/${id}/reactions/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.reaction === "1") {
          setReaction("like");
        } else if (response.data.reaction === "0") {
          setReaction("dislike");
        } else {
          setReaction(null);
        }
      } catch (err) {
        console.error("Error sending request:", err);
        alert("Failed to fetch reaction.");
      }
    };

    fetchReaction();
    fetchUserReaction();
  }, []);

  const updateReaction = async (newReaction: string | null) => {
    if (newReaction === null) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`${apiUrl}/${type}/${id}/reactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Error sending request:", err);
        alert("Failed to delete reaction.");
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        const reactionState = newReaction === "like" ? "1" : "0";

        await axios.post(
          `${apiUrl}/${type}/${id}/reactions`,
          {
            reaction: `${reactionState}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error("Error sending request:", err);
        alert("Failed to update reaction.");
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={reaction}
      exclusive
      onChange={handleReaction}
      aria-label={`${type} reactions`}
    >
      <ToggleButton
        value="like"
        aria-label="like"
        sx={{
          borderRadius: "50px 0 0 50px",
          paddingLeft: "1rem",
        }}
      >
        {reaction === "like" ? (
          <ThumbUpIcon fontSize="small" />
        ) : (
          <ThumbUpOutlineIcon fontSize="small" />
        )}
        <Typography variant="button" sx={{ marginLeft: "0.5rem" }}>
          {likeCount < 1000 ? likeCount : Math.round(likeCount / 1000) + "k"}
        </Typography>
      </ToggleButton>
      <ToggleButton
        value="dislike"
        aria-label="dislike"
        sx={{ borderRadius: "0 50px 50px 0", paddingRight: "1rem" }}
      >
        <Typography variant="button" sx={{ marginRight: "0.5rem" }}>
          {dislikeCount < 1000
            ? dislikeCount
            : Math.round(dislikeCount / 1000) + "k"}
        </Typography>
        {reaction === "dislike" ? (
          <ThumbDownIcon fontSize="small" />
        ) : (
          <ThumbDownOutlineIcon fontSize="small" />
        )}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
