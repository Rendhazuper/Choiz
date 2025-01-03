import axios from "axios";
import "./App.css";
import MyNavbar from "./Component/navbar";
import Footer from "./Component/Footer";
import banner from "./asset/banner.png";
import Theme from "./Component/theme";
import Share from "./Component/share";
import CardCarousel from "./Component/Carousel";
import { Button, Image, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Backend/Auth/cekLogin.php",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Check response:", response.data);

      if (
        response.data.status === "expired" ||
        response.data.status === "no_session"
      ) {
        console.log("Session ended, logging out...");
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  useEffect(() => {
    const loginChecker = setInterval(checkLoginStatus, 1000);
    checkLoginStatus(); // Initial check

    return () => clearInterval(loginChecker);
  }, []);

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
              <Link to="/shop">
                <Button className="button">BUY NOW</Button>
              </Link>
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
