import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import ProductCard from "./productCard";
import axios from "axios";
import "./productgrid.css";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const itemsPerRow = 4;

  // Mengambil produk untuk halaman yang sedang aktif
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Membagi produk menjadi baris-baris dengan jumlah produk per baris
  const rows = [];
  for (let i = 0; i < currentProducts.length; i += itemsPerRow) {
    rows.push(currentProducts.slice(i, i + itemsPerRow));
  }

  const paginationRef = useRef(null); // Referensi untuk bagian pagination

  useEffect(() => {
    axios
      // .get('http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/getproduct.php')
      .get("http://localhost/Backend/Auth/getproduct.php")
      .then((response) => {
        console.log(response.data); // Periksa bentuk data yang diterima
        setProducts(response.data); // Simpan produk ke state
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        console.log(error.response.data);
      });
  }, []);

  // Fungsi untuk mengubah halaman dan menggulirkan ke bawah
  const paginate = (pageNumber, event) => {
    event.preventDefault(); // Mencegah scroll otomatis ke atas saat pagination diklik
    setCurrentPage(pageNumber);

    // Scroll ke bagian bawah setelah pagination
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight, // Scroll ke bawah halaman
        behavior: "smooth", // Efek scroll halus
      });
    }, 200); // Delay untuk memastikan setState sudah diterapkan
  };

  // Menghitung jumlah total halaman berdasarkan total produk
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <Container className="rowindex">
      {/* Menampilkan produk dalam baris */}
      {currentProducts.length > 0 ? (
        [...Array(Math.ceil(currentProducts.length / itemsPerRow))].map(
          (_, rowIndex) => (
            <Row key={rowIndex} className="d-flex justify-content-center">
              {currentProducts
                .slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
                .map((product) => (
                  <Col
                    key={product.id_produk}
                    sm={12}
                    md={6}
                    lg={3} // Membagi 4 produk per baris
                    className="d-flex justify-content-center"
                  >
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
          )
        )
      ) : (
        <p>No products available</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          ref={paginationRef} // Menambahkan referensi ke bagian pagination
          className="pagination-container d-flex justify-content-center mt-4"
        >
          {/* Tombol Previous hanya muncul jika currentPage > 1 */}
          {currentPage > 1 && (
            <Button
              onClick={(e) => paginate(currentPage - 1, e)}
              className="pagination-button"
            >
              Previous
            </Button>
          )}

          {/* Menampilkan tombol untuk halaman */}
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

          {/* Tombol Next hanya muncul jika currentPage < totalPages */}
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
