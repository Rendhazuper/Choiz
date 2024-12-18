import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Dropdown } from "react-bootstrap";
import { BsGrid, BsViewList } from "react-icons/bs";
import MyNavbar from "../Component/navbar";
import bannershop from "../asset/Baju/bannershop.png";
import ProductGrid from "../Component/productgrid";
import Footer from "../Component/Footer";
import { useNavigate } from "react-router";
import axios from "axios";
import "../style/shop.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Shop = () => {
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
    <div className="shop">
      <div>
        <MyNavbar />
      </div>
      <div className="bannershop">
        <Image className="foto" src={bannershop} />
        <div className="tulisanbanner text-center">
          <h1 className="Headerbanner">Shop</h1>
          <h3 className="subheaderbanner"> Home &gt; Shop</h3>
        </div>
      </div>
      <div className="filtershop">
        <Container className="kontainerr" fluid>
          <Row
            className="d-flex justify-content-center align-items-center"
            gap={10}
          >
            <Col className="kolomkiri ">
              <BsGrid />
              <BsViewList />
              <p> | </p>
              <p> Showing 1-16 of 32 result </p>
            </Col>
            <Col className="Dropdown">
              <Dropdown className="drop1">
                <p> Show </p>
                <Dropdown.Toggle className="Toggle" id="dropdown-basic">
                  16
                </Dropdown.Toggle>
              </Dropdown>
              <Dropdown className="drop1">
                <p> Short By </p>
                <Dropdown.Toggle className="Toggle" id="dropdown-basic">
                  Default
                </Dropdown.Toggle>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </div>

      <section>
        <ProductGrid />
      </section>
      <section className="futer">
        <Footer />
      </section>
    </div>
  );
};

export default Shop;
