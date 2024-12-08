import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ProductCard from './productCard'; // Import ProductCard
import axios from 'axios'; // Menggunakan Axios untuk mengambil data

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const itemsPerRow = 4; // Menentukan jumlah produk per baris
    const rows = []; // Menyimpan produk dalam baris (row)

    for (let i = 0; i < products.length; i += itemsPerRow) {
        rows.push(products.slice(i, i + itemsPerRow)); // Memotong produk per 10 item
    }

  
  useEffect(() => {
    axios.get('http://localhost/Backend/Auth/getproduct.php')
    .then(response => {
        console.log(response.data);
        setProducts(response.data);
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
    });
  }, []); 

  return (
    <Container>
    {rows.map((row, rowIndex) => (
        <Row key={rowIndex} className="rowindex d-flex justify-content-start">
            {row.map((product) => (
                <Col
                    key={product.id_produk}
                    sm={12} md={6} lg={2}
                    style={{ marginRight: '40px', marginTop: '32px' }} // Menambahkan margin bawah antar card
                >
                    <ProductCard
                        idProduk={product.id_produk}
                        namaProduk={product.nama_produk}
                        harga={product.harga}
                        gambarProduk={product.gambar_produk}
                        kategori={product.kategori}
                    />
                </Col>
            ))}
        </Row>
    ))}
</Container>
);
};

export default ProductGrid;
