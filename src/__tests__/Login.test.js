import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

// Mock the axios module
jest.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("renders Login component correctly", () => {
    render(<Login />);

    // Check if the email and password fields are rendered
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

    // Check if the login and register buttons are rendered
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    expect(screen.getByText(/Register User/i)).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("handles form submission - success", async () => {
    // Mock a successful login response
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByText(/Log In/i);

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the login button
    fireEvent.click(loginButton);

    // Wait for the API call to complete
    await waitFor(() => {
      // Check if the axios.post was called with correct arguments
      expect(axios.post).toHaveBeenCalledWith("http://127.0.0.1:5000/login", {
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("handles form submission - failure", async () => {
    // Mock a failed login response
    axios.post.mockResolvedValue({ data: { error: true } });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByText(/Log In/i);

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Click the login button
    fireEvent.click(loginButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Incorrect email or password/i)).toBeInTheDocument();
    });
  });

  test("shows loading state during login", async () => {
    // Mock the axios post to delay the response
    axios.post.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 2000))
    );

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByText(/Log In/i);

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the login button
    fireEvent.click(loginButton);

    // Check for loading state
    expect(screen.getByText(/Logging In.../i)).toBeInTheDocument();

    // Wait for the axios post to resolve
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
