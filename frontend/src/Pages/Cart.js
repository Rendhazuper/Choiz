import React, { useEffect, useState } from "react";
import axios from "axios";
import MyNavbar from "../Component/navbar";
import Footer from "../Component/Footer";
import bannershop from "../asset/Baju/bannershop.png";
import "../style/cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row, Table, Button, Spinner } from "react-bootstrap";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        console.log(
          "Checking if username exists in sessionStorage:",
          sessionStorage.getItem("username")
        );
        const username = sessionStorage.getItem("username");
        console.log("Username from localStorage:", username);
        if (!username) {
          setError("Please log in to view your cart.");
          setLoading(false);
          return;
        }
        const response = await axios.post(
          "http://localhost/Backend/Auth/getCart.php",
          {
            username: username,
          }
        );

        if (response.data.cart) {
          setCartData(response.data.cart);
          calculateTotal(response.data.cart);
        } else {
          setError(response.data.error || "Error fetching cart data.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const calculateTotal = (cart) => {
    let totalAmount = 0;
    cart.forEach((item) => {
      totalAmount += item.harga * item.jumlah;
    });
    setTotal(totalAmount);
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

      // Membuat objek data yang akan dikirim
      const data = {
        username: username,
        totalAmount: total,
      };

      // Menggunakan fetch untuk mengirimkan data ke server
      const response = await fetch("http://localhost/Backend/Auth/Order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Mengirimkan data dalam format JSON
        },
        body: JSON.stringify(data), // Mengubah objek menjadi JSON
      });

      const responseData = await response.json(); // Mengambil respons sebagai JSON

      console.log("Response from backend:", responseData);

      // Memeriksa apakah token ada dalam respons
      if (responseData.token) {
        window.snap.pay(responseData.token, {
          onSuccess: function (result) {
            alert("Payment Success!");
            console.log(result);

            // Kirim data setelah pembayaran sukses ke backend untuk memindahkan produk ke riwayat transaksi
            const username = sessionStorage.getItem("username");

            const moveToHistoryData = {
              username: username,
              order_id: result.order_id,
            };

            // Kirim request ke backend untuk memindahkan produk ke riwayat transaksi
            fetch("http://localhost/Backend/Auth/MoveToHistory.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(moveToHistoryData),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  console.log("Order history updated:", data);
                  alert(
                    "Products have been successfully moved to your order history!"
                  );
                } else {
                  console.log("Error moving to order history:", data.error);
                  alert("Failed to move products to order history.");
                }
              })
              .catch((err) => {
                console.error("Error:", err);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <MyNavbar />
        <div className="loading-container">
          <Spinner animation="border" role="status" />
          <span>Loading...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <MyNavbar />
        <div className="error-container">
          <h2>{error}</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div>
        <MyNavbar />
      </div>
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
                  </tr>
                </thead>
                <tbody className="bodynya">
                  {cartData.map((item) => (
                    <tr key={item.id_cart}>
                      {/* Kolom Gambar */}
                      <td className="image-col">
                        <img
                          src={item.gambar_produk}
                          alt={item.nama_produk}
                          width="100"
                          className="mb-4"
                        />
                      </td>

                      {/* Kolom Nama Produk */}
                      <td className="product-col">
                        {item.nama_produk} ({item.size})
                      </td>

                      {/* Kolom Harga */}
                      <td className="price-col">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.harga)}
                      </td>

                      {/* Kolom Jumlah */}
                      <td className="quantity-col">{item.jumlah}</td>

                      {/* Kolom Total Harga */}
                      <td className="subtotal-col">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.harga * item.jumlah)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <Row>
                <Col className="cardtotal1">
                  <div className="kontencardtotal1">
                    <p className="judultotal">Cart Totals</p>

                    <div className="rowtotal">
                      <p className="labeltotal">Total: </p>
                      <p className="nominal">Rp {total.toLocaleString()}</p>
                    </div>

                    <Button className="checkoutbut" onClick={handleCheckout}>
                      Check Out
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="futercart">
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
