import dynamic from "next/dynamic";

import UserProfile from "../pages/UserProfile";
import Navbar from "../components/Navbar";

function App() {
  return (
    <div className="App">
      <UserProfile />
    </div>
  );
}

export default App;
