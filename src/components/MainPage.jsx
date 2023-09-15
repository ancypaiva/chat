import React from "react";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Logo from '../img/simplychatify.png'

const MainPage = () => {
  const history = useNavigate();
  function submit() {
    history("/register");
  }
  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col>
            <Container>
              <h1 style={{ display: "flex", textAlign: "center" }}>
                Private and Public Chat, Simplified.
              </h1>
              <br />
              <p style={{ textAlign: "justify" }}>
                At Simplychatify, we believe in the power of communication to
                connect people and build meaningful relationships. Our mission
                is to provide a seamless chat experience that brings individuals
                closer, whether they're connecting with friends, family, or
                making new acquaintances in our vibrant public chat rooms.
              </p>
              <Button
                style={{
                  border: "black",
                  borderRadius: "1px",
                }}
                type="submit"
                className="buttons"
                onClick={submit}
              >
                Explore Now
              </Button>
            </Container>
          </Col>
          <Col xs={6} md={4}>
            <br />
            <Image style={{ width: "390px" }} src={Logo} square />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default MainPage;
