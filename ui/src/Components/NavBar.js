import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [triggerRerender, setTriggerRerender] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('taigaToken');
    localStorage.removeItem('projectId');
    localStorage.removeItem('projectName');
    // Trigger a re-render after logout
    setTriggerRerender(!triggerRerender);
    navigate('/');
  };

  // Simplified check for authentication status
  const isAuthenticated = !!localStorage.getItem('taigaToken');

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">Team-Atlanta</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname}>
          {isAuthenticated &&
            <>
            <Nav.Link href="/project-slug">Taiga Project</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#cycleTime">Cycle Time</Nav.Link>
            <Nav.Link href="#leadTime">Lead Time</Nav.Link>
            <Nav.Link href="#brundown">BurnDown</Nav.Link>
            <Nav.Link href="#wip">Work In Progress</Nav.Link>
            <Nav.Link href="#throughput">Throughput</Nav.Link>
            <Nav.Link href="#cfd">CFD</Nav.Link>
            <Nav.Link href="#SBPBCoupling">SBPBCoupling</Nav.Link>
            </>  
          }         
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <Button onClick={() => navigate('/')}>Login</Button>
            ) : (
              <Button onClick={handleLogout}>Logout</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
