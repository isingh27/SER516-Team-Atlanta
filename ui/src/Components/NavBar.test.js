import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';


describe('NavBar', () => {
  test('renders navbar brand', () => {
    render(<BrowserRouter><NavBar /></BrowserRouter>);
    const brandElement = screen.getByText(/Team-Atlanta/i);
    expect(brandElement).toBeInTheDocument();
  });
  test('renders navbar links', () => {
    const { container} = render(<BrowserRouter><NavBar /></BrowserRouter>);
    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument;
  });
});