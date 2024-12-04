// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { BsPerson,BsSearch, BsHeart, BsCart3 } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyNavbar = () => {
  return (
   < Navbar bg="white" expand="lg" className="border-bottom">
    <Container fluid>
        <Navbar.Brand href="#" className="fw-bold" style={{ fontSize: '24px' }}>CHOIZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
            <Nav className="mx-auto">
              <Nav.Link href="#" style={{ marginLeft: '75px', marginRight: '75px' }}>Home</Nav.Link>
              <Nav.Link href="#" style={{ marginLeft: '75px', marginRight: '75px' }}>Shop</Nav.Link>
              <Nav.Link href="#" style={{ marginLeft: '75px', marginRight: '75px' }}>About</Nav.Link>
              <Nav.Link href="#" style={{ marginLeft: '75px', marginRight: '75px' }}>Contact</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        <Nav className="d-flex navbar-icons ">
            <Nav.Item>
                <Nav.Link style={{ marginRight: '10px' }} href="#"><BsPerson /></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{ marginLeft: '10px', marginRight: '10px' }}href="#"><BsSearch /></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{ marginLeft: '10px', marginRight: '10px' }} href="#"><BsHeart /></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{ marginLeft: '10px'}} href="#"><BsCart3 /></Nav.Link>
            </Nav.Item>
        </Nav>
    </Container>
</Navbar>
);
}

export default MyNavbar;
