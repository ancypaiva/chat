import React, { useContext, useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./styles.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Register = () => {
  const [error, setError] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // const displayName = e.target[0].value;
    // const email = e.target[1].value;
    // const password = e.target[2].value;
    const file = e.target[3].files[0];
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      //console.log(displayName, "displayname");
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(response.user, {
              displayName: displayName,
              photoURL: downloadURL,
            });
            await sendEmailVerification(response.user);
            alert(
              "Verification email sent! Please check your email and then log in."
            );
            //create user on firestore
            const user = await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName: displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", response.user.uid), {});
            navigate("/login");
          } catch (error) {
            //console.log(error);
            setError(true);
            setLoading(false);
          }
        });
      });
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <Header />
      <Container>
        <Row className="row">
          <Col md={8} lg={6} xs={12}>
            <Card className="card">
              <Card.Body>
                <div className="main_div">
                  <h2 className="heading ">Register Page</h2>
                  <div className="top">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Group className="form" controlId="formBasicName">
                        <Form.Label style={{ display: "flex" }}>
                          Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          onChange={(e) => {
                            setDisplayName(e.target.value);
                          }}
                          placeholder="Name"
                          name="displayName"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid email.
                        </Form.Control.Feedback>
                      </Form.Group>

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
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Add an avatar</Form.Label>
                        <Form.Control type="file" placeholder="Password" />
                      </Form.Group>
                      <Form.Group
                        className="form"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button className="button" type="submit">
                          Create Account
                        </Button>
                      </div>
                      {error && <span>Something went wrong!</span>}
                    </Form>
                    <div className="bottom">
                      <p className="bottom2">
                        Already have an account?? <Link to="/login">Login</Link>
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

export default Register;
