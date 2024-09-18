import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatBot from "../Pages/ChatBot";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ text: "Hello from bot!" }]),
  })
);

describe("ChatBot Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders ChatBot component correctly", () => {
    render(<ChatBot />);

    expect(screen.getByText(/Immigration Chatbot/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();

    expect(screen.getByText(/Send/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /moon/i })).toBeInTheDocument();
  });

  test("can type in the input box and send a message", async () => {
    render(<ChatBot />);

    // Type a message
    const inputElement = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(inputElement, { target: { value: "Hello" } });

    // Check if the input value is updated
    expect(inputElement.value).toBe("Hello");

    // Click the send button
    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    // Check if the user's message is displayed
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();

    // Wait for the bot response to appear
    const botResponse = await screen.findByText(/Hello from bot!/i);
    expect(botResponse).toBeInTheDocument();
  });

  test("toggle theme button works correctly", () => {
    render(<ChatBot />);

    // Get the toggle theme button
    const toggleButton = screen.getByRole("button", { name: /moon/i });

    // Initial theme should be light
    expect(document.querySelector(".light-theme")).toBeInTheDocument();

    // Click to toggle theme to dark
    fireEvent.click(toggleButton);

    // Now it should have dark theme
    expect(document.querySelector(".dark-theme")).toBeInTheDocument();
  });
});
