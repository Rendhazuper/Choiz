import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import emailjs from "@emailjs/browser";
import bannershop from "../asset/Baju/bannershop.png";
import { useNavigate } from "react-router";
import Footer from "../Component/Footer";
import MyNavbar from "../Component/navbar";
import "../style/Contact.css";
import axios from "axios";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_ho6q1aj",
        "template_4k3f28c",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "kevinganteng2005@gmail.com",
        },
        "Y0q1YZxXN9YLHD1Ly"
      )
      .then((response) => {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus("error");
      });
  };

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
              Out. Do Not Hesitate!
            </p>
          </Col>
        </Row>

        <div className="contact-info-container">
          <Row className="contact-info">
            <Col xs={12} md={4}>
              <h1>Instagram </h1>
              <p>@choiz_id </p>
            </Col>
            <Col xs={12} md={4}>
              <h1>Phone </h1>
              <p>Mobile: +628117259596 </p>
            </Col>
            <Col xs={12} md={4}>
              <h1>Working Time </h1>
              <p>24hours </p>
            </Col>
          </Row>

          <form onSubmit={handleSubmit} className="contact-form">
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your name</Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100 contact-submit-btn">
                  Send Message
                </Button>
              </Col>
            </Row>
          </form>
        </div>
      </Container>
      <div className="footer">
        <Footer />
      </div>
    </section>
  );
};

export default Contact;
