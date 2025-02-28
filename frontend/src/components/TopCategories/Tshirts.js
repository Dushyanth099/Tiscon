import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Tshirts.css";
import MenTshirtbanner from "../../assets/Tshirtsmenbanner.png";
import WomenenTshirtbanner from "../../assets/Tshirtswomenbanner.png";
import CardProduct from "../CardProduct";

const Tshirts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Get gender from URL
  const banners = {
    Men: {
      img: MenTshirtbanner,
      title: "Tshirts",
      subtitle: "Your everyday go-to",
    },
    Women: {
      img: WomenenTshirtbanner,
      title: "Trendy Tees",
      subtitle: "Stylish & Comfortable",
    },
  };

  // Get product list from Redux state (Assuming product list is stored in Redux)
  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  // Filter only T-Shirts from the product list (Show only 4)
  const tshirts = products
    .filter(
      (product) =>
        product.productdetails?.subcategory === "Shirts" &&
        product.productdetails?.gender === gender
    )
    .slice(0, 5);

  return (
    <div className="categor-container">
      {/* 📌 Banner Section */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Shirts`}
          className="banner-img"
        />
      </div>

      {/* 📌 Product List */}
      <div className="product-grid">
        {tshirts.length > 0 ? (
          tshirts.map((product) => (
            <CardProduct key={product._id} product={product} /> // ✅ Using CardProduct
          ))
        ) : (
          <p className="no-products">No Shirts available.</p>
        )}
      </div>
    </div>
  );
};

export default Tshirts;
