import logo from './logo.svg';
import './App.css';
import MyNavbar from './Component/navbar';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import React, { useEffect } from 'react';


function App() {
  const Navigate = useNavigate();

  useEffect(() => {
    const userLevel = localStorage.getItem("level");
    if (!userLevel || userLevel !== 'admin') {
      // Jika tidak ada sesi atau bukan admin, arahkan ke halaman login
        Navigate("/login");
    }
  }, [Navigate]);

  
  return (
    <div className="App">
      <div><MyNavbar/></div>
      
      <header className="App-header">
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={5000}>
              <Card className="bg-light text-center">
                <Card.Body>
                  <h2 className="mb-4">New Outfit</h2>
                  <h3>Discover Our New Collection</h3>
                  <p className="mb-4">Style evolution, skip the price</p>
                  <Button variant="warning">BUY NOW</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">Browse Your Outfit Theme</h2>
          <p className="text-center mb-5">Find outfit theme these days</p>
          <Row className="justify-content-center">
            <Col md={3} className="mb-4">
              <Image src="https://via.placeholder.com/300x400" fluid rounded />
              <p className="text-center mt-2">Skena</p>
            </Col>
            <Col md={3} className ="mb-4">
              <Image src="https://via.placeholder.com/300x400" fluid rounded />
              <p className="text-center mt-2">Casual</p>
            </Col>
            <Col md={3} className="mb-4">
              <Image src="https://via.placeholder.com/300x400" fluid rounded />
              <p className="text-center mt-2">Formal</p>
            </Col>
            <Col md={3} className="mb-4">
              <Image src="https://via.placeholder.com/300x400" fluid rounded />
              <p className="text-center mt-2">Sporty</p>
            </Col>
          </Row>
        </Container>
      </section>
      </header>
      

    </div>
  
  );
}

export default App;
