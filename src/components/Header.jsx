import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../pages/styles.css";

const Header = () => {
  return (
    <div>
      <Navbar className="header">
        <Container>
          <Navbar.Brand
            className="flora-title"
            style={{ color: "white ", fontSize: "30px" }}
          >
            SimplyChatify
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/" style={{ color: "white" }}>
              Home
            </Nav.Link>
            <Nav.Link href="/register" style={{ color: "white" }}>
             Register
            </Nav.Link>
            <Nav.Link href="/login" style={{ color: "white" }}>
              Login
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;