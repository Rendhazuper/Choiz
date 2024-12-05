import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success"); // success or danger
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/Auth/Login.php", // ubah sini buat ganti path arah backend --note : error cors pas login (tidak dapat terhubung ke server), backend udah aman tembak browser/postman. 
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Anda berhasil login!");
        setVariant("success");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setMessage(response.data.error || "Terjadi kesalahan saat login");
        setVariant("danger");
        console.error("Login error:", response.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Tidak dapat terhubung ke server");
      setVariant("danger");
      console.error("Connection error:", error);
    }
  };

  return (
    <div className="login relative justify-center items-center min-h-screen">
      <Container>
        <Row>
          <Col className="judul">
            <p>CHOIZ</p>
          </Col>
          <Col>
            <Container className="kolom">
              <Row>
                <h1>Login</h1>
              </Row>
              {message && (
                <Row>
                  <Alert variant={variant}>{message}</Alert>
                </Row>
              )}
              <Row>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="label">Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="label">Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
              </Row>
              <Row>
                <Button className="Button" onClick={handleLogin}>
                  Login
                </Button>
              </Row>
              <Container className="Forgot">
                <Row>
                  <p className="left">
                    <Link to="/forgot">Lupa Password ?</Link>
                  </p>
                  <p className="right">
                    Belum Punya akun ? <Link to="/register">Daftar sekarang</Link>
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

export default Login;
