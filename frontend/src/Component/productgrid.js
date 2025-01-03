import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import ProductCard from "./productCard";
import axios from "axios";
import "./productgrid.css";

const ProductGrid = ({
  showGrid,
  itemsToShow,
  sortBy,
  categoryFilter,
  isAdmin,
}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = isAdmin
          ? `http://localhost/Backend/Auth/getproduct.php?isAdmin=true`
          : `http://localhost/Backend/Auth/getproduct.php`;

        const response = await axios.get(url);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        console.log(error.response?.data);
      }
    };

    fetchProducts();
  }, [isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsToShow, categoryFilter]);

  const filteredAndSortedProducts = useMemo(() => {
    console.log("Filtering products. Category:", categoryFilter);
    console.log("All products:", products);
    console.log("Is Admin:", isAdmin);

    let filtered = isAdmin ? products : [...products];

    if (!isAdmin && categoryFilter && categoryFilter !== "default") {
      filtered = filtered.filter((product) => {
        const match = product.id_kategori === categoryFilter;
        console.log(
          `Product ${product.id_produk} category ${product.id_kategori} matches filter ${categoryFilter}: ${match}`
        );
        return match;
      });
    }

    console.log("Filtered products:", filtered);

    let sorted = [...filtered];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => parseFloat(a.harga) - parseFloat(b.harga));
        break;
      case "price_desc":
        sorted.sort((a, b) => parseFloat(b.harga) - parseFloat(a.harga));
        break;
      default:
        // No sorting
        break;
    }

    console.log("Sorted products:", sorted);
    return sorted;
  }, [products, sortBy, categoryFilter, isAdmin]);

  const indexOfLastProduct = currentPage * itemsToShow;
  const indexOfFirstProduct = indexOfLastProduct - itemsToShow;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsToShow);

  console.log("Current state:", {
    itemsToShow,
    currentPage,
    totalProducts: filteredAndSortedProducts.length,
    currentProducts: currentProducts.length,
    sortBy,
    categoryFilter,
    isAdmin,
  });

  const paginate = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  if (products.length === 0) {
    return <p>There is no product</p>;
  }

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
              isAdmin={isAdmin}
              showAsList={!showGrid}
            />
          </Col>
        ))}
      </Row>
      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-4">
          {currentPage > 1 && (
            <Button
              onClick={(e) => paginate(currentPage - 1, e)}
              className="pagination-button"
            >
              Previous
            </Button>
          )}

          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              onClick={(e) => paginate(index + 1, e)}
              className={
                index + 1 === currentPage ? "active" : "pagination-button"
              }
            >
              {index + 1}
            </Button>
          ))}

          {currentPage < totalPages && (
            <Button
              onClick={(e) => paginate(currentPage + 1, e)}
              className="pagination-button"
            >
              Next
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};

export default ProductGrid;
