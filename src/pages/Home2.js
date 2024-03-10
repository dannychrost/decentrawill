// Home2.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../NavbarContext";

const Home2 = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(1);
  }, [setHeaderValue]);

  return <div>Home 2 Page</div>;
};

export default Home2;
