import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "../Component/navbaradmin";
import "../style/listpembelian.css";
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
      <AdminNavbar />
      <Container>
        <div className="purchase-header-container">
          <h1>Purchase History</h1>
        </div>
        <Table className="purchase-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th></th>
              <th>Pembeli</th>
              <th>Ukuran</th>
              <th>Warna</th>
              <th>Jumlah</th>
              <th>Total Harga</th>
              <th>Alamat</th>
              <th>Tanggal Pembelian</th>
            </tr>
          </thead>
          <tbody className="purchase-table-body">
            {purchases.length > 0 ? (
              purchases.map((purchase, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={purchase.gambar_produk}
                      alt={purchase.nama_produk}
                      className="purchase-product-image"
                    />
                  </td>
                  <td data-label="Produk">{purchase.nama_produk}</td>
                  <td data-label="Pembeli">{purchase.username}</td>
                  <td data-label="Ukuran">{purchase.size}</td>
                  <td data-label="Warna">{purchase.nama_warna}</td>
                  <td data-label="Jumlah">{purchase.jumlah}</td>
                  <td data-label="Total Harga">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(purchase.total_harga)}
                  </td>
                  <td data-label="Alamat">{purchase.alamat}</td>
                  <td data-label="Tanggal Pembelian">
                    {new Date(purchase.tanggal_transaksi).toLocaleDateString()}
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
      </Container>
    </div>
  );
};

export default Listpembelian;
