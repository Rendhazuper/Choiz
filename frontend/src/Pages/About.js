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
import artikel1 from "../asset/artikel1.png";
import artikel2 from "../asset/artikel2.png";
import artikel3 from "../asset/artikel3.png";
import { useNavigate } from "react-router";
import axios from "axios";
import "../style/about.css";

const articles = [
  {
    id: 1,
    title: "Going all-in with casual style",
    author: "Penulis 1",
    date: "2024-12-14",
    category: "Kategori 1",
    description: "Deskripsi singkat artikel 1.",
    image: artikel1,
    link: "/article/1",
  },
  {
    id: 2,
    title: "Exploring new ways of fashion",
    author: "Penulis 2",
    date: "2024-12-13",
    category: "Kategori 2",
    description: "Deskripsi singkat artikel 2.",
    image: artikel2,
    link: "/article/2",
  },
  {
    id: 3,
    title: "Korean style these days",
    author: "Penulis 3",
    date: "2024-12-12",
    category: "Kategori 3",
    description: "Deskripsi singkat artikel 3.",
    image: artikel3,
    link: "/article/3",
  },
];

const About = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const checkLogin = async () => {
    try {
      // const response = await axios.get("http://lightcoral-rat-258584.hostingersite.com/Backend/Auth/cekLogin.php", {
      const response = await axios.get(
        "http://localhost/Backend/Auth/cekLogin.php",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error("Error checking login:", error);
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, [navigate]);
  return (
    <div className="about ">
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
              {articles.map((article) => (
                <Card key={article.id} className="kontainerartikel mb-4">
                  <Card.Img variant="top" src={article.image} />
                  <Card.Body className="kontenartikel">
                    <Card.Title className="judulartikel mb-3">
                      {article.title}
                    </Card.Title>
                    <Card.Text className="deskripsiartikel mb-5">
                      {article.description}
                    </Card.Text>
                    <Link
                      to={article.link}
                      className="tombolartikel btn btn-primary"
                    >
                      Read More
                    </Link>
                  </Card.Body>
                </Card>
              ))}
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
                  <BsSearch /> {/* Icon Search */}
                </InputGroup.Text>
              </InputGroup>

              <ul className="list-unstyled">
                <h4>Category</h4>
                <li>Casual</li>
                <li>Chic</li>
                <li>Preppy</li>
                <li>Skena</li>
                <li>Emo</li>
              </ul>
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
