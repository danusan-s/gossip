import MainAppBar from "../components/MainAppBar";
import ThreadHome from "../components/ThreadHome";
import ThreadCreation from "../components/ThreadCreation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Thread from "../components/ThreadFocus";
import Profile from "../components/Profile";
import { Route, Routes } from "react-router-dom";

export default function ForumPage() {
  return (
    <>
      <MainAppBar />
      <Routes>
        <Route path="/thread" element={<ThreadHome />} />
        <Route path="/thread/search/:searchQuery" element={<ThreadHome />} />
        <Route path="/thread/create" element={<ThreadCreation />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/thread/:threadID" element={<Thread />} />
        <Route path="/user/:userName" element={<Profile />} />
        <Route path="/*" element={<div>Page Not found</div>} />
      </Routes>
    </>
  );
}
