import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Faq from './pages/Faq';
import Home2 from './pages/Home2';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Link to='/'>
            <button class='home-btn'>Home</button>
          </Link>
          <Link to='/Faq'>
            <button class='faq-btn'>FAQ</button>
          </Link>
          <Link to='/Home2'>
            <button class='enter-app-btn'>Enter Application</button>
          </Link>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Faq' element={<Faq />} />
          <Route path='/Home2' element={<Home2 />} />
        </Routes>
        <footer className='App-footer'></footer>
      </div>
    </Router>
  );
}

export default App;
