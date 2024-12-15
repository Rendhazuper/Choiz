// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { BsPerson,BsSearch, BsHeart, BsCart3 } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';




const MyNavbar = () => {

  const handleLogout = async () => {
    const response = await fetch('http://localhost/Backend/Auth/logout.php', {
        method: 'POST',
        credentials: 'include',  // Mengirimkan cookie jika ada
    });

    try {
        // Cek apakah respons statusnya OK
        if (!response.ok) {
            throw new Error('Logout gagal');
        }

        // Cek teks respons yang diterima
        const text = await response.text();
        console.log("Raw response:", text);  // Tampilkan respons mentah untuk debugging

        // Jika respons adalah JSON yang valid, lanjutkan parsing
        const data = JSON.parse(text); // Gantilah dari response.json() ke JSON.parse()

        console.log('Session ID before logout:', data.session_id);

        if (data.status === 'success') {
            sessionStorage.removeItem("userLevel");
            sessionStorage.removeItem("username");

            console.log("Logout berhasil!");

            window.location.href = '/login';  // Redirect ke halaman login
        } else {
            alert('Logout gagal');
        }
    } catch (error) {
        console.error("Error parsing JSON:", error);  // Jika ada kesalahan saat parsing JSON
        alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
};

  return (
   < Navbar bg="white" expand="lg" className="border-bottom">
    <Container fluid>
        <Navbar.Brand href="#" className="fw-bold" style={{ fontSize: '24px' }}>CHOIZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
            <Nav className="mx-auto">
              <Nav.Link href="/" style={{ marginLeft: '75px', marginRight: '75px' }}>Home</Nav.Link>
              <Nav.Link href="/shop" style={{ marginLeft: '75px', marginRight: '75px' }}>Shop</Nav.Link>
              <Nav.Link href="/about" style={{ marginLeft: '75px', marginRight: '75px' }}>About</Nav.Link>
              <Nav.Link href="/Contact" style={{ marginLeft: '75px', marginRight: '75px' }}>Contact</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        <Nav className="d-flex navbar-icons ">
            <Nav.Item>
            <NavDropdown
              title={<BsPerson />}
              id="navbar-person-dropdown"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
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
