import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
 
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  useEffect(()=>{
    console.log("1");
    if(currentUser?.uid){
      console.log("2");

    navigate('/home');
    }
      },[currentUser])
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    async function isEmailVerified(user) {
      await user.reload(); 
      return user.emailVerified;
    }
    async function signInAndNavigate(auth, email, password) {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        const emailVerified = await isEmailVerified(response.user);
    
        if (emailVerified) {
          navigate("/home");
        } else {
          alert('Email not verified. Please verify your email before logging in.');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        alert('An error occurred while signing in.');
      }
    }
    
    // Call signInAndNavigate with your authentication object and user credentials
    signInAndNavigate(auth, email, password);
  };

  return (
    <div className="form-container">
      <Header/>
      <Container>
        <Row className="row">
          <Col md={8} lg={6} xs={12}>
            <Card className="card">
              <Card.Body>
                <div className="main_div">
                  <h2 className="heading ">Login Page</h2>
                  <div className="top">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      {" "}
                      <Form.Group className="form" controlId="formBasicEmail">
                        <Form.Label style={{ display: "flex" }}>
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          placeholder="Email"
                          name="email"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid email.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="form"
                        controlId="formBasicPassword"
                      >
                        <Form.Label style={{ display: "flex" }}>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          placeholder="Password"
                          name="password"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a password.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="form"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button className="button" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                    <div className="bottom">
                      <p className="bottom2">
                        Don't have an account??{" "}
                        <Link to="/register">Register</Link><br/>
                        <Link to="/resetpassword">Forgot Password</Link>
                      </p>
                    </div>
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

export default Login;
