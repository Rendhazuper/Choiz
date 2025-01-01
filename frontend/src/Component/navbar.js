import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { BsPerson, BsCart3 } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const ResponsiveNavItem = ({
  icon,
  text,
  href,
  isDropdown,
  children,
  onClick,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDropdown && !isSmallScreen) {
    return (
      <NavDropdown title={icon} id="basic-nav-dropdown" align="end">
        {children}
      </NavDropdown>
    );
  }

  return (
    <Nav.Link href={href} onClick={onClick}>
      {isSmallScreen ? text : icon}
    </Nav.Link>
  );
};

const MyNavbar = () => {
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
        <Navbar.Brand href="#" className="fw-bold" style={{ fontSize: "24px" }}>
          CHOIZ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav className="mx-auto">
            <Nav.Link href="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link href="/shop" className="mx-2">
              Shop
            </Nav.Link>
            <Nav.Link href="/about" className="mx-2">
              About
            </Nav.Link>
            <Nav.Link href="/Contact" className="mx-2">
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <ResponsiveNavItem
              icon={<BsPerson />}
              text="Logout"
              onClick={handleLogout}
              isDropdown={true}
            >
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </ResponsiveNavItem>
            <ResponsiveNavItem icon={<BsCart3 />} text="Cart" href="/cart" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
