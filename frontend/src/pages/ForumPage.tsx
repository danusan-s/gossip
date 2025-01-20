import MainAppBar from "../components/MainAppBar";
import ThreadHome from "../components/ThreadHome";
import ThreadCreation from "../components/ThreadCreation";
import ThreadEdit from "../components/ThreadEdit";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Thread from "../components/ThreadFocus";
import Profile from "../components/Profile";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { useEffect, useState } from "react";
import { setAccount, unsetAccount } from "../slices/account";

/**
 * The ForumPage component manages the routing for the forum application.
 * It renders the main app bar and routes to the appropriate components.
 *
 * @returns {JSX.Element} The ForumPage component
 */

export default function ForumPage(): JSX.Element {
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

  if (loading) {
    console.log("Loading Forum Page");
    return null;
  }

  return (
    <>
      <MainAppBar />
      <Routes>
        <Route path="/thread" element={<ThreadHome />} />
        <Route path="/thread/search/:searchQuery" element={<ThreadHome />} />
        <Route path="/thread/create" element={<ThreadCreation />} />
        <Route path="/thread/edit/:threadID" element={<ThreadEdit />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/thread/:threadID" element={<Thread />} />
        <Route path="/user/:userName" element={<Profile />} />
        <Route path="/*" element={<div>Page Not found</div>} />
      </Routes>
    </>
  );
}
