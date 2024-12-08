import React from 'react';
import baju1 from '../asset/Baju/image1.png';
import './productCard.css'
import { Card, Col,Row, Container } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaEye, FaRandom, FaStar, FaRegStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCard = () =>{
    return ( 
                <Card className = "card text-start" style={{width: '18rem'}}><a href = "#">
                    <Card.Img variant = "Top" src={baju1} />
                <Card.Body className = 'konten'>
                    <Card.Title className="Titlecard">Judul</Card.Title>
                    <div className='kategori'> kategori</div>
                    <div className= 'harga'> Rp 16.000.000</div>
                </Card.Body>
                </a>
                </Card> 
    );
}

export default ProductCard;