import { useState, useEffect } from "react";
import MainAppBar from "../components/MainAppBar";
import ForumList from "../components/ForumList";
import ForumCreation from "../components/ForumCreation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Forum from "../components/Forum";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { setAccount, unsetAccount } from "../slices/account";

export default function ForumPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${apiUrl}/login/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(setAccount(userData.user));
      } else {
        console.error("Token verification failed");
        dispatch(unsetAccount());
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
      dispatch(unsetAccount());
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
      <MainAppBar />
      <Routes>
        <Route path="/forum" element={<ForumList />} />
        <Route path="/forum/search/:searchQuery" element={<ForumList />} />
        <Route path="/forum/create" element={<ForumCreation />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forum/:forumID" element={<Forum />} />
        <Route path="/*" element={<div>Page Not found</div>} />
      </Routes>
    </>
  );
}
