// Registration.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterUser from '../Pages/RegisterUser';

test('renders the registration form', () => {
  render(<RegisterUser />);
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
});

test('validates email and password input', () => {
  render(<RegisterUser />);
  
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitButton = screen.getByRole('button', { name: /Register/i });

  // Simulate entering invalid email
  fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
  fireEvent.change(passwordInput, { target: { value: 'password1!' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();

  // Simulate entering a valid email but short password
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'pass' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/Password must be at least 5 characters long/i)).toBeInTheDocument();
});

test('submits the form with valid inputs', () => {
  render(<RegisterUser />);
  
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitButton = screen.getByRole('button', { name: /Register/i });

  // Simulate entering valid inputs
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password1!' } });
  fireEvent.click(submitButton);

  // Expect some submission effect, like a success message or redirect
  expect(screen.queryByText(/Register/i)).not.toBeInTheDocument(); // Assuming the form disappears on submission
});
