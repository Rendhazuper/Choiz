import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Image,
  Collapse,
  Button,
} from "react-bootstrap";
import { BsGrid, BsViewList } from "react-icons/bs";
import MyNavbar from "../Component/navbar";
import bannershop from "../asset/Baju/bannershop.png";
import ProductGrid from "../Component/productgrid";
import Footer from "../Component/Footer";
import { useNavigate } from "react-router";
import axios from "axios";
import "../style/shop.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Shop = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [open, setOpen] = useState(false);

  const checkLogin = async () => {
    try {
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
    fetchTotalProducts();
    fetchCategories();
  }, [navigate]);

  const fetchTotalProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Backend/Auth/getproduct.php"
      );
      setTotalProducts(response.data.length);
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Backend/Admin/GetKategori.php"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleItemsToShowChange = (number) => {
    console.log("Changing items to show:", number);
    setItemsToShow(number);
  };

  const handleSortChange = (sortOption) => {
    console.log("Changing sort option:", sortOption);
    setSortBy(sortOption);
  };

  const handleCategoryChange = (category) => {
    console.log("Changing category:", category);
    setSelectedCategory(category.toString());
  };

  const handleGrid = () => {
    setShowGrid(true);
  };

  const handleList = () => {
    setShowGrid(false);
  };

  const getSortLabel = (sortOption) => {
    switch (sortOption) {
      case "price_asc":
        return "Price: Low to High";
      case "price_desc":
        return "Price: High to Low";
      default:
        return "Default";
    }
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === "default") return "All Categories";
    const category = categories.find(
      (cat) => cat.id_kategori.toString() === categoryId.toString()
    );
    return category ? category.nama_kategori : "All Categories";
  };

  const buttonStyle = {
    backgroundColor: "#b88e2f",
    color: "white",
    border: "2px solid #b88e2f",
    padding: "10px 20px",
    margin: "5px",
    transition: "all 0.3s ease",
  };

  return (
    <div className="shop">
      <MyNavbar />
      <div className="bannershop">
        <Image className="foto" src={bannershop} />
        <div className="tulisanbanner text-center">
          <h1 className="Headerbanner">Shop</h1>
          <h3 className="subheaderbanner"> Home &gt; Shop</h3>
        </div>
      </div>
      <div className="filtershop">
        <div fluid className="kontainerr">
          <div className="kolomkiri">
            <p
              className="showing-results"
              style={{ textAlign: "center", width: "100%" }}
            >
              Showing {Math.min(itemsToShow, totalProducts)} of {totalProducts}{" "}
              results
            </p>
          </div>
          <div className="Dropdown kolomkanan">
            <div className="desktop-filter d-none d-md-flex align-items-center justify-content-end">
              <Dropdown className="drop1 me-3">
                <p className="me-2">Show</p>
                <Dropdown.Toggle className="Toggle" id="dropdown-show">
                  {itemsToShow}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {[8, 12, 16].map((number) => (
                    <Dropdown.Item
                      key={number}
                      onClick={() => handleItemsToShowChange(number)}
                    >
                      {number}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="drop1 me-3">
                <p className="me-2">Sort By</p>
                <Dropdown.Toggle className="Toggle" id="dropdown-sort">
                  {getSortLabel(sortBy)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSortChange("default")}>
                    Default
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange("price_asc")}>
                    Price: Low to High
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange("price_desc")}>
                    Price: High to Low
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="drop1 me-3">
                <p className="me-2">Category</p>
                <Dropdown.Toggle className="Toggle" id="dropdown-category">
                  {getCategoryName(selectedCategory)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleCategoryChange("default")}
                  >
                    All Categories
                  </Dropdown.Item>
                  {categories.map((category) => (
                    <Dropdown.Item
                      key={category.id_kategori}
                      onClick={() =>
                        handleCategoryChange(category.id_kategori.toString())
                      }
                    >
                      {category.nama_kategori}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Filter untuk mobile */}
            <div className="mobile-filter d-md-none  mobile-filter-container">
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="filter-collapse"
                aria-expanded={open}
                className="w-100 mb-3 filter-toggle-btn"
              >
                Filter & Sort
              </Button>
              <Collapse in={open}>
                <div id="filter-collapse" className="mobile-filter-content">
                  <div className="filter-section mb-3">
                    <h5>Show</h5>
                    <div className="d-flex flex-wrap">
                      {[8, 12, 16].map((number) => (
                        <Button
                          key={number}
                          variant={
                            itemsToShow === number
                              ? "primary"
                              : "outline-primary"
                          }
                          className="me-2 mb-2"
                          onClick={() => handleItemsToShowChange(number)}
                          style={{
                            ...buttonStyle,
                            backgroundColor:
                              itemsToShow === number ? "#b88e2f" : "white",
                            color: itemsToShow === number ? "white" : "#b88e2f",
                          }}
                        >
                          {number}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section mb-3">
                    <h5>Sort By</h5>
                    <div className="d-flex flex-wrap">
                      {["default", "price_asc", "price_desc"].map((option) => (
                        <Button
                          key={option}
                          variant={
                            sortBy === option ? "primary" : "outline-primary"
                          }
                          className="me-2 mb-2"
                          onClick={() => handleSortChange(option)}
                          style={{
                            ...buttonStyle,
                            backgroundColor:
                              sortBy === option ? "#b88e2f" : "white",
                            color: sortBy === option ? "white" : "#b88e2f",
                          }}
                        >
                          {option === "default" && "Default"}
                          {option === "price_asc" && "Price: Low to High"}
                          {option === "price_desc" && "Price: High to Low"}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section mb-3">
                    <h5>Category</h5>
                    <div className="d-flex flex-wrap">
                      <Button
                        variant={
                          selectedCategory === "default"
                            ? "primary"
                            : "outline-primary"
                        }
                        className="me-2 mb-2"
                        onClick={() => handleCategoryChange("default")}
                        style={{
                          ...buttonStyle,
                          backgroundColor:
                            selectedCategory === "default"
                              ? "#b88e2f"
                              : "white",
                          color:
                            selectedCategory === "default"
                              ? "white"
                              : "#b88e2f",
                        }}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id_kategori}
                          variant={
                            selectedCategory === category.id_kategori.toString()
                              ? "primary"
                              : "outline-primary"
                          }
                          className="me-2 mb-2"
                          onClick={() =>
                            handleCategoryChange(
                              category.id_kategori.toString()
                            )
                          }
                          style={{
                            ...buttonStyle,
                            backgroundColor:
                              selectedCategory ===
                              category.id_kategori.toString()
                                ? "#b88e2f"
                                : "white",
                            color:
                              selectedCategory ===
                              category.id_kategori.toString()
                                ? "white"
                                : "#b88e2f",
                          }}
                        >
                          {category.nama_kategori}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>

      <section>
        <ProductGrid
          showGrid={showGrid}
          itemsToShow={itemsToShow}
          sortBy={sortBy}
          categoryFilter={selectedCategory}
          isAdmin={false}
        />
      </section>
      <section className="futer">
        <Footer />
      </section>
    </div>
  );
};

export default Shop;
