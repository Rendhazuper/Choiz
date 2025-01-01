import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsPerson, BsPencilSquare } from "react-icons/bs";
import AdminNavbar from "../Component/navbaradmin";
import ProductGrid from "../Component/productgrid";
import "../style/produk.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Produk = () => {
  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
          className="margindoang"
        >
          <Link to="/productinput">
            <Button className="buttonproduk">
              <p> Input product </p>
            </Button>
          </Link>
        </div>
        <div>
          <ProductGrid
            isAdmin={true}
            showGrid={true}
            itemsToShow={12} // Atau jumlah yang Anda inginkan
            sortBy="default"
          />
        </div>
      </Container>
    </div>
  );
};

export default Produk;
