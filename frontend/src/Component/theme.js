import React from 'react';
import './theme.css';
import { Container, Row, Col, Image} from 'react-bootstrap';
import skena from '../asset/Baju/Skena.png';
import casual from '../asset/Baju/Casual.png';
import chic from '../asset/Baju/Chic.png';

import 'bootstrap/dist/css/bootstrap.min.css';

const Theme = () => {
    return(
        <Container>
        <h1 className="text-center mb-4">Browse Your Outfit Theme</h1>
        <p className="sub text-center mb-5">Find outfit theme these days</p>
        <Row className="justify-content-center">
          <Col md={3} className="mb-4">
            <Image src={skena} fluid rounded />
            <p className="text-center mt-2">Skena</p>
          </Col>
          <Col md={3} className="mb-4">
            <Image src={casual} fluid rounded />
            <p className="text-center mt-2">Casual</p>
          </Col>
          <Col md={3} className="mb-4">
            <Image src={chic} fluid rounded />
            <p className="text-center mt-2">Chic</p>
          </Col>
        </Row>
      </Container>
    );
}

export default Theme;