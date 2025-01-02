import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsPerson, BsPencilSquare, BsBook } from "react-icons/bs";
import "../style/Homeadmin.css";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeAdmin = () => {
  return (
    <div className="homeadmin-page">
      <div className="homeadmin-wrapper">
        <Container className="container-homeadmin">
          <Row className="centerrow">
            <Col className="judul">
              <p>CHOIZ</p>
              <p className="subjudul">Admin</p>
            </Col>
            <Col>
              <Container className="kolom-button">
                <Link to="/listuser">
                  <Button className="button-admin">
                    <BsPerson
                      style={{
                        color: "#B88E2F",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <p> Edit Admin</p>
                  </Button>
                </Link>
                <Link to="/produk" style={{ textDecoration: "none" }}>
                  <Button className="button-admin">
                    <BsPencilSquare
                      style={{
                        color: "#B88E2F",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <p> Edit Product </p>
                  </Button>
                </Link>
                <Link to="/listarticle" style={{ textDecoration: "none" }}>
                  <Button className="button-admin">
                    <BsBook
                      style={{
                        color: "#B88E2F",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <p> Edit Article </p>
                  </Button>
                </Link>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default HomeAdmin;
