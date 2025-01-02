import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/forgot.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();

  const handleForgot = async () => {
    if (!email) {
      setMessage("Email harus diisi.");
      setVariant("danger");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Backend/Auth/Forgot.php",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate(`/reset?email=${email}`);
      } else {
        setMessage("Email tidak terdaftar");
        setVariant("danger");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("Email tidak terdaftar");
      } else {
        setMessage("Terjadi kesalahan saat memproses permintaan");
      }
      setVariant("danger");
    }
  };

  return (
    <div className="kon-forgot forgot relative">
      <Container className="kontainernyaforgot">
        <Row>
          <Col className="judul">
            <p>CHOIZ</p>
          </Col>
          <Col>
            <Container className="kolom">
              <Row>
                <h1>Forgot Password</h1>
              </Row>
              {message && (
                <Row>
                  <Alert variant={variant}>{message}</Alert>
                </Row>
              )}
              <Row>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Button className="Button" onClick={handleForgot}>
                  Send
                </Button>
              </Row>
              <Container className="Forgot">
                <Row>
                  <p className="right">
                    Ingat password ? <Link to="/login">Login</Link>
                  </p>
                </Row>
              </Container>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Forgot;
