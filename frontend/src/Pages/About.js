import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  InputGroup,
  Form,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import bannershop from "../asset/Baju/bannershop.png";
import Footer from "../Component/Footer";
import { Link } from "react-router-dom";
import MyNavbar from "../Component/navbar";
import { useNavigate } from "react-router";
import axios from "axios";
import "../style/about.css";

const About = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Backend/Auth/getArticle.php"
        );
        if (response.data.status === "success") {
          setArticles(response.data.data);
          setFilteredArticles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const results = articles.filter(
      (article) =>
        article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="about">
      <div>
        <MyNavbar />
      </div>
      <div className="bannershop">
        <Image className="foto" src={bannershop} />
        <div className="tulisannya text-center">
          <h1 className="Headerbanner">About</h1>
          <h3 className="subheaderbanner"> Home &gt; Blogs</h3>
        </div>
      </div>
      <div>
        <Container className="kon-artikel">
          <Row>
            <Col md={8}>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card
                    key={article.id_artikel}
                    className="kontainerartikel mb-4"
                  >
                    {article.gambar && (
                      <Card.Img
                        variant="top"
                        src={`data:image/jpeg;base64,${article.gambar}`}
                      />
                    )}
                    <Card.Body className="kontenartikel">
                      <Card.Title className="judulartikel mb-3">
                        {article.judul}
                      </Card.Title>
                      <Card.Text className="deskripsiartikel mb-5">
                        {article.deskripsi}
                      </Card.Text>
                      <div className="article-meta mb-3">
                        <span>By {article.author}</span>
                        <span className="ms-3">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        <span className="ms-3">{article.kategori}</span>
                      </div>
                      <Link
                        to={`/article/${article.id_artikel}`}
                        className="tombolartikel btn btn-primary"
                      >
                        Read More
                      </Link>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="no-results">
                  <p>Tidak ada artikel yang sesuai dengan pencarian.</p>
                </div>
              )}
            </Col>
            <Col md={4}>
              <InputGroup
                className="mb-4"
                style={{
                  padding: "10px 10px",
                  border: "1px solid #9F9F9F",
                  borderRadius: "4px",
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{
                    width: "40%",
                    border: "none",
                    borderRadius: "4px 0 0 4px",
                  }}
                />
                <InputGroup.Text
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <BsSearch />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
      <section className="futernya">
        <Footer />
      </section>
    </div>
  );
};

export default About;
