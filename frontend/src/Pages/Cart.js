import React, { useEffect, useState } from "react";
import axios from "axios";
import MyNavbar from "../Component/navbar";
import Footer from "../Component/Footer";
import bannershop from "../asset/Baju/bannershop.png";
import "../style/cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Col,
  Row,
  Table,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        console.log("Username from session:", username);

        const response = await axios.post(
          "http://localhost/Backend/Auth/getCart.php",
          { username }
        );
        console.log("Response from server:", response.data);

        if (response.data.cart) {
          setCartData(response.data.cart);
          const total = response.data.cart.reduce(
            (sum, item) => sum + item.harga * item.jumlah,
            0
          );
          setTotal(total);
        } else {
          setCartData([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleDelete = async (id_cart) => {
    try {
      await axios.post("http://localhost/Backend/Auth/deleteCartItem.php", {
        id_cart,
      });
      setCartData(cartData.filter((item) => item.id_cart !== id_cart));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCheckout = async () => {
    if (total <= 0) {
      setError("Total amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const username = sessionStorage.getItem("username");
      console.log("Sending data to backend:", { username, totalAmount: total });
      const data = {
        username: username,
        totalAmount: total,
        items: cartData.map((item) => ({
          id_produk: item.id_produk,
          id_size: item.id_size,
          id_warna: item.id_warna,
          quantity: item.jumlah,
          price: item.harga,
          nama_produk: item.nama_produk,
          size: item.size,
          nama_warna: item.nama_warna,
        })),
      };

      const response = await fetch("http://localhost/Backend/Auth/Order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("Response from backend:", responseData);

      if (responseData.token) {
        window.snap.pay(responseData.token, {
          onSuccess: function (result) {
            alert("Payment Success!");
            console.log(result);
            const username = sessionStorage.getItem("username");

            const moveToHistoryData = {
              username: username,
              order_id: result.order_id,
              alamat: address,
              items: cartData.map((item) => ({
                id_produk: item.id_produk,
                id_size: item.id_size,
                id_warna: item.id_warna,
                quantity: item.jumlah,
                price: item.harga,
                nama_produk: item.nama_produk,
                size: item.size,
                nama_warna: item.nama_warna,
              })),
            };

            fetch("http://localhost/Backend/Auth/MoveToHistory.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(moveToHistoryData),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Response from MoveToHistory:", data);

                if (data.status === "success") {
                  console.log("Order history updated:", data);
                  alert(
                    "Products have been successfully moved to your order history!"
                  );
                  window.location.reload();
                } else {
                  console.error("Error from server:", data);
                  alert(
                    data.message || "Failed to move products to order history."
                  );
                }
              })
              .catch((err) => {
                console.error("Error in MoveToHistory:", err);
                alert("Something went wrong while processing your order.");
              });
          },
          onError: function (result) {
            alert("Payment Failed");
            console.log(result);
          },
          onPending: function (result) {
            alert("Payment Pending");
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
      setError("Error during checkout.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <MyNavbar />
        <div
          className="loading-container"
          style={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Spinner animation="border" role="status" />
          <span>Loading cart...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <MyNavbar />
        <div
          className="error-container"
          style={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>{error}</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div>
        <MyNavbar />
        <div
          className="empty-cart-container"
          style={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2>Your cart is empty</h2>
          <Button variant="primary" href="/shop">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  console.log("Current cartData:", cartData);

  return (
    <div>
      <MyNavbar />
      <div className="Cart">
        <img className="fotocart" src={bannershop} alt="Cart Banner" />
        <div className="tulisanbanner1">
          <h1 className="headbanner1">Cart</h1>
          <h3 className="subheadbanner1"> Home &gt; Cart</h3>
        </div>
      </div>
      <div className="mb-5">
        <Container>
          <Row>
            <Col md={8}>
              <Table>
                <thead style={{ backgroundColor: "#F9F1E7" }}>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>SubTotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="bodynya">
                  {cartData.map((item) => (
                    <tr key={item.id_cart}>
                      <td className="image-col">
                        <img
                          src={item.gambar_produk}
                          alt={item.nama_produk}
                          width="100"
                          className="mb-4"
                        />
                      </td>
                      <td className="product-col">
                        {item.nama_produk} ({item.size} - {item.nama_warna})
                      </td>
                      <td className="price-col">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.harga)}
                      </td>
                      <td className="quantity-col">{item.jumlah}</td>
                      <td className="subtotal-col">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.harga * item.jumlah)}
                      </td>
                      <td className="action-col">
                        <FaTrash
                          className="trash-icon"
                          onClick={() => handleDelete(item.id_cart)}
                        />
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(item.id_cart)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <Row>
                <Col className="shipping-form">
                  <div className="shipping-content">
                    <h5 className="mb-3">Shipping Address</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter your complete address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="cardtotal1">
                  <div className="kontencardtotal1">
                    <p className="judultotal">Cart Totals</p>
                    <div className="rowtotal">
                      <p className="labeltotal">Total: </p>
                      <p className="nominal">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(total)}
                      </p>
                    </div>
                    <Button
                      className="checkoutbut"
                      onClick={handleCheckout}
                      disabled={!address.trim()}
                    >
                      {!address.trim() ? "Checkout" : "Checkout"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
