import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./login.css";

import BackgroundImage from "../../pictures/background.jpg";
import Logo from "../../pictures/ChatbotIcon.jpg";
import RegisterUser from "../RegisterUser";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email: inputEmail,
        password: inputPassword,
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setShow(true);
      } else {
        localStorage.setItem("userDetails", JSON.stringify(response.data.user));
        navigate("/chatbot");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred during login.");
      setShow(true);
    }

    setLoading(false);
  };

  const disableLogin = !inputEmail || !inputPassword;

  return (
    <>
      <div
        className="sign-in__wrapper"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
          <img
            className="img-thumbnail mx-auto d-block mb-3"
            src={Logo}
            alt="logo"
          />
          <div className="h4 mb-3 text-center">Sign In</div>
          {show && (
            <Alert
              className="mb-3"
              variant="danger"
              onClose={() => setShow(false)}
              dismissible
            >
              {errorMessage}
            </Alert>
          )}
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={inputEmail}
              placeholder="Email"
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={inputPassword}
              placeholder="Password"
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
          </Form.Group>
          {!loading ? (
            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled={disableLogin}
            >
              Log In
            </Button>
          ) : (
            <Button className="w-100" variant="primary" type="submit" disabled>
              Logging In...
            </Button>
          )}
          <div className="d-flex justify-content-end">
            <Button
              className="w-30 register_button"
              variant="primary"
              onClick={() => setShowDialogBox(true)}
            >
              Register User
            </Button>
          </div>
        </Form>
      </div>
      <RegisterUser
        setShowDialogBox={setShowDialogBox}
        showDialogBox={showDialogBox}
      />
    </>
  );
};

export default Login;
