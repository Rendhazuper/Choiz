import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../Component/navbaradmin";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [author, setAuthor] = useState("");
  const [kategori, setKategori] = useState("");
  const [konten, setKonten] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost/Backend/Auth/getArticle.php?id=${id}`
        );

        if (response.data.status === "success") {
          const article = response.data.data;
          setJudul(article.judul);
          setDeskripsi(article.deskripsi);
          setAuthor(article.author);
          setKategori(article.kategori);
          setKonten(article.konten);
          setCurrentImage(article.gambar);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setMessage("Error loading article data");
        setVariant("danger");
      }
    };

    fetchArticle();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id_artikel", id);
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      formData.append("author", author);
      formData.append("kategori", kategori);
      formData.append("konten", konten);

      if (newImage) {
        formData.append("gambar_artikel", newImage);
      }

      const response = await axios.post(
        "http://localhost/Backend/Admin/UpdateArticle.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Article updated successfully!");
        setVariant("success");
        setTimeout(() => {
          navigate("/listarticle");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      setMessage(error.message || "Error updating article");
      setVariant("danger");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="edit-article relative justify-center items-center min-h-screen">
        <Container>
          <Row>
            <Col>
              <Container className="kolom">
                <Row>
                  <h1>Edit Article</h1>
                </Row>
                {message && (
                  <Row>
                    <Alert variant={variant}>{message}</Alert>
                  </Row>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Judul</Form.Label>
                      <Form.Control
                        type="text"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Deskripsi</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Kategori</Form.Label>
                      <Form.Select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="Casual">Casual</option>
                        <option value="Chic">Chic</option>
                        <option value="Preppy">Preppy</option>
                        <option value="Skena">Skena</option>
                        <option value="Emo">Emo</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Image</Form.Label>
                      {currentImage && (
                        <div className="current-image mb-2">
                          <img
                            src={`data:image/jpeg;base64,${currentImage}`}
                            alt="Current"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Konten</Form.Label>
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
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#b88e2f",
                        border: "none",
                      }}
                    >
                      Update Article
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

export default EditArticle;
