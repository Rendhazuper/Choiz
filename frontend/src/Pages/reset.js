import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email");

    if (!emailFromUrl) {
      setMessage("Email tidak valid.");
      setVariant("danger");
    } else {
      setEmail(emailFromUrl);
    }
  }, [location]);

  const handleResetPassword = async () => {
    // Validasi input
    if (!password || !confirmPassword) {
      setMessage("Semua field harus diisi.");
      setVariant("danger");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan Konfirmasi Password tidak cocok.");
      setVariant("danger");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Backend/Auth/Reset.php",
        {
          email: email,
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("Password berhasil direset. Silakan login.");
        setVariant("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setMessage("Password baru tidak boleh sama dengan password lama.");
            break;
          case 401:
            setMessage("Token sudah kedaluwarsa.");
            break;
          case 404:
            setMessage("Pengguna tidak ditemukan.");
            break;
          default:
            setMessage("Terjadi kesalahan saat mereset password.");
        }
        setVariant("danger");
      } else if (error.request) {
        setMessage("Tidak dapat terhubung ke server");
        setVariant("danger");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui");
        setVariant("danger");
      }
    }
  };

  return (
    <div className="reset relative justify-center items-center min-h-screen">
      <Container className="kon-reset">
        <Row>
          <Col className="judul">
            <p>CHOIZ</p>
          </Col>
          <Col>
            <Container className="kolom">
              <Row>
                <h1>Reset Password</h1>
              </Row>
              {message && (
                <Row>
                  <Alert variant={variant}>{message}</Alert>
                </Row>
              )}
              <Row>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="label">Password Baru</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Masukkan password baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label className="label">Konfirmasi Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Konfirmasi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Button className="Button" onClick={handleResetPassword}>
                  Reset Password
                </Button>
              </Row>
              <Container className="Reset">
                <Row>
                  <p className="right">
                    Ingat password ?{" "}
                    <Link to="/login" className="link-login">
                      Login
                    </Link>
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

export default Reset;
