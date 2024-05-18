// Faq.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import { Container, Row, Col } from "react-bootstrap";

const Faq = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Frequently Asked Questions
          </h1>
          <div style={{ marginBottom: "1rem" }}>
            <h4>What is the purpose of this project?</h4>
            <p>
              The purpose of this project is to provide a decentralized platform
              for creating and managing digital wills. It allows users to
              securely store and distribute their digital assets, ensuring that
              their wishes are carried out after their passing. By leveraging
              blockchain technology, this project aims to provide transparency,
              immutability, and trust in the execution of wills.
            </p>
          </div>
          <div>
            <h4>What network does Decentrawill use?</h4>
            <p>Polygon's Amoy Testnet</p>
          </div>
          <div>
            <h4>What is Decentrawill's contract address?</h4>
            <p>
              <a
                href="https://amoy.polygonscan.com/address/0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6"
                target="_blank"
                rel="noopener noreferrer"
              >
                0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6
              </a>
            </p>
          </div>
          <div>
            <h4>Where can I view the source code?</h4>
            <p>
              You can view the source code of our project on{" "}
              <a
                href="https://github.com/dannychrost/decentrawill"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
            <p>
              Additionally, you can also view the smart contract's code on{" "}
              <a
                href="https://amoy.polygonscan.com/address/0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6#code"
                target="_blank"
                rel="noopener noreferrer"
              >
                PolygonScan
              </a>
              .
            </p>
          </div>
          <div>
            <h4>Who are the creators behind the project?</h4>
            <p>
              The project was initiated and developed by{" "}
              <a
                href="https://www.linkedin.com/in/daniel-chrostowski/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Daniel Chrostowski
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/jassem-j-03037b228/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jassem Jahangir
              </a>
              , who are senior students specializing in Computer Science at
              Hunter College, as a requirement for their Capstone Class.
            </p>
          </div>
          <div>
            <h4>
              Why does this project surpass other decentralized will
              initiatives?
            </h4>
            <p>
              This platform distinguishes itself in the realm of decentralized
              wills through its unparalleled versatility. It is engineered to
              accommodate any token that conforms to the ERC20 standard,
              utilizing OpenZeppelin's IERC20.sol interface to ensure broad
              compatibility.
            </p>
          </div>
          <div>
            <h4>Is the contract audited?</h4>
            <p>
              No, the contract has not been audited. Please use our site at your
              own risk.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;
