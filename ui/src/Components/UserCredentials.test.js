import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserCredentials from './UserCredentials';

describe('UserCredentials', () => {
  test('renders user credentials form', () => {
    render(<BrowserRouter><UserCredentials /></BrowserRouter>);
    
   // Assert that the form elements are rendered
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('displays error message when email or password is not entered', async () => {
    render(<BrowserRouter><UserCredentials /></BrowserRouter>);
    
    // Submit the form without entering email and password
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Please enter your email and password/i)).toBeInTheDocument();
    });
  });
});