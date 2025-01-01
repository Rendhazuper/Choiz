import axios from "axios";
import "./App.css";
import MyNavbar from "./Component/navbar";
import Footer from "./Component/Footer";
import ProductCard from "./Component/productCard";
import ProductGridDetail from "./Component/productgriddetail";
import banner from "./asset/banner.png";
import Theme from "./Component/theme";
import Share from "./Component/share";
import CardCarousel from "./Component/Carousel";
import ProductGrid from "./Component/productgrid";
import { Container, Row, Col, Button, Image, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const checkLogin = async () => {
    try {
      // const response = await axios.get("http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/cekLogin.php", {
      const response = await axios.get(
        "http://localhost/Backend/Auth/cekLogin.php",
        {
          withCredentials: true,
        }
      );
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
      <div>
        <MyNavbar />
      </div>

      <header className="App-header">
        <section className="section1 responsive-banner">
          <Image className="banner" src={banner} />
          <Card
            className="kartu text-start"
            style={{ backgroundColor: "#FFF3E3" }}
          >
            <Card.Body>
              <h2 className="text1 mb-4">New Outfit</h2>
              <h3 className="textsub">Discover Our New Collection</h3>
              <p className="paragraf mb-4">Style evolution, skip the price</p>
              <Button className="button">BUY NOW</Button>
            </Card.Body>
          </Card>
        </section>
        <section className="section2 py-4">
          <Theme />
        </section>
        <section className="section4 py-4">
          <CardCarousel />
        </section>
        <section className="section5 py-4">
          <Share />
        </section>
        <section className="section6">
          <Footer />
        </section>
      </header>
    </div>
  );
}

export default App;
