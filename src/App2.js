import "./App2.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Whatever from "./pages/Faq";

function App2() {
  return (
    <div className="App">
      {/*change the header here */}
      <header className="App-header">
        <Link to="/">
          <button>Home</button>
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Whatever" element={<Whatever />} />
      </Routes>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App2;
