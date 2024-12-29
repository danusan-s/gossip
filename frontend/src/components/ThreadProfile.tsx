import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ThreadList from "./ThreadList";

interface Thread {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  time: string;
}

export default function ThreadHome() {
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

  if (loading) return <div>Loading Threads...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ThreadList threads={threads} />;
}
