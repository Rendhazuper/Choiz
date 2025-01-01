import React, { useState, useEffect } from "react";
import "./theme.css";
import { Container, Row, Col, Image, Carousel } from "react-bootstrap";
import skena from "../asset/Baju/Skena.png";
import casual from "../asset/Baju/Casual.png";
import chic from "../asset/Baju/Chic.png";

import "bootstrap/dist/css/bootstrap.min.css";

const Theme = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themes = [
    { image: skena, name: "Skena" },
    { image: casual, name: "Casual" },
    { image: chic, name: "Chic" },
  ];

  const ThemeGrid = () => (
    <Row className="theme-grid justify-content-center">
      {themes.map((theme, index) => (
        <Col key={index} md={3} className="theme-grid-item mb-4">
          <Image src={theme.image} fluid rounded />
          <p className="theme-grid-name text-center mt-2">{theme.name}</p>
        </Col>
      ))}
    </Row>
  );

  const ThemeCarousel = () => (
    <Carousel className="theme-carousel">
      {themes.map((theme, index) => (
        <Carousel.Item key={index} className="theme-carousel-item">
          <img
            className="theme-carousel-image d-block w-100"
            src={theme.image}
            alt={theme.name}
          />
          <Carousel.Caption className="theme-carousel-caption">
            <h3>{theme.name}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );

  return (
    <Container className="theme-container">
      <h1 className="theme-title text-center mb-4">Browse Your Outfit Theme</h1>
      <p className="theme-subtitle text-center mb-5">
        Find outfit theme these days
      </p>
      {isSmallScreen ? <ThemeCarousel /> : <ThemeGrid />}
    </Container>
  );
};

export default Theme;
