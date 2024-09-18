import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="primary" type="submit">
          Send
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageInput;
