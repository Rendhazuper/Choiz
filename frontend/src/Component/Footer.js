import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <Container fluid className="kontainer">
      <div className="footer-content">
        <p className="Judul">Choiz</p>
        <ul>
          <li>
            <Link to="/" className="footer-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="footer-link">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/about" className="footer-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="footer-link">
              Contact
            </Link>
          </li>
        </ul>
        <p className="copyrait">
          Created By <span className="brand-name">ChoizFashion</span> | © 2024
        </p>
      </div>
    </Container>
  );
};

export default Footer;
