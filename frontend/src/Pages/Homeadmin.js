import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsPerson, BsPencilSquare } from "react-icons/bs";
import AdminNavbar from "../Component/navbaradmin";
import "../style/Homeadmin.css";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeAdmin = () => {
  return (
    <div>
      <div className="register relative justify-center items-center min-h-screen">
        <Container className="kontainernya">
          <Row className="centerrow">
            <Col className="judul">
              <p>CHOIZ</p>
              <p className="subjudul">Admin</p>
            </Col>
            <Col>
              <Container className="kolom-button">
                <Button className="button-admin">
                  <BsPerson
                    style={{ color: "#B88E2F", width: "30px", height: "30px" }}
                  />
                  <p> Edit User</p>
                </Button>
                <Link to="/produk" style={{ textDecoration: "none" }}>
                  <Button className="button-admin">
                    <BsPencilSquare
                      style={{
                        color: "#B88E2F",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <p> Edit Product </p>
                  </Button>
                </Link>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default HomeAdmin;
