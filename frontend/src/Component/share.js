import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import terakhir from "../asset/Baju/terakhir.png";
import "./share.css";

const Share = () => {
  return (
    <div>
      <p className="atas text-center mb-3">Share your outfit with</p>
      <h1 className="bawah text-center mb-5">#Choiz</h1>
      <Image className="terakhir" src={terakhir} />
    </div>
  );
};

export default Share;
