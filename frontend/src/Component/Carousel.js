import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { BsArrowRight, BsChevronRight, BsChevronLeft } from "react-icons/bs";
import cowok1 from "../asset/Baju/carousel.png";
import cowok2 from "../asset/Baju/cowok2.png";
import cowok3 from "../asset/Baju/cowok3.png";
import "./stylecarousel.css";

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const cards = [
    {
      title: "01",
      description: "Wanner",
      imgSrc: cowok1,
      href: "/product1",
    },
    {
      title: "02",
      description: "Skena",
      imgSrc: cowok2,
      href: "/product2",
    },
    {
      title: "03",
      description: "Chic",
      imgSrc: cowok3,
      href: "/product3",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <Container className="kontainerpenting">
      <Row>
        <Col className="kolom1" md={6}>
          <h2 className="kolom1judul">50+ Outfit stores</h2>
          <p className="kolompara">
            Our outfit store more than 50+ to make our customers have a lot of
            choice for the outfit
          </p>
          <Button className="kolombutton" variant="primary mt-5 ">
            Explore More
          </Button>
        </Col>

        {/* Kolom kanan (Carousel) */}
        <Col className="kolom2" md={6}>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div
                className="carousel-content"
                style={{
                  transform: `translateX(-${currentIndex * (30 + 20)}%)`,
                }}
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`carousel-card ${
                      index === currentIndex
                        ? "carousel-card-full"
                        : "carousel-card-partial"
                    }`}
                  >
                    <img src={card.imgSrc} alt={card.title} />
                    {index === currentIndex && (
                      <div className="carousel-card-body text-start">
                        <h5>{card.title}</h5>
                        <p>{card.description}</p>
                        <div className="hrefnih">
                          <a href={card.href}>
                            <BsArrowRight />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="carousel-controls">
              <Button className="prev" onClick={prevSlide}>
                <BsChevronLeft />
              </Button>
              <Button className="next" onClick={nextSlide}>
                <BsChevronRight />
              </Button>
            </div>
            <div className="carousel-indicators">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CardCarousel;
