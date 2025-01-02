import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/detailproduk.css";

const EditProduk = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    nama_produk: "",
    color: "",
    price: "",
    description: "",
    sizes: [],
  });
  const [image, setImage] = useState(null);
  const [stok, setStok] = useState({});
  const [availableColors, setAvailableColors] = useState([]);
  const navigate = useNavigate();

  // Mengambil data produk dari API
  useEffect(() => {
    axios
      .get(`http://localhost/Backend/Auth/getproduct.php?id=${id}`)
      .then((response) => {
        const data = response.data;
        console.log("API Response:", response.data);

        if (data && data.nama_produk) {
          // Set product basic info
          const productData = {
            nama_produk: data.nama_produk,
            color: data.warna || "",
            price: data.harga || "",
            description: data.deskripsi || "",
            sizes: data.sizes.map((sizeObj) => sizeObj.size),
          };

          // Initialize stok with existing data
          const initialStok = {};
          data.sizes.forEach((sizeObj) => {
            initialStok[sizeObj.size] = {};
            if (sizeObj.warna && Array.isArray(sizeObj.warna)) {
              sizeObj.warna.forEach((warnaObj) => {
                // Pastikan nama_warna dalam lowercase untuk konsistensi
                const namaWarna = warnaObj.nama_warna.toLowerCase();
                initialStok[sizeObj.size][namaWarna] = parseInt(warnaObj.stok);
              });
            }
          });

          console.log("Initial stok:", initialStok);
          setProduct(productData);
          setStok(initialStok);
        }
      })
      .catch((error) => {
        console.error("Error fetching product detail:", error);
      });
  }, [id]);

  // Tambahkan useEffect untuk mengambil data warna
  useEffect(() => {
    // Ambil data warna dari database menggunakan GetWarna.php yang sudah ada
    axios
      .get("http://localhost/Backend/Admin/GetWarna.php")
      .then((response) => {
        if (response.data && !response.data.error) {
          console.log("Fetched colors:", response.data);
          setAvailableColors(response.data);
        } else {
          console.error("Error in color data:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
      });
  }, []);

  // Fungsi untuk mengubah ukuran produk
  const handleSizeChange = (size) => {
    if (product.sizes.includes(size)) {
      setProduct({
        ...product,
        sizes: product.sizes.filter((s) => s !== size),
      });
      const newStok = { ...stok };
      delete newStok[size];
      setStok(newStok);
    } else {
      setProduct({
        ...product,
        sizes: [...product.sizes, size],
      });
      setStok({
        ...stok,
        [size]: {},
      });
    }
  };

  const handleColorChange = (size, color) => {
    const newStok = { ...stok };
    if (newStok[size]?.[color] !== undefined) {
      delete newStok[size][color];
      if (Object.keys(newStok[size]).length === 0) {
        delete newStok[size];
      }
    } else {
      if (!newStok[size]) {
        newStok[size] = {};
      }
      newStok[size][color] = 0;
    }
    setStok(newStok);
  };

  // Fungsi untuk mengubah stok produk
  const handleStockChange = (size, color, value) => {
    setStok({
      ...stok,
      [size]: {
        ...stok[size],
        [color]: value === "" ? "" : parseInt(value) || 0,
      },
    });
  };

  // Fungsi helper untuk mengecek warna
  const isColorAvailable = (size, color) => {
    console.log(
      `Checking color ${color} for size ${size}:`,
      stok[size]?.[color]
    );
    return stok[size]?.[color] !== undefined;
  };

  // Fungsi helper untuk mendapatkan stok
  const getStockValue = (size, color) => {
    const value = stok[size]?.[color];
    return value === undefined ? "" : value.toString();
  };

  // Fungsi untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi dasar
    if (!product.nama_produk || !product.price || !product.description) {
      alert("Please fill in product name, price, and description.");
      return;
    }

    // Validasi size dan stok
    if (product.sizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }

    // Validasi apakah setiap size memiliki minimal satu warna dengan stok
    let hasValidStock = false;
    for (const size of product.sizes) {
      if (stok[size] && Object.keys(stok[size]).length > 0) {
        hasValidStock = true;
        break;
      }
    }

    if (!hasValidStock) {
      alert("Please add at least one color and stock for selected sizes.");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", product.nama_produk);
    formData.append("color", product.color || ""); // Make color optional
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("sizes", JSON.stringify(product.sizes));
    formData.append("stocks", JSON.stringify(stok));

    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost/Backend/Admin/updateproduct.php", formData)
      .then((response) => {
        console.log("Product updated:", response.data);
        navigate("/produk");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Error updating product: " + error.message);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .post(`http://localhost/Backend/Admin/deleteproduk.php?id=${id}`) // Corrected URL
        .then((response) => {
          console.log("Response from server:", response); // Log the response
          if (response.data.success) {
            alert("Product deleted successfully.");
            navigate("/produk"); // Redirect to the product list page
          } else {
            alert("Error deleting product: " + response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          // Check if error response exists
          if (error.response && error.response.data) {
            alert("Error deleting product: " + error.response.data.message);
          } else {
            alert("An error occurred while deleting the product.");
          }
        });
    }
  };
  return (
    <div>
      <Container>
        <Row className="align-items-center mb-4">
          <Col className="text-start">
            <Link to="/produk">
              <Button variant="danger">Cancel</Button>
            </Link>
          </Col>
        </Row>

        <h1>Edit Product</h1>
        <Form onSubmit={handleSubmit}>
          {/* Nama Produk */}
          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={product.nama_produk}
              onChange={(e) =>
                setProduct({ ...product, nama_produk: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Control
              as="select"
              value={product.color || ""}
              onChange={(e) =>
                setProduct({ ...product, color: e.target.value })
              }
            >
              <option value="">Select Color</option>
              <option value="putih">Putih</option>
              <option value="hitam">Hitam</option>
              <option value="kuning">Kuning</option>
              <option value="merah">Merah</option>
              <option value="brown">Brown</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder={product.price || "Enter product price"}
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={product.description || "Enter product description"} // Placeholder dengan nilai awal
              value={product.description} // Nilai yang diikat ke state
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </Form.Group>

          {/* Ukuran dan Warna Produk */}
          <Form.Group>
            <Form.Label>Sizes and Colors</Form.Label>
            <div className="size-color-container">
              <div className="sizes-column">
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                  <div key={size} className="size-item">
                    <Form.Check
                      type="checkbox"
                      id={`size-${size}`}
                      checked={product.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      label={size}
                    />
                  </div>
                ))}
              </div>

              <div className="colors-column">
                {product.sizes.length > 0 && (
                  <div className="colors-grid">
                    <div className="color-header">Available Colors:</div>
                    {product.sizes.map((size) => (
                      <div key={size} className="color-section">
                        <div className="size-label">{size}:</div>
                        <div className="color-options">
                          {availableColors.map((colorObj) => {
                            const isChecked = isColorAvailable(
                              size,
                              colorObj.nama_warna.toLowerCase()
                            );
                            return (
                              <div
                                key={`${size}-${colorObj.nama_warna}`}
                                className="color-item"
                              >
                                <Form.Check
                                  type="checkbox"
                                  id={`${size}-${colorObj.nama_warna}`}
                                  checked={isChecked}
                                  onChange={() =>
                                    handleColorChange(
                                      size,
                                      colorObj.nama_warna.toLowerCase()
                                    )
                                  }
                                  label={colorObj.nama_warna}
                                />
                                {isChecked && (
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    value={getStockValue(
                                      size,
                                      colorObj.nama_warna.toLowerCase()
                                    )}
                                    onChange={(e) =>
                                      handleStockChange(
                                        size,
                                        colorObj.nama_warna.toLowerCase(),
                                        e.target.value
                                      )
                                    }
                                    placeholder="Stock"
                                    className="stock-input"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Form.Group>

          {/* Gambar Produk */}
          <Form.Group>
            <Form.Label>Upload Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Save Changes
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditProduk;
