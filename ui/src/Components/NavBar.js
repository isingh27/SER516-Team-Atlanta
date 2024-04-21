import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [triggerRerender, setTriggerRerender] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("taigaToken");
    localStorage.removeItem("projectId");
    localStorage.removeItem("projectName");
    // Trigger a re-render after logout
    setTriggerRerender(!triggerRerender);
    navigate("/");
  };

  // Simplified check for authentication status
  const isAuthenticated = !!localStorage.getItem("taigaToken");
  const projectId = !!localStorage.getItem("projectId");

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="primary"
      variant="dark"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/">Team-Atlanta</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname}>
            {isAuthenticated && (
              <>
                <Nav.Link href="/project-slug">Taiga Project</Nav.Link>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {projectId && (
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      Metrics
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#cycleTime">
                        Cycle Time
                      </Dropdown.Item>
                      <Dropdown.Item href="#leadTime">Lead Time</Dropdown.Item>
                      <Dropdown.Item href="#burndown">BurnDown</Dropdown.Item>
                      <Dropdown.Item href="#multiSprint">
                        Multi Sprint BurnDown
                      </Dropdown.Item>
                      <Dropdown.Item href="#wip">
                        Work In Progress
                      </Dropdown.Item>
                      <Dropdown.Item href="#throughput">
                        Throughput
                      </Dropdown.Item>
                      <Dropdown.Item href="#cfd">CFD</Dropdown.Item>
                      <Dropdown.Item href="#impedimentTracker">
                        Impediment Tracker
                      </Dropdown.Item>
                      <Dropdown.Item href="#SBPBCoupling">
                        SBPBCoupling
                      </Dropdown.Item>
                      <Dropdown.Item href="#taskCoupling">
                        Task Coupling
                      </Dropdown.Item>
                      <Dropdown.Item href="#costOfDelay">
                        Cost of Delay
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <Button onClick={() => navigate("/")}>Login</Button>
            ) : (
              <Button onClick={handleLogout}>Logout</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
