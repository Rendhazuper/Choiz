import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "../Component/navbaradmin";
import "../style/listuser.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Listpembelian = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = () => {
    axios
      .get("http://localhost/Backend/Admin/getpurchases.php")
      .then((response) => {
        if (response.data.status === "success") {
          setPurchases(response.data.data);
        } else {
          console.error("No purchase history found");
        }
      })
      .catch((error) => {
        console.error("Error fetching purchase data:", error);
      });
  };

  return (
    <div>
      <div>
        <AdminNavbar />
        <Container>
          <div className="kontainer-headerlistadmin">
            <h1>Pembelian</h1>
          </div>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th></th>
                    <th>Nama Pembeli</th>
                    <th>Ukuran</th>
                    <th>Warna</th>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                    <th>Alamat</th>
                    <th>Tanggal Pembelian</th>
                  </tr>
                </thead>
                <tbody className="body-listadmin">
                  {purchases.length > 0 ? (
                    purchases.map((purchase, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={purchase.gambar_produk}
                            alt={purchase.nama_produk}
                            style={{ width: "100px", height: "auto" }}
                          />
                        </td>
                        <td>{purchase.nama_produk}</td>
                        <td>{purchase.username}</td>
                        <td>{purchase.size}</td>
                        <td>{purchase.nama_warna}</td>
                        <td>{purchase.jumlah}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(purchase.total_harga)}
                        </td>
                        <td>{purchase.alamat}</td>
                        <td>
                          {new Date(
                            purchase.tanggal_transaksi
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No purchase history available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Listpembelian;
