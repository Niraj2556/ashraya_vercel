// Header.jsx
// import logo from "../logo.png";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./Header.css";
import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Header = (props) => {
  const [loc, setLoc] = useState("");
  const [showOver, setShowOver] = useState(false);

  const handleSearch = (e) => {
    props.handlesearch(e.target.value);
  };
  const handleClick = () => {
    props.handleclick();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    props.handleLogout();
  };
  const handleHomeClick = () => {
    if (props.handleHomeClick) {
      props.handleHomeClick();
    }
  };
  let locations = [
    {
      lattitude: 28.6139,
      longitude: 77.209,
      placeName: "Connaught Place, New Delhi",
    },
    {
      lattitude: 28.5562,
      longitude: 77.1,
      placeName: "Indira Gandhi International Airport, Delhi",
    },
    {
      lattitude: 28.6129,
      longitude: 77.2295,
      placeName: "India Gate, New Delhi",
    },
    {
      lattitude: 28.5245,
      longitude: 77.1855,
      placeName: "Qutub Minar, Delhi",
    },
    {
      lattitude: 28.7041,
      longitude: 77.1025,
      placeName: "Karol Bagh, Delhi",
    },
    {
      lattitude: 28.4089,
      longitude: 77.3178,
      placeName: "Faridabad, Haryana",
    },
    {
      lattitude: 28.4595,
      longitude: 77.0266,
      placeName: "Gurgaon, Haryana",
    },
    {
      lattitude: 28.9845,
      longitude: 77.7064,
      placeName: "Meerut, UP",
    },
    {
      lattitude: 28.6692,
      longitude: 77.4538,
      placeName: "Ghaziabad, UP",
    },
    {
      lattitude: 28.5355,
      longitude: 77.391,
      placeName: "Noida, UP",
    },
    {
      lattitude: 26.8467,
      longitude: 80.9462,
      placeName: "Lucknow, UP",
    },
  ];

  return (
    <div
      className="header-container header"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(15px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div className="main-header">
        <Link
          className="links"
          to="/"
          onClick={handleHomeClick}
          style={{
            fontSize: "18px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
          }}
        >
          🏠 AASHRAYA
        </Link>

        <select
          className="loc-search"
          value={loc}
          onChange={(e) => {
            localStorage.setItem("userLoc", e.target.value);
            setLoc(e.target.value);
            props.handleclick();
          }}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            background: "#fafbfc",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <option value="">Select Location</option>
          {locations.map((item, index) => {
            return (
              <option key={index} value={`${item.lattitude},${item.longitude}`}>
                {item.placeName}
              </option>
            );
          })}
        </select>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fafbfc",
            borderRadius: "16px",
            border: "2px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            value={props && props.search}
            onChange={handleSearch}
            onKeyPress={(e) => e.key === "Enter" && handleClick()}
            placeholder="Search via College Name"
            className="search"
            style={{
              border: "none",
              background: "transparent",
              padding: "12px 16px",
              fontSize: "14px",
              outline: "none",
              flex: 1,
            }}
          />
          <button
            className="search-btn"
            onClick={handleClick}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              padding: "12px 16px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="logout ">
        <div
          onClick={() => {
            setShowOver(!showOver);
          }}
          style={{
            marginRight: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(248, 250, 252, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid #d1d5db",
            color: "#667eea",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CgProfile className="prof-icon" />
        </div>

        {showOver &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "2147483647",
                pointerEvents: "none",
                backgroundColor: "transparent",
              }}
              onClick={() => setShowOver(false)}
            >
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  right: "40px",
                  width: "200px",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                  border: "1px solid #e5e7eb",
                  padding: "16px",
                  pointerEvents: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {localStorage.getItem("token") && (
                  <>
                    <Link to="/add-product" style={{ textDecoration: "none" }}>
                      <button
                        className="add-btn mr-3"
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        🏠 ADD ROOM
                      </button>
                    </Link>
                    <Link
                      to="/liked-product"
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className="add-btn mr-3"
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          background: "#f8fafc",
                          color: "#667eea",
                          border: "1px solid #e2e8f0",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        ❤️ WISHLIST
                      </button>
                    </Link>
                    <Link to="/my-product" style={{ textDecoration: "none" }}>
                      <button
                        className="add-btn mr-3"
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          background: "#f8fafc",
                          color: "#667eea",
                          border: "1px solid #e2e8f0",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        📋 MY ROOMS
                      </button>
                    </Link>
                    <Link to="/my-profile" style={{ textDecoration: "none" }}>
                      <button
                        className="add-btn mr-3"
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          background: "#f8fafc",
                          color: "#667eea",
                          border: "1px solid #e2e8f0",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        👤 PROFILE
                      </button>
                    </Link>
                  </>
                )}
                {!localStorage.getItem("token") ? (
                  <Link to="/login">
                    <button className="login-btn" style={{ width: "100%" }}>
                      Login
                    </button>
                  </Link>
                ) : (
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                    style={{ width: "100%" }}
                  >
                    LOGOUT <IoIosLogOut className="icon" />
                  </button>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default Header;
