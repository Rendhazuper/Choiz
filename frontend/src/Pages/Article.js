import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import MyNavbar from "../Component/navbar";
import axios from "axios";
import "../style/article.css";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost/Backend/Auth/getArticle.php?id=${id}`
        );

        if (response.data.status === "success") {
          console.log("Article data:", response.data.data);
          setArticle(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch article");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  console.log(
    "Image data:",
    article.gambar ? article.gambar.substring(0, 100) : "No image"
  );

  return (
    <div className="article-page">
      <MyNavbar />

      <Container className="article-container">
        <Row>
          <Col lg={12}>
            <div className="article-header">
              <h1>{article.judul}</h1>
              <div className="article-meta">
                <span>By {article.author}</span>
                <span className="date">
                  {new Date(article.date).toLocaleDateString()}
                </span>
                <span className="kategori">{article.kategori}</span>
              </div>
            </div>

            <div className="article-featured-image">
              {article.gambar && (
                <Image
                  src={`data:image/jpeg;base64,${article.gambar}`}
                  fluid
                  alt={article.judul}
                  onError={(e) => {
                    console.error("Error loading image");
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.konten }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Article;
