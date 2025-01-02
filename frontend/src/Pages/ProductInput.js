import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "../Component/navbaradmin";
import "../style/register.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductInput = () => {
  const [namaProduk, setNamaProduk] = useState("");
  const [sizes, setSizes] = useState([]);
  const [warnaList, setWarnaList] = useState([]);
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState({});
  const [selectedWarna, setSelectedWarna] = useState({});
  const [harga, setHarga] = useState("");
  const [gambarProduk, setGambarProduk] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [kategoriList, setKategoriList] = useState([]);
  const [isAddingKategori, setIsAddingKategori] = useState(false);
  const [newKategori, setNewKategori] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriResponse = await axios.get(
          "http://localhost/Backend/Admin/GetKategori.php"
        );
        if (kategoriResponse.status === 200) {
          setKategoriList(kategoriResponse.data);
        }

        const warnaResponse = await axios.get(
          "http://localhost/Backend/Admin/GetWarna.php"
        );
        if (warnaResponse.status === 200) {
          console.log("Warna data:", warnaResponse.data);
          setWarnaList(warnaResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Terjadi kesalahan saat memuat data.");
        setVariant("danger");
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setGambarProduk(e.target.files[0]);
  };

  const handleSizeChange = (sizeValue) => {
    if (sizes.includes(sizeValue)) {
      setSizes(sizes.filter((size) => size !== sizeValue));
      const newStok = { ...stok };
      delete newStok[sizeValue];
      setStok(newStok);

      const newSelectedWarna = { ...selectedWarna };
      delete newSelectedWarna[sizeValue];
      setSelectedWarna(newSelectedWarna);
    } else {
      setSizes([...sizes, sizeValue]);
      setStok({ ...stok, [sizeValue]: {} });
      setSelectedWarna({ ...selectedWarna, [sizeValue]: [] });
    }
  };

  const handleWarnaChange = (size, warnaId) => {
    const currentWarnaForSize = selectedWarna[size] || [];
    let newSelectedWarna;
    let newStok = { ...stok };

    if (currentWarnaForSize.includes(warnaId)) {
      newSelectedWarna = {
        ...selectedWarna,
        [size]: currentWarnaForSize.filter((id) => id !== warnaId),
      };
      delete newStok[size][warnaId];
    } else {
      newSelectedWarna = {
        ...selectedWarna,
        [size]: [...currentWarnaForSize, warnaId],
      };
      newStok[size] = { ...newStok[size], [warnaId]: 0 };
    }

    setSelectedWarna(newSelectedWarna);
    setStok(newStok);
  };

  const handleStockChange = (size, warnaId, value) => {
    setStok((prevStok) => ({
      ...prevStok,
      [size]: {
        ...prevStok[size],
        [warnaId]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !namaProduk ||
      !sizes.length ||
      !kategori ||
      !harga ||
      !gambarProduk ||
      !deskripsi
    ) {
      setMessage("Semua field harus diisi.");
      setVariant("danger");
      return;
    }

    const isValid = sizes.every((size) => selectedWarna[size]?.length > 0);
    if (!isValid) {
      setMessage("Setiap ukuran harus memiliki minimal satu warna.");
      setVariant("danger");
      return;
    }

    const formData = new FormData();
    formData.append("nama_produk", namaProduk);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("warna", JSON.stringify(selectedWarna));
    formData.append("kategori", kategori);
    formData.append("stocks", JSON.stringify(stok));
    formData.append("harga", harga);
    formData.append("gambar_produk", gambarProduk);
    formData.append("deskripsi", deskripsi);

    console.log("Data yang dikirim:");
    console.log("nama_produk:", namaProduk);
    console.log("sizes:", sizes);
    console.log("warna:", selectedWarna);
    console.log("kategori:", kategori);
    console.log("stocks:", stok);
    console.log("harga:", harga);
    console.log("deskripsi:", deskripsi);

    try {
      const response = await axios.post(
        "http://localhost/Backend/Admin/ProductInput.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response dari server:", response.data);

      if (response.status === 200) {
        setMessage("Produk berhasil ditambahkan!");
        setVariant("success");
        setNamaProduk("");
        setSizes([]);
        setSelectedWarna({});
        setKategori("");
        setStok({});
        setHarga("");
        setGambarProduk(null);
        setDeskripsi("");
      }
    } catch (error) {
      console.error("Error full response:", error.response);
      setMessage(
        error.response?.data?.error ||
          "Terjadi kesalahan saat menambahkan produk."
      );
      setVariant("danger");
    }
  };

  const handleAddKategori = async (e) => {
    if (e.key === "Enter" && newKategori.trim()) {
      try {
        const response = await axios.post(
          "http://localhost/Backend/Admin/AddKategori.php",
          {
            nama_kategori: newKategori.trim(),
          }
        );

        if (response.data.success) {
          // Refresh kategori list
          const kategoriResponse = await axios.get(
            "http://localhost/Backend/Admin/GetKategori.php"
          );
          setKategoriList(kategoriResponse.data);

          // Reset form
          setNewKategori("");
          setIsAddingKategori(false);
          setKategori(response.data.id_kategori); // Set kategori ke kategori baru
        } else {
          alert(response.data.message || "Gagal menambahkan kategori");
        }
      } catch (error) {
        console.error("Error adding kategori:", error);
        alert("Gagal menambahkan kategori");
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
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

                  <Form.Group className="mb-3">
                    <Form.Label className="label">Ukuran dan Warna</Form.Label>
                    {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <div key={size} className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
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
                        </div>

                        {sizes.includes(size) && (
                          <div className="ms-4 mt-2">
                            <div className="d-flex flex-wrap gap-3">
                              {warnaList &&
                                warnaList.map((warna) => (
                                  <div
                                    key={`${size}-${warna.id_warna}`}
                                    className="d-flex align-items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`warna-${size}-${warna.id_warna}`}
                                      checked={selectedWarna[size]?.includes(
                                        warna.id_warna
                                      )}
                                      onChange={() =>
                                        handleWarnaChange(size, warna.id_warna)
                                      }
                                      className="me-2"
                                    />
                                    <label
                                      htmlFor={`warna-${size}-${warna.id_warna}`}
                                      className="me-2"
                                      style={{ color: "black" }}
                                    >
                                      {warna.nama_warna}
                                    </label>
                                    {selectedWarna[size]?.includes(
                                      warna.id_warna
                                    ) && (
                                      <input
                                        type="number"
                                        min="0"
                                        placeholder="Stok"
                                        value={
                                          stok[size]?.[warna.id_warna] || ""
                                        }
                                        onChange={(e) =>
                                          handleStockChange(
                                            size,
                                            warna.id_warna,
                                            e.target.value
                                          )
                                        }
                                        style={{ width: "60px" }}
                                      />
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </Form.Group>

                  <Row>
                    <Form.Group className="mb-3" controlId="kategori">
                      <Form.Label className="label">Kategori</Form.Label>
                      {isAddingKategori ? (
                        <Form.Control
                          type="text"
                          placeholder="Ketik kategori baru dan tekan Enter"
                          value={newKategori}
                          onChange={(e) => setNewKategori(e.target.value)}
                          onKeyPress={handleAddKategori}
                          onBlur={() => {
                            if (!newKategori.trim()) {
                              setIsAddingKategori(false);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <Form.Control
                          as="select"
                          value={kategori}
                          onChange={(e) => {
                            if (e.target.value === "add_new") {
                              setIsAddingKategori(true);
                            } else {
                              setKategori(e.target.value);
                            }
                          }}
                        >
                          <option value="">Pilih Kategori</option>
                          {kategoriList.map((kat) => (
                            <option
                              key={kat.id_kategori}
                              value={kat.id_kategori}
                            >
                              {kat.nama_kategori}
                            </option>
                          ))}
                          <option value="add_new">+ Tambah Kategori</option>
                        </Form.Control>
                      )}
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
