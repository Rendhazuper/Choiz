import React from 'react';
import './productCard.css';
import { Card } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaEye, FaRandom, FaStar, FaRegStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCard = ({ namaProduk, harga, gambarProduk, kategori, idProduk }) => {

    const formatHarga = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(harga);


    return (
        <Card className="card text-start" style={{ width: '15rem' }}>
    <a href={`/produk/${idProduk}`}>
        <Card.Img
            variant="top"
            src={gambarProduk}
            alt={namaProduk}
            className="card-img" // Menambahkan class pada gambar
        />
        <Card.Body className="konten">
            <Card.Title className="Titlecard">{namaProduk}</Card.Title>
            <div className="kategori">{kategori}</div>
            <div className="harga">{formatHarga}</div>
        </Card.Body>
    </a>
</Card>
    );
}

export default ProductCard;