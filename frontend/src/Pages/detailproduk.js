import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { BsFacebook, BsLinkedin, BsTwitterX } from "react-icons/bs";
import ProductGridDetail from "../Component/productgriddetail";
import { useNavigate } from "react-router";
import MyNavbar from "../Component/navbar";
import "../style/detailproduk.css";
import axios from "axios";

const DetailProduk = ({ produk }) => {
  const { id } = useParams();
  const [product, setProduk] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [stok, setStok] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const checkLogin = async () => {
    try {
      // const response = await axios.get("http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/cekLogin.php", {
      const response = await axios.get(
        "http://localhost/Backend/Auth/cekLogin.php",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Error checking login:", error);
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, [navigate]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const selectedSizeObj = product.sizes.find((item) => item.size === size);
    if (selectedSizeObj) {
      setStok(selectedSizeObj.stok);
      setQuantity(1);
      console.log("Button clicked for size: ", size);
    }
  };

  const handleIncrease = () => {
    if (quantity < stok) {
      // Pastikan tidak melebihi stok
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost/Backend/Auth/getproduct.php?id=${id}`)
      .then((response) => {
        setProduk(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product detail:", error);
      });
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const onPurchase = async () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    const totalAmount = product.harga * quantity;
    const username = sessionStorage.getItem("username");

    // Tambahkan items ke data yang dikirim
    const data = {
      username: username,
      totalAmount: totalAmount,
      items: [
        {
          id: product.id_produk,
          name: product.nama_produk,
          price: product.harga,
          quantity: quantity,
          size: selectedSize,
        },
      ],
    };

    console.log("Sending data:", data); // Untuk debugging

    try {
      const response = await fetch("http://localhost/Backend/Auth/Order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Response:", responseData); // Untuk debugging

      if (responseData.token) {
        window.snap.pay(responseData.token, {
          onSuccess: function (result) {
            alert("Payment Success!");
            console.log(result);

            const moveToHistoryData = {
              username: username,
              order_id: result.order_id,
              product_id: id,
              quantity: quantity,
              total_amount: totalAmount,
              size_id: selectedSize,
            };
            console.log("Move to history data: ", moveToHistoryData);

            // Kirim request untuk memindahkan produk ke riwayat transaksi
            fetch("http://localhost/Backend/Auth/pindahhistory.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(moveToHistoryData),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    "Failed to communicate with the server. Status: " +
                      response.status
                  );
                }

                return response.text(); // Ambil respons sebagai teks untuk debugging
              })
              .then((text) => {
                console.log("Response Text: ", text); // Log respons sebagai teks

                // Coba untuk mengurai JSON
                try {
                  const data = JSON.parse(text); // Ubah teks ke JSON jika formatnya benar
                  console.log("Parsed Data:", data);

                  if (data.success) {
                    alert(
                      "Products have been successfully moved to your order history!"
                    );
                  } else {
                    console.log("Error moving to order history:", data.error);
                    alert("Failed to move products to order history.");
                  }
                } catch (error) {
                  console.error("Failed to parse JSON:", error);
                  alert("Error: Invalid JSON response.");
                }
              })
              .catch((err) => {
                console.error("Error:", err);
                alert(
                  "Something went wrong while processing your order: " +
                    err.message
                );
              });
          },
          onPending: function (result) {
            alert("Payment Pending");
            console.log(result);
          },
          onError: function (result) {
            alert("Payment Failed");
            console.log(result);
          },
          onClose: function () {
            alert("You closed the popup without finishing the payment.");
          },
        });
      } else {
        setError(
          "Error with payment gateway: " +
            (responseData.error || "No token received.")
        );
      }
    } catch (error) {
      console.error("Error while processing payment:", error);
      alert("Error processing payment: " + error.message);
    }
  };

  const addToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("User not logged in.");
      return;
    }

    const data = {
      username: username,
      id_produk: id,
      jumlah: quantity,
      id_size: selectedSize,
    };

    try {
      const response = await fetch(
        "http://localhost/Backend/Auth/addToCart.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        setShowToast(true);
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error during add to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const formatHarga = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.harga);

  return (
    <div>
      <MyNavbar />
      <div className="detail-product-banner">
        <Container className="detail-product-container" fluid>
          <Row className="detail-product-row d-flex" gap={10}>
            <Col className="detail-product-breadcrumb">
              <Link to={`/home`}>Home</Link>
              <p> &gt; </p>
              <Link to={`/shop`}>Shop</Link>
              <p> &gt; </p>
              <p> | </p>
              <p> {product.nama_kategori} </p>
            </Col>
          </Row>
        </Container>
      </div>

      <section className="kon-detail">
        <Container className="kontrakan" fluid>
          <Row>
            <Col xs={12} className="col-kiri" md={6}>
              <Image src={"/" + product.gambar_produk} />
            </Col>
            <Col xs={12} className="col-kanan" md={7}>
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
                    product.sizes
                      .filter((size) => size.stok > 0)
                      .map((size, index) => (
                        <Button
                          key={index}
                          variant="primary"
                          onClick={() => handleSizeClick(size.size)}
                          style={{
                            marginRight: "18px",
                            backgroundColor:
                              selectedSize === size.size ? "#B88E2F" : "white",
                            color:
                              selectedSize === size.size ? "white" : "#B88E2F",
                            border:
                              selectedSize === size.size
                                ? "#B88E2F"
                                : "1px solid #B88E2F",
                            padding: "10px 20px",
                          }}
                        >
                          {size.size}
                        </Button>
                      ))
                  ) : (
                    <p>{product.size}</p>
                  )}
                  {selectedSize && stok !== null && (
                    <p>
                      Stok untuk ukuran <strong>{selectedSize}</strong>: {stok}
                    </p>
                  )}
                  <p>Color</p>
                  <div
                    className={`colored-container ${product.warna.toLowerCase()}`}
                  />
                  <p>Quantity</p>
                  <Col className="detail-produk-bawah">
                    <div className="quantity-controls">
                      <Button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        style={{
                          backgroundColor: quantity > 1 ? "#B88E2F" : "white",
                          color: quantity > 1 ? "white" : "#B88E2F",
                          border: quantity > 1 ? "none" : "1px solid #B88E2F",
                        }}
                      >
                        -
                      </Button>
                      <span>{quantity}</span>
                      <Button
                        onClick={handleIncrease}
                        disabled={quantity >= stok}
                        style={{
                          backgroundColor:
                            quantity < stok ? "#B88E2F" : "white",
                          color: quantity < stok ? "white" : "#B88E2F",
                          border:
                            quantity < stok ? "none" : "1px solid #B88E2F",
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div className="action-buttons">
                      <Button
                        onClick={addToCart}
                        variant="success"
                        className="mt-3"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={onPurchase}
                        variant="info"
                        className="mt-3 ms-2"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </Col>
                </Col>
                <Col className="deskripsibawah">
                  <hr />
                  <p>Category: {product.kategori}</p>
                  <p>Tags: {product.kategori}</p>
                  <p className="share">
                    Share:
                    <div>
                      <BsFacebook size={16} style={{ marginLeft: "10px" }} />
                      <BsLinkedin size={16} style={{ marginLeft: "10px" }} />
                      <BsTwitterX size={16} style={{ marginLeft: "10px" }} />
                    </div>
                  </p>
                </Col>
              </Container>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <hr />
        <Container className="deskripsiproduk">
          <Row>
            <Col className="kol1des">
              <h4> Description</h4>
            </Col>
            <Col className="kolom2">
              <h4> Additional Infomration</h4>
            </Col>
          </Row>
          <Row className="row3">
            <p> {product.deskripsi} </p>
          </Row>
          <Row>
            <Col className="colImage">
              <Image className="imeg1" src={"/" + product.gambar_produk} />
            </Col>
            <Col className="colImage">
              <Image className="imeg2" src={"/" + product.gambar_produk} />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <hr />
        <Container className="deskripsiproduk">
          <Row>
            <Col className="kol1des">
              <h4> Related Products</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="product-grid-container">
                <ProductGridDetail />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ToastContainer position="top-end">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="custom-toast"
        >
          <Toast.Body>Success! Product added to cart.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default DetailProduk;
