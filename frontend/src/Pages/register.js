import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/register.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !username || !password || !confirmPassword) {
      setMessage("Semua field harus diisi.");
      setVariant("danger");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      setVariant("danger");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Backend/Auth/Register.php", // Ubah sesuai path backend Anda
        { name, email, username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Registrasi berhasil! Silakan login.");
        setVariant("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(response.data.error || "Terjadi kesalahan saat registrasi.");
        setVariant("danger");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response?.data?.error || "Terjadi kesalahan saat registrasi.");
        setVariant("danger");
      } else if (error.request) {
        setMessage("Tidak dapat terhubung ke server.");
        setVariant("danger");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui.");
        setVariant("danger");
      }
    }
  };

  return (
    <div className="register relative justify-center items-center min-h-screen">
      <Container>
        <Row>
          <Col className="judul">
            <p>CHOIZ</p>
          </Col>
          <Col>
            <Container className="kolom">
              <Row>
                <h1>Register</h1>
              </Row>
              {message && (
                <Row>
                  <Alert variant={variant}>{message}</Alert>
                </Row>
              )}
              <Row>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="label">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="label">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="label">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label className="label">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Button className="Button" onClick={handleRegister}>
                  Register
                </Button>
              </Row>
              <Container className="Forgot">
                <Row>
                  <p className="right">
                    Sudah punya akun? <Link to="/login">Login sekarang</Link>
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

export default Register;
