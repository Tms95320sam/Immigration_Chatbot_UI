import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const RegisterUser = ({ setShowDialogBox, showDialogBox }) => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [picturePreview, setPicturePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePictureChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validatePassword = (password) => {
    const letterPattern = /[a-zA-Z]/;
    const symbolPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 5 &&
      letterPattern.test(password) &&
      symbolPattern.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(inputPassword)) {
      setPasswordError(
        "Password must be at least 5 characters long and contain at least one letter and one symbol."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const base64Picture = picturePreview.split(",")[1]; // Extract Base64 part

      const response = await axios.post("http://127.0.0.1:5000/register", {
        username: inputUsername,
        email: inputEmail,
        password: inputPassword,
        picture: base64Picture,
      });

      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        setShow(true);
        setTimeout(() => setShow(false), 3000);
        setInputUsername("");
        setInputPassword("");
        setInputEmail("");
        setPicturePreview("");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={showDialogBox} onHide={() => setShowDialogBox(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show && (
            <Alert variant="success" onClose={() => setShow(false)} dismissible>
              User registered successfully!
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          )}
          {passwordError && (
            <Alert variant="danger" onClose={() => setPasswordError("")}>
              {passwordError}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                required
              />
              {picturePreview && (
                <div className="mt-3">
                  <img
                    src={picturePreview}
                    alt="Profile Preview"
                    style={{
                      width: "250px",
                      height: "250px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterUser;
