import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { BsGrid, BsViewList } from "react-icons/bs";
import axios from "axios";
import MyNavbar from '../Component/navbar';
import bannershop from '../asset/Baju/bannershop.png'; 
import ProductGrid from "../Component/productgrid";
import '../style/shop.css';
import "bootstrap/dist/css/bootstrap.min.css";


const Shop = () => {
    return (
    <div className="shop">
        <div> 
            <MyNavbar/> 
        </div>
        <div className="bannershop">
            <Image src = { bannershop } />
            <div className="tulisanbanner text-center">
            <h1 className="Headerbanner">Shop</h1>
            <h3 className="subheaderbanner"> Home &gt; Shop</h3>
            </div>
        </div>
        <div className="filtershop">
            <Container>
             <Row>
                <Col>
                    <BsGrid/>
                </Col>
                <Col>
                    <BsViewList/>
                </Col>
                <Col>
                    <p> | </p>
                </Col>
                <Col>
                    <p> Showing 1-16 of 32 result </p>
                </Col>
            </Row>
            
            </Container>

        </div>
        

    </div>


    );
}

export default Shop;