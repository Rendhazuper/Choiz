import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Card, Dropdown} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MyNavbar from '../Component/navbar';
import axios from 'axios';

const DetailProduk = () => {
  const { id } = useParams(); // Mengambil parameter id dari URL
  const [produk, setProduk] = useState(null);

  useEffect(() => {
    // Ambil data produk berdasarkan ID dari backend
    axios
      .get(`http://localhost/Backend/Auth/getproduct.php?id=${id}`)
      .then((response) => {
        console.log(response.data);
        setProduk(response.data); // Simpan data produk ke state
      })
      .catch((error) => {
        console.error('Error fetching product detail:', error);
      });
  }, [id]);

  if (!produk) {
    return <div>Loading...</div>; // Tampilkan loading jika data belum tersedia
  }

  return (
    <div>
      <MyNavbar />
      <div className="bannershop">
     <Container className="kontainerr" fluid>
            <Row className="d-flex justify-content-center align-items-center" gap={10}> 
                <Col className="kolomkiri ">           
                    <Link to={`/home`} > Home </Link>
                    <p> &gt; </p>
                    <Link to={`/shop`} > Shop </Link>
                    <p> &gt; </p>
                    <p> | </p>
                    <p> {produk.kategori} </p>
                </Col>
            </Row>
        </Container>
            </div>
        </div>
  );
};

export default DetailProduk;
