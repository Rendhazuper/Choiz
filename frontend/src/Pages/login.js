import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import axios from "axios";
import "../style/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActiveSession = async () => {
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

        if (response.data.status === "active") {
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkActiveSession();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email dan password harus diisi.");
      setVariant("danger");
      return;
    }

    try {
      const response = await axios.post(
        // "http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/Login.php",
        "http://localhost/Backend/Auth/Login.php",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.status);
        const { level, username, expire_time } = response.data;
        setMessage("Anda berhasil login!");
        setVariant("success");

        console.log(response.data);

        sessionStorage.setItem("userLevel", level);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("expire_time", expire_time);

        if (level === "admin") {
          setTimeout(() => {
            /*  */
            navigate("/admin");
          }, 1000);
        } else {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else {
        setMessage(response.data.error || "Terjadi kesalahan saat login");
        setVariant("danger");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Password salah");
          setVariant("danger");
        } else if (error.response.status === 404) {
          setMessage("Pengguna tidak ditemukan");
          setVariant("danger");
        } else {
          setMessage(
            error.response?.data?.error || "Terjadi kesalahan saat login"
          );
          setVariant("danger");
        }
      } else if (error.request) {
        setMessage("Tidak dapat terhubung ke server");
        setVariant("danger");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui");
        setVariant("danger");
      }
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="kon-login login relative ">
      <Container className="kontainernyalogin">
        <Row>
          <Col className="judulawal">
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
              <form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="label">Email address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="label">Password</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: "40px" }}
                      />
                      <div
                        onClick={togglePassword}
                        style={{
                          color: "black",
                          cursor: "pointer",
                          marginLeft: "-30px",
                        }}
                      >
                        {showPassword ? <BsEyeSlash /> : <BsEyeFill />}
                      </div>
                    </div>
                  </Form.Group>
                </Row>
                <Row>
                  <Button className="Button" type="submit">
                    Login
                  </Button>
                </Row>
              </form>
              <Container className="Forgot">
                <Row>
                  <div className="auth-links">
                    <Link className="forgot-password" to="/forgot">
                      Lupa Password?
                    </Link>
                    <span className="signup-text">
                      Belum Punya akun?{" "}
                      <Link className="signup-link" to="/register">
                        Daftar sekarang
                      </Link>
                    </span>
                  </div>
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
