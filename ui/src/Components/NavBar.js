import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" data-bs-theme="dark">
    <Container>
      <Navbar.Brand>Team-Atlanta</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/project-slug">Taiga Project</Nav.Link>
          <Nav.Link href="/metric-input">Metrics</Nav.Link>
        </Nav>
        <Nav>
        <Nav.Link href="/">Login</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}
