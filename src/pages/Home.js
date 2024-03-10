// Home.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";

const Home = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return <div>Homepage 1</div>;
};

export default Home;
