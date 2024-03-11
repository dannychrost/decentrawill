// Home.js
import { useEffect, useContext } from 'react';
import { NavbarContext } from '../contexts/NavbarContext';

const Home = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return (
    <div
      style={{
        background: 'linear-gradient(315deg, #e056fd 0%, #000000 74%)',
        color: 'white',
        padding: '1rem',
        height: '100vh',
        width: '100vw',
      }}
    >
      Homepage 1
    </div>
  );
};

export default Home;
