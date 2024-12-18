import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Form } from "react-bootstrap";
import bannershop from "../asset/Baju/bannershop.png";
import { useNavigate } from "react-router";
import Footer from "../Component/Footer";
import MyNavbar from "../Component/navbar";
import axios from "axios";
import "../style/Contact.css";

const Contact = () => {
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
    <section>
      <div>
        <MyNavbar />
      </div>
      <div className="bannershop text-center">
        <Image className="foto" src={bannershop} />
        <div className="tulisanbanner text-center">
          <h1 className="Headerbanner">Contact</h1>
        </div>
      </div>
      <Container className="masih">
        <Row className="rou justify-content-center align-items-center">
          <Col>
            <h1 className="text-center">Get in Touch With Us </h1>
            <p className="text-center">
              For More Information About Our Product & Services. Please Feel
              Free To Drop Us An Email. Our Staff Always Be There To Help You
              Out. Do Not Hesitate!{" "}
            </p>
          </Col>
        </Row>
        <Row className="rou justify-content-center align-items-center">
          <Col>
            <h1>Instagram </h1>
            <p>@choiz_id </p>
          </Col>
          <Col>
            <Form.Label htmlFor="inputPassword5">Your name</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />
          </Col>
        </Row>
        <Row className="rou justify-content-center align-items-center">
          <Col>
            <h1>Phone </h1>
            <p>Mobile: +6212345678 </p>
          </Col>
          <Col>
            <Form.Label htmlFor="inputPassword5">Email address</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />
          </Col>
        </Row>
        <Row className="rou justify-content-center align-items-center">
          <Col>
            <h1>Working Time </h1>
            <p>24hours </p>
          </Col>
          <Col>
            <Form.Label htmlFor="inputPassword5">Subject</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <Form.Group
              className="textarea mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Col>
        </Row>
      </Container>
      <div className="footer">
        <Footer />
      </div>
    </section>
  );
};

export default Contact;
