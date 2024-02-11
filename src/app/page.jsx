import dynamic from "next/dynamic";

import UserProfile from "../pages/UserProfile";
import Navbar from "../components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <UserProfile />
    </div>
  );
}

export default App;
