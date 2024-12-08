import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { BsArrowRight,BsChevronRight,BsChevronLeft  } from "react-icons/bs";
import cowok1 from '../asset/Baju/carousel.png'; // Gambar card pertama
import cowok2 from '../asset/Baju/cowok2.png'; // Gambar card kedua
import cowok3 from '../asset/Baju/cowok3.png'; // Gambar card ketiga
import './stylecarousel.css';  // Pastikan untuk membuat file CSS terpisah

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Melacak index card yang aktif

  // Daftar card beserta gambar dan deskripsi
  const cards = [
    { 
      title: '01' , 
      description : 'Wanner',
      imgSrc: cowok1,
      href: '/product1' 
    },
    { 
      title: '02', 
      description: 'Skena', 
      imgSrc: cowok2,
      href: '/product2' 
    },
    { 
      title: '03',
      description : 'Chic',  
      imgSrc: cowok3,
      href: '/product3' 
    },
  ];

  // Fungsi untuk pindah ke card berikutnya
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Fungsi untuk pindah ke card sebelumnya
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <Container className="kontainerpenting">
      <Row>
        {/* Kolom kiri (Copywriting) */}
        <Col className="kolom1 text-start" md={6}>
          <h2 className='kolom1judul'>50+ Outfit stores</h2>
          <p className='kolompara'>Our outfit store more than 50+ to make our customers have a lot of choice for the outfit</p>
          <Button className='kolombutton' variant="primary mt-5 ">Explore More</Button>
        </Col>

        {/* Kolom kanan (Carousel) */}
        <Col className="kolom2" md={6}>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div
                className="carousel-content"
                style={{
                  // Menghitung pergeseran per card dengan margin
                  transform: `translateX(-${currentIndex * (30 + 20)}%)`, // 50% lebar card + 20px untuk margin antar card
                }}
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`carousel-card ${index === currentIndex ? 'carousel-card-full' : 'carousel-card-partial'}`}
                  >
                    <img src={card.imgSrc} alt={card.title} />
                    
                    {/* Tampilkan hanya pada card yang aktif */}
                    {index === currentIndex && (
                      <div className="carousel-card-body text-start">
                        <h5>{card.title}</h5>
                        <p>{card.description}</p>
                        <div className='hrefnih'>
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

            {/* Navigasi tombol kiri dan kanan */}
            <div className="carousel-controls">
                <Button className = "prev"  onClick={prevSlide}>
                <BsChevronLeft /> {/* Ikon untuk tombol Prev */}
                </Button>
                <Button className = "next"  onClick={nextSlide}>
                <BsChevronRight /> {/* Ikon untuk tombol Next */}
                </Button>
            </div>

            {/* Indikator bulatan */}
            <div className="carousel-indicators">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)} // Pindah ke slide yang diklik
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
