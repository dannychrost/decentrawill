// Home.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Home2 = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(1);
  }, [setHeaderValue]);

  return <div>Hello</div>;
};

export default Home2;
