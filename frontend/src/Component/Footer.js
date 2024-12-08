import React from 'react';
import { Col, Row, Container} from 'react-bootstrap';
import './Footer.css';


const Footer = () =>  {
    return(
        <Container className='kontainer text-start'>
            <Row>
                <Col>
                <p className='Judul'> Choiz </p>
                </Col>
                <Col>
                <ul>
                    <li>
                        Links
                    </li>
                    <li>
                        Home
                    </li>
                    <li>
                        Shop
                    </li>
                    <li>
                        About
                    </li>
                    <li>
                        Contact
                    </li>
                </ul>
                </Col>
                <Col>
                    {/* Form Input Email dan tombol "Enter" */}
                    <form>
                        <p className='newsletter text-start'>Newsletter</p>
                    <div className="input-group">
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        aria-label="Email"
                        aria-describedby="button-addon2"
                        />
                        <button
                        className="btn btn-primary"
                        type="submit"
                        id="button-addon2"
                        >
                        Enter
                        </button>
                    </div>
                    </form>
                </Col>
            </Row>
            <Row>
                <p className='copyrait text-start'>2024 Choiz</p>

            </Row>
        </Container>
    )
}

export default Footer;