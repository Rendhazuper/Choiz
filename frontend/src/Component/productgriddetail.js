import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import ProductCard from "./productCard";
import axios from "axios";
import { Link } from "react-router-dom";
import "./productgrid.css";

const ProductGridDetail = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const itemsPerRow = 4;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const rows = [];
  for (let i = 0; i < currentProducts.length; i += itemsPerRow) {
    rows.push(currentProducts.slice(i, i + itemsPerRow));
  }

  const paginationRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost/Backend/Auth/getproduct.php")
      // .get('http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/getproduct.php')
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <Container fluid className="rowindex">
      <Row>
        {currentProducts.map((product) => (
          <Col xs={6} md={3} key={product.id_produk}>
            <ProductCard
              idProduk={product.id_produk}
              namaProduk={product.nama_produk}
              harga={product.harga}
              gambarProduk={"/" + product.gambar_produk}
              kategori={product.kategori}
            />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Link to="/shop">
          <Button className="showmore">Show More</Button>
        </Link>
      </div>
    </Container>
  );
};

export default ProductGridDetail;
