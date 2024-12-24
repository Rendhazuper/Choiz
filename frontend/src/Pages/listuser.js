import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "../Component/navbaradmin";
import "../style/listuser.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Listuser = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/Backend/Admin/getuser.php")
      .then((response) => {
        if (response.data.status === "success") {
          setAdmins(response.data.data);
        } else {
          console.error("No admin users found");
        }
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  }, []);

  return (
    <div>
      <div>
        <AdminNavbar />
        <Container>
          <div className="kontainer-headerlistadmin">
            <h1>List Admin</h1>
            <Link to="/regisadmin">
              <Button className="button-tambahadmin">Admin Baru</Button>
            </Link>
          </div>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody className="body-listadmin">
                  {admins.length > 0 ? (
                    admins.map((admin, index) => (
                      <tr key={index}>
                        <td>{admin.email}</td>
                        <td>{admin.username}</td>
                        <td>{admin.password}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No data available</td>
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
export default Listuser;
