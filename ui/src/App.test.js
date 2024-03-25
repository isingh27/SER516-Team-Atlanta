import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from './GlobalContext'; // Ensure this is correctly imported

// Wrap App component with necessary context and router for testing
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui);
};

describe('App Component Smoke Tests', () => {
  test('renders UserCredentials at root route', () => {
    renderWithRouter(
      <GlobalProvider>
        <App />
      </GlobalProvider>,
      { route: '/' }
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('redirects to root route if not authenticated for protected routes', () => {
    renderWithRouter(
      <GlobalProvider>
        <App />
      </GlobalProvider>,
      { route: '/dashboard' }
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

});
