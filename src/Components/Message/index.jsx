import React from "react";
import { ListGroup } from "react-bootstrap";

const Message = ({ text, sender }) => {
  const isUser = sender === "user";
  return (
    <ListGroup.Item
      className={`mb-2 ${
        isUser ? "bg-primary text-white" : "bg-light text-dark"
      } rounded align-self-${isUser ? "end" : "start"}`}
      style={{ maxWidth: "75%" }}
    >
      {text}
    </ListGroup.Item>
  );
};

export default Message;
