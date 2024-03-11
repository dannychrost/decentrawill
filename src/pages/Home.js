// Home.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";

const Home = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return <div>Main Site</div>;
};

export default Home;
