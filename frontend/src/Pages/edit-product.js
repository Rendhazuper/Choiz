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
  const navigate = useNavigate();

  // Mengambil data produk dari API
  useEffect(() => {
    axios
      .get(`http://localhost/Backend/Auth/getproduct.php?id=${id}`)
      .then((response) => {
        const data = response.data;
        console.log("Fetched product data:", data);
        if (data && data.nama_produk) {
          setProduct({
            nama_produk: data.nama_produk,
            color: data.warna || "",
            price: data.harga || "",
            description: data.deskripsi || "",
            sizes: data.sizes.map((sizeObj) => sizeObj.size), // Extract sizes from the array of objects
          });

          // Initialize stock based on sizes
          const initialStok = {};
          data.sizes.forEach((sizeObj) => {
            initialStok[sizeObj.size] = sizeObj.stok; // Set stock for each size
          });
          setStok(initialStok);
        } else {
          console.error("Product data not found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching product detail:", error);
      });
  }, [id]);

  // Fungsi untuk mengubah ukuran produk
  const handleSizeChange = (size) => {
    if (product.sizes.includes(size)) {
      setProduct({
        ...product,
        sizes: product.sizes.filter((item) => item !== size),
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
        [size]: stok[size] || 0,
      });
    }
  };

  // Fungsi untuk mengubah stok produk
  const handleStockChange = (size, value) => {
    setStok({
      ...stok,
      [size]: value,
    });
  };

  // Fungsi untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !product.nama_produk ||
      !product.price ||
      !product.color ||
      !product.description ||
      !product.sizes.length
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", product.nama_produk);
    formData.append("color", product.color);
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

          {/* Ukuran Produk */}
          <Form.Group>
            <Form.Label>Sizes</Form.Label>
            {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
              <div key={size} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`size-${size}`}
                  checked={product.sizes.includes(size)} // Memastikan checkbox tercentang jika ukuran ada di state
                  onChange={() => handleSizeChange(size)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`size-${size}`}
                  style={{ color: "black", marginLeft: "10px" }}
                >
                  {size}
                </label>
                {product.sizes.includes(size) && (
                  <input
                    type="number"
                    placeholder={`Stock for ${size}`}
                    value={stok[size] || ""}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                    style={{ width: "60px", marginLeft: "10px" }}
                  />
                )}
              </div>
            ))}
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
