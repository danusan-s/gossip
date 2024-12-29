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

  const { searchQuery } = useParams<{ searchQuery: string }>();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get<Thread[]>(
            `${apiUrl}/threads/search/${searchQuery}`,
          );
          setThreads(response.data);
        } else {
          const response = await axios.get<Thread[]>(`${apiUrl}/threads`);
          setThreads(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [searchQuery]);

  if (loading) return <div>Loading Threads...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ThreadList threads={threads} searchQuery={searchQuery} />;
}
