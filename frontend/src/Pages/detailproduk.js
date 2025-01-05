import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import {
  BsFacebook,
  BsLinkedin,
  BsTwitterX,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import ProductGridDetail from "../Component/productgriddetail";
import { useNavigate } from "react-router";
import MyNavbar from "../Component/navbar";
import "../style/detailproduk.css";
import axios from "axios";

const DetailProduk = ({ produk }) => {
  const { id } = useParams();
  const [product, setProduk] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedWarna, setSelectedWarna] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stok, setStok] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stockCheckInterval, setStockCheckInterval] = useState(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isAddressModalConfirmed, setIsAddressModalConfirmed] = useState(false);

  const handleCloseModal = () => setShowModal(false);

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
    setSelectedWarna(null);
    setQuantity(1);

    const selectedSizeData = product.sizes.find((item) => item.size === size);
    if (selectedSizeData) {
      setStok(0);
    }
  };

  const handleWarnaClick = (warnaData) => {
    setSelectedWarna(warnaData.nama_warna);
    setStok(warnaData.stok);
    setQuantity(1);
  };

  const handleIncrease = () => {
    if (quantity < stok) {
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
        console.log("Raw API Response:", response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          setShowUnavailableModal(true);
          return;
        }
        setProduk(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product detail:", error);
        setShowUnavailableModal(true);
      });
  }, [id]);

  const checkStockAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost/Backend/Auth/getproduct.php?id=${id}`
      );
      const updatedProduct = response.data;

      // Check if all sizes and colors are out of stock
      const hasAnyStock = updatedProduct.sizes.some((size) =>
        size.warna.some((warna) => warna.stok > 0)
      );

      if (!hasAnyStock) {
        alert("Sorry, this item is completely out of stock!");
        navigate("/shop");
      }
    } catch (error) {
      console.error("Error checking stock:", error);
    }
  };

  useEffect(() => {
    // Check stock every second
    const interval = setInterval(checkStockAvailability, 1000);
    setStockCheckInterval(interval);

    return () => {
      if (stockCheckInterval) {
        clearInterval(stockCheckInterval);
      }
    };
  }, []); // Now runs regardless of selection state

  const formatHarga = product
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(product.harga)
    : "";

  if (!product && !showUnavailableModal) {
    return <div>Loading...</div>;
  }

  const handleBuyNowClick = () => {
    setShowAddressModal(true);
  };

  const handleAddressSubmit = () => {
    if (!shippingAddress.trim()) {
      alert("Please enter shipping address");
      return;
    }
    setIsAddressModalConfirmed(true);
    setShowAddressModal(false);
    onPurchase(); // Panggil fungsi pembayaran
  };

  const onPurchase = async () => {
    if (!selectedSize || !selectedWarna) {
      alert("Please select a size and color first.");
      return;
    }

    if (!isAddressModalConfirmed) {
      handleBuyNowClick();
      return;
    }

    const username = sessionStorage.getItem("username");
    const totalAmount = product.harga * quantity;

    try {
      const response = await fetch("http://localhost/Backend/Auth/Order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          totalAmount: totalAmount,
          items: [
            {
              id_produk: id,
              nama_produk: product.nama_produk,
              harga: product.harga,
              jumlah: quantity,
              size: selectedSize,
              nama_warna: selectedWarna,
              alamat: shippingAddress, // Tambahkan alamat
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.token) {
        window.snap.pay(responseData.token, {
          onSuccess: function (result) {
            alert("Payment Success!");

            fetch("http://localhost/Backend/Auth/pindahhistory.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: username,
                order_id: result.order_id,
                items: [
                  {
                    id_produk: id,
                    size: selectedSize,
                    nama_warna: selectedWarna,
                    quantity: quantity,
                    price: product.harga * quantity,
                    alamat: shippingAddress,
                  },
                ],
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success") {
                  alert("Payment successful and order has been processed!");
                  window.location.reload();
                } else {
                  throw new Error(data.message || "Failed to process order");
                }
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
            alert("You closed the popup without finishing the payment");
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing payment: " + error.message);
    }
  };

  const addToCart = async () => {
    if (!selectedSize || !selectedWarna) {
      alert("Please select a size and color first.");
      return;
    }

    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("User not logged in.");
      return;
    }

    try {
      // Dapatkan id_warna dari data produk
      const selectedSizeData = product.sizes.find(
        (s) => s.size === selectedSize
      );
      const selectedWarnaData = selectedSizeData.warna.find(
        (w) => w.nama_warna === selectedWarna
      );

      if (!selectedWarnaData) {
        alert("Color data not found");
        return;
      }

      const data = {
        username: username,
        id_produk: id,
        jumlah: quantity,
        size: selectedSize,
        warna: selectedWarnaData.nama_warna,
        stok: selectedWarnaData.stok,
      };

      console.log("Sending cart data:", data); // Debug

      const response = await fetch(
        "http://localhost/Backend/Auth/addtocart.php",
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
        setShowModal(true);
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error during add to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body className="text-center">
          <BsCheckCircle size={60} color="green" />
          <h5 className=" text-center">Success!</h5>
          <p>Product has been added to your cart.</p>
          <Button variant="success" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        show={showUnavailableModal}
        onHide={() => {
          setShowUnavailableModal(false);
          navigate("/shop");
        }}
        centered
      >
        <Modal.Body className="text-center">
          <BsXCircle size={60} color="red" />
          <h5 className="text-center">Sorry!</h5>
          <p>Product unavailable.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUnavailableModal(false);
              navigate("/shop");
            }}
          >
            Back to Shop
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Shipping Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete address"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddressModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddressSubmit}
            disabled={!shippingAddress.trim()}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {product && (
        <>
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
                      <div className="size-button-group">
                        {Array.isArray(product.sizes) &&
                          product.sizes.map((sizeData, index) => (
                            <Button
                              key={index}
                              variant="primary"
                              className="size-button"
                              onClick={() => handleSizeClick(sizeData.size)}
                              style={{
                                backgroundColor:
                                  selectedSize === sizeData.size
                                    ? "#B88E2F"
                                    : "white",
                                color:
                                  selectedSize === sizeData.size
                                    ? "white"
                                    : "#B88E2F",
                                border:
                                  selectedSize === sizeData.size
                                    ? "#B88E2F"
                                    : "1px solid #B88E2F",
                              }}
                            >
                              {sizeData.size}
                            </Button>
                          ))}
                      </div>

                      {selectedSize && (
                        <>
                          <p>Warna</p>
                          <div className="color-button-group">
                            {product.sizes
                              .find((s) => s.size === selectedSize)
                              ?.warna.map((warnaData, index) => (
                                <Button
                                  key={index}
                                  variant="primary"
                                  className="color-button"
                                  onClick={() => handleWarnaClick(warnaData)}
                                  disabled={warnaData.stok === 0}
                                  style={{
                                    backgroundColor:
                                      selectedWarna === warnaData.nama_warna
                                        ? "#B88E2F"
                                        : "white",
                                    color:
                                      selectedWarna === warnaData.nama_warna
                                        ? "white"
                                        : "#B88E2F",
                                    border:
                                      selectedWarna === warnaData.nama_warna
                                        ? "#B88E2F"
                                        : "1px solid #B88E2F",
                                  }}
                                >
                                  {warnaData.nama_warna}{" "}
                                  {warnaData.stok === 0 ? "(Habis)" : ""}
                                </Button>
                              ))}
                          </div>
                        </>
                      )}

                      {selectedSize && selectedWarna && (
                        <>
                          <p>Quantity</p>
                          <Col className="detail-produk-bawah">
                            <div className="quantity-controls">
                              <Button
                                onClick={handleDecrease}
                                disabled={quantity <= 1}
                                style={{
                                  backgroundColor:
                                    quantity > 1 ? "#B88E2F" : "white",
                                  color: quantity > 1 ? "white" : "#B88E2F",
                                  border:
                                    quantity > 1 ? "none" : "1px solid #B88E2F",
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
                                    quantity < stok
                                      ? "none"
                                      : "1px solid #B88E2F",
                                }}
                              >
                                +
                              </Button>
                            </div>
                            <p>Stok: {stok}</p>
                            <div className="action-buttons">
                              <Button
                                onClick={addToCart}
                                variant="success"
                                className="mt-3"
                              >
                                Add to Cart
                              </Button>
                              <Button
                                onClick={handleBuyNowClick}
                                variant="info"
                                className="mt-3 ms-2"
                              >
                                Buy Now
                              </Button>
                            </div>
                          </Col>
                        </>
                      )}
                    </Col>
                    <Col className="deskripsibawah">
                      <hr />
                      <p>Category: {product.kategori}</p>
                      <p>Tags: {product.kategori}</p>
                      <p className="share">
                        Share:
                        <div>
                          <BsFacebook
                            size={16}
                            style={{ marginLeft: "10px" }}
                          />
                          <BsLinkedin
                            size={16}
                            style={{ marginLeft: "10px" }}
                          />
                          <BsTwitterX
                            size={16}
                            style={{ marginLeft: "10px" }}
                          />
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
        </>
      )}
    </div>
  );
};

export default DetailProduk;
