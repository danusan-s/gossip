import { useState, useEffect } from "react";
import ForumAppBar from "../components/ForumAppBar";
import ForumList from "../components/ForumList";
import ForumCreation from "../components/ForumCreation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Forum from "../components/Forum";

export default function ForumPage() {
  const [currentComponent, setCurrentComponent] = useState<string>("list");
  const [account, setAccount] = useState<string | null>(null);
  const [forumID, setForumID] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const handleForumListClick = (id: number) => {
    setCurrentComponent("forum");
    setForumID(id);
  };

  const handleLogin = (acc: string) => {
    setAccount(acc);
    setCurrentComponent("list");
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

  const getComponent = () => {
    switch (currentComponent) {
      case "loading":
        return <div> Loading user </div>;
      case "list":
        return <ForumList handleItemClick={handleForumListClick} />;
      case "create":
        return (
          <ForumCreation
            account={account}
            handleComponentSwitch={setCurrentComponent}
          />
        );
      case "signin":
        return <SignIn handleAccountLogin={handleLogin} />;
      case "signup":
        return <SignUp handleComponentSwitch={setCurrentComponent} />;
      case "forum":
        return <Forum id={forumID} />;
      default:
        return <ForumList handleItemClick={handleForumListClick} />;
    }
  };

  if (loading) return <div>Loading User...</div>;

  return (
    <>
      <ForumAppBar
        handleComponentSwitch={setCurrentComponent}
        account={account}
        handleAccountLogout={handleLogout}
      />
      {getComponent()}
    </>
  );
}
