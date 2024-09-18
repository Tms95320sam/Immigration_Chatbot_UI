import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Button,
  InputGroup,
  FormControl,
  Navbar,
  Image,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./chatbot.css";
import headingLogo from "../../pictures/chatbotLogo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import profilePlaceholder from "../../pictures/profile.jpeg"; // Placeholder image

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [username, setUsername] = useState("");
  const [userPicture, setUserPicture] = useState(profilePlaceholder);

  const sessionId = "unique-session-id";

  console.log("userPicture", userPicture);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails) {
      setUsername(userDetails.username);
      setUserPicture(`data:image/png;base64,${userDetails.picture}`);
    }
  }, []);

  console.log("userPicture", userPicture);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      sender: "user",
      text: input,
    };

    setMessages([...messages, newMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5005/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          text: input,
        }),
      });

      const botResponses = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        ...botResponses?.map((res) => ({ sender: "bot", text: res.text })),
      ]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  console.log("userPicture", userPicture);

  return (
    <>
      <div className={theme === "light" ? "light-theme" : "dark-theme"}>
        <Navbar
          className="navbar bg-body-tertiary fixed-top"
          bg={theme}
          data-bs-theme={theme}
          style={{
            marginBottom: "10px",
            paddingRight: "30px",
            paddingLeft: "30px",
          }}
        >
          <Navbar.Brand>
            <div className="container text-center">
              <div className="row">
                <div className="col">
                  <Image
                    src={headingLogo}
                    alt="logo"
                    roundedCircle
                    width="60"
                    height="60"
                  />
                </div>
                <div className="col">
                  <h1>Immigration Chatbot</h1>
                </div>
              </div>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
            <div style={{ paddingRight: "90px" }}>
              <Button
                variant={theme === "light" ? "dark" : "light"}
                onClick={toggleTheme}
                style={{ marginLeft: "10px" }}
              >
                <FontAwesomeIcon icon={faMoon} />
              </Button>
            </div>
            <h5 style={{ paddingTop: "10px", paddingRight: "10px" }}>
              {username}
            </h5>
            <Navbar.Text className="account-section">
              <Image
                src={`data:image/jpeg;base64,${userPicture}`}
                alt="User Profile"
                width="50px"
                height="50px"
                objectFit="cover"
                marginTop="10px"
                roundedCircle
              />
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Container
          fluid
          className="d-flex flex-column"
          style={{ marginTop: "80px", height: "calc(100vh - 80px)" }}
        >
          <Row className="justify-content-center align-items-center flex-grow-1">
            <Card
              className="card-section"
              style={{ width: "100%", maxWidth: "99%" }}
            >
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1 chat-window p-3 border rounded shadow-sm overflow-auto d-flex flex-column">
                  <div className="messages d-flex flex-column">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message ${
                          message.sender === "user"
                            ? "user-message"
                            : "bot-message"
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                </div>
                <InputGroup className="mt-3">
                  <FormControl
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button variant="primary" onClick={sendMessage}>
                    Send
                  </Button>
                </InputGroup>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ChatBot;
