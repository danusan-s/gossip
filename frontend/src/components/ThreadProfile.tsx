import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ThreadList from "./ThreadList";
import { Typography } from "@mui/material";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

export default function ThreadProfile() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { userName } = useParams<{ userName: string }>();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get<Thread[]>(
          `${apiUrl}/user/${userName}/threads`,
        );
        setThreads(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [userName]);

  if (loading) {
    console.log("Loading Threads");
    return null;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Threads made by user:
      </Typography>
      <ThreadList threads={threads} />
    </>
  );
}
