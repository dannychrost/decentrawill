import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";

import CreatorHome from "./pages/CreatorHome";
import BeneficiaryHome from "./pages/BeneficiaryHome";

import Faq from "./pages/Faq";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import { Button } from "react-bootstrap";
import { MainNavbar, AppNavbar, FooterNavbar } from "./components/Navbar";
import { NavbarProvider, NavbarContext } from "./contexts/NavbarContext";
import { WalletProvider } from "./contexts/WalletContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <NavbarProvider>
            <div
              className="App"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div>
                <NavbarContext.Consumer>
                  {({ headerValue }) =>
                    headerValue === 0 ? <MainNavbar /> : <AppNavbar />
                  }
                </NavbarContext.Consumer>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(315deg, #e056fd 0%, #000000 74%)",
                  color: "white",
                  padding: "10vw",

                  overflow: "hidden",
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/faq" element={<Faq />} />
                  <Route path="/createAccount" element={<CreateAccount />} />
                  <Route path="/signIn" element={<SignIn />} />
                  <Route path="/creator" element={<CreatorHome />} />
                  <Route path="/beneficiary" element={<BeneficiaryHome />} />
                </Routes>
              </div>
              <div>
                <FooterNavbar></FooterNavbar>
              </div>
            </div>
          </NavbarProvider>
        </Router>{" "}
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
