import axios from "axios";
import './App.css';
import MyNavbar from './Component/navbar';
import banner from './asset/banner.png';  
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import React, {useState , useEffect } from 'react';


function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const checkLogin = async () => {
    try {
      const response = await axios.get("http://localhost/Backend/Auth/cekLogin.php", {
        withCredentials: true,  
      });
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Error checking login:", error);
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, [navigate]);

  return (
    <div className="App">
    <div><MyNavbar /></div>

    <header className="App-header">
      <section className="py-0">
        <Image className="banner" src={banner} fluid />
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
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

      {/* Section Kedua dengan tema pakaian */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">Browse Your Outfit Theme</h2>
          <p className="text-center mb-5">Find outfit theme these days</p>
          <Row className="justify-content-center">
            <Col md={3} className="mb-4">
              <Image src="https://via.placeholder.com/300x400" fluid rounded />
              <p className="text-center mt-2">Skena</p>
            </Col>
            <Col md={3} className="mb-4">
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
};
  

export default App;
