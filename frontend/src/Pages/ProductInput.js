import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "../Component/navbaradmin";
import "../style/register.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductInput = () => {
  const [namaProduk, setNamaProduk] = useState("");
  const [sizes, setSizes] = useState([]);
  const [warna, setWarna] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState({});
  const [harga, setHarga] = useState("");
  const [gambarProduk, setGambarProduk] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  const handleFileChange = (e) => {
    setGambarProduk(e.target.files[0]);
  };

  const handleSizeChange = (sizeValue) => {
    if (sizes.includes(sizeValue)) {
      setSizes(sizes.filter((size) => size !== sizeValue));
      const newStok = { ...stok };
      delete newStok[sizeValue];
      setStok(newStok);
    } else {
      setSizes([...sizes, sizeValue]);
      setStok({ ...stok, [sizeValue]: 0 });
    }
  };

  const handleStockChange = (sizeValue, value) => {
    setStok((prevStocks) => ({ ...prevStocks, [sizeValue]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !namaProduk ||
      !sizes.length ||
      !warna ||
      !kategori ||
      !harga ||
      !gambarProduk ||
      !deskripsi
    ) {
      setMessage("Semua field harus diisi.");
      setVariant("danger");
      return;
    }

    const formData = new FormData();
    formData.append("nama_produk", namaProduk);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("warna", warna);
    formData.append("kategori", kategori);
    formData.append("stocks", JSON.stringify(stok));
    formData.append("harga", harga);
    formData.append("gambar_produk", gambarProduk);
    formData.append("deskripsi", deskripsi);

    try {
      // const response = await axios.post("http://lightcoral-rat-258584.hostingersite.com/Backend/Admin/ProductInput.php", formData, {
      const response = await axios.post(
        "http://localhost/Backend/Admin/ProductInput.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      const kolom = Object.keys(response.data);
      console.log(kolom);
      if (response.status === 200) {
        setMessage("Produk berhasil ditambahkan!");
        setVariant("success");
        // Reset form fields
        setNamaProduk("");
        setSizes([]);
        setWarna("");
        setKategori("");
        setStok({});
        setHarga("");
        setGambarProduk(null);
        setDeskripsi("");
      } else {
        setMessage(
          response.data.error || "Terjadi kesalahan saat menambahkan produk."
        );
        setVariant("danger");
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response?.data?.error ||
            "Terjadi kesalahan saat menambahkan produk."
        );
        setVariant("danger");
      } else if (error.request) {
        setMessage("Tidak dapat terhubung ke server.");
        setVariant("danger");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui.");
        setVariant("danger");
      }
    }
  };

  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div className="register relative justify-center items-center min-h-screen">
        <Container>
          <Row>
            <Col className="judul">
              <p>CHOIZ</p>
            </Col>
            <Col>
              <Container className="kolom">
                <Row>
                  <h1>Input Produk</h1>
                </Row>
                {message && (
                  <Row>
                    <Alert variant={variant}>{message}</Alert>
                  </Row>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group className="mb-3" controlId="namaProduk">
                      <Form.Label className="label">Nama Produk</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan nama produk"
                        value={namaProduk}
                        onChange={(e) => setNamaProduk(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  {/* Size Selection as Checkboxes */}
                  <Form.Group className="mb-3">
                    <Form.Label className="label">Ukuran</Form.Label>
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <div key={size} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id={`size-${size}`}
                          checked={sizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`size-${size}`}
                          style={{ color: "black", marginLeft: "10px" }}
                        >
                          {size}
                        </label>
                        {/* Stock input next to checkbox */}
                        {sizes.includes(size) && (
                          <input
                            type="number"
                            placeholder={`Stok ${size}`}
                            value={stok[size] || ""}
                            onChange={(e) =>
                              handleStockChange(size, e.target.value)
                            }
                            style={{ width: "60px", marginLeft: "10px" }}
                          />
                        )}
                      </div>
                    ))}
                  </Form.Group>

                  <Row>
                    <Form.Group className="mb-3" controlId="warna">
                      <Form.Label className="label">Warna</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan warna produk"
                        value={warna}
                        onChange={(e) => setWarna(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="kategori">
                      <Form.Label className="label">Kategori</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan kategori produk"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="harga">
                      <Form.Label className="label">Harga</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Masukkan harga produk"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="gambarProduk">
                      <Form.Label className="label">Gambar Produk</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="deskripsi">
                      <Form.Label className="label">Deskripsi</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Masukkan deskripsi produk"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Button className="Button" type="submit">
                      Tambah Produk
                    </Button>
                  </Row>
                </Form>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ProductInput;
