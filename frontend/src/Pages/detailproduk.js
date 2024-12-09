import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Card, Dropdown} from 'react-bootstrap';
import {BsFacebook,BsLinkedin, BsTwitterX } from 'react-icons/bs';
import ProductGridDetail  from "../Component/productgriddetail";
import { Link } from 'react-router-dom';
import MyNavbar from '../Component/navbar';
import '../style/detailproduk.css';
import axios from 'axios';
// import terakhir from '../asset/Baju/terakhir.png';

const DetailProduk = ({ produk }) => {
  const { id } = useParams(); // Mengambil parameter id dari URL
  const [product, setProduk] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1); // State untuk jumlah produk yang dipilih
  const [cart, setCart] = useState([]);
  const [stok, setStok] = useState(0);
  

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const selectedSizeObj = product.sizes.find(item => item.size === size);
    if (selectedSizeObj) {
      setStok(selectedSizeObj.stok); 
      console.log("Button clicked for size: ", size);
  };
}

  const handleIncrease = () => {
    if (quantity < stok) { // Pastikan tidak melebihi stok
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
   
    const cartItem = { ...product, size: selectedSize, quantity };
    setCart([...cart, cartItem]);
    localStorage.setItem('cart', JSON.stringify([...cart, cartItem])); 
    console.log('Product added to cart:', cartItem);
  };

  const compareProduct = () => {
    // Menyimpan produk yang sedang dibandingkan
    localStorage.setItem('compareProduct', JSON.stringify(product));
    console.log('Product added to compare:', product);
  };

  useEffect(() => {
    
    axios
      .get(`http://localhost/Backend/Auth/getproduct.php?id=${id}`)
      .then((response) => {
        setProduk(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product detail:', error);
      });
      
  }, [id])

  
  

  if (!product) {
    return <div>Loading...</div>; // Tampilkan loading jika data belum tersedia
  }

  const formatHarga = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
}).format(product.harga);

  return (
    <div>
      <MyNavbar />
      <div className="bannershop">
        <Container className="kontainerr" fluid>
          <Row className="row1 d-flex" gap={10}>
            <Col className="kolomkiri">
              <Link to={`/home`}>Home</Link>
              <p> &gt; </p>
              <Link to={`/shop`}>Shop</Link>
              <p> &gt; </p>
              <p> | </p>
              <p> {product.kategori} </p>
            </Col>
          </Row>
        </Container>

        <section className="kon-detail">
          <Container className="kontrakan">
            <Row>
              <Col className="col-kiri" md={6}>
                {/* Pastikan URL gambar benar */}
                <Image src={'/' + product.gambar_produk} />
              </Col>
              <Col className="col-kanan" md={7}>
                <Container>
                  <Col className="Header">
                    <h2>{product.nama_produk}</h2>
                    <h3>{formatHarga}</h3>
                  </Col>
                  <Col className="description text-start">
                    <p>{product.deskripsi}</p>
                  </Col>
                  <Col className="size">
                    <p>Size</p>
                    {Array.isArray(product.sizes) ? (
                      product.sizes.map((size, index) => (
                        <Button
                          key={index}
                          variant="primary"
                          onClick={() => handleSizeClick(size.size)}
                          style={{
                            marginRight: '18px',
                            backgroundColor: selectedSize === size.size ? '#B88E2F' : 'white',
                            color: selectedSize === size.size ? 'white' : '#B88E2F',
                            border: selectedSize === size.size ? '#B88E2F' : '1px solid #B88E2F',
                            padding: '10px 20px',
                          }}
                        >
                          {size.size}
                        </Button>
                      ))
                    ) : (
                      <p>{product.size}</p>
                    )}
                    <p>Color</p>
                    <div className={`colored-container ${product.warna.toLowerCase()}`} />
                    <p>Quantity</p>
                    <Col className='bawah'>
                   
                    
                    <div className="quantity-controls">
                      <Button 
                          onClick={handleDecrease} 
                          disabled={quantity <= 1} 
                          style={{
                              backgroundColor: quantity > 1 ? '#B88E2F' : 'white', 
                              color: quantity > 1 ? 'white' : '#B88E2F',
                              border: quantity > 1 ? 'none' : '1px solid #B88E2F'
                          }}
                      >
                          -
                      </Button>
                      <span>{quantity}</span>
                      <Button 
                          onClick={handleIncrease} 
                          disabled={quantity >= stok} 
                          style={{
                              backgroundColor: quantity < stok ? '#B88E2F' : 'white', 
                              color: quantity < stok ? 'white' : '#B88E2F',
                              border: quantity < stok ? 'none' : '1px solid #B88E2F'
                          }}
                      >
                          +
                      </Button>
                     </div> 
                    <div className="action-buttons">
                      <Button onClick={addToCart} variant="success" className="mt-3">Add to Cart</Button>
                      <Button onClick={compareProduct} variant="info" className="mt-3 ms-2">Compare</Button>
                    </div>
                    </Col>
                  </Col>
                  <Col className='deskripsibawah'>
                  <hr />
                    <p>Category: {product.kategori}</p>
                    <p>Tags: {product.kategori}</p>
                    <p className='share'>
                      
                    Share: 
                    <div>
                    <BsFacebook size={16} style={{ marginLeft: '10px' }} />
                    <BsLinkedin size={16} style={{ marginLeft: '10px' }} />
                    <BsTwitterX size={16} style={{ marginLeft: '10px' }} />
                    </div>
                  </p>
                    
                  </Col>
                </Container>
              </Col>
            </Row>
          </Container>
        </section>
        <section>
          <hr/>
          <Container className='deskripsiproduk'>
            <Row >
            <Col className='kol1des'>
            <h4> Description</h4>
            </Col>    
            <Col className='kolom2'>
            <h4> Additional Infomration</h4>
            </Col>
            </Row>
            <Row className='row3'>
              <p> {product.deskripsi} </p>
            </Row>
            <Row>
              <Col className='colImage'>
              <Image className='imeg1' src={'/' + product.gambar_produk} />
              </Col>
              <Col className='colImage'>
              <Image className='imeg2' src={'/' + product.gambar_produk} />
              </Col>
            </Row>
       </Container>
        </section>
        <section>
          <hr/>
          <Container className='deskripsiproduk'>
            <Row >
            <Col className='kol1des'>
            <h4> Related Products</h4>
            </Col>   
            </Row>
            <Row>
             <Col>
             <div className="product-grid-container">
                  < ProductGridDetail />
                </div>
             </Col>
            </Row>
       </Container>
        </section>
      </div>
    </div>
  );
};

export default DetailProduk;
