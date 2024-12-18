// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { BsPerson, BsSearch, BsHeart, BsCart3 } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminNavbar = () => {
  const handleLogout = async () => {
    const response = await fetch("http://localhost/Backend/Auth/logout.php", {
      method: "POST",
      credentials: "include",
    });

    try {
      if (!response.ok) {
        throw new Error("Logout gagal");
      }
      const text = await response.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);

      console.log("Session ID before logout:", data.session_id);

      if (data.status === "success") {
        sessionStorage.removeItem("userLevel");
        sessionStorage.removeItem("username");

        console.log("Logout berhasil!");

        window.location.href = "/login";
      } else {
        alert("Logout gagal");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container fluid>
        <Navbar.Brand
          href="/admin"
          className="fw-bold"
          style={{ fontSize: "24px" }}
        >
          CHOIZ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-center">
          <Nav className="mx-auto">
            <Nav.Link
              href="/UserCRUD"
              style={{ marginLeft: "75px", marginRight: "75px" }}
            >
              User
            </Nav.Link>
            <Nav.Link
              href="/produk"
              style={{ marginLeft: "75px", marginRight: "75px" }}
            >
              Product
            </Nav.Link>
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
            <Nav.Link
              style={{ marginLeft: "10px", marginRight: "10px" }}
              href="#"
            >
              <BsSearch />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              style={{ marginLeft: "10px", marginRight: "10px" }}
              href="#"
            >
              <BsHeart />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link style={{ marginLeft: "10px" }} href="/cart">
              <BsCart3 />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
