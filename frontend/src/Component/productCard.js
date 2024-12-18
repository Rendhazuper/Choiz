import React from "react";
import "./productCard.css";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaRandom,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductCard = ({
  namaProduk,
  harga,
  gambarProduk,
  kategori,
  idProduk,
}) => {
  const formatHarga = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(harga);

  return (
    <Card className="cardu text-start" style={{ width: "20rem" }}>
      <Link
        to={`/produk/${idProduk}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
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
