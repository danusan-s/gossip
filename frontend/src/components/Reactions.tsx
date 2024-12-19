import React from "react";
import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import { useAppSelector } from "../hooks";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Typography from "@mui/material/Typography";

export default function ReactionBox({
  id,
  type,
}: {
  id: number;
  type: string;
}) {
  const [reaction, setReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const account = useAppSelector((state) => state.account.value);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleReaction = (
    event: React.MouseEvent<HTMLElement>,
    newReaction: string | null,
  ) => {
    if (account === null) {
      alert("You must be logged in to react to a post.");
      return;
    }

    setReaction(newReaction);
    updateReaction(newReaction);
  };

  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${type}/${id}/reactions`);
        setLikeCount(response.data.like);
        setDislikeCount(response.data.dislike);
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
        console.log(response.data);
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
  }, [reaction]);

  const updateReaction = async (newReaction: string | null) => {
    console.log(newReaction);
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
        const response = newReaction === "like" ? 1 : 0;

        await axios.post(
          `${apiUrl}/${type}/${id}/reactions`,
          {
            reaction: `${response}`,
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
      sx={{ marginTop: "1rem" }}
    >
      <ToggleButton value="like" aria-label="like">
        <ThumbUpIcon />
        <Typography variant="body1" sx={{ marginLeft: "1rem" }}>
          {likeCount}
        </Typography>
      </ToggleButton>
      <ToggleButton value="dislike" aria-label="dislike">
        <ThumbDownIcon />
        <Typography variant="body1" sx={{ marginLeft: "1rem" }}>
          {dislikeCount}
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
