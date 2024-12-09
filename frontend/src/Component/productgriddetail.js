import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import ProductCard from './productCard'; // Import ProductCard
import axios from 'axios'; // Menggunakan Axios untuk mengambil data
import { Link } from 'react-router-dom';
import './productgrid.css';

const ProductGridDetail = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini
  const itemsPerPage = 4; // Menentukan jumlah produk per halaman (4 baris * 4 produk)
  const itemsPerRow = 4; // Menentukan jumlah produk per baris (4 produk)

  // Mengambil produk untuk halaman yang sedang aktif
  const indexOfLastProduct = currentPage * itemsPerPage;
const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Membagi produk menjadi baris-baris dengan jumlah produk per baris
  const rows = [];
for (let i = 0; i < currentProducts.length; i += itemsPerRow) {
  rows.push(currentProducts.slice(i, i + itemsPerRow));
}

  const paginationRef = useRef(null); // Referensi untuk bagian pagination

  useEffect(() => {
    axios
      .get('http://localhost/Backend/Auth/getproduct.php')
      .then((response) => {
        console.log(response.data); // Periksa bentuk data yang diterima
        setProducts(response.data); // Simpan produk ke state
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  
  // Menghitung jumlah total halaman berdasarkan total produk
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <Container className="rowindex">
    {/* Menampilkan produk dalam baris */}
    {currentProducts.length > 0 ? (
      [...Array(Math.ceil(currentProducts.length / itemsPerRow))].map((_, rowIndex) => (
        <Row key={rowIndex} className="d-flex justify-content-center">
          {currentProducts.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow).map((product) => (
            <Col
              key={product.id_produk}
              sm={12} md={6} lg={3} // Membagi 4 produk per baris
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

     {/* Tombol Show More */}
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
