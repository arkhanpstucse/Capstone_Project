import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📚 Book Library System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/books">All Books</Nav.Link>
            <Nav.Link as={Link} to="/books/new">Add Book</Nav.Link>
            
            <NavDropdown title="Search" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/search/author">By Author</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/genre">By Genre</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/publication">By Publication</NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link as={Link} to="/publication/summary">Publication Summary</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;