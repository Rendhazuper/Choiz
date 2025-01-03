import React from "react";
import "./productCard.css";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductCard = ({
  namaProduk,
  harga,
  gambarProduk,
  kategori,
  idProduk,
  isAdmin,
}) => {
  const formatHarga = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(harga);

  const linkTo = isAdmin ? `/edit-product/${idProduk}` : `/produk/${idProduk}`;

  return (
    <Card className="cardu text-start">
      <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
        <Card.Img
          variant="top"
          src={gambarProduk}
          alt={namaProduk}
          className="gambarkartu card-img"
        />
        <Card.Body className="konten">
          <Card.Title className="Titlecard">{namaProduk}</Card.Title>
          <div className="kategori">{kategori}</div>
          <div className="harga">{formatHarga}</div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default ProductCard;
