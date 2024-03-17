import { render, screen } from '@testing-library/react';
import App from './App';

test('App Component Renders Correctly', () => {
  render(<App />);
  const linkElement = screen.getByText(/Team-Atlanta/i);
  expect(linkElement).toBeInTheDocument();
});
