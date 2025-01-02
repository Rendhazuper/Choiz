import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminNavbar from "../Component/navbaradmin";
import axios from "axios";
import "../style/register.css";

const ArticleInput = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [author, setAuthor] = useState("");
  const [kategori, setKategori] = useState("");
  const [konten, setKonten] = useState("");
  const [gambarArtikel, setGambarArtikel] = useState(null);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  // Mengambil nama admin dari session storage saat komponen dimount
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    console.log("Admin data from session:", username); // Debug
    if (username) {
      setAuthor(username);
    } else {
      console.log("No admin data found"); // Debug
    }
  }, []);

  // Konfigurasi untuk React-Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  const handleFileChange = (e) => {
    setGambarArtikel(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug untuk melihat nilai setiap field
    console.log("Form values:", {
      judul,
      deskripsi,
      author,
      kategori,
      konten,
      gambarArtikel,
    });

    // Validasi form
    if (
      !judul.trim() ||
      !deskripsi.trim() ||
      !author ||
      !kategori ||
      !konten.trim() ||
      !gambarArtikel
    ) {
      setMessage("Semua field harus diisi termasuk gambar artikel.");
      setVariant("danger");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("judul", judul.trim());
      formData.append("deskripsi", deskripsi.trim());
      formData.append("author", author);
      formData.append("kategori", kategori);
      formData.append("konten", konten.trim());
      formData.append("gambar_artikel", gambarArtikel);
      formData.append("date", new Date().toISOString().split("T")[0]);

      console.log("Data yang akan dikirim:", Object.fromEntries(formData));

      const response = await axios.post(
        "http://localhost/Backend/Admin/AddArticle.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response dari server:", response.data);

      if (response.data.status === "success") {
        setMessage("Artikel berhasil ditambahkan!");
        setVariant("success");
        // Reset form kecuali author
        setJudul("");
        setDeskripsi("");
        setKategori("");
        setKonten("");
        setGambarArtikel(null);
      } else {
        throw new Error(response.data.message || "Gagal menambahkan artikel");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menambahkan artikel."
      );
      setVariant("danger");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="register relative justify-center items-center min-h-screen">
        <Container>
          <Row>
            <Col>
              <Container className="kolom">
                <Row>
                  <h1>Input Article</h1>
                </Row>
                {message && (
                  <Row>
                    <Alert variant={variant}>{message}</Alert>
                  </Row>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Judul Artikel</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Masukkan judul artikel"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">
                        Deskripsi Singkat
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Masukkan deskripsi singkat artikel"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Penulis</Form.Label>
                      <Form.Control
                        type="text"
                        value={`${author}`}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Kategori</Form.Label>
                      <Form.Control
                        as="select"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="Casual">Casual</option>
                        <option value="Chic">Chic</option>
                        <option value="Preppy">Preppy</option>
                        <option value="Skena">Skena</option>
                        <option value="Emo">Emo</option>
                      </Form.Control>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Gambar Artikel</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Konten Artikel</Form.Label>
                      <ReactQuill
                        theme="snow"
                        value={konten}
                        onChange={setKonten}
                        modules={modules}
                        formats={formats}
                        style={{
                          height: "300px",
                          marginBottom: "50px",
                          backgroundColor: "white",
                        }}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Button className="Button" type="submit">
                      Tambah Artikel
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

export default ArticleInput;
