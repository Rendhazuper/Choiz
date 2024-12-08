import React from 'react';
import { Col, Row } from 'react-bootstrap';
// import { FaShoppingCart, FaHeart, FaEye, FaRandom, FaStar, FaRegStar } from 'react-icons/fa';
import ProductCard from './productCard';

const ProductGrid = () => {
    return (
     
    <Row>
        <Col> 
        <ProductCard />
        </Col> 
        <Col> 
        <ProductCard />
        </Col> 
        <Col> 
        <ProductCard />
        </Col> 
        <Col> 
        <ProductCard />
        </Col> 
    </Row>
);
};

export default ProductGrid;