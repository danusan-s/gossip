import { useEffect, useState } from "react";
import ForumAppBar from "../components/ForumAppBar";
import ForumList from "../components/ForumList";
import ForumCreation from "../components/ForumCreation";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function ForumPage() {
  const [currentComponent, setCurrentComponent] = useState<string>("list");
  const [account, setAccount] = useState<string | null>(null);

  const component = () => {
    switch (currentComponent) {
      case "list":
        return <ForumList />;
      case "create":
        return <ForumCreation handleComponentSwitch={setCurrentComponent} />;
      case "signin":
        return (
          <SignIn
            handleAccount={setAccount}
            handleComponentSwitch={setCurrentComponent}
          />
        );
      case "signup":
        return <SignUp handleComponentSwitch={setCurrentComponent} />;
      default:
        return <ForumList />;
    }
  };

  return (
    <>
      <ForumAppBar
        handleComponentSwitch={setCurrentComponent}
        account={account}
      />
      {component()}
    </>
  );
}
