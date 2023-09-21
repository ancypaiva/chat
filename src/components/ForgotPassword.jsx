import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Header from "./Header";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then((data) => {
        alert("Reset email sent.Please check your email!");
        navigate("/login");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <div className="form-container">
      {/* <h1>
            Forgot Password
        </h1> */}
      {/* <form onSubmit={(e) => {handleSubmit(e)}}>
          <label>
            Email
            <input
              name="email"
              type="email"
            />
          </label><br/><br/>
          <button type="submit">Reset password</button>
        </form> */}
        <Header/>
      <Container>
        <Row className="row">
          <Col md={8} lg={6} xs={12}>
            <Card className="card">
              <Card.Body>
                <div className="main_div">
                  <h2 className="heading ">Forgot Password</h2>
                  <div className="top">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      {" "}
                      <Form.Group className="form" controlId="formBasicEmail">
                        <Form.Label style={{ display: "flex" }}>
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          name="email"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid email.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="d-grid">
                        <Button className="button" type="submit">
                          Reset Password
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
