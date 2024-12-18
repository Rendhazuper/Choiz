import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import ProductCard from './productCard'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import './productgrid.css';

const ProductGridDetail = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 4; 
  const itemsPerRow = 4; 

 
const indexOfLastProduct = currentPage * itemsPerPage;
const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  
  const rows = [];
for (let i = 0; i < currentProducts.length; i += itemsPerRow) {
  rows.push(currentProducts.slice(i, i + itemsPerRow));
}

  const paginationRef = useRef(null); 

  useEffect(() => {
    axios
      .get('http://localhost/Backend/Auth/getproduct.php')
      // .get('http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/getproduct.php')
      .then((response) => {
        console.log(response.data); 
        setProducts(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  
  
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <Container className="rowindex">
    {currentProducts.length > 0 ? (
      [...Array(Math.ceil(currentProducts.length / itemsPerRow))].map((_, rowIndex) => (
        <Row key={rowIndex} className="d-flex justify-content-center">
          {currentProducts.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow).map((product) => (
            <Col
              key={product.id_produk}
              sm={12} md={6} lg={3} 
              className="d-flex justify-content-center"
            >
              <ProductCard
                idProduk={product.id_produk}
                namaProduk={product.nama_produk}
                harga={product.harga}
                gambarProduk={'/' + product.gambar_produk}
                kategori={product.kategori}
              />
            </Col>
          ))}
        </Row>
      ))
    ) : (
      <p>No products available</p>
    )}

     <div className="d-flex justify-content-center mt-4">
        <Link to="/shop">
          <Button className="showmore">
            Show More
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default ProductGridDetail;