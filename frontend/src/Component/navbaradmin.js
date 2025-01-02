// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { BsPerson } from "react-icons/bs";
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
        <Navbar.Collapse id="navbarNav">
          <Nav className="mx-auto">
            <Nav.Link
              href="/listuser"
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
            <Nav.Link
              href="/listarticle"
              style={{ marginLeft: "75px", marginRight: "75px" }}
            >
              Article
            </Nav.Link>
            <div className="d-lg-none">
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </div>
          </Nav>
          <Nav className="d-none d-lg-flex navbar-icons">
            <Nav.Item>
              <NavDropdown
                title={<BsPerson />}
                id="navbar-person-dropdown"
                align="end"
                menuVariant="light"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
