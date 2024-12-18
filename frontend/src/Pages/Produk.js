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
      <div>
        <ProductGrid isAdmin={true} />
      </div>
    </div>
  );
};

export default Produk;
