// Faq.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../NavbarContext";

const Faq = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return <div>Faq page</div>;
};

export default Faq;
