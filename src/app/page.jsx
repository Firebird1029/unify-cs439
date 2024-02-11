import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("../components/HomePage"), {
  ssr: false,
});

function App() {
  return (
    <div className="App">
      Unify
      <HomeContent />
    </div>
  );
}

export default App;
