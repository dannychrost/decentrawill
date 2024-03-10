import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Faq from "./pages/Faq";
import Home2 from "./pages/Home2";
import { Button } from "react-bootstrap";
import { MainNavbar, AppNavbar, FooterNavbar } from "./components/Navbar";
import { NavbarProvider, NavbarContext } from "./NavbarContext";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <NavbarProvider>
        <div className="App">
          <NavbarContext.Consumer>
            {({ headerValue }) =>
              headerValue === 0 ? <MainNavbar /> : <AppNavbar />
            }
          </NavbarContext.Consumer>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Faq" element={<Faq />} />
            <Route path="/Home2" element={<Home2 />} />
          </Routes>

          <FooterNavbar></FooterNavbar>
        </div>
      </NavbarProvider>
    </Router>
  );
}

export default App;
