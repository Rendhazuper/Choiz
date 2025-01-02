import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminNavbar from "../Component/navbaradmin";
import axios from "axios";
import "../style/listarticle.css";

const ListArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Backend/Auth/getArticle.php"
        );
        if (response.data.status === "success") {
          setArticles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const response = await axios.get(
          `http://localhost/Backend/Admin/deleteArticle.php?id=${id}`
        );

        if (response.data.status === "success") {
          // Refresh artikel list setelah delete
          const updatedArticles = articles.filter(
            (article) => article.id_artikel !== id
          );
          setArticles(updatedArticles);
          alert("Article deleted successfully");
        } else {
          throw new Error(response.data.message || "Failed to delete article");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        alert(error.message || "Error deleting article");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listarticle-page">
      <AdminNavbar />

      <Container className="mt-4">
        <div className="button-container">
          <Link to="/articleinput">
            <Button className="button-add">
              <p>Input Article</p>
            </Button>
          </Link>
        </div>

        <Row>
          <Col xs={12}>
            {articles.map((article) => (
              <Card key={article.id_artikel} className="article-card mb-4">
                <Card.Body className="article-body">
                  <Card.Title className="article-title">
                    {article.judul}
                  </Card.Title>
                  <Card.Text className="article-desc">
                    {article.deskripsi}
                  </Card.Text>
                  <div className="article-meta mb-3">
                    <span>By {article.author}</span>
                    <span className="ms-3">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="ms-3">{article.kategori}</span>
                  </div>
                  <div className="article-actions">
                    <Link
                      to={`/article/${article.id_artikel}`}
                      className="btn btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-article/${article.id_artikel}`}
                      className="btn btn-outline-warning me-2"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(article.id_artikel)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ListArticle;
