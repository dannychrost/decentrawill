import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Whatever from './pages/Whatever';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Link to='/'>
            <button>Home</button>
          </Link>
          <Link to='/Whatever'>
            <button>Home2</button>
          </Link>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Whatever' element={<Whatever />} />
        </Routes>
        <footer className='App-footer'></footer>
      </div>
    </Router>
  );
}

export default App;
