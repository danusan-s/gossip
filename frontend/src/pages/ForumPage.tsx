import { useState, useEffect } from "react";
import ForumAppBar from "../components/ForumAppBar";
import ForumList from "../components/ForumList";
import ForumCreation from "../components/ForumCreation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Forum from "../components/Forum";
import { Route, Routes } from "react-router-dom";

export default function ForumPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogin = (acc: string) => {
    setAccount(acc);
  };

  const handleLogout = () => {
    setAccount(null);
    localStorage.removeItem("token");
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/login/token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAccount(userData.user); // Set the user data from backend
      } else {
        console.error("Token verification failed");
        setAccount(null); // If verification fails, set user to null
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading User...</div>;

  return (
    <>
      <ForumAppBar account={account} handleAccountLogout={handleLogout} />
      <Routes>
        <Route path="/forum" element={<ForumList />} />
        <Route
          path="/forum/create"
          element={<ForumCreation account={account} />}
        />
        <Route
          path="/signin"
          element={<SignIn handleAccountLogin={handleLogin} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forum/:forumID" element={<Forum account={account} />} />
        <Route path="/*" element={<div>Page Not found</div>} />
      </Routes>
    </>
  );
}
