import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Auth from '@/pages/auth';
import { signIn } from 'next-auth/react';
import axios from 'axios';

// Mocking next-auth's signIn function
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mocking the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking axios post method
jest.mock('axios');


describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mocking the useRouter hook
  jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'), // Use the actual next/router module
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));

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

  test('calls signIn function on login', async () => {
    render(<Auth />);
    
    // Mocking user input
    fireEvent.change(screen.getByLabelText('Email address or phone number'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));
    
    // Wait for signIn to be called and assert its arguments
    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
        callbackUrl: '/',
      })
    );
  });

  test('calls axios post and signIn functions on register', async () => {
    // Mocking axios.post response
    const axiosPostMock = jest.spyOn(axios, 'post');
    axiosPostMock.mockResolvedValueOnce({ data: {} });

    render(<Auth />);
    
    // Change to register variant
    fireEvent.click(screen.getByText('Create an account'));

    // Mocking user input
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Email address or phone number'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Click the "Sign up" button
    fireEvent.click(screen.getByText('Sign up'));

    // Wait for axios.post to be called and signIn to be called
    await waitFor(() => {
      expect(axiosPostMock).toHaveBeenCalledWith('/api/register', {
        email: 'test@example.com',
        name: 'testuser',
        password: 'password123',
      });

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
        callbackUrl: '/',
      });
    });
  });

});
