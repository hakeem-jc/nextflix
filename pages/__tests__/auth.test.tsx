import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Auth from '@/pages/auth';

describe('Auth', () => {
  it('renders the login variant by default', () => {
    render(<Auth />);

    const signInText = screen.getByText('Sign in');
    const emailInput = screen.getByLabelText('Email address or phone number');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');
    const createAccountLink = screen.getByText('Create an account');

    expect(signInText).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(createAccountLink).toBeInTheDocument();
  });

  it('toggles between login and register variants', () => {
    render(<Auth />);

    const createAccountLink = screen.getByText('Create an account');
    fireEvent.click(createAccountLink);

    const signUpText = screen.getByText('Register');
    const nameInput = screen.getByLabelText('Username');

    expect(signUpText).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();

    fireEvent.click(createAccountLink);

    const signInText = screen.getByText('Sign in');
    const emailInput = screen.getByLabelText('Email address or phone number');
    const passwordInput = screen.getByLabelText('Password');

    expect(signInText).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('updates state when input values change', () => {
    render(<Auth />);

    const emailInput = screen.getByLabelText('Email address or phone number');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

});
