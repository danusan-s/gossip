import { useEffect, useState } from "react";
import ForumAppBar from "../components/ForumAppBar";
import ForumList from "../components/ForumList";
import ForumCreation from "../components/ForumCreation";

export default function ForumPage() {
  const [currentComponent, setCurrentComponent] = useState<string>("list");

  return (
    <>
      <ForumAppBar handleComponentSwitch={setCurrentComponent} />
      {currentComponent === "list" ? <ForumList /> : <ForumCreation />}
    </>
  );
}
