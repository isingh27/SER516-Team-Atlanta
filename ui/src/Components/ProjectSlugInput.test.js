import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectSlugInput from './ProjectSlugInput';


describe('ProjectSlugInput Component', () => {
    it('renders without crashing', () => {
      render(<BrowserRouter><ProjectSlugInput /></BrowserRouter>);
    });
  
    it('initializes with correct state values', () => {
      const { container } = render(<BrowserRouter><ProjectSlugInput /></BrowserRouter>);
      const projectSlugInput = container.querySelector('[placeholder="Enter project slug or Select"]');
      expect(projectSlugInput).toBeInTheDocument;
  
    });
  
    it('simulates form submission', async () => {
      const { container} = render(<BrowserRouter><ProjectSlugInput /></BrowserRouter>);
      const submitButton = container.querySelector('[type="submit"]');
      expect(submitButton).toBeInTheDocument;
      
    });
});