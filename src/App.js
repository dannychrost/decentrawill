import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Faq from './pages/Faq';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';
import { Button } from 'react-bootstrap';
import { MainNavbar, AppNavbar, FooterNavbar } from './components/Navbar';
import { NavbarProvider, NavbarContext } from './contexts/NavbarContext';
import { WalletProvider } from './contexts/WalletContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <WalletProvider>
        <NavbarProvider>
          <div className='App'>
            <NavbarContext.Consumer>
              {({ headerValue }) =>
                headerValue === 0 ? <MainNavbar /> : <AppNavbar />
              }
            </NavbarContext.Consumer>
            <div
              style={{
                background: 'linear-gradient(315deg, #e056fd 0%, #000000 74%)',
                color: 'white',
                padding: '10vw',
                height: '100vh',
                overflow: 'hidden',
              }}
            >
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/faq' element={<Faq />} />
                <Route path='/createAccount' element={<CreateAccount />} />
                <Route path='/signIn' element={<SignIn />} />
              </Routes>
            </div>
            <FooterNavbar></FooterNavbar>
          </div>
        </NavbarProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
