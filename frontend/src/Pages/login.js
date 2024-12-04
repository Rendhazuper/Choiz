import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import FormControl from 'react-bootstrap/FormControl'
import { Link } from "react-router-dom";
import '../style/login.css';
// import Button from 'react-bootstrap/Button'
// import { FaUser, FaLock } from "react-icons/fa"; // Ikon untuk username dan password
// import axios from "axios"; // Impor Axios untuk HTTP request
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
        return(
        <div className="login relative justify-center items-center min-h-screen">
          <Container>
            <Row>
              <Col className="judul " > <p>CHOIZ</p></Col> 
              <Col>  
              <Container className="kolom"> 
                 <Row>
                 <h1>Login</h1>
                  </Row> 
                 <Row>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label className ="label">Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" />
                  </Form.Group>
                  </Row> 
                 <Row>
                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label className ="label">Password</Form.Label>
                  <Form.Control type="password" placeholder="name@example.com" />
                  </Form.Group>
                  </Row> 
                 <Row>
                    <Button className = "Button" >Login</Button>
                  </Row> 
                  <Container className="Forgot">
                    <Row>
                    <p class ="left">
                    <Link to="/forgot">Lupa Password ?</Link>
                    </p>
                    <p class= "right ">Belum Punya akun ?
                    <Link to="/register"> Daftar sekarang</Link>
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